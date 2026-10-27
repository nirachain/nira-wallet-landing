import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nira Wallet: hold anything, control everything",
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          id="bis-skin-cleanup"
          dangerouslySetInnerHTML={{
            __html: `(function(){function c(n){if(n&&n.nodeType===1){if(n.hasAttribute('bis_skin_checked'))n.removeAttribute('bis_skin_checked');var els=n.querySelectorAll('[bis_skin_checked]');for(var i=0;i<els.length;i++)els[i].removeAttribute('bis_skin_checked');}}if(typeof document!=='undefined'){c(document.documentElement);var o=new MutationObserver(function(m){for(var i=0;i<m.length;i++){if(m[i].type==='attributes'&&m[i].attributeName==='bis_skin_checked'){m[i].target.removeAttribute('bis_skin_checked');}else if(m[i].type==='childList'){for(var j=0;j<m[i].addedNodes.length;j++)c(m[i].addedNodes[j]);}}});o.observe(document.documentElement,{attributes:true,childList:true,subtree:true,attributeFilter:['bis_skin_checked']});window.addEventListener('DOMContentLoaded',function(){c(document.documentElement);});window.addEventListener('load',function(){setTimeout(function(){o.disconnect();},3000);});}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
