import type { Sport } from '../generated/prisma/client';
import type { SportResponseDto } from './dto/sport-response.dto';

export function toSportResponse(sport: Sport): SportResponseDto {
  return {
    id: sport.id,
    name: sport.name,
    slug: sport.slug,
    isEsport: sport.isEsport,
    iconUrl: sport.iconUrl,
  };
}
