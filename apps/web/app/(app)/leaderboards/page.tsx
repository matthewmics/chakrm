"use client";

import { Crown, Flame } from "lucide-react";

import { Credits } from "@/components/chakrm/credits";
import { UserAvatar } from "@/components/chakrm/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LEADERBOARD } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PERIODS = ["Daily", "Weekly", "Monthly", "Season", "All-Time"];

export default function LeaderboardsPage() {
  // Second place sits left of the winner so the podium reads 2 – 1 – 3.
  const [first, second, third] = LEADERBOARD;
  const podium = [second, first, third];

  return (
    <div className="flex flex-col gap-5">
      <Tabs defaultValue="Weekly">
        <TabsList>
          {PERIODS.map((period) => (
            <TabsTrigger key={period} value={period}>
              {period}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-3 items-end gap-3">
        {podium.map((entry) => {
          const winner = entry.rank === 1;

          return (
            <Card
              key={entry.rank}
              size="sm"
              className={cn(
                "items-center gap-2 text-center",
                winner && "pt-7 ring-gold",
              )}
            >
              {winner && <Crown className="size-4.5 text-gold" />}
              <UserAvatar
                name={entry.name}
                size={winner ? 56 : 44}
                ring={winner}
              />
              <span className="text-sm font-semibold">{entry.name}</span>
              <Badge
                className={cn(
                  winner ? "bg-gold-soft text-gold" : "bg-subtle text-muted-foreground",
                )}
              >
                Rank #{entry.rank}
              </Badge>
              <Credits
                amount={entry.credits}
                tone="primary"
                className="text-base font-semibold"
              />
            </Card>
          );
        })}
      </div>

      <Card className="py-0">
        <Table className="min-w-[560px]">
          <TableHeader>
            <TableRow className="border-subtle hover:bg-transparent">
              <TableHead className="w-11 px-4 text-xs tracking-wide text-faint uppercase">
                #
              </TableHead>
              <TableHead className="px-4 text-xs tracking-wide text-faint uppercase">
                Player
              </TableHead>
              <TableHead className="w-28 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Credits
              </TableHead>
              <TableHead className="w-24 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Return
              </TableHead>
              <TableHead className="w-24 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Accuracy
              </TableHead>
              <TableHead className="w-20 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Streak
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEADERBOARD.map((entry) => (
              <TableRow key={entry.rank} className="border-subtle">
                <TableCell className="px-4">
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold tabular-nums",
                      entry.rank <= 3 ? "text-gold" : "text-faint",
                    )}
                  >
                    {entry.rank}
                  </span>
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <UserAvatar name={entry.name} size={26} />
                    <span className="truncate text-sm">{entry.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <Credits amount={entry.credits} className="text-sm" />
                </TableCell>
                <TableCell className="px-4 text-right">
                  <span className="font-mono text-sm font-medium text-primary tabular-nums">
                    +{entry.roi}%
                  </span>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">
                    {entry.acc}%
                  </span>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <span className="inline-flex items-center gap-1 font-mono text-sm text-gold tabular-nums">
                    {entry.streak > 0 && <Flame className="size-3" />}
                    {entry.streak}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
