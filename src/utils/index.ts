import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================
// Class Name Utility (cn)
// ============================================================

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================
// Constants
// ============================================================

export const STORAGE_KEY_PREFIX = "dashcraft-layout-";

export const DEFAULT_WIDGET_SIZE = { width: 300, height: 200 } as const;
export const DEFAULT_WIDGET_POSITION = { x: 0, y: 0 } as const;

export const THROTTLE_DRAG_MS = 16; // ~60fps
export const DEBOUNCE_RESIZE_MS = 150;
export const DEBOUNCE_AUTOSAVE_MS = 1000;

export const DEBUG = false; // Set to true to enable debug logging

// ============================================================
// Re-exports
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
