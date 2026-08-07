import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Strict: 401 when the cookie is missing, expired, or its user is gone. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
