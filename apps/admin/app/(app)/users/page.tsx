"use client";

import * as React from "react";
import { Search, UserCheck, UserX } from "lucide-react";

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
import { formatCredits } from "@/lib/format";
import { ADMIN_USERS } from "@/lib/mock-data";
import type { UserStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Active", "Suspended"] as const;

export default function UsersPage() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All");
  const [overrides, setOverrides] = React.useState<Record<number, boolean>>({});

  const statusFor = (id: number, status: UserStatus): UserStatus =>
    overrides[id] !== undefined ? (overrides[id] ? "Suspended" : "Active") : status;

  const toggleSuspend = (id: number, status: UserStatus) => {
    const current = statusFor(id, status);
    setOverrides((prev) => ({ ...prev, [id]: current === "Active" }));
  };

  const filtered = ADMIN_USERS.filter((user) => {
    const matchesQuery = user.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "All" || statusFor(user.id, user.status) === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "border-primary-line bg-primary-soft text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex w-55 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
          <Search className="size-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <Card className="py-0">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="border-subtle hover:bg-transparent">
              <TableHead className="px-4 text-xs tracking-wide text-faint uppercase">
                Player
              </TableHead>
              <TableHead className="w-25 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Credits
              </TableHead>
              <TableHead className="w-22 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Accuracy
              </TableHead>
              <TableHead className="w-20 px-4 text-xs tracking-wide text-faint uppercase">
                Role
              </TableHead>
              <TableHead className="w-25 px-4 text-xs tracking-wide text-faint uppercase">
                Status
              </TableHead>
              <TableHead className="w-22 px-4 text-xs tracking-wide text-faint uppercase">
                Joined
              </TableHead>
              <TableHead className="w-28 px-4 text-right text-xs tracking-wide text-faint uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => {
              const status = statusFor(user.id, user.status);

              return (
                <TableRow key={user.id} className="border-subtle">
                  <TableCell className="px-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <UserAvatar name={user.name} size={26} />
                      <span className="truncate text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <span className="font-mono text-sm tabular-nums">
                      {formatCredits(user.credits)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <span className="font-mono text-sm text-muted-foreground tabular-nums">
                      {user.role === "Admin" ? "N/A" : `${user.acc}%`}
                    </span>
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge
                      className={
                        user.role === "Admin"
                          ? "bg-gold-soft text-gold"
                          : "bg-subtle text-muted-foreground"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge
                      className={
                        status === "Active"
                          ? "bg-primary-soft text-primary"
                          : "bg-destructive-soft text-destructive"
                      }
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4">
                    <span className="text-sm text-muted-foreground">
                      {user.joined}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    {user.role !== "Admin" && (
                      <button
                        onClick={() => toggleSuspend(user.id, user.status)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                          status === "Active"
                            ? "bg-destructive-soft text-destructive"
                            : "bg-primary-soft text-primary",
                        )}
                      >
                        {status === "Active" ? (
                          <UserX className="size-3" />
                        ) : (
                          <UserCheck className="size-3" />
                        )}
                        {status === "Active" ? "Suspend" : "Reinstate"}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
