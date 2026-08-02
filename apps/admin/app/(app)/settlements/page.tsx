"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { SettlementDialog } from "@/components/chakrm/settlement-dialog";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { ADMIN_SETTLEMENTS } from "@/lib/mock-data";
import type { Settlement } from "@/lib/types";

export default function SettlementsPage() {
  const [target, setTarget] = React.useState<Settlement | null>(null);
  const [settledIds, setSettledIds] = React.useState<number[]>([]);
  const pending = ADMIN_SETTLEMENTS.filter((s) => !settledIds.includes(s.id));

  return (
    <div className="flex flex-col gap-3">
      {pending.length === 0 ? (
        <Card className="items-center gap-2 py-10 text-center">
          <CheckCircle2 className="size-5 text-primary" />
          <h3 className="font-heading text-sm font-semibold">All caught up</h3>
          <p className="max-w-xs text-sm text-muted-foreground">
            No pools are waiting on a settlement decision right now.
          </p>
        </Card>
      ) : (
        pending.map((settlement) => (
          <Card
            key={settlement.id}
            className="flex-row flex-wrap items-center justify-between gap-4 px-(--card-spacing) transition-colors hover:bg-accent"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex items-center -space-x-2">
                <TeamBadge name={settlement.a} size={34} />
                <TeamBadge name={settlement.b} size={34} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">
                  {settlement.a} vs {settlement.b}
                </div>
                <div className="text-xs text-faint">
                  {settlement.league} · closed {settlement.closed}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-faint">Total pool</div>
                <div className="font-mono text-sm font-semibold tabular-nums">
                  {formatCredits(settlement.poolA + settlement.poolB)}
                </div>
              </div>
              <Button variant="gold" onClick={() => setTarget(settlement)}>
                Settle
              </Button>
            </div>
          </Card>
        ))
      )}

      <SettlementDialog
        settlement={target}
        onClose={() => setTarget(null)}
        onConfirm={() => {
          if (target) setSettledIds((current) => [...current, target.id]);
          setTarget(null);
        }}
      />
    </div>
  );
}
