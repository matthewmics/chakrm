import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/types";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  if (status === "live") {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-destructive" />
        Live
      </Badge>
    );
  }

  if (status === "closing") {
    return (
      <Badge className="bg-gold-soft text-gold">Closing soon</Badge>
    );
  }

  return <Badge className="bg-primary-soft text-primary">Open</Badge>;
}
