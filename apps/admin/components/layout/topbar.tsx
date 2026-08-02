"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Search } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { UserAvatar } from "@/components/chakrm/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPageTitle } from "@/lib/nav";

const ADMIN_NAME = "admin_ops";
const ADMIN_EMAIL = "admin_ops@chakrm.com";

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <MobileNav />
        <span className="font-heading text-base font-semibold tracking-tight">
          {getPageTitle(pathname)}
        </span>

        <div className="hidden w-72 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 lg:flex">
          <Search className="size-3.5 text-faint" />
          <span className="text-sm text-faint">Search users, events, logs…</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden items-center gap-1.5 rounded-lg bg-primary-soft px-2.5 py-1.5 text-xs font-medium text-primary ring-1 ring-primary-line sm:flex">
          <span className="size-1.5 rounded-full bg-primary" />
          Production
        </span>

        <Button variant="outline" size="icon-sm" className="relative">
          <Bell />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-gold" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<button className="flex items-center gap-1 rounded-full" />}
          >
            <UserAvatar name={ADMIN_NAME} size={30} />
            <ChevronDown className="size-3.5 text-faint" />
            <span className="sr-only">Account menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2.5 px-2 py-2.5">
              <UserAvatar name={ADMIN_NAME} size={32} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {ADMIN_NAME}
                </div>
                <div className="truncate text-xs text-faint">
                  Platform administrator
                </div>
              </div>
            </div>
            <div className="border-t border-subtle px-2 py-2 text-sm text-muted-foreground">
              {ADMIN_EMAIL}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
