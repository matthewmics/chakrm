import React, { useState, useEffect } from "react";
import {
  Shield, LayoutDashboard, Users, CalendarDays, Clock, Wallet as WalletIcon,
  Target, Trophy, TrendingUp, CheckCircle2, X, Search, Bell, ChevronDown,
  LogOut, UserX, UserCheck, AlertTriangle, Lock, Mail, KeyRound, History,
  Crown, Flame, Sparkles, Dribbble, CircleDot, Swords, Activity, Server,
  Filter, ArrowUpRight, ArrowDownRight, Flag, Plus, Trash2, Image as ImageIcon,
  Menu
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ---------------------------------------------------------------------------
// Design tokens, same family as the consumer app for brand consistency, with
// the logo mark and one accent flipped to gold to signal "this is the
// internal ops tool," not the public product.
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
    const id = "chakrm-admin-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const mono = "'JetBrains Mono', monospace";

// ---------------------------------------------------------------------------
// Team crest colors, same approach as the consumer app: stylized monogram
// badges rather than real logos, since real team marks are trademarked.
// ---------------------------------------------------------------------------
const TEAM_COLORS = {
  Celtics: ["#0B4D3C", "#0F7A5E"], Nuggets: ["#1B2A4A", "#3E5C9A"],
  Arsenal: ["#7A1F2B", "#B0303F"], "Man City": ["#1E3A6E", "#4C7BC9"],
  Sentinels: ["#7A1F1F", "#C43A3A"], Fnatic: ["#1A1A1A", "#E8A93B"],
  Alcaraz: ["#8A5A1E", "#E3B34F"], Sinner: ["#1E4A3A", "#2FA37D"],
  "49ers": ["#7A2020", "#B23A3A"], Cowboys: ["#0E1E3A", "#3E5A9E"],
  Lakers: ["#4A2A6E", "#8A55C9"], Suns: ["#7A3A10", "#E37A2A"],
  Chelsea: ["#1E3A6E", "#3E6ABF"], Spurs: ["#1A1A1A", "#8A8F96"],
};

function TeamBadge({ name, size = 32, colors, logo }) {
  const [c1, c2] = colors || TEAM_COLORS[name] || [C.emeraldSoft, C.goldSoft];
  const initials = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").map((s) => s[0]).join("").slice(0, 3).toUpperCase();
  const [logoFailed, setLogoFailed] = useState(false);

  if (logo && !logoFailed) {
    return (
      <div
        className="rounded-xl overflow-hidden shrink-0"
        style={{ width: size, height: size, border: `1px solid ${C.border}`, background: C.card }}
      >
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setLogoFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.32,
        background: `linear-gradient(150deg, ${c1}, ${c2})`,
        color: "#F5F7F6",
        border: `1px solid ${C.border}`,
        letterSpacing: "-0.02em",
        fontFamily: mono,
      }}
    >
      {initials}
    </div>
  );
}

// Sports supported for teams and events, each with an icon and a sensible
// default league name to pre-fill when creating a new event.
const SPORTS = [
  { name: "Basketball", icon: Dribbble, defaultLeague: "NBA" },
  { name: "Soccer", icon: CircleDot, defaultLeague: "Premier League" },
  { name: "Football", icon: Dribbble, defaultLeague: "NFL" },
  { name: "Tennis", icon: Activity, defaultLeague: "ATP Masters" },
  { name: "Esports", icon: Swords, defaultLeague: "Valorant Champions" },
];

// Rotating crest palette, auto-assigned to teams created through the admin
// UI so nobody has to pick colors by hand.
const CREST_PALETTE = [
  ["#0B4D3C", "#0F7A5E"], ["#1B2A4A", "#3E5C9A"], ["#7A1F2B", "#B0303F"],
  ["#1E3A6E", "#4C7BC9"], ["#7A1F1F", "#C43A3A"], ["#1A1A1A", "#E8A93B"],
  ["#8A5A1E", "#E3B34F"], ["#1E4A3A", "#2FA37D"], ["#4A2A6E", "#8A55C9"],
  ["#7A3A10", "#E37A2A"],
];

