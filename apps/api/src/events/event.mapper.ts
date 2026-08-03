import type { Sport, Tournament } from '../generated/prisma/client';
import { toMarketResponse } from '../markets/market.mapper';
import { toSportResponse } from '../sports/sport.mapper';
import type { EventDetailResponseDto } from './dto/event-detail-response.dto';
import type { EventListItemResponseDto } from './dto/event-list-item-response.dto';
import type {
  EventTeam,
  EventTeamResponseDto,
} from './dto/event-team-response.dto';
import type { EventTournamentResponseDto } from './dto/event-tournament-response.dto';
import type { EventDetailRow, EventListRow } from './event.query';

function toEventTeamResponse(team: EventTeam): EventTeamResponseDto {
  return {
    id: team.id,
    name: team.name,
    logoUrl: team.logoUrl,
  };
}

function toEventTournamentResponse(
  tournament: Tournament & { sport: Sport },
): EventTournamentResponseDto {
  return {
    id: tournament.id,
    name: tournament.name,
    season: tournament.season,
    logoUrl: tournament.logoUrl,
    sport: toSportResponse(tournament.sport),
  };
}

function sumEventPool(markets: EventListRow['markets']): number {
  let total = 0;

  for (const market of markets) {
    for (const option of market.options) {
      total += option.totalCredits.toNumber();
    }
  }

  return total;
}

export function toEventListItemResponse(
  event: EventListRow,
): EventListItemResponseDto {
  return {
    id: event.id,
    title: event.title,
    stage: event.stage,
    status: event.status,
    startDate: event.startDate,
    teamAScore: event.teamAScore,
    teamBScore: event.teamBScore,
    winnerTeamId: event.winnerTeamId,
    tournament: toEventTournamentResponse(event.tournament),
    teamA: toEventTeamResponse(event.teamA),
    teamB: toEventTeamResponse(event.teamB),
    marketCount: event.markets.length,
    totalPool: sumEventPool(event.markets),
  };
}

export function toEventDetailResponse(
  event: EventDetailRow,
): EventDetailResponseDto {
  return {
    // A detail row carries every field a list row does, so the shared fields
    // (including marketCount and totalPool) are derived the same way.
    ...toEventListItemResponse(event),
    markets: event.markets.map((market) => toMarketResponse(market)),
  };
}
