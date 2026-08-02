"use client";

import * as React from "react";
import { CircleCheckBig, Gift, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DAILY_BONUS_REWARDS, DAILY_BONUS_STREAK_DAY } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Seven-day login streak. The reward grows each consecutive day, so the strip
 * shows what's banked, what's claimable today, and what's still locked.
 */
export function DailyBonusCard() {
  const [claimed, setClaimed] = React.useState(false);
  const todayReward = DAILY_BONUS_REWARDS[DAILY_BONUS_STREAK_DAY - 1];

  return (
    <Card className="gap-4 bg-linear-160 from-card from-55% to-gold-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 px-(--card-spacing)">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-soft">
            <Gift className="size-4 text-gold" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold">Daily bonus</h3>
            <span className="text-xs text-muted-foreground">
              Day {DAILY_BONUS_STREAK_DAY} of 7. Come back daily and your reward
              grows.
            </span>
          </div>
        </div>
        {claimed ? (
          <Button variant="soft" size="lg" disabled>
            <CircleCheckBig />
            Claimed for today
          </Button>
        ) : (
          <Button variant="gold" size="lg" onClick={() => setClaimed(true)}>
            Claim +{todayReward}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 px-(--card-spacing) md:grid-cols-7">
        {DAILY_BONUS_REWARDS.map((amount, index) => {
          const day = index + 1;
          const isClaimed =
            day < DAILY_BONUS_STREAK_DAY ||
            (day === DAILY_BONUS_STREAK_DAY && claimed);
          const isToday = day === DAILY_BONUS_STREAK_DAY && !claimed;
          const isFuture = day > DAILY_BONUS_STREAK_DAY;

          return (
            <div
              key={day}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border py-3",
                isToday && "border-gold bg-gold-soft",
                isClaimed && "border-primary-line bg-primary-soft",
                !isToday && !isClaimed && "border-border bg-card",
                isFuture && "opacity-55",
              )}
            >
              {isClaimed ? (
                <CircleCheckBig className="size-4 text-primary" />
              ) : isToday ? (
                <Gift className="size-4 text-gold" />
              ) : (
                <Lock className="size-3.5 text-faint" />
              )}
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isToday ? "text-gold" : "text-faint",
                )}
              >
                Day {day}
              </span>
              <span
                className={cn(
                  "font-mono text-xs font-semibold tabular-nums",
                  isClaimed && "text-primary",
                  isToday && "text-gold",
                  !isClaimed && !isToday && "text-faint",
                )}
              >
                +{amount}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
