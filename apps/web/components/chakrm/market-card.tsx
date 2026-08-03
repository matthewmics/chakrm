import { Coins } from "lucide-react";

import { Credits } from "@/components/chakrm/credits";
import { MarketStatusBadge } from "@/components/chakrm/market-status-badge";
import { OptionPoolBar } from "@/components/chakrm/option-pool-bar";
import { Card } from "@/components/ui/card";
import { marketPool } from "@/lib/predictions";
import type { Market, MarketStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const ACCENT_CLASS: Record<MarketStatus, string> = {
  upcoming: "before:bg-border",
  open: "before:bg-primary",
  live: "before:bg-destructive",
  suspended: "before:bg-gold",
  settled: "before:bg-muted-foreground",
  cancelled: "before:bg-destructive/50",
};

/** One bet type on an event: its own pool, status, and option split. */
export function MarketCard({ market }: { market: Market }) {
  return (
    <Card
      size="sm"
      className={cn(
        "relative gap-3 pl-4 transition-shadow before:absolute before:inset-y-0 before:left-0 before:w-1",
        ACCENT_CLASS[market.status],
      )}
    >
      <div className="flex items-center justify-between px-(--card-spacing)">
        <h4 className="text-sm font-semibold">{market.name}</h4>
        <MarketStatusBadge status={market.status} />
      </div>

      <div className="px-(--card-spacing)">
        <OptionPoolBar market={market} />
      </div>

      <div className="mx-(--card-spacing) flex items-center justify-between border-t border-subtle pt-3">
        <span className="flex items-center gap-1.5 text-xs text-faint">
          <Coins className="size-3.5" />
          Market pool
        </span>
        <span className="text-sm font-semibold">
          <Credits amount={marketPool(market)} /> Credits
        </span>
      </div>
    </Card>
  );
}
