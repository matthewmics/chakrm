import { apiFetch } from "./client";
import type {
  EventDetailResponse,
  EventListItemResponse,
  MarketResponse,
  PaginatedResponse,
  SportResponse,
} from "./types";

import type { ApiEventStatus } from "./types";

export type ListEventsParams = {
  page?: number;
  limit?: number;
  sportSlug?: string;
  status?: ApiEventStatus;
};

export function listSports(): Promise<SportResponse[]> {
  return apiFetch<SportResponse[]>("/sports");
}

export function listEvents(
  params: ListEventsParams,
): Promise<PaginatedResponse<EventListItemResponse>> {
  return apiFetch<PaginatedResponse<EventListItemResponse>>("/events", {
    searchParams: {
      page: params.page,
      limit: params.limit,
      sportSlug: params.sportSlug,
      status: params.status,
    },
  });
}

/** Throws `ApiError` with status 404 when the event does not exist. */
export function getEvent(id: string): Promise<EventDetailResponse> {
  return apiFetch<EventDetailResponse>(`/events/${encodeURIComponent(id)}`);
}

/** Same markets as `getEvent`, without refetching the event payload. */
export function listEventMarkets(id: string): Promise<MarketResponse[]> {
  return apiFetch<MarketResponse[]>(
    `/events/${encodeURIComponent(id)}/markets`,
  );
}
