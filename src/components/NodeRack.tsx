import type { CSSProperties } from "react";
import { BrandMark } from "./wallet/Logo";

/** Each blade's status lights: how long each blink takes, so no two agree. */
const LIGHTS = [
  [1.1, 2.3, 1.7],
  [1.9, 1.3, 2.6],
  [2.4, 1.6, 1.2],
];

/** The Nodes tab's rack (nira-wallet/src/screens/nodes/Nodes.tsx): three
 *  server blades in CSS 3D, the logo on the lid, lights blinking out of step.
 *  `play` starts the blades dropping in, so it happens when it is seen. */
export function NodeRack({ play }: { play: boolean }) {
  return (
    <div className="relative mx-auto h-[300px] w-full max-w-[360px]" aria-hidden>
      <div className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 scale-[1.15]">
        <div className="animate-rack-float [perspective:900px]">
          <div className="relative h-[150px] w-[210px] [transform:rotateX(56deg)_rotateZ(-38deg)] [transform-style:preserve-3d]">
            {LIGHTS.map((blinks, i) => {
              const top = i === LIGHTS.length - 1;
              return (
                <div
                  key={i}
                  className={`animate-blade-in absolute inset-0 flex items-center gap-3 overflow-hidden rounded-[18px] px-4 ring-1 ring-white/10 ${play ? "" : "paused"}`}
                  style={
                    {
                      "--z": `${i * 52}px`,
                      transform: "translateZ(var(--z))",
                      animationDelay: `${120 + i * 110}ms`,
                      background: "linear-gradient(135deg, rgb(var(--raised)), rgb(var(--surface)))",
                      boxShadow: "-5px 6px 0 rgb(var(--line)), -10px 18px 28px -10px rgb(0 0 0 / 0.6)",
                    } as CSSProperties
                  }
                >
                  {top && <span className="animate-lid-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />}
                  <span className="brand-fill h-[70%] w-1.5 shrink-0 rounded-full" />
                  <span className="flex flex-col gap-1.5">
                    {blinks.map((s, j) => (
                      <span
                        key={j}
                        className={`keep-motion animate-breathe size-2 rounded-full ${j === 0 ? "bg-accent" : j === 1 ? "bg-accent-deep" : "bg-accent-alt"}`}
                        style={{ animationDuration: `${s}s` }}
                      />
                    ))}
                  </span>
                  {top ? (
                    <span className="flex flex-1 justify-center">
                      <BrandMark size={58} />
                    </span>
                  ) : (
                    <span className="flex flex-1 flex-col gap-2">
                      <span className="h-1.5 w-[70%] rounded-full bg-line" />
                      <span className="h-1.5 w-[45%] rounded-full bg-line" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
