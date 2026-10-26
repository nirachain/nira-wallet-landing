"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownUp, Check, SlidersHorizontal } from "lucide-react";
import { Button, IconButton, haptic, press } from "../wallet/ui";
import { TabBar } from "../TabBar";

type Side = { amount: string; symbol: string; icon: string; chain: string };
const PAY: Side = { amount: "250", symbol: "USDC", icon: "usdc", chain: "Arbitrum One" };
const GET: Side = { amount: "0.0921", symbol: "ETH", icon: "eth", chain: "Optimism" };

const Slab = ({ label, side }: { label: string; side: Side }) => (
  <div className="rounded-[26px] bg-surface p-4 ring-1 ring-line/50">
    <p className="text-[12px] font-semibold text-mute">{label}</p>
    <div className="mt-2 flex items-center justify-between gap-3">
      <span className="display tabular truncate text-[30px] font-bold leading-none">{side.amount}</span>
      <span className="flex shrink-0 items-center gap-2 rounded-full bg-raised py-1 pl-1 pr-3">
        <img src={`/coins/${side.icon}.png`} alt="" className="size-7 rounded-full" draggable={false} />
        <span className="text-[14px] font-extrabold">{side.symbol}</span>
      </span>
    </div>
    <p className="mt-2 text-[12px] font-semibold text-faint">on {side.chain}</p>
  </div>
);

/** Swap: two slabs that trade places, a route from LI.FI, and the checks
 *  Nira runs before anything is signed. */
export function SwapScreen({ bar = true }: { bar?: boolean }) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [top, bottom] = flipped ? [GET, PAY] : [PAY, GET];
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 30 };

  return (
    <div className="relative h-full px-5">
      <header className="flex h-12 items-center justify-between">
        <h3 className="display text-[22px] font-bold">Swap</h3>
        <IconButton label="Swap settings" className="!size-10">
          <SlidersHorizontal size={17} />
        </IconButton>
      </header>

      <div className="relative mt-3 flex flex-col gap-2">
        <motion.div layout transition={spring} key={top.symbol}>
          <Slab label="You pay" side={top} />
        </motion.div>
        <motion.div layout transition={spring} key={bottom.symbol}>
          <Slab label="You get, at least" side={bottom} />
        </motion.div>
        <motion.button
          type="button"
          aria-label="Swap direction"
          onClick={() => {
            haptic();
            setFlipped((f) => !f);
          }}
          animate={{ rotate: flipped ? 180 : 0 }}
          transition={spring}
          style={press(0.92)}
          className="pressable absolute left-1/2 top-1/2 z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-raised text-ink ring-4 ring-canvas hover:text-accent-soft"
        >
          <ArrowDownUp size={18} />
        </motion.button>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5 px-1 text-[12px]">
        {[
          ["Route", "LI.FI, one transaction"],
          ["Approval", `Exact amount only`],
          ["Simulation", "Expected to succeed"],
        ].map(([k, v]) => (
          <li key={k} className="flex items-center justify-between">
            <span className="font-semibold text-mute">{k}</span>
            <span className="flex items-center gap-1.5 font-bold text-ink">
              {k === "Simulation" && <Check size={14} className="text-up" aria-hidden />}
              {v}
            </span>
          </li>
        ))}
      </ul>

      <Button className="mt-5 w-full" size="md">
        Review swap
      </Button>

      {bar && <TabBar active={1} />}
    </div>
  );
}
