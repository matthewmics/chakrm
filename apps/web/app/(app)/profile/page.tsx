import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CalendarDays,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";

import { AccuracyChart } from "@/components/chakrm/accuracy-chart";
import { BadgeTile } from "@/components/chakrm/badge-tile";
import { DataList, DataListRow } from "@/components/chakrm/data-list";
import { SectionHeader } from "@/components/chakrm/section-header";
import { StatCard } from "@/components/chakrm/stat-card";
import { UserAvatar } from "@/components/chakrm/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import {
  ACHIEVEMENTS,
  CURRENT_USER,
  FAVORITE_SPORTS,
  PERFORMANCE,
  SEASON_HISTORY,
} from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="bg-linear-135 from-card to-primary-soft [--card-spacing:--spacing(5)] md:[--card-spacing:--spacing(6)]">
        <div className="flex flex-col gap-5 px-(--card-spacing) sm:flex-row sm:items-center">
          <UserAvatar name={CURRENT_USER.name} size={76} ring />

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-semibold">
                {CURRENT_USER.name}
              </h2>
              <Badge className="bg-gold-soft text-gold">
                Rank #{CURRENT_USER.rank}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              Joined {CURRENT_USER.joined} · Weekly leaderboard
            </span>

            <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Target className="size-3 text-primary" />
                {CURRENT_USER.accuracy}% accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="size-3 text-gold" />
                {CURRENT_USER.streak} win streak
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet className="size-3 text-primary" />
                {formatCredits(CURRENT_USER.credits)} Credits
              </span>
            </div>
          </div>

          <Button variant="outline" size="lg" className="w-full shrink-0 sm:w-auto">
            Edit profile
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Current Credits" value="12,480" icon={Wallet} tone="primary" />
        <StatCard label="Prediction Accuracy" value="63%" icon={Target} tone="primary" />
        <StatCard label="Return Rate" value="+142%" icon={TrendingUp} tone="primary" />
        <StatCard label="Biggest Reward" value="4,200" icon={Award} tone="gold" />
        <StatCard label="Total Predictions" value="286" icon={CalendarDays} />
        <StatCard label="Correct" value="180" icon={ArrowUpRight} tone="primary" />
        <StatCard label="Incorrect" value="106" icon={ArrowDownRight} />
        <StatCard label="Win Streak" value="4" icon={Flame} tone="gold" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <SectionHeader title="Achievement badges" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ACHIEVEMENTS.map((achievement) => (
              <BadgeTile key={achievement.label} badge={achievement} />
            ))}
          </div>

          <SectionHeader title="Season history" className="mt-2" />
          <DataList>
            {SEASON_HISTORY.map((season) => (
              <DataListRow key={season.season}>
                <Trophy className="size-3.5 text-gold" />
                <span className="flex-1 text-sm">{season.season}</span>
                <span className="text-xs text-muted-foreground">
                  Rank #{season.rank}
                </span>
                <span className="w-20 text-right font-mono text-sm font-medium text-primary tabular-nums">
                  +{formatCredits(season.reward)}
                </span>
              </DataListRow>
            ))}
          </DataList>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeader title="Favorite sports" />
          <Card size="sm">
            <div className="flex flex-wrap gap-2 px-(--card-spacing)">
              {FAVORITE_SPORTS.map((sport) => (
                <span
                  key={sport}
                  className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {sport}
                </span>
              ))}
            </div>
          </Card>

          <SectionHeader title="Accuracy trend" className="mt-2" />
          <Card size="sm">
            <div className="px-(--card-spacing)">
              <AccuracyChart
                data={PERFORMANCE}
                color="gold"
                height={140}
                showGrid={false}
                showTooltip={false}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
