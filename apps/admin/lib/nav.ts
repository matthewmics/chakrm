import {
  CalendarDays,
  CheckCircle2,
  Flag,
  History,
  LayoutDashboard,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/teams", label: "Teams", icon: Flag },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/settlements", label: "Settlements", icon: CheckCircle2 },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/audit", label: "Audit Log", icon: History },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string): string {
  const item = NAV_ITEMS.find((navItem) => isNavItemActive(pathname, navItem.href));
  return item?.label ?? "Chakrm Admin";
}
