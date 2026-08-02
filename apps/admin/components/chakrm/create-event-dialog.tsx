"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS } from "@/lib/mock-data";
import type { AdminEvent, Sport, Team } from "@/lib/types";

type CreateEventDialogProps = {
  trigger: React.ReactElement;
  teams: Team[];
  onCreate: (event: Omit<AdminEvent, "id" | "participants" | "status">) => void;
};

export function CreateEventDialog({
  trigger,
  teams,
  onCreate,
}: CreateEventDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [sport, setSport] = React.useState<Sport>(SPORTS[0].name);
  const [league, setLeague] = React.useState(SPORTS[0].defaultLeague);
  const [teamAId, setTeamAId] = React.useState("");
  const [teamBId, setTeamBId] = React.useState("");
  const [time, setTime] = React.useState("");
  const [pool, setPool] = React.useState("0");

  const sportTeams = teams.filter((t) => t.sport === sport);

  const handleSportChange = (nextSport: Sport | null) => {
    if (!nextSport) return;
    setSport(nextSport);
    setLeague(SPORTS.find((s) => s.name === nextSport)?.defaultLeague ?? "");
    setTeamAId("");
    setTeamBId("");
  };

  const canCreate =
    teamAId && teamBId && teamAId !== teamBId && time.trim().length > 0;

  const reset = () => {
    setSport(SPORTS[0].name);
    setLeague(SPORTS[0].defaultLeague);
    setTeamAId("");
    setTeamBId("");
    setTime("");
    setPool("0");
  };

  const handleCreate = () => {
    const teamA = teams.find((t) => String(t.id) === teamAId);
    const teamB = teams.find((t) => String(t.id) === teamBId);
    if (!teamA || !teamB) return;

    onCreate({
      league,
      a: teamA.name,
      b: teamB.name,
      time,
      pool: Number(pool) || 0,
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-110">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Sport</Label>
          <Select value={sport} onValueChange={handleSportChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPORTS.map((s) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="event-league" className="text-xs text-muted-foreground">
            League
          </Label>
          <Input
            id="event-league"
            value={league}
            onChange={(event) => setLeague(event.target.value)}
          />
        </div>

        {sportTeams.length < 2 ? (
          <p className="rounded-lg bg-gold-soft px-3 py-2.5 text-sm text-gold">
            You need at least two {sport} teams before you can create a {sport}{" "}
            event. Add teams in the Teams tab first.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Team A</Label>
              <Select
                value={teamAId}
                onValueChange={(value) => setTeamAId(value ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {sportTeams.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={String(team.id)}
                      disabled={String(team.id) === teamBId}
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Team B</Label>
              <Select
                value={teamBId}
                onValueChange={(value) => setTeamBId(value ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {sportTeams.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={String(team.id)}
                      disabled={String(team.id) === teamAId}
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="event-time" className="text-xs text-muted-foreground">
            Match time
          </Label>
          <Input
            id="event-time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            placeholder="e.g. Sat, 7:30 PM"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="event-pool" className="text-xs text-muted-foreground">
            Starting pool (Credits, optional)
          </Label>
          <Input
            id="event-pool"
            type="number"
            min="0"
            value={pool}
            onChange={(event) => setPool(event.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!canCreate} onClick={handleCreate}>
            Create event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
