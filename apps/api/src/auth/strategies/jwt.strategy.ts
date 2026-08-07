import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import type { User } from '../../generated/prisma/client';
import { AUTH_COOKIE_NAME, getJwtSecret } from '../auth.config';
import type { JwtPayload } from '../auth.service';
import { UsersService } from '../../users/users.service';

/**
 * The token lives in an httpOnly cookie, not an Authorization header, so it is
 * unreachable from JavaScript and immune to XSS exfiltration. Requires
 * cookie-parser to be registered in main.ts before this runs.
 */
function cookieExtractor(req: Request): string | null {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.[AUTH_COOKIE_NAME] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  /**
   * Re-reads the user on every request rather than trusting the token's claims.
   * Costs a query, but means a deleted account or a changed credit balance
   * takes effect immediately instead of whenever the token happens to expire.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    // Covers a token that is still cryptographically valid but whose user has
    // since been soft-deleted — findById already filters deletedAt.
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
