import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nira Wallet: self-custody for Bitcoin, Ethereum and Solana",
  description:
    "Nira keeps your keys on your phone. Send, swap and use apps on Bitcoin, Ethereum, Solana and more, and approve every payment with your PIN or fingerprint.",
  icons: { icon: "/brand/nira-tile-64.png", apple: "/brand/nira-tile.png" },
  openGraph: {
    title: "Nira Wallet",
    description: "Your keys stay on your phone. Nothing moves without you.",
    images: ["/brand/nira-wordmark.png"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#05080C", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
