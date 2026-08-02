import { Credits } from "@/components/chakrm/credits";
import { DataListRow } from "@/components/chakrm/data-list";
import { UserAvatar } from "@/components/chakrm/user-avatar";
import type { LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Compact standings row used by the dashboard and seasons previews. */
export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <DataListRow className="px-2">
      <span
        className={cn(
          "w-5 text-center font-mono text-sm font-semibold tabular-nums",
          entry.rank <= 3 ? "text-gold" : "text-faint",
        )}
      >
        {entry.rank}
      </span>
      <UserAvatar name={entry.name} size={26} />
      <span className="flex-1 truncate text-sm">{entry.name}</span>
      <Credits amount={entry.credits} tone="primary" className="text-sm font-medium" />
    </DataListRow>
  );
}
