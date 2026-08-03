import Link from "next/link";
import { Clock, Layers } from "lucide-react";

import { ApiEventStatusBadge } from "@/components/chakrm/api-event-status-badge";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { formatEventStart } from "@/lib/format-date";
import { DEFAULT_SPORT_ICON, SPORT_ICONS_BY_SLUG } from "@/lib/icons";
import type { EventListItemResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type EventListCardProps = {
  event: EventListItemResponse;
  /** Drops the "View match" affordance — for tighter grids. */
  compact?: boolean;
};

/**
 * Event card rendered from the API's list payload. The list endpoint returns
 * pool totals and a market count rather than the markets themselves, so this
 * shows those instead of per-side odds.
 */
export function EventListCard({ event, compact = false }: EventListCardProps) {
  const SportIcon =
    SPORT_ICONS_BY_SLUG[event.tournament.sport.slug] ?? DEFAULT_SPORT_ICON;
  const live = event.status === "live";
  const showScores = live || event.status === "settled";

  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="h-full gap-4 transition-colors hover:bg-accent">
        <div className="flex items-center justify-between px-(--card-spacing)">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-subtle">
              <SportIcon className="size-3 text-muted-foreground" />
            </div>
            <span className="truncate text-xs font-medium tracking-wide text-faint uppercase">
              {event.tournament.name}
            </span>
          </div>
          <ApiEventStatusBadge status={event.status} />
        </div>

        <div className="flex items-center px-(--card-spacing)">
          <div className="flex flex-1 flex-col items-center gap-2">
            <TeamBadge name={event.teamA.name} size={44} />
            <span className="text-center text-sm leading-tight font-semibold">
              {event.teamA.name}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-1">
            {showScores ? (
              <span className="font-mono text-sm font-bold tabular-nums">
                {event.teamAScore}&ndash;{event.teamBScore}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-faint">VS</span>
            )}
            <div className="h-7 w-px bg-subtle" />
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <TeamBadge name={event.teamB.name} size={44} />
            <span className="text-center text-sm leading-tight font-semibold">
              {event.teamB.name}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 px-(--card-spacing) text-xs text-muted-foreground">
          <Clock className="size-3" />
          <span>{live ? "In progress" : formatEventStart(event.startDate)}</span>
          {event.stage && (
            <span className="truncate text-faint">· {event.stage}</span>
          )}
        </div>

        <div className="mt-auto mx-(--card-spacing) flex items-center justify-between border-t border-subtle pt-3">
          <span className="flex items-center gap-1.5 text-xs text-faint">
            <Layers className="size-3" />
            {formatCredits(event.totalPool)} pool
            <span className="text-faint">
              · {event.marketCount}{" "}
              {event.marketCount === 1 ? "market" : "markets"}
            </span>
          </span>
          {!compact && (
            <span
              className={cn(
                buttonVariants({ size: "sm" }),
                "pointer-events-none",
              )}
            >
              View match
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
