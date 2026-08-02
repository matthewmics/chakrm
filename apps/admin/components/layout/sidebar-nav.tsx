"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Server, Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { NAV_ITEMS, isNavItemActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Nav body shared by the desktop sidebar and the mobile sheet. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/overview"
        onClick={onNavigate}
        className="mb-6 flex items-center gap-2 px-2"
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-gold">
          <Shield className="size-3.5 text-gold-foreground" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-heading text-sm font-semibold tracking-tight">
            Chakrm
          </span>
          <span className="text-[10px] font-medium tracking-wide text-gold uppercase">
            Admin
          </span>
        </div>
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
                className={cn("size-4", active ? "text-gold" : "text-faint")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Card size="sm" className="mt-auto gap-1.5">
        <div className="flex items-center gap-1.5 px-(--card-spacing)">
          <Server className="size-3.5 text-primary" />
          <span className="text-xs font-semibold">Production</span>
        </div>
        <span className="px-(--card-spacing) text-xs text-faint">
          Actions here affect live users and pools.
        </span>
      </Card>
    </>
  );
}
