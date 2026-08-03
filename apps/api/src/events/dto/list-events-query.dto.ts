import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EventStatus } from '../../generated/prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListEventsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by sport slug, e.g. "basketball" or "dota2".',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  sportSlug?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  tournamentId?: string;

  @ApiPropertyOptional({ enum: EventStatus })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiPropertyOptional({
    description: 'Case-insensitive match on event title.',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  search?: string;
}
