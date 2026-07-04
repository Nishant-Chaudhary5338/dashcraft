import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  WidgetState,
  Position,
  Size,
  WidgetSettings,
  WidgetConfig,
} from "../types";
import { createWidgetId } from "../types";
import { DEFAULT_WIDGET_SIZE, DEFAULT_WIDGET_POSITION } from "../utils/constants";

// ============================================================
// Store Interface
// ============================================================

/**
 * Shape of the global dashboard Zustand store: all persisted widget state
 * plus every action used to mutate it.
 *
 * This is the store's public contract — the type parameter passed to
 * {@link useDashboardStore}'s `create<DashboardStoreState>()`. Read fields
 * via the hook with a selector (see {@link useDashboardStore} for the
 * recommended pattern); call actions directly off the value returned by
 * the hook (or via `useDashboardStore.getState()` outside components).
 *
 * @see useDashboardStore
 * @see selectIsEditMode
 * @see selectWidgets
 * @see selectWidgetById
 * @see selectWidgetCount
 */
export interface DashboardStoreState {
  /** Whether the dashboard is currently in edit mode (drag/resize/settings UI enabled). */
  isEditMode: boolean;
  /** Whether a widget resize gesture is currently in progress; used to suppress conflicting interactions while dragging the resize handle. */
  isResizing: boolean;
  /** All widgets on the dashboard, keyed by their plain string id (matches {@link WidgetState.id} once branded). */
  widgets: Record<string, WidgetState>;
  /** Highest z-index currently assigned to any widget; used to compute the next value on {@link bringToFront} or {@link addWidget}. */
  maxZIndex: number;
  /** Increments on every {@link resetLayout} so `DashboardCard` instances (keyed off this value) unmount and re-register from scratch. */
  layoutGeneration: number;

  /**
   * Flips {@link isEditMode} to its opposite value.
   * @example
   * ```tsx
   * const toggleEditMode = useDashboardStore((s) => s.toggleEditMode);
   * <button onClick={toggleEditMode}>Toggle Edit Mode</button>
   * ```
   */
  toggleEditMode: () => void;

  /**
   * Sets {@link isEditMode} to an explicit value.
   * @param isEditMode - `true` to enter edit mode, `false` to exit it.
   */
  setEditMode: (isEditMode: boolean) => void;

  /**
   * Sets {@link isResizing} to an explicit value; call from resize-handle
   * drag start/end handlers.
   * @param isResizing - `true` while a resize gesture is active.
   */
  setIsResizing: (isResizing: boolean) => void;

  /**
   * Creates a new widget from a {@link WidgetConfig} and adds it to
   * {@link widgets}. No-ops if a widget with the same `id` already exists
   * (existing widgets are never overwritten by re-registration). Assigns
   * `maxZIndex + 1` as the new widget's z-index and falls back to
   * `DEFAULT_WIDGET_POSITION` / `DEFAULT_WIDGET_SIZE` when the config omits
   * `defaultPosition` / `defaultSize`.
   * @param config - Widget configuration, keyed by `config.id`.
   * @see registerWidget
   */
  addWidget: (config: WidgetConfig) => void;

  /**
   * Removes a widget from {@link widgets} by id. No-ops if the id is not
   * present.
   * @param id - Widget id to remove.
   * @see unregisterWidget
   */
  removeWidget: (id: string) => void;

  /**
   * Updates a widget's {@link Position}. No-ops if the widget doesn't exist.
   * @param id - Widget id to update.
   * @param position - New position to apply.
   */
  updateWidgetPosition: (id: string, position: Position) => void;

  /**
   * Updates a widget's {@link Size}. No-ops if the widget doesn't exist.
   * @param id - Widget id to update.
   * @param size - New size to apply.
   */
  updateWidgetSize: (id: string, size: Size) => void;

  /**
   * Shallow-merges partial {@link WidgetSettings} into a widget's existing
   * settings. No-ops if the widget doesn't exist.
   * @param id - Widget id to update.
   * @param settings - Partial settings to merge over the current ones.
   */
  updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void;

