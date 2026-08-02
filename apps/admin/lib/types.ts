export type Tone = "muted" | "primary" | "gold" | "destructive";

export type Sport =
  | "Basketball"
  | "Soccer"
  | "Football"
  | "Tennis"
  | "Esports";

export type AdminEventStatus = "Open" | "Closing" | "Live" | "Settled" | "Voided";

export type UserRole = "User" | "Admin";
export type UserStatus = "Active" | "Suspended";

export type AdminUser = {
  id: number;
  name: string;
  credits: number;
  acc: number;
  role: UserRole;
  status: UserStatus;
  joined: string;
};

export type Team = {
  id: number;
  name: string;
  sport: Sport;
  league: string;
  colors: [string, string];
  logo?: string | null;
};

export type AdminEvent = {
  id: number;
  league: string;
  a: string;
  b: string;
  time?: string;
  pool: number;
  participants: number;
  status: AdminEventStatus;
};

export type Settlement = {
  id: number;
  league: string;
  a: string;
  b: string;
  poolA: number;
  poolB: number;
  closed: string;
};

export type Champion = {
  season: string;
  champion: string;
  credits: number;
};

export type AuditTone = "emerald" | "gold" | "red" | "muted";

export type AuditEntry = {
  id: number;
  admin: string;
  action: string;
  detail: string;
  t: string;
  tone: AuditTone;
};

export type VolumePoint = {
  d: string;
  v: number;
};

export type SportDef = {
  name: Sport;
  icon: "basketball" | "soccer" | "football" | "tennis" | "esports";
  defaultLeague: string;
};
