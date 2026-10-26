"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate, useInView, useReducedMotion } from "motion/react";
import { Check, Fingerprint, Lock, RotateCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import { WordReveal } from "@/components/WordReveal";
import { Odometer } from "@/components/wallet/Odometer";
import { SegmentedControl } from "@/components/wallet/SegmentedControl";
import { StatusMark } from "@/components/wallet/ui";

const ROWS = [
  { icon: "usdc", label: "You pay", from: "0.00", to: "250.00", unit: "USDC", sign: "−", tone: "text-down" },
  { icon: "eth", label: "You get", from: "0.0000", to: "0.0921", unit: "ETH", sign: "+", tone: "text-up" },
];

const FACTS = [
  "Simulated before you sign, so you see what leaves and what arrives",
  "Fee and nonce are set by Nira, never by the site",
  "Known phishing sites are walled off and get no answers",
  "Requests Nira cannot read are refused",
];

type Phase = "ask" | "check" | "done";

/** The request, as the app shows it: who asks, what the simulation says will
 *  happen, and the approve button, which checks your fingerprint. */
function Request({ phish }: { phish: boolean }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const [scope, animate] = useAnimate();
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<Phase>("ask");
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!seen || phish) return;
    setShown(0);
    const ts = [350, 650, 1050].map((ms, i) => window.setTimeout(() => setShown(i + 1), ms));
    return () => ts.forEach(window.clearTimeout);
  }, [seen, phish, run]);

  // Switching to the lookalike: the card shakes once and becomes the wall.
  useEffect(() => {
    setPhase("ask");
    if (phish && !reduce && scope.current) animate(scope.current, { x: [0, -10, 9, -6, 4, -2, 0] }, { duration: 0.42, ease: [0.23, 1, 0.32, 1] });
  }, [phish, reduce, animate, scope]);

  const approve = () => {
    setPhase("check");
    window.setTimeout(() => setPhase("done"), reduce ? 0 : 900);
  };

  return (
    <div ref={box} data-theme="dark" className="w-full">
      <div
        ref={scope}
        className={`relative overflow-hidden rounded-[28px] p-6 text-ink shadow-[0_40px_80px_-30px_rgb(6_16_28/0.5)] ring-1 transition-colors duration-300 ${
          phish ? "bg-[#1a0b10] ring-down/50" : "bg-surface ring-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`display grid size-11 place-items-center rounded-full text-[17px] font-bold text-white transition-colors duration-300 ${phish ? "bg-down" : "slab"}`} aria-hidden>
            {phish ? <ShieldAlert size={20} /> : "U"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-mute">
              <Lock size={12} aria-hidden />
              <span className={`truncate font-mono ${phish ? "text-down" : ""}`}>{phish ? "app.un1swap-claim.example" : "app.uniswap.org"}</span>
            </p>
            <p className="text-[16px] font-extrabold">{phish ? "Known phishing site" : "Swap on Uniswap"}</p>
          </div>
          {!phish && (
            <span className="flex h-6 items-center gap-1 rounded-full bg-up/15 px-2.5 text-[11px] font-bold text-up">
              <ShieldCheck size={12} aria-hidden /> Verified
            </span>
          )}
        </div>

        <div className="relative mt-6 min-h-[250px]" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {phish ? (
              <motion.div
                key="wall"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center pt-6 text-center"
              >
                <span className="grid size-16 place-items-center rounded-full bg-down text-white">
                  <ShieldAlert size={28} />
                </span>
                <p className="mt-5 text-[17px] font-bold">Nira will not answer this site.</p>
                <p className="mt-2 max-w-[300px] text-[14px] leading-[1.55] text-mute">It is on the list of known phishing sites, so it sits behind this warning and gets nothing from your wallet.</p>
              </motion.div>
            ) : phase === "done" ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} className="flex flex-col items-center text-center">
                <div className="scale-[0.8]">
                  <StatusMark status="success" />
                </div>
                <p className="display text-[22px] font-bold">Signed</p>
                <p className="mt-1 text-[14px] text-mute">This transaction, once. Nothing more.</p>
                <button
                  type="button"
                  onClick={() => {
                    setPhase("ask");
                    setRun((r) => r + 1);
                  }}
                  className="pressable mt-4 flex h-10 items-center gap-2 rounded-full bg-raised px-4 text-[13px] font-bold"
                >
                  <RotateCcw size={14} /> Again
                </button>
              </motion.div>
            ) : (
              <motion.div key={`ask-${run}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <p className="text-[12px] font-bold text-mute">What happens to your wallet</p>
                <ul className="mt-2 overflow-hidden rounded-[22px] bg-canvas ring-1 ring-line/60">
                  {ROWS.map((r, i) => (
                    <li
                      key={r.label}
                      className="flex items-center gap-3 px-4 py-3.5 transition-[opacity,transform] duration-300 ease-out [&+&]:shadow-[inset_0_1px_0_rgb(var(--line)/0.55)]"
                      style={{ opacity: shown > i ? 1 : 0, transform: shown > i ? "none" : "translateX(-10px)" }}
                    >
                      <img src={`/coins/${r.icon}.png`} alt="" className="size-8 rounded-full" />
                      <span className="flex-1 text-[14px] font-semibold text-mute">{r.label}</span>
                      <span className={`display tabular text-[17px] font-bold ${r.tone}`}>
                        {r.sign}
                        <Odometer text={shown > 2 ? r.to : r.from} /> {r.unit}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 px-1 text-[12px] leading-[1.5] text-faint">From a simulation of this exact transaction.</p>
                <button
                  type="button"
                  onClick={approve}
                  disabled={shown < 3 || phase === "check"}
                  className="pressable mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-accent text-[16px] font-bold text-accent-ink disabled:bg-raised disabled:text-faint"
                >
                  <Fingerprint size={20} className={phase === "check" ? "keep-motion animate-breathe" : ""} />
                  {phase === "check" ? "Checking fingerprint" : "Approve"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const SITES = ["The real site", "A lookalike"] as const;

/** Signing, shown by doing it. Flip to the lookalike to see the wall. */
export function Sign() {
  const [site, setSite] = useState<(typeof SITES)[number]>(SITES[0]);
  return (
    <section id="sign" aria-labelledby="sign-title" className="py-24 lg:py-36">
      <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-24">
        <div>
          <WordReveal text="See it before you sign it." className="title max-w-[12ch]" />
          <p className="lede mt-6">When an app asks for a signature, Nira works out what will happen first and shows you in plain numbers. Approve, and only that happens.</p>
          <ul className="mt-9 flex flex-col gap-4">
            {FACTS.map((f) => (
              <li key={f} className="flex gap-3.5 text-[16px] font-semibold leading-snug">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-soft" aria-hidden>
                  <Check size={13} strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <SegmentedControl options={SITES} selected={site} onSelect={setSite} label="Which site is asking" />
          <Request phish={site === SITES[1]} />
        </div>
      </div>
    </section>
  );
}
