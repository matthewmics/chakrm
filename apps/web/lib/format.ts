/** Thousands-separated Credits, e.g. 12480 -> "12,480". */
export function formatCredits(amount: number): string {
  return amount.toLocaleString("en-US");
}

/** Credits with an explicit sign, e.g. 1240 -> "+1,240". */
export function signedCredits(amount: number): string {
  return `${amount > 0 ? "+" : ""}${formatCredits(amount)}`;
}

/** Initials for a username: "north_bynum" -> "NB", "vera.codes" -> "VC". */
export function userInitials(name: string): string {
  return name
    .split(/[._\s-]/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Monogram for a team crest: "Man City" -> "MC", "49ers" -> "4". */
export function teamInitials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
