import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Log in · Chakrm",
};

export default function LoginPage() {
  return (
    <Card className="gap-5 [--card-spacing:--spacing(6)]">
      <div className="flex flex-col gap-1 px-(--card-spacing)">
        <h1 className="font-heading text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to place predictions and climb the rankings.
        </p>
      </div>

      <div className="px-(--card-spacing)">
        {/* useSearchParams (for ?next=) opts the tree into client rendering,
            which Next requires a Suspense boundary for. */}
        <Suspense fallback={<FormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </Card>
  );
}

function FormSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="h-16 rounded-lg bg-subtle" />
      <div className="h-16 rounded-lg bg-subtle" />
      <div className="h-10 rounded-lg bg-subtle" />
    </div>
  );
}
