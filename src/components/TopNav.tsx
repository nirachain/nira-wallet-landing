"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { BrandMark, BrandWordmark } from "./wallet/Logo";
import { DownloadButton } from "./Download";
import { goTo } from "@/lib/nav";

export const LINKS = [
  { id: "features", label: "Features" },
  { id: "sign", label: "Security" },
  { id: "try", label: "Try it" },
  { id: "faq", label: "FAQ" },
];

/** Top bar: wordmark, four links, Get Nira. Clear over the hero, frosted once
 *  the page moves. On phones the links fold into a menu. */
export function TopNav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 16));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,box-shadow] duration-300 ${
          solid || open ? "bg-canvas/80 shadow-[inset_0_-1px_0_rgb(var(--line)/0.8)] backdrop-blur-xl" : ""
        }`}
      >
        <nav aria-label="Main" className="wrap flex h-[72px] items-center justify-between gap-6">
          <button type="button" onClick={() => goTo("top")} aria-label="Nira Wallet, back to top" className="flex items-center gap-2.5 rounded-full">
            <BrandMark size={32} className="rounded-[22%]" />
            <BrandWordmark width={118} className="nav-word" />
          </button>
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => goTo(l.id)}
                  className="relative rounded-full px-4 py-2 text-[15px] font-semibold text-ink/70 transition-colors duration-150 hover:text-ink [&:hover>span]:scale-x-100"
                >
                  {l.label}
                  <span aria-hidden className="slab absolute inset-x-4 bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-300 ease-out" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <DownloadButton size="sm" />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
              className="pressable grid size-11 place-items-center rounded-full bg-raised md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              id="menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="wrap overflow-hidden md:hidden"
            >
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      goTo(l.id);
                    }}
                    className="display flex h-14 w-full items-center text-[24px] font-extrabold tracking-[-0.04em] shadow-[inset_0_-1px_0_rgb(var(--line))]"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li className="h-4" aria-hidden />
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
