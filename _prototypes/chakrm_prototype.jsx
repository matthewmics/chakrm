import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, CalendarDays, Target, Wallet as WalletIcon, Trophy,
  CalendarRange, User, Shield, Search, Bell, ChevronDown, Flame,
  TrendingUp, TrendingDown, Award, Clock, Users, ArrowUpRight,
  ArrowDownRight, Gift, Sparkles, Crown, Medal, ChevronRight,
  Dribbble, CircleDot, Swords, Activity, Filter, X, Lock, Eye,
  CheckCircle2, UserX, UserCheck, ChevronLeft, Send, Menu,
  Settings as SettingsIcon, EyeOff, AlertTriangle, LogOut, Smartphone, Laptop,
  Mail, KeyRound, Bot
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";

// ---------------------------------------------------------------------------
// Design tokens (see brief: emerald / slate / gold on dark charcoal)
// ---------------------------------------------------------------------------
const C = {
  bg: "#0A0C0E",
  bgElevated: "#0E1113",
  card: "#141819",
  cardHover: "#181D1F",
  border: "#22282A",
  borderSubtle: "#1A1F21",
  text: "#EDEFF1",
  textMuted: "#9AA3A8",
  textFaint: "#5F686C",
  emerald: "#10B981",
  emeraldSoft: "rgba(16,185,129,0.14)",
  emeraldLine: "rgba(16,185,129,0.35)",
  gold: "#E3B34F",
  goldSoft: "rgba(227,179,79,0.14)",
  red: "#E5675A",
  redSoft: "rgba(229,103,90,0.14)",
};

