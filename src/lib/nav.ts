"use client";

/** Scrolls to a section, through Lenis when it is running. */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: id === "top" ? 0 : -72, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
