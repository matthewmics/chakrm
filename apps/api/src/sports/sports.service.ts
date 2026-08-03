import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SportsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sport.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }
}
