import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

/**
 * Only shape validation here — no MinLength on the password. A length rule
 * would reject a short guess with a 400 while a wrong-but-long one gets a 401,
 * which tells an attacker something about the stored password. Both go to
 * AuthService and come back as the same 401.
 */
export class LoginDto {
  @ApiProperty({ example: 'demo@chakrm.dev' })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MaxLength(128)
  password: string;
}
