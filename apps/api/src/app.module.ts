import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SportsModule } from './sports/sports.module';
import { EventsModule } from './events/events.module';
import { MarketsModule } from './markets/markets.module';

@Module({
  imports: [PrismaModule, SportsModule, EventsModule, MarketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
