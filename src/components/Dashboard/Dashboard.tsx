import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import type { DashboardConfig, DashboardContextValue, Position, Size } from "../../types";
import { DashboardContext } from "./Dashboard.context";
import { useDashboardStore } from "../../store";

// ============================================================
// Dashboard Component (Context Provider)
// ============================================================

export interface DashboardProps extends DashboardConfig {
  /** CSS class for the container (e.g., "grid grid-cols-3 gap-4") */
  className?: string;
}

const Dashboard = React.memo(function Dashboard({
  persistenceKey,
  autoSave = false,
  autoSaveDelay = 1000,
  defaultEditMode = false,
  onLayoutChange,
  onEditModeChange,
  className,
  style,
  children,
}: DashboardProps): React.JSX.Element {
  // ==========================================================
  // Store State (fine-grained subscriptions)
  // ==========================================================

  const isEditMode = useDashboardStore((state) => state.isEditMode);
  const widgets = useDashboardStore((state) => state.widgets);

  // ==========================================================
  // Store Actions
  // ==========================================================

  const toggleEditMode = useDashboardStore((state) => state.toggleEditMode);
  const setEditMode = useDashboardStore((state) => state.setEditMode);
  const saveLayout = useDashboardStore((state) => state.saveLayout);
  const loadLayout = useDashboardStore((state) => state.loadLayout);
  const resetLayout = useDashboardStore((state) => state.resetLayout);
  const addWidget = useDashboardStore((state) => state.addWidget);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const updateWidgetPosition = useDashboardStore(
    (state) => state.updateWidgetPosition
  );
  const updateWidgetSize = useDashboardStore(
    (state) => state.updateWidgetSize
  );
  const updateWidgetSettings = useDashboardStore(
    (state) => state.updateWidgetSettings
  );
  const bringToFront = useDashboardStore((state) => state.bringToFront);
  const registerWidget = useDashboardStore((state) => state.registerWidget);
  const unregisterWidget = useDashboardStore(
    (state) => state.unregisterWidget
  );
  const getWidgetState = useDashboardStore((state) => state.getWidgetState);
  const batchUpdatePositionsAndSizes = useDashboardStore(
    (state) => state.batchUpdatePositionsAndSizes
  );

  // ==========================================================
  // Container Ref for DOM Measurement
  // ==========================================================

  const containerRef = useRef<HTMLDivElement>(null);
  const hasCapturedInitialPositions = useRef(false);

  // Snapshot of widgets captured on every render — used in unmount cleanup to avoid
  // saving an empty store (children call unregisterWidget before the parent unmounts).
  const widgetsSnapshotRef = useRef(widgets);
  useEffect(() => {
    widgetsSnapshotRef.current = widgets;
  }, [widgets]);

  // ==========================================================
  // Capture Widget Positions (Synchronous for immediate mode switch)
  // ==========================================================

  const captureWidgetPositions = useCallback((): Array<{ id: string; position: Position; size: Size }> => {
    const container = containerRef.current;
    if (!container) return [];

    // Capture positions synchronously to prevent race condition
    // This ensures positions are available immediately when entering edit mode
    const containerRect = container.getBoundingClientRect();
    const widgetElements = container.querySelectorAll("[data-widget-id]");

    // Batch DOM reads to avoid layout thrashing
    const updates: Array<{ id: string; position: Position; size: Size }> = [];

    for (let i = 0; i < widgetElements.length; i++) {
      const el = widgetElements[i] as HTMLElement;
      const id = el.dataset.widgetId;
      if (!id) continue;

      // Skip widgets that already have saved positions in the store
      const existingWidget = widgets[id];
      if (existingWidget && (existingWidget.position.x !== 0 || existingWidget.position.y !== 0)) {
        continue;
      }

      const rect = el.getBoundingClientRect();
      const position = {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
      };
      const size = {
        width: rect.width,
        height: rect.height,
      };

      // Only capture valid positions and sizes
      if ((position.x !== 0 || position.y !== 0) && size.width > 0 && size.height > 0) {
        updates.push({ id, position, size });
      }
    }

    return updates;
  }, [widgets]);

  // ==========================================================
  // Wrapped Edit Mode Actions (capture positions before switch)
  // ==========================================================

  const handleToggleEditMode = useCallback(() => {
    if (!isEditMode) {
      // Entering edit mode: only capture positions from DOM on first entry.
      // On subsequent entries, preserve saved positions from the store.
      if (!hasCapturedInitialPositions.current) {
        const updates = captureWidgetPositions();
        if (updates.length > 0) {
          flushSync(() => {
            batchUpdatePositionsAndSizes(updates);
          });
        }
        hasCapturedInitialPositions.current = true;
      }
    } else {
      // Save layout when LEAVING edit mode to persist dragged positions
      if (persistenceKey) {
        saveLayout(persistenceKey);
      }
    }
    toggleEditMode();
  }, [isEditMode, captureWidgetPositions, batchUpdatePositionsAndSizes, toggleEditMode, persistenceKey, saveLayout]);

  const handleSetEditMode = useCallback(
    (editMode: boolean) => {
      if (editMode && !isEditMode) {
        // Entering edit mode: only capture positions from DOM on first entry.
        // On subsequent entries, preserve saved positions from the store.
        if (!hasCapturedInitialPositions.current) {
          const updates = captureWidgetPositions();
          if (updates.length > 0) {
            flushSync(() => {
              batchUpdatePositionsAndSizes(updates);
            });
          }
          hasCapturedInitialPositions.current = true;
        }
      } else if (!editMode && isEditMode) {
        // Save layout when LEAVING edit mode to persist dragged positions
        if (persistenceKey) {
          saveLayout(persistenceKey);
        }
      }
      setEditMode(editMode);
    },
    [isEditMode, captureWidgetPositions, batchUpdatePositionsAndSizes, setEditMode, persistenceKey, saveLayout]
  );

  // ==========================================================
  // Context Value (memoized)
  // ==========================================================

  const handleResetLayout = useCallback(() => {
    if (persistenceKey) {
      try {
        localStorage.removeItem(`dashcraft-layout-${persistenceKey}`);
      } catch {}
    }
    resetLayout();
    setEditMode(false);
    hasCapturedInitialPositions.current = false;
  }, [persistenceKey, resetLayout, setEditMode]);

  const contextValue = useMemo<DashboardContextValue>(
    () => ({
      isEditMode,
      widgets,
      toggleEditMode: handleToggleEditMode,
      setEditMode: handleSetEditMode,
      saveLayout: () => {
        if (persistenceKey) {
          saveLayout(persistenceKey);
        }
      },
      loadLayout: () => {
        if (persistenceKey) {
          loadLayout(persistenceKey);
        }
      },
      resetLayout: handleResetLayout,
      addWidget,
      removeWidget,
      updateWidgetPosition,
      updateWidgetSize,
      updateWidgetSettings,
      bringToFront,
      registerWidget,
      unregisterWidget,
      getWidgetState,
    }),
    [
      isEditMode,
      widgets,
      handleToggleEditMode,
      handleSetEditMode,
      saveLayout,
      loadLayout,
      handleResetLayout,
      addWidget,
      removeWidget,
      updateWidgetPosition,
      updateWidgetSize,
      updateWidgetSettings,
      bringToFront,
      registerWidget,
      unregisterWidget,
      getWidgetState,
      persistenceKey,
    ]
  );

  // ==========================================================
  // Effects
  // ==========================================================

  // Set initial edit mode
  React.useEffect(() => {
    if (defaultEditMode) {
      setEditMode(true);
    }
  }, [defaultEditMode, setEditMode]);

  // Load layout on mount — always load so each Dashboard instance starts from the
  // persisted state, not from stale widgets left in the store by a previous instance.
  // loadLayout replaces the entire widgets map, so it is safe to call unconditionally.
  React.useEffect(() => {
    if (persistenceKey) {
      loadLayout(persistenceKey);
    }
  }, [persistenceKey, loadLayout]);

  // On unmount: save the last known layout (handles "navigated away while still in
  // edit mode" — the explicit leave-edit-mode save in handleToggleEditMode only runs
  // when the user clicks the toggle, not on navigation) and always exit edit mode so
  // the next Dashboard on a new route starts without edit mode active.
  // We read from widgetsSnapshotRef rather than the live store because loadLayout may
  // have replaced the store after the snapshot was taken on an earlier render.
  React.useEffect(() => {
    return () => {
      if (persistenceKey) {
        const snapshot = widgetsSnapshotRef.current;
        if (Object.keys(snapshot).length > 0) {
          try {
            localStorage.setItem(
              `dashcraft-layout-${persistenceKey}`,
              JSON.stringify(snapshot)
            );
          } catch {}
        }
      }
      useDashboardStore.getState().setEditMode(false);
    };
  }, [persistenceKey]);

  // Auto-save
  React.useEffect(() => {
    if (!autoSave || !persistenceKey) return;
    // Never overwrite a saved layout with an empty store — this can happen when
    // widgets from a tab unmount and briefly leave the store empty before the
    // new tab's widgets register.
    if (Object.keys(widgets).length === 0) return;

    const timeoutId = setTimeout(() => {
      saveLayout(persistenceKey);
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [widgets, autoSave, autoSaveDelay, persistenceKey, saveLayout]);

  // Notify layout change
  React.useEffect(() => {
    onLayoutChange?.(widgets);
  }, [widgets, onLayoutChange]);

  // Notify edit mode change
  React.useEffect(() => {
    onEditModeChange?.(isEditMode);
  }, [isEditMode, onEditModeChange]);

  // ==========================================================
  // DnD Handlers
  // ==========================================================

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      console.log("[DEBUG] Dashboard: DRAG START triggered for widget:", event.active.id);
      // Bring widget to front when drag starts
      bringToFront(event.active.id as string);
    },
    [bringToFront]
  );

  // RAF batching for smooth drag
  const rafId = useRef<number | null>(null);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!event.delta) return;

      const widget = getWidgetState(event.active.id as string);
      if (!widget) return;

      const newPosition = {
        x: widget.position.x + event.delta.x,
        y: widget.position.y + event.delta.y,
      };

      // Batch through rAF for smooth updates
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updateWidgetPosition(event.active.id as string, newPosition);
        // Bring dropped widget to front
        bringToFront(event.active.id as string);
      });
    },
    [getWidgetState, updateWidgetPosition, bringToFront]
  );

  const handleDragCancel = useCallback(() => {
    // No-op: drag state is handled by CSS transform in DashboardCard
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // ==========================================================
  // DnD Sensors — require minimum distance to activate drag
  // This prevents accidental drags when clicking resize handles
  // ==========================================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );


  // ==========================================================
  // Container Style — computed height for absolute children
  // ==========================================================

  const containerStyle = useMemo<React.CSSProperties>(() => {
    const widgetEntries = Object.values(widgets);
    // Check if any widget has a saved (non-default) position
    const hasSavedPositions = widgetEntries.some(
      (w) => w.position?.x !== 0 || w.position?.y !== 0
    );

    if (!hasSavedPositions) {
      // No saved positions — CSS flow handles layout naturally
      return {
        ...style,
        position: "relative",
      };
    }

    // Has saved positions — compute min-height to encompass all absolute widgets
    let minHeight = 0;
    for (const w of widgetEntries) {
      const bottom = (w.position?.y ?? 0) + (typeof w.size?.height === "number" ? w.size.height : 200);
      if (bottom > minHeight) minHeight = bottom;
    }
    minHeight += 40;

    return {
      ...style,
      position: "relative",
      minHeight: `${minHeight}px`,
    };
  }, [style, widgets]);

  // ==========================================================
  // Drag Overlay Content
  // ==========================================================

  // DragOverlay is intentionally empty — the actual widget moves via CSS transform in DashboardCard

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <DashboardContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          ref={containerRef}
          className={className}
          style={containerStyle}
          data-dashcraft-dashboard
        >
          {children}
        </div>
        <DragOverlay dropAnimation={null} />
      </DndContext>
    </DashboardContext.Provider>
  );
});

Dashboard.displayName = "Dashboard";

export { Dashboard };