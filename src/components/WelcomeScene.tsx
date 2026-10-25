"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import GradientASCII from "./wallet/animated/GradientASCII";
import { BrandMark } from "./wallet/Logo";
import { haptic } from "./wallet/ui";

/**
 * The wallet's welcome scene (nira-wallet/src/screens/onboarding/Onboarding.tsx),
 * lifted out of its pager so any 0..2 `position` can drive it; here, page scroll.
 *
 * 0: the tile inside a ring of glyphs. 1: the coins out on a turning chain.
 * 2: the chain climbs into a padlock shackle over the tile; it then opens on a
 * loop, lets one coin out and clicks shut. A tap opens it at once.
 *
 * Geometry is the app's, at a fixed orbit radius; the whole stage is scaled to
 * fit its box, so proportions never drift.
 */

const COINS = ["btc", "eth", "sol", "usdt", "bnb", "usdc", "pol", "arb"] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const TAU = Math.PI * 2;
const formed = (p: number) => clamp01((p - 1) / 0.92);

/** The app's orbit on a typical phone; the stage scales from here. */
const R = 124;
const STAGE = 380;
const LINKS = 56;
const ARCH = 32;
const LEG = 40;
const FOOT = -40;
const SHACKLE_LENGTH = 2 * LEG + Math.PI * ARCH;
const SHACKLE_LINKS = 14;
const LIFT = 18;
const SWING = (150 * Math.PI) / 180;
const LOCK_DROP = 28;
const MINT = "rgb(27 236 138)";

const shacklePoint = (s: number) => {
  const d = s * SHACKLE_LENGTH;
  if (d < LEG) return { x: -ARCH, y: FOOT - d, deg: 90 };
  if (d < LEG + Math.PI * ARCH) {
    const phi = Math.PI + (d - LEG) / ARCH;
    return { x: ARCH * Math.cos(phi), y: FOOT - LEG + ARCH * Math.sin(phi), deg: (phi * 180) / Math.PI + 90 };
  }
  return { x: ARCH, y: FOOT - LEG + (d - LEG - Math.PI * ARCH), deg: 90 };
};

const STOPS = [
  [19, 89, 168],
  [18, 138, 163],
  [27, 236, 138],
];
const linkColour = (t: number) => {
  const u = 1 - Math.abs(t * 2 - 1);
  const [a, b, k] = u < 0.5 ? [STOPS[0], STOPS[1], u * 2] : [STOPS[1], STOPS[2], u * 2 - 1];
  return `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * k)).join(" ")})`;
};
const COLOURS = Array.from({ length: LINKS }, (_, i) => linkColour(i / LINKS));

const nearestTurn = (from: number, to: number) => {
  let d = (to - from) % 180;
  if (d > 90) d -= 180;
  if (d < -90) d += 180;
  return from + d;
};
const fold = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

const Chain = ({ t, spin, lift, swing, open }: { t: number; spin: number; lift: number; swing: number; open: boolean }) => {
  const k = (TAU * R) / LINKS / 14.1;
  const th = (spin * Math.PI) / 180;
  const cos = Math.cos(th);
  const sin = Math.sin(th);

  const rank = new Map<number, number>();
  if (t > 0) {
    const fromTop = Array.from({ length: LINKS }, (_, j) => fold((j / LINKS) * TAU + th + Math.PI / 2));
    Array.from({ length: LINKS }, (_, j) => j)
      .sort((a, b) => Math.abs(fromTop[a]) - Math.abs(fromTop[b]))
      .slice(0, SHACKLE_LINKS)
      .sort((a, b) => fromTop[a] - fromTop[b])
      .forEach((j, i) => rank.set(j, i));
  }

  const links = [];
  for (let j = 0; j < LINKS; j++) {
    const a = (j / LINKS) * TAU;
    let x = R * Math.cos(a);
    let y = R * Math.sin(a);
    let deg = (a * 180) / Math.PI + 90;
    let opacity = 1;
    const place = rank.get(j);
    if (t > 0) {
      const spot = place === undefined ? { x: 0, y: 0, deg: deg + spin } : shacklePoint(place / (SHACKLE_LINKS - 1));
      let wx = spot.x;
      let wy = spot.y;
      let wdeg = spot.deg;
      if (place !== undefined) {
        wy -= lift;
        if (swing > 0) {
          const c = Math.cos(swing * SWING);
          wx = -ARCH + (wx + ARCH) * c;
          const rad = (wdeg * Math.PI) / 180;
          wdeg = (Math.atan2(Math.sin(rad), Math.cos(rad) * c) * 180) / Math.PI;
          opacity = 0.6 + 0.4 * ((c + 1) / 2);
        }
      }
      const lx = wx * cos + wy * sin;
      const ly = -wx * sin + wy * cos;
      x += (lx - x) * t;
      y += (ly - y) * t;
      deg += (nearestTurn(deg, wdeg - spin) - deg) * t;
      if (place === undefined) opacity = 1 - t;
    }
    const colour = open && place !== undefined ? MINT : COLOURS[j];
    const at = `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(2)})`;
    const look = { opacity, stroke: colour, transition: "stroke 220ms ease-out" };
    const kk = place === undefined ? k : k * (1 + 0.22 * t);
    links.push(
      j % 2 === 0 ? (
        <rect key={j} transform={at} x={-8.8 * kk} y={-3.8 * kk} width={17.6 * kk} height={7.6 * kk} rx={3.8 * kk} fill="none" strokeWidth={1.9 * kk} style={look} />
      ) : (
        <line key={j} transform={at} x1={-8.2 * kk} y1="0" x2={8.2 * kk} y2="0" strokeWidth={2.8 * kk} strokeLinecap="round" style={look} />
      ),
    );
  }
  return (
    <svg width="2" height="2" viewBox="-1 -1 2 2" className="absolute -left-px -top-px overflow-visible">
      {links}
    </svg>
  );
};

