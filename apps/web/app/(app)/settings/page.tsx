"use client";

import * as React from "react";
import {
  CalendarDays,
  CircleCheckBig,
  Eye,
  EyeOff,
  Gift,
  LogOut,
  Send,
  Shield,
  Sparkles,
  TriangleAlert,
  Trophy,
} from "lucide-react";

import { DataList, DataListLabel, DataListRow } from "@/components/chakrm/data-list";
import { ToggleRow } from "@/components/chakrm/toggle-row";
import { UserAvatar } from "@/components/chakrm/user-avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SESSION_ICONS } from "@/lib/icons";
import { CURRENT_USER, SESSIONS_SEED } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TABS = [
  "Account",
  "Notifications",
  "Security",
  "Preferences",
  "Privacy",
  "Danger Zone",
];

const TIMEZONES = [
  "UTC+08:00, Manila",
  "UTC-05:00, New York",
  "UTC+00:00, London",
  "UTC-08:00, Los Angeles",
];

const SELECTABLE_SPORTS = [
  "Basketball",
  "Soccer",
  "Esports",
  "Tennis",
  "Football",
];

export default function SettingsPage() {
  const [username, setUsername] = React.useState(CURRENT_USER.name);
  const [email, setEmail] = React.useState(CURRENT_USER.email);
  const [saved, setSaved] = React.useState(false);

  const [notifications, setNotifications] = React.useState({
    settled: true,
    dailyBonus: true,
    rankChanges: false,
    chatMentions: true,
    weeklyDigest: false,
    announcements: false,
  });
  const setNotification = (key: keyof typeof notifications) => (value: boolean) =>
    setNotifications((current) => ({ ...current, [key]: value }));

  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessions, setSessions] = React.useState(SESSIONS_SEED);

  const [landingPage, setLandingPage] = React.useState("Dashboard");
  const [favoriteSports, setFavoriteSports] = React.useState([
    "Basketball",
    "Soccer",
    "Esports",
    "Tennis",
  ]);

  const [showOnLeaderboard, setShowOnLeaderboard] = React.useState(true);
  const [showHistory, setShowHistory] = React.useState(true);

  return (
    <Tabs defaultValue="Account" className="gap-5">
      <TabsList className="max-w-full overflow-x-auto">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className={cn(
              tab === "Danger Zone" &&
                "text-destructive data-active:text-destructive",
            )}
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="Account">
        <Card className="gap-5 [--card-spacing:--spacing(5)]">
          <div className="flex items-center gap-4 px-(--card-spacing)">
            <UserAvatar name={username} size={64} ring />
            <div className="flex flex-col items-start gap-1.5">
              <Button variant="outline">Change avatar</Button>
              <span className="text-xs text-faint">JPG or PNG. 2MB max.</span>
            </div>
          </div>

          <div className="grid gap-4 px-(--card-spacing) sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-xs text-muted-foreground">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setSaved(false);
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSaved(false);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 px-(--card-spacing) sm:w-64">
            <Label className="text-xs text-muted-foreground">Timezone</Label>
            <Select defaultValue={TIMEZONES[0]}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mx-(--card-spacing) flex items-center gap-3 border-t border-subtle pt-3">
            <Button size="lg" onClick={() => setSaved(true)}>
              Save changes
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <CircleCheckBig className="size-3.5" />
                Saved
              </span>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="Notifications">
        <DataList className="py-0">
          <ToggleRow
            icon={CircleCheckBig}
            label="Prediction settled"
            description="When a match you predicted on has a final result"
            checked={notifications.settled}
            onCheckedChange={setNotification("settled")}
          />
          <ToggleRow
            icon={Gift}
            label="Daily bonus reminder"
            description="A nudge if you haven't claimed today's bonus"
            checked={notifications.dailyBonus}
            onCheckedChange={setNotification("dailyBonus")}
          />
          <ToggleRow
            icon={Trophy}
            label="Leaderboard rank changes"
            description="When you move up or down a leaderboard"
            checked={notifications.rankChanges}
            onCheckedChange={setNotification("rankChanges")}
          />
          <ToggleRow
            icon={Send}
            label="Chat mentions"
            description="When someone mentions you in a match chat"
            checked={notifications.chatMentions}
            onCheckedChange={setNotification("chatMentions")}
          />
          <ToggleRow
            icon={CalendarDays}
            label="Weekly digest email"
            description="A summary of your predictions and standings"
            checked={notifications.weeklyDigest}
            onCheckedChange={setNotification("weeklyDigest")}
          />
          <ToggleRow
            icon={Sparkles}
            label="Product updates"
            description="New features and announcements from Chakrm"
            checked={notifications.announcements}
            onCheckedChange={setNotification("announcements")}
          />
        </DataList>
      </TabsContent>

      <TabsContent value="Security" className="flex flex-col gap-4">
        <Card className="gap-4 [--card-spacing:--spacing(5)]">
          <h3 className="px-(--card-spacing) font-heading text-sm font-semibold">
            Change password
          </h3>
          <div className="grid gap-3 px-(--card-spacing) sm:grid-cols-3">
            <Input type="password" placeholder="Current password" />
            <Input type="password" placeholder="New password" />
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <div className="px-(--card-spacing)">
            <Button size="lg">Update password</Button>
          </div>
        </Card>

        <DataList className="py-0">
          <ToggleRow
            icon={Shield}
            label="Two-factor authentication"
            description={
              twoFactor
                ? "Enabled. Your account has an extra layer of protection."
                : "Not enabled. Add an extra layer of protection."
            }
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
          />
        </DataList>

        <DataList>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataListLabel>Active sessions</DataListLabel>
            {sessions.length > 1 && (
              <button
                onClick={() =>
                  setSessions((current) => current.filter((s) => s.current))
                }
                className="flex items-center gap-1 px-3 text-xs font-medium text-destructive"
              >
                <LogOut className="size-3" />
                Sign out all other devices
              </button>
            )}
          </div>
          {sessions.map((session) => {
            const Icon = SESSION_ICONS[session.icon];

            return (
              <DataListRow key={session.id}>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-subtle">
                  <Icon className="size-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{session.device}</span>
                    {session.current && (
                      <Badge className="bg-primary-soft text-primary">
                        This device
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-faint">
                    {session.location} · {session.last}
                  </span>
                </div>
                {!session.current && (
                  <button
                    onClick={() =>
                      setSessions((current) =>
                        current.filter((s) => s.id !== session.id),
                      )
                    }
                    className="text-xs font-medium text-destructive"
                  >
                    Sign out
                  </button>
                )}
              </DataListRow>
            );
          })}
        </DataList>
      </TabsContent>

      <TabsContent value="Preferences" className="flex flex-col gap-4">
        <DataList className="py-0">
          <ToggleRow
            icon={Sparkles}
            label="Dark mode"
            description="Chakrm is dark-mode only for now. Light mode is planned."
            checked
            onCheckedChange={() => {}}
            disabled
          />
        </DataList>

        <Card className="gap-3 [--card-spacing:--spacing(5)]">
          <h3 className="px-(--card-spacing) font-heading text-sm font-semibold">
            Default landing page
          </h3>
          <div className="flex items-center gap-2 px-(--card-spacing)">
            {["Dashboard", "Events"].map((page) => (
              <button
                key={page}
                onClick={() => setLandingPage(page)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  landingPage === page
                    ? "border-primary-line bg-primary-soft text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent",
                )}
              >
                {page}
              </button>
            ))}
          </div>
        </Card>

        <Card className="gap-3 [--card-spacing:--spacing(5)]">
          <div className="px-(--card-spacing)">
            <h3 className="font-heading text-sm font-semibold">
              Favorite sports
            </h3>
            <p className="text-xs text-muted-foreground">
              Used to personalize your Featured pools and event recommendations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 px-(--card-spacing)">
            {SELECTABLE_SPORTS.map((sport) => {
              const active = favoriteSports.includes(sport);

              return (
                <button
                  key={sport}
                  onClick={() =>
                    setFavoriteSports((current) =>
                      active
                        ? current.filter((s) => s !== sport)
                        : [...current, sport],
                    )
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-primary-line bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-accent",
                  )}
                >
                  {sport}
                </button>
              );
            })}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="Privacy" className="flex flex-col gap-4">
        <DataList className="py-0">
          <ToggleRow
            icon={Eye}
            label="Show my profile on public leaderboards"
            description="Your username and stats appear on Daily, Weekly, and Season leaderboards"
            checked={showOnLeaderboard}
            onCheckedChange={setShowOnLeaderboard}
          />
          <ToggleRow
            icon={EyeOff}
            label="Show prediction history to other users"
            description="Let others see your past predictions on your profile"
            checked={showHistory}
            onCheckedChange={setShowHistory}
          />
        </DataList>

        <Card className="[--card-spacing:--spacing(5)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-(--card-spacing)">
            <div>
              <h3 className="text-sm font-medium">Download your data</h3>
              <p className="text-xs text-muted-foreground">
                Export your prediction history, transactions, and account info.
              </p>
            </div>
            <Button variant="outline">Request export</Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="Danger Zone">
        <Card className="gap-4 ring-destructive-soft [--card-spacing:--spacing(5)]">
          <div className="flex items-center gap-2 px-(--card-spacing)">
            <TriangleAlert className="size-4 text-destructive" />
            <h3 className="font-heading text-sm font-semibold">Danger zone</h3>
          </div>

          <div className="mx-(--card-spacing) flex flex-wrap items-center justify-between gap-3 border-b border-subtle pb-4">
            <div>
              <h4 className="text-sm font-medium">Deactivate account</h4>
              <p className="text-xs text-muted-foreground">
                Temporarily hide your profile and pause predictions. You can
                reactivate anytime.
              </p>
            </div>
            <DangerAction
              trigger={
                <Button variant="gold" className="bg-gold-soft text-gold">
                  Deactivate
                </Button>
              }
              title="Deactivate your account?"
              description="Your profile will be hidden and predictions paused until you sign back in and reactivate."
              confirmLabel="Deactivate account"
              tone="warning"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-(--card-spacing)">
            <div>
              <h4 className="text-sm font-medium">Delete account</h4>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account, Credits, and prediction history.
                This cannot be undone.
              </p>
            </div>
            <DangerAction
              trigger={
                <Button className="bg-destructive text-background hover:bg-destructive/80">
                  Delete account
                </Button>
              }
              title="Delete your account?"
              description="This permanently deletes your account, Credits balance, and prediction history. This action cannot be undone."
              confirmLabel="Delete my account"
              tone="danger"
            />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function DangerAction({
  trigger,
  title,
  description,
  confirmLabel,
  tone,
}: {
  trigger: React.ReactElement;
  title: string;
  description: string;
  confirmLabel: string;
  tone: "warning" | "danger";
}) {
  const danger = tone === "danger";

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={danger ? "bg-destructive-soft" : "bg-gold-soft"}
          >
            <TriangleAlert
              className={danger ? "text-destructive" : "text-gold"}
            />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={danger ? "destructive" : "gold"}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
