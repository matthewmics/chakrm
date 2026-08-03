/**
 * Formats an event's ISO start date for display, e.g. "Tue, Aug 4 · 6:30 PM".
 *
 * Called only from client components: the API returns UTC, and formatting it in
 * the viewer's locale on the server would produce a hydration mismatch.
 */
export function formatEventStart(startDate: string | null): string {
  if (!startDate) return "Not scheduled";

  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
