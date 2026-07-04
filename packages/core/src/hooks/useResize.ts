import { useState, useCallback, useRef, useEffect } from "react";
import type { Size, Position } from "../types";
import { useDashboardStore } from "../store";

// ============================================================
// useResize Hook
// ============================================================

/**
 * Identifies which edge or corner handle of a resizable box is being
 * dragged. Cardinal values (`"top"`, `"right"`, `"bottom"`, `"left"`)
 * resize one dimension only; corner values resize both width and height
 * simultaneously.
 */
export type ResizeHandle =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "topRight"
  | "bottomRight"
  | "bottomLeft"
  | "topLeft";

/**
 * Change in width/height produced by a single resize move, relative to the
 * size at the start of the current drag (not the previous frame).
 */
export interface ResizeDelta {
  /** Change in width in pixels since the resize started. Can be negative. */
  width: number;
  /** Change in height in pixels since the resize started. Can be negative. */
  height: number;
}

/**
 * Offset a resizable container must shift by to keep the opposite edge
 * anchored when resizing from a `left`/`top`-inclusive handle (e.g.
 * dragging the left edge grows the box leftward, so the container's `x`
 * must decrease by the same amount to keep the right edge fixed).
 */
export interface PositionDelta {
  /** Horizontal position adjustment in pixels; nonzero only for left-side handles. */
  x: number;
  /** Vertical position adjustment in pixels; nonzero only for top-side handles. */
  y: number;
}

/**
 * Snapshot passed to {@link UseResizeOptions.onResize} on every resize move.
 */
export interface ResizeEvent {
  /** The new (constrained) size after this move. */
  size: Size;
  /** Size change since the resize gesture started. */
  delta: ResizeDelta;
  /** Position compensation needed to keep the opposite edge anchored. */
  positionDelta: PositionDelta;
  /** Which handle is being dragged. */
  handle: ResizeHandle;
}

/**
 * Options for useResize hook
 */
export interface UseResizeOptions {
  /**
   * Starting size. Also used as the target when {@link UseResizeReturn.resetSize}
   * is called, and re-applied automatically (while not resizing) if this
   * value's width/height changes between renders.
   */
  initialSize: Size;
  /**
   * Lower bound clamp applied to both dimensions on every resize.
   *
   * @default { width: 50, height: 50 }
   */
  minSize?: Size;
  /**
   * Upper bound clamp applied to both dimensions on every resize.
   *
   * @default { width: Infinity, height: Infinity }
   */
  maxSize?: Size;
  /**
   * When set, width/height are locked to this width-over-height ratio: if
   * the dragged size would exceed the ratio, width is derived from height
   * (or vice versa) so the ratio holds exactly. Applied after min/max
   * clamping and before grid snapping.
   */
  aspectRatio?: number;
  /**
   * When set, both dimensions are rounded to the nearest multiple of this
   * value after min/max/aspect-ratio constraints are applied.
   */
  gridSize?: number;
  /** Fires once, synchronously, when a resize gesture begins (mouse/touch down on a handle). */
  onResizeStart?: (handle: ResizeHandle) => void;
  /** Fires on every pointer move during an active resize, with the constrained size and deltas for that move. */
  onResize?: (event: ResizeEvent) => void;
  /** Fires once when the resize gesture ends (mouse/touch up), with the final constrained size. */
  onResizeEnd?: (size: Size) => void;
  /**
   * When `true`, handle mouse/touch-down is ignored so the box can't be
   * resized — existing size and handlers are otherwise unaffected.
   *
   * @default false
   */
  disabled?: boolean;
}

/**
 * Return type for useResize hook
 */
export interface UseResizeReturn {
  /** Current size */
  size: Size;
  /** Whether currently resizing */
  isResizing: boolean;
  /** Current resize handle being used */
  activeHandle: ResizeHandle | null;
  /** Set size directly */
  setSize: (size: Size | ((prev: Size) => Size)) => void;
  /** Reset to initial size */
  resetSize: () => void;
  /** Get props to spread on resize handle elements */
  getHandleProps: (handle: ResizeHandle) => ResizeHandleProps;
  /** Get props to spread on the resizable container */
  getContainerProps: () => ResizeContainerProps;
}

/**
 * Props returned by {@link UseResizeReturn.getHandleProps}, meant to be
 * spread directly onto a handle `<div>` (or similar) element.
 */
export interface ResizeHandleProps {
  /** Starts the resize gesture on mouse down, unless `disabled`. */
  onMouseDown: (e: React.MouseEvent) => void;
  /** Starts the resize gesture on touch start, unless `disabled`. */
  onTouchStart: (e: React.TouchEvent) => void;
  /** Marks which edge/corner this handle represents (useful for styling/testing selectors). */
  "data-resize-handle": ResizeHandle;
  /** Inline positioning + cursor styles pre-computed for this handle's position. */
  style: React.CSSProperties;
}

