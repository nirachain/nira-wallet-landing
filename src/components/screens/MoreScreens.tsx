"use client";

import { useState } from "react";
import { ChevronRight, Code2, EyeOff, Fingerprint, Gauge, Globe, Info, Link2, ShieldCheck, ShoppingBag } from "lucide-react";
import { CardList, Tag } from "../wallet/ui";
import { Toggle } from "../wallet/Toggle";
import { NodeRack } from "../NodeRack";

/** The Nodes tab, as the app shows it: what is coming, nothing made up. */
export function NodesScreen() {
  return (
    <div className="flex h-full flex-col px-5">
      <h3 className="display pt-2 text-[22px] font-bold">Nodes</h3>
      <div className="-mt-6 scale-[0.82]">
        <NodeRack play />
      </div>
      <div className="-mt-6 flex flex-col items-center text-center">
        <Tag tone="accent">Coming soon</Tag>
        <p className="display mt-2.5 text-[20px] font-bold">Run your own node</p>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-mute">Buy a node on the networks you use and keep it running from your wallet.</p>
      </div>
      <ul className="mt-5 grid grid-cols-3 gap-2">
        {[
          { icon: ShoppingBag, t: "Buy" },
          { icon: Gauge, t: "Monitor" },
          { icon: ShieldCheck, t: "Manage" },
        ].map((f) => (
          <li key={f.t} className="flex flex-col items-center gap-1.5 rounded-[18px] bg-surface py-3 ring-1 ring-line/60">
            <f.icon size={17} className="text-accent-soft" aria-hidden />
            <span className="text-[12px] font-extrabold">{f.t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Settings: the app's own switches, live. */
export function SettingsScreen() {
  const [bio, setBio] = useState(true);
  const [hide, setHide] = useState(false);
  const [dev, setDev] = useState(false);
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden px-4">
      <h3 className="display px-1 pt-2 text-[22px] font-bold">Settings</h3>
      <CardList>
        <Toggle title="Unlock with fingerprint" icon={<Fingerprint size={18} />} enabled={bio} onClick={() => setBio((v) => !v)} />
        <Toggle title="Hide balances" icon={<EyeOff size={18} />} enabled={hide} onClick={() => setHide((v) => !v)} />
        <Toggle title="Developer mode" meta="Local networks. Asks for your PIN." icon={<Code2 size={18} />} enabled={dev} onClick={() => setDev((v) => !v)} />
      </CardList>
      <CardList>
        {[
          { icon: Globe, t: "Networks" },
          { icon: Link2, t: "Connected apps" },
          { icon: Info, t: "About Nira" },
        ].map((r) => (
          <div key={r.t} className="flex h-14 items-center gap-3.5 px-5">
            <r.icon size={18} className="text-mute" aria-hidden />
            <span className="flex-1 text-[15px] font-bold">{r.t}</span>
            <ChevronRight size={18} className="text-faint" aria-hidden />
          </div>
        ))}
      </CardList>
    </div>
  );
}
