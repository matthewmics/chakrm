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
import { register } from "@/lib/api/auth";
import { safeRedirect } from "@/lib/safe-redirect";

/** Mirrors the MinLength(8) on RegisterDto so the error surfaces before submit. */
const MIN_PASSWORD_LENGTH = 8;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCurrentUser = useSetCurrentUser();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const next = safeRedirect(searchParams.get("next"));

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      setCurrentUser(user);
      router.push(next);
      router.refresh();
    },
  });

  const errorMessage = readErrorMessage(mutation.error);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate({ name, email, password });
      }}
      className="flex flex-col gap-4"
    >
      <GoogleButton label="Sign up with Google" />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          name="name"
          autoComplete="nickname"
          required
          minLength={2}
          maxLength={50}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-10"
        />
        <p className="text-xs text-faint">Shown on the leaderboard.</p>
      </div>

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
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-10"
        />
        <p className="text-xs text-faint">
          At least {MIN_PASSWORD_LENGTH} characters.
        </p>
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
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/login${next === "/" ? "" : `?next=${encodeURIComponent(next)}`}`}
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

function readErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (error instanceof ApiError) {
    // 409 is the taken-email case and 400 is validation — both are worth
    // showing verbatim, since the user can act on them.
    if (error.status === 409 || error.status === 400) return error.message;
  }

  return "Something went wrong creating your account. Please try again.";
}
