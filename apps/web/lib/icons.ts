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
