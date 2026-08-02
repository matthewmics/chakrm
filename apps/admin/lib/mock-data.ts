import type {
  AdminEvent,
  AdminUser,
  AuditEntry,
  Champion,
  Settlement,
  SportDef,
  Team,
  VolumePoint,
} from "./types";

// Stand-in for the API. Everything here is typed so pages stay presentational
// and the admin CRUD dialogs (add team, create event, settle) operate on this
// in-memory state until there's a backend to persist to.

export const SPORTS: SportDef[] = [
  { name: "Basketball", icon: "basketball", defaultLeague: "NBA" },
  { name: "Soccer", icon: "soccer", defaultLeague: "Premier League" },
  { name: "Football", icon: "football", defaultLeague: "NFL" },
  { name: "Tennis", icon: "tennis", defaultLeague: "ATP Masters" },
  { name: "Esports", icon: "esports", defaultLeague: "Valorant Champions" },
];

/** Rotating crest palette auto-assigned to teams created through the UI. */
export const CREST_PALETTE: [string, string][] = [
  ["#0B4D3C", "#0F7A5E"],
  ["#1B2A4A", "#3E5C9A"],
  ["#7A1F2B", "#B0303F"],
  ["#1E3A6E", "#4C7BC9"],
  ["#7A1F1F", "#C43A3A"],
  ["#1A1A1A", "#E8A93B"],
  ["#8A5A1E", "#E3B34F"],
  ["#1E4A3A", "#2FA37D"],
  ["#4A2A6E", "#8A55C9"],
  ["#7A3A10", "#E37A2A"],
];

export const TEAMS_SEED: Team[] = [
  { id: 1, name: "Celtics", sport: "Basketball", league: "NBA", colors: ["#0B4D3C", "#0F7A5E"] },
  { id: 2, name: "Nuggets", sport: "Basketball", league: "NBA", colors: ["#1B2A4A", "#3E5C9A"] },
  { id: 3, name: "Lakers", sport: "Basketball", league: "NBA", colors: ["#4A2A6E", "#8A55C9"] },
  { id: 4, name: "Suns", sport: "Basketball", league: "NBA", colors: ["#7A3A10", "#E37A2A"] },
  { id: 5, name: "Arsenal", sport: "Soccer", league: "Premier League", colors: ["#7A1F2B", "#B0303F"] },
  { id: 6, name: "Man City", sport: "Soccer", league: "Premier League", colors: ["#1E3A6E", "#4C7BC9"] },
  { id: 7, name: "Chelsea", sport: "Soccer", league: "Premier League", colors: ["#1E3A6E", "#3E6ABF"] },
  { id: 8, name: "Spurs", sport: "Soccer", league: "Premier League", colors: ["#1A1A1A", "#8A8F96"] },
  { id: 9, name: "Sentinels", sport: "Esports", league: "Valorant Champions", colors: ["#7A1F1F", "#C43A3A"] },
  { id: 10, name: "Fnatic", sport: "Esports", league: "Valorant Champions", colors: ["#1A1A1A", "#E8A93B"] },
  { id: 11, name: "Alcaraz", sport: "Tennis", league: "ATP Masters", colors: ["#8A5A1E", "#E3B34F"] },
  { id: 12, name: "Sinner", sport: "Tennis", league: "ATP Masters", colors: ["#1E4A3A", "#2FA37D"] },
  { id: 13, name: "49ers", sport: "Football", league: "NFL", colors: ["#7A2020", "#B23A3A"] },
  { id: 14, name: "Cowboys", sport: "Football", league: "NFL", colors: ["#0E1E3A", "#3E5A9E"] },
];

export const ADMIN_STATS = [
  { label: "Total Users", value: "8,412", sub: "+126", tone: "primary" as const, icon: "users" as const },
  { label: "Active Events", value: "34", sub: "+5", tone: "default" as const, icon: "calendar" as const },
  { label: "Pending Settlements", value: "3", tone: "gold" as const, icon: "clock" as const },
  { label: "Credits in Circulation", value: "2.4M", sub: "+3.1%", tone: "primary" as const, icon: "wallet" as const },
  { label: "Predictions Today", value: "1,982", sub: "+240", tone: "primary" as const, icon: "target" as const },
  { label: "Season Pool Volume", value: "18.6M", tone: "gold" as const, icon: "trophy" as const },
];

