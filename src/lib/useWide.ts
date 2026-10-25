"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px)";
const subscribe = (fn: () => void) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", fn);
  return () => m.removeEventListener("change", fn);
};

/** True on desktop widths (Tailwind's `lg`). False while prerendering. */
export const useWide = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
