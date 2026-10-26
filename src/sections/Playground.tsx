"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { TRY_EVENT } from "./Features";
import { WordReveal } from "@/components/WordReveal";
import { Phone } from "@/components/Phone";
import { TabBar } from "@/components/TabBar";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { SwapScreen } from "@/components/screens/SwapScreen";
import { SendScreen } from "@/components/screens/SendScreen";
import { ApproveScreen } from "@/components/screens/ApproveScreen";
import { NodesScreen, SettingsScreen } from "@/components/screens/MoreScreens";

type Copy = { title: string; text: string; facts: string[] };

/** What the panel beside the phone says about each screen. */
const COPY: Record<string, Copy> = {
  home: {
    title: "Your money, at a glance",
    text: "Balances roll into place as they change, and every coin is read from its own chain. Swipe a row for actions, or tap Send.",
    facts: ["Live prices in US dollars", "Hide balances with one tap", "Spam airdrops kept out of the total"],
  },
  send: {
    title: "Send in a few taps",
    text: "The wallet's own keypad, the network fee read before you commit, and a slide to send, so a stray tap never pays.",
    facts: ["Bitcoin, EVM and Solana sends", "A high fee is flagged first", "Your PIN or fingerprint, every time"],
  },
  swap: {
    title: "Swap and bridge",
    text: "Routes come from LI.FI, across networks. Each quote is checked against what you asked for and simulated before it is sent.",
    facts: ["Approvals for the exact amount", "Bridges tracked until they land", "Not sent if expected to fail"],
  },
  explore: {
    title: "Apps, without your keys",
    text: "Sites run in Nira's own browser, apart from the wallet. Before you sign, you see what the transaction does to your balances.",
    facts: ["Verified apps matched by exact domain", "Known phishing sites blocked", "WalletConnect for other screens"],
  },
  nodes: {
    title: "Your own node, soon",
    text: "Buy a node on the networks you use and keep it running from the wallet. Not on sale yet; this tab says what is coming.",
    facts: ["Buy from the wallet", "Watch uptime and sync", "Every change needs your PIN"],
  },
  settings: {
    title: "Yours to set",
    text: "Fingerprint unlock, hidden balances, networks and the apps you connected. Turning on developer mode asks for your PIN.",
    facts: ["Add any EVM network", "Disconnect any app", "Dark and light themes"],
  },
};
const TAB_KEYS = ["home", "swap", "explore", "nodes", "settings"];

/**
 * Try it: the phone runs the real screens and the app's tab bar switches
 * them, with the app's own push (a short slide and fade from the side you
 * are heading to). Send opens from Home and comes back with its chevron.
 */
export function Playground() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [dir, setDir] = useState(1);
  const [sending, setSending] = useState(false);
  const key = sending ? "send" : TAB_KEYS[tab];
  const copy = COPY[key];

  // The feature cards open a given screen here.
  useEffect(() => {
    const on = (e: Event) => {
      const want = (e as CustomEvent<string>).detail;
      if (want === "send") {
        setTab(0);
        setSending(true);
      } else {
        setSending(false);
        setTab(Math.max(0, TAB_KEYS.indexOf(want)));
      }
      setDir(1);
    };
    window.addEventListener(TRY_EVENT, on);
    return () => window.removeEventListener(TRY_EVENT, on);
  }, []);

  const go = (i: number) => {
    setDir(i >= tab ? 1 : -1);
    setSending(false);
    setTab(i);
  };

  const screens: Record<string, ReactNode> = {
    home: (
      <HomeScreen
        bar={false}
        live={false}
        onSend={() => {
          setDir(1);
          setSending(true);
        }}
      />
    ),
    send: (
      <SendScreen
        onBack={() => {
          setDir(-1);
          setSending(false);
        }}
      />
    ),
    swap: <SwapScreen bar={false} />,
    explore: <ApproveScreen bottom={72} />,
    nodes: <NodesScreen />,
    settings: <SettingsScreen />,
  };

  const shift = reduce ? 0 : 28;
  return (
    <section id="try" aria-label="Try the app" className="py-24 lg:py-36">
      <div className="wrap">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div className="lg:order-1">
            <WordReveal text="Take it for a spin." className="title max-w-[10ch]" />
            <p className="lede mt-5">This is the app, running in your browser with sample balances. The tab bar works, and so does everything on each screen.</p>

            {/* What this screen does: crossfades with a little blur as the screen changes. */}
            <div className="relative mt-10 min-h-[250px]" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={key}
                  initial={{ opacity: 0, filter: "blur(6px)", transform: `translateX(${12 * dir}px)` }}
                  animate={{ opacity: 1, filter: "blur(0px)", transform: "translateX(0px)" }}
                  exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.14 } }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  <h3 className="display text-[clamp(26px,3vw,36px)] font-bold leading-[1.08] tracking-[-0.03em]">{copy.title}</h3>
                  <p className="mt-3 max-w-[30em] text-pretty text-[17px] leading-[1.6] text-mute">{copy.text}</p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {copy.facts.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[15px] font-semibold">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-soft" aria-hidden>
                          <Check size={13} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mx-auto lg:order-2" data-theme="dark">
            <Phone label="Nira, running with sample data">
              <div className="relative h-full overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.div
                    key={key}
                    className="absolute inset-0 bg-canvas text-ink"
                    initial={{ opacity: 0, transform: `translateX(${shift * dir}px)` }}
                    animate={{ opacity: 1, transform: "translateX(0px)" }}
                    exit={{ opacity: 0, transform: `translateX(${-shift * 0.4 * dir}px)`, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {screens[key]}
                  </motion.div>
                </AnimatePresence>
                {!sending && <TabBar active={tab} onChange={go} />}
              </div>
            </Phone>
            <p className="mt-5 text-center text-[13px] font-semibold text-mute">Tap the tabs, or slide along the bar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
