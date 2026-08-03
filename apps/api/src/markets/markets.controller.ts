import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MarketsService } from './markets.service';
import { MarketResponseDto } from './dto/market-response.dto';
import { toMarketResponse } from './market.mapper';

@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a single market with its visible options' })
  @ApiOkResponse({ type: MarketResponseDto })
  @ApiNotFoundResponse({ description: 'Market not found' })
  async findOne(@Param('id') id: string): Promise<MarketResponseDto> {
    return toMarketResponse(await this.marketsService.findOne(id));
  }
}
