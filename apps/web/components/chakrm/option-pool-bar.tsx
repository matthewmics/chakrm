import { formatCredits } from "@/lib/format";
import { marketPool, optionShare } from "@/lib/predictions";
import type { Market } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Cycles through for markets with more than two options. */
const SEGMENT_COLORS = [
  "var(--color-primary)",
  "var(--color-gold)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

type OptionPoolBarProps = {
  market: Market;
  className?: string;
};

/**
 * One bar split by how a market's Credits pool is committed across its
 * options, generalising the old two-side PoolBar to any option count.
 */
export function OptionPoolBar({ market, className }: OptionPoolBarProps) {
  const pool = marketPool(market);

  return (
    <div className={className}>
      <div
        className={cn(
          "flex h-2.5 w-full overflow-hidden rounded-full bg-subtle",
        )}
      >
        {market.options.map((option, index) => {
          const share = optionShare(option, market);
          if (share <= 0) return null;
          return (
            <div
              key={option.id}
              style={{
                width: `${share}%`,
                backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
              }}
            />
          );
        })}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {market.options.map((option, index) => {
          const share = optionShare(option, market);
          return (
            <div key={option.id} className="flex items-center gap-1.5 text-xs">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                }}
              />
              <span className="font-medium">{option.name}</span>
              <span className="text-faint">
                {share.toFixed(0)}% · {formatCredits(option.totalCredits)}
              </span>
              {option.isWinningOption && (
                <span className="font-medium text-primary">Winner</span>
              )}
            </div>
          );
        })}
        {pool === 0 && (
          <span className="text-xs text-faint">No Credits committed yet</span>
        )}
      </div>
    </div>
  );
}
