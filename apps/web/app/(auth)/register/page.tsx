import { Suspense } from "react";
import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign up · Chakrm",
};

export default function RegisterPage() {
  return (
    <Card className="gap-5 [--card-spacing:--spacing(6)]">
      <div className="flex flex-col gap-1 px-(--card-spacing)">
        <h1 className="font-heading text-xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Start with 1,000 Credits and predict your first match.
        </p>
      </div>

      <div className="px-(--card-spacing)">
        <Suspense fallback={<FormSkeleton />}>
          <RegisterForm />
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
      <div className="h-16 rounded-lg bg-subtle" />
      <div className="h-10 rounded-lg bg-subtle" />
    </div>
  );
}
