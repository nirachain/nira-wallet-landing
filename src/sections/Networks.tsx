"use client";

import { CurvedLoop } from "@/components/lazy";
import { CHAINS } from "@/lib/site";

/** The networks Nira ships with, on the arc from the app's About screen.
 *  Drag it to spin it; scrolling speeds it up. */
export function Networks() {
  return (
    <section aria-label="Networks" className="relative py-16 lg:py-24">
      <p className="wrap text-[15px] font-semibold text-mute">Built in, side by side</p>
      <div className="mt-2 text-ink" aria-hidden>
        <CurvedLoop
          marqueeText={CHAINS.join(" ✦ ")}
          shape="arc"
          curveAmount={110}
          speed={1}
          fontSize={88}
          fontWeight={700}
          separator="✦"
          separatorColor="rgb(var(--accent-deep))"
          edgeFade={0.18}
          scrollBoost={1.2}
          className="font-display"
        />
      </div>
      <p className="sr-only">{CHAINS.join(", ")}.</p>
      <div className="wrap">
        <p className="mt-2 max-w-[640px] text-pretty text-[15px] leading-[1.6] text-mute">
        Balances are read from each chain, not from a third-party index. Tokens outside the lists can be added by contract, and likely scam
        airdrops stay hidden.
        </p>
      </div>
    </section>
  );
}
