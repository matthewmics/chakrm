import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  marketInclude,
  marketWhere,
  type MarketWithOptions,
} from './market.query';

@Injectable()
export class MarketsService {
  constructor(private readonly prisma: PrismaService) {}

  findByEventId(eventId: string): Promise<MarketWithOptions[]> {
    return this.prisma.market.findMany({
      where: { ...marketWhere, eventId },
      include: marketInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string): Promise<MarketWithOptions> {
    const market = await this.prisma.market.findFirst({
      where: { ...marketWhere, id },
      include: marketInclude,
    });

    if (!market) {
      throw new NotFoundException(`Market with id "${id}" not found`);
    }

    return market;
  }
}