/**
 * Props returned by {@link UseResizeReturn.getContainerProps}, meant to be
 * spread directly onto the resizable container element.
 */
export interface ResizeContainerProps {
  /** `position: relative` plus the current width/height, so absolutely-positioned handles line up. */
  style: React.CSSProperties;
}

/**
 * Hook to enable widget resizing with mouse/touch support.
 * Provides resize handles and constraint enforcement.
 *
 * @param options - Configuration options for resizing
 * @returns Object with size state and resize handlers
 *
 * @example
 * ```tsx
 * const { size, isResizing, getHandleProps, getContainerProps } = useResize({
 *   initialSize: { width: 300, height: 200 },
 *   minSize: { width: 100, height: 100 },
 *   maxSize: { width: 800, height: 600 },
 *   gridSize: 10,
 *   onResizeEnd: (size) => console.log('Final size:', size),
 * });
 *
 * return (
 *   <div {...getContainerProps()}>
 *     <div {...getHandleProps('right')} />
 *     <div {...getHandleProps('bottom')} />
 *     <div {...getHandleProps('bottomRight')} />
 *   </div>
 * );
 * ```
 *
 * @see {@link useDraggable} for the companion drag hook.
 * @see {@link useMeasure} if you only need to observe an element's size, not control it.
 */
