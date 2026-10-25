"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { animate, motion, useReducedMotion, useSpring, useTransform, useVelocity, useMotionValue, type MotionValue } from "motion/react";
import { ArrowLeftRight, Compass, Home, Network, Settings2 } from "lucide-react";
import { haptic } from "./wallet/ui";

/**
 * The wallet's tab bar (nira-wallet/src/components/BottomNav.tsx) inside a
 * phone demo. Same pill: it travels on a spring, stretches with its own
 * speed, icons swell as it passes, and a finger slid along the bar carries it.
 * `active` can also be driven from outside (the tour moves it as you scroll).
 */
export const TABS = [
  { label: "Wallet", icon: Home },
  { label: "Swap", icon: ArrowLeftRight },
  { label: "Explore", icon: Compass },
  { label: "Nodes", icon: Network },
  { label: "Settings", icon: Settings2 },
] as const;

const TRAVEL = { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.9 };

const TabIcon = ({ Icon, on, i, x, cell }: { Icon: typeof Home; on: boolean; i: number; x: MotionValue<number>; cell: number }) => {
  const scale = useTransform(x, (v) => 1 + 0.14 * Math.max(0, 1 - Math.abs(v - i * cell) / Math.max(cell, 1)));
  return (
    <motion.span className="relative grid place-items-center" style={{ scale }}>
      <Icon size={20} strokeWidth={on ? 2.4 : 1.9} aria-hidden />
    </motion.span>
  );
};

export function TabBar({ active, onChange }: { active: number; onChange?: (i: number) => void }) {
  const row = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [local, setLocal] = useState(active);
  useEffect(() => setLocal(active), [active]);

  const [cell, setCell] = useState(0);
  const x = useMotionValue(0);
  const speed = useVelocity(x);
  const stretchX = useSpring(useTransform(speed, (v) => (reduce ? 1 : 1 + Math.min(Math.abs(v) / 1700, 0.75))), { stiffness: 650, damping: 42 });
  const stretchY = useSpring(useTransform(speed, (v) => (reduce ? 1 : 1 - Math.min(Math.abs(v) / 7000, 0.16))), { stiffness: 650, damping: 42 });

  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => setCell(el.clientWidth / TABS.length);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
  const under = (clientX: number) => {
    const box = row.current?.getBoundingClientRect();
    if (!box) return local;
    return Math.min(TABS.length - 1, Math.max(0, Math.floor(((clientX - box.left) / box.width) * TABS.length)));
  };

  return (
    <nav aria-label="Wallet tabs (demo)" className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4">
      <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-canvas via-canvas/85 to-transparent" />
      <div className="w-full rounded-full bg-[#0b1118] p-1.5 shadow-float ring-1 ring-white/10">
        <div
          ref={row}
          className="relative grid touch-none grid-cols-5"
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
            const box = e.currentTarget.getBoundingClientRect();
            x.set(Math.min(cell * (TABS.length - 1), Math.max(0, e.clientX - box.left - cell / 2)));
            const i = under(e.clientX);
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
            const i = under(e.clientX);
            pick(i);
            if (cell) animate(x, i * cell, reduce ? { duration: 0 } : TRAVEL);
          }}
          onPointerCancel={() => {
            const was = drag.current?.on;
            drag.current = null;
            if (was && cell) animate(x, local * cell, reduce ? { duration: 0 } : TRAVEL);
          }}
        >
          <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex justify-center" style={{ width: cell || "20%", x }}>
            <motion.span className="block h-full w-[46px] rounded-full bg-accent" style={{ scaleX: stretchX, scaleY: stretchY }} />
          </motion.span>
          {TABS.map(({ label, icon: Icon }, i) => {
            const on = i === local;
            return (
              <button
                key={label}
                type="button"
                aria-label={label}
                aria-current={on ? "page" : undefined}
                onClick={() => {
                  if (dragged.current) {
                    dragged.current = false;
                    return;
                  }
                  haptic();
                  pick(i);
                }}
                className={`relative grid h-[46px] cursor-pointer place-items-center rounded-full transition-colors duration-150 ${on ? "text-accent-ink" : "text-white/55 hover:text-white"}`}
              >
                <TabIcon Icon={Icon} on={on} i={i} x={x} cell={cell} />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
