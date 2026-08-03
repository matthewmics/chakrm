import { Prisma } from '../generated/prisma/client';
import { marketInclude, marketWhere } from '../markets/market.query';

const teamSelect = {
  id: true,
  name: true,
  logoUrl: true,
} satisfies Prisma.TeamSelect;

const tournamentInclude = {
  sport: true,
} satisfies Prisma.TournamentInclude;

/**
 * List rows carry the market pool aggregates but not the full market payload —
 * only enough to compute `marketCount` and `totalPool` in the mapper, so the
 * whole list is still a single query.
 */
export const eventListInclude = {
  tournament: { include: tournamentInclude },
  teamA: { select: teamSelect },
  teamB: { select: teamSelect },
  markets: {
    where: marketWhere,
    select: { options: { select: { totalCredits: true } } },
  },
} satisfies Prisma.EventInclude;

export const eventDetailInclude = {
  tournament: { include: tournamentInclude },
  teamA: { select: teamSelect },
  teamB: { select: teamSelect },
  markets: {
    where: marketWhere,
    include: marketInclude,
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.EventInclude;

export type EventListRow = Prisma.EventGetPayload<{
  include: typeof eventListInclude;
}>;

export type EventDetailRow = Prisma.EventGetPayload<{
  include: typeof eventDetailInclude;
}>;
