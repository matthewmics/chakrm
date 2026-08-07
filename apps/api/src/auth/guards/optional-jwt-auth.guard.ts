import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '../../generated/prisma/client';

/**
 * Attaches the user when a valid cookie is present and lets the request through
 * either way. For endpoints that are public but richer when signed in — the
 * event list could mark which markets you already predicted on, without
 * shutting guests out.
 *
 * Not used yet; the guest-readable endpoints currently need no user at all.
 * Here because the alternative — a global guard with @Public() opt-outs — makes
 * a new public endpoint private by default, which is backwards for this app.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  /** Swallows the error passport raises for an absent or invalid token. */
  handleRequest<TUser = User | null>(_err: unknown, user: TUser): TUser {
    return user || (null as TUser);
  }
}
