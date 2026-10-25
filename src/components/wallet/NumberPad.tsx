"use client";
import { useRef } from "react";
import { Delete } from "lucide-react";
import { haptic, press } from "./ui";
import { typeKey } from "@/lib/amount";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] as const;

/**
 * The amount keypad: the wallet's own digits instead of the system keyboard,
 * so the layout never jumps and the amount stays the biggest thing on screen.
 * Holding delete clears. A hardware keyboard works too.
 */
export const NumberPad = ({
  value,
  onChange,
  decimals = 18,
  disabled = false,
}: {
  value: string;
  onChange: (next: string) => void;
  decimals?: number;
  disabled?: boolean;
}) => {
  const latest = useRef(value);
  latest.current = value;
  const hold = useRef(0);

  function key(k: string) {
    if (disabled) return;
    const next = typeKey(latest.current, k, decimals);
    if (next === latest.current) {
      haptic(25);
      return;
    }
    haptic(6);
    onChange(next);
  }


  return (
    <div role="group" aria-label="Amount keypad" className="grid grid-cols-3 gap-1.5">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          disabled={disabled}
          aria-label={k === "back" ? "Delete, hold to clear" : k === "." ? "Decimal point" : k}
          onClick={() => key(k)}
          onPointerDown={() => {
            if (k !== "back") return;
            window.clearTimeout(hold.current);
            hold.current = window.setTimeout(() => {
              haptic(20);
              onChange("");
            }, 550);
          }}
          onPointerUp={() => window.clearTimeout(hold.current)}
          onPointerLeave={() => window.clearTimeout(hold.current)}
          style={press(0.96)}
          className="pressable display grid h-[46px] place-items-center rounded-[22px] text-[24px] font-semibold text-ink active:bg-surface disabled:opacity-40"
        >
          {k === "back" ? <Delete size={24} strokeWidth={1.9} /> : k}
        </button>
      ))}
    </div>
  );
};
