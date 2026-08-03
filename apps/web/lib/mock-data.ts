import type {
  AccuracyPoint,
  Achievement,
  ActivityItem,
  Champion,
  ChatMessage,
  EventActivity,
  LeaderboardEntry,
  Notification,
  SeasonHistoryEntry,
  SeasonReward,
  Session,
  SportEvent,
  Transaction,
} from "./types";

// Everything here stands in for the API. Keeping it in one typed module means
// pages stay presentational and swapping in real fetches later is contained.

export const CURRENT_USER = {
  name: "north_bynum",
  email: "north.bynum@example.com",
  credits: 12480,
  rank: 4,
  accuracy: 63,
  streak: 4,
  joined: "March 2025",
};

export const CURRENT_SEASON = {
  name: "Season 4",
  tagline: "Predict. Compete. Climb the Rankings.",
  progress: 78,
  endsIn: { days: "12", hours: "04", mins: "22" },
  participants: "8,412",
  poolVolume: "18.6M",
  rank: "#4",
};

export const PERFORMANCE: AccuracyPoint[] = [
  { d: "Mon", acc: 54 },
  { d: "Tue", acc: 58 },
  { d: "Wed", acc: 51 },
  { d: "Thu", acc: 63 },
  { d: "Fri", acc: 60 },
  { d: "Sat", acc: 68 },
  { d: "Sun", acc: 71 },
];

