import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  type VerifyCallback,
} from 'passport-google-oauth20';
import { getGoogleConfig } from '../auth.config';
import { AuthService, type GoogleProfile } from '../auth.service';

/**
 * Only registered when GOOGLE_CLIENT_ID/SECRET are present — see AuthModule.
 * Constructing it without them throws inside passport-google-oauth20.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    const config = getGoogleConfig();

    if (!config) {
      throw new Error('GoogleStrategy registered without Google credentials');
    }

    super({ ...config, scope: ['email', 'profile'] });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const email = profile.emails?.[0];

    if (!email?.value) {
      // Possible when the granted scopes don't include email.
      done(new Error('Google account did not provide an email address'));
      return;
    }

    const googleProfile: GoogleProfile = {
      googleId: profile.id,
      email: email.value,
      // passport-google-oauth20 types this as string | boolean depending on
      // where it came from, so compare loosely rather than trusting the type.
      emailVerified:
        email.verified === true || String(email.verified) === 'true',
      name: profile.displayName || null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    };

    try {
      done(null, await this.authService.findOrCreateGoogleUser(googleProfile));
    } catch (error) {
      done(error as Error);
    }
  }
}
