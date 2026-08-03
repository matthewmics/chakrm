import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListEventsQueryDto } from './dto/list-events-query.dto';
import {
  eventDetailInclude,
  eventListInclude,
  type EventDetailRow,
  type EventListRow,
} from './event.query';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    query: ListEventsQueryDto,
  ): Promise<{ rows: EventListRow[]; total: number }> {
    const where = await this.buildWhere(query);

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        include: eventListInclude,
        orderBy: [
          { startDate: { sort: 'asc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    return { rows, total };
  }

  async findOne(id: string): Promise<EventDetailRow> {
    const event = await this.prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: eventDetailInclude,
    });

    if (!event) {
      throw new NotFoundException(`Event with id "${id}" not found`);
    }

    return event;
  }

  /** Throws 404 unless the event exists and is not soft-deleted. */
  async assertExists(id: string): Promise<void> {
    const count = await this.prisma.event.count({
      where: { id, deletedAt: null },
    });

    if (count === 0) {
      throw new NotFoundException(`Event with id "${id}" not found`);
    }
  }

  private async buildWhere(
    query: ListEventsQueryDto,
  ): Promise<Prisma.EventWhereInput> {
    const tournament: Prisma.TournamentWhereInput = { deletedAt: null };

    if (query.sportSlug) {
      const sport = await this.prisma.sport.findFirst({
        where: { slug: query.sportSlug, deletedAt: null },
        select: { id: true },
      });

      if (!sport) {
        throw new NotFoundException(
          `Sport with slug "${query.sportSlug}" not found`,
        );
      }

      tournament.sportId = sport.id;
    }

    return {
      deletedAt: null,
      tournament,
      ...(query.tournamentId ? { tournamentId: query.tournamentId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? { title: { contains: query.search, mode: 'insensitive' } }
        : {}),
    };
  }
}
