import { Module, type Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import {
  getGoogleConfig,
  getJwtSecret,
  jwtExpiresInSeconds,
} from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

/**
 * Google is opt-in. Registering the strategy without credentials throws inside
 * passport-google-oauth20 and takes the whole API down, so a deployment that
 * hasn't been through the Cloud Console setup simply runs without it —
 * /auth/google/status tells the web app to hide the button.
 */
const googleProviders: Provider[] = getGoogleConfig() ? [GoogleStrategy] : [];

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // No session support: sessions are carried by the JWT cookie, so passport
    // never needs to serialise a user into a server-side store.
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: jwtExpiresInSeconds() },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...googleProviders],
  exports: [AuthService],
})
export class AuthModule {}
