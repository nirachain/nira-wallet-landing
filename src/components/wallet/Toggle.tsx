"use client";
import type { ReactNode } from "react";
import { haptic } from "./ui";

/** Switch row. Lives inside a CardList. */
export const Toggle = ({
  title,
  meta,
  icon,
  enabled,
  onClick,
  disabled = false,
}: {
  title: string;
  meta?: string;
  icon?: ReactNode;
  enabled: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    disabled={disabled}
    onClick={() => {
      haptic();
      onClick();
    }}
    className="group flex min-h-[68px] w-full items-center gap-3.5 px-5 py-3 text-left transition-colors duration-200 active:bg-raised/50 disabled:opacity-45"
  >
    {icon && (
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
          enabled ? "bg-accent/15 text-accent-soft" : "bg-raised text-mute"
        }`}
        aria-hidden
      >
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block text-[15px] font-bold text-ink">{title}</span>
      {meta && <span className="mt-0.5 block text-[13px] leading-[1.45] text-mute">{meta}</span>}
    </span>
    <span
      aria-hidden
      className={`relative h-8 w-[54px] shrink-0 rounded-full p-1 transition-colors duration-300 ${
        enabled ? "bg-accent" : "bg-raised ring-1 ring-inset ring-line"
      }`}
    >
      {/* The thumb stretches while held, like a native switch. */}
      <span
        className={`block h-6 w-6 rounded-full shadow-[0_2px_6px_rgb(0_0_0/0.3)] transition-[transform,width,background-color] duration-200 ease-out group-active:w-[30px] ${
          enabled ? "translate-x-[22px] bg-accent-ink group-active:translate-x-4" : "translate-x-0 bg-faint"
        }`}
      />
    </span>
  </button>
);
