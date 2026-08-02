import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { userInitials } from "@/lib/format";

type UserAvatarProps = {
  name: string;
  size?: number;
  className?: string;
};

/** Initials-only avatar over the gold-to-emerald gradient the admin console uses. */
export function UserAvatar({ name, size = 32, className }: UserAvatarProps) {
  return (
    <Avatar className={className} style={{ width: size, height: size }}>
      <AvatarFallback
        className="bg-linear-135 from-gold-soft to-primary-soft font-semibold text-foreground"
        style={{ fontSize: size * 0.36 }}
      >
        {userInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
