import { ApiProperty } from '@nestjs/swagger';
import { MarketResponseDto } from '../../markets/dto/market-response.dto';
import { EventListItemResponseDto } from './event-list-item-response.dto';

export class EventDetailResponseDto extends EventListItemResponseDto {
  @ApiProperty({ type: MarketResponseDto, isArray: true })
  markets: MarketResponseDto[];
}
