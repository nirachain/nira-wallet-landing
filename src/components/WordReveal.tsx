"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";

/**
 * A headline that rises word by word through a mask, once, as it comes into
 * view: 40ms between words, a strong ease-out. `lines` sets where it breaks
 * on wide screens (each line still wraps on narrow ones). Screen readers get
 * the plain text. Under reduced motion it is simply there.
 */
export function WordReveal({
  text,
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  onMount = false,
}: {
  text: string;
  lines?: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Play on load instead of on scroll (the hero). */
  onMount?: boolean;
}) {
  const rows = (lines ?? [text]).map((l) => l.split(" "));
  const play = { y: "0%" };
  let n = 0;
  return (
    <Tag className={className} aria-label={lines ? lines.join(" ") : text}>
      {rows.map((words, r) => (
        <span key={r} aria-hidden className={lines ? "block" : undefined}>
          {words.map((w, i) => {
            const at = n++;
            return [
              i > 0 ? " " : null,
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-top [margin-bottom:-0.1em]">
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ y: "105%" }}
                  {...(onMount ? { animate: play } : { whileInView: play, viewport: { once: true, margin: "0px 0px -12% 0px" } })}
                  transition={{ duration: 0.8, delay: delay + at * 0.04, ease: [0.23, 1, 0.32, 1] }}
                >
                  {w}
                </motion.span>
              </span>,
            ];
          })}
        </span>
      ))}
    </Tag>
  );
}
