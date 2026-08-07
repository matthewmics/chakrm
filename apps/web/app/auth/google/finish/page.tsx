import { Suspense } from "react";
import type { Metadata } from "next";

import { GoogleFinish } from "@/components/auth/google-finish";

export const metadata: Metadata = {
  title: "Signing you in · Chakrm",
  // A one-time code in the URL has no business in a search index.
  robots: { index: false, follow: false },
};

/**
 * Landing point for the Google handoff.
 *
 * The OAuth callback runs on localhost (Google won't accept a redirect URI
 * without a public TLD, so api.chakrm.local can't be registered) and therefore
 * can't set a cookie scoped to .chakrm.local. It redirects here with a
 * single-use code instead, which this page trades in against the API from the
 * correct origin. See _tasks/auth-task.md 0.3.
 *
 * Outside the (auth) route group deliberately: this is a transient machine step
 * with no form to frame.
 */
export default function GoogleFinishPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <Suspense fallback={null}>
        <GoogleFinish />
      </Suspense>
    </div>
  );
}
