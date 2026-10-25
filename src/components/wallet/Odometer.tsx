"use client";
/**
 * Text whose digits roll like a mechanical counter when it changes. Each
 * digit is a column 0-9 moved to show its value, so a change animates only
 * the digits that moved, each its own distance. Non-digits sit still.
 *
 * Positions are keyed from the right, so "9.99" becoming "10.00" rolls the
 * cents and adds a column on the left instead of reshuffling everything.
 */
export const Odometer = ({ text, className = "" }: { text: string; className?: string }) => {
  const chars = [...text];
  return (
    <span role="text" aria-label={text} className={`tabular inline-flex items-baseline ${className}`}>
      {chars.map((c, i) => {
        const key = chars.length - i;
        return /\d/.test(c) ? <Digit key={`d${key}`} value={Number(c)} /> : (
          <span key={`s${key}`} aria-hidden>
            {c}
          </span>
        );
      })}
    </span>
  );
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Digit({ value }: { value: number }) {
  return (
    <span aria-hidden className="relative inline-block h-[1.08em] overflow-hidden leading-[1.08] [vertical-align:-0.14em]">
      <span
        className="block transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${-value * 1.08}em)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1.08em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}
