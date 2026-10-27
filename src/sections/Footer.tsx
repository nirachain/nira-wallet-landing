"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BrandMark, BrandWordmark } from "@/components/wallet/Logo";
import { CHAINS, DOWNLOAD_URL } from "@/lib/site";
import { goTo } from "@/lib/nav";

const QA = [
  { q: "Does Nira hold my funds?", a: "No. Your keys are created on your phone and sealed there. Nira never holds your funds or your recovery phrase, and cannot restore a lost one." },
  {
    q: "What if I lose my phone?",
    a: "Install Nira on the new phone, choose “I already have a wallet” and enter your recovery phrase. Your funds live on the blockchains, so they come back with it.",
  },
  { q: "Do I need an account or an email?", a: "No. There is nothing to sign up for. Your PIN and fingerprint unlock the wallet on this phone only." },
  { q: "Which networks does it support?", a: `${CHAINS.join(", ")}, and any EVM network you add; Nira checks its nodes before saving it.` },
  { q: "Is there an iPhone version?", a: "Nira is on Android first. An iPhone version is planned." },
];

const LINKS = [
  { id: "features", label: "Features" },
  { id: "sign", label: "Signing" },
  { id: "security", label: "Security" },
  { id: "try", label: "Try it" },
  { id: "nodes", label: "Nodes" },
];

/** One question: the answer opens by height with a fade (250ms ease-out),
 *  the plus turns into a cross. A real button for keyboard and readers. */
function Item({ q, a, id }: { q: string; a: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="shadow-[inset_0_-1px_0_rgb(var(--line))]">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[17px] font-extrabold"
        >
          {q}
          <span
            aria-hidden
            className={`grid size-8 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-200 ease-out ${open ? "rotate-45 bg-ink text-canvas" : "bg-raised text-ink"}`}
          >
            <Plus size={16} />
          </span>
        </button>
      </h3>
      <div id={id} role="region" className={`grid transition-[grid-template-rows,opacity] duration-[250ms] ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <p className="overflow-hidden pr-12 text-pretty text-[15px] leading-[1.65] text-mute">
          <span className="block pb-5">{a}</span>
        </p>
      </div>
    </li>
  );
}

export function Footer() {
  return (
    <footer id="faq" className="relative pb-16 pt-24 text-ink lg:pt-32">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h2 className="title !text-[clamp(36px,4.2vw,64px)]">Questions</h2>
          <p className="lede mt-5">What people ask before they move their crypto to a new wallet.</p>
        </div>
        <ul className="shadow-[inset_0_1px_0_rgb(var(--line))]">
          {QA.map((x, i) => (
            <Item key={x.q} q={x.q} a={x.a} id={`faq-${i}`} />
          ))}
        </ul>
      </div>

      <div className="wrap mt-24">
        <div className="grid grid-cols-1 gap-10 pt-12 shadow-[inset_0_1px_0_rgb(var(--line))] md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex max-w-[420px] flex-col gap-5">
            <span className="flex items-center gap-3">
              <BrandMark size={36} className="rounded-[22%]" />
              <BrandWordmark width={150} />
            </span>
            <p className="text-pretty text-[14px] leading-[1.6] text-mute">A self-custody wallet for Bitcoin, Ethereum, Solana and the networks you add. Your keys never leave your phone.</p>
          </div>
          <div className="flex gap-16 text-[14px]">
            <nav aria-label="Sections">
              <p className="font-bold">Wallet</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {LINKS.map((l) => (
                  <li key={l.id}>
                    <button type="button" onClick={() => goTo(l.id)} className="text-mute transition-colors duration-150 hover:text-ink">
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="font-bold">Get it</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                <li>
                  <a
                    href={DOWNLOAD_URL}
                    {...(DOWNLOAD_URL.endsWith(".apk") ? { download: "" } : {})}
                    rel="noopener noreferrer"
                    className="text-mute transition-colors duration-150 hover:text-ink"
                  >
                    Android
                  </a>
                </li>
                <li className="text-faint">iPhone, later</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 text-[13px] text-faint sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Nira Wallet</span>
          <span>Nira never holds your funds or your recovery phrase. Not financial advice.</span>
        </div>
      </div>
    </footer>
  );
}
