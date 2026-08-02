"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { VolumePoint } from "@/lib/types";

const CONFIG: ChartConfig = {
  v: { label: "Volume" },
};

export function VolumeChart({ data }: { data: VolumePoint[] }) {
  return (
    <ChartContainer config={CONFIG} className="aspect-auto w-full" style={{ height: 200 }}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="admin-volume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--subtle)" vertical={false} />
        <XAxis dataKey="d" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          type="monotone"
          dataKey="v"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#admin-volume)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
