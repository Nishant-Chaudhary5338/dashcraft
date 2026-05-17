import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { Settings, Trash2, GripHorizontal, ChevronRight } from "lucide-react";
import type {
  WidgetConfig,
  Position,
  Size,
  ViewBreakpoints,
  WidgetSettings,
} from "../../types";
import type { ResizeHandle } from "../../hooks/useResize";
import { useDashboardContext } from "../Dashboard/Dashboard.context";
import { ResizeHandleButton } from "./WidgetActions";
import { SettingsPanel } from "../Settings/SettingsPanel";
import { useResponsive } from "../../hooks/useResponsive";
import { useDraggable } from "../../hooks/useDraggable";
import { useResize } from "../../hooks/useResize";
import { useDashboardStore } from "../../store";

// ============================================================
// Edit Mode Transition Tracker (Module-level for performance)
// ============================================================

// Set to track widget IDs that have rendered in edit mode before
// Using Set with string IDs instead of WeakMap with object references
// because widgetState objects are recreated on every store update
const editModeRenderTracker = new Set<string>();

// Track widgets that are currently transitioning to edit mode
// This prevents CSS transition during the mode switch
const transitioningToEditMode = new Set<string>();

// Ref to store captured positions for widgets entering edit mode
// This ensures widgets maintain their visual position when switching modes
// Using a module-level Map that persists across renders
const capturedPositionsRef = new Map<string, { x: number; y: number; width: number; height: number }>();

// ============================================================
// DashboardCard Props
// ============================================================

export interface DashboardCardProps {
  // Identity
  id: string;
  type?: string;
  title?: string;

  // Features (all optional, default true where sensible)
  draggable?: boolean;
  deletable?: boolean;
  settings?: boolean;
  viewCycler?: boolean;

  // Resize handles to show (default: ["bottomRight"])
  resizeHandles?: ResizeHandle[];

  // Auto-detect resize directions based on widget position (default: false)
  autoResizeDirections?: boolean;

  // Settings Panel
  settingsPanel?: React.ReactNode | boolean;
  /** When to show the settings gear icon. "edit-mode" = only while editing (default), "always" = always visible */
  settingsVisibility?: "edit-mode" | "always";
  /** Callback fired whenever a setting is changed */
  onSettingsChange?: (settings: WidgetSettings) => void;

  // Responsive Views
  viewBreakpoints?: ViewBreakpoints;

  // Size & Position (only used in edit mode)
  defaultSize?: Size;
  defaultPosition?: Position;

  // Styling
  className?: string;
  style?: React.CSSProperties;

  // Events
  onDelete?: () => void;

  // Content
  children?: React.ReactNode;
}

// ============================================================
// DashboardCard Component
// ============================================================