export function useResize(options: UseResizeOptions): UseResizeReturn {
  const {
    initialSize,
    minSize = { width: 50, height: 50 },
    maxSize = { width: Infinity, height: Infinity },
    aspectRatio,
    gridSize,
    onResizeStart,
    onResize,
    onResizeEnd,
    disabled = false,
  } = options;

  const [size, setSizeState] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);

  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  const startSizeRef = useRef<Size>(initialSize);
  const initialSizeRef = useRef<Size>(initialSize);

  /**
   * Constrain size to min/max and grid
   */
  const constrainSize = useCallback(
    (newSize: Size): Size => {
      let { width, height } = newSize;

      // Apply min/max constraints
      width = Math.max(minSize.width, Math.min(maxSize.width, width));
      height = Math.max(minSize.height, Math.min(maxSize.height, height));

      // Apply aspect ratio if specified
      if (aspectRatio) {
        const currentRatio = width / height;
        if (currentRatio > aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
      }

      // Snap to grid if specified
      if (gridSize) {
        width = Math.round(width / gridSize) * gridSize;
        height = Math.round(height / gridSize) * gridSize;
      }

      return { width, height };
    },
    [minSize, maxSize, aspectRatio, gridSize]
  );

  // Sync size state when initialSize prop changes
  // (but only when not currently resizing to avoid fighting with user input)
  const prevInitialSizeRef = useRef<Size>(initialSize);
  useEffect(() => {
    const prev = prevInitialSizeRef.current;
    // Only update if the actual values changed (not just object reference)
    if (prev.width !== initialSize.width || prev.height !== initialSize.height) {
      initialSizeRef.current = initialSize;
      prevInitialSizeRef.current = initialSize;
      if (!isResizing) {
        // Inline constraint logic to avoid dependency on constrainSize callback
        let width = Math.max(minSize.width, Math.min(maxSize.width, initialSize.width));
        let height = Math.max(minSize.height, Math.min(maxSize.height, initialSize.height));
        if (aspectRatio) {
          const currentRatio = width / height;
          if (currentRatio > aspectRatio) {
            width = height * aspectRatio;
          } else {
            height = width / aspectRatio;
          }
        }
        if (gridSize) {
          width = Math.round(width / gridSize) * gridSize;
          height = Math.round(height / gridSize) * gridSize;
        }
        setSizeState({ width, height });
      }
    }
  }, [initialSize.width, initialSize.height, isResizing, minSize.width, minSize.height, maxSize.width, maxSize.height, aspectRatio, gridSize]);

  /**
   * Set size with constraints
   */
  const setSize = useCallback(
    (newSize: Size | ((prev: Size) => Size)): void => {
      setSizeState((prev) => {
        const sizeValue =
          typeof newSize === "function" ? newSize(prev) : newSize;
        return constrainSize(sizeValue);
      });
    },
    [constrainSize]
  );

  /**
   * Reset to initial size
   */
  const resetSize = useCallback((): void => {
    setSizeState(constrainSize(initialSizeRef.current));
  }, [constrainSize]);

  /**
   * Calculate new size based on mouse/touch movement
   */
  const calculateNewSize = useCallback(
    (deltaX: number, deltaY: number, handle: ResizeHandle): Size => {
      let newWidth = startSizeRef.current.width;
      let newHeight = startSizeRef.current.height;

      // Adjust based on handle direction
      switch (handle) {
        case "right":
        case "topRight":
        case "bottomRight":
          newWidth += deltaX;
          break;
        case "left":
        case "topLeft":
        case "bottomLeft":
          newWidth -= deltaX;
          break;
      }

      switch (handle) {
        case "bottom":
        case "bottomRight":
        case "bottomLeft":
          newHeight += deltaY;
          break;
        case "top":
        case "topRight":
        case "topLeft":
          newHeight -= deltaY;
          break;
      }

      return { width: newWidth, height: newHeight };
    },
    []
  );

  /**
   * Handle mouse/touch move
   */
  const handleMove = useCallback(
    (clientX: number, clientY: number): void => {
      if (!activeHandle || disabled) return;

      const deltaX = clientX - startPosRef.current.x;
      const deltaY = clientY - startPosRef.current.y;

      const newSize = calculateNewSize(deltaX, deltaY, activeHandle);
      const constrainedSize = constrainSize(newSize);

      setSizeState(constrainedSize);

      const delta: ResizeDelta = {
        width: constrainedSize.width - startSizeRef.current.width,
        height: constrainedSize.height - startSizeRef.current.height,
      };

      // Calculate position delta for left/top handles
      // When resizing from left, position needs to shift left as width increases
      // When resizing from top, position needs to shift up as height increases
      const positionDelta: PositionDelta = {
        x: 0,
        y: 0,
      };

      switch (activeHandle) {
        case "left":
        case "topLeft":
        case "bottomLeft":
          positionDelta.x = -delta.width;
          break;
      }

      switch (activeHandle) {
        case "top":
        case "topRight":
        case "topLeft":
          positionDelta.y = -delta.height;
          break;
      }

      onResize?.({
        size: constrainedSize,
        delta,
        positionDelta,
        handle: activeHandle,
      });
    },
    [activeHandle, disabled, calculateNewSize, constrainSize, onResize]
  );

  /**
   * Handle mouse/touch up
   */
  const handleEnd = useCallback((): void => {
    if (!activeHandle) return;

    setIsResizing(false);
    setActiveHandle(null);
    useDashboardStore.getState().setIsResizing(false);
    onResizeEnd?.(size);
  }, [activeHandle, size, onResizeEnd]);

  /**
   * Handle mouse move
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  /**
   * Handle touch move
   */
  const handleTouchMove = useCallback(
    (e: TouchEvent): void => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove]
  );

  /**
   * Set up global event listeners
   */
  useEffect(() => {
    if (!isResizing) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isResizing, handleMouseMove, handleTouchMove, handleEnd]);

  /**
   * Handle mouse/touch down
   */
  const getHandleProps = useCallback(
    (handle: ResizeHandle): ResizeHandleProps => {
      const handleMouseDown = (e: React.MouseEvent): void => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();

        startPosRef.current = { x: e.clientX, y: e.clientY };
        startSizeRef.current = size;
        setActiveHandle(handle);
        setIsResizing(true);
        useDashboardStore.getState().setIsResizing(true);
        onResizeStart?.(handle);
      };

      const handleTouchStart = (e: React.TouchEvent): void => {
        if (disabled) return;
        const touch = e.touches[0];
        if (!touch) return;
        e.preventDefault();
        e.stopPropagation();

        startPosRef.current = { x: touch.clientX, y: touch.clientY };
        startSizeRef.current = size;
        setActiveHandle(handle);
        setIsResizing(true);
        onResizeStart?.(handle);
      };

      // Style based on handle position
      const handleStyles: Record<ResizeHandle, React.CSSProperties> = {
        top: {
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: 8,
          cursor: "ns-resize",
        },
        right: {
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          width: 8,
          height: "100%",
          cursor: "ew-resize",
        },
        bottom: {
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: 8,
          cursor: "ns-resize",
        },
        left: {
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          width: 8,
          height: "100%",
          cursor: "ew-resize",
        },
        topRight: {
          position: "absolute",
          top: 0,
          right: 0,
          width: 16,
          height: 16,
          cursor: "nesw-resize",
        },
        bottomRight: {
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 16,
          height: 16,
          cursor: "nwse-resize",
        },
        bottomLeft: {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 16,
          height: 16,
          cursor: "nesw-resize",
        },
        topLeft: {
          position: "absolute",
          top: 0,
          left: 0,
          width: 16,
          height: 16,
          cursor: "nwse-resize",
        },
      };

      return {
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
        "data-resize-handle": handle,
        style: handleStyles[handle],
      };
    },
    [disabled, size, onResizeStart]
  );

  /**
   * Get props for resizable container
   */
  const getContainerProps = useCallback((): ResizeContainerProps => {
    return {
      style: {
        position: "relative",
        width: size.width,
        height: size.height,
      },
    };
  }, [size]);

  return {
    size,
    isResizing,
    activeHandle,
    setSize,
    resetSize,
    getHandleProps,
    getContainerProps,
  };
}