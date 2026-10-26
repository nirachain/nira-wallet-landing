const NETS = [
  { name: "Bitcoin", icon: "/coins/btc.png" },
  { name: "Ethereum", icon: "/coins/eth.png" },
  { name: "Solana", icon: "/coins/sol.png" },
  { name: "Arbitrum One", icon: "/coins/arb.png" },
  { name: "Optimism", disc: "#FF0420", text: "OP" },
  { name: "Polygon", icon: "/coins/pol.png" },
  { name: "BNB Chain", icon: "/coins/bnb.png" },
  { name: "Avalanche", disc: "#E84142", text: "AV" },
  { name: "Any EVM network you add", plus: true },
];

const Row = ({ hidden }: { hidden?: boolean }) => (
  <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden}>
    {NETS.map((n) => (
      <li key={n.name} className="flex items-center gap-3 whitespace-nowrap">
        {n.icon ? (
          <img src={n.icon} alt="" className="size-9 rounded-full" />
        ) : n.plus ? (
          <span className="grid size-9 place-items-center rounded-full border-2 border-dashed border-line text-[18px] font-bold text-mute">+</span>
        ) : (
          <span className="display grid size-9 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: n.disc }}>
            {n.text}
          </span>
        )}
        <span className="display text-[20px] font-bold tracking-[-0.03em]">{n.name}</span>
      </li>
    ))}
  </ul>
);

/** The networks built in, on a band that runs on its own (linear: constant
 *  motion) and stops while the pointer is on it. */
export function Ticker() {
  return (
    <section aria-label="Networks built in" className="relative border-y border-line bg-surface py-6">
      <p className="sr-only">{NETS.map((n) => n.name).join(", ")}.</p>
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex animate-[marquee_42s_linear_infinite] group-hover:[animation-play-state:paused]">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