function useFonts() {
  useEffect(() => {
    const id = "chakrm-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ---------------------------------------------------------------------------
// Guest/auth context, lets any component know if we're in signed-out
// "guest browsing" mode, and gate accordingly.
// ---------------------------------------------------------------------------
const AppContext = React.createContext({
  isGuest: true, isAdmin: false, role: "guest",
  setIsGuest: () => {}, setRole: () => {},
  openEvent: () => {}, closeEvent: () => {},
  mobileNavOpen: false, setMobileNavOpen: () => {},
  openLogin: () => {}, closeLogin: () => {},
});
function useApp() { return React.useContext(AppContext); }

// Pages a signed-out visitor can browse freely.
const PUBLIC_PAGES = ["events", "leaderboards"];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "predictions", label: "My Predictions", icon: Target },
  { key: "wallet", label: "Wallet", icon: WalletIcon },
  { key: "leaderboards", label: "Leaderboards", icon: Trophy },
  { key: "seasons", label: "Seasons", icon: CalendarRange },
  { key: "profile", label: "Profile", icon: User },
  { key: "admin", label: "Admin", icon: Shield },
];

const PERFORMANCE = [
  { d: "Mon", acc: 54 }, { d: "Tue", acc: 58 }, { d: "Wed", acc: 51 },
  { d: "Thu", acc: 63 }, { d: "Fri", acc: 60 }, { d: "Sat", acc: 68 },
  { d: "Sun", acc: 71 },
];

const EVENTS = [
  {
    id: 1, sport: "Basketball", icon: Dribbble, league: "NBA",
    a: "Celtics", b: "Nuggets", time: "Today, 8:40 PM", closesIn: "2h 14m",
    pool: 48200, participants: 612, retA: 61, retB: 39, status: "open",
  },
  {
    id: 2, sport: "Soccer", icon: CircleDot, league: "Premier League",
    a: "Arsenal", b: "Man City", time: "Tomorrow, 12:30 PM", closesIn: "18h 02m",
    pool: 91500, participants: 1284, retA: 47, retB: 53, status: "open",
  },
  {
    id: 3, sport: "Esports", icon: Swords, league: "Valorant Champions",
    a: "Sentinels", b: "Fnatic", time: "Today, 6:00 PM", closesIn: "24m",
    pool: 22750, participants: 340, retA: 55, retB: 45, status: "closing",
  },
  {
    id: 4, sport: "Tennis", icon: Activity, league: "ATP Masters",
    a: "Alcaraz", b: "Sinner", time: "Live now", closesIn: "closed",
    pool: 63400, participants: 803, retA: 58, retB: 42, status: "live",
  },
  {
    id: 5, sport: "Football", icon: Dribbble, league: "NFL",
    a: "49ers", b: "Cowboys", time: "Sun, 4:25 PM", closesIn: "2d 6h",
    pool: 128900, participants: 1966, retA: 52, retB: 48, status: "open",
  },
  {
    id: 6, sport: "Basketball", icon: Dribbble, league: "NBA",
    a: "Lakers", b: "Suns", time: "Wed, 9:00 PM", closesIn: "4d 1h",
    pool: 35600, participants: 498, retA: 44, retB: 56, status: "open",
  },
];

const LEADERBOARD = [
  { rank: 1, name: "kestrel.eth", credits: 284600, roi: 212, acc: 71, streak: 9 },
  { rank: 2, name: "north_bynum", credits: 261100, roi: 188, acc: 68, streak: 4 },
  { rank: 3, name: "vera.codes", credits: 249800, roi: 176, acc: 66, streak: 6 },
  { rank: 4, name: "hallowpine", credits: 198200, roi: 121, acc: 63, streak: 2 },
  { rank: 5, name: "quietriot", credits: 184300, roi: 109, acc: 61, streak: 1 },
  { rank: 6, name: "delta_marsh", credits: 176900, roi: 98, acc: 59, streak: 3 },
  { rank: 7, name: "orsonvale", credits: 162500, roi: 87, acc: 57, streak: 0 },
  { rank: 8, name: "ionpetal", credits: 151100, roi: 74, acc: 55, streak: 5 },
];

const ACTIVITY = [
  { t: "12m ago", text: "Prediction settled, Celtics ML", delta: "+1,240", positive: true },
  { t: "1h ago", text: "Committed 500 Credits, Sinner to win", delta: "-500", positive: false },
  { t: "3h ago", text: "Daily bonus claimed", delta: "+150", positive: true },
  { t: "Yesterday", text: "Prediction settled, Arsenal Draw No Bet", delta: "-320", positive: false },
  { t: "Yesterday", text: "Rank climbed to #4 Weekly", delta: "", positive: true },
];

const TRANSACTIONS = [
  { t: "Today, 2:14 PM", type: "Reward", desc: "Celtics ML, correct prediction", amt: 1240, positive: true },
  { t: "Today, 1:02 PM", type: "Committed", desc: "Sinner to win, ATP Masters", amt: -500, positive: false },
  { t: "Today, 9:00 AM", type: "Bonus", desc: "Daily login bonus", amt: 150, positive: true },
  { t: "Yesterday, 6:40 PM", type: "Returned", desc: "Pool voided, 49ers vs Rams postponed", amt: 300, positive: true },
  { t: "Yesterday, 4:15 PM", type: "Reward", desc: "Arsenal Draw No Bet, correct prediction", amt: -320, positive: false },
  { t: "Mon, 8:30 AM", type: "Bonus", desc: "Daily login bonus", amt: 150, positive: true },
];

const NOTIFICATIONS = [
  { icon: Award, tone: "emerald", text: "Your prediction on Celtics ML settled. You earned 1,240 Credits", t: "12m ago" },
  { icon: Flame, tone: "gold", text: "You're on a 4-prediction win streak. Keep it going.", t: "1h ago" },
  { icon: Clock, tone: "muted", text: "Sentinels vs Fnatic closes in 24 minutes", t: "2h ago" },
  { icon: Crown, tone: "gold", text: "You climbed to #4 on the Weekly leaderboard", t: "Yesterday" },
  { icon: Gift, tone: "emerald", text: "Daily bonus is ready to claim", t: "Yesterday" },
];

const ACHIEVEMENTS = [
  { icon: Flame, label: "5-Win Streak", earned: true },
  { icon: Crown, label: "Weekly Top 5", earned: true },
  { icon: Target, label: "80% Accuracy Week", earned: true },
  { icon: Trophy, label: "Season Finalist", earned: false },
  { icon: Award, label: "First 10,000 Credits", earned: true },
  { icon: Medal, label: "All-Time Top 100", earned: false },
];

const SEASON_HISTORY = [
  { season: "Season 3", rank: 6, reward: 4200 },
  { season: "Season 2", rank: 14, reward: 1800 },
  { season: "Season 1", rank: 41, reward: 600 },
];

const FAVORITE_SPORTS = ["Basketball", "Soccer", "Esports", "Tennis"];

// ---------------------------------------------------------------------------
// Admin mock data
// ---------------------------------------------------------------------------
const ADMIN_STATS = [
  { label: "Total Users", value: "8,412", sub: "+126", icon: Users, tone: "emerald" },
  { label: "Active Events", value: "34", sub: "+5", icon: CalendarDays },
  { label: "Pending Settlements", value: "3", icon: Clock, tone: "gold" },
  { label: "Credits in Circulation", value: "2.4M", sub: "+3.1%", icon: WalletIcon, tone: "emerald" },
  { label: "Predictions Today", value: "1,982", sub: "+240", icon: Target, tone: "emerald" },
  { label: "Season Pool Volume", value: "18.6M", icon: Trophy, tone: "gold" },
];

const ADMIN_VOLUME = [
  { d: "Mon", v: 210 }, { d: "Tue", v: 260 }, { d: "Wed", v: 240 },
  { d: "Thu", v: 300 }, { d: "Fri", v: 340 }, { d: "Sat", v: 410 }, { d: "Sun", v: 380 },
];

const ADMIN_USERS = [
  { id: 1, name: "kestrel.eth", credits: 284600, acc: 71, role: "User", status: "Active", joined: "Mar 2025" },
  { id: 2, name: "north_bynum", credits: 261100, acc: 68, role: "User", status: "Active", joined: "Mar 2025" },
  { id: 3, name: "vera.codes", credits: 249800, acc: 66, role: "User", status: "Active", joined: "Apr 2025" },
  { id: 4, name: "hallowpine", credits: 198200, acc: 63, role: "User", status: "Suspended", joined: "Apr 2025" },
  { id: 5, name: "quietriot", credits: 184300, acc: 61, role: "User", status: "Active", joined: "May 2025" },
  { id: 6, name: "admin_ops", credits: 0, acc: 0, role: "Admin", status: "Active", joined: "Jan 2025" },
  { id: 7, name: "delta_marsh", credits: 176900, acc: 59, role: "User", status: "Active", joined: "May 2025" },
  { id: 8, name: "orsonvale", credits: 162500, acc: 57, role: "User", status: "Suspended", joined: "Jun 2025" },
];

const ADMIN_EVENTS = [
  { id: 1, league: "NBA", a: "Celtics", b: "Nuggets", pool: 48200, participants: 612, status: "Open" },
  { id: 2, league: "Premier League", a: "Arsenal", b: "Man City", pool: 91500, participants: 1284, status: "Open" },
  { id: 3, league: "Valorant Champions", a: "Sentinels", b: "Fnatic", pool: 22750, participants: 340, status: "Closing" },
  { id: 4, league: "ATP Masters", a: "Alcaraz", b: "Sinner", pool: 63400, participants: 803, status: "Live" },
  { id: 5, league: "NFL", a: "49ers", b: "Cowboys", pool: 128900, participants: 1966, status: "Open" },
  { id: 6, league: "NBA", a: "Lakers", b: "Suns", pool: 35600, participants: 498, status: "Settled" },
  { id: 7, league: "Premier League", a: "Chelsea", b: "Spurs", pool: 41200, participants: 560, status: "Voided" },
];

const ADMIN_SETTLEMENTS = [
  { id: 101, league: "NBA", a: "Celtics", b: "Nuggets", poolA: 29400, poolB: 18800, closed: "2h ago" },
  { id: 102, league: "Valorant Champions", a: "Sentinels", b: "Fnatic", poolA: 12500, poolB: 10250, closed: "40m ago" },
  { id: 103, league: "ATP Masters", a: "Alcaraz", b: "Sinner", poolA: 36800, poolB: 26600, closed: "10m ago" },
];

const ADMIN_CHAMPIONS = [
  { season: "Season 3", champion: "kestrel.eth", credits: 312400 },
  { season: "Season 2", champion: "vera.codes", credits: 268900 },
  { season: "Season 1", champion: "orsonvale", credits: 190200 },
];

// ---------------------------------------------------------------------------
// Seasons page (seed data)
// ---------------------------------------------------------------------------
const SEASON_BADGES = [
  { icon: Target, label: "Century Club", desc: "Place 100 predictions in a season", earned: true },
  { icon: Award, label: "High Roller", desc: "Commit 1,000+ Credits on a single prediction", earned: true },
  { icon: Flame, label: "Perfect Week", desc: "7 correct predictions in a single week", earned: false, progress: "4/7" },
  { icon: Flame, label: "Iron Streak", desc: "Win 10 predictions in a row", earned: false, progress: "4/10" },
  { icon: Crown, label: "Season MVP", desc: "Finish in the top 10 overall", earned: false, progress: "Currently #4" },
  { icon: Trophy, label: "Champion", desc: "Finish #1 at season end", earned: false },
];

const SEASON_REWARDS = [
  { rank: "Rank 1", reward: "50,000 Credits", extra: "Gold Champion badge", tone: "gold" },
  { rank: "Rank 2 to 3", reward: "25,000 Credits", extra: "Silver Finalist badge", tone: "gold" },
  { rank: "Rank 4 to 10", reward: "10,000 Credits", extra: "Bronze Top 10 badge", tone: "emerald" },
  { rank: "Rank 11 to 100", reward: "2,500 Credits", extra: null, tone: "emerald" },
  { rank: "Rank 101 to 1,000", reward: "500 Credits", extra: null, tone: "muted" },
  { rank: "All participants", reward: "Participation badge", extra: null, tone: "muted" },
];

// ---------------------------------------------------------------------------
// Match detail: live chat and recent prediction activity (seed data)
// ---------------------------------------------------------------------------
const CHAT_SEED = [
  { id: 1, user: "vera.codes", text: "Defense on the road has been shaky lately, this might be closer than the split suggests", t: "8m ago" },
  { id: 2, user: "delta_marsh", text: "Missing a starting piece though, that changes the math for me", t: "6m ago" },
  { id: 3, user: "quietriot", text: "Locked in my prediction. Good luck everyone", t: "4m ago" },
  { id: 4, user: "orsonvale", text: "This one's going to come down to the fourth quarter", t: "2m ago" },
  { id: 5, user: "kestrel.eth", text: "Anyone else watching the pool shift in real time, it's wild", t: "1m ago" },
];

const EVENT_ACTIVITY_SEED = [
  { user: "north_bynum", side: "a", amount: 250, t: "3m ago" },
  { user: "hallowpine", side: "b", amount: 500, t: "5m ago" },
  { user: "quietriot", side: "a", amount: 100, t: "7m ago" },
  { user: "delta_marsh", side: "b", amount: 300, t: "9m ago" },
  { user: "orsonvale", side: "a", amount: 150, t: "12m ago" },
];

// ---------------------------------------------------------------------------
// Settings: active sessions (seed data)
// ---------------------------------------------------------------------------
const SESSIONS_SEED = [
  { id: 1, device: "iPhone 15 Pro", icon: Smartphone, location: "Manila, PH", last: "Active now", current: true },
  { id: 2, device: "MacBook Pro, Chrome", icon: Laptop, location: "Manila, PH", last: "2h ago", current: false },
  { id: 3, device: "Windows PC, Edge", icon: Laptop, location: "Cebu, PH", last: "3d ago", current: false },
];

// ---------------------------------------------------------------------------
// AI support widget, knowledge base
// The assistant only answers from what's here, Chakrm's own product
// knowledge, rather than pretending to know live sports facts or scores it
// has no way to look up.
// ---------------------------------------------------------------------------
const SUPPORT_FAQ = [
  {
    keywords: ["credit", "credits"],
    reply: "Credits are Chakrm's virtual currency. You use them to make predictions and earn more when a prediction settles correctly. They're not real money, Chakrm isn't a gambling product.",
  },
  {
    keywords: ["payout", "odds", "return", "multiplier"],
    reply: "Payouts are pari-mutuel: your potential return depends on how many Credits are on your side versus the total pool. The Match page shows live odds and an estimated payout as you adjust your stake, before you confirm anything.",
  },
  {
    keywords: ["predict", "prediction", "how do i", "place a"],
    reply: "Open any match, pick a side, choose an amount, then confirm. You can browse matches as a guest, but you'll need to sign in to actually place a prediction.",
  },
  {
    keywords: ["pool"],
    reply: "A prediction pool is the total Credits committed to a match. It's split between the two outcomes, and that split is what determines the odds and payouts for everyone in it.",
  },
  {
    keywords: ["settle", "settlement", "result", "when do i get"],
    reply: "Predictions settle once a match ends and an admin confirms the result. Correct predictions get their share of the pool, you'll see it reflected in your Wallet and Recent Activity.",
  },
  {
    keywords: ["wallet", "balance", "transaction"],
    reply: "Your Wallet shows your current Credits balance and a full history, bonuses, committed Credits, and rewards from settled predictions.",
  },
  {
    keywords: ["daily bonus", "bonus", "streak"],
    reply: "The Daily Bonus on your Dashboard grows for 7 consecutive days you claim it, then resets. Miss a day and the streak starts over.",
  },
  {
    keywords: ["guest", "sign in", "account", "log in", "login"],
    reply: "You can browse Events and Leaderboards without an account. Signing in unlocks placing predictions, chat, your Dashboard, Wallet, and Profile.",
  },
  {
    keywords: ["gambling", "real money", "cash out", "withdraw"],
    reply: "Chakrm isn't a real-money gambling product. Credits can't be purchased with or exchanged for cash, they're used purely to compete on the leaderboards.",
  },
  {
    keywords: ["leaderboard", "rank"],
    reply: "Leaderboards rank players by Credits and Return Rate across Daily, Weekly, Monthly, Season, and All-Time views. They're public, so anyone can check the standings.",
  },
];

function getSupportReply(message) {
  const lower = message.toLowerCase();
  const match = SUPPORT_FAQ.find((f) => f.keywords.some((k) => lower.includes(k)));
  if (match) return match.reply;
  return "I can help with questions about Credits, predictions, pools, payouts, or your account. Try one of the suggestions below, or ask me something like \"how do payouts work?\"";
}

const SUPPORT_SUGGESTIONS = [
  "How do Credits work?",
  "How are payouts calculated?",
  "How do I place a prediction?",
  "Is this real-money gambling?",
];

// Distinct crest colors per team (stylized monogram badges, not real logos,
// real team marks are trademarked, so we design our own crest look instead).
const TEAM_COLORS = {
  Celtics: ["#0B4D3C", "#0F7A5E"], Nuggets: ["#1B2A4A", "#3E5C9A"],
  Arsenal: ["#7A1F2B", "#B0303F"], "Man City": ["#1E3A6E", "#4C7BC9"],
  Sentinels: ["#7A1F1F", "#C43A3A"], Fnatic: ["#1A1A1A", "#E8A93B"],
  Alcaraz: ["#8A5A1E", "#E3B34F"], Sinner: ["#1E4A3A", "#2FA37D"],
  "49ers": ["#7A2020", "#B23A3A"], Cowboys: ["#0E1E3A", "#3E5A9E"],
  Lakers: ["#4A2A6E", "#8A55C9"], Suns: ["#7A3A10", "#E37A2A"],
};

function TeamBadge({ name, size = 36 }) {
  const [c1, c2] = TEAM_COLORS[name] || [C.emeraldSoft, C.goldSoft];
  const initials = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").map((s) => s[0]).join("").slice(0, 3).toUpperCase();
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.32,
        background: `linear-gradient(150deg, ${c1}, ${c2})`,
        color: "#F5F7F6",
        border: `1px solid ${C.border}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        letterSpacing: "-0.02em",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function Badge({ children, tone = "muted" }) {
  const tones = {
    muted: { bg: C.borderSubtle, fg: C.textMuted },
    emerald: { bg: C.emeraldSoft, fg: C.emerald },
    gold: { bg: C.goldSoft, fg: C.gold },
    red: { bg: C.redSoft, fg: C.red },
  };
  const s = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide"
      style={{ background: s.bg, color: s.fg }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "", hover = false, style = {}, onClick }) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: C.card,
        borderColor: C.border,
        transition: "border-color .15s ease, background .15s ease",
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (hover) e.currentTarget.style.background = C.cardHover; }}
      onMouseLeave={(e) => { if (hover) e.currentTarget.style.background = C.card; }}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, tone = "default" }) {
  const accent = tone === "gold" ? C.gold : tone === "emerald" ? C.emerald : C.textMuted;
  return (
    <Card className="p-4 flex flex-col gap-3" hover>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>{label}</span>
        {Icon && <Icon size={15} style={{ color: accent }} />}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
          {value}
        </span>
        {sub && (
          <span className="text-[12px] font-medium flex items-center gap-0.5"
            style={{ color: sub.startsWith("-") ? C.red : C.emerald }}>
            {sub.startsWith("-") ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            {sub}
          </span>
        )}
      </div>
    </Card>
  );
}

// The signature element: a split "pool bar" showing credits committed to each side.
function PoolBar({ a, b, retA, retB, height = 8 }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-[12px]" style={{ color: C.textMuted }}>
        <span className="font-medium" style={{ color: C.text }}>{a} <span style={{ color: C.emerald }}>{retA}%</span></span>
        <span className="font-medium" style={{ color: C.text }}>{retB}% <span style={{ color: C.gold }}>{b}</span></span>
      </div>
      <div className="w-full rounded-full overflow-hidden flex" style={{ height, background: C.borderSubtle }}>
        <div style={{ width: `${retA}%`, background: C.emerald }} />
        <div style={{ width: `${retB}%`, background: C.gold }} />
      </div>
    </div>
  );
}

function Avatar({ name, size = 32, ring = false }) {
  const initials = name.split(/[._]/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${C.emeraldSoft}, ${C.goldSoft})`,
        color: C.text, border: ring ? `2px solid ${C.gold}` : `1px solid ${C.border}`,
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell: Sidebar + Topbar
// ---------------------------------------------------------------------------
function SidebarNavContent({ active, setActive, onNavigate }) {
  const { isGuest, isAdmin, openLogin } = useApp();
  const mainNav = NAV.filter((item) => item.key !== "admin");
  const adminNav = NAV.find((item) => item.key === "admin");

  const go = (key) => {
    setActive(key);
    if (onNavigate) onNavigate();
  };

  return (
    <>
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.emerald }}>
          <span className="text-[13px] font-bold" style={{ color: "#04140D" }}>C</span>
        </div>
        <span className="font-semibold text-[15px] tracking-tight" style={{ color: C.text }}>Chakrm</span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {mainNav.map((item) => {
          const isActive = active === item.key;
          const gated = isGuest && !PUBLIC_PAGES.includes(item.key);
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium text-left transition-colors"
              style={{
                color: isActive ? C.text : gated ? C.textFaint : C.textMuted,
                background: isActive ? C.card : "transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = C.borderSubtle; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={16} style={{ color: isActive ? C.emerald : C.textFaint }} />
              <span className="flex-1">{item.label}</span>
              {gated && <Lock size={11} style={{ color: C.textFaint }} />}
            </button>
          );
        })}

        {isAdmin && adminNav && (
          <>
            <div className="my-2 px-2.5 flex items-center gap-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: C.textFaint }}>Admin</span>
              <div className="flex-1 h-px" style={{ background: C.borderSubtle }} />
            </div>
            <button
              onClick={() => go(adminNav.key)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium text-left transition-colors"
              style={{
                color: active === adminNav.key ? C.text : C.textMuted,
                background: active === adminNav.key ? C.card : "transparent",
              }}
              onMouseEnter={(e) => { if (active !== adminNav.key) e.currentTarget.style.background = C.borderSubtle; }}
              onMouseLeave={(e) => { if (active !== adminNav.key) e.currentTarget.style.background = "transparent"; }}
            >
              <adminNav.icon size={16} style={{ color: active === adminNav.key ? C.gold : C.textFaint }} />
              <span className="flex-1">{adminNav.label}</span>
            </button>
          </>
        )}
      </nav>

      <div className="mt-auto">
        {isGuest ? (
          <Card className="p-3 flex flex-col gap-2" style={{ borderColor: C.emeraldLine, background: C.emeraldSoft }}>
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} style={{ color: C.emerald }} />
              <span className="text-[12px] font-semibold" style={{ color: C.text }}>Browsing as guest</span>
            </div>
            <span className="text-[11.5px]" style={{ color: C.textMuted }}>Sign in to get Credits, track your rank, and start predicting.</span>
            <button
              onClick={() => { openLogin(); if (onNavigate) onNavigate(); }}
              className="mt-1 py-1.5 rounded-lg text-[12px] font-semibold"
              style={{ background: C.emerald, color: "#04140D" }}
            >
              Sign in
            </button>
          </Card>
        ) : (
          <Card className="p-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} style={{ color: C.gold }} />
              <span className="text-[12px] font-semibold" style={{ color: C.text }}>Season 4</span>
            </div>
            <span className="text-[11.5px]" style={{ color: C.textMuted }}>Ends in 12 days. Climb to lock in your badge tier.</span>
          </Card>
        )}
      </div>
    </>
  );
}

function Sidebar({ active, setActive }) {
  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-full border-r px-3 py-4"
      style={{ background: C.bgElevated, borderColor: C.borderSubtle }}
    >
      <SidebarNavContent active={active} setActive={setActive} />
    </aside>
  );
}

