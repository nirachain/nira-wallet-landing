"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { haptic } from "./ui";

export type SwipeAction = {
  label: string;
  icon: ReactNode;
  /** Fill of the action's disc. */
  tone?: "accent" | "ink" | "raised" | "down";
  onAct: () => void;
};

/** One row open at a time: opening another closes the last. */
const closers = new Set<() => void>();

const ACTION_W = 68;
const SPRING = { type: "spring" as const, stiffness: 520, damping: 42 };

const TONE = {
  accent: "bg-accent text-accent-ink",
  ink: "bg-ink text-canvas",
  raised: "bg-raised text-ink",
  down: "bg-down text-white",
};

/**
 * A row that slides sideways to show actions behind it. Swiping left shows
 * `end` actions, swiping right shows `start` ones. It locks to horizontal
 * only after a sideways move, so the list still scrolls freely. A tap on an
 * open row closes it instead of opening the row.
 */
export const SwipeRow = ({
  start = [],
  end = [],
  children,
}: {
  start?: SwipeAction[];
  end?: SwipeAction[];
  children: ReactNode;
}) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const [open, setOpen] = useState(false);
  const startW = start.length * ACTION_W;
  const endW = end.length * ACTION_W;
  const crossed = useRef<0 | 1 | -1>(0);
  // Actions grow in as the row uncovers them.
  const startScale = useTransform(x, [0, startW || 1], [0.85, 1]);
  const endScale = useTransform(x, [-(endW || 1), 0], [1, 0.85]);

  const close = () => {
    setOpen(false);
    if (reduce) x.set(0);
    else animate(x, 0, SPRING);
  };

  useEffect(() => {
    closers.add(close);
    return () => {
      closers.delete(close);
    };
  });

  const settle = (velocity: number) => {
    const at = x.get() + velocity * 0.12;
    let to = 0;
    if (at > startW * 0.5 && startW) to = startW;
    else if (at < -endW * 0.5 && endW) to = -endW;
    if (to !== 0) {
      closers.forEach((c) => c !== close && c());
      setOpen(true);
    } else setOpen(false);
    if (reduce) x.set(to);
    else animate(x, to, { ...SPRING, velocity });
  };

  const act = (a: SwipeAction) => {
    haptic(10);
    close();
    a.onAct();
  };

  return (
    <div className="relative -mx-2 overflow-hidden rounded-[22px]">
      {start.length > 0 && (
        <div aria-hidden={!open} className="absolute inset-y-0 left-0 flex items-center gap-1 pl-2" style={{ width: startW }}>
          {start.map((a) => (
            <motion.button key={a.label} type="button" onClick={() => act(a)} style={{ scale: startScale }} tabIndex={open ? 0 : -1} className="flex w-[60px] flex-col items-center gap-1 text-[11px] font-bold text-ink">
              <span className={`grid size-11 place-items-center rounded-full ${TONE[a.tone ?? "raised"]}`}>{a.icon}</span>
              {a.label}
            </motion.button>
          ))}
        </div>
      )}
      {end.length > 0 && (
        <div aria-hidden={!open} className="absolute inset-y-0 right-0 flex items-center justify-end gap-1 pr-2" style={{ width: endW }}>
          {end.map((a) => (
            <motion.button key={a.label} type="button" onClick={() => act(a)} style={{ scale: endScale }} tabIndex={open ? 0 : -1} className="flex w-[60px] flex-col items-center gap-1 text-[11px] font-bold text-ink">
              <span className={`grid size-11 place-items-center rounded-full ${TONE[a.tone ?? "raised"]}`}>{a.icon}</span>
              {a.label}
            </motion.button>
          ))}
        </div>
      )}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -endW, right: startW }}
        dragElastic={0.12}
        dragMomentum={false}
        style={{ x, touchAction: "pan-y" }}
        onDrag={() => {
          // A tick when the row passes the point where it would stay open.
          const v = x.get();
          const side = v > startW * 0.5 && startW ? 1 : v < -endW * 0.5 && endW ? -1 : 0;
          if (side !== crossed.current) {
            crossed.current = side;
            if (side) haptic(8);
          }
        }}
        onDragEnd={(_, info) => settle(info.velocity.x)}
        onClickCapture={(e) => {
          if (open) {
            e.stopPropagation();
            e.preventDefault();
            close();
          }
        }}
        className="relative bg-canvas px-2"
      >
        {children}
      </motion.div>
    </div>
  );
};
