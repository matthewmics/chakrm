import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from '@node-rs/argon2';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');
if (process.env.NODE_ENV === 'production') {
  throw new Error('seed.ts wipes data; refusing to run with NODE_ENV=production');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Fixed ids keep dev fixtures stable across reseeds (admin URLs like
// /events/<id> stay valid instead of shifting on every `prisma db seed`).
const TEAM = {
  lakers: 'team-lakers',
  celtics: 'team-celtics',
  nuggets: 'team-nuggets',
  warriors: 'team-warriors',
  bucks: 'team-bucks',
  knicks: 'team-knicks',
  thunder: 'team-thunder',
  mavericks: 'team-mavericks',
  spirit: 'team-spirit',
  falcons: 'team-falcons',
  liquid: 'team-liquid',
  tundra: 'team-tundra',
  betboom: 'team-betboom',
  navi: 'team-navi',
  faze: 'team-faze',
  vitality: 'team-vitality',
  g2: 'team-g2',
  mouz: 'team-mouz',
  arsenal: 'team-arsenal',
  liverpool: 'team-liverpool',
  mancity: 'team-mancity',
  chelsea: 'team-chelsea',
  realmadrid: 'team-realmadrid',
  bayern: 'team-bayern',
} as const;

const TOURNAMENT = {
  nba: 'tournament-nba',
  premierLeague: 'tournament-premier-league',
  ucl: 'tournament-ucl',
  ti2026: 'tournament-ti-2026',
  eslBirmingham: 'tournament-esl-one-birmingham-2026',
  iemKatowice: 'tournament-iem-katowice-2026',
  blastSpring: 'tournament-blast-premier-spring-2026',
} as const;

const SPORT = {
  basketball: 'sport-basketball',
  soccer: 'sport-soccer',
  dota2: 'sport-dota2',
  cs2: 'sport-cs2',
} as const;

const logo = (slug: string) => `https://cdn.chakrm.dev/teams/${slug}.png`;

const sports = [
  { id: SPORT.basketball, name: 'Basketball', slug: 'basketball', isEsport: false, iconUrl: null },
  { id: SPORT.soccer, name: 'Soccer', slug: 'soccer', isEsport: false, iconUrl: null },
  { id: SPORT.dota2, name: 'Dota 2', slug: 'dota2', isEsport: true, iconUrl: null },
  { id: SPORT.cs2, name: 'CS2', slug: 'cs2', isEsport: true, iconUrl: null },
];

const teams = [
  // NBA — all get logos
  { id: TEAM.lakers, name: 'Los Angeles Lakers', logoUrl: logo('lakers') },
  { id: TEAM.celtics, name: 'Boston Celtics', logoUrl: logo('celtics') },
  { id: TEAM.nuggets, name: 'Denver Nuggets', logoUrl: logo('nuggets') },
  { id: TEAM.warriors, name: 'Golden State Warriors', logoUrl: logo('warriors') },
  { id: TEAM.bucks, name: 'Milwaukee Bucks', logoUrl: logo('bucks') },
  { id: TEAM.knicks, name: 'New York Knicks', logoUrl: logo('knicks') },
  { id: TEAM.thunder, name: 'Oklahoma City Thunder', logoUrl: logo('thunder') },
  { id: TEAM.mavericks, name: 'Dallas Mavericks', logoUrl: logo('mavericks') },
  // Dota 2 — mixed
  { id: TEAM.spirit, name: 'Team Spirit', logoUrl: logo('spirit') },
  { id: TEAM.falcons, name: 'Team Falcons', logoUrl: null },
  { id: TEAM.liquid, name: 'Team Liquid', logoUrl: logo('liquid') },
  { id: TEAM.tundra, name: 'Tundra Esports', logoUrl: null },
  { id: TEAM.betboom, name: 'BetBoom Team', logoUrl: null },
  // CS2 — mixed
  { id: TEAM.navi, name: 'Natus Vincere', logoUrl: logo('navi') },
  { id: TEAM.faze, name: 'FaZe Clan', logoUrl: logo('faze') },
  { id: TEAM.vitality, name: 'Team Vitality', logoUrl: null },
  { id: TEAM.g2, name: 'G2 Esports', logoUrl: null },
  { id: TEAM.mouz, name: 'MOUZ', logoUrl: null },
  // Soccer — mixed
  { id: TEAM.arsenal, name: 'Arsenal', logoUrl: logo('arsenal') },
  { id: TEAM.liverpool, name: 'Liverpool', logoUrl: null },
  { id: TEAM.mancity, name: 'Manchester City', logoUrl: null },
  { id: TEAM.chelsea, name: 'Chelsea', logoUrl: null },
  { id: TEAM.realmadrid, name: 'Real Madrid', logoUrl: logo('real-madrid') },
  { id: TEAM.bayern, name: 'Bayern Munich', logoUrl: null },
];

// Team Spirit plays both Dota 2 (The International) and CS2 (BLAST) in this
// seed's events — the one deliberate many-to-many case demonstrating why
// TeamSport is a pivot table rather than a single sportId on Team.
const teamSports: { teamId: string; sportId: string }[] = [
  ...[TEAM.lakers, TEAM.celtics, TEAM.nuggets, TEAM.warriors, TEAM.bucks, TEAM.knicks, TEAM.thunder, TEAM.mavericks]
    .map((teamId) => ({ teamId, sportId: SPORT.basketball })),
  ...[TEAM.spirit, TEAM.falcons, TEAM.liquid, TEAM.tundra, TEAM.betboom]
    .map((teamId) => ({ teamId, sportId: SPORT.dota2 })),
  ...[TEAM.spirit, TEAM.navi, TEAM.faze, TEAM.vitality, TEAM.g2, TEAM.mouz]
    .map((teamId) => ({ teamId, sportId: SPORT.cs2 })),
  ...[TEAM.arsenal, TEAM.liverpool, TEAM.mancity, TEAM.chelsea, TEAM.realmadrid, TEAM.bayern]
    .map((teamId) => ({ teamId, sportId: SPORT.soccer })),
];

// --- time helpers, computed relative to now so fixtures never go stale ---
const now = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/**
 * Stable pseudo-random 0..1 derived from a string (FNV-1a). Using the event id
 * as the seed spreads start times out instead of stacking every fixture on the
 * same timestamp, while keeping a given event's offset identical across
 * reseeds — so a fixture doesn't jump around while you're debugging it.
 */
const unitFromSeed = (seed: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10_000) / 10_000;
};

/** Upcoming events start at least 24h out, scattered across the following day. */
const upcomingStart = (eventId: string) =>
  new Date(now + DAY + unitFromSeed(eventId) * DAY);

/** Settled events started at least 24h ago, scattered over the preceding day. */
const settledStart = (eventId: string) =>
  new Date(now - DAY - unitFromSeed(eventId) * DAY);

const minutesFrom = (base: Date, m: number) =>
  new Date(base.getTime() + m * MIN);

type OptionStatus = 'active' | 'suspended' | 'hidden';
type MarketStatusV = 'upcoming' | 'open' | 'live' | 'suspended' | 'settled' | 'cancelled';

/**
 * Deliberately narrower than the schema's EventStatus: this seed only produces
 * upcoming and settled events, and the compiler enforces that. Market statuses
 * stay unrestricted — market status is independent of its event's.
 */
type EventStatusV = 'upcoming' | 'settled';

interface OptionInput {
  name: string;
  totalCredits: string;
  isWinningOption?: boolean;
  status?: OptionStatus;
}
interface MarketInput {
  name: string;
  status: MarketStatusV;
  startDate?: Date | null;
  options: OptionInput[];
}
interface EventInput {
  id: string;
  title: string;
  stage?: string | null;
  teamAId: string;
  teamBId: string;
  status: EventStatusV;
  // No startDate: it is derived from status + id so every fixture is scattered
  // and consistent with its status. See upcomingStart / settledStart.
  teamAScore?: number;
  teamBScore?: number;
  winnerTeamId?: string | null;
  markets: MarketInput[];
}
interface TournamentInput {
  id: string;
  sportId: string;
  name: string;
  season?: string | null;
  logoUrl?: string | null;
  events: EventInput[];
}

const opt = (
  name: string,
  totalCredits: string,
  isWinningOption = false,
  status: OptionStatus = 'active',
): OptionInput => ({ name, totalCredits, isWinningOption, status });

const market = (
  name: string,
  status: MarketStatusV,
  options: OptionInput[],
  startDate: Date | null = null,
): MarketInput => ({ name, status, options, startDate });

const tournaments: TournamentInput[] = [
  {
    id: TOURNAMENT.nba,
    sportId: SPORT.basketball,
    name: 'NBA',
    season: '2025-26',
    logoUrl: logo('nba'),
    events: [
      {
        id: 'event-01',
        title: 'Los Angeles Lakers vs Boston Celtics',
        stage: 'Regular Season',
        teamAId: TEAM.lakers,
        teamBId: TEAM.celtics,
        status: 'settled',
        teamAScore: 112,
        teamBScore: 118,
        winnerTeamId: TEAM.celtics,
        markets: [
          market('Match Winner', 'settled', [
            opt('Los Angeles Lakers', '38400.00'),
            opt('Boston Celtics', '71200.00', true),
          ]),
          market('Spread / Handicap', 'settled', [
            opt('Los Angeles Lakers (-5.5)', '42100.00'),
            opt('Boston Celtics (+5.5)', '65300.00', true),
          ]),
          market('Total Points', 'settled', [
            opt('Over 224.5', '58900.00', true),
            opt('Under 224.5', '39750.00'),
          ]),
        ],
      },
      {
        id: 'event-02',
        title: 'Denver Nuggets vs Golden State Warriors',
        stage: 'Regular Season',
        teamAId: TEAM.nuggets,
        teamBId: TEAM.warriors,
        status: 'upcoming',
        markets: [
          // A suspended option on an otherwise open market — admins can pull a
          // single option without closing the whole market.
          market('Match Winner', 'open', [
            opt('Denver Nuggets', '21400.00'),
            opt('Golden State Warriors', '24800.00', false, 'suspended'),
          ]),
          market('Spread / Handicap', 'open', [
            opt('Denver Nuggets (-4.5)', '18200.00'),
            opt('Golden State Warriors (+4.5)', '22600.00'),
          ]),
          market('Total Points', 'open', [
            opt('Over 219.5', '25100.00'),
            opt('Under 219.5', '19800.00'),
          ]),
        ],
      },
      {
        id: 'event-03',
        title: 'Milwaukee Bucks vs New York Knicks',
        stage: 'Regular Season',
        teamAId: TEAM.bucks,
        teamBId: TEAM.knicks,
        status: 'upcoming',
        markets: [
          market('Match Winner', 'upcoming', [
            opt('Milwaukee Bucks', '4200.00'),
            opt('New York Knicks', '3100.00'),
          ]),
          market('Spread / Handicap', 'upcoming', [
            opt('Milwaukee Bucks (-3.5)', '2900.00'),
            opt('New York Knicks (+3.5)', '3300.00'),
          ]),
          market('Total Points', 'upcoming', [
            opt('Over 221.5', '2600.00'),
            opt('Under 221.5', '2400.00'),
          ]),
        ],
      },
      {
        id: 'event-04',
        title: 'Oklahoma City Thunder vs Dallas Mavericks',
        stage: 'Playoffs',
        teamAId: TEAM.thunder,
        teamBId: TEAM.mavericks,
        status: 'upcoming',
        markets: [
          market('Match Winner', 'upcoming', [
            opt('Oklahoma City Thunder', '5100.00'),
            opt('Dallas Mavericks', '4700.00'),
          ]),
          market('Spread / Handicap', 'upcoming', [
            opt('Oklahoma City Thunder (-6.5)', '3800.00'),
            opt('Dallas Mavericks (+6.5)', '4200.00'),
          ]),
          market('Total Points', 'upcoming', [
            opt('Over 228.5', '3100.00'),
            opt('Under 228.5', '2950.00'),
          ]),
        ],
      },
    ],
  },
  {
    id: TOURNAMENT.premierLeague,
    sportId: SPORT.soccer,
    name: 'Premier League',
    season: '2025-26',
    logoUrl: logo('premier-league'),
    events: [
      {
        id: 'event-12',
        title: 'Arsenal vs Liverpool',
        stage: 'Matchweek 21',
        teamAId: TEAM.arsenal,
        teamBId: TEAM.liverpool,
        status: 'settled',
        teamAScore: 2,
        teamBScore: 1,
        winnerTeamId: TEAM.arsenal,
        markets: [
          market('Match Result', 'settled', [
            opt('Arsenal', '62100.00', true),
            opt('Draw', '24300.00'),
            opt('Liverpool', '48700.00'),
          ]),
          market('Total Goals', 'settled', [
            opt('Over 2.5', '51200.00', true),
            opt('Under 2.5', '33800.00'),
          ]),
          market('Both Teams To Score', 'settled', [
            opt('Yes', '58600.00', true),
            opt('No', '21400.00'),
          ]),
        ],
      },
      {
        id: 'event-13',
        title: 'Manchester City vs Chelsea',
        stage: 'Matchweek 22',
        teamAId: TEAM.mancity,
        teamBId: TEAM.chelsea,
        status: 'settled',
        teamAScore: 1,
        teamBScore: 1,
        winnerTeamId: null,
        markets: [
          market('Match Result', 'settled', [
            opt('Manchester City', '39200.00'),
            opt('Draw', '44100.00', true),
            opt('Chelsea', '35600.00'),
          ]),
          market('Total Goals', 'settled', [
            opt('Over 2.5', '28700.00'),
            opt('Under 2.5', '41300.00', true),
          ]),
          market('Both Teams To Score', 'settled', [
            opt('Yes', '46800.00', true),
            opt('No', '19200.00'),
          ]),
        ],
      },
      {
        id: 'event-14',
        title: 'Arsenal vs Chelsea',
        stage: 'Matchweek 23',
        teamAId: TEAM.arsenal,
        teamBId: TEAM.chelsea,
        status: 'upcoming',
        markets: [
          market('Match Result', 'upcoming', [
            opt('Arsenal', '5200.00'),
            opt('Draw', '2800.00'),
            opt('Chelsea', '4100.00'),
          ]),
          market('Total Goals', 'upcoming', [
            opt('Over 2.5', '3600.00'),
            opt('Under 2.5', '3300.00'),
          ]),
          market('Both Teams To Score', 'upcoming', [
            opt('Yes', '3100.00'),
            opt('No', '2900.00'),
          ]),
        ],
      },
    ],
  },
  {
    id: TOURNAMENT.ucl,
    sportId: SPORT.soccer,
    name: 'UEFA Champions League',
    season: '2025-26',
    logoUrl: logo('ucl'),
    events: [
      {
        id: 'event-15',
        title: 'Real Madrid vs Bayern Munich',
        stage: 'Quarter-Final 1st Leg',
        teamAId: TEAM.realmadrid,
        teamBId: TEAM.bayern,
        status: 'upcoming',
        markets: [
          // Three-way market — the only one in the seed that is not binary.
          market('Match Result', 'open', [
            opt('Real Madrid', '41200.00'),
            opt('Draw', '28700.00'),
            opt('Bayern Munich', '39600.00'),
          ]),
          market('Total Goals', 'open', [
            opt('Over 2.5', '36400.00'),
            opt('Under 2.5', '29100.00'),
          ]),
          market('Both Teams To Score', 'open', [
            opt('Yes', '44200.00'),
            opt('No', '18300.00'),
          ]),
        ],
      },
      {
        id: 'event-16',
        title: 'Liverpool vs Manchester City',
        stage: 'Quarter-Final 1st Leg',
        teamAId: TEAM.liverpool,
        teamBId: TEAM.mancity,
        status: 'upcoming',
        markets: [
          market('Match Result', 'upcoming', [
            opt('Liverpool', '6100.00'),
            opt('Draw', '3200.00'),
            opt('Manchester City', '5800.00'),
          ]),
          market('Total Goals', 'upcoming', [
            opt('Over 2.5', '4400.00'),
            opt('Under 2.5', '3900.00'),
          ]),
          market('Both Teams To Score', 'upcoming', [
            opt('Yes', '4700.00'),
            opt('No', '3600.00'),
          ]),
        ],
      },
    ],
  },
  {
    id: TOURNAMENT.ti2026,
    sportId: SPORT.dota2,
    name: 'The International 2026',
    season: '2026',
    logoUrl: logo('ti-2026'),
    events: [
      {
        id: 'event-05',
        title: 'Team Spirit vs Team Falcons',
        stage: 'Playoffs — Upper Bracket Final',
        teamAId: TEAM.spirit,
        teamBId: TEAM.falcons,
        status: 'settled',
        teamAScore: 2,
        teamBScore: 1,
        winnerTeamId: TEAM.spirit,
        markets: [
          market('Match Winner', 'settled', [
            opt('Team Spirit', '89200.00', true),
            opt('Team Falcons', '52100.00'),
          ]),
          market('Map 1 Winner', 'settled', [
            opt('Team Spirit', '41000.00', true),
            opt('Team Falcons', '33500.00'),
          ]),
          market('Total Maps', 'settled', [
            opt('Over 2.5', '48700.00', true),
            opt('Under 2.5', '29800.00'),
          ]),
        ],
      },
      {
        id: 'event-06',
        title: 'Team Liquid vs Tundra Esports',
        stage: 'Playoffs — Lower Bracket R2',
        teamAId: TEAM.liquid,
        teamBId: TEAM.tundra,
        status: 'upcoming',
        markets: [
          market('Match Winner', 'open', [
            opt('Team Liquid', '51200.00'),
            opt('Tundra Esports', '32100.00'),
          ]),
          // Market-lifecycle example: Map 2 is already taking predictions while
          // Map 1, which happens first, is not. Admins control each market
          // independently — nothing sequences one against another.
          market(
            'Map 1 Winner',
            'upcoming',
            [
              opt('Team Liquid', '28700.00'),
              opt('Tundra Esports', '19400.00'),
            ],
            upcomingStart('event-06'),
          ),
          market(
            'Map 2 Winner',
            'open',
            [opt('Team Liquid', '9200.00'), opt('Tundra Esports', '8100.00')],
            minutesFrom(upcomingStart('event-06'), 45),
          ),
          market('Total Maps', 'open', [
            opt('Over 2.5', '22300.00'),
            opt('Under 2.5', '18700.00'),
          ]),
        ],
      },
    ],
  },
  {
    id: TOURNAMENT.eslBirmingham,
    sportId: SPORT.dota2,
    name: 'ESL One Birmingham 2026',
    season: '2026',
    logoUrl: logo('esl-one-birmingham-2026'),
    events: [
      {
        id: 'event-07',
        title: 'Team Falcons vs Tundra Esports',
        stage: 'Group Stage',
        teamAId: TEAM.falcons,
        teamBId: TEAM.tundra,
        status: 'upcoming',
        markets: [
          market('Match Winner', 'upcoming', [
            opt('Team Falcons', '3600.00'),
            opt('Tundra Esports', '3900.00'),
          ]),
          market('Map 1 Winner', 'upcoming', [
            opt('Team Falcons', '1800.00'),
            opt('Tundra Esports', '2000.00'),
          ]),
          market('Total Maps', 'upcoming', [
            opt('Over 2.5', '1500.00'),
            opt('Under 2.5', '1700.00'),
          ]),
        ],
      },
    ],
  },
  {
    id: TOURNAMENT.iemKatowice,
    sportId: SPORT.cs2,
    name: 'IEM Katowice 2026',
    season: '2026',
    logoUrl: logo('iem-katowice-2026'),
    events: [
      {
        id: 'event-08',
        title: 'Natus Vincere vs FaZe Clan',
        stage: 'Playoffs — Semifinal',
        teamAId: TEAM.navi,
        teamBId: TEAM.faze,
        status: 'settled',
        teamAScore: 2,
        teamBScore: 0,
        winnerTeamId: TEAM.navi,
        markets: [
          market('Match Winner', 'settled', [
            opt('Natus Vincere', '96400.00', true),
            opt('FaZe Clan', '41200.00'),
          ]),
          market('Map 1 Winner', 'settled', [
            opt('Natus Vincere', '45300.00', true),
            opt('FaZe Clan', '22100.00'),
          ]),
          market('Total Maps', 'settled', [
            opt('Over 2.5', '18900.00'),
            opt('Under 2.5', '37600.00', true),
          ]),
        ],
      },
      {
        id: 'event-09',
        title: 'Team Vitality vs G2 Esports',
        stage: 'Group Stage',
        teamAId: TEAM.vitality,
        teamBId: TEAM.g2,
        status: 'upcoming',
        markets: [
          market('Match Winner', 'upcoming', [
            opt('Team Vitality', '4400.00'),
            opt('G2 Esports', '4100.00'),
          ]),
          market('Map 1 Winner', 'upcoming', [
            opt('Team Vitality', '2200.00'),
            opt('G2 Esports', '2050.00'),
          ]),
          market('Total Maps', 'upcoming', [
            opt('Over 2.5', '1900.00'),
            opt('Under 2.5', '2100.00'),
          ]),
        ],
      },
    ],
  },
  {
    id: TOURNAMENT.blastSpring,
    sportId: SPORT.cs2,
    name: 'BLAST Premier Spring Final 2026',
    season: '2026',
    logoUrl: logo('blast-premier-spring-2026'),
    events: [
      {
        id: 'event-10',
        title: 'MOUZ vs Team Spirit',
        stage: 'Group Stage',
        teamAId: TEAM.mouz,
        teamBId: TEAM.spirit,
        status: 'upcoming',
        markets: [
          market('Match Winner', 'open', [
            opt('MOUZ', '34200.00'),
            opt('Team Spirit', '38900.00'),
          ]),
          // Suspended sibling: predictions are paused on this market only.
          market('Map 1 Winner', 'suspended', [
            opt('MOUZ', '15600.00'),
            opt('Team Spirit', '17200.00'),
          ]),
          market('Total Maps', 'open', [
            opt('Over 2.5', '21400.00'),
            opt('Under 2.5', '19800.00'),
          ]),
        ],
      },
      {
        id: 'event-11',
        title: 'FaZe Clan vs Team Vitality',
        stage: 'Group Stage',
        teamAId: TEAM.faze,
        teamBId: TEAM.vitality,
        status: 'upcoming',
        markets: [
          // Every option here is hidden, so the API filters them out and this
          // event's markets come back with empty option lists.
          market('Match Winner', 'suspended', [
            opt('FaZe Clan', '12300.00', false, 'hidden'),
            opt('Team Vitality', '11800.00', false, 'hidden'),
          ]),
          market('Map 1 Winner', 'suspended', [
            opt('FaZe Clan', '6100.00', false, 'hidden'),
            opt('Team Vitality', '5900.00', false, 'hidden'),
          ]),
          market('Total Maps', 'suspended', [
            opt('Over 2.5', '4200.00', false, 'hidden'),
            opt('Under 2.5', '3950.00', false, 'hidden'),
          ]),
        ],
      },
    ],
  },
];

// --- bulk fixtures -----------------------------------------------------
// The events above are hand-written to cover specific edge cases (suspended
// options, hidden options, sibling markets out of sequence, a three-way
// market). Everything below is generated purely to give each sport enough
// volume to page through — the interesting cases stay curated.

const EVENTS_PER_SPORT = 20;

// Typed as plain strings: `teams` infers literal id types from the `as const`
// TEAM map, which would reject the computed ids used below.
const teamNameById = new Map<string, string>(
  teams.map((t) => [t.id, t.name]),
);

const teamIdsForSport = (sportId: string) =>
  teamSports.filter((ts) => ts.sportId === sportId).map((ts) => ts.teamId);

/** Label for the over/under market, which differs per sport. */
const totalsMarketName = (sportId: string) => {
  if (sportId === SPORT.basketball) return 'Total Points';
  if (sportId === SPORT.soccer) return 'Total Goals';
  return 'Total Maps';
};

const STAGES = [
  'Regular Season',
  'Group Stage',
  'Playoffs',
  'Quarter-Final',
  'Semi-Final',
];

/** Deterministic credit amount in [min, max), formatted for the Decimal column. */
const creditsFor = (seed: string, min: number, max: number) =>
  (min + unitFromSeed(seed) * (max - min)).toFixed(2);

const intFor = (seed: string, min: number, max: number) =>
  min + Math.floor(unitFromSeed(seed) * (max - min));

function generatedEvent(sportId: string, index: number): EventInput {
  const pool = teamIdsForSport(sportId);
  if (pool.length < 2) {
    throw new Error(`Sport ${sportId} needs at least two teams to schedule`);
  }

  // Offset stays within [1, pool.length - 1] so the two sides are never equal
  // and pairings keep rotating rather than repeating the same fixture.
  const offset = 1 + (Math.floor(index / pool.length) % (pool.length - 1));
  const teamAId = pool[index % pool.length];
  const teamBId = pool[(index + offset) % pool.length];

  const slug = sportId.replace('sport-', '');
  const id = `event-${slug}-${String(index + 1).padStart(2, '0')}`;
  const teamAName = teamNameById.get(teamAId) ?? 'Team A';
  const teamBName = teamNameById.get(teamBId) ?? 'Team B';

  // Every fourth fixture is finished, so both statuses page in volume.
  const isSettled = index % 4 === 0;
  const totalsName = totalsMarketName(sportId);
  const line = sportId === SPORT.basketball ? '218.5' : '2.5';

  if (isSettled) {
    const teamAWins = unitFromSeed(`${id}-winner`) < 0.5;
    const winnerTeamId = teamAWins ? teamAId : teamBId;
    const highScore = intFor(`${id}-hi`, 2, 4);
    const lowScore = intFor(`${id}-lo`, 0, 2);

    return {
      id,
      title: `${teamAName} vs ${teamBName}`,
      stage: STAGES[index % STAGES.length],
      teamAId,
      teamBId,
      status: 'settled',
      teamAScore: teamAWins ? highScore : lowScore,
      teamBScore: teamAWins ? lowScore : highScore,
      winnerTeamId,
      markets: [
        market('Match Winner', 'settled', [
          opt(teamAName, creditsFor(`${id}-a`, 4_000, 60_000), teamAWins),
          opt(teamBName, creditsFor(`${id}-b`, 4_000, 60_000), !teamAWins),
        ]),
        market(totalsName, 'settled', [
          opt(`Over ${line}`, creditsFor(`${id}-o`, 3_000, 40_000), teamAWins),
          opt(`Under ${line}`, creditsFor(`${id}-u`, 3_000, 40_000), !teamAWins),
        ]),
      ],
    };
  }

  return {
    id,
    title: `${teamAName} vs ${teamBName}`,
    stage: STAGES[index % STAGES.length],
    teamAId,
    teamBId,
    status: 'upcoming',
    markets: [
      market('Match Winner', 'open', [
        opt(teamAName, creditsFor(`${id}-a`, 1_000, 45_000)),
        opt(teamBName, creditsFor(`${id}-b`, 1_000, 45_000)),
      ]),
      market(totalsName, 'open', [
        opt(`Over ${line}`, creditsFor(`${id}-o`, 800, 30_000)),
        opt(`Under ${line}`, creditsFor(`${id}-u`, 800, 30_000)),
      ]),
    ],
  };
}

/** Tops each sport up to EVENTS_PER_SPORT, spread across its tournaments. */
function addBulkEvents() {
  for (const sportId of Object.values(SPORT)) {
    const sportTournaments = tournaments.filter((t) => t.sportId === sportId);
    if (sportTournaments.length === 0) continue;

    const existing = sportTournaments.reduce(
      (count, t) => count + t.events.length,
      0,
    );

    for (let index = existing; index < EVENTS_PER_SPORT; index++) {
      const target = sportTournaments[index % sportTournaments.length];
      target.events.push(generatedEvent(sportId, index));
    }
  }
}

addBulkEvents();

/**
 * Dev accounts for the login form. The password is committed on purpose — this
 * seeder already refuses to run outside local dev (see the NODE_ENV guard at
 * the top), and a fixture nobody knows the password to is useless.
 *
 * The Google account deliberately has `passwordHash: null` so the "this account
 * has no password" branch in AuthService has something to exercise. Its
 * googleId is a fake that no real Google profile will ever match, so signing in
 * with a real Google account creates a fresh user rather than hijacking this one.
 */
const DEV_PASSWORD = 'password123';

async function seedUsers() {
  const passwordHash = await hash(DEV_PASSWORD);

  await prisma.user.createMany({
    data: [
      {
        id: 'user-demo',
        email: 'demo@chakrm.dev',
        name: 'Demo Player',
        passwordHash,
        credits: 12_480,
      },
      {
        id: 'user-admin',
        email: 'admin@chakrm.dev',
        name: 'Admin',
        passwordHash,
        role: 'admin',
        credits: 50_000,
      },
      {
        id: 'user-google',
        email: 'google-user@chakrm.dev',
        name: 'Google Player',
        passwordHash: null,
        googleId: 'seed-google-id-not-a-real-subject',
        avatarUrl: null,
        credits: 1_000,
      },
    ],
  });
}

async function main() {
  // Identifiers must be double-quoted — tables are PascalCase.
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "MarketOption", "Market", "Event", "TeamSport", "Team", "Tournament", "Sport", "User" CASCADE',
  );

  await seedUsers();
  await prisma.sport.createMany({ data: sports });
  await prisma.team.createMany({ data: teams });
  await prisma.teamSport.createMany({ data: teamSports });

  for (const t of tournaments) {
    await prisma.tournament.create({
      data: {
        id: t.id,
        sportId: t.sportId,
        name: t.name,
        season: t.season ?? null,
        logoUrl: t.logoUrl ?? null,
        events: {
          create: t.events.map((e) => ({
            id: e.id,
            title: e.title,
            stage: e.stage ?? null,
            teamAId: e.teamAId,
            teamBId: e.teamBId,
            status: e.status,
            startDate:
              e.status === 'upcoming'
                ? upcomingStart(e.id)
                : settledStart(e.id),
            teamAScore: e.teamAScore ?? 0,
            teamBScore: e.teamBScore ?? 0,
            winnerTeamId: e.winnerTeamId ?? null,
            markets: {
              create: e.markets.map((m) => ({
                name: m.name,
                status: m.status,
                startDate: m.startDate ?? null,
                options: {
                  create: m.options.map((o) => ({
                    name: o.name,
                    totalCredits: o.totalCredits,
                    isWinningOption: o.isWinningOption ?? false,
                    status: o.status ?? 'active',
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  const [userCount, sportCount, teamCount, teamSportCount, tournamentCount, eventCount, marketCount, optionCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.sport.count(),
      prisma.team.count(),
      prisma.teamSport.count(),
      prisma.tournament.count(),
      prisma.event.count(),
      prisma.market.count(),
      prisma.marketOption.count(),
    ]);

  console.log(
    `Seeded ${userCount} users, ${sportCount} sports, ${teamCount} teams (${teamSportCount} team-sport links), ${tournamentCount} tournaments, ${eventCount} events, ${marketCount} markets, ${optionCount} market options.`,
  );
  console.log(`Dev login: demo@chakrm.dev / ${DEV_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
