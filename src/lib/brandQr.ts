import QRCode from "qrcode";

/**
 * The shapes of a QR code drawn in Nira's style: soft rounded dots, rounded finder
 * squares, and a clear space in the middle for the mark. Pure, so the same
 * geometry is drawn by `BrandQr` and decoded by `brandQr.check.ts`.
 *
 * Error correction is H (about 30% of the code can be lost and still read),
 * so the mark's space, a few percent of it, costs nothing in reliability.
 */
export type QrShapes = {
  /** Modules per side. */
  size: number;
  /** Data modules, as [column, row]. */
  dots: [number, number][];
  /** Top-left corner of each 7x7 finder pattern. */
  finders: [number, number][];
  /** The cleared middle square, in modules. */
  logo: { at: number; size: number };
};

/** Share of the side cleared for the mark. Kept small: under a quarter of
 *  the width is a few percent of the area, far inside what H recovers. */
const LOGO_SHARE = 0.22;

export function qrShapes(payload: string): QrShapes {
  const qr = QRCode.create(payload, { errorCorrectionLevel: "H" });
  const size = qr.modules.size;
  const finders: [number, number][] = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  const inFinder = (x: number, y: number) => finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  // An odd number of modules, so the space sits on the centre module.
  let logoSize = Math.round(size * LOGO_SHARE);
  if (logoSize % 2 !== size % 2) logoSize += 1;
  const logoAt = (size - logoSize) / 2;
  const inLogo = (x: number, y: number) => x >= logoAt && x < logoAt + logoSize && y >= logoAt && y < logoAt + logoSize;

  const dots: [number, number][] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (qr.modules.get(y, x) && !inFinder(x, y) && !inLogo(x, y)) dots.push([x, y]);
    }
  }
  return { size, dots, finders, logo: { at: logoAt, size: logoSize } };
}

/**
 * A data dot: a rounded square `DOT_HALF` from its centre each way, corners
 * rounded by `DOT_CORNER`, all in modules. Round dots read as a style but not
 * as a code: jsQR, a strict decoder and the wallet's own, failed on them at
 * every size tried. This shape, with a hairline between neighbours, decodes
 * at all of them (`brandQr.check.ts`). Do not shrink it to look lighter.
 */
export const DOT_HALF = 0.46;
export const DOT_CORNER = 0.18;

