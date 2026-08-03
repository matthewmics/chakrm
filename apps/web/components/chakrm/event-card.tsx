import Link from "next/link";
import { Clock, Users } from "lucide-react";

import { EventStatusBadge } from "@/components/chakrm/event-status-badge";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SPORT_ICONS } from "@/lib/icons";
import { formatCredits } from "@/lib/format";
import { decimalOdds } from "@/lib/predictions";
import type { SportEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: SportEvent;
  /** Drops the "View match" affordance — used in the dashboard's tighter grid. */
  compact?: boolean;
};

function OddsPill({ share }: { share: number }) {
  return (
    <span className="rounded-sm bg-primary-soft px-1.5 py-0.5 font-mono text-xs font-semibold text-primary tabular-nums">
      x{decimalOdds(share)}
    </span>
  );
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const SportIcon = SPORT_ICONS[event.sport];
  const live = event.status === "live";

  // The whole card is the link, so "View match" is a styled span rather than a
  // nested anchor.
  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="h-full gap-4 transition-colors hover:bg-accent">
        <div className="flex items-center justify-between px-(--card-spacing)">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-subtle">
              <SportIcon className="size-3 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium tracking-wide text-faint uppercase">
              {event.league}
            </span>
          </div>
          <EventStatusBadge status={event.status} />
        </div>

        <div className="flex items-center px-(--card-spacing)">
          <div className="flex flex-1 flex-col items-center gap-2">
            <TeamBadge name={event.a} size={44} />
            <span className="text-center text-sm leading-tight font-semibold">
              {event.a}
            </span>
            <OddsPill share={event.retA} />
          </div>
          <div className="flex flex-col items-center gap-1.5 px-1">
            <span className="text-[10px] font-semibold text-faint">
              {live ? "LIVE" : "VS"}
            </span>
            <div className="h-7 w-px bg-subtle" />
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <TeamBadge name={event.b} size={44} />
            <span className="text-center text-sm leading-tight font-semibold">
              {event.b}
            </span>
            <OddsPill share={event.retB} />
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-center gap-1.5 px-(--card-spacing) text-xs",
            event.status === "closing" ? "text-gold" : "text-muted-foreground",
          )}
        >
          <Clock className="size-3" />
          <span>{live ? "In progress" : event.time}</span>
          {!live && (
            <span className="text-faint">· closes in {event.closesIn}</span>
          )}
        </div>

        <div className="mt-auto mx-(--card-spacing) flex items-center justify-between border-t border-subtle pt-3">
          <span className="flex items-center gap-1.5 text-xs text-faint">
            <Users className="size-3" />
            {formatCredits(event.participants)} predicting
            <span className="text-faint">
              · {event.markets.length}{" "}
              {event.markets.length === 1 ? "market" : "markets"}
            </span>
          </span>
          {!compact && (
            <span
              className={cn(buttonVariants({ size: "sm" }), "pointer-events-none")}
            >
              View match
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
