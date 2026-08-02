"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { CURRENT_SEASON } from "@/lib/mock-data";
import { NAV_ITEMS, isNavItemActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Nav body shared by the desktop sidebar and the mobile sheet. `onNavigate`
 * lets the sheet close itself when a link is tapped.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="mb-6 flex items-center gap-2 px-2"
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">C</span>
        </div>
        <span className="font-heading text-base font-semibold tracking-tight">
          Chakrm
        </span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-card text-foreground"
                  : "text-muted-foreground hover:bg-subtle",
              )}
            >
              <Icon
                className={cn("size-4", active ? "text-primary" : "text-faint")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Card size="sm" className="mt-auto gap-2">
        <div className="flex items-center gap-1.5 px-(--card-spacing)">
          <Sparkles className="size-3.5 text-gold" />
          <span className="text-xs font-semibold">{CURRENT_SEASON.name}</span>
        </div>
        <span className="px-(--card-spacing) text-xs text-muted-foreground">
          Ends in {CURRENT_SEASON.endsIn.days} days. Climb to lock in your badge
          tier.
        </span>
      </Card>
    </>
  );
}
