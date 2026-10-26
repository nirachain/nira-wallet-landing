"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion, useSpring, useTransform, useVelocity, useMotionValue, type MotionValue } from "motion/react";
import { ArrowLeftRight, Compass, Home, Network, Settings2, type LucideIcon } from "lucide-react";
import { haptic } from "./wallet/ui";

/**
 * The wallet's tab bar (nira-wallet/src/components/BottomNav.tsx) as a
 * reusable capsule. The mint pill travels on a spring and stretches with its
 * own speed; each icon swells as it passes; a finger slid along the bar
 * carries the pill and springs it onto the nearest item on release. `active`
 * can be driven from outside (scroll position, a demo).
 */
export type PillItem = { label: string; icon: LucideIcon };

export const TABS: PillItem[] = [
  { label: "Wallet", icon: Home },
  { label: "Swap", icon: ArrowLeftRight },
  { label: "Explore", icon: Compass },
  { label: "Nodes", icon: Network },
  { label: "Settings", icon: Settings2 },
];

const TRAVEL = { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.9 };

const PillIcon = ({ Icon, on, i, x, cell, size }: { Icon: LucideIcon; on: boolean; i: number; x: MotionValue<number>; cell: number; size: number }) => {
  const scale = useTransform(x, (v) => 1 + 0.14 * Math.max(0, 1 - Math.abs(v - i * cell) / Math.max(cell, 1)));
  return (
    <motion.span className="relative grid place-items-center" style={{ scale }}>
      <Icon size={size} strokeWidth={on ? 2.4 : 1.9} aria-hidden />
    </motion.span>
  );
};

export function PillBar({
  items,
  active,
  onChange,
  label,
  tips = false,
  height = 46,
}: {
  items: PillItem[];
  active: number;
  onChange?: (i: number) => void;
  label: string;
  /** Show each item's name above it on hover (fine pointers only). */
  tips?: boolean;
  height?: number;
}) {
  const row = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [local, setLocal] = useState(active);
  useEffect(() => setLocal(active), [active]);
  const n = items.length;

  const [cell, setCell] = useState(0);
  const x = useMotionValue(0);
  const speed = useVelocity(x);
  const stretchX = useSpring(useTransform(speed, (v) => (reduce ? 1 : 1 + Math.min(Math.abs(v) / 1700, 0.75))), { stiffness: 650, damping: 42 });
  const stretchY = useSpring(useTransform(speed, (v) => (reduce ? 1 : 1 - Math.min(Math.abs(v) / 7000, 0.16))), { stiffness: 650, damping: 42 });

  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => setCell(el.offsetWidth / n);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [n]);

  const drag = useRef<{ id: number; x: number; on: boolean } | null>(null);
  const dragged = useRef(false);
  const placed = useRef(false);
  useEffect(() => {
    if (!cell || drag.current?.on) return;
    const to = local * cell;
    if (!placed.current || reduce) {
      placed.current = true;
      x.set(to);
      return;
    }
    const run = animate(x, to, TRAVEL);
    return () => run.stop();
  }, [local, cell, reduce, x]);

  const pick = (i: number) => {
    setLocal(i);
    onChange?.(i);
  };
  // The bar may be scaled (inside a shrunk phone): map screen px to its own.
  const localX = (el: HTMLElement, clientX: number) => {
    const box = el.getBoundingClientRect();
    return (clientX - box.left) / (box.width / el.offsetWidth || 1);
  };
  const under = (el: HTMLElement, clientX: number) => Math.min(n - 1, Math.max(0, Math.floor(localX(el, clientX) / (el.offsetWidth / n))));

  return (
    <nav aria-label={label} className="w-full rounded-full bg-[#0b1118] p-1.5 shadow-float ring-1 ring-white/10" data-theme="dark">
      <div
        ref={row}
        className="relative grid touch-none"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        onPointerDown={(e) => {
          drag.current = { id: e.pointerId, x: e.clientX, on: false };
          dragged.current = false;
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          if (!d.on) {
            if (Math.abs(e.clientX - d.x) < 8) return;
            d.on = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }
          x.set(Math.min(cell * (n - 1), Math.max(0, localX(e.currentTarget, e.clientX) - cell / 2)));
          const i = under(e.currentTarget, e.clientX);
          if (i !== local) {
            haptic(5);
            setLocal(i);
          }
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d?.on) return;
          dragged.current = true;
          const i = under(e.currentTarget, e.clientX);
          pick(i);
          if (cell) animate(x, i * cell, reduce ? { duration: 0 } : TRAVEL);
        }}
        onPointerCancel={() => {
          const was = drag.current?.on;
          drag.current = null;
          if (was && cell) animate(x, local * cell, reduce ? { duration: 0 } : TRAVEL);
        }}
      >
        <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex justify-center" style={{ width: cell || `${100 / n}%`, x }}>
          <motion.span className="block h-full rounded-full bg-accent" style={{ width: height, scaleX: stretchX, scaleY: stretchY }} />
        </motion.span>
        {items.map(({ label: name, icon: Icon }, i) => {
          const on = i === local;
          return (
            <button
              key={name}
              type="button"
              aria-label={name}
              aria-current={on ? "true" : undefined}
              onClick={() => {
                if (dragged.current) {
                  dragged.current = false;
                  return;
                }
                haptic();
                pick(i);
              }}
              className={`group/tab relative grid cursor-pointer place-items-center rounded-full transition-colors duration-150 ${
                on ? "text-accent-ink" : "text-white/55 hover:text-white"
              }`}
              style={{ height }}
            >
              <PillIcon Icon={Icon} on={on} i={i} x={x} cell={cell} size={height > 44 ? 20 : 18} />
              {tips && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-full mb-3 whitespace-nowrap rounded-full bg-[#0b1118] px-3 py-1.5 text-[12px] font-bold text-white opacity-0 ring-1 ring-white/10 transition-[opacity,transform] duration-150 ease-out [transform:translateY(4px)_scale(0.97)] group-hover/tab:opacity-100 group-hover/tab:[transform:none]"
                >
                  {name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** The app's own tab bar, sitting at the bottom of a phone demo. */
export function TabBar({ active, onChange }: { active: number; onChange?: (i: number) => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4">
      <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-canvas via-canvas/85 to-transparent" />
      <PillBar items={TABS} active={active} onChange={onChange} label="Wallet tabs (demo)" />
    </div>
  );
}
