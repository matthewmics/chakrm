"use client";

import { ArrowRight, Trophy, Wallet } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { formatCredits } from "@/lib/format";

/**
 * The one auth-dependent block on the home page. All states are the same
 * height, so the page doesn't reflow when /auth/me resolves — everything below
 * this is identical for guests and members.
 *
 * `hadSessionCookie` comes from the server, which can see the cookie this
 * component cannot (it's httpOnly). It only picks what to show for the moment
 * before /auth/me resolves, and matters because the guest copy is this page's
 * whole pitch: rendering a skeleton there would keep it out of the SSR HTML and
 * away from crawlers, and flash grey at every first-time visitor.
 */
export function HomeBand({ hadSessionCookie }: { hadSessionCookie: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // No cookie means guest, reliably — so show the real thing, not a skeleton.
    // A cookie only *suggests* a session (it may have expired), so that case
    // waits rather than showing a balance that could be about to disappear.
    return hadSessionCookie ? (
      <Card className="h-26 animate-pulse bg-subtle" />
    ) : (
      <GuestBand />
    );
  }

  return user ? <MemberBand name={user.name} credits={user.credits} /> : <GuestBand />;
}

function GuestBand() {
  return (
    <Card className="gap-3 bg-linear-160 from-card to-primary-soft [--card-spacing:--spacing(6)]">
      <div className="flex flex-col gap-1 px-(--card-spacing)">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          Predict matches. Climb the rankings.
        </h1>
        <p className="text-sm text-muted-foreground">
          Chakrm runs on virtual Credits, not real money. Browse every match
          below without an account — sign up when you want to call one.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 px-(--card-spacing)">
        <ButtonLink size="lg" href="/register">
          Create account
          <ArrowRight />
        </ButtonLink>
        <ButtonLink variant="outline" size="lg" href="/events">
          Browse events
        </ButtonLink>
      </div>
    </Card>
  );
}

/**
 * Shows credits and nothing else. Rank, accuracy and streak have no data behind
 * them until predictions exist, and inventing them on the most prominent
 * signed-in page is worse than showing less.
 */
function MemberBand({ name, credits }: { name: string | null; credits: number }) {
  return (
    <Card className="gap-3 [--card-spacing:--spacing(6)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-(--card-spacing)">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Welcome back{name ? `, ${name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s running right now.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 ring-1 ring-primary-line">
            <Wallet className="size-4 text-primary" />
            <div className="flex flex-col leading-none">
              <span className="font-mono text-base font-semibold text-primary tabular-nums">
                {formatCredits(credits)}
              </span>
              <span className="text-[10px] text-primary">Credits</span>
            </div>
          </div>
          <ButtonLink variant="outline" size="lg" href="/leaderboards">
            <Trophy />
            Rankings
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
