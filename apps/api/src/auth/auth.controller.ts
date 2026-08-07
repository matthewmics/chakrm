import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { User } from '../generated/prisma/client';
import { AUTH_COOKIE_NAME, WEB_APP_URL, getGoogleConfig } from './auth.config';
import { clearAuthCookie, setAuthCookie } from './auth.cookie';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { ExchangeCodeDto } from './dto/exchange-code.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { toAuthUserResponse } from './user.mapper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create an account and start a session' })
  @ApiCreatedResponse({ type: AuthUserResponseDto })
  @ApiConflictResponse({ description: 'Email is already registered' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserResponseDto> {
    const user = await this.authService.register(dto);
    return this.startSession(user, res);
  }

  /**
   * LocalAuthGuard runs the strategy, which does the actual credential check
   * and attaches the user. The body is declared purely so Swagger and the
   * global ValidationPipe see the expected shape.
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange email and password for a session cookie' })
  @ApiOkResponse({ type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Incorrect email or password' })
  login(
    @Body() _dto: LoginDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): AuthUserResponseDto {
    return this.startSession(user, res);
  }

  /**
   * Deliberately unguarded and always 204. Signing out with an already-expired
   * cookie is a success from the caller's point of view, and a 401 here would
   * strand the client in a state it cannot clear.
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear the session cookie' })
  logout(@Res({ passthrough: true }) res: Response): void {
    clearAuthCookie(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  @ApiOperation({ summary: 'The currently signed-in user' })
  @ApiOkResponse({ type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  me(@CurrentUser() user: User): AuthUserResponseDto {
    return toAuthUserResponse(user);
  }

  /**
   * The guard redirects to Google; this handler never actually runs. Returns
   * void so Nest doesn't try to send a body after passport already responded.
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Start the Google OAuth flow' })
  googleAuth(): void {}

  /**
   * Runs on the origin registered with Google, which is localhost rather than
   * api.chakrm.local (Google requires a public TLD). A cookie set here would be
   * scoped to localhost and invisible to the web app, so instead this hands the
   * browser a one-time code and lets the web app exchange it from the right
   * origin. See _tasks/auth-task.md 0.3.
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  googleCallback(@CurrentUser() user: User, @Res() res: Response): void {
    const code = this.authService.createHandoffCode(user.id);
    res.redirect(`${WEB_APP_URL}/auth/google/finish?code=${code}`);
  }

  @Post('google/exchange')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Trade a one-time Google handoff code for a session cookie',
  })
  @ApiOkResponse({ type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Code is invalid, used, or expired' })
  async googleExchange(
    @Body() dto: ExchangeCodeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserResponseDto> {
    const user = await this.authService.redeemHandoffCode(dto.code);
    return this.startSession(user, res);
  }

  @Get('google/status')
  @ApiOperation({
    summary: 'Whether Google sign-in is configured on this deployment',
    description:
      'Lets the web app hide the Google button rather than ship a link that 500s when credentials are absent.',
  })
  @ApiOkResponse({ schema: { properties: { enabled: { type: 'boolean' } } } })
  googleStatus(): { enabled: boolean } {
    return { enabled: getGoogleConfig() !== null };
  }

  private startSession(user: User, res: Response): AuthUserResponseDto {
    setAuthCookie(res, this.authService.signToken(user));
    return toAuthUserResponse(user);
  }
}
