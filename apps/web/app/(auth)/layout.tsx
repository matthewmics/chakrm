import Link from "next/link";

/**
 * Its own route group rather than living under `(app)`: a sidebar full of links
 * you can't use yet, and a topbar with a "Log in" button on the login page,
 * are both noise at the moment someone is trying to sign in.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-base font-bold text-primary-foreground">C</span>
        </div>
        <span className="font-heading text-lg font-semibold tracking-tight">
          Chakrm
        </span>
      </Link>

      <div className="w-full max-w-sm">{children}</div>

      <p className="max-w-sm text-center text-xs text-faint">
        Chakrm is a prediction game played with virtual Credits. No real money,
        no payouts — just rankings.
      </p>
    </div>
  );
}
