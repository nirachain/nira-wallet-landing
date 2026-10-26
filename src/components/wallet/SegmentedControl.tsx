"use client";
import { useRef, type PointerEvent } from "react";
import { haptic } from "./ui";

/**
 * A pill track with an ink thumb on the selected option. Tap an option, or
 * put a finger down and slide: the thumb follows across the options, with a
 * tick at each one, and the choice is whatever it is let go on.
 */
export const SegmentedControl = <T extends string>({
  options,
  selected,
  onSelect,
  label,
}: {
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
  label?: string;
}) => {
  const index = options.indexOf(selected);
  const track = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  const pick = (e: PointerEvent) => {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    const i = Math.min(options.length - 1, Math.max(0, Math.floor(((e.clientX - box.left) / box.width) * options.length)));
    if (options[i] !== selected) {
      haptic(5);
      onSelect(options[i]);
    }
  };

  return (
    <div
      ref={track}
      className="relative grid touch-pan-y rounded-full bg-surface p-1 ring-1 ring-line/60"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      role="tablist"
      aria-label={label}
      onPointerDown={(e) => {
        scrubbing.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        pick(e);
      }}
      onPointerMove={(e) => scrubbing.current && pick(e)}
      onPointerUp={() => (scrubbing.current = false)}
      onPointerCancel={() => (scrubbing.current = false)}
    >
      {index >= 0 && (
        <span
          aria-hidden
          className="absolute bottom-1 left-1 top-1 rounded-full bg-ink transition-transform duration-[240ms] ease-out"
          style={{
            width: `calc((100% - 8px) / ${options.length})`,
            transform: `translateX(${index * 100}%)`,
          }}
        />
      )}
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={selected === option}
          // Pointer picks happen on the track; this keeps keyboard and
          // screen readers working.
          onClick={(e) => {
            if (e.detail === 0) onSelect(option);
          }}
          className={`relative z-10 h-11 truncate rounded-full px-2 text-[14px] font-extrabold transition-colors duration-150 ${
            selected === option ? "text-canvas" : "text-mute"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
