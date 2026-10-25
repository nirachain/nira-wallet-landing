"use client";

import type { ReactNode } from "react";

/** A phone, drawn: the frame, a status bar, and the screen's content.
 *  Fixed at 320 × 660 so the demos lay out exactly like the app does. */
export function Phone({ children, label, className = "" }: { children: ReactNode; label: string; className?: string }) {
  return (
    <figure role="group" aria-label={label} className={`phone shrink-0 ${className}`}>
      <div aria-hidden className="relative z-30 flex h-10 items-center justify-between px-7 pt-1 text-[12px] font-bold text-ink">
        <span className="tabular">9:41</span>
        <span className="absolute left-1/2 top-2.5 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
        <span className="flex items-center gap-1">
          <span className="flex items-end gap-[2px]">
            {[4, 6, 8, 10].map((h) => (
              <span key={h} className="w-[3px] rounded-[1px] bg-ink" style={{ height: h }} />
            ))}
          </span>
          <span className="ml-1 h-[10px] w-[20px] rounded-[3px] p-[1.5px] ring-1 ring-ink/60">
            <span className="block h-full w-[70%] rounded-[1.5px] bg-ink" />
          </span>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-10">{children}</div>
    </figure>
  );
}
