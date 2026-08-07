import Link from "next/link";

import {
  ALL_SPORTS_ICON,
  DEFAULT_SPORT_ICON,
  SPORT_ICONS_BY_SLUG,
} from "@/lib/icons";
import type { SportResponse } from "@/lib/api/types";

/**
 * Links into /events rather than filtering in place. On the home page these are
 * an entry point, not a control — a guest who taps a sport wants the full list
 * of that sport, not a filtered version of three rails.
 */
export function SportChips({ sports }: { sports: SportResponse[] }) {
  if (sports.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip icon={ALL_SPORTS_ICON} label="All sports" href="/events" />
      {sports.map((sport) => (
        <Chip
          key={sport.id}
          icon={SPORT_ICONS_BY_SLUG[sport.slug] ?? DEFAULT_SPORT_ICON}
          label={sport.name}
          href={`/events?sport=${encodeURIComponent(sport.slug)}`}
        />
      ))}
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
    >
      <Icon className="size-3.5" />
      {label}
    </Link>
  );
}
