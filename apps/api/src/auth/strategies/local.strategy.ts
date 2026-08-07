import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { User } from '../../generated/prisma/client';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // passport-local defaults to a `username` field; ours is `email`.
    super({ usernameField: 'email', passwordField: 'password' });
  }

  /** Throws UnauthorizedException from AuthService; Nest turns it into a 401. */
  validate(email: string, password: string): Promise<User> {
    return this.authService.validateCredentials(email, password);
  }
}
