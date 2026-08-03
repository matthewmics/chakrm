import { Prisma } from '../generated/prisma/client';

/**
 * Shared shape for every public market read: non-deleted markets, with their
 * publicly visible options (hidden options are never exposed; suspended ones
 * still render, greyed out, on the client).
 */
export const marketOptionWhere = {
  status: { not: 'hidden' },
} satisfies Prisma.MarketOptionWhereInput;

export const marketInclude = {
  options: {
    where: marketOptionWhere,
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.MarketInclude;

export const marketWhere = {
  deletedAt: null,
} satisfies Prisma.MarketWhereInput;

export type MarketWithOptions = Prisma.MarketGetPayload<{
  include: typeof marketInclude;
}>;
