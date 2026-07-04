import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
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
import { DashboardCardToolbar } from "./DashboardCardToolbar";
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

/**
 * Props for {@link DashboardCard} — the draggable, resizable container that wraps
 * a single widget on a {@link Dashboard}.
 *
 * The feature flags (`drag`, `resize`, `delete`, `settings`) gate the affordances a
 * user gets in edit mode. Each flag also has a longer-form alias
 * (`draggable`/`resizable`/`deletable`/`showSettings`) — the aliases are documented
 * for discoverability, but the canonical prop names are the short forms below.
 *
 * @example
 * ```tsx
 * import { Dashboard, DashboardCard } from "@dashcraft/core";
 *
 * <Dashboard persistenceKey="sales">
 *   <DashboardCard
 *     id="revenue"
 *     title="Revenue"
 *     defaultPosition={{ x: 20, y: 20 }}
 *     defaultSize={{ width: 320, height: 220 }}
 *     viewSizes={[{ width: 320, height: 220 }, { width: 640, height: 360 }]}
 *   >
 *     <RevenueChart />
 *   </DashboardCard>
 * </Dashboard>
 * ```
 *
 * @see {@link DashboardCard} for the component.
 * @see {@link Dashboard} for the provider that supplies edit-mode/persistence context.
 * @see {@link WidgetConfig} for the registry entry derived from these props.
 */
export interface DashboardCardProps {
  /** Stable, unique widget identifier. Used as the store key, DnD id, and persistence key — must be constant across renders. */
  id: string;
  /**
   * Free-form widget category (e.g. `"chart"`, `"kpi"`). Surfaced on the DOM as
   * `data-widget-type` and stored on the {@link WidgetConfig}. Purely descriptive; no behaviour attached.
   * @default "custom"
   */
  type?: string;
  /** Human-readable title shown in the card toolbar/header. */
  title?: string;

  /**
   * Whether the card can be dragged to reposition it in edit mode. Alias: `draggable`.
   * Dragging is only ever active in edit mode regardless of this flag.
   * @default true
   */
  drag?: boolean;
  /**
   * Whether the card shows corner resize grips in edit mode. Alias: `resizable`.
   * @default true
   * @see {@link DashboardCardProps.resizeHandles} to choose which grips appear.
   */
  resize?: boolean;
  /**
   * Whether the card exposes a delete affordance in edit mode. Alias: `deletable`.
   * Removes the widget from the store (and fires {@link DashboardCardProps.onDelete}) when used.
   * @default true
   */
  delete?: boolean;
  /**
   * Controls the settings gear. Alias: `showSettings`.
   * - `true` (default) renders the built-in settings panel.
   * - `false` hides settings entirely.
   * - a `ReactNode` renders that node as a fully custom settings panel instead of the default one.
   * @default true
   * @see {@link DashboardCardProps.settingsVisibility} for when the gear is shown.
   * @see {@link SettingsPanel} for the built-in panel.
   */
  settings?: boolean | React.ReactNode;
  /**
   * Whether to show the responsive view-cycler button in the toolbar, letting the user
   * step through the breakpoint variants defined in {@link DashboardCardProps.viewBreakpoints}.
   * @default false
   */
  viewCycler?: boolean;

  /**
   * Which resize grips to render, in `{@link ResizeHandle}` terms.
   *
   * Defaults to BOTH bottom corners `["bottomRight", "bottomLeft"]` (not just bottom-right).
   * WHY: a widget sitting flush against the container's right edge has no room to drag its
   * bottom-right grip outward, so it would be effectively un-resizable; offering the bottom-left
   * grip (which grows the widget leftward) guarantees there is always a reachable grip no matter
   * where the card sits. Only the four corner handles are rendered; edge aliases map to a corner.
   * An explicit value always overrides the default.
   * @default ["bottomRight", "bottomLeft"]
   */
  resizeHandles?: ResizeHandle[];

  /**
   * Reserved flag to auto-pick resize directions from the widget's position. Not currently
   * consulted by the render path (the two-bottom-corner default covers the edge-anchored case).
   * @default false
   */
  autoResizeDirections?: boolean;

