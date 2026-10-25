"use client";
/**
 * Brand artwork from public/brand.
 *
 * - nira-tile.png: the gradient N tile. Reads on light and dark alike.
 * - nira-lockup.png: tile and "NIRA" side by side, for small headers.
 * - nira-wordmark(-stacked)(-light).png: "NIRA WALLET". The plain file has
 *   white "WALLET" letters for dark surfaces; `-light` has them in ink. Both
 *   are rendered and the theme tokens show the right one (`.on-dark` /
 *   `.on-light`), so a forced `data-theme` on an ancestor is respected.
 */

/** The Nira tile on its own. */
export const BrandMark = ({ size = 64, className = "" }: { size?: number; className?: string }) => (
  <img
    src="/brand/nira-tile.png"
    alt="Nira"
    draggable={false}
    width={size}
    height={size}
    className={`shrink-0 select-none ${className}`}
    style={{ width: size, height: size }}
  />
);

/** Tile and "NIRA", sized by height. */
export const BrandLockup = ({ height = 28, className = "" }: { height?: number; className?: string }) => (
  <img
    src="/brand/nira-lockup.png"
    alt="Nira"
    draggable={false}
    className={`shrink-0 select-none ${className}`}
    // The artwork is 228 × 67.
    style={{ height, width: Math.round((height * 228) / 67) }}
  />
);

/** "NIRA WALLET" lettering, sized by width. */
export const BrandWordmark = ({
  width = 200,
  stacked = false,
  className = "",
}: {
  width?: number;
  stacked?: boolean;
  className?: string;
}) => {
  const file = stacked ? "nira-wordmark-stacked" : "nira-wordmark";
  // Aspect ratios of the trimmed artwork.
  const height = Math.round(width * (stacked ? 482 / 1069 : 236 / 2066));
  return (
    <span role="img" aria-label="Nira Wallet" className={`inline-block shrink-0 ${className}`} style={{ width, height }}>
      <img src={`/brand/${file}.png`} alt="" draggable={false} className="on-dark size-full select-none" />
      <img src={`/brand/${file}-light.png`} alt="" draggable={false} className="on-light size-full select-none" />
    </span>
  );
};