// Mobile-only slide-in drawer, reachable via the hamburger button in Topbar.
function MobileNavDrawer({ active, setActive }) {
  const { mobileNavOpen, setMobileNavOpen } = useApp();
  if (!mobileNavOpen) return null;
  return (
    <div className="md:hidden fixed inset-0" style={{ zIndex: 60 }}>
      <div className="absolute inset-0" style={{ background: "rgba(6,8,9,0.65)" }} onClick={() => setMobileNavOpen(false)} />
      <div
        className="absolute left-0 top-0 bottom-0 flex flex-col px-3 py-4"
        style={{ width: 260, background: C.bgElevated, borderRight: `1px solid ${C.borderSubtle}` }}
      >
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textFaint }}>Menu</span>
          <button onClick={() => setMobileNavOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.card }}>
            <X size={13} style={{ color: C.textMuted }} />
          </button>
        </div>
        <SidebarNavContent active={active} setActive={setActive} onNavigate={() => setMobileNavOpen(false)} />
      </div>
    </div>
  );
}

function Topbar({ title, setActive }) {
  const [open, setOpen] = useState(null); // "notif" | "profile" | null
  const { isGuest, isAdmin, role, setRole, setMobileNavOpen, openLogin } = useApp();
  const displayName = isAdmin ? "admin_ops" : "north_bynum";

  const cycleRole = () => {
    const order = ["guest", "user", "admin"];
    setRole(order[(order.indexOf(role) + 1) % order.length]);
  };

  return (
    <header
      className="h-14 shrink-0 flex items-center justify-between px-4 md:px-6 border-b relative"
      style={{ background: C.bgElevated, borderColor: C.borderSubtle, zIndex: 30 }}
    >
      {open && (
        <div className="fixed inset-0" style={{ zIndex: 20 }} onClick={() => setOpen(null)} />
      )}

      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="md:hidden w-8 h-8 -ml-1 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <Menu size={15} style={{ color: C.textMuted }} />
        </button>
        <span className="font-semibold text-[15px] md:hidden" style={{ color: C.text }}>Chakrm</span>
        <span className="hidden md:block font-semibold text-[15px] tracking-tight" style={{ color: C.text }}>{title}</span>
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg w-72"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <Search size={14} style={{ color: C.textFaint }} />
          <span className="text-[13px]" style={{ color: C.textFaint }}>Search events, players…</span>
          <span className="ml-auto text-[10.5px] px-1.5 py-0.5 rounded" style={{ color: C.textFaint, background: C.borderSubtle }}>⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Prototype-only control, flips the demo between guest, user, and admin views */}
        <button
          onClick={cycleRole}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
          style={{ border: `1px dashed ${C.border}`, color: C.textFaint }}
          title="Prototype-only: cycle guest / user / admin view"
        >
          <Eye size={12} /> Preview: {isAdmin ? "Admin" : isGuest ? "Guest" : "User"}
        </button>

        {isGuest ? (
          <div className="flex items-center gap-2">
            <button
              onClick={openLogin}
              className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
              style={{ color: C.text, border: `1px solid ${C.border}`, background: C.card }}
            >
              Log in
            </button>
            <button
              onClick={openLogin}
              className="px-3 py-1.5 rounded-lg text-[12.5px] font-semibold"
              style={{ background: C.emerald, color: "#04140D" }}
            >
              Sign up
            </button>
          </div>
        ) : (
          <>
            <div className="relative" style={{ zIndex: 30 }}>
              <button
                onClick={() => setOpen(open === "notif" ? null : "notif")}
                className="relative w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: open === "notif" ? C.cardHover : C.card, border: `1px solid ${C.border}` }}
              >
                <Bell size={14} style={{ color: C.textMuted }} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: C.emerald }} />
              </button>
              {open === "notif" && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border overflow-hidden shadow-2xl"
                  style={{ background: C.bgElevated, borderColor: C.border }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                    <span className="text-[13px] font-semibold" style={{ color: C.text }}>Notifications</span>
                    <button className="text-[11.5px] font-medium" style={{ color: C.emerald }}>Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {NOTIFICATIONS.map((n, i) => {
                      const NIcon = n.icon;
                      const tone = n.tone === "emerald" ? C.emerald : n.tone === "gold" ? C.gold : C.textMuted;
                      const toneSoft = n.tone === "emerald" ? C.emeraldSoft : n.tone === "gold" ? C.goldSoft : C.borderSubtle;
                      return (
                        <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: toneSoft }}>
                            <NIcon size={13} style={{ color: tone }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12.5px] leading-snug" style={{ color: C.text }}>{n.text}</p>
                            <span className="text-[11px]" style={{ color: C.textFaint }}>{n.t}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {isAdmin ? (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: C.goldSoft, border: `1px solid ${C.gold}55` }}
              >
                <Shield size={12} style={{ color: C.gold }} />
                <span className="text-[11px] font-semibold" style={{ color: C.gold }}>Admin</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: C.emeraldSoft, border: `1px solid ${C.emeraldLine}` }}
              >
                <span className="text-[12.5px] font-semibold tabular-nums" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                  12,480
                </span>
                <span className="text-[11px]" style={{ color: C.emerald }}>Credits</span>
              </div>
            )}

            <div className="relative" style={{ zIndex: 30 }}>
              <button
                onClick={() => setOpen(open === "profile" ? null : "profile")}
                className="flex items-center gap-1 rounded-full"
              >
                <Avatar name={displayName} size={30} />
                <ChevronDown size={13} style={{ color: C.textFaint }} />
              </button>
              {open === "profile" && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border overflow-hidden shadow-2xl"
                  style={{ background: C.bgElevated, borderColor: C.border }}>
                  <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                    <Avatar name={displayName} size={32} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold truncate" style={{ color: C.text }}>{displayName}</span>
                        {isAdmin && <Badge tone="gold">Admin</Badge>}
                      </div>
                      <div className="text-[11.5px] truncate" style={{ color: C.textFaint }}>{isAdmin ? "Platform administrator" : "Rank #4 · Weekly"}</div>
                    </div>
                  </div>
                  <div className="py-1">
                    {(isAdmin
                      ? [
                          { label: "Admin dashboard", icon: Shield, action: () => setActive("admin") },
                          { label: "View profile", icon: User, action: () => setActive("profile") },
                          { label: "Settings", icon: SettingsIcon, action: () => setActive("settings") },
                        ]
                      : [
                          { label: "View profile", icon: User, action: () => setActive("profile") },
                          { label: "Wallet", icon: WalletIcon, action: () => setActive("wallet") },
                          { label: "Settings", icon: SettingsIcon, action: () => setActive("settings") },
                        ]
                    ).map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setOpen(null); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[12.5px] text-left"
                        style={{ color: C.textMuted }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.color = C.text; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}
                      >
                        <item.icon size={14} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="py-1" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
                    <button
                      onClick={() => setOpen(null)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[12.5px] text-left"
                      style={{ color: C.red }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = C.redSoft; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <X size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Dashboard page
// ---------------------------------------------------------------------------
const DAILY_BONUS_REWARDS = [50, 75, 100, 150, 200, 275, 400];

function DashboardPage() {
  const streakDay = 4;
  const [todayClaimed, setTodayClaimed] = useState(false);
  const todayReward = DAILY_BONUS_REWARDS[streakDay - 1];

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 flex flex-col gap-4" style={{ background: `linear-gradient(160deg, ${C.card}, ${C.card} 55%, ${C.goldSoft})` }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.goldSoft }}>
              <Gift size={17} style={{ color: C.gold }} />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Daily bonus</h3>
              <span className="text-[12px]" style={{ color: C.textMuted }}>
                Day {streakDay} of 7. Come back daily and your reward grows.
              </span>
            </div>
          </div>
          {todayClaimed ? (
            <button
              disabled
              className="px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5"
              style={{ background: C.emeraldSoft, color: C.emerald, border: `1px solid ${C.emeraldLine}` }}
            >
              <CheckCircle2 size={14} /> Claimed for today
            </button>
          ) : (
            <button
              onClick={() => setTodayClaimed(true)}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold"
              style={{ background: C.gold, color: "#241A05" }}
            >
              Claim +{todayReward}
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {DAILY_BONUS_REWARDS.map((amt, i) => {
            const day = i + 1;
            const isClaimed = day < streakDay || (day === streakDay && todayClaimed);
            const isToday = day === streakDay && !todayClaimed;
            const isFuture = day > streakDay;
            return (
              <div
                key={day}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border"
                style={{
                  borderColor: isToday ? C.gold : isClaimed ? C.emeraldLine : C.border,
                  background: isToday ? C.goldSoft : isClaimed ? C.emeraldSoft : C.card,
                  opacity: isFuture ? 0.55 : 1,
                }}
              >
                {isClaimed ? (
                  <CheckCircle2 size={16} style={{ color: C.emerald }} />
                ) : isToday ? (
                  <Gift size={16} style={{ color: C.gold }} />
                ) : (
                  <Lock size={13} style={{ color: C.textFaint }} />
                )}
                <span className="text-[10px] font-medium" style={{ color: isToday ? C.gold : C.textFaint }}>
                  {day === 7 ? "Day 7" : `Day ${day}`}
                </span>
                <span
                  className="text-[12px] font-semibold tabular-nums"
                  style={{ color: isClaimed ? C.emerald : isToday ? C.gold : C.textFaint, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  +{amt}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Current Credits" value="12,480" sub="+840" icon={WalletIcon} tone="emerald" />
        <StatCard label="Current Rank" value="#4" sub="+2" icon={Crown} tone="gold" />
        <StatCard label="Weekly Rank" value="#7" sub="-1" icon={Trophy} />
        <StatCard label="Monthly Rank" value="#12" sub="+5" icon={Trophy} />
        <StatCard label="Prediction Accuracy" value="63%" sub="+4%" icon={Target} tone="emerald" />
        <StatCard label="Win Streak" value="4" sub="+1" icon={Flame} tone="gold" />
        <StatCard label="Total Rewards" value="38,210" sub="+1,240" icon={Award} tone="emerald" />
        <StatCard label="Daily Rank" value="#2" sub="+3" icon={Medal} tone="gold" />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Prediction accuracy</h3>
            <span className="text-[12px]" style={{ color: C.textMuted }}>Last 7 days</span>
          </div>
          <Badge tone="emerald">+9% this week</Badge>
        </div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.emerald} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.borderSubtle} vertical={false} />
              <XAxis dataKey="d" tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[40, 80]} />
              <Tooltip
                contentStyle={{ background: C.bgElevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: C.textMuted }}
                itemStyle={{ color: C.emerald }}
              />
              <Area type="monotone" dataKey="acc" stroke={C.emerald} strokeWidth={2} fill="url(#acc)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Featured pools</h3>
            <button className="text-[12.5px] flex items-center gap-1" style={{ color: C.textMuted }}>View all <ChevronRight size={13} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {EVENTS.slice(0, 2).map((e) => <EventCard key={e.id} e={e} compact />)}
          </div>

          <h3 className="text-[14px] font-semibold mt-2" style={{ color: C.text }}>Recent activity</h3>
          <Card className="p-2">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.positive ? C.emerald : C.red }} />
                <span className="text-[13px] flex-1" style={{ color: C.text }}>{a.text}</span>
                {a.delta && (
                  <span className="text-[12.5px] font-medium tabular-nums" style={{ color: a.positive ? C.emerald : C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                    {a.delta}
                  </span>
                )}
                <span className="text-[11.5px] w-16 text-right shrink-0" style={{ color: C.textFaint }}>{a.t}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Leaderboard</h3>
            <button className="text-[12.5px] flex items-center gap-1" style={{ color: C.textMuted }}>See all <ChevronRight size={13} /></button>
          </div>
          <Card className="p-2">
            {LEADERBOARD.slice(0, 5).map((u, i) => (
              <div key={u.rank} className="flex items-center gap-3 px-2 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                <span className="w-5 text-[12.5px] font-semibold tabular-nums text-center"
                  style={{ color: u.rank <= 3 ? C.gold : C.textFaint }}>{u.rank}</span>
                <Avatar name={u.name} size={26} />
                <span className="text-[13px] flex-1 truncate" style={{ color: C.text }}>{u.name}</span>
                <span className="text-[12.5px] font-medium tabular-nums" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                  {u.credits.toLocaleString()}
                </span>
              </div>
            ))}
          </Card>

          <h3 className="text-[14px] font-semibold mt-1" style={{ color: C.text }}>Upcoming</h3>
          <Card className="p-2">
            {EVENTS.slice(2, 5).map((e, i) => (
              <div key={e.id} className="flex items-center gap-3 px-2 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                <e.icon size={14} style={{ color: C.textFaint }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] truncate" style={{ color: C.text }}>{e.a} vs {e.b}</div>
                  <div className="text-[11px]" style={{ color: C.textFaint }}>{e.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Events page
// ---------------------------------------------------------------------------
// Decimal odds derived from the current pool split (a 5% platform fee is
// baked in, matching the payout math used on the match detail page).
function decimalOdds(sharePercent) {
  const feeRate = 0.05;
  if (!sharePercent) return "-";
  return (((100 * (1 - feeRate)) / sharePercent)).toFixed(2);
}

function statusBadge(status) {
  if (status === "live") return <Badge tone="red">● Live</Badge>;
  if (status === "closing") return <Badge tone="gold">Closing soon</Badge>;
  return <Badge tone="emerald">Open</Badge>;
}

function EventCard({ e, compact = false }) {
  const Icon = e.icon;
  const { openEvent } = useApp();
  const closing = e.status === "closing";
  const live = e.status === "live";
  return (
    <Card
      className="p-4 flex flex-col gap-4 cursor-pointer"
      hover
      onClick={() => openEvent(e)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: C.borderSubtle }}>
            <Icon size={12} style={{ color: C.textMuted }} />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textFaint }}>{e.league}</span>
        </div>
        {statusBadge(e.status)}
      </div>

      <div className="flex items-center">
        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamBadge name={e.a} size={44} />
          <span className="text-[12.5px] font-semibold text-center leading-tight" style={{ color: C.text }}>{e.a}</span>
          <span
            className="text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded"
            style={{ color: C.emerald, background: C.emeraldSoft, fontFamily: "'JetBrains Mono', monospace" }}
          >
            x{decimalOdds(e.retA)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 px-1">
          <span className="text-[10px] font-semibold" style={{ color: C.textFaint }}>{live ? "LIVE" : "VS"}</span>
          <div className="w-px h-7" style={{ background: C.borderSubtle }} />
        </div>
        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamBadge name={e.b} size={44} />
          <span className="text-[12.5px] font-semibold text-center leading-tight" style={{ color: C.text }}>{e.b}</span>
          <span
            className="text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded"
            style={{ color: C.emerald, background: C.emeraldSoft, fontFamily: "'JetBrains Mono', monospace" }}
          >
            x{decimalOdds(e.retB)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11.5px]" style={{ color: closing ? C.gold : C.textMuted }}>
        <Clock size={12} />
        <span>{live ? "In progress" : e.time}</span>
        {!live && <span style={{ color: C.textFaint }}>· closes in {e.closesIn}</span>}
      </div>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
        <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: C.textFaint }}>
          <Users size={12} /> {e.participants.toLocaleString()} predicting
        </span>
        {!compact && (
          <button
            onClick={(evt) => { evt.stopPropagation(); openEvent(e); }}
            className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
            style={{ background: C.emerald, color: "#04140D" }}
          >
            View match
          </button>
        )}
      </div>
    </Card>
  );
}

const SPORT_FILTER_ICONS = {
  "All sports": LayoutDashboard,
  Basketball: Dribbble,
  Soccer: CircleDot,
  Football: Dribbble,
  Tennis: Activity,
  Esports: Swords,
};

function EventsPage() {
  const [sport, setSport] = useState("All sports");
  const sports = ["All sports", "Basketball", "Soccer", "Football", "Tennis", "Esports"];
  const filtered = sport === "All sports" ? EVENTS : EVENTS.filter((e) => e.sport === sport);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {sports.map((s) => {
            const SportIcon = SPORT_FILTER_ICONS[s];
            return (
              <button
                key={s}
                onClick={() => setSport(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
                style={{
                  background: sport === s ? C.emeraldSoft : C.card,
                  color: sport === s ? C.emerald : C.textMuted,
                  border: `1px solid ${sport === s ? C.emeraldLine : C.border}`,
                }}
              >
                <SportIcon size={13} />
                {s}
              </button>
            );
          })}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
          style={{ background: C.card, color: C.textMuted, border: `1px solid ${C.border}` }}>
          <Filter size={12} /> Status & date
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((e) => <EventCard key={e.id} e={e} />)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Match detail (View Match): prediction slip and live chat
// ---------------------------------------------------------------------------
function estimatePayout(amount, side, poolA, poolB) {
  const amt = Number(amount) || 0;
  if (!side || amt <= 0) return { payout: 0, profit: 0 };
  const feeRate = 0.05;
  const sidePoolBefore = side === "a" ? poolA : poolB;
  const sidePoolAfter = sidePoolBefore + amt;
  const totalAfter = poolA + poolB + amt;
  const distributable = totalAfter * (1 - feeRate);
  const payout = (amt / sidePoolAfter) * distributable;
  return { payout, profit: payout - amt };
}

function EventDetailPage({ event, onBack }) {
  const { isGuest, isAdmin, openLogin } = useApp();
  const displayName = isAdmin ? "admin_ops" : "north_bynum";
  const Icon = event.icon;
  const closing = event.status === "closing";
  const live = event.status === "live";

  const poolA = Math.round(event.pool * (event.retA / 100));
  const poolB = event.pool - poolA;

  const [side, setSide] = useState(null);
  const [amount, setAmount] = useState(100);
  const [confirmed, setConfirmed] = useState(false);

  const { payout, profit } = estimatePayout(amount, side, poolA, poolB);

  const [chatTab, setChatTab] = useState("Live Chat");
  const [messages, setMessages] = useState(CHAT_SEED);
  const [chatInput, setChatInput] = useState("");

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setMessages([...messages, { id: Date.now(), user: displayName, text, t: "Just now" }]);
    setChatInput("");
  };

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-medium w-fit"
        style={{ color: C.textMuted }}
      >
        <ChevronLeft size={14} /> Back to Events
      </button>

      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon size={14} style={{ color: C.textFaint }} />
            <span className="text-[12px] font-medium uppercase tracking-wide" style={{ color: C.textFaint }}>{event.league}</span>
          </div>
          {statusBadge(event.status)}
        </div>

        <div className="flex items-center justify-center gap-6 md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <TeamBadge name={event.a} size={64} />
            <span className="text-[15px] font-semibold" style={{ color: C.text }}>{event.a}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] font-semibold" style={{ color: closing ? C.gold : C.textFaint }}>{live ? "LIVE" : "VS"}</span>
            <span className="text-[12.5px]" style={{ color: C.textMuted }}>{live ? "In progress" : event.time}</span>
            {!live && <span className="text-[11px]" style={{ color: C.textFaint }}>Closes in {event.closesIn}</span>}
          </div>
          <div className="flex flex-col items-center gap-2">
            <TeamBadge name={event.b} size={64} />
            <span className="text-[15px] font-semibold" style={{ color: C.text }}>{event.b}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6 text-[11.5px]" style={{ color: C.textFaint }}>
          <Users size={12} /> {event.participants.toLocaleString()} predicting this match
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold mb-3" style={{ color: C.text }}>Prediction pool</h3>
            <PoolBar a={event.a} b={event.b} retA={event.retA} retB={event.retB} height={10} />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <TeamBadge name={event.a} size={26} />
                <div className="min-w-0">
                  <div className="text-[10.5px] truncate" style={{ color: C.textFaint }}>{event.a}</div>
                  <div className="text-[13px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                    {poolA.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <TeamBadge name={event.b} size={26} />
                <div className="min-w-0">
                  <div className="text-[10.5px] truncate" style={{ color: C.textFaint }}>{event.b}</div>
                  <div className="text-[13px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                    {poolB.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
              <span className="text-[11.5px]" style={{ color: C.textFaint }}>Total pool</span>
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                {event.pool.toLocaleString()} Credits
              </span>
            </div>
          </Card>

          <Card className="overflow-hidden flex flex-col" style={{ height: 420 }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
              <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: C.bgElevated, border: `1px solid ${C.border}` }}>
                {["Live Chat", "Activity"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setChatTab(t)}
                    className="px-2.5 py-1 rounded-md text-[12px] font-medium"
                    style={{ background: chatTab === t ? C.card : "transparent", color: chatTab === t ? C.text : C.textMuted }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {chatTab === "Live Chat" && (
                <span className="flex items-center gap-1.5 text-[11px]" style={{ color: C.textFaint }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.emerald }} /> 128 in chat
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5">
              {chatTab === "Live Chat"
                ? messages.map((m) => (
                    <div key={m.id} className="flex items-start gap-2.5">
                      <Avatar name={m.user} size={24} />
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[12px] font-semibold" style={{ color: C.text }}>{m.user}</span>
                          <span className="text-[10.5px]" style={{ color: C.textFaint }}>{m.t}</span>
                        </div>
                        <p className="text-[12.5px] leading-snug" style={{ color: C.textMuted }}>{m.text}</p>
                      </div>
                    </div>
                  ))
                : EVENT_ACTIVITY_SEED.map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Avatar name={a.user} size={24} />
                      <span className="text-[12.5px] flex-1 min-w-0 truncate" style={{ color: C.text }}>
                        {a.user} <span style={{ color: C.textFaint }}>predicted {a.side === "a" ? event.a : event.b}</span>
                      </span>
                      <span className="text-[12px] tabular-nums" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                        {a.amount.toLocaleString()}
                      </span>
                      <span className="text-[11px] w-14 text-right shrink-0" style={{ color: C.textFaint }}>{a.t}</span>
                    </div>
                  ))}
            </div>

            {chatTab === "Live Chat" && (
              <div className="px-3 py-3" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
                {isGuest ? (
                  <button
                    onClick={openLogin}
                    className="w-full py-2 rounded-lg text-[12.5px] font-medium"
                    style={{ color: C.emerald, border: `1px solid ${C.emeraldLine}`, background: C.emeraldSoft }}
                  >
                    Sign in to join the chat
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                      placeholder="Say something…"
                      className="flex-1 bg-transparent outline-none text-[12.5px] px-3 py-2 rounded-lg"
                      style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
                    />
                    <button
                      onClick={sendMessage}
                      className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center"
                      style={{ background: C.emerald }}
                    >
                      <Send size={14} style={{ color: "#04140D" }} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-4" style={{ position: "sticky", top: 16 }}>
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Place a prediction</h3>

            <div className="grid grid-cols-2 gap-2">
              {[{ key: "a", name: event.a, ret: event.retA }, { key: "b", name: event.b, ret: event.retB }].map((o) => (
                <button
                  key={o.key}
                  onClick={() => { setSide(o.key); setConfirmed(false); }}
                  className="flex flex-col items-center gap-2 px-2 py-3 rounded-xl border"
                  style={{
                    borderColor: side === o.key ? C.emerald : C.border,
                    background: side === o.key ? C.emeraldSoft : C.card,
                  }}
                >
                  <TeamBadge name={o.name} size={32} />
                  <span className="text-[12px] font-medium" style={{ color: C.text }}>{o.name}</span>
                  <span
                    className="text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded"
                    style={{ color: C.emerald, background: C.emeraldSoft, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    x{decimalOdds(o.ret)}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <span className="text-[12px]" style={{ color: C.textFaint }}>Credits</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setConfirmed(false); }}
                  className="flex-1 bg-transparent outline-none text-right text-[15px] font-semibold tabular-nums"
                  style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                {[50, 100, 250, 500].map((v) => (
                  <button
                    key={v}
                    onClick={() => { setAmount(v); setConfirmed(false); }}
                    className="flex-1 py-1.5 rounded-lg text-[11.5px] font-medium"
                    style={{
                      background: amount === v ? C.emeraldSoft : C.card,
                      color: amount === v ? C.emerald : C.textMuted,
                      border: `1px solid ${amount === v ? C.emeraldLine : C.border}`,
                    }}
                  >
                    {v}
                  </button>
                ))}
                <button
                  onClick={() => { setAmount(12480); setConfirmed(false); }}
                  className="flex-1 py-1.5 rounded-lg text-[11.5px] font-medium"
                  style={{ background: C.card, color: C.textMuted, border: `1px solid ${C.border}` }}
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
              <div className="flex items-center justify-between text-[12.5px] pt-3">
                <span style={{ color: C.textMuted }}>Stake</span>
                <span className="tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                  {(Number(amount) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span style={{ color: C.textMuted }}>Estimated payout</span>
                <span className="tabular-nums font-medium" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                  {payout ? Math.round(payout).toLocaleString() : 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span style={{ color: C.textMuted }}>Potential profit</span>
                <span className="tabular-nums font-medium" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                  {profit > 0 ? `+${Math.round(profit).toLocaleString()}` : "0"}
                </span>
              </div>
              <p className="text-[10.5px] mt-1" style={{ color: C.textFaint }}>
                Estimated payout updates as more Credits are committed before this pool closes.
              </p>
            </div>

            {isGuest ? (
              <div className="flex flex-col gap-2">
                <p className="text-[11.5px]" style={{ color: C.textMuted }}>
                  Sign in to place this prediction and track it in My Predictions.
                </p>
                <button
                  onClick={openLogin}
                  className="py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5"
                  style={{ background: C.emerald, color: "#04140D" }}
                >
                  <Lock size={12} /> Sign in to predict
                </button>
              </div>
            ) : confirmed ? (
              <button disabled className="py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5"
                style={{ background: C.emeraldSoft, color: C.emerald, border: `1px solid ${C.emeraldLine}` }}>
                <CheckCircle2 size={14} /> Prediction placed
              </button>
            ) : (
              <button
                disabled={!side || !(Number(amount) > 0)}
                onClick={() => setConfirmed(true)}
                className="py-2.5 rounded-lg text-[13px] font-semibold"
                style={{
                  background: side && Number(amount) > 0 ? C.emerald : C.borderSubtle,
                  color: side && Number(amount) > 0 ? "#04140D" : C.textFaint,
                }}
              >
                Confirm prediction
              </button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Leaderboards page
// ---------------------------------------------------------------------------
function LeaderboardsPage() {
  const [tab, setTab] = useState("Weekly");
  const tabs = ["Daily", "Weekly", "Monthly", "Season", "All-Time"];
  const top3 = LEADERBOARD.slice(0, 3);
  const order = [top3[1], top3[0], top3[2]];

  const cols = [
    { label: "#", width: 44, align: "left" },
    { label: "Player", width: null, align: "left" },
    { label: "Credits", width: 110, align: "right" },
    { label: "Return", width: 90, align: "right" },
    { label: "Accuracy", width: 90, align: "right" },
    { label: "Streak", width: 80, align: "right" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1 p-1 rounded-lg w-fit" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-md text-[12.5px] font-medium"
            style={{ background: tab === t ? C.emerald : "transparent", color: tab === t ? "#04140D" : C.textMuted }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 items-end">
        {order.map((u) => {
          const isFirst = u.rank === 1;
          return (
            <Card key={u.rank} className="p-4 flex flex-col items-center gap-2 text-center"
              style={{ paddingTop: isFirst ? 28 : 16, borderColor: isFirst ? C.gold : C.border }}>
              {isFirst && <Crown size={18} style={{ color: C.gold }} />}
              <Avatar name={u.name} size={isFirst ? 56 : 44} ring={isFirst} />
              <span className="text-[13px] font-semibold" style={{ color: C.text }}>{u.name}</span>
              <Badge tone={isFirst ? "gold" : "muted"}>Rank #{u.rank}</Badge>
              <span className="text-[15px] font-semibold tabular-nums" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                {u.credits.toLocaleString()}
              </span>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
            <colgroup>
              {cols.map((c, i) => (
                <col key={i} style={c.width ? { width: c.width } : undefined} />
              ))}
            </colgroup>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                {cols.map((c) => (
                  <th
                    key={c.label}
                    className="text-[11px] font-medium uppercase tracking-wide"
                    style={{ color: C.textFaint, textAlign: c.align, padding: "10px 16px" }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((u, i) => (
                <tr
                  key={u.rank}
                  style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "10px 16px" }}>
                    <span className="text-[12.5px] font-semibold" style={{ color: u.rank <= 3 ? C.gold : C.textFaint }}>{u.rank}</span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={u.name} size={26} />
                      <span className="text-[13px] truncate" style={{ color: C.text }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    <span className="text-[12.5px] tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                      {u.credits.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    <span className="text-[12.5px] tabular-nums font-medium" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                      +{u.roi}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    <span className="text-[12.5px] tabular-nums" style={{ color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                      {u.acc}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    <span className="text-[12.5px] tabular-nums inline-flex items-center gap-1" style={{ color: C.gold }}>
                      {u.streak > 0 && <Flame size={11} />}{u.streak}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wallet page
// ---------------------------------------------------------------------------
function WalletPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="p-5 sm:col-span-1" style={{ background: `linear-gradient(160deg, ${C.card}, ${C.emeraldSoft})` }}>
          <span className="text-[12px]" style={{ color: C.textMuted }}>Current balance</span>
          <div className="text-3xl font-semibold tabular-nums mt-1" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
            12,480
          </div>
          <span className="text-[12px]" style={{ color: C.emerald }}>Credits</span>
        </Card>
        <StatCard label="Committed" value="820" icon={ArrowDownRight} />
        <StatCard label="Total rewards earned" value="38,210" sub="+1,240" icon={Award} tone="emerald" />
      </div>

      <div>
        <h3 className="text-[14px] font-semibold mb-3" style={{ color: C.text }}>Transaction history</h3>
        <Card className="p-2">
          {TRANSACTIONS.map((tx, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: tx.positive ? C.emeraldSoft : C.redSoft }}>
                {tx.positive ? <ArrowUpRight size={14} style={{ color: C.emerald }} /> : <ArrowDownRight size={14} style={{ color: C.red }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px]" style={{ color: C.text }}>{tx.desc}</div>
                <div className="text-[11.5px]" style={{ color: C.textFaint }}>{tx.type} · {tx.t}</div>
              </div>
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: tx.positive ? C.emerald : C.red, fontFamily: "'JetBrains Mono', monospace" }}>
                {tx.amt > 0 ? "+" : ""}{tx.amt.toLocaleString()}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seasons page
// ---------------------------------------------------------------------------
function CountdownTile({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl" style={{ background: C.bgElevated, border: `1px solid ${C.border}` }}>
      <span className="text-[20px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: C.textFaint }}>{label}</span>
    </div>
  );
}

function SeasonsPage() {
  const seasonProgress = 78; // percent of Season 4 elapsed

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-6 md:p-7 flex flex-col gap-5" style={{ background: `linear-gradient(150deg, ${C.card}, ${C.card} 55%, ${C.goldSoft})` }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: C.goldSoft }}>
              <Trophy size={22} style={{ color: C.gold }} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold" style={{ color: C.text }}>Season 4</h2>
              <span className="text-[12.5px]" style={{ color: C.textMuted }}>Predict. Compete. Climb the Rankings.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CountdownTile value="12" label="Days" />
            <CountdownTile value="04" label="Hours" />
            <CountdownTile value="22" label="Mins" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11.5px] mb-1.5" style={{ color: C.textMuted }}>
            <span>Season progress</span>
            <span>{seasonProgress}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: C.borderSubtle }}>
            <div style={{ width: `${seasonProgress}%`, height: "100%", background: C.gold, borderRadius: 999 }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="px-3 py-2.5 rounded-xl" style={{ background: C.bgElevated, border: `1px solid ${C.border}` }}>
            <div className="text-[10.5px]" style={{ color: C.textFaint }}>Your rank</div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>#4</div>
          </div>
          <div className="px-3 py-2.5 rounded-xl" style={{ background: C.bgElevated, border: `1px solid ${C.border}` }}>
            <div className="text-[10.5px]" style={{ color: C.textFaint }}>Participants</div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>8,412</div>
          </div>
          <div className="px-3 py-2.5 rounded-xl" style={{ background: C.bgElevated, border: `1px solid ${C.border}` }}>
            <div className="text-[10.5px]" style={{ color: C.textFaint }}>Season pool volume</div>
            <div className="text-[15px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>18.6M</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Top competitors this season</h3>
              <button className="text-[12.5px] flex items-center gap-1" style={{ color: C.textMuted }}>Full leaderboard <ChevronRight size={13} /></button>
            </div>
            <Card className="p-2">
              {LEADERBOARD.slice(0, 6).map((u, i) => (
                <div key={u.rank} className="flex items-center gap-3 px-2 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                  <span className="w-5 text-[12.5px] font-semibold tabular-nums text-center" style={{ color: u.rank <= 3 ? C.gold : C.textFaint }}>{u.rank}</span>
                  <Avatar name={u.name} size={26} />
                  <span className="text-[13px] flex-1 truncate" style={{ color: C.text }}>{u.name}</span>
                  <span className="text-[12.5px] font-medium tabular-nums" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                    {u.credits.toLocaleString()}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold mb-3" style={{ color: C.text }}>Season rewards</h3>
            <Card className="p-2">
              {SEASON_REWARDS.map((r, i) => (
                <div key={r.rank} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                  <span className="text-[13px] flex-1" style={{ color: C.text }}>{r.rank}</span>
                  {r.extra && <span className="hidden sm:inline text-[11.5px]" style={{ color: C.textFaint }}>{r.extra}</span>}
                  <span
                    className="text-[12.5px] font-semibold tabular-nums w-28 text-right"
                    style={{ color: r.tone === "gold" ? C.gold : r.tone === "emerald" ? C.emerald : C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {r.reward}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-[14px] font-semibold mb-3" style={{ color: C.text }}>Earnable badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {SEASON_BADGES.map((b) => (
                <Card key={b.label} className="p-4 flex flex-col items-center gap-2 text-center" style={{ opacity: b.earned ? 1 : 0.7 }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: b.earned ? C.goldSoft : C.borderSubtle }}>
                    <b.icon size={17} style={{ color: b.earned ? C.gold : C.textFaint }} />
                  </div>
                  <span className="text-[12px] font-medium leading-tight" style={{ color: C.text }}>{b.label}</span>
                  <span className="text-[10.5px] leading-tight" style={{ color: C.textFaint }}>{b.desc}</span>
                  {b.earned ? (
                    <Badge tone="gold">Earned</Badge>
                  ) : (
                    <span className="text-[10.5px] font-medium" style={{ color: C.emerald }}>{b.progress || "Locked"}</span>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold mb-3" style={{ color: C.text }}>Previous champions</h3>
            <Card className="p-2">
              {ADMIN_CHAMPIONS.map((c, i) => (
                <div key={c.season} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.goldSoft }}>
                    <Trophy size={14} style={{ color: C.gold }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium" style={{ color: C.text }}>{c.season}</div>
                    <div className="text-[11px] truncate" style={{ color: C.textFaint }}>{c.champion}</div>
                  </div>
                  <span className="text-[12px] tabular-nums" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                    {c.credits.toLocaleString()}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile page
// ---------------------------------------------------------------------------
function ProfilePage() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 md:p-6" style={{ background: `linear-gradient(135deg, ${C.card}, ${C.emeraldSoft} 160%)` }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar name="north_bynum" size={76} ring />

          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[19px] font-semibold" style={{ color: C.text }}>north_bynum</h2>
              <Badge tone="gold">Rank #4</Badge>
            </div>
            <span className="text-[12.5px]" style={{ color: C.textMuted }}>Joined March 2025 · Weekly leaderboard</span>

            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: C.textMuted }}>
                <Target size={12} style={{ color: C.emerald }} /> 63% accuracy
              </span>
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: C.textMuted }}>
                <Flame size={12} style={{ color: C.gold }} /> 4 win streak
              </span>
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: C.textMuted }}>
                <WalletIcon size={12} style={{ color: C.emerald }} /> 12,480 Credits
              </span>
            </div>
          </div>

          <button
            className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-lg text-[12.5px] font-semibold"
            style={{ background: C.card, color: C.text, border: `1px solid ${C.border}` }}
          >
            Edit profile
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Current Credits" value="12,480" icon={WalletIcon} tone="emerald" />
        <StatCard label="Prediction Accuracy" value="63%" icon={Target} tone="emerald" />
        <StatCard label="Return Rate" value="+142%" icon={TrendingUp} tone="emerald" />
        <StatCard label="Biggest Reward" value="4,200" icon={Award} tone="gold" />
        <StatCard label="Total Predictions" value="286" icon={CalendarDays} />
        <StatCard label="Correct" value="180" icon={ArrowUpRight} tone="emerald" />
        <StatCard label="Incorrect" value="106" icon={ArrowDownRight} />
        <StatCard label="Win Streak" value="4" icon={Flame} tone="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Achievement badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <Card key={a.label} className="p-4 flex flex-col items-center gap-2 text-center"
                style={{ opacity: a.earned ? 1 : 0.45 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: a.earned ? C.goldSoft : C.borderSubtle }}>
                  <a.icon size={17} style={{ color: a.earned ? C.gold : C.textFaint }} />
                </div>
                <span className="text-[12px] font-medium leading-tight" style={{ color: C.text }}>{a.label}</span>
                {!a.earned && <span className="text-[10.5px]" style={{ color: C.textFaint }}>Locked</span>}
              </Card>
            ))}
          </div>

          <h3 className="text-[14px] font-semibold mt-2" style={{ color: C.text }}>Season history</h3>
          <Card className="p-2">
            {SEASON_HISTORY.map((s, i) => (
              <div key={s.season} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                <Trophy size={14} style={{ color: C.gold }} />
                <span className="text-[13px] flex-1" style={{ color: C.text }}>{s.season}</span>
                <span className="text-[12px]" style={{ color: C.textMuted }}>Rank #{s.rank}</span>
                <span className="text-[12.5px] font-medium tabular-nums w-20 text-right" style={{ color: C.emerald, fontFamily: "'JetBrains Mono', monospace" }}>
                  +{s.reward.toLocaleString()}
                </span>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Favorite sports</h3>
          <Card className="p-4 flex flex-wrap gap-2">
            {FAVORITE_SPORTS.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-full text-[12px] font-medium"
                style={{ background: C.emeraldSoft, color: C.emerald }}>
                {s}
              </span>
            ))}
          </Card>

          <h3 className="text-[14px] font-semibold mt-2" style={{ color: C.text }}>Accuracy trend</h3>
          <Card className="p-4">
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profileAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: C.textFaint, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[40, 80]} />
                  <Area type="monotone" dataKey="acc" stroke={C.gold} strokeWidth={2} fill="url(#profileAcc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AI support widget, floating across every page. Answers are grounded in
// SUPPORT_FAQ only, no live sports data or search, since that's not
// something the underlying model has access to. Support/FAQ is exactly the
// kind of knowledge that doesn't need it.
// ---------------------------------------------------------------------------
function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi, I'm the Chakrm assistant. Ask me about Credits, predictions, payouts, or your account." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), from: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: "bot", text: getSupportReply(trimmed) }]);
      setTyping(false);
    }, 650);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed flex items-center justify-center rounded-full shadow-2xl"
        style={{
          bottom: 20, right: 20, width: 52, height: 52, zIndex: 55,
          background: C.emerald, border: `1px solid ${C.emeraldLine}`,
        }}
      >
        {open ? <X size={20} style={{ color: "#04140D" }} /> : <Bot size={22} style={{ color: "#04140D" }} />}
      </button>

      {open && (
        <div
          className="fixed rounded-2xl border overflow-hidden flex flex-col shadow-2xl"
          style={{
            bottom: 82, right: 20, width: 340, maxWidth: "calc(100vw - 40px)", height: 460,
            background: C.bgElevated, borderColor: C.border, zIndex: 55,
          }}
        >
          <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: `1px solid ${C.borderSubtle}`, background: C.card }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.emeraldSoft }}>
              <Bot size={16} style={{ color: C.emerald }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold" style={{ color: C.text }}>Chakrm Assistant</div>
              <div className="text-[10.5px] flex items-center gap-1" style={{ color: C.textFaint }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.emerald }} /> Powered by Qwen
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="px-3 py-2 rounded-xl text-[12.5px] leading-snug"
                  style={{
                    maxWidth: "85%",
                    background: m.from === "user" ? C.emerald : C.card,
                    color: m.from === "user" ? "#04140D" : C.text,
                    border: m.from === "user" ? "none" : `1px solid ${C.border}`,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2.5 rounded-xl flex items-center gap-1" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: C.textFaint }} />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && !typing && (
              <div className="flex flex-col gap-1.5 mt-1">
                {SUPPORT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left px-3 py-2 rounded-lg text-[12px] font-medium"
                    style={{ background: C.card, color: C.textMuted, border: `1px solid ${C.border}` }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-3 py-3" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
                placeholder="Ask a question…"
                className="flex-1 bg-transparent outline-none text-[12.5px] px-3 py-2 rounded-lg"
                style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
              />
              <button
                onClick={() => send(input)}
                className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center"
                style={{ background: C.emerald }}
              >
                <Send size={14} style={{ color: "#04140D" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Login modal, opened from any "Sign in" trigger across the app rather than
// navigating away, so guests never lose their place while browsing.
// ---------------------------------------------------------------------------
function LoginModal() {
  const { setRole, closeLogin } = useApp();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  const complete = () => {
    setRole("user");
    closeLogin();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(6,8,9,0.7)", zIndex: 70 }}
      onClick={closeLogin}
    >
      <div
        className="w-full rounded-2xl border p-5 flex flex-col gap-4"
        style={{ background: C.bgElevated, borderColor: C.border, maxWidth: 380 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.emerald }}>
              <span className="text-[13px] font-bold" style={{ color: "#04140D" }}>C</span>
            </div>
            <span className="text-[14px] font-semibold" style={{ color: C.text }}>
              {mode === "signin" ? "Sign in to Chakrm" : "Create your account"}
            </span>
          </div>
          <button onClick={closeLogin}><X size={16} style={{ color: C.textFaint }} /></button>
        </div>

        <button
          onClick={complete}
          className="py-2.5 rounded-lg text-[12.5px] font-medium"
          style={{ background: C.card, color: C.text, border: `1px solid ${C.border}` }}
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: C.borderSubtle }} />
          <span className="text-[10.5px]" style={{ color: C.textFaint }}>or</span>
          <div className="flex-1 h-px" style={{ background: C.borderSubtle }} />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Email</span>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <Mail size={14} style={{ color: C.textFaint }} />
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: C.text }}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Password</span>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <KeyRound size={14} style={{ color: C.textFaint }} />
            <input
              type="password"
              placeholder="••••••••"
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: C.text }}
            />
          </div>
        </label>

        <button
          onClick={complete}
          className="py-2.5 rounded-lg text-[13px] font-semibold"
          style={{ background: C.emerald, color: "#04140D" }}
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <p className="text-[12px] text-center" style={{ color: C.textMuted }}>
          {mode === "signin" ? "New to Chakrm?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-medium"
            style={{ color: C.emerald }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function AuthGate({ label }) {
  const { openLogin } = useApp();
  return (
    <div className="relative rounded-2xl border overflow-hidden" style={{ borderColor: C.border, minHeight: 420 }}>
      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-3 opacity-50 select-none pointer-events-none"
        style={{ filter: "blur(6px)" }} aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl" style={{ background: C.card, border: `1px solid ${C.border}` }} />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6"
        style={{ background: "rgba(10,12,14,0.72)" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.emeraldSoft }}>
          <Lock size={18} style={{ color: C.emerald }} />
        </div>
        <h3 className="text-[15px] font-semibold" style={{ color: C.text }}>Sign in to view {label}</h3>
        <p className="text-[12.5px] max-w-xs" style={{ color: C.textMuted }}>
          Create a free Chakrm account to get Credits, track your rank, and build a prediction history.
        </p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={openLogin}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold"
            style={{ background: C.emerald, color: "#04140D" }}
          >
            Sign in
          </button>
          <button
            onClick={openLogin}
            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold"
            style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.border}` }}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin: settlement dialog
// ---------------------------------------------------------------------------
function SettlementDialog({ event, onClose, onConfirm }) {
  const [choice, setChoice] = useState(null); // "a" | "b" | "void"
  const total = event.poolA + event.poolB;
  const options = [
    { key: "a", name: event.a, pool: event.poolA },
    { key: "b", name: event.b, pool: event.poolB },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(6,8,9,0.65)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border p-5 flex flex-col gap-4"
        style={{ background: C.bgElevated, borderColor: C.border, maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold" style={{ color: C.text }}>Settle pool</h3>
          <button onClick={onClose}><X size={16} style={{ color: C.textFaint }} /></button>
        </div>
        <p className="text-[12.5px]" style={{ color: C.textMuted }}>
          {event.league}. Choose the winning outcome to distribute rewards to correct predictions.
        </p>

        <div className="flex flex-col gap-2">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => setChoice(o.key)}
              className="flex items-center justify-between px-4 py-3 rounded-xl border text-left"
              style={{
                borderColor: choice === o.key ? C.emerald : C.border,
                background: choice === o.key ? C.emeraldSoft : C.card,
              }}
            >
              <div className="flex items-center gap-2">
                <TeamBadge name={o.name} size={30} />
                <span className="text-[13px] font-medium" style={{ color: C.text }}>{o.name}</span>
              </div>
              <span className="text-[11.5px] tabular-nums" style={{ color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                {o.pool.toLocaleString()} committed
              </span>
            </button>
          ))}
          <button
            onClick={() => setChoice("void")}
            className="px-4 py-2.5 rounded-xl border text-[12.5px] font-medium text-left"
            style={{
              borderColor: choice === "void" ? C.gold : C.border,
              background: choice === "void" ? C.goldSoft : C.card,
              color: choice === "void" ? C.gold : C.textMuted,
            }}
          >
            Void pool &amp; refund all Credits
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 flex-wrap gap-2" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
          <span className="text-[11.5px]" style={{ color: C.textFaint }}>Total pool: {total.toLocaleString()} Credits</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium"
              style={{ color: C.textMuted, border: `1px solid ${C.border}` }}
            >
              Cancel
            </button>
            <button
              disabled={!choice}
              onClick={onConfirm}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
              style={{ background: choice ? C.emerald : C.borderSubtle, color: choice ? "#04140D" : C.textFaint }}
            >
              <CheckCircle2 size={13} /> Confirm settlement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function adminStatusBadge(status) {
  if (status === "Live") return <Badge tone="red">● Live</Badge>;
  if (status === "Closing") return <Badge tone="gold">Closing soon</Badge>;
  if (status === "Settled") return <Badge tone="muted">Settled</Badge>;
  if (status === "Voided") return <Badge tone="red">Voided</Badge>;
  return <Badge tone="emerald">Open</Badge>;
}

// ---------------------------------------------------------------------------
// Admin dashboard
// ---------------------------------------------------------------------------
function AdminPage() {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Users", "Events", "Settlements", "Leaderboards"];

  const [userQuery, setUserQuery] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [suspendOverrides, setSuspendOverrides] = useState({});
  const [settleTarget, setSettleTarget] = useState(null);
  const [settledIds, setSettledIds] = useState([]);

  const statusFor = (u) => (suspendOverrides[u.id] !== undefined ? (suspendOverrides[u.id] ? "Suspended" : "Active") : u.status);
  const toggleSuspend = (u) => setSuspendOverrides({ ...suspendOverrides, [u.id]: statusFor(u) === "Active" });

  const filteredUsers = ADMIN_USERS.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(userQuery.toLowerCase());
    const matchesFilter = userFilter === "All" || statusFor(u) === userFilter;
    return matchesQuery && matchesFilter;
  });

  const pendingSettlements = ADMIN_SETTLEMENTS.filter((s) => !settledIds.includes(s.id));

  const userCols = [
    { label: "Player", width: null },
    { label: "Credits", width: 100, align: "right" },
    { label: "Accuracy", width: 90, align: "right" },
    { label: "Role", width: 80 },
    { label: "Status", width: 100 },
    { label: "Joined", width: 90 },
    { label: "Actions", width: 110, align: "right" },
  ];

  const eventCols = [
    { label: "Match", width: null },
    { label: "League", width: 150 },
    { label: "Pool", width: 100, align: "right" },
    { label: "Participants", width: 100, align: "right" },
    { label: "Status", width: 110 },
    { label: "", width: 90, align: "right" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1 p-1 rounded-lg w-fit overflow-x-auto" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-md text-[12.5px] font-medium whitespace-nowrap"
            style={{ background: tab === t ? C.emerald : "transparent", color: tab === t ? "#04140D" : C.textMuted }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {ADMIN_STATS.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={s.icon} tone={s.tone} />
            ))}
          </div>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Platform prediction volume</h3>
                <span className="text-[12px]" style={{ color: C.textMuted }}>Last 7 days, all sports</span>
              </div>
              <Badge tone="emerald">+14% week over week</Badge>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ADMIN_VOLUME} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.emerald} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={C.borderSubtle} vertical={false} />
                  <XAxis dataKey="d" tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: C.bgElevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: C.textMuted }}
                    itemStyle={{ color: C.emerald }}
                  />
                  <Area type="monotone" dataKey="v" stroke={C.emerald} strokeWidth={2} fill="url(#adminVol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {tab === "Users" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {["All", "Active", "Suspended"].map((f) => (
                <button
                  key={f}
                  onClick={() => setUserFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
                  style={{
                    background: userFilter === f ? C.emeraldSoft : C.card,
                    color: userFilter === f ? C.emerald : C.textMuted,
                    border: `1px solid ${userFilter === f ? C.emeraldLine : C.border}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}`, width: 220 }}>
              <Search size={13} style={{ color: C.textFaint }} />
              <input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Search users…"
                className="bg-transparent outline-none text-[12.5px] flex-1"
                style={{ color: C.text }}
              />
            </div>
          </div>

          <Card className="overflow-hidden">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
                <colgroup>{userCols.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                    {userCols.map((c) => (
                      <th key={c.label} className="text-[11px] font-medium uppercase tracking-wide"
                        style={{ color: C.textFaint, textAlign: c.align || "left", padding: "10px 16px" }}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => {
                    const status = statusFor(u);
                    return (
                      <tr key={u.id} style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                        <td style={{ padding: "10px 16px" }}>
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar name={u.name} size={26} />
                            <span className="text-[13px] truncate" style={{ color: C.text }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right" }}>
                          <span className="text-[12.5px] tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                            {u.credits.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right" }}>
                          <span className="text-[12.5px] tabular-nums" style={{ color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                            {u.role === "Admin" ? "N/A" : `${u.acc}%`}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <Badge tone={u.role === "Admin" ? "gold" : "muted"}>{u.role}</Badge>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <Badge tone={status === "Active" ? "emerald" : "red"}>{status}</Badge>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <span className="text-[12px]" style={{ color: C.textMuted }}>{u.joined}</span>
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right" }}>
                          {u.role !== "Admin" && (
                            <button
                              onClick={() => toggleSuspend(u)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-medium"
                              style={{
                                color: status === "Active" ? C.red : C.emerald,
                                border: `1px solid ${status === "Active" ? C.redSoft : C.emeraldLine}`,
                                background: status === "Active" ? C.redSoft : C.emeraldSoft,
                              }}
                            >
                              {status === "Active" ? <UserX size={12} /> : <UserCheck size={12} />}
                              {status === "Active" ? "Suspend" : "Reinstate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === "Events" && (
        <Card className="overflow-hidden">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
              <colgroup>{eventCols.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                  {eventCols.map((c) => (
                    <th key={c.label} className="text-[11px] font-medium uppercase tracking-wide"
                      style={{ color: C.textFaint, textAlign: c.align || "left", padding: "10px 16px" }}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_EVENTS.map((e, i) => (
                  <tr key={e.id} style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                    <td style={{ padding: "10px 16px" }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <TeamBadge name={e.a} size={24} />
                        <span className="text-[12.5px]" style={{ color: C.text }}>{e.a} vs {e.b}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span className="text-[12px]" style={{ color: C.textMuted }}>{e.league}</span>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <span className="text-[12.5px] tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                        {e.pool.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <span className="text-[12.5px] tabular-nums" style={{ color: C.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                        {e.participants.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>{adminStatusBadge(e.status)}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <button className="text-[11.5px] font-medium" style={{ color: C.emerald }}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "Settlements" && (
        <div className="flex flex-col gap-3">
          {pendingSettlements.length === 0 ? (
            <Card className="p-10 flex flex-col items-center justify-center text-center gap-2">
              <CheckCircle2 size={20} style={{ color: C.emerald }} />
              <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>All caught up</h3>
              <p className="text-[12.5px] max-w-xs" style={{ color: C.textMuted }}>No pools are waiting on a settlement decision right now.</p>
            </Card>
          ) : (
            pendingSettlements.map((s) => (
              <Card key={s.id} className="p-4 flex items-center justify-between gap-4 flex-wrap" hover>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center -space-x-2">
                    <TeamBadge name={s.a} size={34} />
                    <TeamBadge name={s.b} size={34} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium" style={{ color: C.text }}>{s.a} vs {s.b}</div>
                    <div className="text-[11.5px]" style={{ color: C.textFaint }}>{s.league} · closed {s.closed}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px]" style={{ color: C.textFaint }}>Total pool</div>
                    <div className="text-[13px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: "'JetBrains Mono', monospace" }}>
                      {(s.poolA + s.poolB).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => setSettleTarget(s)}
                    className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
                    style={{ background: C.gold, color: "#241A05" }}
                  >
                    Settle
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "Leaderboards" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} style={{ color: C.gold }} />
              <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Season 4, in progress</h3>
            </div>
            <p className="text-[12.5px]" style={{ color: C.textMuted }}>Ends in 12 days · 8,412 participants · 18.6M Credits in the season pool.</p>
            <div className="flex items-center gap-2 mt-1">
              <button className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold" style={{ background: C.emerald, color: "#04140D" }}>
                Export standings
              </button>
              <button className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium" style={{ color: C.red, border: `1px solid ${C.redSoft}`, background: C.redSoft }}>
                End season now
              </button>
            </div>
          </Card>
          <Card className="p-2">
            <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textFaint }}>Past champions</div>
            {ADMIN_CHAMPIONS.map((c, i) => (
              <div key={c.season} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                <Crown size={13} style={{ color: C.gold }} />
                <span className="text-[12.5px] flex-1" style={{ color: C.text }}>{c.season}</span>
                <span className="text-[12px]" style={{ color: C.textMuted }}>{c.champion}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {settleTarget && (
        <SettlementDialog
          event={settleTarget}
          onClose={() => setSettleTarget(null)}
          onConfirm={() => { setSettledIds([...settledIds, settleTarget.id]); setSettleTarget(null); }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings: shared bits
// ---------------------------------------------------------------------------
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className="relative shrink-0"
      style={{
        width: 38, height: 22, borderRadius: 999,
        background: checked ? C.emerald : C.borderSubtle,
        border: `1px solid ${checked ? C.emerald : C.border}`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background .15s ease",
      }}
    >
      <span
        style={{
          position: "absolute", top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: "50%",
          background: "#F5F7F6",
          transition: "left .15s ease",
        }}
      />
    </button>
  );
}

function ToggleRow({ icon: Icon, label, description, checked, onChange, disabled = false, first = false }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderTop: first ? "none" : `1px solid ${C.borderSubtle}` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.borderSubtle }}>
        <Icon size={14} style={{ color: C.textMuted }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium" style={{ color: C.text }}>{label}</div>
        {description && <div className="text-[11.5px] mt-0.5" style={{ color: C.textFaint }}>{description}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

function ConfirmDialog({ tone = "warning", title, description, confirmLabel, onCancel, onConfirm }) {
  const color = tone === "danger" ? C.red : C.gold;
  const soft = tone === "danger" ? C.redSoft : C.goldSoft;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(6,8,9,0.65)", zIndex: 50 }}
      onClick={onCancel}
    >
      <div
        className="w-full rounded-2xl border p-5 flex flex-col gap-4"
        style={{ background: C.bgElevated, borderColor: C.border, maxWidth: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: soft }}>
          <AlertTriangle size={18} style={{ color }} />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold" style={{ color: C.text }}>{title}</h3>
          <p className="text-[12.5px] mt-1.5" style={{ color: C.textMuted }}>{description}</p>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium"
            style={{ color: C.textMuted, border: `1px solid ${C.border}` }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
            style={{ background: color, color: tone === "danger" ? "#04140D" : "#241A05" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { background: C.card, border: `1px solid ${C.border}`, color: C.text };

// ---------------------------------------------------------------------------
// Settings page
// ---------------------------------------------------------------------------
function SettingsPage() {
  const [tab, setTab] = useState("Account");
  const tabs = ["Account", "Notifications", "Security", "Preferences", "Privacy", "Danger Zone"];

  const [username, setUsername] = useState("north_bynum");
  const [email, setEmail] = useState("north.bynum@example.com");
  const [saved, setSaved] = useState(false);

  const [notif, setNotif] = useState({
    settled: true, dailyBonus: true, rankChanges: false, chatMentions: true, weeklyDigest: false, announcements: false,
  });

  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS_SEED);

  const [landingPage, setLandingPage] = useState("Dashboard");
  const [favSports, setFavSports] = useState(["Basketball", "Soccer", "Esports", "Tennis"]);

  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  const [confirmAction, setConfirmAction] = useState(null); // "deactivate" | "delete" | null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1 p-1 rounded-lg w-fit overflow-x-auto" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-md text-[12.5px] font-medium whitespace-nowrap"
            style={{
              background: tab === t ? (t === "Danger Zone" ? C.red : C.emerald) : "transparent",
              color: tab === t ? "#04140D" : t === "Danger Zone" ? C.red : C.textMuted,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Account" && (
        <Card className="p-5 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={username} size={64} ring />
            <div className="flex flex-col gap-1.5">
              <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium w-fit" style={{ background: C.card, color: C.text, border: `1px solid ${C.border}` }}>
                Change avatar
              </button>
              <span className="text-[11px]" style={{ color: C.textFaint }}>JPG or PNG. 2MB max.</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Username</span>
              <input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setSaved(false); }}
                className="px-3 py-2 rounded-lg text-[13px] outline-none"
                style={inputStyle}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Email</span>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
                className="px-3 py-2 rounded-lg text-[13px] outline-none"
                style={inputStyle}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 sm:w-64">
            <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Timezone</span>
            <select className="px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle}>
              <option>UTC+08:00, Manila</option>
              <option>UTC-05:00, New York</option>
              <option>UTC+00:00, London</option>
              <option>UTC-08:00, Los Angeles</option>
            </select>
          </label>

          <div className="flex items-center gap-3 pt-3" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
            <button
              onClick={() => setSaved(true)}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold"
              style={{ background: C.emerald, color: "#04140D" }}
            >
              Save changes
            </button>
            {saved && (
              <span className="text-[12px] flex items-center gap-1" style={{ color: C.emerald }}>
                <CheckCircle2 size={13} /> Saved
              </span>
            )}
          </div>
        </Card>
      )}

      {tab === "Notifications" && (
        <Card className="overflow-hidden">
          <ToggleRow first icon={CheckCircle2} label="Prediction settled" description="When a match you predicted on has a final result"
            checked={notif.settled} onChange={(v) => setNotif({ ...notif, settled: v })} />
          <ToggleRow icon={Gift} label="Daily bonus reminder" description="A nudge if you haven't claimed today's bonus"
            checked={notif.dailyBonus} onChange={(v) => setNotif({ ...notif, dailyBonus: v })} />
          <ToggleRow icon={Trophy} label="Leaderboard rank changes" description="When you move up or down a leaderboard"
            checked={notif.rankChanges} onChange={(v) => setNotif({ ...notif, rankChanges: v })} />
          <ToggleRow icon={Send} label="Chat mentions" description="When someone mentions you in a match chat"
            checked={notif.chatMentions} onChange={(v) => setNotif({ ...notif, chatMentions: v })} />
          <ToggleRow icon={CalendarDays} label="Weekly digest email" description="A summary of your predictions and standings"
            checked={notif.weeklyDigest} onChange={(v) => setNotif({ ...notif, weeklyDigest: v })} />
          <ToggleRow icon={Sparkles} label="Product updates" description="New features and announcements from Chakrm"
            checked={notif.announcements} onChange={(v) => setNotif({ ...notif, announcements: v })} />
        </Card>
      )}

      {tab === "Security" && (
        <div className="flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-4">
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Change password</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <input type="password" placeholder="Current password" className="px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle} />
              <input type="password" placeholder="New password" className="px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle} />
              <input type="password" placeholder="Confirm new password" className="px-3 py-2 rounded-lg text-[13px] outline-none" style={inputStyle} />
            </div>
            <button className="px-4 py-2 rounded-lg text-[12.5px] font-semibold w-fit" style={{ background: C.emerald, color: "#04140D" }}>
              Update password
            </button>
          </Card>

          <Card className="overflow-hidden">
            <ToggleRow
              first
              icon={Shield}
              label="Two-factor authentication"
              description={twoFA ? "Enabled. Your account has an extra layer of protection." : "Not enabled. Add an extra layer of protection."}
              checked={twoFA}
              onChange={setTwoFA}
            />
          </Card>

          <Card className="p-2">
            <div className="px-3 py-2 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textFaint }}>Active sessions</span>
              {sessions.length > 1 && (
                <button
                  onClick={() => setSessions(sessions.filter((s) => s.current))}
                  className="text-[11.5px] font-medium flex items-center gap-1"
                  style={{ color: C.red }}
                >
                  <LogOut size={12} /> Sign out all other devices
                </button>
              )}
            </div>
            {sessions.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.borderSubtle }}>
                  <s.icon size={14} style={{ color: C.textMuted }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-medium" style={{ color: C.text }}>{s.device}</span>
                    {s.current && <Badge tone="emerald">This device</Badge>}
                  </div>
                  <span className="text-[11px]" style={{ color: C.textFaint }}>{s.location} · {s.last}</span>
                </div>
                {!s.current && (
                  <button
                    onClick={() => setSessions(sessions.filter((x) => x.id !== s.id))}
                    className="text-[11.5px] font-medium"
                    style={{ color: C.red }}
                  >
                    Sign out
                  </button>
                )}
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "Preferences" && (
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            <ToggleRow first icon={Sparkles} label="Dark mode" description="Chakrm is dark-mode only for now. Light mode is planned."
              checked={true} onChange={() => {}} disabled />
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Default landing page</h3>
            <div className="flex items-center gap-2">
              {["Dashboard", "Events"].map((p) => (
                <button
                  key={p}
                  onClick={() => setLandingPage(p)}
                  className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
                  style={{
                    background: landingPage === p ? C.emeraldSoft : C.card,
                    color: landingPage === p ? C.emerald : C.textMuted,
                    border: `1px solid ${landingPage === p ? C.emeraldLine : C.border}`,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Favorite sports</h3>
            <p className="text-[12px]" style={{ color: C.textMuted }}>Used to personalize your Featured pools and event recommendations.</p>
            <div className="flex flex-wrap gap-2">
              {["Basketball", "Soccer", "Esports", "Tennis", "Football"].map((s) => {
                const active = favSports.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => setFavSports(active ? favSports.filter((x) => x !== s) : [...favSports, s])}
                    className="px-2.5 py-1 rounded-full text-[12px] font-medium"
                    style={{
                      background: active ? C.emeraldSoft : C.card,
                      color: active ? C.emerald : C.textMuted,
                      border: `1px solid ${active ? C.emeraldLine : C.border}`,
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab === "Privacy" && (
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            <ToggleRow first icon={Eye} label="Show my profile on public leaderboards" description="Your username and stats appear on Daily, Weekly, and Season leaderboards"
              checked={showOnLeaderboard} onChange={setShowOnLeaderboard} />
            <ToggleRow icon={EyeOff} label="Show prediction history to other users" description="Let others see your past predictions on your profile"
              checked={showHistory} onChange={setShowHistory} />
          </Card>

          <Card className="p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-[13px] font-medium" style={{ color: C.text }}>Download your data</h3>
              <p className="text-[12px]" style={{ color: C.textMuted }}>Export your prediction history, transactions, and account info.</p>
            </div>
            <button className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium" style={{ background: C.card, color: C.text, border: `1px solid ${C.border}` }}>
              Request export
            </button>
          </Card>
        </div>
      )}

      {tab === "Danger Zone" && (
        <Card className="p-5 flex flex-col gap-4" style={{ borderColor: C.redSoft }}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} style={{ color: C.red }} />
            <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Danger zone</h3>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pb-4" style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
            <div>
              <h4 className="text-[13px] font-medium" style={{ color: C.text }}>Deactivate account</h4>
              <p className="text-[12px]" style={{ color: C.textMuted }}>Temporarily hide your profile and pause predictions. You can reactivate anytime.</p>
            </div>
            <button
              onClick={() => setConfirmAction("deactivate")}
              className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium"
              style={{ color: C.gold, border: `1px solid ${C.gold}55`, background: C.goldSoft }}
            >
              Deactivate
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h4 className="text-[13px] font-medium" style={{ color: C.text }}>Delete account</h4>
              <p className="text-[12px]" style={{ color: C.textMuted }}>Permanently delete your account, Credits, and prediction history. This cannot be undone.</p>
            </div>
            <button
              onClick={() => setConfirmAction("delete")}
              className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
              style={{ color: "#04140D", background: C.red }}
            >
              Delete account
            </button>
          </div>
        </Card>
      )}

      {confirmAction && (
        <ConfirmDialog
          tone={confirmAction === "delete" ? "danger" : "warning"}
          title={confirmAction === "delete" ? "Delete your account?" : "Deactivate your account?"}
          description={
            confirmAction === "delete"
              ? "This permanently deletes your account, Credits balance, and prediction history. This action cannot be undone."
              : "Your profile will be hidden and predictions paused until you sign back in and reactivate."
          }
          confirmLabel={confirmAction === "delete" ? "Delete my account" : "Deactivate account"}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placeholder for un-built pages
// ---------------------------------------------------------------------------
function ComingSoon({ label }) {
  return (
    <Card className="p-10 flex flex-col items-center justify-center text-center gap-2">
      <Sparkles size={20} style={{ color: C.textFaint }} />
      <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>{label} isn't wired up yet</h3>
      <p className="text-[12.5px] max-w-xs" style={{ color: C.textMuted }}>
        This screen is part of the full build-out (Dashboard, Events, Leaderboards, Wallet, and Profile are live in this prototype).
      </p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function ChakrmPrototype() {
  useFonts();
  const [role, setRoleState] = useState("guest"); // "guest" | "user" | "admin"
  const [active, setActive] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const isGuest = role === "guest";
  const isAdmin = role === "admin";

  const titles = {
    dashboard: "Dashboard", events: "Events", predictions: "My Predictions",
    wallet: "Wallet", leaderboards: "Leaderboards", seasons: "Seasons",
    profile: "Profile", admin: "Admin", settings: "Settings",
  };

  // Wrapping setter so switching roles also lands on a sensible page.
  // nobody should be stranded on a page that just got gated away.
  const setRole = (next) => {
    setRoleState(next);
    if (next === "guest") {
      if (!PUBLIC_PAGES.includes(active)) setActive("events");
    } else if (next === "admin") {
      setActive("admin");
    } else if (next === "user") {
      setActive("dashboard");
    }
  };
  // Back-compat helper used by earlier call sites (AuthGate, sign-in buttons):
  // signing in always lands you as a regular user, not an admin.
  const setIsGuest = (next) => setRole(next ? "guest" : "user");

  const openEvent = (event) => setSelectedEvent(event);
  const closeEvent = () => setSelectedEvent(null);
  const openLogin = () => setLoginModalOpen(true);
  const closeLogin = () => setLoginModalOpen(false);

  const pages = {
    dashboard: <DashboardPage />,
    events: <EventsPage />,
    leaderboards: <LeaderboardsPage />,
    wallet: <WalletPage />,
    profile: <ProfilePage />,
    seasons: <SeasonsPage />,
    admin: <AdminPage />,
    settings: <SettingsPage />,
  };

  const needsAuth = isGuest && !PUBLIC_PAGES.includes(active);
  const needsAdmin = active === "admin" && !isAdmin;

  let mainContent;
  if (selectedEvent) {
    // Match detail is a drill-down from Events, browsable by anyone.
    // Signing in is only required inside the slip/chat, not to view it.
    mainContent = <EventDetailPage event={selectedEvent} onBack={closeEvent} />;
  } else if (active === "admin" && needsAuth) {
    mainContent = <AuthGate label="Admin" />;
  } else if (needsAdmin) {
    mainContent = (
      <Card className="p-10 flex flex-col items-center justify-center text-center gap-2">
        <Shield size={20} style={{ color: C.textFaint }} />
        <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Admin access required</h3>
        <p className="text-[12.5px] max-w-xs" style={{ color: C.textMuted }}>
          This account doesn't have admin permissions. Switch to an admin account to view this section.
        </p>
      </Card>
    );
  } else if (needsAuth) {
    mainContent = <AuthGate label={titles[active]} />;
  } else {
    mainContent = pages[active] || <ComingSoon label={titles[active]} />;
  }

  const navigate = (key) => { setSelectedEvent(null); setActive(key); };

  return (
    <AppContext.Provider value={{ isGuest, isAdmin, role, setIsGuest, setRole, openEvent, closeEvent, mobileNavOpen, setMobileNavOpen, openLogin, closeLogin }}>
      <div
        className="w-full h-full flex"
        style={{ background: C.bg, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif", minHeight: 700 }}
      >
        <Sidebar active={active} setActive={navigate} />
        <MobileNavDrawer active={active} setActive={navigate} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title={selectedEvent ? `${selectedEvent.a} vs ${selectedEvent.b}` : titles[active]} setActive={navigate} />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {mainContent}
          </main>
        </div>
        {loginModalOpen && <LoginModal />}
        <SupportChatWidget />
      </div>
    </AppContext.Provider>
  );
}
