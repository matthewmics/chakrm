import type { Market, MarketOption, MarketStatus, SportEvent } from "./types";

// There is no rake or commission anywhere in this domain: a market's credit
// pool redistributes in full to whoever predicted the winning option. Payouts
// below are therefore a straight share of the whole pool.

/** Decimal odds implied by a side's current share of the pool. */
export function decimalOdds(sharePercent: number): string {
  if (!sharePercent) return "-";
  return (100 / sharePercent).toFixed(2);
}

/** Credits committed to each side, derived from the pool split. */
export function poolSplit(event: SportEvent) {
  const poolA = Math.round(event.pool * (event.retA / 100));
  return { poolA, poolB: event.pool - poolA };
}

/**
 * Pari-mutuel payout: the stake's share of the winning side after it joins,
 * applied to the whole pool. Both pools grow as more Credits come in, so this
 * is an estimate until the pool closes.
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
  const distributable = poolA + poolB + amt;
  const payout = (amt / sidePoolAfter) * distributable;

  return { payout, profit: payout - amt };
}

/** Credits committed across every option of a market. */
export function marketPool(market: Market): number {
  return market.options.reduce((sum, option) => sum + option.totalCredits, 0);
}

/** An option's share of its market's pool, as a percentage. */
export function optionShare(option: MarketOption, market: Market): number {
  const pool = marketPool(market);
  if (!pool) return 0;
  return (option.totalCredits / pool) * 100;
}

/** Only `open` and `live` markets accept new predictions. */
export function isMarketPredictable(status: MarketStatus): boolean {
  return status === "open" || status === "live";
}

/**
 * Pari-mutuel payout generalised to a market with any number of options: the
 * stake's share of the chosen option's pool after it joins, applied to the
 * whole market pool.
 */
export function estimateOptionPayout(
  amount: number | string,
  option: MarketOption | null,
  market: Market | null,
) {
  const amt = Number(amount) || 0;
  if (!option || !market || amt <= 0) return { payout: 0, profit: 0 };

  const optionPoolAfter = option.totalCredits + amt;
  const distributable = marketPool(market) + amt;
  const payout = (amt / optionPoolAfter) * distributable;

  return { payout, profit: payout - amt };
}
