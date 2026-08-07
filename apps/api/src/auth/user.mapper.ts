import type { User } from '../generated/prisma/client';
import type { AuthUserResponseDto } from './dto/auth-user-response.dto';

/**
 * Builds the response by listing fields explicitly rather than spreading and
 * deleting. A field added to the Prisma model can never leak by accident — it
 * has to be added here on purpose.
 */
export function toAuthUserResponse(user: User): AuthUserResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    credits: user.credits,
    role: user.role,
    hasPassword: user.passwordHash !== null,
  };
}
