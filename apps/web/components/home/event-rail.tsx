import { EventListCard } from "@/components/chakrm/event-list-card";
import { SectionHeader } from "@/components/chakrm/section-header";
import type { EventListItemResponse } from "@/lib/api/types";

type EventRailProps = {
  title: string;
  description?: string;
  events: EventListItemResponse[];
  action?: { label: string; href: string };
  /** Small dot next to the title, for the live rail. */
  pulse?: boolean;
};

/**
 * Renders nothing at all — header included — when there are no events.
 *
 * This matters more than it looks: an admin-driven status model means there is
 * routinely nothing live, and a guest's first impression of the product should
 * not be three empty section headings.
 */
export function EventRail({
  title,
  description,
  events,
  action,
  pulse = false,
}: EventRailProps) {
  if (events.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {pulse && (
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-destructive" />
          </span>
        )}
        <SectionHeader
          title={title}
          description={description}
          action={action}
          className="flex-1"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventListCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