export const DashboardCard = React.memo(function DashboardCard({
  id,
  type = "custom",
  title,
  draggable = true,
  deletable = true,
  settings: showSettings = true,
  settingsVisibility = "edit-mode",
  onSettingsChange,
  viewCycler: showViewCycler = false,
  resizeHandles = ["bottomRight"],
  viewBreakpoints,
  defaultSize,
  defaultPosition,
  className,
  style,
  onDelete,
  children,
}: DashboardCardProps): React.JSX.Element | null {
  // ==========================================================
  // Context
  // ==========================================================

  const { registerWidget, removeWidget, isEditMode, widgets, bringToFront } =
    useDashboardContext();

  // ==========================================================
  // Widget State
  // ==========================================================

  const widgetState = widgets[id];

  // ==========================================================
  // Draggable Hook
  // ==========================================================

  const { updateWidgetSize: storeUpdateWidgetSize } = useDashboardStore();
  const layoutGeneration = useDashboardStore((state) => state.layoutGeneration);

  const disabled = !draggable || !isEditMode;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  // ==========================================================
  // Resize Hook
  // ==========================================================

  const currentSize = widgetState?.size ?? defaultSize ?? { width: 300, height: 200 };

  // Capture the widget's position at the moment resize starts so we can apply
  // cumulative positionDelta relative to a fixed origin (not the per-frame store value).
  const resizeStartPositionRef = useRef<Position>({ x: 0, y: 0 });

  const { getHandleProps, size: resizeSize, isResizing } = useResize({
    initialSize: typeof currentSize.width === "number" && typeof currentSize.height === "number"
      ? currentSize as Size
      : { width: 300, height: 200 },
    minSize: { width: 150, height: 100 },
    disabled: !isEditMode || !draggable,
    onResizeStart: () => {
      // Bring widget to front when resize starts
      bringToFront(id);
      // Snapshot the current position so onResize can apply absolute offsets
      const { widgets: storeWidgets } = useDashboardStore.getState();
      resizeStartPositionRef.current = storeWidgets[id]?.position ?? { x: 0, y: 0 };
    },
    onResize: (event) => {
      // positionDelta is cumulative from resize start, so add it to the *start* position
      // (not the current store position) to avoid compounding each frame.
      const { updateWidgetPosition, updateWidgetSize } = useDashboardStore.getState();
      updateWidgetSize(id, event.size);
      updateWidgetPosition(id, {
        x: resizeStartPositionRef.current.x + event.positionDelta.x,
        y: resizeStartPositionRef.current.y + event.positionDelta.y,
      });
    },
    onResizeEnd: (newSize) => {
      storeUpdateWidgetSize(id, newSize);
    },
  });

  // ==========================================================
  // Register/Unregister Widget
  // ==========================================================

  const widgetConfig = useMemo<WidgetConfig>(
    () => {
      let config: WidgetConfig = {
        id,
        type,
        draggable,
        deletable,
        settings: showSettings,
      };
      if (title !== undefined) config = { ...config, title };
      if (defaultSize !== undefined) config = { ...config, defaultSize };
      if (defaultPosition !== undefined) config = { ...config, defaultPosition };
      return config;
    },
    [id, type, title, draggable, deletable, defaultSize, defaultPosition, showSettings]
  );

  useEffect(() => {
    registerWidget(id, widgetConfig);
    // Intentionally no cleanup: widgets persist in the store across tab switches
    // so drag positions, sizes, and settings survive navigation without a full page reload.
    // layoutGeneration is included so that resetLayout() (which bumps the counter)
    // causes all mounted DashboardCards to re-register and repopulate the cleared store.
  }, [id, registerWidget, widgetConfig, layoutGeneration]);

  // ==========================================================
  // Visibility (IntersectionObserver) — skip rendering chart when off-screen
  // ==========================================================

  const [isVisible, setIsVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observedRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Cleanup previous observer
      observerRef.current?.disconnect();

      if (!node) return;

      // Merge with draggable ref
      setNodeRef(node);
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;

      // Set up intersection observer for performance
      if (typeof IntersectionObserver !== "undefined") {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry) setIsVisible(entry.isIntersecting);
          },
          { rootMargin: "100px" }
        );
        observerRef.current.observe(node);
      }
    },
    [setNodeRef]
  );

  // ==========================================================
  // Responsive Content
  // ==========================================================

  const { content: responsiveContent, containerRef } = useResponsive({
    ...(viewBreakpoints !== undefined && { breakpoints: viewBreakpoints }),
    initial: children,
  });

  // ==========================================================
  // View Cycler State
  // ==========================================================

  // null = auto (ResizeObserver drives the view), number = user-selected index
  const [viewCyclerIndex, setViewCyclerIndex] = useState<number | null>(null);

  const viewCyclerKeys = useMemo<(number | "initial")[]>(() => {
    if (!viewBreakpoints) return [];
    return Object.keys(viewBreakpoints)
      .map((k) => (k === "initial" ? ("initial" as const) : Number(k)))
      .filter((k) => k === "initial" || !isNaN(k as number))
      .sort((a, b) => {
        if (a === "initial") return -1;
        if (b === "initial") return 1;
        return (a as number) - (b as number);
      });
  }, [viewBreakpoints]);

  // Content forced by the cycler button (overrides auto-responsive while in edit mode)
  const forcedContent = useMemo<React.ReactNode | undefined>(() => {
    if (viewCyclerIndex === null || !viewBreakpoints || viewCyclerKeys.length === 0) return undefined;
    const bp = viewCyclerKeys[viewCyclerIndex];
    if (!bp) return undefined;
    if (bp === "initial") return viewBreakpoints.initial ?? children;
    return (viewBreakpoints as Record<number, React.ReactNode>)[bp as number] ?? viewBreakpoints.initial ?? children;
  }, [viewCyclerIndex, viewBreakpoints, viewCyclerKeys, children]);

  // Label shown on the cycler button
  const viewCyclerLabel = useMemo<string>(() => {
    const bp = viewCyclerKeys[viewCyclerIndex ?? 0];
    if (!bp || bp === "initial") return "S";
    if ((bp as number) <= 300) return "M";
    return "L";
  }, [viewCyclerKeys, viewCyclerIndex]);

  // ==========================================================
  // Event Handlers
  // ==========================================================

  const handleClick = useCallback(() => {
    bringToFront(id);
  }, [id, bringToFront]);

  const handleDelete = useCallback(() => {
    removeWidget(id);
    onDelete?.();
  }, [id, removeWidget, onDelete]);

  // ==========================================================
  // Fallback Grid Position — prevents stacking at {0, 0}
  // ==========================================================

  const fallbackPosition = useMemo<{ x: number; y: number } | null>(() => {
    if (!isEditMode) return null;

    const posX = widgetState?.position?.x ?? 0;
    const posY = widgetState?.position?.y ?? 0;

    // If position is at origin, calculate a grid-based fallback
    if (posX === 0 && posY === 0) {
      // Get all widget IDs and find this widget's index
      const allWidgetIds = Object.keys(widgets).sort();
      const index = allWidgetIds.indexOf(id);
      
      if (index >= 0) {
        // Grid layout: 3 columns, with spacing
        const columns = 3;
        const cellWidth = 320; // Approximate widget width + gap
        const cellHeight = 220; // Approximate widget height + gap
        
        const col = index % columns;
        const row = Math.floor(index / columns);
        
        return {
          x: col * cellWidth + 20,
          y: row * cellHeight + 20,
        };
      }
    }

    return null;
  }, [isEditMode, widgetState?.position?.x, widgetState?.position?.y, widgets, id]);

  // ==========================================================
  // Track Edit Mode Transition (skip transition when entering edit mode)
  // ==========================================================

  const isFirstEditRender = useRef(false);
  const prevIsEditModeRef = useRef(isEditMode);

  // Capture position synchronously when entering edit mode
  // This must happen BEFORE the style calculation to prevent visual jump
  const isEnteringEditMode = isEditMode && !prevIsEditModeRef.current;
  
  if (isEnteringEditMode && containerRef.current) {
    // Check if the widget already has a saved position in the store (from loadLayout)
    const hasSavedPosition = widgetState && (widgetState.position.x !== 0 || widgetState.position.y !== 0);

    // Mark this widget as transitioning to edit mode
    // This will prevent CSS transition during the mode switch
    if (!editModeRenderTracker.has(id)) {
      isFirstEditRender.current = true;
      editModeRenderTracker.add(id);
      transitioningToEditMode.add(id);
    }

    if (hasSavedPosition) {
      // Widget has saved position from persistence — use it directly, skip DOM capture
      // Just remove from transitioning set after a frame to allow transitions
      requestAnimationFrame(() => {
        transitioningToEditMode.delete(id);
      });
    } else {
      // No saved position — capture the widget's current DOM position
      // This ensures the widget stays in place when switching to absolute positioning
      const widgetElement = containerRef.current;
      const container = widgetElement.closest('[data-dashcraft-dashboard]');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const widgetRect = widgetElement.getBoundingClientRect();
        
        const capturedPos = {
          x: widgetRect.left - containerRect.left,
          y: widgetRect.top - containerRect.top,
          width: widgetRect.width,
          height: widgetRect.height,
        };
        
        // Store the captured position for immediate use (CSS only)
        capturedPositionsRef.set(id, capturedPos);
        
        // Update the store in the background for persistence
        // This is fire-and-forget - the captured position will be used immediately
        requestAnimationFrame(() => {
          const { updateWidgetPosition, updateWidgetSize } = useDashboardStore.getState();
          updateWidgetPosition(id, { x: capturedPos.x, y: capturedPos.y });
          updateWidgetSize(id, { width: capturedPos.width, height: capturedPos.height });
          
          // Remove from transitioning set after a frame to allow transition on subsequent interactions
          transitioningToEditMode.delete(id);
          
          // Remove captured position after store is updated
          // This ensures subsequent renders use the store position (which gets updated on drag)
          capturedPositionsRef.delete(id);
        });
      }
    }
  }
  
  // Update prevIsEditModeRef for next render
  prevIsEditModeRef.current = isEditMode;
  
  // Reset when leaving edit mode
  useEffect(() => {
    if (!isEditMode) {
      isFirstEditRender.current = false;
      editModeRenderTracker.delete(id);
      transitioningToEditMode.delete(id);
      capturedPositionsRef.delete(id);
      setViewCyclerIndex(null);
    }
  }, [isEditMode, id]);

  // ==========================================================
  // Computed Styles — VIEW MODE vs EDIT MODE
  // ==========================================================

  const cardStyle = useMemo<React.CSSProperties>(() => {
    const storePosition = widgetState?.position ?? { x: 0, y: 0 };
    const storeSize = widgetState?.size ?? defaultSize ?? { width: "auto", height: "auto" };

    // Settings-driven appearance — applied in both view and edit mode
    const settingsOpacity = (widgetState?.settings?.opacity as number | undefined) ?? 1;
    const highlight = widgetState?.settings?.highlight as boolean | undefined;
    const highlightColor = (widgetState?.settings?.highlightColor as string | undefined) ?? "#3b82f6";
    const widgetTheme = widgetState?.settings?.theme as string | undefined;
    const settingsStyles: React.CSSProperties = {
      ...(widgetTheme === "dark" && { backgroundColor: "#111827", color: "#f9fafb" }),
      ...(widgetTheme === "light" && { backgroundColor: "#ffffff", color: "#111827" }),
      ...(settingsOpacity !== 1 && { opacity: settingsOpacity }),
      ...(highlight && { outline: `2px solid ${highlightColor}`, outlineOffset: "1px" }),
    };

    if (!isEditMode) {
      // VIEW MODE: Only use absolute positioning if widget has a saved (non-default) position
      // If position is {0, 0} (no saved layout), use CSS flow so widgets don't stack
      const hasSavedPosition = storePosition.x !== 0 || storePosition.y !== 0;
      if (hasSavedPosition) {
        return {
          ...style,
          ...settingsStyles,
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: storeSize.width,
          height: storeSize.height,
          transform: `translate3d(${storePosition.x}px, ${storePosition.y}px, 0)`,
          zIndex: widgetState?.zIndex ?? 0,
          transition: "transform 0.2s ease, opacity 0.2s ease",
        };
      }
      // No saved position — use CSS flow
      return {
        ...style,
        ...settingsStyles,
      };
    }

    // EDIT MODE: Absolute positioning with drag
    // Priority: captured position > fallback position > store position
    const capturedPos = capturedPositionsRef.get(id);

    // Use captured position if available (ensures widget stays in place when entering edit mode)
    const baseX = capturedPos?.x ?? fallbackPosition?.x ?? storePosition.x;
    const baseY = capturedPos?.y ?? fallbackPosition?.y ?? storePosition.y;

    // Use resize hook's size during resize for real-time visual feedback
    // Otherwise use store size or captured position size
    let width: number | string;
    let height: number | string;
    if (isResizing) {
      width = resizeSize.width;
      height = resizeSize.height;
    } else {
      width = capturedPos?.width ?? storeSize.width;
      height = capturedPos?.height ?? storeSize.height;
    }

    const dragX = transform?.x ?? 0;
    const dragY = transform?.y ?? 0;

    // Skip transition when:
    // 1. First render in edit mode (prevent visual jump)
    // 2. Currently transitioning to edit mode (prevent mode switch glitch)
    // 3. Currently dragging (for smooth drag)
    // 4. Currently resizing (for smooth resize)
    const isTransitioningToEdit = transitioningToEditMode.has(id);
    const shouldTransition = !isFirstEditRender.current && !isTransitioningToEdit && !isDragging && !isResizing;

    return {
      ...style,
      ...settingsStyles,
      position: "absolute" as const,
      top: 0,
      left: 0,
      zIndex: isDragging || isResizing ? 9999 : (widgetState?.zIndex ?? 0),
      width: width,
      height: height,
      transform: `translate3d(${baseX + dragX}px, ${baseY + dragY}px, 0)`,
      willChange: isDragging || isResizing ? "transform, width, height" : "auto",
      opacity: isDragging ? 0.92 : settingsOpacity,
      transition: shouldTransition ? "transform 0.2s ease, opacity 0.2s ease, box-shadow 0.15s ease" : "none",
      boxShadow: isDragging
        ? "0 12px 35px rgba(0,0,0,0.25), 0 0 0 2px rgba(99,102,241,0.8)"
        : "0 0 0 2px rgba(99,102,241,0.45)",
    };
  }, [
    style,
    isEditMode,
    isDragging,
    isResizing,
    draggable,
    resizeSize.width,
    resizeSize.height,
    transform?.x,
    transform?.y,
    widgetState?.zIndex,
    widgetState?.size?.width,
    widgetState?.size?.height,
    widgetState?.position?.x,
    widgetState?.position?.y,
    widgetState?.settings?.opacity,
    widgetState?.settings?.highlight,
    widgetState?.settings?.highlightColor,
    widgetState?.settings?.theme,
    defaultSize?.width,
    defaultSize?.height,
    fallbackPosition,
    id,
  ]);

  // ==========================================================
  // Resize Handle Position Mapping
  // ==========================================================

  const getResizeHandlePosition = useCallback((handle: ResizeHandle): "top-left" | "top-right" | "bottom-left" | "bottom-right" => {
    const positionMap: Record<ResizeHandle, "top-left" | "top-right" | "bottom-left" | "bottom-right"> = {
      top: "top-left",
      right: "top-right",
      bottom: "bottom-right",
      left: "bottom-left",
      topRight: "top-right",
      bottomRight: "bottom-right",
      bottomLeft: "bottom-left",
      topLeft: "top-left",
    };
    return positionMap[handle];
  }, []);

  // ==========================================================
  // Auto-detect resize directions based on widget position
  // ==========================================================

  const effectiveResizeHandles = useMemo<ResizeHandle[]>(() => {
    // Always use the explicitly provided resizeHandles
    if (resizeHandles && resizeHandles.length > 0) {
      return resizeHandles;
    }

    // Default fallback
    return ["bottomRight"];
  }, [resizeHandles]);

  // ==========================================================
  // Cleanup observer on unmount
  // ==========================================================

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  // ==========================================================
  // Render
  // ==========================================================

  if (!widgetState) {
    return null;
  }

  // In edit mode the cycler can override the auto-responsive view
  const content = viewBreakpoints
    ? (forcedContent !== undefined ? forcedContent : responsiveContent)
    : children;

  return (
    <div
      ref={observedRef}
      className={`dashcraft-card relative p-1 ${className ?? ""}`}
      style={cardStyle}
      onClick={handleClick}
      data-widget-id={id}
      data-widget-type={type}
    >
      {/* ── Edit-mode toolbar ── */}
      {isEditMode && (
        <div className="absolute inset-x-0 top-0 h-7 z-10 flex items-stretch
          bg-slate-100/90 border-b border-slate-200/70 rounded-t overflow-hidden">

          {/* Settings gear */}
          {showSettings && widgetState && (
            <SettingsPanel
              id={id}
              settings={widgetState.settings}
              {...(onSettingsChange !== undefined && { onSettingsChange })}
              trigger={
                <button
                  type="button"
                  className="w-7 shrink-0 flex items-center justify-center
                    text-slate-500 hover:text-slate-800
                    hover:bg-slate-200/80 border-r border-slate-200/70
                    transition-colors cursor-pointer"
                  title="Widget settings"
                  aria-label="Widget settings"
                >
                  <Settings size={12} />
                </button>
              }
            />
          )}

          {/* View cycler — only when widget has breakpoints */}
          {showViewCycler && viewBreakpoints && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const nextIdx = ((viewCyclerIndex ?? 0) + 1) % viewCyclerKeys.length;
                setViewCyclerIndex(nextIdx);
              }}
              className="w-8 shrink-0 flex items-center justify-center gap-0.5
                text-indigo-500 hover:text-indigo-700
                hover:bg-indigo-50/80 border-r border-slate-200/70
                text-[10px] font-bold tracking-wide
                transition-colors cursor-pointer"
              title={`Cycle view (${viewCyclerLabel})`}
              aria-label="Cycle view"
            >
              {viewCyclerLabel}
              <ChevronRight size={9} />
            </button>
          )}

          {/* Drag grip — takes remaining space */}
          {draggable ? (
            <button
              type="button"
              className="flex-1 flex items-center justify-center
                text-slate-400 hover:text-slate-600
                cursor-grab active:cursor-grabbing
                transition-colors select-none"
              aria-label="Drag to move"
              {...(attributes ?? {})}
              {...(listeners ?? {})}
            >
              <GripHorizontal size={13} />
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {/* Delete button */}
          {deletable && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-7 shrink-0 flex items-center justify-center
                text-red-400 hover:text-red-600
                hover:bg-red-50/80 border-l border-slate-200/70
                transition-colors cursor-pointer"
              title="Delete widget"
              aria-label="Delete widget"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}

      {/* Settings gear in view mode when settingsVisibility="always" */}
      {!isEditMode && showSettings && settingsVisibility === "always" && widgetState && (
        <SettingsPanel
          id={id}
          settings={widgetState.settings}
          {...(onSettingsChange !== undefined && { onSettingsChange })}
          trigger={
            <button
              type="button"
              className="widget-action-btn absolute top-1 left-1
                flex items-center justify-center w-6 h-6 rounded
                bg-slate-100 border border-slate-300 text-slate-600
                hover:text-slate-800 hover:bg-slate-200 hover:border-slate-400
                shadow-sm transition-all duration-150 cursor-pointer pointer-events-auto z-10"
              title="Widget settings"
              aria-label="Widget settings"
            >
              <Settings size={12} />
            </button>
          }
        />
      )}

      {/* Content — lightweight placeholder when off-screen */}
      <div className="dashcraft-card-content flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden p-3 pt-7 pb-6">
        <div className="flex-1 min-h-0 min-w-0 w-full h-full">
          {isVisible ? content : <div className="w-full h-full min-h-25" />}
        </div>
      </div>

      {/* Resize Handles — corners only, visible in edit mode */}
      {isEditMode && draggable && effectiveResizeHandles.filter((handle) =>
        handle === "topLeft" || handle === "topRight" || handle === "bottomLeft" || handle === "bottomRight"
      ).map((handle) => {
        const handleProps = getHandleProps(handle);
        return (
          <ResizeHandleButton
            key={handle}
            visible={true}
            position={getResizeHandlePosition(handle)}
            onMouseDown={handleProps.onMouseDown}
            onTouchStart={handleProps.onTouchStart}
            style={handleProps.style}
          />
        );
      })}

    </div>
  );
});

DashboardCard.displayName = "DashboardCard";