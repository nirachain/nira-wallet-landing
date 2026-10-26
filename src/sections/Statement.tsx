"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const TEXT =
  "Your keys are made on your phone and never leave it. There is no account to break into and no server holding your crypto. Nothing moves until you say so.";

/** One word, lit as the reading line passes it. */
function Word({ w, i, n, progress }: { w: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const opacity = useTransform(progress, [start - 0.04, start + 0.04], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {w}{" "}
    </motion.span>
  );
}

/**
 * The promise, set large, lighting up word by word as it scrolls through
 * (a reading pace, tied to the scroll so it runs backwards too). Screen
 * readers get the sentence whole.
 */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TEXT.split(" ");
  return (
    <section aria-label="Our promise" className="py-20 lg:py-32">
      <div className="wrap">
        <p ref={ref} aria-label={TEXT} className="display max-w-[22ch] text-[clamp(32px,4.6vw,72px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-ink">
          <span aria-hidden>
            {words.map((w, i) => (
              <Word key={i} w={w} i={i} n={words.length} progress={scrollYProgress} />
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