  /**
   * Raises a widget above all others by assigning it `maxZIndex + 1`. Call
   * on widget focus/click so the interacted-with widget stacks on top.
   * No-ops if the widget doesn't exist.
   * @param id - Widget id to bring to front.
   */
  bringToFront: (id: string) => void;

  /**
   * Registers a widget type if it isn't already present in {@link widgets};
   * a thin, idempotent wrapper over {@link addWidget} intended for mount-time
   * registration (e.g. from `DashboardCard`), where calling it repeatedly on
   * re-render must not reset an existing widget's position/size.
   * @param id - Widget id to register.
   * @param config - Widget configuration used only if not already registered.
   * @see addWidget
   */
  registerWidget: (id: string, config: WidgetConfig) => void;

  /**
   * Removes a widget on unmount; a thin wrapper over {@link removeWidget}.
   * @param id - Widget id to unregister.
   * @see removeWidget
   */
  unregisterWidget: (id: string) => void;

  /**
   * Atomically applies position and size updates to multiple widgets in a
   * single `set` call, preventing intermediate re-renders (and races) that
   * would occur from calling {@link updateWidgetPosition} /
   * {@link updateWidgetSize} in a loop. Ids not present in {@link widgets}
   * are silently skipped.
   * @param updates - List of `{ id, position, size }` updates to apply.
   * @example
   * ```ts
   * useDashboardStore.getState().batchUpdatePositionsAndSizes([
   *   { id: "kpi-1", position: { x: 0, y: 0 }, size: { width: 200, height: 120 } },
   *   { id: "kpi-2", position: { x: 220, y: 0 }, size: { width: 200, height: 120 } },
   * ]);
   * ```
   */
  batchUpdatePositionsAndSizes: (updates: Array<{ id: string; position: Position; size: Size }>) => void;

  /**
   * Serializes the current {@link widgets} map to JSON and persists it to
   * `localStorage` under the key `` `dashcraft-layout-${key}` ``. Fails
   * silently (logs to `console.error`) if `localStorage` is unavailable or
   * throws (e.g. quota exceeded, private browsing).
   * @param key - Layout identifier; distinguishes multiple saved layouts.
   * @see loadLayout
   */
  saveLayout: (key: string) => void;

  /**
   * Reads a previously saved layout from `localStorage` (key
   * `` `dashcraft-layout-${key}` ``) and replaces {@link widgets} with the
   * parsed result. No-ops if no layout is stored under that key. Fails
   * silently (logs to `console.error`) on a missing/corrupt entry or a
   * `localStorage` access error.
   * @param key - Layout identifier previously used with {@link saveLayout}.
   * @see saveLayout
   */
  loadLayout: (key: string) => void;

  /**
   * Clears all widgets, resets {@link maxZIndex} to `0`, and increments
   * {@link layoutGeneration} so widget hosts keyed on that value remount.
   * This does not touch anything persisted via {@link saveLayout} — it only
   * clears the in-memory store.
   */
  resetLayout: () => void;

  /**
   * Reads a single widget's state without subscribing to the whole
   * {@link widgets} map. Prefer this (or {@link selectWidgetById}) over
   * `useDashboardStore((s) => s.widgets[id])` when you only need one
   * widget's data and want to avoid re-rendering on unrelated widget
   * changes — though as a plain getter (not a selector) it still reads a
   * fresh snapshot on every call rather than memoizing.
   * @param id - Widget id to look up.
   * @returns The widget's state, or `undefined` if not registered.
   * @see selectWidgetById
   */
  getWidgetState: (id: string) => WidgetState | undefined;

  /** @returns All currently registered widget ids. */
  getWidgetIds: () => string[];

  /**
   * @returns The number of currently registered widgets.
   * @see selectWidgetCount
   */
  getWidgetCount: () => number;
}

// ============================================================
// Store Implementation
// ============================================================

