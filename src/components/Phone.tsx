"use client";

import { useEffect, useState, type ReactNode } from "react";

const W = 320;
const H = 660;

/** How much a phone must shrink to fit: the viewport's width less the page
 *  gutters, and with `fitHeight` its height less room for the top bar. */
const fitScale = (fitHeight: boolean) => {
  const vw = document.documentElement.clientWidth;
  // Large screens get a larger phone, so it keeps its weight beside the type.
  let k = Math.min(vw >= 1800 ? 1.22 : 1, (vw - (vw < 640 ? 32 : 64)) / W);
  if (fitHeight) k = Math.min(k, (window.innerHeight - 112) / H);
  return Math.max(0.55, k);
};

/**
 * A phone, drawn: the frame, a status bar, and the screen's content. The
 * screen is laid out at 320 × 660 like the app, then scaled as a whole to
 * fit small or short screens, so a demo never reflows or overflows.
 */
export function Phone({
  children,
  label,
  className = "",
  fitHeight = true,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  fitHeight?: boolean;
}) {
  const [s, setS] = useState(1);
  useEffect(() => {
    // Only a change of width re-measures: a phone's URL bar showing and
    // hiding changes the height on every scroll, and the demo must not jump.
    let width = 0;
    const measure = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      setS(fitScale(fitHeight));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [fitHeight]);

  return (
    <div className={`relative max-w-full shrink-0 ${className}`} style={{ width: W * s, height: H * s }}>
      <figure role="group" aria-label={label} className="phone absolute left-0 top-0 origin-top-left" style={{ transform: s === 1 ? undefined : `scale(${s})` }}>
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
    </div>
  );
}
