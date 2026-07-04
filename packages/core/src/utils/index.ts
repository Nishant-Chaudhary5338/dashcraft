import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================
// Class Name Utility (cn)
// ============================================================

/**
 * Merges Tailwind CSS class names, resolving conflicting utility classes
 * (via `tailwind-merge`) after combining conditional class inputs (via
 * `clsx`).
 *
 * Use this instead of template-literal string concatenation whenever a
 * component accepts a `className` prop that needs to be combined with
 * internal classes — `clsx`'s conditional syntax (arrays, objects,
 * booleans) is supported, and `tailwind-merge` ensures a later conflicting
 * class (e.g. `p-4` vs `p-2`) wins deterministically instead of both
 * being emitted.
 * @param inputs - Any number of class values: strings, arrays, objects
 * (`{ "className": boolean }`), or falsy values (ignored).
 * @returns The merged, deduplicated class string.
 * @example
 * ```tsx
 * import { cn } from "@dashcraft/core";
 *
 * <div className={cn("p-2 text-sm", isActive && "bg-blue-500", className)} />
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================
// Constants
// ============================================================

/**
 * Prefix prepended to the `localStorage`/`sessionStorage` key used by the
 * built-in persistence adapters (see {@link createPersistenceAdapter}) when
 * saving/loading a dashboard layout.
 *
 * Note: this is a duplicate definition of the same constant in
 * `./constants.ts` — both currently hold the identical literal value; keep
 * them in sync if either changes.
 * @default "dashcraft-layout-"
 * @see createPersistenceAdapter
 */
export const STORAGE_KEY_PREFIX = "dashcraft-layout-";

/**
 * Default `{ width, height }` (in pixels) applied to a new widget when its
 * `defaultSize` is omitted. Duplicate of the constant in `./constants.ts`.
 * @default { width: 300, height: 200 }
 */
export const DEFAULT_WIDGET_SIZE = { width: 300, height: 200 } as const;

/**
 * Default `{ x, y }` canvas position (in pixels) applied to a new widget
 * when its `defaultPosition` is omitted. Duplicate of the constant in
 * `./constants.ts`.
 * @default { x: 0, y: 0 }
 */
export const DEFAULT_WIDGET_POSITION = { x: 0, y: 0 } as const;

/** Minimum interval, in milliseconds, between drag-position updates; caps updates to ~60fps. */
export const THROTTLE_DRAG_MS = 16; // ~60fps

/** Debounce delay, in milliseconds, before committing a resize gesture's final size. */
export const DEBOUNCE_RESIZE_MS = 150;

/** Debounce delay, in milliseconds, before auto-saving layout changes to persistence. */
export const DEBOUNCE_AUTOSAVE_MS = 1000;

/**
 * Global debug-logging flag for the DashCraft core package.
 *
 * Internal package code may check this before emitting verbose
 * `console.log` diagnostics; toggling it requires editing this source
 * (there is no runtime setter exported), so it is primarily useful when
 * working on `@dashcraft/core` itself rather than as a consumer-facing
 * feature flag.
 * @default false
 */
export const DEBUG = false; // Set to true to enable debug logging

// ============================================================
// Re-exports
//
// Public entry point for DashCraft's utility module: class-name merging,
// shared constants, animation presets, and the persistence adapter
// factory. Import from here or from the package root `@dashcraft/core`.
// ============================================================

export { createPersistenceAdapter } from "./persistence";
export type { PersistenceAdapter } from "../types";

export {
  animationPresets,
  getAnimationPreset,
  springToCss,
  getCssTransition,
  springPreset,
  snappyPreset,
  gentlePreset,
  tweenPreset,
  bouncePreset,
  stiffPreset,
  slowPreset,
} from "./animations";
export type { AnimationPresetKey } from "./animations";
