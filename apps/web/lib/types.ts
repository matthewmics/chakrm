export type Tone = "muted" | "primary" | "gold" | "destructive";

export type Sport =
  | "Basketball"
  | "Soccer"
  | "Football"
  | "Tennis"
  | "Esports";

export type EventStatus = "open" | "closing" | "live";

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
