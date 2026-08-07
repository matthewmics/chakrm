/**
 * Environment reads for auth, in one place. Deliberately plain `process.env`
 * rather than @nestjs/config — main.ts already reads PORT and CORS_ORIGINS the
 * same way, and a config module would be the only consumer.
 */

/** Name of the session cookie carrying the JWT. */
export const AUTH_COOKIE_NAME = 'access_token';

/**
 * Scoped to the parent of every *.chakrm.local host so web, admin and the API
 * share one cookie. Cookies ignore ports but not hosts, so a browser at
 * localhost:3000 will not send this — use http://chakrm.local.
 */
export const AUTH_COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN || undefined;

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

/** Where the Google handoff redirects the browser back to. */
export const WEB_APP_URL = process.env.WEB_APP_URL ?? 'http://chakrm.local';

/**
 * Throws at boot rather than signing tokens with a fallback secret — a silently
 * defaulted signing key is the kind of thing that reaches production intact.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET is not set. Add it to the api service environment in docker-compose.yml.',
    );
  }

  return secret;
}

/**
 * Google is optional: the API boots fine without credentials, and the strategy
 * simply isn't registered. Lets the rest of auth work before anyone has been
 * through the Cloud Console setup.
 */
export function getGoogleConfig(): {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
} | null {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) return null;

  return {
    clientID,
    clientSecret,
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL ??
      'http://localhost:3001/api/auth/google/callback',
  };
}

const SECONDS_PER_UNIT: Record<string, number> = {
  s: 1,
  m: 60,
  h: 3_600,
  d: 86_400,
};

const DEFAULT_EXPIRES_SECONDS = 7 * 86_400;

/**
 * Parsed to a plain number of seconds rather than passed through as "7d".
 * jsonwebtoken accepts either, but its typed string form is a template literal
 * that a `string` from the environment can't satisfy — and the cookie's maxAge
 * needs a number regardless. One parse keeps the token and the cookie from
 * drifting apart.
 */
export function jwtExpiresInSeconds(): number {
  const match = /^(\d+)([smhd])?$/.exec(JWT_EXPIRES_IN.trim());
  if (!match) return DEFAULT_EXPIRES_SECONDS;

  return Number(match[1]) * (SECONDS_PER_UNIT[match[2] ?? 's'] ?? 1);
}
