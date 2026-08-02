import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BADGE_ICONS } from "@/lib/icons";
import type { Achievement } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Achievement / season badge tile. Earned tiles get a gold icon well and a
 * pill; locked ones dim out and show their progress instead.
 */
export function BadgeTile({ badge }: { badge: Achievement }) {
  const Icon = BADGE_ICONS[badge.icon];

  return (
    <Card
      size="sm"
      className={cn(
        "items-center gap-2 text-center",
        !badge.earned && "opacity-70",
      )}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-xl",
          badge.earned ? "bg-gold-soft" : "bg-subtle",
        )}
      >
        <Icon className={cn("size-4", badge.earned ? "text-gold" : "text-faint")} />
      </div>
      <span className="px-2 text-xs leading-tight font-medium">
        {badge.label}
      </span>
      {badge.desc && (
        <span className="px-2 text-[11px] leading-tight text-faint">
          {badge.desc}
        </span>
      )}
      {badge.earned ? (
        <Badge className="bg-gold-soft text-gold">Earned</Badge>
      ) : (
        <span className="text-[11px] font-medium text-primary">
          {badge.progress ?? "Locked"}
        </span>
      )}
    </Card>
  );
}
