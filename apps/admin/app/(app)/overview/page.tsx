import {
  CalendarDays,
  Clock,
  Target,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/components/chakrm/stat-card";
import { VolumeChart } from "@/components/chakrm/volume-chart";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ADMIN_STATS, ADMIN_VOLUME } from "@/lib/mock-data";

const ICONS = {
  users: Users,
  calendar: CalendarDays,
  clock: Clock,
  wallet: Wallet,
  target: Target,
  trophy: Trophy,
} as const;

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {ADMIN_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            sub={stat.sub}
            icon={ICONS[stat.icon]}
            tone={stat.tone}
          />
        ))}
      </div>

      <Card className="gap-4">
        <div className="flex items-center justify-between px-(--card-spacing)">
          <div>
            <h3 className="font-heading text-sm font-semibold">
              Platform prediction volume
            </h3>
            <span className="text-xs text-muted-foreground">
              Last 7 days, all sports
            </span>
          </div>
          <Badge className="bg-primary-soft text-primary">
            +14% week over week
          </Badge>
        </div>
        <div className="px-(--card-spacing)">
          <VolumeChart data={ADMIN_VOLUME} />
        </div>
      </Card>
    </div>
  );
}
