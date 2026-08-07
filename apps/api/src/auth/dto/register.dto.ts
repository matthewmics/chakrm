import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'player@chakrm.dev' })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({
    minLength: 8,
    description: 'Stored as an argon2 hash; never returned by any endpoint.',
  })
  @IsString()
  @MinLength(8)
  // Argon2 has no bcrypt-style 72-byte truncation, but an unbounded password is
  // still a cheap way to make the server do expensive work.
  @MaxLength(128)
  password: string;

  @ApiProperty({
    example: 'Demo Player',
    description: 'Display name shown on the leaderboard.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
