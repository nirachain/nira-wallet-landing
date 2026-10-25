"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { BrandLockup } from "@/components/wallet/Logo";
import { DownloadButton } from "@/components/Download";
import { NAV } from "@/lib/site";

/** Top bar. Clear over the hero; once the page moves it takes a backdrop.
 *  It steps out of the way while you read down and comes back when you
 *  scroll up. */
export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [away, setAway] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setAway(y > 480 && y > prev + 2 ? true : y < prev - 2 ? false : away);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: away ? "-110%" : "0%" }}
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`transition-[background-color,box-shadow] duration-300 ${
          solid ? "bg-canvas/80 shadow-[inset_0_-1px_0_rgb(var(--line)/0.6)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="wrap flex h-16 items-center justify-between gap-6">
          <a href="#top" aria-label="Nira Wallet, back to top" className="rounded-full">
            <BrandLockup height={26} />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative rounded-full px-3.5 py-2 text-[14px] font-bold text-mute transition-colors hover:text-ink [&:hover>span]:scale-x-100"
                >
                  {l.label}
                  <span aria-hidden className="brand-fill absolute inset-x-3.5 bottom-1 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-300 ease-out" />
                </a>
              </li>
            ))}
          </ul>
          <DownloadButton size="sm" />
        </nav>
      </div>
    </motion.header>
  );
}
