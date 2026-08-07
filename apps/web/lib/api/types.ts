/**
 * Mirrors the response DTOs in `apps/api/src/**\/dto`. Hand-maintained for now;
 * the API publishes an OpenAPI document at `/api/docs-json` if we later want to
 * generate this instead.
 */

export type UserRole = "member" | "admin";

/**
 * The only user shape the API returns. No password or Google id — see
 * `apps/api/src/auth/user.mapper.ts`, which builds it field by field.
 */
export type AuthUserResponse = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  credits: number;
  role: UserRole;
  /** False for accounts created through Google that never set a password. */
  hasPassword: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SportResponse = {
  id: string;
  name: string;
  slug: string;
  isEsport: boolean;
  iconUrl: string | null;
};

export type EventTeamResponse = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export type EventTournamentResponse = {
  id: string;
  name: string;
  season: string | null;
  logoUrl: string | null;
  sport: SportResponse;
};

/** Admin-driven only — never derived from `startDate`. */
export type ApiEventStatus = "upcoming" | "live" | "settled" | "cancelled";

export type EventListItemResponse = {
  id: string;
  title: string;
  stage: string | null;
  status: ApiEventStatus;
  /** ISO 8601, or null when unscheduled. Informational only. */
  startDate: string | null;
  teamAScore: number;
  teamBScore: number;
  winnerTeamId: string | null;
  tournament: EventTournamentResponse;
  teamA: EventTeamResponse;
  teamB: EventTeamResponse;
  marketCount: number;
  totalPool: number;
};

export type MarketOptionStatus = "active" | "suspended" | "hidden";

/** Admin-driven only — never derived from `startDate`. */
export type ApiMarketStatus =
  | "upcoming"
  | "open"
  | "live"
  | "suspended"
  | "settled"
  | "cancelled";

export type MarketOptionResponse = {
  id: string;
  name: string;
  /** Payout ratios are derived live as `market.totalPool / totalCredits`. */
  totalCredits: number;
  isWinningOption: boolean;
  status: MarketOptionStatus;
};

export type MarketResponse = {
  id: string;
  eventId: string;
  name: string;
  status: ApiMarketStatus;
  startDate: string | null;
  totalPool: number;
  options: MarketOptionResponse[];
};

export type EventDetailResponse = EventListItemResponse & {
  markets: MarketResponse[];
};
