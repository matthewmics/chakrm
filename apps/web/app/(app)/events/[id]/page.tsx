import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";

import { EventStatusBadge } from "@/components/chakrm/event-status-badge";
import { MarketCard } from "@/components/chakrm/market-card";
import { MatchChat } from "@/components/chakrm/match-chat";
import { PredictionSlip } from "@/components/chakrm/prediction-slip";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { Card } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { SPORT_ICONS } from "@/lib/icons";
import { EVENTS, getEventById } from "@/lib/mock-data";
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
        <div className="flex flex-col gap-4  lg:col-span-2">
          <PredictionSlip markets={event.markets} />
          <div className="flex flex-col gap-3">
            {event.markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <MatchChat event={event} />
        </div>
      </div>
    </div>
  );
}
