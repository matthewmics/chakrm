import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';

/**
 * The only user shape any endpoint returns. `passwordHash` and `googleId` are
 * absent by construction rather than deleted after the fact — see user.mapper.ts.
 */
export class AuthUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true, type: String })
  name: string | null;

  @ApiProperty({ nullable: true, type: String })
  avatarUrl: string | null;

  @ApiProperty({ description: 'Virtual credits available to predict with.' })
  credits: number;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({
    description:
      'False for accounts created through Google that never set one.',
  })
  hasPassword: boolean;
}
