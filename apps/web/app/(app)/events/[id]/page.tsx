import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Layers } from "lucide-react";

import { ApiEventStatusBadge } from "@/components/chakrm/api-event-status-badge";
import { EventMarkets } from "@/components/chakrm/event-markets";
import { EventStartTime } from "@/components/chakrm/event-start-time";
import { MatchChat } from "@/components/chakrm/match-chat";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";
import { getEvent } from "@/lib/api/events";
import type { EventDetailResponse } from "@/lib/api/types";
import { formatCredits } from "@/lib/format";
import { DEFAULT_SPORT_ICON, SPORT_ICONS_BY_SLUG } from "@/lib/icons";

// No generateStaticParams: events are database rows that change under admin
// action, so this route is rendered per request rather than prerendered.

async function loadEvent(id: string): Promise<EventDetailResponse> {
  try {
    return await getEvent(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await loadEvent(id);

  const SportIcon =
    SPORT_ICONS_BY_SLUG[event.tournament.sport.slug] ?? DEFAULT_SPORT_ICON;
  const live = event.status === "live";
  const showScores = live || event.status === "settled";

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/events"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        Back to Events
      </Link>

      <Card className="[--card-spacing:--spacing(6)] md:[--card-spacing:--spacing(8)]">
        <div className="flex items-center justify-between px-(--card-spacing)">
          <div className="flex min-w-0 items-center gap-2">
            <SportIcon className="size-3.5 shrink-0 text-faint" />
            <span className="truncate text-xs font-medium tracking-wide text-faint uppercase">
              {event.tournament.name}
              {event.stage && ` · ${event.stage}`}
            </span>
          </div>
          <ApiEventStatusBadge status={event.status} />
        </div>

        <div className="flex items-center justify-center gap-6 px-(--card-spacing) md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <TeamBadge name={event.teamA.name} size={64} />
            <span className="text-base font-semibold">{event.teamA.name}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            {showScores ? (
              <span className="font-mono text-2xl font-bold tabular-nums">
                {event.teamAScore}&ndash;{event.teamBScore}
              </span>
            ) : (
              <span className="text-xs font-semibold text-faint">VS</span>
            )}
            <span className="text-sm text-muted-foreground">
              {live ? (
                "In progress"
              ) : (
                <EventStartTime startDate={event.startDate} />
              )}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TeamBadge name={event.teamB.name} size={64} />
            <span className="text-base font-semibold">{event.teamB.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 px-(--card-spacing) text-xs text-faint">
          <Layers className="size-3" />
          {formatCredits(event.totalPool)} Credits across {event.marketCount}{" "}
          {event.marketCount === 1 ? "market" : "markets"}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Markets poll for pool changes, so they live in a client boundary. */}
          <EventMarkets eventId={event.id} initialMarkets={event.markets} />
        </div>

        <div className="flex flex-col gap-4">
          <MatchChat teamAName={event.teamA.name} teamBName={event.teamB.name} />
        </div>
      </div>
    </div>
  );
}