// Seed teams, one entry per team already referenced in the mock events and
// settlements above, carrying their existing crest colors so nothing shifts
// visually. New teams created in the Teams tab get appended to this list.
const TEAMS_SEED = [
  { id: 1, name: "Celtics", sport: "Basketball", league: "NBA", colors: TEAM_COLORS.Celtics },
  { id: 2, name: "Nuggets", sport: "Basketball", league: "NBA", colors: TEAM_COLORS.Nuggets },
  { id: 3, name: "Lakers", sport: "Basketball", league: "NBA", colors: TEAM_COLORS.Lakers },
  { id: 4, name: "Suns", sport: "Basketball", league: "NBA", colors: TEAM_COLORS.Suns },
  { id: 5, name: "Arsenal", sport: "Soccer", league: "Premier League", colors: TEAM_COLORS.Arsenal },
  { id: 6, name: "Man City", sport: "Soccer", league: "Premier League", colors: TEAM_COLORS["Man City"] },
  { id: 7, name: "Chelsea", sport: "Soccer", league: "Premier League", colors: TEAM_COLORS.Chelsea },
  { id: 8, name: "Spurs", sport: "Soccer", league: "Premier League", colors: TEAM_COLORS.Spurs },
  { id: 9, name: "Sentinels", sport: "Esports", league: "Valorant Champions", colors: TEAM_COLORS.Sentinels },
  { id: 10, name: "Fnatic", sport: "Esports", league: "Valorant Champions", colors: TEAM_COLORS.Fnatic },
  { id: 11, name: "Alcaraz", sport: "Tennis", league: "ATP Masters", colors: TEAM_COLORS.Alcaraz },
  { id: 12, name: "Sinner", sport: "Tennis", league: "ATP Masters", colors: TEAM_COLORS.Sinner },
  { id: 13, name: "49ers", sport: "Football", league: "NFL", colors: TEAM_COLORS["49ers"] },
  { id: 14, name: "Cowboys", sport: "Football", league: "NFL", colors: TEAM_COLORS.Cowboys },
];

