import {
  Activity,
  CircleDot,
  Goal,
  Swords,
  Volleyball,
  type LucideIcon,
} from "lucide-react";

import type { Sport } from "./types";

// Mock data stores sport names, not components, so it stays free of React
// imports. This map resolves a sport back to a lucide icon.
export const SPORT_ICONS: Record<Sport, LucideIcon> = {
  Basketball: Volleyball,
  Soccer: CircleDot,
  Football: Goal,
  Tennis: Activity,
  Esports: Swords,
};
