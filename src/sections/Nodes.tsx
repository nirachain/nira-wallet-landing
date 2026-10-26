"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { Gauge, ShieldCheck, ShoppingBag } from "lucide-react";
import { WordReveal } from "@/components/WordReveal";
import { NodeRack } from "@/components/NodeRack";
import { Tag } from "@/components/wallet/ui";

/** What the Nodes tab will do, as the app lists it. Blade 0 is the bottom. */
const PLANNED = [
  { icon: ShoppingBag, title: "Buy", detail: "Pay for a node on the networks you use, from this wallet.", blade: 2 },
  { icon: Gauge, title: "Monitor", detail: "Uptime and sync, at a glance.", blade: 1 },
  { icon: ShieldCheck, title: "Manage", detail: "Every change needs your PIN, like a payment.", blade: 0 },
];

/** Coming soon, said plainly. Point at a plan and its blade rises out of the rack. */
export function Nodes() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const [lift, setLift] = useState<number | null>(null);
  return (
    <section id="nodes" aria-label="Nodes" className="py-24 lg:py-32">
      <div ref={ref} className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:order-2">
          <NodeRack play={seen} lift={lift} onBlade={setLift} />
        </div>
        <div className="lg:order-1">
          <Tag tone="accent">Coming soon</Tag>
          <WordReveal text="Run your own node." className="title mt-4" />
          <p className="lede mt-5">Buy a node on the networks you use and keep it running from your wallet, with no server or terminal. Nodes are not on sale yet.</p>
          <ul className="mt-8 flex flex-col">
            {PLANNED.map((p) => (
              <li key={p.title}>
                <button
                  type="button"
                  onPointerEnter={() => setLift(p.blade)}
                  onPointerLeave={() => setLift(null)}
                  onFocus={() => setLift(p.blade)}
                  onBlur={() => setLift(null)}
                  onClick={() => setLift((l) => (l === p.blade ? null : p.blade))}
                  className={`flex w-full items-center gap-4 rounded-[22px] px-4 py-4 text-left transition-colors duration-200 ${lift === p.blade ? "bg-surface shadow-float" : ""}`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-raised text-accent-soft" aria-hidden>
                    <p.icon size={19} />
                  </span>
                  <span>
                    <span className="block text-[17px] font-extrabold">{p.title}</span>
                    <span className="block text-[14px] leading-[1.5] text-mute">{p.detail}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
