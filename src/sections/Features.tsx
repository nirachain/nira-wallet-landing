"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDownUp, ArrowUpRight, ShieldCheck } from "lucide-react";
import { WordReveal } from "@/components/WordReveal";
import { BrandQr } from "@/components/wallet/BrandQr";
import { WalletAvatar } from "@/components/wallet/WalletAvatar";
import { goTo } from "@/lib/nav";

/** Opens the playground on a given screen. */
export const TRY_EVENT = "nira:try";
const tryIt = (tab: string) => {
  window.dispatchEvent(new CustomEvent(TRY_EVENT, { detail: tab }));
  goTo("try");
};

/** A feature: a dark piece of the app on top (lifting a little on hover),
 *  then what it does, then a way to try it. */
function Card({ i, title, text, tab, children }: { i: number; title: string; text: string; tab: string; children: ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, transform: "translateY(20px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
      className="group flex flex-col rounded-[28px] bg-surface p-3 ring-1 ring-line/70"
    >
      <div
        data-theme="dark"
        aria-hidden
        className="relative grid h-[260px] place-items-center overflow-hidden rounded-[22px] bg-canvas px-5 text-ink transition-transform duration-300 ease-out group-hover:-translate-y-1"
      >
        <span className="slab absolute -right-10 -top-10 size-40 rotate-[30deg] opacity-25 blur-0 [clip-path:polygon(34%_0,100%_0,100%_100%,0_100%)]" />
        {children}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
        <h3 className="display text-[24px] font-extrabold leading-tight tracking-[-0.04em]">{title}</h3>
        <p className="mt-2 flex-1 text-pretty text-[15px] leading-[1.6] text-mute">{text}</p>
        <button
          type="button"
          onClick={() => tryIt(tab)}
          className="mt-5 flex w-fit items-center gap-1.5 text-[15px] font-bold text-ink [&:hover>svg]:-translate-y-0.5 [&:hover>svg]:translate-x-0.5"
        >
          Try it
          <ArrowUpRight size={17} className="transition-transform duration-200 ease-out" />
        </button>
      </div>
    </motion.article>
  );
}

const SendArt = () => (
  <div className="relative w-full max-w-[240px]">
    <div className="flex items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 ring-1 ring-line/60">
      <WalletAvatar id="0x8f3c-demo" size={26} />
      <span className="font-mono text-[12px] font-semibold">0x8f3c…a91e</span>
    </div>
    <p className="display mt-5 text-center text-[40px] font-bold leading-none tracking-[-0.03em]">
      0.25<span className="ml-1.5 text-[18px] text-faint">ETH</span>
    </p>
    <p className="mt-1.5 text-center text-[12px] font-semibold text-mute">$677.50 <span className="ml-2 text-faint">Fee $0.41</span></p>
    <div className="mt-5 flex h-11 items-center rounded-full bg-surface p-1 ring-1 ring-line/60">
      <span className="grid h-9 w-14 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-500 ease-out group-hover:translate-x-[150px]">
        <ArrowUpRight size={18} />
      </span>
      <span className="flex-1 text-center text-[12px] font-bold text-mute">Slide to send</span>
    </div>
  </div>
);

const SwapArt = () => (
  <div className="relative flex w-full max-w-[240px] flex-col gap-1.5">
    {[
      { k: "Pay", a: "250", s: "USDC", i: "usdc", n: "Arbitrum One" },
      { k: "Get", a: "0.0921", s: "ETH", i: "eth", n: "Optimism" },
    ].map((r) => (
      <div key={r.k} className="rounded-[18px] bg-surface p-3 ring-1 ring-line/60">
        <p className="text-[10px] font-semibold text-mute">
          {r.k} on {r.n}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="display text-[22px] font-bold">{r.a}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-raised py-0.5 pl-0.5 pr-2.5 text-[12px] font-extrabold">
            <img src={`/coins/${r.i}.png`} alt="" className="size-5 rounded-full" />
            {r.s}
          </span>
        </div>
      </div>
    ))}
    <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-raised ring-4 ring-canvas transition-transform duration-500 ease-out group-hover:rotate-180">
      <ArrowDownUp size={15} />
    </span>
  </div>
);

const AppsArt = () => (
  <div className="flex w-full items-center justify-center gap-3">
    <div className="relative size-[104px] shrink-0 overflow-hidden rounded-[18px] bg-white p-2">
      <BrandQr value="nira-wallet-demo" label="" />
      <span className="keep-motion absolute inset-x-2 top-2.5 h-[2px] rounded-full bg-accent shadow-[0_0_10px_rgb(27_236_138)] [animation:qr-scan_2.4s_var(--ease-in-out)_infinite]" />
    </div>
    <div className="flex min-w-0 flex-col gap-2 text-[11px] font-bold [&>span]:max-w-[118px] [&>span]:truncate">
      <span className="flex items-center gap-1.5 rounded-full bg-up/15 px-2.5 py-1.5 text-up">
        <ShieldCheck size={13} /> app.uniswap.org
      </span>
      <span className="rounded-full bg-raised px-2.5 py-1.5 text-mute">WalletConnect</span>
      <span className="rounded-full bg-down/15 px-2.5 py-1.5 text-down line-through">claim-un1swap.example</span>
    </div>
  </div>
);

const NftArt = () => (
  <div className="relative h-[170px] w-[220px]">
    {["/art/blades.svg", "/art/orbit.svg", "/art/genesis.svg"].map((src, i) => (
      <img
        key={src}
        src={src}
        alt=""
        className="absolute left-1/2 top-1/2 size-[150px] rounded-[18px] shadow-float ring-1 ring-white/10 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(-50%, -50%) rotate(${(i - 1) * 8}deg) translateX(${(i - 1) * 26}px)`,
          zIndex: i,
        }}
      />
    ))}
  </div>
);

/** What Nira does, four ways, each a piece of the real interface. */
export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-24 lg:py-36">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end">
          <WordReveal text="One app for everything you hold." className="title max-w-[14ch]" />
          <p className="lede lg:pb-2">Send, swap and bridge, use apps and keep your collectibles, on every network, from one wallet that only you can open.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card i={0} tab="send" title="Send" text="The fee is read before you commit and a high one is flagged. Nothing leaves until you approve.">
            <SendArt />
          </Card>
          <Card i={1} tab="swap" title="Swap and bridge" text="Routes from LI.FI across networks, approvals for the exact amount, simulated before sending.">
            <SwapArt />
          </Card>
          <Card i={2} tab="explore" title="Use apps" text="Sites run apart from your wallet. Connect any app with WalletConnect; known scams are blocked.">
            <AppsArt />
          </Card>
          <Card i={3} tab="home" title="Collectibles" text="NFTs on EVM networks and Solana, with video, animated art and 3D, shown as their creators made them.">
            <NftArt />
          </Card>
        </div>
      </div>
    </section>
  );
}
