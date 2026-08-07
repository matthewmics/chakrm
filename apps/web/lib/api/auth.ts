import { API_BASE_URL, ApiError, apiFetch } from "./client";
import type { AuthUserResponse } from "./types";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = LoginPayload & { name: string };

export function login(payload: LoginPayload): Promise<AuthUserResponse> {
  return apiFetch<AuthUserResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function register(payload: RegisterPayload): Promise<AuthUserResponse> {
  return apiFetch<AuthUserResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

/**
 * Resolves to null when signed out rather than throwing. Being a guest is the
 * normal state for most of this app, not an error worth a retry or an error
 * boundary — only a genuine failure (network, 500) propagates.
 */
export async function getMe(): Promise<AuthUserResponse | null> {
  try {
    return await apiFetch<AuthUserResponse>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

/** Trades the one-time code from the Google callback for a session cookie. */
export function exchangeGoogleCode(code: string): Promise<AuthUserResponse> {
  return apiFetch<AuthUserResponse>("/auth/google/exchange", {
    method: "POST",
    body: { code },
  });
}

/**
 * Whether this deployment has Google credentials configured, so the button can
 * be hidden rather than linking somewhere that errors.
 */
export function getGoogleStatus(): Promise<{ enabled: boolean }> {
  return apiFetch<{ enabled: boolean }>("/auth/google/status");
}

/**
 * Full-page navigation, not fetch — the OAuth flow is a browser redirect chain
 * that ends on Google's own domain, which XHR cannot follow.
 */
export const GOOGLE_SIGN_IN_URL = `${API_BASE_URL}/auth/google`;
