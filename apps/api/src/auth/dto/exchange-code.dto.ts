import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ExchangeCodeDto {
  @ApiProperty({
    description:
      'One-time code from the Google callback redirect. Single use, expires in 60 seconds.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code: string;
}
