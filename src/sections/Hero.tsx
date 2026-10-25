"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { GradientASCII } from "@/components/lazy";
import { BrandMark } from "@/components/wallet/Logo";
import { DownloadButton } from "@/components/Download";
import { Phone } from "@/components/Phone";
import { HomeScreen } from "@/components/screens/HomeScreen";

const EASE = [0.65, 0, 0.35, 1] as const;
const OUT = [0.23, 1, 0.32, 1] as const;
const COINS = ["btc", "eth", "sol", "arb", "pol", "bnb", "usdc", "usdt"];

/**
 * The opening, in one sequence: the tile is cut open along the N's diagonal
 * and a band of light crosses it (the app's splash), the headline rises line
 * by line, then the phone arrives. Behind it all, the glyph field from the
 * welcome screen; the pointer scrambles it, a click sends a burst.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // As the hero scrolls away the phone rises a little faster than the page
  // and the glyph field dims.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  // The phone leans toward the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-1, 1], [-7, 7]), { stiffness: 160, damping: 20 });
  const rotX = useSpring(useTransform(py, [-1, 1], [5, -5]), { stiffness: 160, damping: 20 });

  return (
    <section
      id="top"
      ref={ref}
      aria-label="Nira Wallet"
      className="relative isolate overflow-hidden pt-24 lg:pt-28"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_30%,transparent_95%)]"
        style={{ opacity: fieldOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <GradientASCII
          shape="horizon"
          cellSize={16}
          density={0.7}
          glyphOpacity={0.55}
          gradientOpacity={0.5}
          glow={0.15}
          grain={0.04}
          speed={0.5}
          scrambleRadius={140}
          clickEffect="wave"
        />
        {/* Keeps the text side quiet so the headline reads. */}
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_35%,rgb(5_8_12/0.92),rgb(5_8_12/0.55)_45%,transparent_75%)]" />
      </motion.div>

      <div className="wrap grid items-center gap-x-12 gap-y-14 pb-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-28">
        <div className="max-w-[720px]">
          <motion.div
            initial={{ clipPath: "polygon(-70% 0%, -70% 0%, -100% 100%, -100% 100%)", opacity: 0.4 }}
            animate={{ clipPath: "polygon(-70% 0%, 170% 0%, 200% 100%, -100% 100%)", opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="relative w-fit overflow-hidden rounded-[17%]"
          >
            <BrandMark size={64} />
            {(
              <motion.span
                aria-hidden
                className="absolute inset-y-[-40%] left-0 w-[40%] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ transform: "translateX(-160%) skewX(-33deg)" }}
                animate={{ transform: "translateX(360%) skewX(-33deg)" }}
                transition={{ duration: 0.65, delay: 0.55, ease: EASE }}
              />
            )}
          </motion.div>

          <h1 className="display mt-8 text-[clamp(40px,7.4vw,96px)] font-bold leading-[0.98] tracking-[-0.045em]">
            {["Nothing moves", "without you."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, delay: 0.55 + i * 0.12, ease: OUT }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: OUT }}
          >
            <p className="lede mt-7">
              Nira is a self-custody wallet for Bitcoin, Ethereum, Solana and the networks you add. Your keys stay on your phone, and every
              payment waits for your PIN or fingerprint.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <DownloadButton />
              <a href="#story" className="group inline-flex h-14 items-center gap-2 rounded-full px-2 text-[16px] font-bold text-accent-soft">
                See how it works
                <span aria-hidden className="block h-[2px] w-5 origin-left rounded-full bg-current transition-transform duration-300 ease-out group-hover:scale-x-150" />
              </a>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <span className="flex shrink-0 -space-x-2.5">
                {COINS.map((c, i) => (
                  <motion.img
                    key={c}
                    src={`/coins/${c}.png`}
                    alt=""
                    draggable={false}
                    className="size-8 rounded-full ring-[3px] ring-canvas"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.05 + i * 0.05, ease: OUT }}
                    whileHover={reduce ? undefined : { y: -6 }}
                  />
                ))}
              </span>
              <p className="max-w-[260px] text-[13px] font-semibold leading-snug text-mute">Eight networks built in, and any EVM network you add.</p>
            </div>
          </motion.div>
        </div>

        <motion.div className="mx-auto [perspective:1400px] lg:mx-0" style={{ y: phoneY }}>
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.75 }}
          >
            <motion.div style={{ rotateX: rotX, rotateY: rotY }}>
              <Phone label="Nira's Home screen with sample balances">
                <HomeScreen />
              </Phone>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