export const EVENTS: SportEvent[] = [
  {
    id: 1,
    sport: "Basketball",
    league: "NBA",
    a: "Celtics",
    b: "Nuggets",
    time: "Today, 8:40 PM",
    closesIn: "2h 14m",
    pool: 48200,
    participants: 612,
    retA: 61,
    retB: 39,
    status: "open",
    markets: [
      {
        id: "1-winner",
        name: "Match Winner",
        status: "open",
        options: [
          { id: "1-winner-a", name: "Celtics", totalCredits: 29400 },
          { id: "1-winner-b", name: "Nuggets", totalCredits: 18800 },
        ],
      },
      {
        id: "1-total-points",
        name: "Total Points (O/U 215.5)",
        status: "open",
        options: [
          { id: "1-total-points-over", name: "Over 215.5", totalCredits: 12500 },
          { id: "1-total-points-under", name: "Under 215.5", totalCredits: 9800 },
        ],
      },
      {
        id: "1-margin",
        name: "Winning Margin",
        status: "upcoming",
        options: [
          { id: "1-margin-1", name: "1-5 pts", totalCredits: 0 },
          { id: "1-margin-2", name: "6-10 pts", totalCredits: 0 },
          { id: "1-margin-3", name: "11+ pts", totalCredits: 0 },
        ],
      },
    ],
  },
  {
    id: 2,
    sport: "Soccer",
    league: "Premier League",
    a: "Arsenal",
    b: "Man City",
    time: "Tomorrow, 12:30 PM",
    closesIn: "18h 02m",
    pool: 91500,
    participants: 1284,
    retA: 47,
    retB: 53,
    status: "open",
    markets: [
      {
        id: "2-winner",
        name: "Match Winner",
        status: "open",
        options: [
          { id: "2-winner-a", name: "Arsenal", totalCredits: 38000 },
          { id: "2-winner-draw", name: "Draw", totalCredits: 21000 },
          { id: "2-winner-b", name: "Man City", totalCredits: 32500 },
        ],
      },
      {
        id: "2-btts",
        name: "Both Teams to Score",
        status: "open",
        options: [
          { id: "2-btts-yes", name: "Yes", totalCredits: 26000 },
          { id: "2-btts-no", name: "No", totalCredits: 19000 },
        ],
      },
      {
        id: "2-total-goals",
        name: "Total Goals (O/U 2.5)",
        status: "suspended",
        options: [
          { id: "2-total-goals-over", name: "Over 2.5", totalCredits: 24000 },
          { id: "2-total-goals-under", name: "Under 2.5", totalCredits: 21000 },
        ],
      },
    ],
  },
  {
    id: 3,
    sport: "Esports",
    league: "Valorant Champions",
    a: "Sentinels",
    b: "Fnatic",
    time: "Today, 6:00 PM",
    closesIn: "24m",
    pool: 22750,
    participants: 340,
    retA: 55,
    retB: 45,
    status: "closing",
    markets: [
      {
        id: "3-winner",
        name: "Match Winner",
        status: "open",
        options: [
          { id: "3-winner-a", name: "Sentinels", totalCredits: 12500 },
          { id: "3-winner-b", name: "Fnatic", totalCredits: 10250 },
        ],
      },
      {
        id: "3-total-maps",
        name: "Total Maps (O/U 2.5)",
        status: "open",
        options: [
          { id: "3-total-maps-over", name: "Over 2.5", totalCredits: 6200 },
          { id: "3-total-maps-under", name: "Under 2.5", totalCredits: 4100 },
        ],
      },
      {
        id: "3-first-blood",
        name: "First Blood, Map 1",
        status: "suspended",
        options: [
          { id: "3-first-blood-a", name: "Sentinels", totalCredits: 3400 },
          { id: "3-first-blood-b", name: "Fnatic", totalCredits: 2900 },
        ],
      },
    ],
  },
  {
    id: 4,
    sport: "Tennis",
    league: "ATP Masters",
    a: "Alcaraz",
    b: "Sinner",
    time: "Live now",
    closesIn: "closed",
    pool: 63400,
    participants: 803,
    retA: 58,
    retB: 42,
    status: "live",
    markets: [
      {
        id: "4-winner",
        name: "Match Winner",
        status: "live",
        options: [
          { id: "4-winner-a", name: "Alcaraz", totalCredits: 36800 },
          { id: "4-winner-b", name: "Sinner", totalCredits: 26600 },
        ],
      },
      {
        id: "4-total-sets",
        name: "Total Sets (O/U 3.5)",
        status: "live",
        options: [
          { id: "4-total-sets-over", name: "Over 3.5", totalCredits: 14200 },
          { id: "4-total-sets-under", name: "Under 3.5", totalCredits: 9800 },
        ],
      },
      {
        id: "4-first-set",
        name: "First Set Winner",
        status: "settled",
        options: [
          { id: "4-first-set-a", name: "Alcaraz", totalCredits: 8100, isWinningOption: true },
          { id: "4-first-set-b", name: "Sinner", totalCredits: 6300 },
        ],
      },
    ],
  },
  {
    id: 5,
    sport: "Football",
    league: "NFL",
    a: "49ers",
    b: "Cowboys",
    time: "Sun, 4:25 PM",
    closesIn: "2d 6h",
    pool: 128900,
    participants: 1966,
    retA: 52,
    retB: 48,
    status: "open",
    markets: [
      {
        id: "5-winner",
        name: "Match Winner",
        status: "open",
        options: [
          { id: "5-winner-a", name: "49ers", totalCredits: 67000 },
          { id: "5-winner-b", name: "Cowboys", totalCredits: 61900 },
        ],
      },
      {
        id: "5-total-points",
        name: "Total Points (O/U 47.5)",
        status: "open",
        options: [
          { id: "5-total-points-over", name: "Over 47.5", totalCredits: 31000 },
          { id: "5-total-points-under", name: "Under 47.5", totalCredits: 27500 },
        ],
      },
      {
        id: "5-race-to-10",
        name: "Race to 10 Points",
        status: "upcoming",
        options: [
          { id: "5-race-to-10-a", name: "49ers", totalCredits: 0 },
          { id: "5-race-to-10-b", name: "Cowboys", totalCredits: 0 },
        ],
      },
    ],
  },
  {
    id: 6,
    sport: "Basketball",
    league: "NBA",
    a: "Lakers",
    b: "Suns",
    time: "Wed, 9:00 PM",
    closesIn: "4d 1h",
    pool: 35600,
    participants: 498,
    retA: 44,
    retB: 56,
    status: "open",
    markets: [
      {
        id: "6-winner",
        name: "Match Winner",
        status: "open",
        options: [
          { id: "6-winner-a", name: "Lakers", totalCredits: 15700 },
          { id: "6-winner-b", name: "Suns", totalCredits: 19900 },
        ],
      },
      {
        id: "6-total-points",
        name: "Total Points (O/U 224.5)",
        status: "open",
        options: [
          { id: "6-total-points-over", name: "Over 224.5", totalCredits: 9200 },
          { id: "6-total-points-under", name: "Under 224.5", totalCredits: 8600 },
        ],
      },
    ],
  },
];

