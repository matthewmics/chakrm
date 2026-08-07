"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getMe } from "@/lib/api/auth";
import type { AuthUserResponse } from "@/lib/api/types";

export const ME_QUERY_KEY = ["me"] as const;

type AuthContextValue = {
  user: AuthUserResponse | null;
  /** True only on the first resolve, so the topbar can show a skeleton once. */
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    // getMe already maps 401 to null, so a retry here would only ever repeat a
    // real failure. Signed-out is the common case and must not cost 2 requests.
    retry: false,
    staleTime: 5 * 60 * 1000,
    // Credits change when a prediction settles, so re-check on tab focus.
    refetchOnWindowFocus: true,
  });

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      isLoading: isPending,
      isAuthenticated: Boolean(data),
    }),
    [data, isPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }

  return context;
}

/**
 * Writes the user the API just returned straight into the cache, so the topbar
 * updates without a second round trip after login or register.
 */
export function useSetCurrentUser() {
  const queryClient = useQueryClient();

  return React.useCallback(
    (user: AuthUserResponse | null) => {
      queryClient.setQueryData(ME_QUERY_KEY, user);
    },
    [queryClient],
  );
}
