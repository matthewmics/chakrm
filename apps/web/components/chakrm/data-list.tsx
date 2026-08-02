import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The card-of-divided-rows pattern the design leans on for activity feeds,
 * transactions, standings, rewards, and sessions. Rows are separated by a
 * hairline rather than a full border so the list reads as one surface.
 */
export function DataList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "gap-0 py-2 [&>*+*]:border-t [&>*+*]:border-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function DataListRow({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3 px-3 py-2.5", className)}
      {...props}
    />
  );
}

/** Small uppercase caption above a list, e.g. "Active sessions". */
export function DataListLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-xs font-medium tracking-wide text-faint uppercase",
        className,
      )}
      {...props}
    />
  );
}
