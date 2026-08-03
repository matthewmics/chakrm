import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SportsService } from './sports.service';
import { SportResponseDto } from './dto/sport-response.dto';
import { toSportResponse } from './sport.mapper';

@ApiTags('sports')
@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  @ApiOperation({ summary: 'List all sports, used to drive the event filters' })
  @ApiOkResponse({ type: SportResponseDto, isArray: true })
  async findAll(): Promise<SportResponseDto[]> {
    const sports = await this.sportsService.findAll();
    return sports.map((sport) => toSportResponse(sport));
  }
}
