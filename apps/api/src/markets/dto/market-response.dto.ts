import { ApiProperty } from '@nestjs/swagger';
import { MarketStatus } from '../../generated/prisma/client';
import { MarketOptionResponseDto } from './market-option-response.dto';

export class MarketResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    enum: MarketStatus,
    description: 'Admin-driven only; never derived from startDate.',
  })
  status: MarketStatus;

  @ApiProperty({
    nullable: true,
    type: String,
    format: 'date-time',
    description: 'Informational only — drives a client-side countdown.',
  })
  startDate: Date | null;

  @ApiProperty({ description: 'Sum of totalCredits across visible options.' })
  totalPool: number;

  @ApiProperty({ type: MarketOptionResponseDto, isArray: true })
  options: MarketOptionResponseDto[];
}