function Avatar({ name, size = 32 }) {
  const initials = name.split(/[._]/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${C.goldSoft}, ${C.emeraldSoft})`,
        color: C.text, border: `1px solid ${C.border}`,
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "teams", label: "Teams", icon: Flag },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "settlements", label: "Settlements", icon: CheckCircle2 },
  { key: "leaderboards", label: "Leaderboards", icon: Trophy },
  { key: "audit", label: "Audit Log", icon: History },
];

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

const AUDIT_LOG = [
  { id: 1, admin: "admin_ops", action: "Settled pool", detail: "NBA, Lakers vs Suns, winner: Lakers", t: "18m ago", tone: "emerald" },
  { id: 2, admin: "sable.ops", action: "Suspended user", detail: "hallowpine, flagged for repeated chargebacks", t: "1h ago", tone: "red" },
  { id: 3, admin: "admin_ops", action: "Voided pool", detail: "Premier League, Chelsea vs Spurs, match postponed", t: "3h ago", tone: "gold" },
  { id: 4, admin: "marlowe.k", action: "Reinstated user", detail: "orsonvale, appeal approved", t: "5h ago", tone: "emerald" },
  { id: 5, admin: "admin_ops", action: "Edited event", detail: "NFL, 49ers vs Cowboys, closing time extended 30m", t: "8h ago", tone: "muted" },
  { id: 6, admin: "sable.ops", action: "Ended season", detail: "Season 3 closed, standings finalized", t: "1d ago", tone: "gold" },
];

// ---------------------------------------------------------------------------
// Shared building blocks
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
        <span className="text-2xl font-semibold tabular-nums" style={{ color: C.text, fontFamily: mono }}>{value}</span>
        {sub && (
          <span className="text-[12px] font-medium flex items-center gap-0.5" style={{ color: sub.startsWith("-") ? C.red : C.emerald }}>
            {sub.startsWith("-") ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
            {sub}
          </span>
        )}
      </div>
    </Card>
  );
}

function adminStatusBadge(status) {
  if (status === "Live") return <Badge tone="red">Live</Badge>;
  if (status === "Closing") return <Badge tone="gold">Closing soon</Badge>;
  if (status === "Settled") return <Badge tone="muted">Settled</Badge>;
  if (status === "Voided") return <Badge tone="red">Voided</Badge>;
  return <Badge tone="emerald">Open</Badge>;
}

// ---------------------------------------------------------------------------
// Settlement dialog
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
              <span className="text-[11.5px] tabular-nums" style={{ color: C.textMuted, fontFamily: mono }}>
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
            Void pool and refund all Credits
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 flex-wrap gap-2" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
          <span className="text-[11.5px]" style={{ color: C.textFaint }}>Total pool: {total.toLocaleString()} Credits</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium" style={{ color: C.textMuted, border: `1px solid ${C.border}` }}>
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

// ---------------------------------------------------------------------------
// Add team dialog
// ---------------------------------------------------------------------------
function AddTeamDialog({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState(SPORTS[0].name);
  const [league, setLeague] = useState(SPORTS[0].defaultLeague);
  const [logo, setLogo] = useState("");

  const handleSportChange = (nextSport) => {
    setSport(nextSport);
    const def = SPORTS.find((s) => s.name === nextSport);
    setLeague(def ? def.defaultLeague : "");
  };

  const canCreate = name.trim().length > 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(6,8,9,0.65)", zIndex: 50 }} onClick={onClose}>
      <div className="w-full rounded-2xl border p-5 flex flex-col gap-4" style={{ background: C.bgElevated, borderColor: C.border, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold" style={{ color: C.text }}>Add team</h3>
          <button onClick={onClose}><X size={16} style={{ color: C.textFaint }} /></button>
        </div>

        <div className="flex items-center gap-3">
          <TeamBadge name={name || "?"} size={40} logo={logo} colors={name ? undefined : [C.borderSubtle, C.border]} />
          <span className="text-[11.5px]" style={{ color: C.textFaint }}>
            {logo ? "Using the logo above." : "No logo yet, a color crest is used instead."}
          </span>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Team name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Warriors"
            className="px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Logo URL (optional)</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <ImageIcon size={14} style={{ color: C.textFaint }} />
            <input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: C.text }}
            />
          </div>
          <span className="text-[10.5px]" style={{ color: C.textFaint }}>
            Only upload logos you have the rights to use. Leave blank to use an auto-generated color crest instead.
          </span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Sport</span>
          <select
            value={sport}
            onChange={(e) => handleSportChange(e.target.value)}
            className="px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
          >
            {SPORTS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>League</span>
          <input
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
          />
        </label>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium" style={{ color: C.textMuted, border: `1px solid ${C.border}` }}>
            Cancel
          </button>
          <button
            disabled={!canCreate}
            onClick={() => onCreate({ name: name.trim(), sport, league, logo: logo.trim() || null })}
            className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
            style={{ background: canCreate ? C.emerald : C.borderSubtle, color: canCreate ? "#04140D" : C.textFaint }}
          >
            Add team
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create event dialog
// ---------------------------------------------------------------------------
function CreateEventDialog({ teams, onClose, onCreate }) {
  const [sport, setSport] = useState(SPORTS[0].name);
  const [league, setLeague] = useState(SPORTS[0].defaultLeague);
  const [teamAId, setTeamAId] = useState("");
  const [teamBId, setTeamBId] = useState("");
  const [time, setTime] = useState("");
  const [pool, setPool] = useState(0);

  const sportTeams = teams.filter((t) => t.sport === sport);

  const handleSportChange = (nextSport) => {
    setSport(nextSport);
    const def = SPORTS.find((s) => s.name === nextSport);
    setLeague(def ? def.defaultLeague : "");
    setTeamAId("");
    setTeamBId("");
  };

  const canCreate = teamAId && teamBId && teamAId !== teamBId && time.trim().length > 0;

  const handleCreate = () => {
    const teamA = teams.find((t) => String(t.id) === String(teamAId));
    const teamB = teams.find((t) => String(t.id) === String(teamBId));
    onCreate({ league, a: teamA.name, b: teamB.name, time, pool: Number(pool) || 0 });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(6,8,9,0.65)", zIndex: 50 }} onClick={onClose}>
      <div className="w-full rounded-2xl border p-5 flex flex-col gap-4" style={{ background: C.bgElevated, borderColor: C.border, maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold" style={{ color: C.text }}>Create event</h3>
          <button onClick={onClose}><X size={16} style={{ color: C.textFaint }} /></button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Sport</span>
          <select
            value={sport}
            onChange={(e) => handleSportChange(e.target.value)}
            className="px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
          >
            {SPORTS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>League</span>
          <input
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
          />
        </label>

        {sportTeams.length < 2 ? (
          <p className="text-[12px] px-3 py-2.5 rounded-lg" style={{ background: C.goldSoft, color: C.gold }}>
            You need at least two {sport} teams before you can create a {sport} event. Add teams in the Teams tab first.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Team A</span>
              <select
                value={teamAId}
                onChange={(e) => setTeamAId(e.target.value)}
                className="px-3 py-2 rounded-lg text-[13px] outline-none"
                style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
              >
                <option value="">Select team</option>
                {sportTeams.map((t) => <option key={t.id} value={t.id} disabled={String(t.id) === String(teamBId)}>{t.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Team B</span>
              <select
                value={teamBId}
                onChange={(e) => setTeamBId(e.target.value)}
                className="px-3 py-2 rounded-lg text-[13px] outline-none"
                style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
              >
                <option value="">Select team</option>
                {sportTeams.map((t) => <option key={t.id} value={t.id} disabled={String(t.id) === String(teamAId)}>{t.name}</option>)}
              </select>
            </label>
          </div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Match time</span>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. Sat, 7:30 PM"
            className="px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Starting pool (Credits, optional)</span>
          <input
            type="number"
            min="0"
            value={pool}
            onChange={(e) => setPool(e.target.value)}
            className="px-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
          />
        </label>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium" style={{ color: C.textMuted, border: `1px solid ${C.border}` }}>
            Cancel
          </button>
          <button
            disabled={!canCreate}
            onClick={handleCreate}
            className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
            style={{ background: canCreate ? C.emerald : C.borderSubtle, color: canCreate ? "#04140D" : C.textFaint }}
          >
            Create event
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login screen, this is a separate app with its own access boundary
// ---------------------------------------------------------------------------
function LoginScreen({ onSignIn }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4" style={{ background: C.bg, minHeight: 700 }}>
      <div className="w-full flex flex-col items-center gap-6" style={{ maxWidth: 380 }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: C.goldSoft, border: `1px solid ${C.gold}55` }}>
            <Shield size={22} style={{ color: C.gold }} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[17px] font-semibold tracking-tight" style={{ color: C.text }}>Chakrm Admin</span>
            <span className="text-[12.5px]" style={{ color: C.textMuted }}>Internal operations console</span>
          </div>
        </div>

        <Card className="w-full p-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Work email</span>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: C.bgElevated, border: `1px solid ${C.border}` }}>
              <Mail size={14} style={{ color: C.textFaint }} />
              <input
                defaultValue="admin_ops@chakrm.com"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: C.text }}
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium" style={{ color: C.textMuted }}>Password</span>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: C.bgElevated, border: `1px solid ${C.border}` }}>
              <KeyRound size={14} style={{ color: C.textFaint }} />
              <input
                type="password"
                defaultValue="••••••••••"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: C.text }}
              />
            </div>
          </label>

          <button
            onClick={onSignIn}
            className="mt-1 py-2.5 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: C.emerald, color: "#04140D" }}
          >
            <Lock size={13} /> Sign in
          </button>
        </Card>

        <p className="text-[11.5px] text-center max-w-xs" style={{ color: C.textFaint }}>
          Restricted to authorized Chakrm staff. This console is not the consumer app, no Credits or predictions live here.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function SidebarNavContent({ active, setActive, onSignOut, onNavigate }) {
  const go = (key) => {
    setActive(key);
    if (onNavigate) onNavigate();
  };

  return (
    <>
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.gold }}>
          <Shield size={14} style={{ color: "#241A05" }} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-semibold text-[14px] tracking-tight" style={{ color: C.text }}>Chakrm</span>
          <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: C.gold }}>Admin</span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const isActive = active === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium text-left transition-colors"
              style={{ color: isActive ? C.text : C.textMuted, background: isActive ? C.card : "transparent" }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = C.borderSubtle; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={16} style={{ color: isActive ? C.gold : C.textFaint }} />
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <Card className="p-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Server size={12} style={{ color: C.emerald }} />
            <span className="text-[11.5px] font-semibold" style={{ color: C.text }}>Production</span>
          </div>
          <span className="text-[10.5px]" style={{ color: C.textFaint }}>Actions here affect live users and pools.</span>
        </Card>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium"
          style={{ color: C.textMuted }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </>
  );
}

function Sidebar({ active, setActive, onSignOut }) {
  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-full border-r px-3 py-4"
      style={{ background: C.bgElevated, borderColor: C.borderSubtle }}
    >
      <SidebarNavContent active={active} setActive={setActive} onSignOut={onSignOut} />
    </aside>
  );
}

// Mobile-only slide-in drawer, reachable via the hamburger button in Topbar.
function MobileNavDrawer({ active, setActive, onSignOut, open, onClose }) {
  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0" style={{ zIndex: 60 }}>
      <div className="absolute inset-0" style={{ background: "rgba(6,8,9,0.65)" }} onClick={onClose} />
      <div
        className="absolute left-0 top-0 bottom-0 flex flex-col px-3 py-4"
        style={{ width: 260, background: C.bgElevated, borderRight: `1px solid ${C.borderSubtle}` }}
      >
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textFaint }}>Menu</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.card }}>
            <X size={13} style={{ color: C.textMuted }} />
          </button>
        </div>
        <SidebarNavContent active={active} setActive={setActive} onSignOut={onSignOut} onNavigate={onClose} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Topbar
// ---------------------------------------------------------------------------
function Topbar({ title, onMenuClick }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="h-14 shrink-0 flex items-center justify-between px-4 md:px-6 border-b relative"
      style={{ background: C.bgElevated, borderColor: C.borderSubtle }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden w-8 h-8 -ml-1 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <Menu size={15} style={{ color: C.textMuted }} />
        </button>
        <span className="font-semibold text-[15px] tracking-tight" style={{ color: C.text }}>{title}</span>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg w-72" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <Search size={14} style={{ color: C.textFaint }} />
          <span className="text-[13px]" style={{ color: C.textFaint }}>Search users, events, logs…</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium" style={{ background: C.emeraldSoft, color: C.emerald, border: `1px solid ${C.emeraldLine}` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.emerald }} /> Production
        </span>
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <Bell size={14} style={{ color: C.textMuted }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
        </button>
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1 rounded-full">
            <Avatar name="admin_ops" size={30} />
            <ChevronDown size={13} style={{ color: C.textFaint }} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0" style={{ zIndex: 20 }} onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 rounded-xl border overflow-hidden shadow-2xl" style={{ background: C.bgElevated, borderColor: C.border, zIndex: 30 }}>
                <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                  <Avatar name="admin_ops" size={32} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{ color: C.text }}>admin_ops</div>
                    <div className="text-[11.5px] truncate" style={{ color: C.textFaint }}>Platform administrator</div>
                  </div>
                </div>
                <div className="py-1">
                  <div className="px-4 py-2 text-[12.5px]" style={{ color: C.textMuted }}>admin_ops@chakrm.com</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
function OverviewSection() {
  return (
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
              <Tooltip contentStyle={{ background: C.bgElevated, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: C.textMuted }} itemStyle={{ color: C.emerald }} />
              <Area type="monotone" dataKey="v" stroke={C.emerald} strokeWidth={2} fill="url(#adminVol)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
function UsersSection() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [overrides, setOverrides] = useState({});

  const statusFor = (u) => (overrides[u.id] !== undefined ? (overrides[u.id] ? "Suspended" : "Active") : u.status);
  const toggleSuspend = (u) => setOverrides({ ...overrides, [u.id]: statusFor(u) === "Active" });

  const filtered = ADMIN_USERS.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || statusFor(u) === filter;
    return matchesQuery && matchesFilter;
  });

  const cols = [
    { label: "Player", width: null },
    { label: "Credits", width: 100, align: "right" },
    { label: "Accuracy", width: 90, align: "right" },
    { label: "Role", width: 80 },
    { label: "Status", width: 100 },
    { label: "Joined", width: 90 },
    { label: "Actions", width: 110, align: "right" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Active", "Suspended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
              style={{
                background: filter === f ? C.emeraldSoft : C.card,
                color: filter === f ? C.emerald : C.textMuted,
                border: `1px solid ${filter === f ? C.emeraldLine : C.border}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}`, width: 220 }}>
          <Search size={13} style={{ color: C.textFaint }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users…"
            className="bg-transparent outline-none text-[12.5px] flex-1"
            style={{ color: C.text }}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
            <colgroup>{cols.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                {cols.map((c) => (
                  <th key={c.label} className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textFaint, textAlign: c.align || "left", padding: "10px 16px" }}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
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
                      <span className="text-[12.5px] tabular-nums" style={{ color: C.text, fontFamily: mono }}>{u.credits.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <span className="text-[12.5px] tabular-nums" style={{ color: C.textMuted, fontFamily: mono }}>{u.role === "Admin" ? "N/A" : `${u.acc}%`}</span>
                    </td>
                    <td style={{ padding: "10px 16px" }}><Badge tone={u.role === "Admin" ? "gold" : "muted"}>{u.role}</Badge></td>
                    <td style={{ padding: "10px 16px" }}><Badge tone={status === "Active" ? "emerald" : "red"}>{status}</Badge></td>
                    <td style={{ padding: "10px 16px" }}><span className="text-[12px]" style={{ color: C.textMuted }}>{u.joined}</span></td>
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
  );
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------
function TeamsSection({ teams, setTeams }) {
  const [showAdd, setShowAdd] = useState(false);
  const [sportFilter, setSportFilter] = useState("All");

  const filtered = sportFilter === "All" ? teams : teams.filter((t) => t.sport === sportFilter);

  const handleCreate = ({ name, sport, league, logo }) => {
    const nextId = Math.max(0, ...teams.map((t) => t.id)) + 1;
    const colors = CREST_PALETTE[teams.length % CREST_PALETTE.length];
    setTeams([...teams, { id: nextId, name, sport, league, colors, logo }]);
    setShowAdd(false);
  };

  const removeTeam = (id) => setTeams(teams.filter((t) => t.id !== id));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {["All", ...SPORTS.map((s) => s.name)].map((s) => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
              style={{
                background: sportFilter === s ? C.emeraldSoft : C.card,
                color: sportFilter === s ? C.emerald : C.textMuted,
                border: `1px solid ${sportFilter === s ? C.emeraldLine : C.border}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
          style={{ background: C.emerald, color: "#04140D" }}
        >
          <Plus size={13} /> Add team
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((t) => (
          <Card key={t.id} className="p-4 flex items-center gap-3" hover>
            <TeamBadge name={t.name} size={40} colors={t.colors} logo={t.logo} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate" style={{ color: C.text }}>{t.name}</div>
              <div className="text-[11.5px] truncate" style={{ color: C.textFaint }}>{t.league}</div>
            </div>
            <Badge tone="muted">{t.sport}</Badge>
            <button onClick={() => removeTeam(t.id)} className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.redSoft }}>
              <Trash2 size={12} style={{ color: C.red }} />
            </button>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-8 flex flex-col items-center justify-center text-center gap-2 sm:col-span-2 lg:col-span-3">
            <Flag size={18} style={{ color: C.textFaint }} />
            <p className="text-[12.5px]" style={{ color: C.textMuted }}>No teams yet for this sport.</p>
          </Card>
        )}
      </div>

      {showAdd && <AddTeamDialog onClose={() => setShowAdd(false)} onCreate={handleCreate} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
function EventsSection({ events, setEvents, teams }) {
  const [showCreate, setShowCreate] = useState(false);

  const findTeam = (name) => teams.find((t) => t.name === name);

  const handleCreate = ({ league, a, b, time, pool }) => {
    const nextId = Math.max(0, ...events.map((e) => e.id)) + 1;
    setEvents([...events, { id: nextId, league, a, b, time, pool, participants: 0, status: "Open" }]);
    setShowCreate(false);
  };

  const cols = [
    { label: "Match", width: null },
    { label: "League", width: 150 },
    { label: "Pool", width: 100, align: "right" },
    { label: "Participants", width: 100, align: "right" },
    { label: "Status", width: 110 },
    { label: "", width: 90, align: "right" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold"
          style={{ background: C.emerald, color: "#04140D" }}
        >
          <Plus size={13} /> Create event
        </button>
      </div>

      <Card className="overflow-hidden">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
            <colgroup>{cols.map((c, i) => <col key={i} style={c.width ? { width: c.width } : undefined} />)}</colgroup>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>
                {cols.map((c) => (
                  <th key={c.label} className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textFaint, textAlign: c.align || "left", padding: "10px 16px" }}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={e.id} style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamBadge name={e.a} size={24} colors={findTeam(e.a)?.colors} logo={findTeam(e.a)?.logo} />
                      <span className="text-[12.5px]" style={{ color: C.text }}>{e.a} vs {e.b}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px" }}><span className="text-[12px]" style={{ color: C.textMuted }}>{e.league}</span></td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    <span className="text-[12.5px] tabular-nums" style={{ color: C.text, fontFamily: mono }}>{e.pool.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "right" }}>
                    <span className="text-[12.5px] tabular-nums" style={{ color: C.textMuted, fontFamily: mono }}>{e.participants.toLocaleString()}</span>
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

      {showCreate && <CreateEventDialog teams={teams} onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settlements
// ---------------------------------------------------------------------------
function SettlementsSection() {
  const [settleTarget, setSettleTarget] = useState(null);
  const [settledIds, setSettledIds] = useState([]);
  const pending = ADMIN_SETTLEMENTS.filter((s) => !settledIds.includes(s.id));

  return (
    <div className="flex flex-col gap-3">
      {pending.length === 0 ? (
        <Card className="p-10 flex flex-col items-center justify-center text-center gap-2">
          <CheckCircle2 size={20} style={{ color: C.emerald }} />
          <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>All caught up</h3>
          <p className="text-[12.5px] max-w-xs" style={{ color: C.textMuted }}>No pools are waiting on a settlement decision right now.</p>
        </Card>
      ) : (
        pending.map((s) => (
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
                <div className="text-[13px] font-semibold tabular-nums" style={{ color: C.text, fontFamily: mono }}>{(s.poolA + s.poolB).toLocaleString()}</div>
              </div>
              <button onClick={() => setSettleTarget(s)} className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold" style={{ background: C.gold, color: "#241A05" }}>
                Settle
              </button>
            </div>
          </Card>
        ))
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
// Leaderboards management
// ---------------------------------------------------------------------------
function LeaderboardsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} style={{ color: C.gold }} />
          <h3 className="text-[14px] font-semibold" style={{ color: C.text }}>Season 4, in progress</h3>
        </div>
        <p className="text-[12.5px]" style={{ color: C.textMuted }}>Ends in 12 days. 8,412 participants. 18.6M Credits in the season pool.</p>
        <div className="flex items-center gap-2 mt-1">
          <button className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold" style={{ background: C.emerald, color: "#04140D" }}>Export standings</button>
          <button className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium" style={{ color: C.red, border: `1px solid ${C.redSoft}`, background: C.redSoft }}>End season now</button>
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
  );
}

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------
function AuditSection() {
  return (
    <Card className="p-2">
      {AUDIT_LOG.map((entry, i) => (
        <div key={entry.id} className="flex items-start gap-3 px-3 py-3" style={{ borderTop: i ? `1px solid ${C.borderSubtle}` : "none" }}>
          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{
            background: entry.tone === "emerald" ? C.emerald : entry.tone === "gold" ? C.gold : entry.tone === "red" ? C.red : C.textFaint,
          }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[12.5px] font-semibold" style={{ color: C.text }}>{entry.admin}</span>
              <span className="text-[12.5px]" style={{ color: C.textMuted }}>{entry.action.toLowerCase()}</span>
            </div>
            <span className="text-[12px]" style={{ color: C.textFaint }}>{entry.detail}</span>
          </div>
          <span className="text-[11px] w-16 text-right shrink-0" style={{ color: C.textFaint }}>{entry.t}</span>
        </div>
      ))}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function ChakrmAdminPrototype() {
  useFonts();
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("overview");
  const [teams, setTeams] = useState(TEAMS_SEED);
  const [events, setEvents] = useState(ADMIN_EVENTS);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const titles = {
    overview: "Overview", users: "Users", teams: "Teams", events: "Events",
    settlements: "Settlements", leaderboards: "Leaderboards", audit: "Audit Log",
  };

  const sections = {
    overview: <OverviewSection />,
    users: <UsersSection />,
    teams: <TeamsSection teams={teams} setTeams={setTeams} />,
    events: <EventsSection events={events} setEvents={setEvents} teams={teams} />,
    settlements: <SettlementsSection />,
    leaderboards: <LeaderboardsSection />,
    audit: <AuditSection />,
  };

  if (!loggedIn) {
    return <LoginScreen onSignIn={() => setLoggedIn(true)} />;
  }

  const handleSignOut = () => { setMobileNavOpen(false); setLoggedIn(false); };

  return (
    <div className="w-full h-full flex" style={{ background: C.bg, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif", minHeight: 700 }}>
      <Sidebar active={active} setActive={setActive} onSignOut={handleSignOut} />
      <MobileNavDrawer
        active={active}
        setActive={setActive}
        onSignOut={handleSignOut}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={titles[active]} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {sections[active]}
        </main>
      </div>
    </div>
  );
}
