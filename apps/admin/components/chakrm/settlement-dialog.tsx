"use client";

import * as React from "react";
import { CircleCheckBig } from "lucide-react";

import { TeamBadge } from "@/components/chakrm/team-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCredits } from "@/lib/format";
import type { Settlement } from "@/lib/types";
import { cn } from "@/lib/utils";

type Choice = "a" | "b" | "void";

type SettlementDialogProps = {
  settlement: Settlement | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function SettlementDialog({
  settlement,
  onClose,
  onConfirm,
}: SettlementDialogProps) {
  const [choice, setChoice] = React.useState<Choice | null>(null);

  if (!settlement) return null;

  const total = settlement.poolA + settlement.poolB;
  const options = [
    { key: "a" as const, name: settlement.a, pool: settlement.poolA },
    { key: "b" as const, name: settlement.b, pool: settlement.poolB },
  ];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setChoice(null);
      onClose();
    }
  };

  const handleConfirm = () => {
    setChoice(null);
    onConfirm();
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Settle pool</DialogTitle>
          <DialogDescription>
            {settlement.league}. Choose the winning outcome to distribute
            rewards to correct predictions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => setChoice(option.key)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                choice === option.key
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card hover:bg-accent",
              )}
            >
              <div className="flex items-center gap-2">
                <TeamBadge name={option.name} size={30} />
                <span className="text-sm font-medium">{option.name}</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {formatCredits(option.pool)} committed
              </span>
            </button>
          ))}
          <button
            onClick={() => setChoice("void")}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors",
              choice === "void"
                ? "border-gold bg-gold-soft text-gold"
                : "border-border bg-card text-muted-foreground hover:bg-accent",
            )}
          >
            Void pool and refund all Credits
          </button>
        </div>

        <DialogFooter className="items-center justify-between sm:justify-between">
          <span className="text-xs text-faint">
            Total pool: {formatCredits(total)} Credits
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={!choice} onClick={handleConfirm}>
              <CircleCheckBig />
              Confirm settlement
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
