"use client";

import { useQuery } from "@tanstack/react-query";

import { ButtonLink } from "@/components/ui/button-link";
import { GOOGLE_SIGN_IN_URL, getGoogleStatus } from "@/lib/api/auth";

/**
 * Renders nothing unless the API reports Google credentials are configured.
 * Shipping the button unconditionally would mean a dead link on any deployment
 * that hasn't been through the Cloud Console setup.
 */
export function GoogleButton({ label }: { label: string }) {
  const { data } = useQuery({
    queryKey: ["auth", "google-status"],
    queryFn: getGoogleStatus,
    // Changes only when the API is redeployed with new credentials.
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  if (!data?.enabled) return null;

  return (
    <>
      {/* external: the OAuth flow is a redirect chain that leaves this origin
          entirely, which the client router can't follow. */}
      <ButtonLink
        variant="outline"
        size="lg"
        className="w-full"
        href={GOOGLE_SIGN_IN_URL}
        external
      >
        <GoogleMark />
        {label}
      </ButtonLink>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-faint">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </>
  );
}

/** Inline so the mark doesn't depend on an external asset or icon set. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.63h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.55Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.98A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.55 14.17a6.9 6.9 0 0 1 0-4.34V6.85H1.7a11.5 11.5 0 0 0 0 10.3l3.85-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.08c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.72 1.63 15.11.5 12 .5A11.5 11.5 0 0 0 1.7 6.85l3.85 2.98C6.46 7.11 9 5.08 12 5.08Z"
      />
    </svg>
  );
}
