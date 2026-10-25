"use client";
import { useId } from "react";

/**
 * Artwork for the avatars, like the logo's: fixed gradient pairs, all in the
 * logo's range (blue, teal, mint), with white marks on
 * top. Fixed colours rather than theme tokens, as for any artwork.
 */
const GRADIENTS: [string, string][] = [
  ["#1359A8", "#1BEC8A"],
  ["#06101C", "#1359A8"],
  ["#128AA3", "#1BEC8A"],
  ["#1359A8", "#128AA3"],
  ["#0B3A70", "#15A8A0"],
  ["#0E6E8C", "#7CF5C0"],
  ["#1D4ED8", "#22D3EE"],
  ["#0F766E", "#A3F7BF"],
];

/** FNV-1a: the same id always gives the same number. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** The avatar's pattern for a wallet id: a gradient and a 5×5 grid mirrored
 *  left to right, so the 15 cells that decide it give 32,768 patterns. */
export function avatarFor(id: string) {
  let state = hash(id) || 1;
  // xorshift32: more bits from the one hash.
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };
  const gradient = GRADIENTS[next() % GRADIENTS.length];
  const angle = next() % 4;
  const cells: [number, number][] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      if (next() % 2) {
        cells.push([row, col]);
        if (col < 2) cells.push([row, 4 - col]);
      }
    }
  }
  // A near-empty grid reads as no pattern at all.
  if (cells.length < 5) cells.push([1, 2], [2, 2], [3, 2]);
  return { gradient, angle, cells };
}

/**
 * A wallet's avatar, drawn from its id: random-looking, but the same wallet
 * always gets the same one, and nothing about it can be changed. Tells
 * wallets apart at a glance where names alone might match.
 */
export const WalletAvatar = ({ id, size = 44, className = "rounded-full" }: { id: string; size?: number; className?: string }) => {
  const gradientId = useId();
  const { gradient, angle, cells } = avatarFor(id);
  const [x2, y2] = [[1, 1], [1, 0], [0, 1], [0, 0]][angle];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 7 7"
      aria-hidden
      className={`shrink-0 overflow-hidden ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1={1 - x2} y1={1 - y2} x2={x2} y2={y2}>
          <stop offset="0" stopColor={gradient[0]} />
          <stop offset="1" stopColor={gradient[1]} />
        </linearGradient>
      </defs>
      <rect width="7" height="7" fill={`url(#${gradientId})`} />
      {cells.map(([row, col]) => (
        <rect key={`${row}-${col}`} x={col + 1} y={row + 1} width="1" height="1" fill="#fff" fillOpacity="0.92" />
      ))}
    </svg>
  );
};

