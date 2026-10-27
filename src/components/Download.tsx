import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { DOWNLOAD_URL } from "@/lib/site";

/**
 * Get Nira: the page's one action, the app's mint pill (white on the slab).
 * The arrow drops out and back in on hover: it is a download. Presses in.
 */
export function DownloadButton({
  size = "lg",
  tone = "mint",
  label,
  className = "",
}: {
  size?: "lg" | "sm";
  tone?: "mint" | "light";
  label?: string;
  className?: string;
}) {
  const big = size === "lg";
  const isApk = DOWNLOAD_URL.endsWith(".apk");
  return (
    <a
      href={DOWNLOAD_URL}
      {...(isApk ? { download: "" } : {})}
      rel="noopener noreferrer"
      style={{ "--press": 0.97 } as CSSProperties}
      className={`pressable group inline-flex shrink-0 items-center justify-center gap-3 rounded-full font-bold ${
        tone === "mint" ? "bg-accent text-accent-ink hover:brightness-110" : "bg-white text-[#06101C]"
      } ${big ? "h-[60px] pl-7 pr-2.5 text-[17px]" : "h-11 pl-5 pr-1.5 text-[14px]"} ${className}`}
    >
      {label ?? (big ? "Get Nira for Android" : "Get Nira")}
      <span className={`relative grid place-items-center overflow-hidden rounded-full ${tone === "mint" ? "bg-accent-ink text-accent" : "bg-accent text-accent-ink"} ${big ? "size-11" : "size-8"}`} aria-hidden>
        <ArrowDown size={big ? 18 : 15} strokeWidth={2.6} className="transition-transform duration-300 ease-out group-hover:translate-y-[150%]" />
        <ArrowDown size={big ? 18 : 15} strokeWidth={2.6} className="absolute -translate-y-[150%] transition-transform duration-300 ease-out group-hover:translate-y-0" />
      </span>
    </a>
  );
}
