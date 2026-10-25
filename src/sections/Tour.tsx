"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Phone } from "@/components/Phone";
import { SendScreen } from "@/components/screens/SendScreen";
import { SwapScreen } from "@/components/screens/SwapScreen";
import { ApproveScreen } from "@/components/screens/ApproveScreen";
import { useWide } from "@/lib/useWide";

type Step = { title: string; text: string; hint: string; label: string; screen: (active: boolean) => ReactNode };

const STEPS: Step[] = [
  {
    title: "Send in a few taps",
    text: "Scan a code or paste an address. Nira reads the fee from the network before you commit and flags a high one. The payment leaves only after a slide and your PIN.",
    hint: "Type an amount on the keypad, then slide to send.",
    label: "Nira's Send screen",
    screen: () => <SendScreen />,
  },
  {
    title: "Swap and bridge in one place",
    text: "Routes come from LI.FI, across networks. Nira checks each quote against what you asked for, approves the exact amount and never more, and simulates the swap first. If the network expects it to fail, it is not sent.",
    hint: "Tap the arrows to flip the pair.",
    label: "Nira's Swap screen",
    screen: () => <SwapScreen />,
  },
  {
    title: "Use apps, keep your keys",
    text: "Sites open in Nira's own browser, kept apart from the wallet, or connect over WalletConnect. Before you sign, you see what the transaction does to your balances. Known phishing sites are blocked, and requests Nira cannot read are refused.",
    hint: "Approve it with the fingerprint button.",
    label: "A site asking Nira to sign",
    screen: (active) => <ApproveScreen active={active} />,
  },
];

/** One step's text. Reports when it holds the middle of the screen. */
const StepText = ({ step, i, onSeen, children }: { step: Step; i: number; onSeen: (i: number) => void; children?: ReactNode }) => {
  const ref = useRef<HTMLElement>(null);
  const middle = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (middle) onSeen(i);
  }, [middle, i, onSeen]);
  return (
    <article ref={ref} className="flex flex-col justify-center gap-8 py-12 md:flex-row md:items-center md:justify-between md:gap-10 lg:min-h-[88vh] lg:py-0">
      <div className="max-w-[520px] md:flex-1 min-[1800px]:max-w-[640px]">
        <h3 className="display text-balance text-[clamp(28px,3.4vw,42px)] min-[1800px]:text-[52px] font-bold leading-[1.08] tracking-[-0.03em]">{step.title}</h3>
        <p className="lede mt-4">{step.text}</p>
        <p className="mt-5 flex items-center gap-2.5 text-[14px] font-semibold text-accent-soft">
          <span aria-hidden className="brand-fill h-1.5 w-6 -skew-x-[30deg] rounded-[2px]" />
          {step.hint}
        </p>
      </div>
      {children}
    </article>
  );
};

/**
 * A tour of the real interface, with sample data. On wide screens the phone
 * stays put and its screen changes as each step reaches the middle, entering
 * the way a pushed page does in the app. On phones each step brings its own.
 */
export function Tour() {
  const wide = useWide();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section id="wallet" aria-labelledby="tour-title" className="relative py-20 lg:py-28">
      <div className="wrap">
        <h2 id="tour-title" className="title max-w-[820px]">
          The wallet, up close
        </h2>
        <p className="lede mt-5">This is Nira&apos;s interface, running here with sample data. Tap it, type on it, slide it.</p>

        <div className="mt-6 grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            {STEPS.map((step, i) => (
              <StepText key={step.title} step={step} i={i} onSeen={setActive}>
                {!wide && (
                  <div className="flex justify-center">
                    <Phone label={step.label}>{step.screen(true)}</Phone>
                  </div>
                )}
              </StepText>
            ))}
          </div>

          {wide && (
            <div className="relative">
              {/* Held in the middle of the screen, shrunk to fit a short one. */}
              <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center pt-8">
                <Phone label={STEPS[active].label}>
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.div
                      key={active}
                      className="absolute inset-0 bg-canvas"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.16 } }}
                      transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
                    >
                      {STEPS[active].screen(true)}
                    </motion.div>
                  </AnimatePresence>
                </Phone>
                {/* Which step the phone is on. */}
                <div className="mt-6 flex justify-center gap-1.5" aria-hidden>
                  {STEPS.map((s, i) => (
                    <span key={s.title} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "brand-fill w-6" : "w-1.5 bg-raised"}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
