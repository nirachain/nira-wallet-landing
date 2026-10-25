"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { Button, StatusMark, Tag, haptic } from "../wallet/ui";

const EFFECTS = [
  { icon: "usdc", text: "250 USDC", sign: "−", tone: "text-down" },
  { icon: "eth", text: "0.0921 ETH", sign: "+", tone: "text-up" },
];

/** A site asks to sign. Nira shows what the simulation says happens to the
 *  wallet, not the raw calldata, and waits for a fingerprint. `active`
 *  raises the sheet, so it plays when the step is reached. */
export function ApproveScreen({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"ask" | "scan" | "done">("ask");

  useEffect(() => {
    if (!active) setPhase("ask");
  }, [active]);

  const approve = () => {
    haptic(12);
    setPhase("scan");
    window.setTimeout(() => setPhase("done"), reduce ? 0 : 900);
    window.setTimeout(() => setPhase("ask"), 3200);
  };

  return (
    <div className="relative h-full">
      {/* The site, behind: the in-app browser's bar and a quiet page. */}
      <div className="px-4">
        <div className="flex h-10 items-center gap-2 rounded-full bg-surface px-3 text-[12px] ring-1 ring-line/60">
          <Lock size={13} className="text-up" aria-hidden />
          <span className="flex-1 truncate font-bold text-ink">app.uniswap.org</span>
          <Tag tone="accent" className="!h-5 !px-2 !text-[10px]">
            <ShieldCheck size={11} aria-hidden /> Verified
          </Tag>
        </div>
        <div aria-hidden className="mt-5 flex flex-col gap-3 opacity-40">
          <span className="h-24 rounded-[22px] bg-raised" />
          <span className="h-24 rounded-[22px] bg-raised" />
          <span className="mx-auto h-10 w-40 rounded-full bg-raised" />
        </div>
      </div>
      <span aria-hidden className="absolute inset-0 bg-black/50" />

      <motion.div
        initial={false}
        animate={{ y: active ? 0 : "105%" }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 34 }}
        className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-surface px-5 pb-6 pt-3 shadow-sheet"
      >
        <span aria-hidden className="mx-auto block h-1 w-9 rounded-full bg-line" />
        {phase === "done" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="scale-[0.7]">
              <StatusMark status="success" />
            </div>
            <p className="display mt-1 text-[20px] font-bold">Signed</p>
            <p className="mt-1 text-[12px] text-mute">Only this transaction, only once.</p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-3">
              <span className="brand-fill display grid size-11 place-items-center rounded-full text-[17px] font-bold text-white" aria-hidden>
                U
              </span>
              <div>
                <p className="text-[15px] font-extrabold leading-tight">Swap on Uniswap</p>
                <p className="text-[12px] font-semibold text-mute">app.uniswap.org asks you to sign</p>
              </div>
            </div>

            <p className="mt-5 text-[12px] font-bold text-mute">What happens to your wallet</p>
            <ul className="mt-2 overflow-hidden rounded-[22px] bg-canvas/60 ring-1 ring-line/60">
              {EFFECTS.map((e, i) => (
                <motion.li
                  key={e.text}
                  initial={false}
                  animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                  transition={{ delay: reduce ? 0 : 0.35 + i * 0.12, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-3 px-4 py-3 [&+&]:shadow-[inset_0_1px_0_rgb(var(--line)/0.55)]"
                >
                  <img src={`/coins/${e.icon}.png`} alt="" className="size-8 rounded-full" draggable={false} />
                  <span className="flex-1 text-[13px] font-semibold text-mute">{e.sign === "−" ? "You pay" : "You get"}</span>
                  <span className={`display tabular text-[15px] font-bold ${e.tone}`}>
                    {e.sign}
                    {e.text}
                  </span>
                </motion.li>
              ))}
            </ul>
            <p className="mt-2.5 px-1 text-[11px] leading-[1.5] text-faint">From a simulation of this exact transaction. Fee and nonce are set by Nira, not the site.</p>

            <Button className="mt-5" size="lg" onClick={approve} disabled={phase === "scan"} icon={<Fingerprint size={20} className={phase === "scan" ? "keep-motion animate-breathe" : ""} />}>
              {phase === "scan" ? "Checking" : "Approve"}
            </Button>
            <button type="button" className="mt-1 h-11 w-full text-[14px] font-bold text-accent-soft">
              Reject
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
