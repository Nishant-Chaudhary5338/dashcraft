// ============================================================
// DashCraft Constants
// ============================================================

export const STORAGE_KEY_PREFIX = "dashcraft-layout-";

export const DEFAULT_WIDGET_SIZE = { width: 300, height: 200 } as const;
export const DEFAULT_WIDGET_POSITION = { x: 0, y: 0 } as const;

export const THROTTLE_DRAG_MS = 16; // ~60fps
export const DEBOUNCE_RESIZE_MS = 150;
export const DEBOUNCE_AUTOSAVE_MS = 1000;