import { Trophy } from "lucide-react";

import { BadgeTile } from "@/components/chakrm/badge-tile";
import { Credits } from "@/components/chakrm/credits";
import { DataList, DataListRow } from "@/components/chakrm/data-list";
import { LeaderboardRow } from "@/components/chakrm/leaderboard-row";
import { SectionHeader } from "@/components/chakrm/section-header";
import { StatTile } from "@/components/chakrm/stat-tile";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CHAMPIONS,
  CURRENT_SEASON,
  LEADERBOARD,
  SEASON_BADGES,
  SEASON_REWARDS,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const REWARD_TONE = {
  gold: "text-gold",
  primary: "text-primary",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
} as const;

export default function SeasonsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="gap-5 bg-linear-150 from-card from-55% to-gold-soft [--card-spacing:--spacing(6)] md:[--card-spacing:--spacing(7)]">
        <div className="flex flex-wrap items-start justify-between gap-4 px-(--card-spacing)">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gold-soft">
              <Trophy className="size-5.5 text-gold" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">
                {CURRENT_SEASON.name}
              </h2>
              <span className="text-sm text-muted-foreground">
                {CURRENT_SEASON.tagline}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatTile align="center" value={CURRENT_SEASON.endsIn.days} label="Days" />
            <StatTile align="center" value={CURRENT_SEASON.endsIn.hours} label="Hours" />
            <StatTile align="center" value={CURRENT_SEASON.endsIn.mins} label="Mins" />
          </div>
        </div>

        <div className="px-(--card-spacing)">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Season progress</span>
            <span>{CURRENT_SEASON.progress}%</span>
          </div>
          <Progress
            value={CURRENT_SEASON.progress}
            className="[&_[data-slot=progress-indicator]]:bg-gold [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-subtle"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 px-(--card-spacing)">
          <StatTile label="Your rank" value={CURRENT_SEASON.rank} />
          <StatTile label="Participants" value={CURRENT_SEASON.participants} />
          <StatTile
            label="Season pool volume"
            value={CURRENT_SEASON.poolVolume}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-col gap-3">
            <SectionHeader
              title="Top competitors this season"
              action={{ label: "Full leaderboard", href: "/leaderboards" }}
            />
            <DataList>
              {LEADERBOARD.slice(0, 6).map((entry) => (
                <LeaderboardRow key={entry.rank} entry={entry} />
              ))}
            </DataList>
          </div>

          <div className="flex flex-col gap-3">
            <SectionHeader title="Season rewards" />
            <DataList>
              {SEASON_REWARDS.map((reward) => (
                <DataListRow key={reward.rank}>
                  <span className="flex-1 text-sm">{reward.rank}</span>
                  {reward.extra && (
                    <span className="hidden text-xs text-faint sm:inline">
                      {reward.extra}
                    </span>
                  )}
                  <span
                    className={cn(
                      "w-28 text-right font-mono text-sm font-semibold tabular-nums",
                      REWARD_TONE[reward.tone],
                    )}
                  >
                    {reward.reward}
                  </span>
                </DataListRow>
              ))}
            </DataList>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <SectionHeader title="Earnable badges" />
            <div className="grid grid-cols-2 gap-3">
              {SEASON_BADGES.map((badge) => (
                <BadgeTile key={badge.label} badge={badge} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SectionHeader title="Previous champions" />
            <DataList>
              {CHAMPIONS.map((champion) => (
                <DataListRow key={champion.season}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold-soft">
                    <Trophy className="size-3.5 text-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{champion.season}</div>
                    <div className="truncate text-xs text-faint">
                      {champion.champion}
                    </div>
                  </div>
                  <Credits
                    amount={champion.credits}
                    tone="primary"
                    className="text-xs"
                  />
                </DataListRow>
              ))}
            </DataList>
          </div>
        </div>
      </div>
    </div>
  );
}
