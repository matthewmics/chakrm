"use client";

import * as React from "react";
import { Funnel } from "lucide-react";

import { EventCard } from "@/components/chakrm/event-card";
import { Button } from "@/components/ui/button";
import { ALL_SPORTS_ICON, SPORT_ICONS } from "@/lib/icons";
import { EVENTS } from "@/lib/mock-data";
import type { Sport } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "All sports" as const;
const FILTERS: (Sport | typeof ALL)[] = [
  ALL,
  "Basketball",
  "Soccer",
  "Football",
  "Tennis",
  "Esports",
];

export default function EventsPage() {
  const [sport, setSport] = React.useState<Sport | typeof ALL>(ALL);
  const events =
    sport === ALL ? EVENTS : EVENTS.filter((event) => event.sport === sport);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => {
            const Icon = filter === ALL ? ALL_SPORTS_ICON : SPORT_ICONS[filter];
            const active = sport === filter;

            return (
              <button
                key={filter}
                onClick={() => setSport(filter)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary-line bg-primary-soft text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent",
                )}
              >
                <Icon className="size-3.5" />
                {filter}
              </button>
            );
          })}
        </div>
        <Button variant="outline" size="lg">
          <Funnel />
          Status &amp; date
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
