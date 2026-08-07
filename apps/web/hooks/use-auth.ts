"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ME_QUERY_KEY,
  useAuthContext,
  useSetCurrentUser,
} from "@/components/auth/auth-provider";
import { logout as logoutRequest } from "@/lib/api/auth";

export function useAuth() {
  return useAuthContext();
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCurrentUser = useSetCurrentUser();

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      // Runs on error too: /auth/logout only ever fails if the network did, and
      // the user's intent was to be signed out. Clearing locally is the honest
      // outcome — the cookie is gone or expiring either way.
      setCurrentUser(null);
      void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      router.push("/");
      // Server components rendered with the old cookie are still in the router
      // cache; without this they keep showing signed-in content.
      router.refresh();
    },
  });
}
