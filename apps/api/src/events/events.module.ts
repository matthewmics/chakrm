import { Module } from '@nestjs/common';
import { MarketsModule } from '../markets/markets.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [MarketsModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
