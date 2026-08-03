import { Credits } from "@/components/chakrm/credits";
import { MarketStatusBadge } from "@/components/chakrm/market-status-badge";
import { OptionPoolBar } from "@/components/chakrm/option-pool-bar";
import { Card } from "@/components/ui/card";
import { marketPool } from "@/lib/predictions";
import type { Market } from "@/lib/types";

/** One bet type on an event: its own pool, status, and option split. */
export function MarketCard({ market }: { market: Market }) {
  return (
    <Card size="sm" className="gap-3">
      <div className="flex items-center justify-between px-(--card-spacing)">
        <h4 className="text-sm font-semibold">{market.name}</h4>
        <MarketStatusBadge status={market.status} />
      </div>

      <div className="px-(--card-spacing)">
        <OptionPoolBar market={market} />
      </div>

      <div className="mx-(--card-spacing) flex items-center justify-between border-t border-subtle pt-3">
        <span className="text-xs text-faint">Market pool</span>
        <span className="text-sm font-semibold">
          <Credits amount={marketPool(market)} /> Credits
        </span>
      </div>
    </Card>
  );
}
