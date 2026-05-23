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

export interface DashboardStoreState {
  isEditMode: boolean;
  isResizing: boolean;
  widgets: Record<string, WidgetState>;
  maxZIndex: number;
  /** Increments on every resetLayout so DashboardCards can re-register */
  layoutGeneration: number;

  toggleEditMode: () => void;
  setEditMode: (isEditMode: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;

  addWidget: (config: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: Position) => void;
  updateWidgetSize: (id: string, size: Size) => void;
  updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void;
  bringToFront: (id: string) => void;
  registerWidget: (id: string, config: WidgetConfig) => void;
  unregisterWidget: (id: string) => void;

  /** Batch update positions and sizes atomically (prevents race conditions) */
  batchUpdatePositionsAndSizes: (updates: Array<{ id: string; position: Position; size: Size }>) => void;

  saveLayout: (key: string) => void;
  loadLayout: (key: string) => void;
  resetLayout: () => void;

  getWidgetState: (id: string) => WidgetState | undefined;
  getWidgetIds: () => string[];
  getWidgetCount: () => number;
}

// ============================================================
// Store Implementation
// ============================================================

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

export const selectIsEditMode = (state: DashboardStoreState): boolean =>
  state.isEditMode;

export const selectWidgets = (
  state: DashboardStoreState
): Record<string, WidgetState> => state.widgets;

export const selectWidgetById =
  (id: string) =>
  (state: DashboardStoreState): WidgetState | undefined =>
    state.widgets[id];

export const selectWidgetCount = (state: DashboardStoreState): number =>
  Object.keys(state.widgets).length;