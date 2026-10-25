import type { CSSProperties } from "react";

/**
 * Shared-element names for View Transitions.
 *
 * Two screens that give an element the same name have it morph from one
 * place to the other when navigation swaps them (see `hooks/nav.ts`). A name
 * must be unique on a screen and a valid CSS identifier, so ids such as
 * `evm:1:native` are flattened.
 */
export const vtName = (name: string) => `vt-${name.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

/** Spread onto an element: `<img {...vt(`asset-${id}-icon`)} />`. Pass
 *  `false` to leave it unnamed (when another element on screen has it). */
export const vt = (name: string, on = true): { style?: CSSProperties } =>
  on ? { style: { viewTransitionName: vtName(name) } as CSSProperties } : {};

/** The same, merged into an existing style object. */
export const vtStyle = (name: string, style: CSSProperties = {}, on = true): CSSProperties =>
  on ? ({ ...style, viewTransitionName: vtName(name) } as CSSProperties) : style;
