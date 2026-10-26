"use client";

import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { Check, Fingerprint } from "lucide-react";
import { WordReveal } from "@/components/WordReveal";
import { GradientASCII } from "@/components/lazy";
import { Phone } from "@/components/Phone";
import { DownloadButton } from "@/components/Download";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { goTo } from "@/lib/nav";

const OUT = [0.23, 1, 0.32, 1] as const;
const WIPE = [0.65, 0, 0.35, 1] as const;

/** A card from the app floating over the slab. It leans with the pointer on
 *  a spring (deeper cards more) and rises in after the phone. */
function Float({ children, className, depth, mx, my, delay }: { children: ReactNode; className: string; depth: number; mx: MotionValue<number>; my: MotionValue<number>; delay: number }) {
  const x = useTransform(mx, (v) => v * depth * 22);
  const y = useTransform(my, (v) => v * depth * 16);
  return (
    <motion.div className={`absolute z-20 hidden sm:block ${className}`} style={{ x, y }}>
      <motion.div
        data-theme="dark"
        className="rounded-[22px] bg-surface text-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)] ring-1 ring-white/10"
        initial={{ opacity: 0, transform: "translateY(18px) scale(0.95)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={{ duration: 0.7, delay, ease: OUT }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * The opening. A huge headline on the left; on the right the slab, the logo's
 * gradient cut at the N's own diagonal, wipes in along that diagonal (the
 * app's splash), and the phone rises onto it. The phone runs the real Home
 * screen and leans toward the pointer.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });
  const rotY = useTransform(mx, [-1, 1], [-5, 5]);
  const rotX = useTransform(my, [-1, 1], [4, -4]);

  return (
    <section
      id="top"
      aria-label="Nira Wallet"
      className="relative overflow-hidden pt-[72px] lg:min-h-[100svh]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* The welcome screen's glyph field, faint, behind the headline. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_55%_60%_at_25%_45%,#000_10%,transparent_75%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.6, delay: 0.5 }}
      >
        <GradientASCII shape="horizon" cellSize={16} density={0.6} glyphOpacity={0.5} gradientOpacity={0.3} glow={0.1} grain={0.04} speed={0.4} scrambleRadius={140} clickEffect="wave" />
      </motion.div>

      {/* The slab. Wide screens: the right side, cut on the diagonal. */}
      <motion.div
        aria-hidden
        className="slab absolute bottom-0 right-0 top-0 hidden w-[56%] lg:block"
        initial={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 66% 100%)" }}
        animate={{ clipPath: "polygon(34% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        transition={{ duration: 0.9, ease: WIPE, delay: 0.15 }}
      >
        {/* A band of light crosses it once, the same way. */}
        <motion.span
          className="absolute inset-y-[-20%] left-0 w-[22%] bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ transform: "translateX(-60%) skewX(-30deg)" }}
          animate={{ transform: "translateX(520%) skewX(-30deg)" }}
          transition={{ duration: 1.1, delay: 0.75, ease: WIPE }}
        />
      </motion.div>

      <div className="wrap relative grid grid-cols-1 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div className="relative z-10 py-12 lg:py-16 lg:pr-8">
          <WordReveal as="h1" onMount delay={0.2} text="Hold anything. Control everything." lines={["Hold", "anything.", "Control", "everything."]} className="headline !text-[clamp(36px,10.5vw,56px)] sm:!text-[clamp(56px,7vw,72px)] lg:!text-[clamp(56px,5.6vw,92px)] min-[1800px]:!text-[112px]" />
          <motion.p
            className="mt-8 max-w-[30em] text-pretty text-[clamp(18px,1.5vw,21px)] font-medium leading-[1.5] text-mute"
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.6, delay: 0.75, ease: OUT }}
          >
            The self-custody wallet for Bitcoin, Ethereum, Solana and every network you add. Your keys stay on your phone, and nothing
            moves until you approve it.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.6, delay: 0.9, ease: OUT }}
          >
            <DownloadButton />
            <button type="button" onClick={() => goTo("features")} className="group flex h-[60px] items-center gap-2.5 text-[17px] font-bold text-accent-soft">
              See what it does
              <span aria-hidden className="block h-[2px] w-6 origin-left rounded-full bg-accent transition-transform duration-300 ease-out group-hover:scale-x-150" />
            </button>
          </motion.div>
        </div>

        {/* The phone on the slab. On phones the slab is a block under the text,
            its top edge on the same diagonal. */}
        <div className="relative -mx-4 h-[780px] sm:-mx-8 sm:h-[800px] lg:mx-0 lg:h-full">
          <div aria-hidden className="slab absolute inset-0 [clip-path:polygon(0_22%,100%_0,100%_100%,0_100%)] lg:hidden" />
          <motion.div
            className="absolute left-1/2 top-[55%] z-10 lg:left-[58%] lg:top-1/2"
            initial={{ opacity: 0, transform: "translate(-50%, -44%)" }}
            animate={{ opacity: 1, transform: "translate(-50%, -50%)" }}
            transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.55 }}
          >
            <div className="[perspective:1400px]" data-theme="dark">
              <motion.div style={{ rotateX: rotX, rotateY: rotY }}>
                <Phone label="Nira's Home screen with sample balances">
                  <HomeScreen />
                </Phone>
              </motion.div>
            </div>
          </motion.div>

          <Float className="left-[4%] top-[30%] max-sm:left-[3%] max-sm:top-[24%] lg:left-[6%] lg:top-[26%]" depth={1.3} mx={mx} my={my} delay={1.2}>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full bg-up/15 text-up">
                <Check size={18} strokeWidth={2.6} />
              </span>
              <span>
                <span className="block text-[13px] font-extrabold">Sent 0.25 ETH</span>
                <span className="block text-[11px] font-semibold text-mute">Approved with fingerprint</span>
              </span>
            </div>
          </Float>
          <Float className="bottom-[10%] right-[2%] max-sm:bottom-[6%] lg:bottom-[16%] lg:right-[-2%]" depth={-1.1} mx={mx} my={my} delay={1.35}>
            <div className="w-[214px] p-4">
              <p className="text-[11px] font-semibold text-mute">app.uniswap.org asks to sign</p>
              <p className="mt-1 text-[13px] font-extrabold">You pay 250 USDC</p>
              <p className="text-[13px] font-extrabold text-up">You get 0.0921 ETH</p>
              <span className="mt-3 flex h-9 items-center justify-center gap-2 rounded-full bg-accent text-[12px] font-bold text-accent-ink">
                <Fingerprint size={15} /> Approve
              </span>
            </div>
          </Float>
        </div>
      </div>
    </section>
  );
}
