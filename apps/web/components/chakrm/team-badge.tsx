import { teamInitials } from "@/lib/format";
import { TEAM_COLORS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type TeamBadgeProps = {
  name: string;
  size?: number;
  className?: string;
};

/**
 * Stylised monogram crest. Real team marks are trademarked, so each side gets
 * its own gradient from TEAM_COLORS with the initials on top.
 */
export function TeamBadge({ name, size = 36, className }: TeamBadgeProps) {
  const [from, to] = TEAM_COLORS[name] ?? ["#1E2A2A", "#2A3330"];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border font-mono font-bold tracking-tight text-[#F5F7F6] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        backgroundImage: `linear-gradient(150deg, ${from}, ${to})`,
      }}
    >
      {teamInitials(name)}
    </div>
  );
}
