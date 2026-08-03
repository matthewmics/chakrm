import { ApiProperty } from '@nestjs/swagger';
import { MarketOptionStatus } from '../../generated/prisma/client';

export class MarketOptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    description:
      'Virtual credits currently predicted on this option. Payout ratios are ' +
      'derived client-side as marketTotalPool / totalCredits.',
  })
  totalCredits: number;

  @ApiProperty()
  isWinningOption: boolean;

  @ApiProperty({ enum: MarketOptionStatus })
  status: MarketOptionStatus;
}
