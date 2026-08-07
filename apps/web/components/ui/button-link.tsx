import Link from "next/link";

import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

type ButtonLinkProps = Omit<ButtonProps, "render" | "nativeButton"> & {
  href: string;
  /** Set for links that leave the app (OAuth), where the client router can't follow. */
  external?: boolean;
};

/**
 * A button that navigates.
 *
 * Base UI's Button assumes it renders a native <button> and warns when `render`
 * swaps in something else, because an <a> loses button semantics for forms and
 * assistive tech. Passing `nativeButton={false}` is the documented answer;
 * doing it here means no call site has to remember, and none can forget.
 */
export function ButtonLink({
  href,
  external = false,
  ...props
}: ButtonLinkProps) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={external ? <a href={href} /> : <Link href={href} />}
    />
  );
}
