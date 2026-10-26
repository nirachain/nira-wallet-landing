"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Ban, Eye, Fingerprint, KeyRound, ShieldAlert, Timer } from "lucide-react";
import { WelcomeScene } from "@/components/lazy";
import { WordReveal } from "@/components/WordReveal";

const RULES = [
  { icon: KeyRound, title: "Keys stay on this phone", detail: "Sealed with a device key from the phone's secure hardware. Nira has no server that could hold them." },
  { icon: Fingerprint, title: "You approve every payment", detail: "Sending, swapping, signing and showing your phrase each need your PIN or fingerprint." },
  { icon: Timer, title: "Wrong guesses slow down", detail: "Every PIN attempt is counted, and the wait between tries grows." },
  { icon: Eye, title: "See it before you sign", detail: "Transactions are simulated first: what leaves and what arrives." },
  { icon: ShieldAlert, title: "Phishing sites blocked", detail: "Known scam sites get a full-screen warning and no answers. The list updates daily." },
  { icon: Ban, title: "No blind signing", detail: "Requests Nira cannot read are refused. Approvals are for the exact amount." },
];

/**
 * Security, on a dark block inset from the page. The app's welcome scene
 * plays as the block scrolls by: glyph ring, coins on a chain, then the chain
 * closing into a padlock over the tile (tap it to open it).
 */
export function Security() {
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const position = useTransform(scrollYProgress, [0.12, 0.62], [0, 2], { clamp: true });

  return (
    <section id="security" aria-labelledby="security-title" className="px-3 sm:px-5">
      <div ref={frame} data-theme="dark" className="relative overflow-hidden rounded-[32px] bg-surface py-20 text-ink ring-1 ring-line/70 lg:rounded-[44px] lg:py-28">
        <span aria-hidden className="slab absolute inset-x-0 top-0 h-1" />
        <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="relative h-[420px] sm:h-[480px] lg:h-[620px]">
            <WelcomeScene position={position} />
          </div>
          <div>
            <WordReveal text="Locked to this phone." className="title max-w-[11ch]" />
            <p className="lede mt-6">No account, no server holding your keys, and nothing signed without you. These are the rules Nira is built on.</p>
            <ul className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {RULES.map((r, i) => (
                <motion.li
                  key={r.title}
                  initial={{ opacity: 0, transform: "translateY(12px)" }}
                  whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.06, ease: [0.23, 1, 0.32, 1] }}
                  className="flex gap-4 py-5 shadow-[inset_0_1px_0_rgb(var(--line)/0.8)]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-raised text-accent-soft" aria-hidden>
                    <r.icon size={18} />
                  </span>
                  <span>
                    <span className="block text-[16px] font-extrabold leading-snug">{r.title}</span>
                    <span className="mt-1 block text-pretty text-[14px] leading-[1.55] text-mute">{r.detail}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
