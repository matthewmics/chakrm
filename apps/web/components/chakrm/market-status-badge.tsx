import { Badge } from "@/components/ui/badge";
import type { MarketStatus } from "@/lib/types";

const STATUS_CLASS: Record<Exclude<MarketStatus, "live">, string> = {
  upcoming: "bg-subtle text-faint",
  open: "bg-primary-soft text-primary",
  suspended: "bg-gold-soft text-gold",
  settled: "bg-subtle text-muted-foreground",
  cancelled: "bg-destructive-soft text-destructive",
};

const STATUS_LABEL: Record<MarketStatus, string> = {
  upcoming: "Upcoming",
  open: "Open",
  live: "Live",
  suspended: "Suspended",
  settled: "Settled",
  cancelled: "Cancelled",
};

/** Each market on an event carries its own status, independent of the others. */
export function MarketStatusBadge({ status }: { status: MarketStatus }) {
  if (status === "live") {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-destructive" />
        {STATUS_LABEL.live}
      </Badge>
    );
  }

  return (
    <Badge className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</Badge>
  );
}
