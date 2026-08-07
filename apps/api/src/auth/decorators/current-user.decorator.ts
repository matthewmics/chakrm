import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '../../generated/prisma/client';

/**
 * Reads the user a passport strategy attached to the request. Behind
 * JwtAuthGuard or LocalAuthGuard it is always present; behind
 * OptionalJwtAuthGuard it may be null, so type the parameter accordingly.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request.user as User | undefined) ?? null;
  },
);
