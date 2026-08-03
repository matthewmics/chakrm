import {
  Activity,
  Award,
  CircleDot,
  Clock,
  Crown,
  Flame,
  Gift,
  Goal,
  Laptop,
  LayoutDashboard,
  Medal,
  Smartphone,
  Swords,
  Target,
  Trophy,
  Volleyball,
  type LucideIcon,
} from "lucide-react";

import type {
  BadgeIconName,
  NotificationIconName,
  Session,
  Sport,
} from "./types";

// Mock data stores icon *names*, not components, so the data module stays free
// of React imports. These maps resolve a name back to a lucide component.

export const SPORT_ICONS: Record<Sport, LucideIcon> = {
  Basketball: Volleyball,
  Soccer: CircleDot,
  Football: Goal,
  Tennis: Activity,
  Esports: Swords,
};

export const ALL_SPORTS_ICON = LayoutDashboard;

/**
 * Icons keyed by the API's `Sport.slug`. Sports are rows in the database, so a
 * new one can appear without a frontend change — always read through this map
 * with `DEFAULT_SPORT_ICON` as the fallback, since indexing straight into an
 * undefined component crashes the render.
 */
export const SPORT_ICONS_BY_SLUG: Record<string, LucideIcon> = {
  basketball: Volleyball,
  soccer: CircleDot,
  football: Goal,
  tennis: Activity,
  dota2: Swords,
  cs2: Swords,
};

export const DEFAULT_SPORT_ICON = Trophy;

export const NOTIFICATION_ICONS: Record<NotificationIconName, LucideIcon> = {
  award: Award,
  flame: Flame,
  clock: Clock,
  crown: Crown,
  gift: Gift,
};

export const BADGE_ICONS: Record<BadgeIconName, LucideIcon> = {
  flame: Flame,
  crown: Crown,
  target: Target,
  trophy: Trophy,
  award: Award,
  medal: Medal,
};

export const SESSION_ICONS: Record<Session["icon"], LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
};
