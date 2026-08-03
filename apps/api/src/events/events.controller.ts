import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { MarketResponseDto } from '../markets/dto/market-response.dto';
import { toMarketResponse } from '../markets/market.mapper';
import { MarketsService } from '../markets/markets.service';
import { toEventDetailResponse, toEventListItemResponse } from './event.mapper';
import { EventDetailResponseDto } from './dto/event-detail-response.dto';
import { EventListItemResponseDto } from './dto/event-list-item-response.dto';
import { ListEventsQueryDto } from './dto/list-events-query.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@ApiExtraModels(PaginatedResponseDto, EventListItemResponseDto)
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly marketsService: MarketsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List events, optionally filtered by sport' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(EventListItemResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({ description: 'Unknown sportSlug' })
  async findMany(
    @Query() query: ListEventsQueryDto,
  ): Promise<PaginatedResponseDto<EventListItemResponseDto>> {
    const { rows, total } = await this.eventsService.findMany(query);

    return new PaginatedResponseDto(
      rows.map((row) => toEventListItemResponse(row)),
      total,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event with all of its markets' })
  @ApiOkResponse({ type: EventDetailResponseDto })
  @ApiNotFoundResponse({ description: 'Event not found' })
  async findOne(@Param('id') id: string): Promise<EventDetailResponseDto> {
    return toEventDetailResponse(await this.eventsService.findOne(id));
  }

  @Get(':id/markets')
  @ApiOperation({ summary: "Get an event's markets without the event payload" })
  @ApiOkResponse({ type: MarketResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Event not found' })
  async findMarkets(@Param('id') id: string): Promise<MarketResponseDto[]> {
    await this.eventsService.assertExists(id);
    const markets = await this.marketsService.findByEventId(id);
    return markets.map((market) => toMarketResponse(market));
  }
}
