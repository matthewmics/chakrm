// Traefik fronts the API at api.chakrm.local (see traefik/dynamic.yml and the
// compose labels). Requires the hosts-file entries listed in CLAUDE.md.
const API_BASE_URL =
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

export async function apiFetch<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
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

  return response.json() as Promise<T>;
}
