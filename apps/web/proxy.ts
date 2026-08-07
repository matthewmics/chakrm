import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 renamed the `middleware` convention to `proxy` — same request hook,
 * new filename and export name.
 */

/**
 * Routes a guest has no use for. Everything else — the home page, the event
 * list, individual events — stays public, which is the whole point of the
 * guest-browsing work.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/predictions",
  "/wallet",
  "/profile",
  "/settings",
];

/** Signing in again while already signed in just bounces you home. */
const AUTH_ROUTES = ["/login", "/register"];

/** Kept in step with AUTH_COOKIE_NAME in apps/api/src/auth/auth.config.ts. */
const AUTH_COOKIE_NAME = "access_token";

/**
 * A presence check, not a verification — the signing secret lives in the API
 * and does not belong in the web app. So this is purely a UX redirect that
 * avoids rendering a protected page and then yanking it away; an expired or
 * forged cookie gets past here and is rejected by the API on the first request.
 * Nothing sensitive is gated on this alone.
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(AUTH_COOKIE_NAME);

  if (!hasSession && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    // Round-trips the user back where they were aiming once they're in.
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skips Next internals and static assets so this doesn't run per-image.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