  /** Custom settings panel node (or `false` to omit). Overlaps with the `ReactNode` form of {@link DashboardCardProps.settings}. */
  settingsPanel?: React.ReactNode | boolean;
  /**
   * When to show the settings gear icon.
   * - `"edit-mode"` — only visible while the dashboard is in edit mode.
   * - `"always"` — visible in both view and edit mode.
   * @default "edit-mode"
   */
  settingsVisibility?: "edit-mode" | "always";
  /**
   * Fired whenever the user changes a value in the settings panel.
   * @param settings the widget's full, updated {@link WidgetSettings} object.
   */
  onSettingsChange?: (settings: WidgetSettings) => void;

  /**
   * Map of responsive content variants keyed by container-width breakpoint. When set, the card
   * swaps its children based on its own measured width (via {@link useResponsive}); with
   * {@link DashboardCardProps.viewCycler} the user can also step through variants manually.
   * @see {@link ViewBreakpoints}
   */
  viewBreakpoints?: ViewBreakpoints;

  /** Initial size, applied only in edit mode / before a stored size exists. Falls back to `{ width: 300, height: 200 }`. */
  defaultSize?: Size;
  /**
   * Initial (home) position. An explicit value — even `{ x: 0, y: 0 }` — is treated as intentional
   * and suppresses the auto-grid fallback. Also acts as the anchor that {@link DashboardCardProps.viewSizes}
   * cycling returns to.
   */
  defaultPosition?: Position;

  /**
   * Preset sizes the card can snap through. When set, double-clicking the card (or pressing the
   * toolbar cycle button) advances to the next size with a smooth animated resize — turning
   * width-driven responsive views into a single click.
   *
   * Cycling is anchored to the card's HOME position ({@link DashboardCardProps.defaultPosition}, or
   * the current stored position if none): when a larger preset would overflow the container it
   * shifts left/up only as far as needed to stay fully inside, and when it shrinks back the widget
   * returns to its original spot without drift or overlap. The current preset is matched by width
   * (within a 12px tolerance) and the next index wraps around.
   * @see {@link DashboardCardProps.snapOnDoubleClick}
   */
  viewSizes?: Size[];
  /**
   * Enable the double-click-to-cycle gesture. Only has effect when {@link DashboardCardProps.viewSizes}
   * is provided. The toolbar cycle button works regardless of this flag.
   * @default true
   */
  snapOnDoubleClick?: boolean;

  /** Extra class names appended to the card's root element. */
  className?: string;
  /** Inline styles merged into the card's computed style (positioning/size styles still win). */
  style?: React.CSSProperties;

  /** Called after the widget is removed via the delete affordance (fires in addition to store removal). */
  onDelete?: () => void;

  /** Widget content. In view mode this is rendered directly; with {@link DashboardCardProps.viewBreakpoints} it is the `initial` variant. */
  children?: React.ReactNode;
}

// ============================================================
// DashboardCard Component
// ============================================================

/**
 * A single draggable, resizable widget container for a {@link Dashboard}.
 *
 * Wrap any content in a `DashboardCard` and it becomes a movable dashboard tile: in edit mode
 * the user can drag it, resize it from the corner grips, delete it, and open its settings panel;
 * in view mode it renders as a positioned, read-only card. Positions and sizes are kept in the
 * shared {@link useDashboardStore} and (when the parent `Dashboard` has a `persistenceKey`)
 * survive reloads and navigation. Must be rendered inside a {@link Dashboard}, which provides the
 * edit-mode/registration context.
 *
 * Extra capabilities:
 * - `viewSizes` + double-click (or the toolbar cycle button) snap the card through preset sizes,
 *   anchored to its home position so it never drifts (see {@link DashboardCardProps.viewSizes}).
 * - `viewBreakpoints` swap the content responsively based on the card's own width.
 * - Off-screen cards skip rendering their content via an IntersectionObserver for performance.
 *
 * Returns `null` until the widget has registered itself in the store (one render), then the card.
 *
 * @param props - see {@link DashboardCardProps}.
 * @returns The rendered card, or `null` on the first render before registration completes.
 *
 * @example
 * ```tsx
 * import { Dashboard, DashboardCard, KPIWidget } from "@dashcraft/core";
 *
 * <Dashboard persistenceKey="ops" defaultEditMode>
 *   <DashboardCard id="uptime" title="Uptime" defaultPosition={{ x: 0, y: 0 }}>
 *     <KPIWidget value={99.98} format="percent" />
 *   </DashboardCard>
 * </Dashboard>
 * ```
 *
 * @see {@link DashboardCardProps} for every prop.
 * @see {@link Dashboard} for the required provider.
 * @see {@link useDashboardStore} for reading/writing widget position, size, and settings.
 */
