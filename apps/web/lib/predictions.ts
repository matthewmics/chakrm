import type { SportEvent } from "./types";

/** Platform cut taken off the pool before rewards are distributed. */
export const FEE_RATE = 0.05;

/**
 * Decimal odds implied by a side's current share of the pool, with the
 * platform fee baked in so the number matches the payout estimate.
 */
export function decimalOdds(sharePercent: number): string {
  if (!sharePercent) return "-";
  return ((100 * (1 - FEE_RATE)) / sharePercent).toFixed(2);
}

/** Credits committed to each side, derived from the pool split. */
export function poolSplit(event: SportEvent) {
  const poolA = Math.round(event.pool * (event.retA / 100));
  return { poolA, poolB: event.pool - poolA };
}

/**
 * Pari-mutuel payout: the stake's share of the winning side after it joins,
 * applied to the whole pool less the fee. Both pools grow as more Credits come
 * in, so this is an estimate until the pool closes.
 */
export function estimatePayout(
  amount: number | string,
  side: "a" | "b" | null,
  poolA: number,
  poolB: number,
) {
  const amt = Number(amount) || 0;
  if (!side || amt <= 0) return { payout: 0, profit: 0 };

  const sidePoolAfter = (side === "a" ? poolA : poolB) + amt;
  const distributable = (poolA + poolB + amt) * (1 - FEE_RATE);
  const payout = (amt / sidePoolAfter) * distributable;

  return { payout, profit: payout - amt };
}
