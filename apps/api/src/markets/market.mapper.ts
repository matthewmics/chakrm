import type { MarketOption } from '../generated/prisma/client';
import type { MarketOptionResponseDto } from './dto/market-option-response.dto';
import type { MarketResponseDto } from './dto/market-response.dto';
import type { MarketWithOptions } from './market.query';

export function toMarketOptionResponse(
  option: MarketOption,
): MarketOptionResponseDto {
  return {
    id: option.id,
    name: option.name,
    // Prisma returns a Decimal; the API contract is a plain JSON number.
    totalCredits: option.totalCredits.toNumber(),
    isWinningOption: option.isWinningOption,
    status: option.status,
  };
}

function sumOptionCredits(options: MarketOptionResponseDto[]): number {
  let total = 0;

  for (const option of options) {
    total += option.totalCredits;
  }

  return total;
}

export function toMarketResponse(market: MarketWithOptions): MarketResponseDto {
  const options = market.options.map((option) =>
    toMarketOptionResponse(option),
  );

  return {
    id: market.id,
    eventId: market.eventId,
    name: market.name,
    status: market.status,
    startDate: market.startDate,
    totalPool: sumOptionCredits(options),
    options,
  };
}
