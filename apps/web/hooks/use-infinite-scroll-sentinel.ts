"use client";

import * as React from "react";

/**
 * Returns a ref to attach to a sentinel element at the end of a list. Calls
 * `onIntersect` when that element scrolls into view.
 *
 * The root is left as the viewport: `app/(app)/layout.tsx` scrolls inside
 * `<main>`, and IntersectionObserver already accounts for clipping by ancestor
 * scroll containers, so no explicit root is needed.
 */
export function useInfiniteScrollSentinel<T extends HTMLElement>(
  onIntersect: () => void,
  enabled: boolean,
) {
  const sentinelRef = React.useRef<T>(null);

  // Held in a ref so a new inline callback each render doesn't tear down and
  // rebuild the observer. Synced in an effect rather than during render, which
  // would not be concurrent-safe.
  const onIntersectRef = React.useRef(onIntersect);
  React.useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersectRef.current();
      },
      // Start loading slightly before the sentinel is actually visible.
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
