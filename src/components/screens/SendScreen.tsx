"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { NumberPad } from "../wallet/NumberPad";
import { SlideCommit } from "../wallet/SlideCommit";
import { Steps, usd } from "../wallet/ui";
import { WalletAvatar } from "../wallet/WalletAvatar";

const PRICE = 2710;
const BALANCE = 1.42;
const FEE = 0.41;

/** The Send flow's amount step: the wallet's own keypad, the fee read
 *  before you commit, and a slide to send so a stray tap never pays. */
export function SendScreen() {
  const [value, setValue] = useState("0.25");
  const amount = Number(value) || 0;
  const over = amount > BALANCE;

  return (
    <div className="flex h-full flex-col px-5 pb-5">
      <header className="relative flex h-12 items-center">
        <span className="grid size-10 place-items-center rounded-full bg-raised" aria-hidden>
          <ChevronLeft size={20} />
        </span>
        <span className="absolute left-1/2 -translate-x-1/2">
          <Steps current={2} total={3} />
        </span>
      </header>

      <div className="mt-3 flex items-center gap-2.5 rounded-full bg-surface py-1.5 pl-1.5 pr-4 ring-1 ring-line/60">
        <WalletAvatar id="0x8f3c-demo" size={30} />
        <span className="text-[13px] font-semibold text-mute">To</span>
        <span className="font-mono text-[13px] font-semibold text-ink">0x8f3c…a91e</span>
      </div>

      <div className="mt-6 text-center">
        <p className={`display tabular truncate text-[44px] font-bold leading-none ${over ? "text-down" : "text-ink"}`} aria-live="polite">
          {value || "0"}
          <span className="ml-2 text-[20px] text-faint">ETH</span>
        </p>
        <p className="tabular mt-2 text-[13px] font-semibold text-mute">{over ? "More than your balance" : usd(amount * PRICE)}</p>
      </div>

      <dl className="mt-5 flex justify-between rounded-[22px] bg-surface px-4 py-3 text-[12px]">
        <div>
          <dt className="font-semibold text-mute">Balance</dt>
          <dd className="tabular mt-0.5 font-bold text-ink">{BALANCE} ETH</dd>
        </div>
        <div className="text-right">
          <dt className="font-semibold text-mute">Network fee</dt>
          <dd className="tabular mt-0.5 font-bold text-ink">{usd(FEE)}</dd>
        </div>
      </dl>

      <div className="mt-auto">
        <NumberPad value={value} onChange={setValue} decimals={8} />
        <div className="mt-3">
          <SlideCommit
            label="Slide to send"
            doneLabel="Sent"
            errorLabel="Not enough ETH"
            disabled={amount === 0}
            onConfirm={() => new Promise((ok, fail) => window.setTimeout(() => (over ? fail(new Error("balance")) : ok(null)), 700))}
            height={54}
          />
        </div>
      </div>
    </div>
  );
}
