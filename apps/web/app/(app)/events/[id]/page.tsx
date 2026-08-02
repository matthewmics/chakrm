import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";

import { Credits } from "@/components/chakrm/credits";
import { EventStatusBadge } from "@/components/chakrm/event-status-badge";
import { MatchChat } from "@/components/chakrm/match-chat";
import { PoolBar } from "@/components/chakrm/pool-bar";
import { PredictionSlip } from "@/components/chakrm/prediction-slip";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { Card } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { SPORT_ICONS } from "@/lib/icons";
import { EVENTS, getEventById } from "@/lib/mock-data";
import { poolSplit } from "@/lib/predictions";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return EVENTS.map((event) => ({ id: String(event.id) }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

  const SportIcon = SPORT_ICONS[event.sport];
  const live = event.status === "live";
  const { poolA, poolB } = poolSplit(event);

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
          <div className="flex items-center gap-2">
            <SportIcon className="size-3.5 text-faint" />
            <span className="text-xs font-medium tracking-wide text-faint uppercase">
              {event.league}
            </span>
          </div>
          <EventStatusBadge status={event.status} />
        </div>

        <div className="flex items-center justify-center gap-6 px-(--card-spacing) md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <TeamBadge name={event.a} size={64} />
            <span className="text-base font-semibold">{event.a}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span
              className={cn(
                "text-xs font-semibold",
                event.status === "closing" ? "text-gold" : "text-faint",
              )}
            >
              {live ? "LIVE" : "VS"}
            </span>
            <span className="text-sm text-muted-foreground">
              {live ? "In progress" : event.time}
            </span>
            {!live && (
              <span className="text-xs text-faint">
                Closes in {event.closesIn}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <TeamBadge name={event.b} size={64} />
            <span className="text-base font-semibold">{event.b}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 px-(--card-spacing) text-xs text-faint">
          <Users className="size-3" />
          {formatCredits(event.participants)} predicting this match
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <h3 className="px-(--card-spacing) font-heading text-sm font-semibold">
              Prediction pool
            </h3>
            <div className="px-(--card-spacing)">
              <PoolBar
                a={event.a}
                b={event.b}
                retA={event.retA}
                retB={event.retB}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 px-(--card-spacing)">
              {[
                { name: event.a, pool: poolA },
                { name: event.b, pool: poolB },
              ].map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5"
                >
                  <TeamBadge name={entry.name} size={26} />
                  <div className="min-w-0">
                    <div className="truncate text-[11px] text-faint">
                      {entry.name}
                    </div>
                    <Credits amount={entry.pool} className="text-sm font-semibold" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-(--card-spacing) flex items-center justify-between border-t border-subtle pt-4">
              <span className="text-xs text-faint">Total pool</span>
              <span className="text-sm font-semibold">
                <Credits amount={event.pool} /> Credits
              </span>
            </div>
          </Card>

          <MatchChat event={event} />
        </div>

        <div className="flex flex-col gap-4">
          <PredictionSlip event={event} />
        </div>
      </div>
    </div>
  );
}
