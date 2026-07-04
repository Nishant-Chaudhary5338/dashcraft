import { useDraggable as useDndDraggable } from "@dnd-kit/core";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { useRef, useEffect } from "react";
import { DEBUG } from "../utils";

// ============================================================
// useDraggable Hook
// ============================================================

/**
 * Configuration for {@link useDraggable}.
 */
export interface UseDraggableOptions {
  /**
   * Unique identifier for the draggable widget. Must match the id used
   * elsewhere in the dashboard's `DndContext` (e.g. the widget's layout
   * entry) so drag events can be correlated to the right widget.
   */
  id: string;
  /**
   * Disables dragging entirely while `true` — no drag listeners are
   * attached and `isDragging` will never become `true`.
   *
   * @default false
   */
  disabled?: boolean;
}

/**
 * Return value of {@link useDraggable}.
 */
export interface UseDraggableReturn {
  /** `true` while the widget is actively being dragged by the user. */
  isDragging: boolean;
  /** ARIA/keyboard attributes from `@dnd-kit/core` — spread onto the draggable element. */
  attributes: DraggableAttributes;
  /** Pointer/keyboard event listeners from `@dnd-kit/core` — spread onto the draggable element. */
  listeners: DraggableSyntheticListeners | undefined;
  /** Ref callback to attach to the DOM node that should become draggable. */
  setNodeRef: (node: HTMLElement | null) => void;
  /**
   * Current drag offset in pixels relative to the drag start position, or
   * `null` when not dragging. Apply as a CSS transform on the dragged
   * element for visual feedback; the widget's persisted position is
   * updated separately by the dashboard's `DndContext` on drag end.
   */
  transform: { x: number; y: number } | null;
}

/**
 * Makes a dashboard widget draggable, built on top of `@dnd-kit/core`'s
 * `useDraggable`.
 *
 * Use this inside a `DashboardCard` (or any widget wrapper rendered within
 * the dashboard's `DndContext`) to wire up drag handles. This hook only
 * tracks local drag state (`isDragging`, `transform`) and exposes the
 * dnd-kit attributes/listeners to spread onto the DOM; it does NOT persist
 * the widget's final position — position updates and z-index/bring-to-front
 * behavior are handled centrally by the `<Dashboard>` component's
 * `DndContext` `onDragEnd` handler.
 *
 * @param options - Configuration with widget id and disabled flag.
 * @returns Draggable state and dnd-kit props to spread on the draggable node.
 *
 * @example
 * ```tsx
 * import { useDraggable } from "@dashcraft/core";
 *
 * function DragHandle({ widgetId }: { widgetId: string }) {
 *   const { setNodeRef, attributes, listeners, isDragging, transform } = useDraggable({
 *     id: widgetId,
 *   });
 *
 *   return (
 *     <div
 *       ref={setNodeRef}
 *       {...attributes}
 *       {...listeners}
 *       style={{
 *         transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
 *         opacity: isDragging ? 0.6 : 1,
 *       }}
 *     >
 *       Drag me
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useResize} for the companion resize-handle hook.
 */
export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const { id, disabled = false } = options;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform: dndTransform,
    isDragging,
  } = useDndDraggable({
    id,
    disabled,
  });

  const transform = dndTransform ? { x: dndTransform.x, y: dndTransform.y } : null;

  // Debug: log only when isDragging changes state (only in debug mode)
  const prevIsDragging = useRef(isDragging);
  useEffect(() => {
    if (DEBUG && prevIsDragging.current !== isDragging) {
      console.log("[DashCraft] useDraggable state change", {
        id,
        isDragging,
        transform: transform ? { x: transform.x, y: transform.y } : null,
      });
      prevIsDragging.current = isDragging;
    }
  }, [isDragging, id, transform]);

  return {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
  };
}
