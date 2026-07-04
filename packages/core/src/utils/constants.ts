// ============================================================
// DashCraft Constants
// ============================================================

/**
 * Prefix prepended to the `localStorage`/`sessionStorage` key used when
 * persisting a dashboard layout, so DashCraft's keys don't collide with
 * unrelated app storage.
 *
 * The dashboard store's {@link DashboardStoreState.saveLayout} and
 * {@link DashboardStoreState.loadLayout} actions build their storage key as
 * `` `dashcraft-layout-${key}` `` directly (not via this constant); the
 * persistence adapters in `persistence.ts` do use this constant. Both
 * currently produce the same prefix, but keep this in mind if either is
 * changed independently.
 * @default "dashcraft-layout-"
 * @see createPersistenceAdapter
 */
export const STORAGE_KEY_PREFIX = "dashcraft-layout-";

/**
 * Default `{ width, height }` (in pixels) applied to a new widget when its
 * {@link WidgetConfig.defaultSize} is omitted.
 * @default { width: 300, height: 200 }
 * @see DashboardStoreState.addWidget
 */
export const DEFAULT_WIDGET_SIZE = { width: 300, height: 200 } as const;

/**
 * Default `{ x, y }` canvas position (in pixels) applied to a new widget
 * when its {@link WidgetConfig.defaultPosition} is omitted.
 * @default { x: 0, y: 0 }
 * @see DashboardStoreState.addWidget
 */
export const DEFAULT_WIDGET_POSITION = { x: 0, y: 0 } as const;

/** Minimum interval, in milliseconds, between drag-position updates; caps updates to ~60fps. */
export const THROTTLE_DRAG_MS = 16; // ~60fps

/** Debounce delay, in milliseconds, before committing a resize gesture's final size. */
export const DEBOUNCE_RESIZE_MS = 150;

/** Debounce delay, in milliseconds, before auto-saving layout changes to persistence. */
export const DEBOUNCE_AUTOSAVE_MS = 1000;