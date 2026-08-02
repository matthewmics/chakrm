import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { userInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  size?: number;
  /** Gold ring, used to mark the leaderboard leader and the profile owner. */
  ring?: boolean;
  className?: string;
};

/**
 * Avatars are initials-only for now — there are no uploaded images yet — over
 * the emerald-to-gold gradient the design uses as the default fill.
 */
export function UserAvatar({
  name,
  size = 32,
  ring = false,
  className,
}: UserAvatarProps) {
  return (
    <Avatar
      className={cn(
        "after:border-border",
        ring && "after:border-2 after:border-gold",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <AvatarFallback
        className="bg-linear-135 from-primary-soft to-gold-soft font-semibold text-foreground"
        style={{ fontSize: size * 0.36 }}
      >
        {userInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
