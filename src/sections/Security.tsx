"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Ban, Delete, Eye, Fingerprint, KeyRound, ShieldAlert, Timer, TriangleAlert } from "lucide-react";
import { StatusMark, haptic, press } from "@/components/wallet/ui";

const RULES = [
  { icon: KeyRound, title: "Keys stay on this phone", detail: "Your recovery phrase is sealed with a device key from the phone's secure hardware. It never leaves it, and Nira has no server that could hold it." },
  { icon: Fingerprint, title: "You approve every payment", detail: "Sending, swapping, signing for a site, showing your phrase and removing a wallet each need your PIN or fingerprint, for that exact action." },
  { icon: Timer, title: "Wrong guesses slow down", detail: "Every PIN attempt is counted, and the wait between tries grows. Locking the wallet closes every open one." },
  { icon: Eye, title: "See it before you sign", detail: "Transactions are simulated first, so you see what leaves your wallet and what arrives, not raw data." },
  { icon: ShieldAlert, title: "Phishing sites blocked", detail: "Known scam sites sit behind a full-screen warning and get no answers. The list is refreshed daily." },
  { icon: Ban, title: "No blind signing", detail: "Requests Nira cannot read are refused. Token approvals are for the exact amount, never unlimited." },
];

const PIN = "246810";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "bio", "0", "back"] as const;

/** The lock screen, small: six dots, a keypad, fingerprint bottom left. A
 *  wrong PIN shakes and is counted; the right one (shown) or a fingerprint
 *  opens it. */
function PinDemo() {
  const reduce = useReducedMotion();
  const [pin, setPin] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "open">("idle");
  const [tries, setTries] = useState(0);
  const [shake, setShake] = useState(0);

  const unlock = () => {
    haptic(14);
    setState("open");
    window.setTimeout(() => {
      setState("idle");
      setPin("");
    }, 2600);
  };

  const press_ = (k: (typeof KEYS)[number]) => {
    if (state === "open") return;
    if (k === "bio") return unlock();
    if (k === "back") return setPin((p) => p.slice(0, -1));
    const next = (pin + k).slice(0, 6);
    haptic(6);
    setPin(next);
    if (state === "wrong") setState("idle");
    if (next.length < 6) return;
    if (next === PIN) {
      setTries(0);
      window.setTimeout(unlock, 120);
    } else {
      window.setTimeout(() => {
        haptic(30);
        setState("wrong");
        setTries((t) => t + 1);
        setShake((s) => s + 1);
        setPin("");
      }, 160);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[26px] lg:mx-0 bg-surface p-6 ring-1 ring-line/60">
      <div className="flex flex-col items-center text-center">
        {state === "open" ? (
          <div className="flex h-[132px] items-center">
            <div className="scale-[0.8]">
              <StatusMark status="success" />
            </div>
          </div>
        ) : (
          <>
            <span className="brand-fill grid size-12 place-items-center rounded-full text-white" aria-hidden>
              <KeyRound size={20} />
            </span>
            <p className="display mt-4 text-[18px] font-bold">Enter your PIN</p>
            <motion.div
              key={shake}
              className="mt-5 flex gap-3"
              animate={shake && !reduce ? { x: [0, -8, 7, -4, 2, 0] } : undefined}
              transition={{ duration: 0.36 }}
              role="img"
              aria-label={`${pin.length} of 6 digits entered`}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <span
                  key={i}
                  className={`size-3 rounded-full transition-all duration-200 ${
                    i < pin.length ? "brand-fill scale-110" : state === "wrong" ? "bg-down/50" : "bg-raised"
                  }`}
                />
              ))}
            </motion.div>
          </>
        )}
        <p className={`mt-4 flex h-5 items-center gap-1.5 text-[13px] font-semibold ${state === "wrong" ? "text-down" : "text-mute"}`} aria-live="polite">
          {state === "open" ? (
            "Unlocked"
          ) : state === "wrong" ? (
            <>
              <TriangleAlert size={14} aria-hidden /> Wrong PIN. {tries} {tries === 1 ? "attempt" : "attempts"} counted
            </>
          ) : (
            <>Demo PIN is {PIN}</>
          )}
        </p>
      </div>

      <div role="group" aria-label="PIN keypad" className="mt-5 grid grid-cols-3 gap-1.5">
        {KEYS.map((k) => {
          const hidden = k === "back" && pin.length === 0;
          return (
            <button
              key={k}
              type="button"
              onClick={() => press_(k)}
              disabled={hidden}
              aria-label={k === "bio" ? "Use fingerprint" : k === "back" ? "Delete" : k}
              style={press(0.94)}
              className={`pressable display grid h-12 cursor-pointer place-items-center rounded-[22px] text-[20px] font-semibold text-ink hover:bg-raised active:bg-raised ${
                hidden ? "invisible" : ""
              } ${k === "bio" ? "text-accent-soft" : ""}`}
            >
              {k === "bio" ? <Fingerprint size={22} /> : k === "back" ? <Delete size={20} /> : k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Security() {
  return (
    <section id="security" aria-labelledby="security-title" className="relative py-20 lg:py-28">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-20">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-2 md:items-center lg:flex">
          <div>
            <h2 id="security-title" className="title">
              Locked to this phone
            </h2>
            <p className="lede mt-5">No account, no server holding your keys. These are the rules Nira is built on, and the lock you will see every day.</p>
          </div>
          <PinDemo />
        </div>

        <ul className="grid grid-cols-1 content-start gap-x-10 gap-y-10 sm:grid-cols-2 lg:pt-3">
          {RULES.map((r) => (
            <li key={r.title} className="flex flex-col gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-surface text-ink ring-1 ring-line" aria-hidden>
                <r.icon size={20} />
              </span>
              <span>
                <span className="block text-[18px] font-extrabold leading-snug">{r.title}</span>
                <span className="mt-1.5 block text-pretty text-[15px] leading-[1.6] text-mute">{r.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
