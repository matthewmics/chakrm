"use client";

import * as React from "react";

import { teamInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

type TeamBadgeProps = {
  name: string;
  size?: number;
  colors?: [string, string];
  /** Optional uploaded crest; falls back to the color monogram on load error. */
  logo?: string | null;
  className?: string;
};

/**
 * Stylised monogram crest by default. Admins can attach a logo URL when
 * creating a team (Teams tab); if it fails to load, falls back to the crest
 * rather than a broken image.
 */
export function TeamBadge({
  name,
  size = 32,
  colors,
  logo,
  className,
}: TeamBadgeProps) {
  const [logoFailed, setLogoFailed] = React.useState(false);
  const [from, to] = colors ?? ["#1E2A2A", "#2A3330"];

  if (logo && !logoFailed) {
    return (
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-xl border border-border bg-card",
          className,
        )}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied URLs, not a static/local asset */}
        <img
          src={logo}
          alt={name}
          className="size-full object-cover"
          onError={() => setLogoFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border font-mono font-bold tracking-tight text-[#F5F7F6]",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        backgroundImage: `linear-gradient(150deg, ${from}, ${to})`,
      }}
    >
      {teamInitials(name)}
    </div>
  );
}
