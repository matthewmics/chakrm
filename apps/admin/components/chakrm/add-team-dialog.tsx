"use client";

import * as React from "react";
import { ImageIcon } from "lucide-react";

import { TeamBadge } from "@/components/chakrm/team-badge";
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
import type { Sport, Team } from "@/lib/types";

type AddTeamDialogProps = {
  trigger: React.ReactElement;
  onCreate: (team: Omit<Team, "id" | "colors">) => void;
};

export function AddTeamDialog({ trigger, onCreate }: AddTeamDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [sport, setSport] = React.useState<Sport>(SPORTS[0].name);
  const [league, setLeague] = React.useState(SPORTS[0].defaultLeague);
  const [logo, setLogo] = React.useState("");

  const handleSportChange = (nextSport: Sport | null) => {
    if (!nextSport) return;
    setSport(nextSport);
    setLeague(SPORTS.find((s) => s.name === nextSport)?.defaultLeague ?? "");
  };

  const canCreate = name.trim().length > 0;

  const reset = () => {
    setName("");
    setSport(SPORTS[0].name);
    setLeague(SPORTS[0].defaultLeague);
    setLogo("");
  };

  const handleCreate = () => {
    onCreate({ name: name.trim(), sport, league, logo: logo.trim() || null });
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
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Add team</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <TeamBadge name={name || "?"} size={40} logo={logo} />
          <span className="text-xs text-faint">
            {logo
              ? "Using the logo above."
              : "No logo yet, a color crest is used instead."}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="team-name" className="text-xs text-muted-foreground">
            Team name
          </Label>
          <Input
            id="team-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Warriors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">
            Logo URL (optional)
          </Label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <ImageIcon className="size-3.5 text-faint" />
            <input
              value={logo}
              onChange={(event) => setLogo(event.target.value)}
              placeholder="https://..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <span className="text-[11px] text-faint">
            Only upload logos you have the rights to use. Leave blank to use an
            auto-generated color crest instead.
          </span>
        </div>

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
          <Label htmlFor="team-league" className="text-xs text-muted-foreground">
            League
          </Label>
          <Input
            id="team-league"
            value={league}
            onChange={(event) => setLeague(event.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!canCreate} onClick={handleCreate}>
            Add team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
