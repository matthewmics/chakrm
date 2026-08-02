import Link from "next/link";
import { Target } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function PredictionsPage() {
  return (
    <Empty className="border border-dashed border-border py-20">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Target />
        </EmptyMedia>
        <EmptyTitle>No predictions yet</EmptyTitle>
        <EmptyDescription>
          Predictions you place will show up here with their pool, stake, and
          settled result.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/events" className={buttonVariants({ size: "lg" })}>
          Browse events
        </Link>
      </EmptyContent>
    </Empty>
  );
}
