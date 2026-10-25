import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { DOWNLOAD_URL } from "@/lib/site";

/** The one primary action on the page: the mint pill, as in the app. */
export function DownloadButton({ size = "lg", className = "" }: { size?: "lg" | "sm"; className?: string }) {
  const big = size === "lg";
  return (
    <a
      href={DOWNLOAD_URL}
      style={{ "--press": 0.97 } as CSSProperties}
      className={`pressable group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-accent font-bold text-accent-ink hover:brightness-110 ${
        big ? "h-14 px-7 text-[16px]" : "h-10 px-4 text-[14px]"
      } ${className}`}
    >
      <span className={`relative grid place-items-center overflow-hidden rounded-full bg-accent-ink/10 ${big ? "size-7" : "size-6"}`} aria-hidden>
        {/* The arrow drops out and back in on hover: it is a download. */}
        <ArrowDown size={big ? 16 : 14} strokeWidth={2.6} className="transition-transform duration-300 ease-out group-hover:translate-y-[140%]" />
        <ArrowDown size={big ? 16 : 14} strokeWidth={2.6} className="absolute -translate-y-[140%] transition-transform duration-300 ease-out group-hover:translate-y-0" />
      </span>
      {big ? "Download for Android" : "Download"}
    </a>
  );
}
