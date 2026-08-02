import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: string;
  /** Stacks the value above the label and centres it — used for countdowns. */
  align?: "start" | "center";
  className?: string;
};

/** Small bordered tile over the elevated surface: a mono value and a caption. */
export function StatTile({
  label,
  value,
  align = "start",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-elevated px-3 py-2.5",
        align === "center" && "flex flex-col items-center gap-1 px-4",
        className,
      )}
    >
      {align === "center" ? (
        <>
          <span className="font-mono text-xl font-semibold tabular-nums">
            {value}
          </span>
          <span className="text-[10px] font-medium tracking-wide text-faint uppercase">
            {label}
          </span>
        </>
      ) : (
        <>
          <div className="text-[11px] text-faint">{label}</div>
          <div className="font-mono text-base font-semibold tabular-nums">
            {value}
          </div>
        </>
      )}
    </div>
  );
}
