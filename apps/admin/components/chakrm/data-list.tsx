import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Card of divider-separated rows, used for the audit log and champions list. */
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
      className={cn("flex items-start gap-3 px-3 py-2.5", className)}
      {...props}
    />
  );
}

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
