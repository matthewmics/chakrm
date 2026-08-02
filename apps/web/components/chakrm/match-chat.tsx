"use client";

import * as React from "react";
import { Send } from "lucide-react";

import { UserAvatar } from "@/components/chakrm/user-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CHAT_SEED, CURRENT_USER, EVENT_ACTIVITY_SEED } from "@/lib/mock-data";
import type { ChatMessage, SportEvent } from "@/lib/types";

/** Live chat alongside a feed of who just committed Credits to which side. */
export function MatchChat({ event }: { event: SportEvent }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(CHAT_SEED);
  const [draft, setDraft] = React.useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), user: CURRENT_USER.name, text, t: "Just now" },
    ]);
    setDraft("");
  };

  return (
    <Card className="h-[420px] gap-0 py-0">
      <Tabs defaultValue="chat" className="h-full gap-0">
        <div className="flex items-center justify-between border-b border-subtle px-4 py-3">
          <TabsList>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <span className="flex items-center gap-1.5 text-xs text-faint">
            <span className="size-1.5 rounded-full bg-primary" />
            128 in chat
          </span>
        </div>

        <TabsContent value="chat" className="flex min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-3">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-2.5">
                <UserAvatar name={message.user} size={24} />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold">
                      {message.user}
                    </span>
                    <span className="text-[11px] text-faint">{message.t}</span>
                  </div>
                  <p className="text-sm leading-snug text-muted-foreground">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-subtle px-3 py-3">
            <Input
              value={draft}
              onChange={(changeEvent) => setDraft(changeEvent.target.value)}
              onKeyDown={(keyEvent) => {
                if (keyEvent.key === "Enter") send();
              }}
              placeholder="Say something…"
              className="h-9"
            />
            <Button size="icon-lg" onClick={send} className="shrink-0">
              <Send />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent
          value="activity"
          className="flex min-h-0 flex-col gap-3.5 overflow-y-auto px-4 py-3"
        >
          {EVENT_ACTIVITY_SEED.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <UserAvatar name={item.user} size={24} />
              <span className="min-w-0 flex-1 truncate text-sm">
                {item.user}{" "}
                <span className="text-faint">
                  predicted {item.side === "a" ? event.a : event.b}
                </span>
              </span>
              <span className="font-mono text-xs text-primary tabular-nums">
                {item.amount.toLocaleString()}
              </span>
              <span className="w-14 shrink-0 text-right text-xs text-faint">
                {item.t}
              </span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
