"use client";
import React, { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { haptic } from "./ui";

/**
 * Slide to confirm: the handle has to be dragged to the end, so a stray tap
 * or a pocket touch never sends. Used where a tap would commit money (the
 * send and swap reviews). Keyboard: arrows step it, End commits.
 *
 * Fills its container's width. Colours are theme tokens; the handle, done
 * and error fills are fixed colours, so their text is fixed too.
 */

export type SlideCommitPhase = "idle" | "pending" | "done" | "error";

export interface SlideCommitProps {
  label?: ReactNode;
  doneLabel?: ReactNode;
  errorLabel?: ReactNode;
  /** Runs at the end of the slide. A promise shows a spinner until it settles. */
  onConfirm?: () => void | Promise<unknown>;
  onDone?: () => void;
  onError?: (reason: unknown) => void;
  height?: number;
  radius?: number;
  speed?: number;
  returnBounce?: number;
  landingDip?: number;
  /** How long "done" shows before the handle returns. 0 keeps it. */
  holdMs?: number;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

type Sample = [number, number];
type Grip = { id: number; grab: number | null; moved: boolean; hist: Sample[] };
type MoveEvent = { pointerId: number; clientX: number; timeStamp: number };
type UpEvent = { pointerId: number };

const PAD = 4;
const SQUASH_MAX = 0.08;
const SQUASH_DIV = 110;
const MIN_PENDING = 300;
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const SHAKE = [0, -5, 5, -3, 3, -1, 0];
const DARK = "#03160E";
const STYLE = `
@keyframes sc-spin { to { transform: rotate(360deg); } }
.sc-spinner { animation: sc-spin 1s linear infinite; animation-play-state: paused; }
.sc-root[data-phase='pending'] .sc-spinner { animation-play-state: running; }
@keyframes sc-shimmer { from { background-position: 150% 0; } to { background-position: -50% 0; } }
.sc-hint {
  background: linear-gradient(90deg, rgb(var(--mute)) 40%, rgb(var(--ink)) 50%, rgb(var(--mute)) 60%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: sc-shimmer 2.6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .sc-hint { animation: none; color: rgb(var(--mute)); }
  .sc-spinner { animation: sc-breathe 1.4s ease-in-out infinite; animation-play-state: paused; }
  .sc-root[data-phase='pending'] .sc-spinner { animation-play-state: running; }
  @keyframes sc-breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
}
`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const velocityOf = (hist: Sample[]) => {
  if (hist.length < 2) return 0;
  const [t0, x0] = hist[0];
  const [t1, x1] = hist[hist.length - 1];
  return ((x1 - x0) / Math.max(1, t1 - t0)) * 1000;
};

const Spinner = ({ size }: { size: number }) => (
  <svg className="sc-spinner block" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeOpacity="0.25" />
    <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const SlideCommit: React.FC<SlideCommitProps> = ({
  label = "Slide to confirm",
  doneLabel = "Confirmed",
  errorLabel = "Something went wrong",
  onConfirm,
  onDone,
  onError,
  height = 56,
  radius = 999,
  speed = 50,
  returnBounce = 0.38,
  landingDip = 0.026,
  holdMs = 1500,
  disabled = false,
  icon,
  className = "",
}) => {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<SlideCommitPhase>("idle");
  const [held, setHeld] = useState(false);
  const [width, setWidth] = useState(320);

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const grip = useRef<Grip | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const homeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const run = useRef(0);
  const unwatch = useRef<(() => void) | null>(null);
  const live = useRef<{ move: (e: MoveEvent) => void; up: (e: UpEvent) => void }>({ move: () => {}, up: () => {} });
  const lastPercent = useRef(0);

  // The track is as wide as its container.
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setWidth(Math.max(height * 2, Math.round(el.getBoundingClientRect().width)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [height]);

  const GRIP = height - PAD * 2;
  const INNER = width - PAD * 2;
  const TRAVEL = Math.max(1, INNER - GRIP);
  const r = clamp(radius, 0, height / 2);
  const gripR = Math.max(0, r - PAD);
  const k = 260 + (clamp(speed, 0, 100) / 100) * 640;
  const mass = 0.9;
  const critical = 2 * Math.sqrt(k * mass);
  const commitSpring = { type: "spring" as const, stiffness: k, damping: critical, mass };
  const homeSpring = { ...commitSpring, damping: critical * (1 - clamp(returnBounce, 0, 0.5)) };

  const x = useMotionValue(0);
  const anchor = useMotionValue(0);
  const shown = useMotionValue(1);
  const spin = useMotionValue(0);
  const pulse = useMotionValue(1);
  const shake = useMotionValue(0);
  const seen = useTransform(x, (v) => clamp(v, 0, TRAVEL));
  const edge = useTransform([seen, anchor], ([v, a]: number[]) => v + GRIP + clamp(a - v, 0, TRAVEL));
  const clip = useTransform(edge, (R) => `inset(0 ${INNER - R}px 0 0 round ${gripR}px)`);
  const content = useTransform([seen, edge], ([v, R]: number[]) => `translateX(${(v + R) / 2 - INNER / 2}px)`);
  const shape = useTransform(x, (v) => {
    const q = 1 - Math.min(SQUASH_MAX, Math.max(0, -v) / SQUASH_DIV);
    return `scale(${q}, ${1 / q})`;
  });
  const origin = useTransform(seen, (v) => `${v}px 50%`);
  const say = useTransform(seen, [0, TRAVEL * 0.55], [1, 0]);
  const arrow = useTransform(
    [seen, shown],
    ([v, on]: number[]) => on * clamp(1 - (v - TRAVEL * 0.55) / (TRAVEL * 0.4), 0, 1),
  );
  const trackTransform = useTransform([shake, pulse], ([s, p]: number[]) => `translateX(${s}px) scale(${p})`);

  const labelText = typeof label === "string" ? label : "Slide to confirm";
  useMotionValueEvent(seen, "change", (v) => {
    const percent = Math.round((v / TRAVEL) * 100);
    if (percent === lastPercent.current || !capsuleRef.current) return;
    lastPercent.current = percent;
    capsuleRef.current.setAttribute("aria-valuenow", String(percent));
    capsuleRef.current.setAttribute("aria-valuetext", `${labelText}, ${percent}%`);
  });

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(homeTimer.current);
      unwatch.current?.();
      run.current += 1;
    },
    [],
  );

  const local = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return (clientX - rect.left) / (rect.width / width || 1);
  };

  const goHome = (velocity: number) => {
    if (reduce) animate(x, 0, { duration: 0.2, ease: EASE_OUT });
    else animate(x, 0, { ...homeSpring, velocity: Math.min(0, velocity) });
  };

  const settle = () => {
    setPhase("idle");
    animate(shown, 1, { duration: 0.2, delay: 0.12 });
    if (reduce) anchor.set(0);
    else animate(anchor, 0, { type: "spring", duration: 0.3, bounce: 0 });
  };

  const resolve = (viaKey: boolean) => {
    setPhase("done");
    anchor.set(x.get());
    animate(spin, 0, { duration: 0.12 });
    if (reduce) x.set(0);
    else {
      animate(x, 0, commitSpring);
      if (!viaKey && landingDip > 0) {
        animate(pulse, [1, 1 - landingDip, 1], { duration: 0.46, times: [0, 0.62, 1], ease: EASE_OUT, delay: 0.1 });
      }
    }
    onDone?.();
    if (holdMs > 0) timer.current = setTimeout(settle, holdMs);
  };

  const reject = (reason: unknown) => {
    setPhase("error");
    haptic(30);
    onError?.(reason);
    animate(spin, 0, { duration: 0.12 });
    animate(shown, 1, { duration: 0.2, delay: 0.12 });
    if (reduce) goHome(0);
    else {
      animate(shake, SHAKE, { duration: 0.45, ease: EASE_OUT });
      homeTimer.current = setTimeout(() => {
        if (!grip.current) goHome(0);
      }, 300);
    }
    timer.current = setTimeout(() => setPhase("idle"), Math.max(holdMs, 1500));
  };

  const commit = (viaKey: boolean) => {
    clearTimeout(timer.current);
    haptic(18);
    const id = ++run.current;
    x.set(TRAVEL);
    let out: void | Promise<unknown>;
    try {
      out = onConfirm?.();
    } catch (reason) {
      reject(reason);
      return;
    }
    const pending = out && typeof out.then === "function" ? out : null;
    if (!pending) {
      animate(shown, 0, { duration: 0.12 });
      resolve(viaKey);
      return;
    }
    setPhase("pending");
    animate(shown, 0, { duration: 0.2 });
    animate(spin, 1, { duration: 0.2 });
    const t0 = performance.now();
    const later = (fn: () => void) => {
      setTimeout(
        () => {
          if (id === run.current) fn();
        },
        Math.max(0, MIN_PENDING - (performance.now() - t0)),
      );
    };
    pending.then(
      () => later(() => resolve(viaKey)),
      (reason) => later(() => reject(reason)),
    );
  };

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || grip.current || phase === "pending" || phase === "done" || e.button !== 0) return;
    x.stop();
    haptic(6);
    grip.current = { id: e.pointerId, grab: null, moved: false, hist: [] };
    setHeld(true);
    try {
      trackRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    unwatch.current?.();
    // Only real touches move it: a script cannot slide it for the user.
    const onMove = (ev: PointerEvent) => ev.isTrusted && live.current.move(ev);
    const onUp = (ev: PointerEvent) => ev.isTrusted && live.current.up(ev);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    unwatch.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      unwatch.current = null;
    };
  };

  const move = (e: MoveEvent) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    const at = local(e.clientX);
    if (g.grab === null) {
      g.grab = at - x.get();
      return;
    }
    const next = clamp(at - g.grab, 0, TRAVEL);
    if (Math.abs(next - x.get()) > 0.5) g.moved = true;
    g.hist.push([e.timeStamp, next]);
    if (g.hist.length > 4) g.hist.shift();
    x.set(next);
  };

  const up = (e: UpEvent) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    unwatch.current?.();
    try {
      trackRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    setHeld(false);
    if (x.get() >= TRAVEL) commit(false);
    else if (g.moved) goHome(velocityOf(g.hist));
  };
  live.current = { move, up };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || phase === "pending" || phase === "done") return;
    const step = TRAVEL / 10;
    if (e.key === "End") {
      e.preventDefault();
      commit(true);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(TRAVEL, x.get() + step);
      x.set(next);
      if (next >= TRAVEL) commit(true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      x.set(Math.max(0, x.get() - step));
    } else if (e.key === "Home" || e.key === "Escape") {
      e.preventDefault();
      if (grip.current) up({ pointerId: grip.current.id });
      else x.set(0);
    }
  };

  const iconSize = Math.round(GRIP * 0.42);
  const done = phase === "done";

  return (
    <div
      ref={rootRef}
      className={`sc-root group relative block w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50${className ? ` ${className}` : ""}`}
      data-phase={phase}
      data-held={held ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      style={
        {
          height,
          // Fixed fills (accent, up, down): their text is fixed too.
          "--sc-track": "rgb(var(--surface))",
          "--sc-ink": "rgb(var(--accent))",
          "--sc-ok": "rgb(var(--up))",
          "--sc-no": "rgb(var(--down))",
          "--sc-on-ink": DARK,
          "--sc-on-ok": DARK,
          "--sc-on-no": "#ffffff",
          "--sc-radius": `${r}px`,
          "--sc-grip-r": `${gripR}px`,
          "--sc-pad": `${PAD}px`,
        } as CSSProperties
      }
    >
      <style>{STYLE}</style>
      <motion.div
        ref={trackRef}
        className="relative h-full w-full cursor-grab touch-none select-none rounded-[var(--sc-radius)] ring-1 ring-line/60 [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] [background:var(--sc-track)] group-data-[held]:cursor-grabbing group-data-[phase=done]:cursor-default group-data-[phase=pending]:cursor-default"
        style={{ transform: trackTransform }}
        onPointerDown={down}
      >
        <motion.span
          className="pointer-events-none absolute inset-0 grid place-items-center whitespace-nowrap pl-[calc(var(--sc-pad)*2+48px)] pr-4 text-[15px] font-extrabold leading-none"
          style={{ opacity: say }}
          aria-hidden="true"
        >
          <span className="sc-hint [grid-area:1/1] [transition:opacity_200ms_ease,filter_200ms_ease] group-data-[phase=error]:opacity-0 group-data-[phase=error]:blur-[2px]">
            {label}
          </span>
          <span className="text-down [grid-area:1/1] opacity-0 blur-[2px] [transition:opacity_200ms_ease,filter_200ms_ease] group-data-[phase=error]:opacity-100 group-data-[phase=error]:blur-none">
            {errorLabel}
          </span>
        </motion.span>
        <motion.div
          ref={capsuleRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={labelText}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-busy={phase === "pending" || undefined}
          aria-disabled={disabled || undefined}
          className="absolute left-[var(--sc-pad)] top-[var(--sc-pad)] h-[calc(100%-var(--sc-pad)*2)] w-[calc(100%-var(--sc-pad)*2)] outline-none [background:var(--sc-ink)] [color:var(--sc-on-ink)] [transition:background-color_200ms_ease,color_200ms_ease] focus-visible:[box-shadow:inset_0_0_0_2px_rgb(var(--accent-soft))] group-data-[phase=done]:[background:var(--sc-ok)] group-data-[phase=done]:[color:var(--sc-on-ok)] group-data-[phase=error]:[background:var(--sc-no)] group-data-[phase=error]:[color:var(--sc-on-no)]"
          style={{ clipPath: clip, transform: shape, transformOrigin: origin }}
          onKeyDown={onKeyDown}
        >
          <motion.div className="absolute inset-0" style={{ transform: content }}>
            <motion.span
              className="pointer-events-none absolute inset-0 flex items-center justify-center [transition:filter_200ms_ease] group-data-[phase=pending]:blur-[2px] [&>svg]:block"
              style={{ opacity: arrow }}
              aria-hidden="true"
            >
              {icon ?? <ArrowRight size={iconSize} strokeWidth={2.4} />}
            </motion.span>
            <motion.span
              className="pointer-events-none absolute inset-0 flex items-center justify-center blur-[2px] [transition:filter_200ms_ease] group-data-[phase=pending]:blur-none"
              style={{ opacity: spin }}
              aria-hidden="true"
            >
              <Spinner size={iconSize} />
            </motion.span>
            <motion.span
              className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap text-base font-semibold leading-none [&>svg]:block"
              aria-hidden="true"
              initial={false}
              animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.95 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <Check size={Math.round(GRIP * 0.42)} strokeWidth={2.8} />
              {doneLabel}
            </motion.span>
          </motion.div>
        </motion.div>
        <span className="sr-only" aria-live="polite">
          {phase === "pending" ? "Working" : phase === "done" ? doneLabel : phase === "error" ? errorLabel : ""}
        </span>
      </motion.div>
    </div>
  );
};

