"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { GoogleButton } from "@/components/auth/google-button";
import { useSetCurrentUser } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { login } from "@/lib/api/auth";
import { safeRedirect } from "@/lib/safe-redirect";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCurrentUser = useSetCurrentUser();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const next = safeRedirect(searchParams.get("next"));

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      // Seed the cache from the login response so the topbar switches to the
      // signed-in state immediately instead of after a round trip to /auth/me.
      setCurrentUser(user);
      router.push(next);
      // Server components were rendered without the cookie; refresh so anything
      // that reads the session server-side re-renders.
      router.refresh();
    },
  });

  const errorMessage = readErrorMessage(mutation.error);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate({ email, password });
      }}
      className="flex flex-col gap-4"
    >
      <GoogleButton label="Continue with Google" />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-10"
        />
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-destructive-soft px-3 py-2 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending && <Loader2 className="animate-spin" />}
        Log in
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${next === "/" ? "" : `?next=${encodeURIComponent(next)}`}`}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

/**
 * The API deliberately returns one message for every credential failure, so
 * there is nothing to distinguish here — anything that isn't a 401 is a real
 * fault and gets a message that doesn't blame the user's password.
 */
function readErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (error instanceof ApiError && error.status === 401) {
    return "Incorrect email or password.";
  }

  return "Something went wrong signing you in. Please try again.";
}
