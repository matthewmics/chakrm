"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
  Wallet,
} from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { UserAvatar } from "@/components/chakrm/user-avatar";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth, useLogout } from "@/hooks/use-auth";
import type { AuthUserResponse } from "@/lib/api/types";
import { formatCredits } from "@/lib/format";
import { NOTIFICATION_ICONS } from "@/lib/icons";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { getPageTitle } from "@/lib/nav";
import { cn } from "@/lib/utils";

const NOTIFICATION_TONE = {
  primary: { icon: "text-primary", well: "bg-primary-soft" },
  gold: { icon: "text-gold", well: "bg-gold-soft" },
  muted: { icon: "text-muted-foreground", well: "bg-subtle" },
  destructive: { icon: "text-destructive", well: "bg-destructive-soft" },
} as const;

const MENU_ITEMS = [
  { label: "View profile", href: "/profile", icon: User },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * `hadSessionCookie` is passed down from the layout, which can read the
 * httpOnly cookie this component cannot. It only decides what to show before
 * /auth/me resolves — see the comment on the three-state block below.
 */
export function Topbar({ hadSessionCookie }: { hadSessionCookie: boolean }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <MobileNav />
        <span className="font-heading text-base font-semibold md:hidden">
          Chakrm
        </span>
        <span className="hidden font-heading text-base font-semibold tracking-tight md:block">
          {getPageTitle(pathname)}
        </span>

        {/* Search is presentational until there's something to search. */}
        <div className="hidden w-72 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 lg:flex">
          <Search className="size-3.5 text-faint" />
          <span className="text-sm text-faint">Search events, players…</span>
          <span className="ml-auto rounded-sm bg-subtle px-1.5 py-0.5 text-[10px] text-faint">
            ⌘K
          </span>
        </div>
      </div>

      {/* All three states occupy the same slot so the header never reflows as
          auth resolves. No cookie means guest for certain, so that renders
          immediately; a cookie only suggests a session (it may have expired),
          so that case waits rather than showing a balance that might vanish. */}
      {isLoading ? (
        hadSessionCookie ? (
          <AuthSkeleton />
        ) : (
          <SignedOut />
        )
      ) : user ? (
        <SignedIn user={user} />
      ) : (
        <SignedOut />
      )}
    </header>
  );
}

function AuthSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-2 md:gap-3">
      <div className="size-8 rounded-lg bg-subtle" />
      <div className="h-8 w-24 rounded-lg bg-subtle" />
      <div className="size-8 rounded-full bg-subtle" />
    </div>
  );
}

function SignedOut() {
  return (
    <div className="flex items-center gap-2">
      {/* No notification bell: there is nothing to notify a guest about. */}
      <ButtonLink variant="ghost" size="sm" href="/login">
        Log in
      </ButtonLink>
      <ButtonLink size="sm" href="/register">
        Sign up
      </ButtonLink>
    </div>
  );
}

function SignedIn({ user }: { user: AuthUserResponse }) {
  const logout = useLogout();
  const displayName = user.name ?? user.email;

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline" size="icon-sm" className="relative" />}
        >
          <Bell />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 gap-0 p-0">
          <div className="flex items-center justify-between border-b border-subtle px-4 py-3">
            <span className="text-sm font-semibold">Notifications</span>
            <button className="text-xs font-medium text-primary">
              Mark all read
            </button>
          </div>
          {/* Still mock: there is no notifications endpoint yet. */}
          <div className="max-h-80 overflow-auto">
            {NOTIFICATIONS.map((notification, index) => {
              const Icon = NOTIFICATION_ICONS[notification.icon];
              const tone = NOTIFICATION_TONE[notification.tone];

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 px-4 py-3 not-first:border-t not-first:border-subtle"
                >
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg",
                      tone.well,
                    )}
                  >
                    <Icon className={cn("size-3.5", tone.icon)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{notification.text}</p>
                    <span className="text-xs text-faint">{notification.t}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Link
        href="/wallet"
        className="flex items-center gap-1.5 rounded-lg bg-primary-soft px-2.5 py-1.5 ring-1 ring-primary-line"
      >
        <span className="font-mono text-sm font-semibold text-primary tabular-nums">
          {formatCredits(user.credits)}
        </span>
        <span className="text-xs text-primary">Credits</span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<button className="flex items-center gap-1 rounded-full" />}
        >
          <UserAvatar name={displayName} size={30} />
          <ChevronDown className="size-3.5 text-faint" />
          <span className="sr-only">Account menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2.5 border-b border-subtle px-2 py-2.5">
            <UserAvatar name={displayName} size={32} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{displayName}</div>
              <div className="truncate text-xs text-faint">{user.email}</div>
            </div>
          </div>
          {MENU_ITEMS.map((item) => (
            <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
              <item.icon />
              {item.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
