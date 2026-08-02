import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "gold";
};

const ICON_TONE = {
  default: "text-muted-foreground",
  primary: "text-primary",
  gold: "text-gold",
} as const;

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  const negative = sub?.startsWith("-");
  const Trend = negative ? ArrowDownRight : ArrowUpRight;

  return (
    <Card size="sm" className="gap-3 transition-colors hover:bg-accent">
      <div className="flex items-center justify-between px-(--card-spacing)">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className={cn("size-4", ICON_TONE[tone])} />}
      </div>
      <div className="flex items-end justify-between px-(--card-spacing)">
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {value}
        </span>
        {sub && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              negative ? "text-destructive" : "text-primary",
            )}
          >
            <Trend className="size-3" />
            {sub}
          </span>
        )}
      </div>
    </Card>
  );
}