const Coin = ({ file, index, position, spin }: { file: string; index: number; position: MotionValue<number>; spin: MotionValue<number> }) => {
  const base = (index / COINS.length) * TAU - Math.PI / 2;
  const transform = useTransform([position, spin], ([p, s]: number[]) => {
    const out = ease(clamp01(p));
    const ang = base + (s * Math.PI) / 180;
    const inward = p > 1 ? 1 - easeInOut(formed(p)) : 1;
    const x = R * out * Math.cos(ang) * inward;
    const y = R * out * Math.sin(ang) * inward;
    const scale = (0.5 + 0.5 * out) * (0.6 + 0.4 * inward);
    return `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(3)})`;
  });
  const opacity = useTransform(position, (p) => clamp01((p - 0.15) / 0.6) * (p > 1 ? 1 - formed(p) : 1));
  return (
    <motion.span className="absolute left-0 top-0 size-10" style={{ transform, opacity }}>
      <img src={`/coins/${file}.png`} alt="" draggable={false} className="block size-10 max-w-none rounded-full ring-[3px] ring-canvas" />
    </motion.span>
  );
};

export default function WelcomeScene({ position }: { position: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { margin: "160px" });

  // Scale the fixed-size stage to the box it sits in.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setScale(Math.max(0.72, Math.min(1.7, Math.min(el.clientWidth, el.clientHeight) / STAGE)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const spin = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (reduce || !seen || position.get() > 1) return;
    spin.set((spin.get() + delta * 0.006) % 360);
  });

  const [glyphsAway, setGlyphsAway] = useState(false);
  const [morph, setMorph] = useState(0);
  const [onLast, setOnLast] = useState(false);
  useMotionValueEvent(position, "change", (p) => {
    setGlyphsAway(p > 0.8);
    setMorph(p > 1 ? easeInOut(formed(p)) : 0);
    setOnLast(p > 1.9);
  });

  const lift = useMotionValue(0);
  const swing = useMotionValue(0);
  const [shackle, setShackle] = useState({ lift: 0, swing: 0 });
  useMotionValueEvent(lift, "change", (v) => setShackle((s) => ({ ...s, lift: v })));
  useMotionValueEvent(swing, "change", (v) => setShackle((s) => ({ ...s, swing: v })));
  const out = useMotionValue(0);
  const outX = useTransform(out, (v) => ARCH - 20 + 44 * ease(v));
  const outY = useTransform(out, (v) => FOOT - 16 - 118 * v);
  const outOpacity = useTransform(out, [0, 0.14, 0.7, 1], [0, 1, 1, 0]);
  const outScale = useTransform(out, [0, 1], [0.9, 0.78]);
  const touch = useMotionValue(0);
  const touchScale = useTransform(touch, [0, 1], [1, 1.4]);
  const touchOpacity = useTransform(touch, [0, 0.15, 1], [0, 0.75, 0]);
  const click = useMotionValue(0);
  const clickScale = useTransform(click, [0, 1], [1, 1.12]);
  const clickOpacity = useTransform(click, [0, 0.2, 1], [0, 0.9, 0]);
  const tileNod = useMotionValue(1);
  const [open, setOpen] = useState(false);
  const busy = useRef(false);
  const [sent, setSent] = useState(0);

  const unlockOnce = async () => {
    if (busy.current) return;
    busy.current = true;
    const d = (seconds: number) => (reduce ? 0 : seconds);
    const pause = (ms: number) => new Promise((done) => window.setTimeout(done, reduce ? 0 : ms));
    animate(touch, [0, 1], { duration: d(0.7), ease: [0.23, 1, 0.32, 1] });
    await pause(260);
    setOpen(true);
    await animate(lift, LIFT, { duration: d(0.3), ease: [0.23, 1, 0.32, 1] });
    await animate(swing, 1, { duration: d(0.6), ease: [0.65, 0, 0.35, 1] });
    animate(out, [0, 1], { duration: d(1.5), ease: [0.3, 0.7, 0.4, 1] });
    await pause(1150);
    await animate(swing, 0, { duration: d(0.5), ease: [0.65, 0, 0.35, 1] });
    await animate(lift, 0, { duration: d(0.22), ease: [0.5, 0, 0.9, 0.4] });
    setOpen(false);
    animate(tileNod, [1, 0.95, 1], { duration: d(0.3), ease: [0.23, 1, 0.32, 1] });
    animate(click, [0, 1], { duration: d(0.5), ease: [0.23, 1, 0.32, 1] });
    out.set(0);
    busy.current = false;
    setSent((n) => n + 1);
  };

  // On the last stage it opens by itself every few seconds while in view.
  // Under reduced motion it stays locked until tapped.
  useEffect(() => {
    if (!onLast || !seen || reduce) return;
    const timer = window.setTimeout(unlockOnce, sent === 0 ? 700 : 2200);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLast, seen, reduce, sent]);

  const glyphOpacity = useTransform(position, [0, 0.7], [1, 0]);
  const glyphScale = useTransform(position, [0, 1], [1, 1.4]);
  const tileScale = useTransform(position, [0, 1, 2], [1, 0.82, 0.92]);
  const chainOpacity = useTransform(position, [0.2, 0.8], [0, 0.9]);
  const chainScale = useTransform(position, (p) => ease(clamp01(p)));
  const sceneY = useTransform(position, (p) => (p > 1 ? LOCK_DROP * easeInOut(formed(p)) : 0));

  return (
    <div ref={box} className="relative size-full">
      <div aria-hidden className="absolute inset-0">
        <motion.span
          className="absolute inset-0 [mask-image:radial-gradient(closest-side,#000_55%,transparent)]"
          style={{ opacity: glyphOpacity, scale: glyphScale }}
        >
          {seen && (
            <GradientASCII
              shape="eclipse"
              paused={glyphsAway}
              cellSize={14}
              density={0.75}
              glyphOpacity={0.9}
              glow={0}
              gradientOpacity={0.45}
              grain={0.03}
              softness={0.7}
              speed={0.6}
              clickEffect="burst"
            />
          )}
        </motion.span>

        <div className="absolute left-1/2 top-1/2" style={{ transform: `scale(${scale})` }}>
          <motion.div className="absolute left-0 top-0" style={{ y: sceneY }}>
            <motion.div className="absolute left-0 top-0" style={{ rotate: spin, scale: morph > 0 ? 1 : chainScale, opacity: chainOpacity }}>
              <Chain t={morph} spin={spin.get()} lift={shackle.lift} swing={shackle.swing} open={open} />
            </motion.div>
            {COINS.map((file, i) => (
              <Coin key={file} file={file} index={i} position={position} spin={spin} />
            ))}
            <motion.span className="absolute left-0 top-0 size-10" style={{ x: outX, y: outY, opacity: outOpacity, scale: outScale }}>
              <img src={`/coins/${COINS[sent % COINS.length]}.png`} alt="" draggable={false} className="block size-10 max-w-none rounded-full ring-[3px] ring-canvas" />
            </motion.span>

            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
              <motion.span className="absolute inset-1 rounded-[20%] ring-2 ring-accent" style={{ scale: touchScale, opacity: touchOpacity }} />
              <motion.span className="absolute inset-1 rounded-[20%] ring-2 ring-accent" style={{ scale: clickScale, opacity: clickOpacity }} />
              <motion.span className="block" style={{ scale: tileScale }}>
                <motion.span className="block" style={{ scale: tileNod }}>
                  <BrandMark size={104} className="max-w-none" />
                </motion.span>
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>

      {onLast && (
        <button
          type="button"
          onClick={() => {
            haptic(12);
            unlockOnce();
          }}
          aria-label="Approve one payment"
          className="absolute left-1/2 top-1/2 h-[200px] w-[160px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[28px]"
        />
      )}
    </div>
  );
}
