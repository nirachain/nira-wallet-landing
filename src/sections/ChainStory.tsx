"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { WelcomeScene } from "@/components/lazy";

const STAGES = [
  {
    title: "Sealed on your phone",
    text: "No account and no server. Your recovery phrase is sealed with a key from the phone's own secure hardware, so only this phone can open it.",
  },
  {
    title: "Every chain, one wallet",
    text: "Bitcoin, Ethereum and Solana side by side with Arbitrum, Optimism, Polygon, BNB Chain and Avalanche. Add any EVM network, checked before it is saved.",
  },
  {
    title: "Locked until you approve",
    text: "Sending, swapping and signing for a site each wait for your PIN or fingerprint, for that exact action. Tap the lock to approve one.",
  },
];

/** One caption, in while the scene is on its stage and out either side. */
const Caption = ({ i, position }: { i: number; position: MotionValue<number> }) => {
  // Out before the next comes in, so two captions never overlap.
  const at = [i - 0.5, i - 0.3, i + 0.3, i + 0.5];
  const opacity = useTransform(position, at, i === 0 ? [1, 1, 1, 0] : i === 2 ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(position, at, i === 0 ? [0, 0, 0, -28] : i === 2 ? [28, 0, 0, 0] : [28, 0, 0, -28]);
  const s = STAGES[i];
  return (
    <motion.div className="absolute inset-x-0 top-0" style={{ opacity, y }} aria-hidden>
      <h3 className="title !text-[clamp(28px,5.2vw,60px)] short:!text-[28px]">{s.title}</h3>
      <p className="lede mt-3 !text-[15px] sm:mt-5 sm:!text-[17px] lg:!text-[19px] short:!text-[14px]">{s.text}</p>
    </motion.div>
  );
};

/** A slanted bar of the progress rail, filling as its stage is reached. */
const Bar = ({ i, position }: { i: number; position: MotionValue<number> }) => {
  const scaleX = useTransform(position, [i - 1, i], [0, 1]);
  return (
    <span className="h-1.5 flex-1 -skew-x-[30deg] overflow-hidden rounded-[2px] bg-raised">
      <motion.span className="brand-fill block h-full origin-left" style={{ scaleX }} />
    </span>
  );
};

/**
 * The page's one big moment: the app's welcome scene, played by scrolling.
 * The section is tall and the stage sticks; scroll runs the scene from the
 * glyph ring, to the coins on a turning chain, to the padlock, and back.
 */
export function ChainStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const position = useTransform(scrollYProgress, [0.04, 0.72], [0, 2], { clamp: true });

  return (
    <section id="story" ref={ref} aria-label="How Nira keeps your wallet" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="wrap grid grid-cols-1 h-full grid-rows-[minmax(0,1.15fr)_auto] items-center gap-4 pb-8 pt-20 lg:grid-cols-2 lg:grid-rows-1 lg:gap-16 lg:py-0 short:grid-cols-2 short:grid-rows-1 short:gap-8 short:pb-4 short:pt-16">
          <div className="order-2 lg:order-1 short:order-1">
            <div role="img" aria-label="Three stages" className="flex w-[148px] gap-1.5">
              {STAGES.map((_, i) => (
                <Bar key={i} i={i} position={position} />
              ))}
            </div>
            {/* Captions stack in one spot and cross over as the scene moves. */}
            <div className="relative mt-5 sm:mt-8 min-h-[190px] sm:min-h-[240px] short:min-h-[170px]">
              {STAGES.map((_, i) => (
                <Caption key={i} i={i} position={position} />
              ))}
            </div>
            <ol className="sr-only">
              {STAGES.map((s) => (
                <li key={s.title}>
                  {s.title}. {s.text}
                </li>
              ))}
            </ol>
          </div>
          <div className="order-1 h-full min-h-0 short:order-2 lg:order-2 lg:h-[min(76svh,680px)] min-[1800px]:h-[min(76svh,880px)]">
            <WelcomeScene position={position} />
          </div>
        </div>
      </div>
    </section>
  );
}
