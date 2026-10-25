"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Under "reduce motion", Motion jumps movement to its end and keeps fades,
 *  so the page renders the same on server and client either way. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
