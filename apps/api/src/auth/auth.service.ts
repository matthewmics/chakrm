import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from '@node-rs/argon2';
import { randomBytes, randomUUID } from 'node:crypto';
import type { User } from '../generated/prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

export type JwtPayload = { sub: string };

/** Profile fields the Google strategy hands over, provider-agnostic on purpose. */
export type GoogleProfile = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  avatarUrl: string | null;
};

/**
 * A Google callback lands on a different origin than the web app (see
 * _tasks/auth-task.md 0.3), so it cannot set the session cookie itself. It
 * mints one of these instead and the web app trades it in from the right origin.
 *
 * In-memory is fine for a single dev container. Production runs more than one
 * process, so this needs shared storage (Redis) before it ships.
 */
type HandoffCode = { userId: string; expiresAt: number };

const HANDOFF_TTL_MS = 60_000;

@Injectable()
export class AuthService {
  private readonly handoffCodes = new Map<string, HandoffCode>();

  /**
   * A real hash to verify against when no account matched, so a failed login
   * costs the same time whether the email exists or not. Without it, "unknown
   * email" returns noticeably faster than "wrong password" and the endpoint
   * becomes a user-enumeration oracle.
   */
  private readonly decoyHash: Promise<string>;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.decoyHash = hash(randomBytes(32).toString('hex'));
  }

  async register(dto: RegisterDto): Promise<User> {
    const email = normaliseEmail(dto.email);

    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException('An account with that email already exists');
    }

    return this.usersService.create({
      email,
      name: dto.name,
      passwordHash: await hash(dto.password),
    });
  }

  /**
   * Every failure path returns the same message. Distinguishing "no such user"
   * from "wrong password" from "this is a Google account" would confirm which
   * emails are registered.
   */
  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(normaliseEmail(email));
    const failure = new UnauthorizedException('Incorrect email or password');

    // Runs even when there is no user, or the user has no password, so all
    // three paths do the same amount of work.
    const matches = await verify(
      user?.passwordHash ?? (await this.decoyHash),
      password,
    ).catch(() => false);

    if (!user || !user.passwordHash || !matches) throw failure;

    return user;
  }

  /**
   * Resolution order matters. Matching on googleId first means a user who
   * changed their Google email still lands on their existing account.
   */
  async findOrCreateGoogleUser(profile: GoogleProfile): Promise<User> {
    const byGoogleId = await this.usersService.findByGoogleId(profile.googleId);
    if (byGoogleId) return byGoogleId;

    const email = normaliseEmail(profile.email);
    const byEmail = await this.usersService.findByEmail(email);

    if (byEmail) {
      // Linking on an unverified email would let anyone who can create a Google
      // account with someone else's address take over that account.
      if (!profile.emailVerified) {
        throw new UnauthorizedException(
          'Your Google email is not verified, so it cannot be linked to an existing account',
        );
      }

      return this.usersService.update(byEmail.id, {
        googleId: profile.googleId,
        // Only fills gaps — a name or avatar the user already set locally wins.
        avatarUrl: byEmail.avatarUrl ?? profile.avatarUrl,
        name: byEmail.name ?? profile.name,
      });
    }

    return this.usersService.create({
      email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      googleId: profile.googleId,
      // No password: this account signs in through Google until it sets one.
      passwordHash: null,
    });
  }

  /**
   * Carries only the user id. Everything else is read fresh per request, so a
   * credit change or a soft-delete takes effect immediately instead of at token
   * expiry.
   */
  signToken(user: User): string {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
  }

  createHandoffCode(userId: string): string {
    this.pruneHandoffCodes();

    const code = randomUUID();
    this.handoffCodes.set(code, {
      userId,
      expiresAt: Date.now() + HANDOFF_TTL_MS,
    });

    return code;
  }

  /** Single use: the code is consumed whether or not it turns out to be valid. */
  async redeemHandoffCode(code: string): Promise<User> {
    const entry = this.handoffCodes.get(code);
    this.handoffCodes.delete(code);

    if (!entry || entry.expiresAt < Date.now()) {
      throw new UnauthorizedException('Sign-in link is invalid or has expired');
    }

    const user = await this.usersService.findById(entry.userId);
    if (!user)
      throw new UnauthorizedException('Account is no longer available');

    return user;
  }

  /** Abandoned codes are never redeemed, so nothing else would evict them. */
  private pruneHandoffCodes(): void {
    const now = Date.now();

    for (const [code, entry] of this.handoffCodes) {
      if (entry.expiresAt < now) this.handoffCodes.delete(code);
    }
  }
}

/**
 * Emails are matched case-insensitively by lowercasing on write and on lookup.
 * The unique index is plain, so skipping this would let Demo@ and demo@ both
 * register.
 */
function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}
