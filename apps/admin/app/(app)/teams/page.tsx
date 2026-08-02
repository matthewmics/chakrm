"use client";

import * as React from "react";
import { Flag, Plus, Trash2 } from "lucide-react";

import { AddTeamDialog } from "@/components/chakrm/add-team-dialog";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CREST_PALETTE, SPORTS, TEAMS_SEED } from "@/lib/mock-data";
import type { Sport, Team } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "All" as const;

export default function TeamsPage() {
  const [teams, setTeams] = React.useState<Team[]>(TEAMS_SEED);
  const [sportFilter, setSportFilter] = React.useState<Sport | typeof ALL>(ALL);

  const filtered =
    sportFilter === ALL ? teams : teams.filter((t) => t.sport === sportFilter);

  const handleCreate = (team: Omit<Team, "id" | "colors">) => {
    const nextId = Math.max(0, ...teams.map((t) => t.id)) + 1;
    const colors = CREST_PALETTE[teams.length % CREST_PALETTE.length];
    setTeams((current) => [...current, { ...team, id: nextId, colors }]);
  };

  const removeTeam = (id: number) =>
    setTeams((current) => current.filter((t) => t.id !== id));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {[ALL, ...SPORTS.map((s) => s.name)].map((sport) => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport as Sport | typeof ALL)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                sportFilter === sport
                  ? "border-primary-line bg-primary-soft text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {sport}
            </button>
          ))}
        </div>
        <AddTeamDialog
          trigger={
            <Button>
              <Plus />
              Add team
            </Button>
          }
          onCreate={handleCreate}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((team) => (
          <Card
            key={team.id}
            className="flex-row items-center gap-3 transition-colors hover:bg-accent"
          >
            <TeamBadge
              name={team.name}
              size={40}
              colors={team.colors}
              logo={team.logo}
              className="ml-(--card-spacing)"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{team.name}</div>
              <div className="truncate text-xs text-faint">{team.league}</div>
            </div>
            <Badge className="bg-subtle text-muted-foreground">
              {team.sport}
            </Badge>
            <button
              onClick={() => removeTeam(team.id)}
              className="mr-(--card-spacing) flex size-7 shrink-0 items-center justify-center rounded-lg bg-destructive-soft"
            >
              <Trash2 className="size-3 text-destructive" />
              <span className="sr-only">Remove {team.name}</span>
            </button>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="items-center gap-2 py-8 text-center sm:col-span-2 lg:col-span-3">
            <Flag className="size-4.5 text-faint" />
            <p className="text-sm text-muted-foreground">
              No teams yet for this sport.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
