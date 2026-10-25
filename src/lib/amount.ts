/** Applies one keypad key to an amount string, keeping it a plain decimal:
 *  one point, no leading zeros, at most `decimals` places. "back" deletes. */
export function typeKey(value: string, key: string, decimals = 18): string {
  if (key === "back") return value.slice(0, -1);
  if (key === ".") return decimals === 0 || value.includes(".") ? value : (value || "0") + ".";
  const next = value === "0" ? key : value + key;
  const [, frac = ""] = next.split(".");
  return frac.length > decimals ? value : next;
}

/** A share of a balance in base units, for the 25% / 50% chips. Integer
 *  math, so no float ever touches the amount. */
export function shareOf(baseUnits: bigint, percent: number): bigint {
  return (baseUnits * BigInt(Math.round(percent * 10000))) / 10000n;
}
