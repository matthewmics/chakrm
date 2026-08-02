import { cn } from "@/lib/utils";
import { formatCredits, signedCredits } from "@/lib/format";

type CreditsProps = {
  amount: number;
  /** Prefix positive amounts with "+" and colour by sign. */
  signed?: boolean;
  /** Force a colour instead of deriving it from the sign. */
  tone?: "default" | "primary" | "gold" | "muted" | "faint";
  className?: string;
};

const TONE_CLASS = {
  default: "text-foreground",
  primary: "text-primary",
  gold: "text-gold",
  muted: "text-muted-foreground",
  faint: "text-faint",
} as const;

/**
 * Credit amounts are always mono + tabular so columns of numbers line up.
 * With `signed`, gains read emerald and losses read destructive.
 */
export function Credits({
  amount,
  signed = false,
  tone,
  className,
}: CreditsProps) {
  const signTone = amount < 0 ? "text-destructive" : "text-primary";

  return (
    <span
      className={cn(
        "font-mono tabular-nums",
        tone ? TONE_CLASS[tone] : signed ? signTone : TONE_CLASS.default,
        className,
      )}
    >
      {signed ? signedCredits(amount) : formatCredits(amount)}
    </span>
  );
}
