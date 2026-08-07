"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { useSetCurrentUser } from "@/components/auth/auth-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { exchangeGoogleCode } from "@/lib/api/auth";

export function GoogleFinish() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCurrentUser = useSetCurrentUser();

  const code = searchParams.get("code");

  const mutation = useMutation({
    mutationFn: exchangeGoogleCode,
    onSuccess: (user) => {
      setCurrentUser(user);
      // replace, not push: the code is spent, so this URL must not survive in
      // history for the back button to land on.
      router.replace("/");
      router.refresh();
    },
  });

  // Codes are single use and expire in 60 seconds, so this must fire exactly
  // once. The ref guards against React 18+ double-invoking effects in
  // development, which would spend the code on the first call and fail the
  // second — presenting a working sign-in as an error.
  const exchanged = React.useRef(false);
  const { mutate } = mutation;

  React.useEffect(() => {
    if (!code || exchanged.current) return;
    exchanged.current = true;
    mutate(code);
  }, [code, mutate]);

  if (!code || mutation.isError) {
    return (
      <Card className="max-w-sm items-center gap-3 py-10 text-center [--card-spacing:--spacing(6)]">
        <p className="text-sm font-medium">Couldn&apos;t finish signing in</p>
        <p className="px-(--card-spacing) text-xs text-muted-foreground">
          {code
            ? "That sign-in link has already been used or has expired."
            : "This page was opened without a sign-in code."}
        </p>
        <ButtonLink variant="outline" size="sm" href="/login">
          Back to log in
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Signing you in…
    </div>
  );
}
