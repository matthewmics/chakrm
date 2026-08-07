import type { CookieOptions, Response } from 'express';
import {
  AUTH_COOKIE_DOMAIN,
  AUTH_COOKIE_NAME,
  jwtExpiresInSeconds,
} from './auth.config';

/**
 * `secure` is off in development because local dev runs over plain http through
 * Traefik; a secure cookie would simply never be stored. sameSite stays 'lax'
 * rather than 'none' because chakrm.local and api.chakrm.local share a
 * registrable domain — .local is not on the Public Suffix List, so the browser
 * treats them as same-site and no HTTPS-only 'none' is needed.
 */
function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain: AUTH_COOKIE_DOMAIN,
    path: '/',
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...cookieOptions(),
    // express wants milliseconds; the cookie is set to outlive the token by
    // nothing, so a stale cookie and an expired token disappear together.
    maxAge: jwtExpiresInSeconds() * 1000,
  });
}

/**
 * Cleared with the same domain/path/sameSite it was set with — a mismatch on
 * any of those leaves the original cookie in place and the user still signed in.
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions());
}
