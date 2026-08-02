import { Badge } from "@/components/ui/badge";
import type { AdminEventStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: AdminEventStatus }) {
  if (status === "Live") {
    return <Badge variant="destructive">Live</Badge>;
  }
  if (status === "Closing") {
    return <Badge className="bg-gold-soft text-gold">Closing soon</Badge>;
  }
  if (status === "Settled") {
    return <Badge className="bg-subtle text-muted-foreground">Settled</Badge>;
  }
  if (status === "Voided") {
    return <Badge variant="destructive">Voided</Badge>;
  }
  return <Badge className="bg-primary-soft text-primary">Open</Badge>;
}
