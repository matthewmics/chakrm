"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { CreateEventDialog } from "@/components/chakrm/create-event-dialog";
import { StatusBadge } from "@/components/chakrm/status-badge";
import { TeamBadge } from "@/components/chakrm/team-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCredits } from "@/lib/format";
import { ADMIN_EVENTS, TEAMS_SEED } from "@/lib/mock-data";
import type { AdminEvent } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = React.useState<AdminEvent[]>(ADMIN_EVENTS);
  const teams = TEAMS_SEED;

  const findTeam = (name: string) => teams.find((t) => t.name === name);

  const handleCreate = (
    event: Omit<AdminEvent, "id" | "participants" | "status">,
  ) => {
    const nextId = Math.max(0, ...events.map((e) => e.id)) + 1;
    setEvents((current) => [
      ...current,
      { ...event, id: nextId, participants: 0, status: "Open" },
    ]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <CreateEventDialog
          trigger={
            <Button>
              <Plus />
              Create event
            </Button>
          }
          teams={teams}
          onCreate={handleCreate}
        />
      </div>

      <Card className="py-0">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="border-subtle hover:bg-transparent">
              <TableHead className="px-4 text-xs tracking-wide text-faint uppercase">
                Match
              </TableHead>
              <TableHead className="w-38 px-4 text-xs tracking-wide text-faint uppercase">
                League
              </TableHead>
              <TableHead className="w-25 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Pool
              </TableHead>
              <TableHead className="w-28 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Participants
              </TableHead>
              <TableHead className="w-28 px-4 text-xs tracking-wide text-faint uppercase">
                Status
              </TableHead>
              <TableHead className="w-20 px-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className="border-subtle">
                <TableCell className="px-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <TeamBadge
                      name={event.a}
                      size={24}
                      colors={findTeam(event.a)?.colors}
                      logo={findTeam(event.a)?.logo}
                    />
                    <span className="text-sm">
                      {event.a} vs {event.b}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4">
                  <span className="text-sm text-muted-foreground">
                    {event.league}
                  </span>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <span className="font-mono text-sm tabular-nums">
                    {formatCredits(event.pool)}
                  </span>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <span className="font-mono text-sm text-muted-foreground tabular-nums">
                    {formatCredits(event.participants)}
                  </span>
                </TableCell>
                <TableCell className="px-4">
                  <StatusBadge status={event.status} />
                </TableCell>
                <TableCell className="px-4 text-right">
                  <button className="text-xs font-medium text-primary">
                    Manage
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
