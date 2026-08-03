"use client";

import * as React from "react";

import { formatEventStart } from "@/lib/format-date";

// Nothing to subscribe to — the value only ever flips once, at hydration.
const subscribe = () => () => {};

/** False during SSR and the hydration pass, true on every render after it. */
function useIsHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * Renders a start date in the viewer's own locale and timezone.
 *
 * The server's timezone is not the visitor's, so formatting there would either
 * show the wrong time or trip a hydration mismatch. Rendering a placeholder
 * until hydration keeps the server and client markup identical.
 */
export function EventStartTime({ startDate }: { startDate: string | null }) {
  const hydrated = useIsHydrated();

  return <>{hydrated ? formatEventStart(startDate) : "—"}</>;
}
