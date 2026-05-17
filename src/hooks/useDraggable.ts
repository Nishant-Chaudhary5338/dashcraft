import { useDraggable as useDndDraggable } from "@dnd-kit/core";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { useRef, useEffect } from "react";
import { DEBUG } from "../utils";

// ============================================================
// useDraggable Hook
// ============================================================

export interface UseDraggableOptions {
  id: string;
  disabled?: boolean;
}

export interface UseDraggableReturn {
  isDragging: boolean;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
  setNodeRef: (node: HTMLElement | null) => void;
  transform: { x: number; y: number } | null;
}

/**
 * Hook to make a DashboardCard draggable using @dnd-kit.
 * Position updates and bring-to-front are handled by DndContext in Dashboard.
 *
 * @param options - Configuration with widget id and disabled flag
 * @returns Draggable state and handlers
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
