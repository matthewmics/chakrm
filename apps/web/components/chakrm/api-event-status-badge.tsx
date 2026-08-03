import { Badge } from "@/components/ui/badge";
import type { ApiEventStatus } from "@/lib/api/types";

/**
 * Badge for the API's `Event.status`. Distinct from `EventStatusBadge`, which
 * renders the mock data's `open | closing | live` vocabulary.
 */
export function ApiEventStatusBadge({ status }: { status: ApiEventStatus }) {
  if (status === "live") {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <span className="size-1.5 rounded-full bg-destructive" />
        Live
      </Badge>
    );
  }

  if (status === "settled") {
    return <Badge className="bg-subtle text-muted-foreground">Settled</Badge>;
  }

  if (status === "cancelled") {
    return <Badge className="bg-subtle text-faint">Cancelled</Badge>;
  }

  return <Badge className="bg-primary-soft text-primary">Upcoming</Badge>;
}
