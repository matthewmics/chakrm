import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic pagination envelope. Concrete `items` typing for Swagger is supplied
 * per-endpoint via `@ApiOkResponse` + `ApiExtraModels`/`getSchemaPath`.
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  items: T[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  }
}
