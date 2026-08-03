"use client";

import * as React from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Funnel, Loader2 } from "lucide-react";

import { EventListCard } from "@/components/chakrm/event-list-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listEvents, listSports } from "@/lib/api/events";
import {
  ALL_SPORTS_ICON,
  DEFAULT_SPORT_ICON,
  SPORT_ICONS_BY_SLUG,
} from "@/lib/icons";
import { useInfiniteScrollSentinel } from "@/hooks/use-infinite-scroll-sentinel";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

/** "No sport filter" — the API omits the param entirely rather than sending a value. */
const ALL_SPORTS = null;

export default function EventsPage() {
  const [sportSlug, setSportSlug] = React.useState<string | null>(ALL_SPORTS);

  const sportsQuery = useQuery({
    queryKey: ["sports"],
    queryFn: listSports,
    // Sports change about as often as the schema does.
    staleTime: 5 * 60 * 1000,
  });

  const eventsQuery = useInfiniteQuery({
    queryKey: ["events", { sportSlug }],
    queryFn: ({ pageParam }) =>
      listEvents({
        page: pageParam,
        limit: PAGE_SIZE,
        sportSlug: sportSlug ?? undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = eventsQuery;

  const canLoadMore = Boolean(hasNextPage) && !isFetchingNextPage;
  const sentinelRef = useInfiniteScrollSentinel<HTMLDivElement>(() => {
    void fetchNextPage();
  }, canLoadMore);

  const events = eventsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const total = eventsQuery.data?.pages[0]?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton
            icon={ALL_SPORTS_ICON}
            label="All sports"
            active={sportSlug === ALL_SPORTS}
            onClick={() => setSportSlug(ALL_SPORTS)}
          />
          {sportsQuery.data?.map((sport) => (
            <FilterButton
              key={sport.id}
              icon={SPORT_ICONS_BY_SLUG[sport.slug] ?? DEFAULT_SPORT_ICON}
              label={sport.name}
              active={sportSlug === sport.slug}
              onClick={() => setSportSlug(sport.slug)}
            />
          ))}
        </div>
        <Button variant="outline" size="lg">
          <Funnel />
          Status &amp; date
        </Button>
      </div>

      {eventsQuery.isError ? (
        <ErrorState
          message={eventsQuery.error.message}
          onRetry={() => void eventsQuery.refetch()}
        />
      ) : eventsQuery.isPending ? (
        <EventGrid>
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </EventGrid>
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <EventGrid>
            {events.map((event) => (
              <EventListCard key={event.id} event={event} />
            ))}
          </EventGrid>

          {/* Tripped by the observer once it scrolls into view. */}
          <div ref={sentinelRef} aria-hidden className="h-px" />

          <div className="flex justify-center py-2">
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading more events…
              </span>
            ) : hasNextPage ? (
              // Keyboard/no-observer fallback; the sentinel usually gets here first.
              <Button variant="outline" onClick={() => void fetchNextPage()}>
                Load more
              </Button>
            ) : (
              <span className="text-xs text-faint">
                Showing all {total} {total === 1 ? "event" : "events"}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EventGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
  );
}

function FilterButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary-line bg-primary-soft text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-accent",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

function SkeletonCard() {
  return (
    <Card className="h-52 animate-pulse gap-4">
      <div className="mx-(--card-spacing) h-6 rounded-md bg-subtle" />
      <div className="mx-(--card-spacing) flex flex-1 items-center gap-4">
        <div className="h-16 flex-1 rounded-md bg-subtle" />
        <div className="h-16 flex-1 rounded-md bg-subtle" />
      </div>
      <div className="mx-(--card-spacing) h-8 rounded-md bg-subtle" />
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="items-center gap-2 py-12 text-center">
      <p className="text-sm font-medium">No events found</p>
      <p className="text-xs text-muted-foreground">
        Try a different sport filter.
      </p>
    </Card>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="items-center gap-3 py-12 text-center">
      <p className="text-sm font-medium">Couldn&apos;t load events</p>
      <p className="text-xs text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </Card>
  );
}
