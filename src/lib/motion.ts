/** True when the visitor asked for less motion. Client only. */
export const motionReduced = () =>
  typeof window !== "undefined" &&
  (document.documentElement.classList.contains("reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);
