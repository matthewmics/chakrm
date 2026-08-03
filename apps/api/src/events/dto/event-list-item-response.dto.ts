import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../../generated/prisma/client';
import { EventTeamResponseDto } from './event-team-response.dto';
import { EventTournamentResponseDto } from './event-tournament-response.dto';

export class EventListItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true, type: String })
  stage: string | null;

  @ApiProperty({ enum: EventStatus })
  status: EventStatus;

  @ApiProperty({ nullable: true, type: String, format: 'date-time' })
  startDate: Date | null;

  @ApiProperty()
  teamAScore: number;

  @ApiProperty()
  teamBScore: number;

  @ApiProperty({ nullable: true, type: String })
  winnerTeamId: string | null;

  @ApiProperty({ type: EventTournamentResponseDto })
  tournament: EventTournamentResponseDto;

  @ApiProperty({ type: EventTeamResponseDto })
  teamA: EventTeamResponseDto;

  @ApiProperty({ type: EventTeamResponseDto })
  teamB: EventTeamResponseDto;

  @ApiProperty({ description: 'Number of non-deleted markets on this event.' })
  marketCount: number;

  @ApiProperty({
    description: 'Sum of totalCredits across every option of every market.',
  })
  totalPool: number;
}
