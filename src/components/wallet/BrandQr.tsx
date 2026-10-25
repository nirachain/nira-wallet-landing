"use client";
import { useId, useMemo } from "react";
import { DOT_CORNER, DOT_HALF, qrShapes } from "@/lib/brandQr";

/**
 * A QR code in Nira's style: soft rounded dots from near-black into the logo's blue, rounded
 * finder squares, and the mark in the middle. Drawn on white by its parent.
 *
 * Only the dark half of the brand gradient is used. Scanners need dark marks
 * on a light ground, and the teal and mint end is too light to read reliably; the
 * same reason it is kept away from text. `brandQr.check.ts` decodes this
 * geometry with jsQR, so a style change that stops it scanning fails there.
 */
export const BrandQr = ({ value, label }: { value: string; label: string }) => {
  const id = useId();
  const { size, dots, finders, logo } = useMemo(() => qrShapes(value), [value]);
  const gradient = `${id}-dots`;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} className="size-full">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#06101C" />
          <stop offset="1" stopColor="#1359A8" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradient})`}>
        {dots.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x + 0.5 - DOT_HALF}
            y={y + 0.5 - DOT_HALF}
            width={DOT_HALF * 2}
            height={DOT_HALF * 2}
            rx={DOT_CORNER}
          />
        ))}
      </g>
      {finders.map(([x, y]) => (
        <g key={`${x}-${y}`} fill="#06101C">
          {/* A 7x7 ring one module thick, and the 3x3 eye inside it. */}
          <path
            fillRule="evenodd"
            d={`${roundedRect(x, y, 7, 7, 2)} ${roundedRect(x + 1, y + 1, 5, 5, 1.3)}`}
          />
          <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} />
        </g>
      ))}
      <rect x={logo.at} y={logo.at} width={logo.size} height={logo.size} rx={logo.size * 0.22} fill="#fff" />
      <image
        href="/brand/nira-tile.png"
        x={logo.at + logo.size * 0.14}
        y={logo.at + logo.size * 0.14}
        width={logo.size * 0.72}
        height={logo.size * 0.72}
      />
    </svg>
  );
};

/** A rounded rectangle as path data, for cutting one out of another. */
function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x},${y + h - r}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}Z`;
}

