import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SportsModule } from './sports/sports.module';
import { EventsModule } from './events/events.module';
import { MarketsModule } from './markets/markets.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// No APP_GUARD here on purpose. Guests browsing events without an account is a
// product requirement, so endpoints are public by default and opt in to
// JwtAuthGuard individually. A global guard would make every new endpoint
// private until someone remembered to mark it otherwise.
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    SportsModule,
    EventsModule,
    MarketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
