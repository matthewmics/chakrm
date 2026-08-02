import {
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  Target,
  Trophy,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { getEventById } from "./mock-data";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/predictions", label: "My Predictions", icon: Target },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/seasons", label: "Seasons", icon: CalendarRange },
  { href: "/profile", label: "Profile", icon: User },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Title shown in the topbar. Match pages resolve to "{a} vs {b}"; anything
 * outside the nav (e.g. /settings) falls back to a title-cased segment.
 */
export function getPageTitle(pathname: string): string {
  const match = pathname.match(/^\/events\/([^/]+)$/);
  if (match) {
    const event = getEventById(match[1]);
    if (event) return `${event.a} vs ${event.b}`;
    return "Match";
  }

  const item = NAV_ITEMS.find((navItem) => isNavItemActive(pathname, navItem.href));
  if (item) return item.label;

  const segment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return segment ? segment[0].toUpperCase() + segment.slice(1) : "Chakrm";
}
