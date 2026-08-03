import { ApiProperty } from '@nestjs/swagger';

export class SportResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  isEsport: boolean;

  @ApiProperty({ nullable: true, type: String })
  iconUrl: string | null;
}
