import { ApiProperty } from '@nestjs/swagger';

/** The subset of Team selected for event responses (see eventListInclude). */
export interface EventTeam {
  id: string;
  name: string;
  logoUrl: string | null;
}

export class EventTeamResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, type: String })
  logoUrl: string | null;
}
