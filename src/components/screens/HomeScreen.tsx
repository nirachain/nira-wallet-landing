"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ChevronDown, Eye, EyeOff, History, Pin, ScanLine } from "lucide-react";
import { Money, IconButton, haptic, press, usd } from "../wallet/ui";
import { SwipeRow } from "../wallet/SwipeRow";
import { WalletAvatar } from "../wallet/WalletAvatar";
import { TabBar } from "../TabBar";

/** Sample holdings for the demo. Not live prices. */
const ASSETS = [
  { symbol: "BTC", chain: "Bitcoin", icon: "btc", amount: "0.0842", price: 61240, change: 1.84, usd: 5156.41, color: "#1BEC8A" },
  { symbol: "ETH", chain: "Ethereum", icon: "eth", amount: "1.42", price: 2710, change: -0.62, usd: 3848.2, color: "#15A8A0" },
  { symbol: "SOL", chain: "Solana", icon: "sol", amount: "14.6", price: 142.5, change: 3.1, usd: 2080.5, color: "#1359A8" },
  { symbol: "USDC", chain: "Arbitrum", icon: "usdc", amount: "1,395.41", price: 1, change: 0.01, usd: 1395.41, color: "#7CB2F0" },
];
const TOTAL = ASSETS.reduce((s, a) => s + a.usd, 0);

/** The wallet's Home screen with sample balances: the balance rolls in like
 *  an odometer, prices tick, rows swipe for actions, the tab bar springs. */
export function HomeScreen({ live = true, bar = true, onSend }: { live?: boolean; bar?: boolean; onSend?: () => void }) {
  const [total, setTotal] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [shown, setShown] = useState(false);

  // Roll in from zero, then drift a little, as live prices do.
  useEffect(() => {
    const first = window.setTimeout(() => {
      setTotal(TOTAL);
      setShown(true);
    }, 900);
    if (!live) return () => window.clearTimeout(first);
    const tick = window.setInterval(() => {
      if (document.hidden) return;
      setTotal((t) => Math.round((t + (Math.random() - 0.45) * 18) * 100) / 100);
    }, 4200);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(tick);
    };
  }, [live]);

  return (
    <div className="relative h-full overflow-hidden px-5">
      <header className="flex items-center justify-between pt-2">
        <span className="flex items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 ring-1 ring-line/60">
          <WalletAvatar id="nira-demo-wallet" size={30} />
          <span className="text-[14px] font-extrabold">Main wallet</span>
          <ChevronDown size={15} className="text-mute" aria-hidden />
        </span>
        <span className="flex gap-2">
          <IconButton label="Scan a code" className="!size-10">
            <ScanLine size={18} />
          </IconButton>
          <IconButton label="Activity" className="!size-10">
            <History size={18} />
          </IconButton>
        </span>
      </header>

      <section className="pt-6" aria-label="Portfolio balance">
        <div className="flex items-center gap-1">
          <p className="text-[13px] font-semibold text-mute">Total balance</p>
          <button
            type="button"
            onClick={() => {
              haptic();
              setHidden((h) => !h);
            }}
            aria-pressed={hidden}
            aria-label={hidden ? "Show balances" : "Hide balances"}
            style={press(0.96)}
            className="pressable grid size-7 cursor-pointer place-items-center rounded-full text-mute hover:bg-raised"
          >
            {hidden ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
          </button>
        </div>
        <p className="mt-1 leading-none text-ink">
          <Money value={total} masked={hidden} roll className="text-[40px]" />
        </p>

        <div className="mt-5 flex h-2 gap-[3px] overflow-hidden rounded-full" role="img" aria-label="Where the balance is">
          {ASSETS.map((a, i) => (
            <span
              key={a.symbol}
              className="h-full rounded-full transition-[flex-grow] duration-[1100ms] ease-out"
              style={{ background: a.color, flexGrow: shown ? a.usd : 0.0001, transitionDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1">
          {ASSETS.map((a) => (
            <span key={a.symbol} className="flex items-center gap-1.5 text-[11px] font-bold text-mute">
              <span className="size-1.5 rounded-full" style={{ background: a.color }} aria-hidden />
              {a.symbol}
              <span className="tabular text-faint">{Math.round((a.usd / TOTAL) * 100)}%</span>
            </span>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-faint">
          <span className="relative flex size-1.5">
            <span className="keep-motion animate-ring absolute inset-0 rounded-full bg-up" />
            <span className="relative size-1.5 rounded-full bg-up" />
          </span>
          Sample balances. Swipe a row
        </p>
      </section>

      <ul className="mt-4 flex flex-col" aria-label="Assets">
        {ASSETS.map((a, i) => (
          <li key={a.symbol} className={shown ? "animate-rise" : "opacity-0"} style={{ animationDelay: `${i * 60}ms` }}>
            <SwipeRow
              start={[{ label: "Pin", icon: <Pin size={17} />, tone: "ink", onAct: () => {} }]}
              end={[
                { label: "Send", icon: <ArrowUpRight size={18} />, tone: "accent", onAct: () => {} },
                { label: "Receive", icon: <ArrowDownLeft size={18} />, onAct: () => {} },
              ]}
            >
              <div className="flex w-full cursor-grab items-center gap-3 py-2.5 active:cursor-grabbing">
                <span className="relative shrink-0">
                  <img src={`/coins/${a.icon}.png`} alt="" draggable={false} className="size-10 rounded-full" />
                  <span
                    aria-hidden
                    className="display absolute -bottom-0.5 -right-1 grid size-4 place-items-center rounded-[6px] bg-ink text-[8px] font-bold text-canvas ring-2 ring-canvas"
                  >
                    {a.chain[0]}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-extrabold">{a.symbol}</span>
                  <span className="tabular mt-0.5 flex gap-1.5 text-[12px]">
                    <span className="font-semibold text-mute">${a.price.toLocaleString("en-US")}</span>
                    <span className={`font-bold ${a.change >= 0 ? "text-up" : "text-down"}`}>
                      {a.change >= 0 ? "+" : "−"}
                      {Math.abs(a.change).toFixed(2)}%
                    </span>
                  </span>
                </span>
                <span className="tabular shrink-0 text-right">
                  <span className="display block text-[14px] font-semibold">{hidden ? "••••" : a.amount}</span>
                  <span className="mt-0.5 block text-[12px] font-semibold text-mute">{hidden ? "••••" : usd(a.usd)}</span>
                </span>
              </div>
            </SwipeRow>
          </li>
        ))}
      </ul>

      {/* The floating actions, as on Home. */}
      <div className="absolute inset-x-4 bottom-[84px] z-10 flex items-center gap-1 rounded-full bg-surface p-1.5 shadow-float ring-1 ring-line/70">
        <button
          type="button"
          onClick={onSend}
          style={press(0.96)}
          className="pressable flex h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-accent text-[14px] font-bold text-accent-ink"
        >
          <ArrowUpRight size={17} aria-hidden /> Send
        </button>
        <span className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-[14px] font-bold text-ink">
          <ArrowDownLeft size={17} aria-hidden /> Receive
        </span>
        <span className="grid size-11 place-items-center rounded-full bg-raised" aria-label="Swap">
          <ArrowLeftRight size={17} aria-hidden />
        </span>
      </div>

      {bar && <TabBar active={0} />}
    </div>
  );
}
