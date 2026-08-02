import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  /** Optional "View all →" link on the right. */
  action?: { label: string; href: string };
  className?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div>
        <h3 className="font-heading text-sm font-semibold">{title}</h3>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {action.label}
          <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
