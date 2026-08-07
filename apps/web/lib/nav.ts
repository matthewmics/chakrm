import {
  CalendarDays,
  CalendarRange,
  Home,
  LayoutDashboard,
  Target,
  Trophy,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /**
   * Guests still see these, but the link points at /login?next=<href> rather
   * than the page itself. Hiding them entirely tests worse: someone with no
   * account can't tell what signing up would get them.
   */
  requiresAuth?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/seasons", label: "Seasons", icon: CalendarRange },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requiresAuth: true },
  { href: "/predictions", label: "My Predictions", icon: Target, requiresAuth: true },
  { href: "/wallet", label: "Wallet", icon: Wallet, requiresAuth: true },
  { href: "/profile", label: "Profile", icon: User, requiresAuth: true },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  // "/" would otherwise prefix-match every route and light up permanently.
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Where a nav item points for a given auth state. */
export function navItemHref(item: NavItem, isAuthenticated: boolean): string {
  if (!item.requiresAuth || isAuthenticated) return item.href;

  return `/login?next=${encodeURIComponent(item.href)}`;
}

/**
 * Title shown in the topbar.
 *
 * Event pages are deliberately absent: this used to look the id up in
 * mock-data, which meant every real event from the API fell through to
 * "Match". `/events/[id]` sets its own title instead, and anything unmatched
 * here falls back to a title-cased segment.
 */
export function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Home";

  const item = NAV_ITEMS.find(
    (navItem) => navItem.href !== "/" && isNavItemActive(pathname, navItem.href),
  );
  if (item) return item.label;

  const segment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return segment ? segment[0].toUpperCase() + segment.slice(1) : "Chakrm";
}
