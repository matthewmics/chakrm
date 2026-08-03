import { Crown } from "lucide-react";

import { formatCredits } from "@/lib/format";
import { marketPool, optionShare } from "@/lib/predictions";
import type { Market } from "@/lib/types";
import { cn } from "@/lib/utils";

type OptionPoolBarProps = {
  market: Market;
  className?: string;
};

/**
 * Options ranked by pool share, each as its own bar-row so the leader (and
 * the winning option, once settled) reads at a glance instead of requiring a
 * separate legend.
 */
export function OptionPoolBar({ market, className }: OptionPoolBarProps) {
  const pool = marketPool(market);

  if (pool === 0) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {market.options.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between rounded-lg bg-subtle/60 px-3 py-2 text-sm"
          >
            <span className="font-medium text-muted-foreground">
              {option.name}
            </span>
            <span className="text-xs text-faint">—</span>
          </div>
        ))}
        <span className="pt-0.5 text-xs text-faint">
          No Credits committed yet
        </span>
      </div>
    );
  }

  const ranked = [...market.options].sort(
    (a, b) => b.totalCredits - a.totalCredits,
  );
  const leaderId = ranked[0]?.id;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {ranked.map((option) => {
        const share = optionShare(option, market);
        const isLeader = option.id === leaderId && share > 0;

        return (
          <div
            key={option.id}
            className={cn(
              "relative isolate overflow-hidden rounded-lg py-2 pr-3 pl-3 ring-1",
              option.isWinningOption
                ? "bg-gold-soft ring-gold/40"
                : isLeader
                  ? "bg-primary-soft ring-primary/30"
                  : "bg-subtle/60 ring-transparent",
            )}
          >
            <div
              className={cn(
                "absolute inset-y-0 left-0 -z-10 rounded-lg transition-[width] duration-500",
                option.isWinningOption
                  ? "bg-gold/15"
                  : isLeader
                    ? "bg-primary/15"
                    : "bg-foreground/5",
              )}
              style={{ width: `${share}%` }}
            />

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 truncate text-sm font-semibold">
                {option.isWinningOption && (
                  <Crown className="size-3.5 shrink-0 text-gold" />
                )}
                <span className="truncate">{option.name}</span>
              </span>
              <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span
                  className={cn(
                    "font-mono text-sm font-bold tabular-nums",
                    option.isWinningOption
                      ? "text-gold"
                      : isLeader
                        ? "text-primary"
                        : "text-foreground",
                  )}
                >
                  {share.toFixed(0)}%
                </span>
                <span className="font-mono text-xs text-faint tabular-nums">
                  {formatCredits(option.totalCredits)}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