/**
 * Global Zustand store holding all dashboard widget state and layout
 * actions. This is the single source of truth consumed by `DashboardCard`,
 * drag/resize handlers, and any custom widget UI.
 *
 * Built with `subscribeWithSelector`, so fine-grained subscriptions (via
 * `useDashboardStore.subscribe(selector, listener)`) are available outside
 * React in addition to the hook form used in components. Always read state
 * through a selector — subscribing to the whole store re-renders on every
 * widget move/resize.
 *
 * @example
 * ```tsx
 * import { useDashboardStore, selectIsEditMode } from "@dashcraft/core";
 *
 * function EditModeToggle() {
 *   const isEdit = useDashboardStore(selectIsEditMode);
 *   const toggleEditMode = useDashboardStore((s) => s.toggleEditMode);
 *
 *   return (
 *     <button onClick={toggleEditMode}>
 *       {isEdit ? "Done Editing" : "Edit Dashboard"}
 *     </button>
 *   );
 * }
 * ```
 * @see DashboardStoreState
 * @see selectIsEditMode
 * @see selectWidgets
 * @see selectWidgetById
 * @see selectWidgetCount
 */
export const useDashboardStore = create<DashboardStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    isEditMode: false,
    isResizing: false,
    widgets: {},
    maxZIndex: 0,
    layoutGeneration: 0,

    // Edit Mode Actions
    toggleEditMode: () => {
      set((state) => ({ isEditMode: !state.isEditMode }));
    },

    setEditMode: (isEditMode: boolean) => {
      set({ isEditMode });
    },

    setIsResizing: (isResizing: boolean) => {
      set({ isResizing });
    },

    // Widget CRUD Actions
    addWidget: (config: WidgetConfig) => {
      const id = config.id;
      const widgetId = createWidgetId(id);

      set((state) => {
        if (state.widgets[id]) return state;

        const newZIndex = state.maxZIndex + 1;

        const newWidget: WidgetState = {
          id: widgetId,
          position: config.defaultPosition ?? DEFAULT_WIDGET_POSITION,
          size: config.defaultSize ?? DEFAULT_WIDGET_SIZE,
          zIndex: newZIndex,
          settings: (typeof config.settings === "object" ? config.settings : {}) as WidgetSettings,
          type: config.type ?? "custom",
          ...(config.title !== undefined && { title: config.title }),
          isMinimized: false,
        };

        return {
          widgets: { ...state.widgets, [id]: newWidget },
          maxZIndex: newZIndex,
        };
      });
    },

    removeWidget: (id: string) => {
      set((state) => {
        const { [id]: removed, ...rest } = state.widgets;
        if (!removed) return state;
        return { widgets: rest };
      });
    },

    updateWidgetPosition: (id: string, position: Position) => {
      set((state) => {
        const widget = state.widgets[id];
        if (!widget) return state;

        return {
          widgets: {
            ...state.widgets,
            [id]: { ...widget, position },
          },
        };
      });
    },

    updateWidgetSize: (id: string, size: Size) => {
      set((state) => {
        const widget = state.widgets[id];
        if (!widget) return state;

        return {
          widgets: {
            ...state.widgets,
            [id]: { ...widget, size },
          },
        };
      });
    },

    updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => {
      set((state) => {
        const widget = state.widgets[id];
        if (!widget) return state;

        return {
          widgets: {
            ...state.widgets,
            [id]: {
              ...widget,
              settings: { ...widget.settings, ...settings },
            },
          },
        };
      });
    },

    bringToFront: (id: string) => {
      set((state) => {
        const widget = state.widgets[id];
        if (!widget) return state;

        const newZIndex = state.maxZIndex + 1;

        return {
          widgets: {
            ...state.widgets,
            [id]: { ...widget, zIndex: newZIndex },
          },
          maxZIndex: newZIndex,
        };
      });
    },

    batchUpdatePositionsAndSizes: (updates) => {
      set((state) => {
        const newWidgets = { ...state.widgets };
        for (const update of updates) {
          const widget = newWidgets[update.id];
          if (widget) {
            newWidgets[update.id] = {
              ...widget,
              position: update.position,
              size: update.size,
            };
          }
        }
        return { widgets: newWidgets };
      });
    },

    registerWidget: (id: string, config: WidgetConfig) => {
      const state = get();
      if (state.widgets[id]) return;
      state.addWidget(config);
    },

    unregisterWidget: (id: string) => {
      get().removeWidget(id);
    },

    // Layout Actions
    saveLayout: (key: string) => {
      const state = get();
      const layout = JSON.stringify(state.widgets);
      try {
        localStorage.setItem(`dashcraft-layout-${key}`, layout);
      } catch (error) {
        console.error("[DashCraft] Failed to save layout:", error);
      }
    },

    loadLayout: (key: string) => {
      try {
        const layout = localStorage.getItem(`dashcraft-layout-${key}`);
        if (!layout) return;

        const widgets = JSON.parse(layout) as Record<string, WidgetState>;
        set({ widgets });
      } catch (error) {
        console.error("[DashCraft] Failed to load layout:", error);
      }
    },

    resetLayout: () => {
      set((state) => ({ widgets: {}, maxZIndex: 0, layoutGeneration: state.layoutGeneration + 1 }));
    },

    // Selectors
    getWidgetState: (id: string) => {
      return get().widgets[id];
    },

    getWidgetIds: () => {
      return Object.keys(get().widgets);
    },

    getWidgetCount: () => {
      return Object.keys(get().widgets).length;
    },
  }))
);

