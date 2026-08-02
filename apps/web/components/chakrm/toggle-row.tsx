"use client";

import type { LucideIcon } from "lucide-react";

import { Switch } from "@/components/ui/switch";

type ToggleRowProps = {
  icon: LucideIcon;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** Icon + label + description + switch. The whole of Settings is built on it. */
export function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: ToggleRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-subtle">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="mt-0.5 text-xs text-faint">{description}</div>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