export function getEventById(id: string | number): SportEvent | undefined {
  return EVENTS.find((event) => event.id === Number(id));
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "kestrel.eth", credits: 284600, roi: 212, acc: 71, streak: 9 },
  { rank: 2, name: "north_bynum", credits: 261100, roi: 188, acc: 68, streak: 4 },
  { rank: 3, name: "vera.codes", credits: 249800, roi: 176, acc: 66, streak: 6 },
  { rank: 4, name: "hallowpine", credits: 198200, roi: 121, acc: 63, streak: 2 },
  { rank: 5, name: "quietriot", credits: 184300, roi: 109, acc: 61, streak: 1 },
  { rank: 6, name: "delta_marsh", credits: 176900, roi: 98, acc: 59, streak: 3 },
  { rank: 7, name: "orsonvale", credits: 162500, roi: 87, acc: 57, streak: 0 },
  { rank: 8, name: "ionpetal", credits: 151100, roi: 74, acc: 55, streak: 5 },
];

export const ACTIVITY: ActivityItem[] = [
  { t: "12m ago", text: "Prediction settled, Celtics ML", delta: "+1,240", positive: true },
  { t: "1h ago", text: "Committed 500 Credits, Sinner to win", delta: "-500", positive: false },
  { t: "3h ago", text: "Daily bonus claimed", delta: "+150", positive: true },
  { t: "Yesterday", text: "Prediction settled, Arsenal Draw No Bet", delta: "-320", positive: false },
  { t: "Yesterday", text: "Rank climbed to #4 Weekly", delta: "", positive: true },
];

export const TRANSACTIONS: Transaction[] = [
  { t: "Today, 2:14 PM", type: "Reward", desc: "Celtics ML, correct prediction", amt: 1240, positive: true },
  { t: "Today, 1:02 PM", type: "Committed", desc: "Sinner to win, ATP Masters", amt: -500, positive: false },
  { t: "Today, 9:00 AM", type: "Bonus", desc: "Daily login bonus", amt: 150, positive: true },
  { t: "Yesterday, 6:40 PM", type: "Returned", desc: "Pool voided, 49ers vs Rams postponed", amt: 300, positive: true },
  { t: "Yesterday, 4:15 PM", type: "Reward", desc: "Arsenal Draw No Bet, correct prediction", amt: -320, positive: false },
  { t: "Mon, 8:30 AM", type: "Bonus", desc: "Daily login bonus", amt: 150, positive: true },
];

