import {
  Award,
  Crown,
  Flame,
  Medal,
  Target,
  Trophy,
  Wallet,
} from "lucide-react";

import { AccuracyChart } from "@/components/chakrm/accuracy-chart";
import { DailyBonusCard } from "@/components/chakrm/daily-bonus-card";
import { DataList, DataListRow } from "@/components/chakrm/data-list";
import { EventCard } from "@/components/chakrm/event-card";
import { LeaderboardRow } from "@/components/chakrm/leaderboard-row";
import { SectionHeader } from "@/components/chakrm/section-header";
import { StatCard } from "@/components/chakrm/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SPORT_ICONS } from "@/lib/icons";
import { ACTIVITY, EVENTS, LEADERBOARD, PERFORMANCE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <DailyBonusCard />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Current Credits" value="12,480" sub="+840" icon={Wallet} tone="primary" />
        <StatCard label="Current Rank" value="#4" sub="+2" icon={Crown} tone="gold" />
        <StatCard label="Weekly Rank" value="#7" sub="-1" icon={Trophy} />
        <StatCard label="Monthly Rank" value="#12" sub="+5" icon={Trophy} />
        <StatCard label="Prediction Accuracy" value="63%" sub="+4%" icon={Target} tone="primary" />
        <StatCard label="Win Streak" value="4" sub="+1" icon={Flame} tone="gold" />
        <StatCard label="Total Rewards" value="38,210" sub="+1,240" icon={Award} tone="primary" />
        <StatCard label="Daily Rank" value="#2" sub="+3" icon={Medal} tone="gold" />
      </div>

      <Card className="gap-4">
        <div className="flex items-center justify-between px-(--card-spacing)">
          <SectionHeader title="Prediction accuracy" description="Last 7 days" />
          <Badge className="bg-primary-soft text-primary">+9% this week</Badge>
        </div>
        <div className="px-(--card-spacing)">
          <AccuracyChart data={PERFORMANCE} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <SectionHeader
            title="Featured pools"
            action={{ label: "View all", href: "/events" }}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {EVENTS.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>

          <SectionHeader title="Recent activity" className="mt-2" />
          <DataList>
            {ACTIVITY.map((item, index) => (
              <DataListRow key={index}>
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    item.positive ? "bg-primary" : "bg-destructive",
                  )}
                />
                <span className="flex-1 text-sm">{item.text}</span>
                {item.delta && (
                  <span
                    className={cn(
                      "font-mono text-sm font-medium tabular-nums",
                      item.positive ? "text-primary" : "text-destructive",
                    )}
                  >
                    {item.delta}
                  </span>
                )}
                <span className="w-16 shrink-0 text-right text-xs text-faint">
                  {item.t}
                </span>
              </DataListRow>
            ))}
          </DataList>
        </div>

        <div className="flex flex-col gap-3">
          <SectionHeader
            title="Leaderboard"
            action={{ label: "See all", href: "/leaderboards" }}
          />
          <DataList>
            {LEADERBOARD.slice(0, 5).map((entry) => (
              <LeaderboardRow key={entry.rank} entry={entry} />
            ))}
          </DataList>

          <SectionHeader title="Upcoming" className="mt-1" />
          <DataList>
            {EVENTS.slice(2, 5).map((event) => {
              const SportIcon = SPORT_ICONS[event.sport];

              return (
                <DataListRow key={event.id} className="px-2">
                  <SportIcon className="size-3.5 text-faint" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">
                      {event.a} vs {event.b}
                    </div>
                    <div className="text-xs text-faint">{event.time}</div>
                  </div>
                </DataListRow>
              );
            })}
          </DataList>
        </div>
      </div>
    </div>
  );
}
