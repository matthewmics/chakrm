import { cookies } from "next/headers";
import type { Metadata } from "next";

import { EventRail } from "@/components/home/event-rail";
import { HomeBand } from "@/components/home/home-band";
import { SportChips } from "@/components/home/sport-chips";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { listEvents, listSports } from "@/lib/api/events";
import type { EventListItemResponse, SportResponse } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Chakrm · Predict matches, climb the rankings",
  description:
    "Follow live and upcoming matches across basketball, football and esports. Predict outcomes with virtual Credits — no account needed to browse.",
};

const LIVE_LIMIT = 6;
const UPCOMING_LIMIT = 6;
const SETTLED_LIMIT = 3;

/**
 * Public home page. A server component so the rails are server-rendered and
 * indexable — the whole shell is identical for guests and members, and only
 * <HomeBand> hydrates to read the session.
 *
 * Replaces the old `app/page.tsx`, which redirected to /dashboard: a page built
 * entirely from personal stats, none of which a guest has.
 */
export default async function HomePage() {
  // Settles rather than rejects: one empty rail is a far better outcome than
  // the whole page failing because a single status query errored.
  const [live, upcoming, settled, sports, cookieStore] = await Promise.all([
    safeEvents({ status: "live", limit: LIVE_LIMIT }),
    safeEvents({ status: "upcoming", limit: UPCOMING_LIMIT }),
    safeEvents({ status: "settled", limit: SETTLED_LIMIT }),
    safeSports(),
    cookies(),
  ]);

  // Presence only — the token is signed with a secret the API holds, so this
  // can't be verified here and isn't trusted for anything. It exists so the
  // guest pitch can be server-rendered instead of appearing after hydration.
  const hadSessionCookie = cookieStore.has("access_token");

  const hasAnyEvents =
    live.length > 0 || upcoming.length > 0 || settled.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <HomeBand hadSessionCookie={hadSessionCookie} />

      <SportChips sports={sports} />

      <EventRail
        title="Live now"
        description="Markets moving in real time"
        events={live}
        pulse
        action={{ label: "View all", href: "/events" }}
      />

      <EventRail
        title="Starting soon"
        description="Sorted by kickoff"
        events={upcoming}
        action={{ label: "View all", href: "/events" }}
      />

      <EventRail
        title="Recently settled"
        description="How the last few finished"
        events={settled}
      />

      {!hasAnyEvents && <EmptyState />}
    </div>
  );
}

async function safeEvents(params: {
  status: "live" | "upcoming" | "settled";
  limit: number;
}): Promise<EventListItemResponse[]> {
  try {
    const page = await listEvents({ ...params, page: 1 });
    return page.items;
  } catch {
    return [];
  }
}

async function safeSports(): Promise<SportResponse[]> {
  try {
    return await listSports();
  } catch {
    return [];
  }
}

/** Only reachable when the API is down or genuinely has no events at all. */
function EmptyState() {
  return (
    <Card className="items-center gap-3 py-12 text-center">
      <p className="text-sm font-medium">No matches scheduled yet</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        Nothing has been listed so far. Check the full events page — it shows
        everything, including matches that have already been settled.
      </p>
      <ButtonLink variant="outline" size="sm" href="/events">
        Go to events
      </ButtonLink>
    </Card>
  );
}
