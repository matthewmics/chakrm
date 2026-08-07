"use client";

import { useQuery } from "@tanstack/react-query";

import { MarketCard } from "@/components/chakrm/market-card";
import { PredictionSlip } from "@/components/chakrm/prediction-slip";
import { listEventMarkets } from "@/lib/api/events";
import type { MarketResponse } from "@/lib/api/types";

const POLL_INTERVAL_MS = 15_000;

/**
 * Pools only move while a market is taking predictions, so a settled or
 * cancelled event is left alone rather than polled forever.
 */
function hasActiveMarket(markets: MarketResponse[] | undefined): boolean {
  return (markets ?? []).some(
    (market) => market.status === "open" || market.status === "live",
  );
}

type EventMarketsProps = {
  eventId: string;
  /** Server-rendered markets from the event payload; avoids a loading flash. */
  initialMarkets: MarketResponse[];
};

export function EventMarkets({ eventId, initialMarkets }: EventMarketsProps) {
  const { data: markets } = useQuery({
    queryKey: ["events", eventId, "markets"],
    queryFn: () => listEventMarkets(eventId),
    initialData: initialMarkets,
    staleTime: POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
    refetchInterval: (query) =>
      hasActiveMarket(query.state.data) ? POLL_INTERVAL_MS : false,
  });

  return (
    <>
      <PredictionSlip markets={markets} eventId={eventId} />
      <div className="flex flex-col gap-3">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
        {markets.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No markets have been opened on this event yet.
          </p>
        )}
      </div>
    </>
  );
}
