"use client";

import * as React from "react";
import { CircleCheckBig } from "lucide-react";

import { TeamBadge } from "@/components/chakrm/team-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CURRENT_USER } from "@/lib/mock-data";
import { decimalOdds, estimatePayout, poolSplit } from "@/lib/predictions";
import type { SportEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [50, 100, 250, 500];

export function PredictionSlip({ event }: { event: SportEvent }) {
  const { poolA, poolB } = poolSplit(event);

  const [side, setSide] = React.useState<"a" | "b" | null>(null);
  const [amount, setAmount] = React.useState<string>("100");
  const [confirmed, setConfirmed] = React.useState(false);

  const { payout, profit } = estimatePayout(amount, side, poolA, poolB);
  const stake = Number(amount) || 0;
  const ready = side !== null && stake > 0;

  // Any change to the slip invalidates a previous confirmation.
  const update = (next: () => void) => {
    next();
    setConfirmed(false);
  };

  const sides = [
    { key: "a" as const, name: event.a, share: event.retA },
    { key: "b" as const, name: event.b, share: event.retB },
  ];

  return (
    <Card className="sticky top-4 gap-4">
      <h3 className="px-(--card-spacing) font-heading text-sm font-semibold">
        Place a prediction
      </h3>

      <div className="grid grid-cols-2 gap-2 px-(--card-spacing)">
        {sides.map((option) => (
          <button
            key={option.key}
            onClick={() => update(() => setSide(option.key))}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition-colors",
              side === option.key
                ? "border-primary bg-primary-soft"
                : "border-border bg-card hover:bg-accent",
            )}
          >
            <TeamBadge name={option.name} size={32} />
            <span className="text-xs font-medium">{option.name}</span>
            <span className="rounded-sm bg-primary-soft px-1.5 py-0.5 font-mono text-xs font-semibold text-primary tabular-nums">
              x{decimalOdds(option.share)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-(--card-spacing)">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5">
          <span className="text-xs text-faint">Credits</span>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(event) => update(() => setAmount(event.target.value))}
            className="flex-1 bg-transparent text-right font-mono text-base font-semibold tabular-nums outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              onClick={() => update(() => setAmount(String(value)))}
              className={cn(
                "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors",
                stake === value
                  ? "border-primary-line bg-primary-soft text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {value}
            </button>
          ))}
          <button
            onClick={() => update(() => setAmount(String(CURRENT_USER.credits)))}
            className="flex-1 rounded-lg border border-border bg-card py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            Max
          </button>
        </div>
      </div>

      <div className="mx-(--card-spacing) flex flex-col gap-1.5 border-t border-subtle pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stake</span>
          <span className="font-mono tabular-nums">
            {stake.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated payout</span>
          <span className="font-mono font-medium text-primary tabular-nums">
            {Math.round(payout).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Potential profit</span>
          <span className="font-mono font-medium text-primary tabular-nums">
            {profit > 0 ? `+${Math.round(profit).toLocaleString()}` : "0"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-faint">
          Estimated payout updates as more Credits are committed before this
          pool closes.
        </p>
      </div>

      <div className="px-(--card-spacing)">
        {confirmed ? (
          <Button variant="soft" size="lg" className="w-full" disabled>
            <CircleCheckBig />
            Prediction placed
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            disabled={!ready}
            onClick={() => setConfirmed(true)}
          >
            Confirm prediction
          </Button>
        )}
      </div>
    </Card>
  );
}
