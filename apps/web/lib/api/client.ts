// Traefik fronts the API at api.chakrm.local (see traefik/dynamic.yml and the
// compose labels). Requires the hosts-file entries listed in CLAUDE.md.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://api.chakrm.local/api";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Nest's default error body shape. */
type ApiErrorBody = { message?: string | string[] };

function readErrorMessage(body: unknown, fallback: string): string {
  const message = (body as ApiErrorBody | null)?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message ?? fallback;
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number | undefined>;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, searchParams } = options;
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    // The session lives in an httpOnly cookie on .chakrm.local. Without this
    // the browser never attaches it and every authed request 401s.
    //
    // Note this is also why the web app must be reached at http://chakrm.local
    // rather than localhost:3000 — the latter is cross-site to the cookie's
    // domain, so the browser drops it regardless of what we send here.
    credentials: "include",
    // Events, markets and pools all change under admin action; nothing here is
    // safe for Next's data cache to hold on to.
    cache: "no-store",
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new ApiError(
      readErrorMessage(body, `Request failed (${response.status})`),
      response.status,
    );
  }

  // 204 has no body to parse — logout is the one endpoint that returns it.
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}
