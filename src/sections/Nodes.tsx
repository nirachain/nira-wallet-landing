"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { NodeRack } from "@/components/NodeRack";
import { Tag } from "@/components/wallet/ui";

/** What the Nodes tab will become. Says what is coming, no made-up figures. */
export function Nodes() {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  return (
    <section id="nodes" ref={ref} aria-labelledby="nodes-title" className="relative py-20 lg:py-28">
      <div className="wrap flex flex-col items-center text-center">
        <NodeRack play={seen} />
        <Tag tone="accent" className="mt-2">
          Coming soon
        </Tag>
        <h2 id="nodes-title" className="title mt-4">
          Run your own node
        </h2>
        <p className="lede mt-5">
          Buy a node on the networks you use and keep it running, all from your wallet, with no server or terminal. Managing it will take your
          PIN, like everything else. Nodes are not on sale yet.
        </p>
      </div>
    </section>
  );
}
