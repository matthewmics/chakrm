import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

// Injected by webpack's HotModuleReplacementPlugin; absent in a plain tsc build.
// Typed explicitly rather than as `any` so the type-aware lint rules stay happy.
declare const module: {
  hot?: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  };
};

async function bootstrap() {
  const logger = new ConsoleLogger({
    json: true,
    colors: false,
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });

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
