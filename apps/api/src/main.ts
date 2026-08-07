import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AUTH_COOKIE_NAME } from './auth/auth.config';

// Injected by webpack's HotModuleReplacementPlugin; absent in a plain tsc build.
// Typed explicitly rather than as `any` so the type-aware lint rules stay happy.
declare const module: {
  hot?: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  };
};

/** Local dev origins: `pnpm dev:web`/`dev:admin` on the host, plus Traefik. */
const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://chakrm.local',
  'http://admin.chakrm.local',
];

function parseCorsOrigins(value: string | undefined): string[] {
  const origins = (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : DEFAULT_CORS_ORIGINS;
}

async function bootstrap() {
  const logger = new ConsoleLogger({
    json: true,
    colors: false,
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.setGlobalPrefix('api');
  // Must come before the JWT strategy reads req.cookies — the session token
  // lives in an httpOnly cookie rather than an Authorization header.
  app.use(cookieParser());
  // Origins are listed explicitly rather than using `*`: browsers reject a
  // wildcard on any credentialed request, so `*` would break the moment a
  // session cookie is introduced. Override per environment with CORS_ORIGINS
  // (comma-separated). Traefik deliberately adds no CORS headers of its own —
  // duplicated headers ("*, *") are rejected by browsers, so Nest owns this.
  app.enableCors({
    origin: parseCorsOrigins(process.env.CORS_ORIGINS),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chakrm API')
    .setDescription('Public prediction endpoints for the Chakrm web app.')
    .setVersion('1.0')
    // Auth is a cookie, not a bearer header, so "Authorize" in Swagger UI is a
    // no-op — the browser attaches it automatically once you've logged in.
    .addCookieAuth(AUTH_COOKIE_NAME)
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    () => SwaggerModule.createDocument(app, swaggerConfig),
    { jsonDocumentUrl: 'api/docs-json' },
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      void app.close();
    });
  }
}
bootstrap();
