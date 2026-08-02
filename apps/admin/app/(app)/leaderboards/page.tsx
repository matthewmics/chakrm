import { Crown, Sparkles } from "lucide-react";

import { DataList, DataListLabel, DataListRow } from "@/components/chakrm/data-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ADMIN_CHAMPIONS, CURRENT_SEASON } from "@/lib/mock-data";

export default function LeaderboardsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="gap-3 lg:col-span-2">
        <div className="flex items-center gap-2 px-(--card-spacing)">
          <Sparkles className="size-4 text-gold" />
          <h3 className="font-heading text-sm font-semibold">
            {CURRENT_SEASON.name}, {CURRENT_SEASON.status}
          </h3>
        </div>
        <p className="px-(--card-spacing) text-sm text-muted-foreground">
          Ends in {CURRENT_SEASON.endsIn}. {CURRENT_SEASON.participants}{" "}
          participants. {CURRENT_SEASON.poolVolume} Credits in the season pool.
        </p>
        <div className="flex items-center gap-2 px-(--card-spacing)">
          <Button>Export standings</Button>
          <Button variant="destructive">End season now</Button>
        </div>
      </Card>

      <DataList>
        <DataListLabel>Past champions</DataListLabel>
        {ADMIN_CHAMPIONS.map((champion) => (
          <DataListRow key={champion.season} className="items-center">
            <Crown className="size-3.5 text-gold" />
            <span className="flex-1 text-sm">{champion.season}</span>
            <span className="text-sm text-muted-foreground">
              {champion.champion}
            </span>
          </DataListRow>
        ))}
      </DataList>
    </div>
  );
}