export const ADMIN_VOLUME: VolumePoint[] = [
  { d: "Mon", v: 210 },
  { d: "Tue", v: 260 },
  { d: "Wed", v: 240 },
  { d: "Thu", v: 300 },
  { d: "Fri", v: 340 },
  { d: "Sat", v: 410 },
  { d: "Sun", v: 380 },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: 1, name: "kestrel.eth", credits: 284600, acc: 71, role: "User", status: "Active", joined: "Mar 2025" },
  { id: 2, name: "north_bynum", credits: 261100, acc: 68, role: "User", status: "Active", joined: "Mar 2025" },
  { id: 3, name: "vera.codes", credits: 249800, acc: 66, role: "User", status: "Active", joined: "Apr 2025" },
  { id: 4, name: "hallowpine", credits: 198200, acc: 63, role: "User", status: "Suspended", joined: "Apr 2025" },
  { id: 5, name: "quietriot", credits: 184300, acc: 61, role: "User", status: "Active", joined: "May 2025" },
  { id: 6, name: "admin_ops", credits: 0, acc: 0, role: "Admin", status: "Active", joined: "Jan 2025" },
  { id: 7, name: "delta_marsh", credits: 176900, acc: 59, role: "User", status: "Active", joined: "May 2025" },
  { id: 8, name: "orsonvale", credits: 162500, acc: 57, role: "User", status: "Suspended", joined: "Jun 2025" },
];

export const ADMIN_EVENTS: AdminEvent[] = [
  { id: 1, league: "NBA", a: "Celtics", b: "Nuggets", pool: 48200, participants: 612, status: "Open" },
  { id: 2, league: "Premier League", a: "Arsenal", b: "Man City", pool: 91500, participants: 1284, status: "Open" },
  { id: 3, league: "Valorant Champions", a: "Sentinels", b: "Fnatic", pool: 22750, participants: 340, status: "Closing" },
  { id: 4, league: "ATP Masters", a: "Alcaraz", b: "Sinner", pool: 63400, participants: 803, status: "Live" },
  { id: 5, league: "NFL", a: "49ers", b: "Cowboys", pool: 128900, participants: 1966, status: "Open" },
  { id: 6, league: "NBA", a: "Lakers", b: "Suns", pool: 35600, participants: 498, status: "Settled" },
  { id: 7, league: "Premier League", a: "Chelsea", b: "Spurs", pool: 41200, participants: 560, status: "Voided" },
];

export const ADMIN_SETTLEMENTS: Settlement[] = [
  { id: 101, league: "NBA", a: "Celtics", b: "Nuggets", poolA: 29400, poolB: 18800, closed: "2h ago" },
  { id: 102, league: "Valorant Champions", a: "Sentinels", b: "Fnatic", poolA: 12500, poolB: 10250, closed: "40m ago" },
  { id: 103, league: "ATP Masters", a: "Alcaraz", b: "Sinner", poolA: 36800, poolB: 26600, closed: "10m ago" },
];

export const ADMIN_CHAMPIONS: Champion[] = [
  { season: "Season 3", champion: "kestrel.eth", credits: 312400 },
  { season: "Season 2", champion: "vera.codes", credits: 268900 },
  { season: "Season 1", champion: "orsonvale", credits: 190200 },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: 1, admin: "admin_ops", action: "Settled pool", detail: "NBA, Lakers vs Suns, winner: Lakers", t: "18m ago", tone: "emerald" },
  { id: 2, admin: "sable.ops", action: "Suspended user", detail: "hallowpine, flagged for repeated chargebacks", t: "1h ago", tone: "red" },
  { id: 3, admin: "admin_ops", action: "Voided pool", detail: "Premier League, Chelsea vs Spurs, match postponed", t: "3h ago", tone: "gold" },
  { id: 4, admin: "marlowe.k", action: "Reinstated user", detail: "orsonvale, appeal approved", t: "5h ago", tone: "emerald" },
  { id: 5, admin: "admin_ops", action: "Edited event", detail: "NFL, 49ers vs Cowboys, closing time extended 30m", t: "8h ago", tone: "muted" },
  { id: 6, admin: "sable.ops", action: "Ended season", detail: "Season 3 closed, standings finalized", t: "1d ago", tone: "gold" },
];

export const CURRENT_SEASON = {
  name: "Season 4",
  status: "in progress",
  endsIn: "12 days",
  participants: "8,412",
  poolVolume: "18.6M",
};
