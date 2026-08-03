import { PrismaPg } from '@prisma/adapter-pg';
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
const DAY = 24 * 60 * MIN;
const minutesAgo = (m: number) => new Date(now - m * MIN);
const minutesFromNow = (m: number) => new Date(now + m * MIN);
const daysAgo = (d: number) => new Date(now - d * DAY);
const daysFromNow = (d: number) => new Date(now + d * DAY);

type OptionStatus = 'active' | 'suspended' | 'hidden';
type MarketStatusV = 'upcoming' | 'open' | 'live' | 'suspended' | 'settled' | 'cancelled';
type EventStatusV = 'upcoming' | 'live' | 'settled' | 'cancelled';

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
  startDate?: Date | null;
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
        startDate: daysAgo(3),
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
        status: 'live',
        startDate: minutesAgo(40),
        teamAScore: 68,
        teamBScore: 71,
        markets: [
          market('Match Winner', 'open', [
            opt('Denver Nuggets', '21400.00'),
            opt('Golden State Warriors', '24800.00', false, 'suspended'),
          ]),
          market('Spread / Handicap', 'live', [
            opt('Denver Nuggets (-4.5)', '18200.00'),
            opt('Golden State Warriors (+4.5)', '22600.00'),
          ]),
          market('Total Points', 'live', [
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
        startDate: daysFromNow(2),
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
        startDate: null,
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
        startDate: daysAgo(4),
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
        startDate: daysAgo(6),
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
        startDate: daysFromNow(8),
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
        status: 'live',
        startDate: minutesAgo(50),
        teamAScore: 1,
        teamBScore: 1,
        markets: [
          market('Match Result', 'live', [
            opt('Real Madrid', '41200.00'),
            opt('Draw', '28700.00'),
            opt('Bayern Munich', '39600.00'),
          ]),
          market('Total Goals', 'live', [
            opt('Over 2.5', '36400.00'),
            opt('Under 2.5', '29100.00'),
          ]),
          market('Both Teams To Score', 'live', [
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
        startDate: daysFromNow(10),
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
        startDate: daysAgo(5),
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
        status: 'live',
        startDate: minutesAgo(90),
        teamAScore: 1,
        teamBScore: 0,
        markets: [
          market('Match Winner', 'live', [
            opt('Team Liquid', '51200.00'),
            opt('Tundra Esports', '32100.00'),
          ]),
          // Market-lifecycle example: Map 1 already settled, Map 2 already
          // open for predictions even though it hasn't started — admin
          // controls each market independently, no forced sequencing.
          market(
            'Map 1 Winner',
            'settled',
            [
              opt('Team Liquid', '28700.00', true),
              opt('Tundra Esports', '19400.00'),
            ],
            minutesAgo(50),
          ),
          market(
            'Map 2 Winner',
            'open',
            [opt('Team Liquid', '9200.00'), opt('Tundra Esports', '8100.00')],
            minutesFromNow(15),
          ),
          market('Total Maps', 'live', [
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
        startDate: daysFromNow(4),
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
        startDate: daysAgo(2),
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
        startDate: daysFromNow(6),
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
        status: 'live',
        startDate: minutesAgo(25),
        teamAScore: 1,
        teamBScore: 1,
        markets: [
          market('Match Winner', 'live', [
            opt('MOUZ', '34200.00'),
            opt('Team Spirit', '38900.00'),
          ]),
          market('Map 1 Winner', 'suspended', [
            opt('MOUZ', '15600.00'),
            opt('Team Spirit', '17200.00'),
          ]),
          market('Total Maps', 'live', [
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
        status: 'cancelled',
        startDate: daysAgo(1),
        markets: [
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

async function main() {
  // Identifiers must be double-quoted — tables are PascalCase.
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "MarketOption", "Market", "Event", "TeamSport", "Team", "Tournament", "Sport" CASCADE',
  );

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
            startDate: e.startDate ?? null,
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

  const [sportCount, teamCount, teamSportCount, tournamentCount, eventCount, marketCount, optionCount] =
    await Promise.all([
      prisma.sport.count(),
      prisma.team.count(),
      prisma.teamSport.count(),
      prisma.tournament.count(),
      prisma.event.count(),
      prisma.market.count(),
      prisma.marketOption.count(),
    ]);

  console.log(
    `Seeded ${sportCount} sports, ${teamCount} teams (${teamSportCount} team-sport links), ${tournamentCount} tournaments, ${eventCount} events, ${marketCount} markets, ${optionCount} market options.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
