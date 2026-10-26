"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";

/**
 * Motion follows "reduce motion" (movement jumps, fades stay). Lenis smooths
 * wheel scrolling on desktop; touch keeps native scrolling, and it is off
 * entirely under reduced motion.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;
    const lenis = new Lenis({ lerp: 0.12 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
