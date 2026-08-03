import { ApiProperty } from '@nestjs/swagger';
import { SportResponseDto } from '../../sports/dto/sport-response.dto';

export class EventTournamentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, type: String })
  season: string | null;

  @ApiProperty({ nullable: true, type: String })
  logoUrl: string | null;

  @ApiProperty({ type: SportResponseDto })
  sport: SportResponseDto;
}