export const NOTIFICATIONS: Notification[] = [
  { icon: "award", tone: "primary", text: "Your prediction on Celtics ML settled. You earned 1,240 Credits", t: "12m ago" },
  { icon: "flame", tone: "gold", text: "You're on a 4-prediction win streak. Keep it going.", t: "1h ago" },
  { icon: "clock", tone: "muted", text: "Sentinels vs Fnatic closes in 24 minutes", t: "2h ago" },
  { icon: "crown", tone: "gold", text: "You climbed to #4 on the Weekly leaderboard", t: "Yesterday" },
  { icon: "gift", tone: "primary", text: "Daily bonus is ready to claim", t: "Yesterday" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { icon: "flame", label: "5-Win Streak", earned: true },
  { icon: "crown", label: "Weekly Top 5", earned: true },
  { icon: "target", label: "80% Accuracy Week", earned: true },
  { icon: "trophy", label: "Season Finalist", earned: false },
  { icon: "award", label: "First 10,000 Credits", earned: true },
  { icon: "medal", label: "All-Time Top 100", earned: false },
];

export const SEASON_BADGES: Achievement[] = [
  { icon: "target", label: "Century Club", desc: "Place 100 predictions in a season", earned: true },
  { icon: "award", label: "High Roller", desc: "Commit 1,000+ Credits on a single prediction", earned: true },
  { icon: "flame", label: "Perfect Week", desc: "7 correct predictions in a single week", earned: false, progress: "4/7" },
  { icon: "flame", label: "Iron Streak", desc: "Win 10 predictions in a row", earned: false, progress: "4/10" },
  { icon: "crown", label: "Season MVP", desc: "Finish in the top 10 overall", earned: false, progress: "Currently #4" },
  { icon: "trophy", label: "Champion", desc: "Finish #1 at season end", earned: false },
];

export const SEASON_REWARDS: SeasonReward[] = [
  { rank: "Rank 1", reward: "50,000 Credits", extra: "Gold Champion badge", tone: "gold" },
  { rank: "Rank 2 to 3", reward: "25,000 Credits", extra: "Silver Finalist badge", tone: "gold" },
  { rank: "Rank 4 to 10", reward: "10,000 Credits", extra: "Bronze Top 10 badge", tone: "primary" },
  { rank: "Rank 11 to 100", reward: "2,500 Credits", extra: null, tone: "primary" },
  { rank: "Rank 101 to 1,000", reward: "500 Credits", extra: null, tone: "muted" },
  { rank: "All participants", reward: "Participation badge", extra: null, tone: "muted" },
];

export const SEASON_HISTORY: SeasonHistoryEntry[] = [
  { season: "Season 3", rank: 6, reward: 4200 },
  { season: "Season 2", rank: 14, reward: 1800 },
  { season: "Season 1", rank: 41, reward: 600 },
];

export const CHAMPIONS: Champion[] = [
  { season: "Season 3", champion: "kestrel.eth", credits: 312400 },
  { season: "Season 2", champion: "vera.codes", credits: 268900 },
  { season: "Season 1", champion: "orsonvale", credits: 190200 },
];

export const CHAT_SEED: ChatMessage[] = [
  { id: 1, user: "vera.codes", text: "Defense on the road has been shaky lately, this might be closer than the split suggests", t: "8m ago" },
  { id: 2, user: "delta_marsh", text: "Missing a starting piece though, that changes the math for me", t: "6m ago" },
  { id: 3, user: "quietriot", text: "Locked in my prediction. Good luck everyone", t: "4m ago" },
  { id: 4, user: "orsonvale", text: "This one's going to come down to the fourth quarter", t: "2m ago" },
  { id: 5, user: "kestrel.eth", text: "Anyone else watching the pool shift in real time, it's wild", t: "1m ago" },
];

export const EVENT_ACTIVITY_SEED: EventActivity[] = [
  { user: "north_bynum", side: "a", amount: 250, t: "3m ago" },
  { user: "hallowpine", side: "b", amount: 500, t: "5m ago" },
  { user: "quietriot", side: "a", amount: 100, t: "7m ago" },
  { user: "delta_marsh", side: "b", amount: 300, t: "9m ago" },
  { user: "orsonvale", side: "a", amount: 150, t: "12m ago" },
];

export const SESSIONS_SEED: Session[] = [
  { id: 1, device: "iPhone 15 Pro", icon: "smartphone", location: "Manila, PH", last: "Active now", current: true },
  { id: 2, device: "MacBook Pro, Chrome", icon: "laptop", location: "Manila, PH", last: "2h ago", current: false },
  { id: 3, device: "Windows PC, Edge", icon: "laptop", location: "Cebu, PH", last: "3d ago", current: false },
];

export const FAVORITE_SPORTS = ["Basketball", "Soccer", "Esports", "Tennis"];

/** Reward for each consecutive day of the 7-day daily bonus streak. */
export const DAILY_BONUS_REWARDS = [50, 75, 100, 150, 200, 275, 400];
export const DAILY_BONUS_STREAK_DAY = 4;

// Stylised monogram crests, not real team marks (those are trademarked), so
// each side gets its own gradient pair instead of a logo.
export const TEAM_COLORS: Record<string, [string, string]> = {
  Celtics: ["#0B4D3C", "#0F7A5E"],
  Nuggets: ["#1B2A4A", "#3E5C9A"],
  Arsenal: ["#7A1F2B", "#B0303F"],
  "Man City": ["#1E3A6E", "#4C7BC9"],
  Sentinels: ["#7A1F1F", "#C43A3A"],
  Fnatic: ["#1A1A1A", "#E8A93B"],
  Alcaraz: ["#8A5A1E", "#E3B34F"],
  Sinner: ["#1E4A3A", "#2FA37D"],
  "49ers": ["#7A2020", "#B23A3A"],
  Cowboys: ["#0E1E3A", "#3E5A9E"],
  Lakers: ["#4A2A6E", "#8A55C9"],
  Suns: ["#7A3A10", "#E37A2A"],
};
