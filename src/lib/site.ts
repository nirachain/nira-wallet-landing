/** Where "Download" goes. Set NEXT_PUBLIC_DOWNLOAD_URL at build time (an APK
 *  or, later, the Play Store listing); until then it points at the download
 *  section of this page. */
export const DOWNLOAD_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "#download";

/** True once the download is a real file or listing, not this page. */
export const DOWNLOAD_READY = /^https?:\/\//.test(DOWNLOAD_URL);

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nirawallet.com";


/** Mainnets in the registry (nira-wallet/registry/data). */
export const CHAINS = ["Bitcoin", "Ethereum", "Solana", "Arbitrum One", "Optimism", "Polygon", "BNB Chain", "Avalanche"];
