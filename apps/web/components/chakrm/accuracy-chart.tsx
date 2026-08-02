"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AccuracyPoint } from "@/lib/types";

type AccuracyChartProps = {
  data: AccuracyPoint[];
  /** Emerald on the dashboard, gold on the profile's smaller trend card. */
  color?: "primary" | "gold";
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
};

const CONFIG: ChartConfig = {
  acc: { label: "Accuracy" },
};

export function AccuracyChart({
  data,
  color = "primary",
  height = 200,
  showGrid = true,
  showTooltip = true,
}: AccuracyChartProps) {
  const stroke = color === "gold" ? "var(--gold)" : "var(--primary)";
  const gradientId = `accuracy-${color}`;

  return (
    <ChartContainer
      config={CONFIG}
      className="aspect-auto w-full"
      style={{ height }}
    >
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid stroke="var(--subtle)" vertical={false} />}
        <XAxis dataKey="d" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis hide domain={[40, 80]} />
        {showTooltip && (
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        )}
        <Area
          type="monotone"
          dataKey="acc"
          stroke={stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ChartContainer>
  );
}