// ============================================================
// Typed Selectors (for performance)
// ============================================================

/**
 * Selects {@link DashboardStoreState.isEditMode}.
 *
 * Pass directly to {@link useDashboardStore} so the component only
 * re-renders when edit mode itself changes, not on every widget update.
 * @param state - The full store state (supplied by Zustand).
 * @returns Whether the dashboard is currently in edit mode.
 * @example
 * ```ts
 * const isEditMode = useDashboardStore(selectIsEditMode);
 * ```
 * @see useDashboardStore
 */
export const selectIsEditMode = (state: DashboardStoreState): boolean =>
  state.isEditMode;

/**
 * Selects {@link DashboardStoreState.widgets}, the full widget map keyed by
 * id.
 *
 * Subscribing to this re-renders on any widget change (position, size,
 * settings, add/remove). Prefer {@link selectWidgetById} when only one
 * widget's state is needed.
 * @param state - The full store state (supplied by Zustand).
 * @returns The widget map.
 * @example
 * ```ts
 * const widgets = useDashboardStore(selectWidgets);
 * const widgetList = Object.values(widgets);
 * ```
 * @see selectWidgetById
 * @see selectWidgetCount
 */
export const selectWidgets = (
  state: DashboardStoreState
): Record<string, WidgetState> => state.widgets;

/**
 * Curried selector factory for a single widget by id.
 *
 * Call once with the target `id` to get a selector suitable for
 * {@link useDashboardStore}; only that widget's changes trigger a
 * re-render.
 * @param id - Widget id to look up.
 * @returns A selector function taking store state and returning the
 * matching {@link WidgetState}, or `undefined` if not registered.
 * @example
 * ```ts
 * const widget = useDashboardStore(selectWidgetById("revenue-chart"));
 * ```
 * @see DashboardStoreState.getWidgetState
 */
export const selectWidgetById =
  (id: string) =>
  (state: DashboardStoreState): WidgetState | undefined =>
    state.widgets[id];

/**
 * Selects the current number of registered widgets.
 * @param state - The full store state (supplied by Zustand).
 * @returns The widget count.
 * @example
 * ```ts
 * const count = useDashboardStore(selectWidgetCount);
 * ```
 * @see DashboardStoreState.getWidgetCount
 */
export const selectWidgetCount = (state: DashboardStoreState): number =>
  Object.keys(state.widgets).length;