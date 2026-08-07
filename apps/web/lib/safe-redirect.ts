/**
 * Sanitises a `?next=` value before it reaches `router.push`.
 *
 * The gated-action flow puts an attacker-controllable path in the URL, so an
 * unchecked value here is a textbook open redirect: `/login?next=//evil.com`
 * renders a genuine Chakrm sign-in page that hands the user to another origin
 * the moment they authenticate.
 *
 * Only same-origin absolute paths survive. Anything with a scheme, anything
 * protocol-relative, and anything not starting with `/` falls back.
 */
export function safeRedirect(
  next: string | null | undefined,
  fallback = "/",
): string {
  if (!next) return fallback;

  // Must be an absolute path. Rules out "evil.com" and "javascript:alert(1)".
  if (!next.startsWith("/")) return fallback;

  // Protocol-relative: "//evil.com" is a valid URL to another host, and
  // "/\evil.com" is treated the same way by several browsers.
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;

  return next;
}