export const DashboardCard = React.memo(function DashboardCard({
  id,
  type = "custom",
  title,
  drag: draggable = true,
  resize: resizable = true,
  delete: deletable = true,
  settings: settingsProp = true,
  settingsVisibility = "edit-mode",
  onSettingsChange,
  viewCycler: showViewCycler = false,
  // Left undefined by default so effectiveResizeHandles picks the sensible
  // default (both bottom corners); an explicit prop always wins.
  resizeHandles,
  viewBreakpoints,
  defaultSize,
  defaultPosition,
  viewSizes,
  snapOnDoubleClick = true,
  className,
  style,
  onDelete,
  children,
}: DashboardCardProps): React.JSX.Element | null {
  // Normalize settings prop: boolean indicates show/hide, ReactNode is custom panel
  const showSettings = settingsProp !== false && settingsProp != null;
  const customSettingsPanel = typeof settingsProp !== "boolean" && settingsProp != null ? settingsProp : undefined;
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
    disabled: !isEditMode || !resizable,
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
        drag: draggable,
        resize: resizable,
        delete: deletable,
        settings: showSettings,
      };
      if (title !== undefined) config = { ...config, title };
      if (defaultSize !== undefined) config = { ...config, defaultSize };
      if (defaultPosition !== undefined) config = { ...config, defaultPosition };
      return config;
    },
    [id, type, title, draggable, resizable, deletable, defaultSize, defaultPosition, showSettings]
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

  // Advance to the next preset size (wraps around). The animated resize is
  // driven by the width/height CSS transition on the card.
  const cycleViewSize = useCallback(() => {
    if (!viewSizes || viewSizes.length === 0) return;
    const cur = widgetState?.size ?? defaultSize;
    let idx = -1;
    if (cur && typeof cur.width === "number") {
      idx = viewSizes.findIndex((s) => Math.abs(s.width - (cur.width as number)) < 12);
    }
    const next = viewSizes[(idx + 1) % viewSizes.length];
    if (!next) return;
    bringToFront(id);
    storeUpdateWidgetSize(id, next);

    // Smart expansion anchored to the widget's HOME (default) position:
    // when growing, shift left/up only as needed to stay fully inside the
    // container; when shrinking back, the smaller size fits at home so the
    // widget returns to its original spot (no drift/overlap). Animated by the
    // card's transform transition.
    const home = defaultPosition ?? widgetState?.position;
    const container = (containerRef as React.MutableRefObject<HTMLDivElement | null>).current?.parentElement;
    if (container && home) {
      const bounds = container.getBoundingClientRect();
      let nextX = home.x;
      let nextY = home.y;
      if (typeof next.width === "number") nextX = Math.min(home.x, Math.max(0, bounds.width - next.width));
      if (typeof next.height === "number") nextY = Math.min(home.y, Math.max(0, bounds.height - next.height));
      const cur = widgetState?.position;
      if (!cur || cur.x !== nextX || cur.y !== nextY) {
        useDashboardStore.getState().updateWidgetPosition(id, { x: nextX, y: nextY });
      }
    }
  }, [viewSizes, widgetState?.size, widgetState?.position, defaultSize, defaultPosition, id, bringToFront, storeUpdateWidgetSize]);

  const handleDoubleClick = useCallback(() => {
    if (viewSizes && snapOnDoubleClick) cycleViewSize();
  }, [viewSizes, snapOnDoubleClick, cycleViewSize]);

  const handleDelete = useCallback(() => {
    removeWidget(id);
    onDelete?.();
  }, [id, removeWidget, onDelete]);

  // ==========================================================
  // Fallback Grid Position — prevents stacking at {0, 0}
  // ==========================================================

  const fallbackPosition = useMemo<{ x: number; y: number } | null>(() => {
    if (!isEditMode) return null;

    // An explicit defaultPosition means the placement is intentional — even {0, 0}
    // (top-left corner). Never override it with an auto-grid slot; the fallback is
    // only for widgets that were given no position at all.
    if (defaultPosition !== undefined) return null;

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
  }, [isEditMode, widgetState?.position?.x, widgetState?.position?.y, widgets, id, defaultPosition]);

  // ==========================================================
  // Track Edit Mode Transition (skip transition when entering edit mode)
  // ==========================================================

  const isFirstEditRender = useRef(false);
  const prevIsEditModeRef = useRef(isEditMode);

  // Capture position synchronously when entering edit mode
  // This must happen BEFORE the style calculation to prevent visual jump
  const isEnteringEditMode = isEditMode && !prevIsEditModeRef.current;
  
  if (isEnteringEditMode && containerRef.current) {
    // Check if the widget has a registered position in the store (even {0,0} is valid)
    const hasSavedPosition = widgetState !== undefined;

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
      // VIEW MODE: use absolute positioning when the widget is registered in the store.
      // A widget at {0,0} is valid (top-left corner) — checking for non-zero would hide it.
      if (widgetState !== undefined) {
        return {
          display: "flex",
          flexDirection: "column",
          ...style,
          ...settingsStyles,
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: storeSize.width,
          height: storeSize.height,
          transform: `translate3d(${storePosition.x}px, ${storePosition.y}px, 0)`,
          zIndex: widgetState.zIndex ?? 0,
          transition: "transform 0.2s ease, opacity 0.2s ease",
        };
      }
      // Widget not yet registered — use CSS flow with defaultSize if provided
      return {
        display: "flex",
        flexDirection: "column",
        ...style,
        ...settingsStyles,
        ...(defaultSize && { width: defaultSize.width, height: defaultSize.height }),
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
      display: "flex",
      flexDirection: "column",
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
      transition: shouldTransition ? "transform 0.2s ease, width 0.32s cubic-bezier(0.4,0,0.2,1), height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease, box-shadow 0.15s ease" : "none",
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
    // An explicit prop always wins.
    if (resizeHandles && resizeHandles.length > 0) {
      return resizeHandles;
    }

    // Default: both bottom corners. A widget flush against the container's
    // right edge cannot drag its bottom-right grip outward, so the bottom-left
    // grip (which grows the widget leftward) is the one that works for it.
    // Offering both means there is always a reachable grip regardless of where
    // the widget sits, and — unlike flipping a single grip by edge proximity —
    // the active grip never disappears mid-resize.
    return ["bottomRight", "bottomLeft"];
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
      className={`dashcraft-card relative p-1 rounded-lg ${className ?? ""}`}
      style={cardStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={viewSizes && snapOnDoubleClick ? "Double-click to change view size" : undefined}
      data-widget-id={id}
      data-widget-type={type}
    >
      <DashboardCardToolbar
        isEditMode={isEditMode}
        id={id}
        widgetState={widgetState}
        showSettings={showSettings}
        settingsVisibility={settingsVisibility}
        customSettingsPanel={customSettingsPanel}
        onSettingsChange={onSettingsChange}
        draggable={draggable}
        deletable={deletable}
        onDelete={handleDelete}
        dragAttributes={attributes as unknown as Record<string, unknown> | undefined}
        dragListeners={listeners as unknown as Record<string, unknown> | undefined}
        showViewCycler={showViewCycler}
        viewBreakpoints={viewBreakpoints}
        viewCyclerIndex={viewCyclerIndex}
        setViewCyclerIndex={setViewCyclerIndex}
        viewCyclerKeys={viewCyclerKeys}
        viewCyclerLabel={viewCyclerLabel}
        canCycleSize={!!viewSizes && viewSizes.length > 1}
        onCycleSize={cycleViewSize}
      />

      {/* Content — lightweight placeholder when off-screen */}
      <div className={`dashcraft-card-content flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden rounded-lg p-3 pb-6 ${isEditMode ? "pt-7" : "pt-3"}`}>
        <div className="flex-1 min-h-0 min-w-0 w-full h-full">
          {isVisible ? content : <div className="w-full h-full min-h-25" />}
        </div>
      </div>

      {/* Resize Handles — corners only, visible in edit mode */}
      {isEditMode && resizable && effectiveResizeHandles.filter((handle) =>
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