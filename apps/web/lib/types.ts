export type Tone = "muted" | "primary" | "gold" | "destructive";

export type Sport =
  | "Basketball"
  | "Soccer"
  | "Football"
  | "Tennis"
  | "Esports";

export type EventStatus = "open" | "closing" | "live";

/**
 * Mirrors the API's `MarketStatus` enum. Status is entirely admin-driven —
 * markets on the same event can sit in different states independently.
 */
export type MarketStatus =
  | "upcoming"
  | "open"
  | "live"
  | "suspended"
  | "settled"
  | "cancelled";

export type MarketOption = {
  id: string;
  name: string;
  /** Credits committed to this option. Implied odds are always derived live. */
  totalCredits: number;
  isWinningOption?: boolean;
};

/** A single bet type on an event, e.g. "Match Winner" or "Total Points". */
export type Market = {
  id: string;
  name: string;
  status: MarketStatus;
  options: MarketOption[];
};

export type SportEvent = {
  id: number;
  sport: Sport;
  league: string;
  /** Home / first side. `retA` is its share of the prediction pool. */
  a: string;
  b: string;
  time: string;
  closesIn: string;
  pool: number;
  participants: number;
  retA: number;
  retB: number;
  status: EventStatus;
  /** Bet types offered on this event, e.g. Match Winner, Total Points. */
  markets: Market[];
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  credits: number;
  roi: number;
  acc: number;
  streak: number;
};

export type ActivityItem = {
  t: string;
  text: string;
  delta: string;
  positive: boolean;
};

export type TransactionType = "Reward" | "Committed" | "Bonus" | "Returned";

export type Transaction = {
  t: string;
  type: TransactionType;
  desc: string;
  amt: number;
  positive: boolean;
};

export type NotificationIconName =
  | "award"
  | "flame"
  | "clock"
  | "crown"
  | "gift";

export type Notification = {
  icon: NotificationIconName;
  tone: Tone;
  text: string;
  t: string;
};

export type BadgeIconName =
  | "flame"
  | "crown"
  | "target"
  | "trophy"
  | "award"
  | "medal";

export type Achievement = {
  icon: BadgeIconName;
  label: string;
  earned: boolean;
  /** Shown in place of the "Earned" pill while still locked. */
  desc?: string;
  progress?: string;
};

export type SeasonHistoryEntry = {
  season: string;
  rank: number;
  reward: number;
};

export type SeasonReward = {
  rank: string;
  reward: string;
  extra: string | null;
  tone: Tone;
};

export type Champion = {
  season: string;
  champion: string;
  credits: number;
};

export type ChatMessage = {
  id: number;
  user: string;
  text: string;
  t: string;
};

export type EventActivity = {
  user: string;
  side: "a" | "b";
  amount: number;
  t: string;
};

export type Session = {
  id: number;
  device: string;
  icon: "smartphone" | "laptop";
  location: string;
  last: string;
  current: boolean;
};

export type AccuracyPoint = {
  d: string;
  acc: number;
};
