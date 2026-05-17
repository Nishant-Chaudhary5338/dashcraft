import { useEffect, useRef, useCallback } from "react";

// ============================================================
// Widget Event System
// ============================================================

/**
 * Widget lifecycle events
 */
export type WidgetEvent =
  | "mount"
  | "unmount"
  | "resize"
  | "dataChange"
  | "focus"
  | "blur"
  | "error";

/**
 * Event payload for widget events
 */
export interface WidgetEventPayload {
  widgetId: string;
  eventType: WidgetEvent;
  timestamp: number;
  data?: unknown;
}

/**
 * Event listener callback type
 */
export type WidgetEventListener = (payload: WidgetEventPayload) => void;

/**
 * Internal event bus for widget events
 */
class WidgetEventBus {
  private listeners = new Map<string, Set<WidgetEventListener>>();

  /**
   * Subscribe to events for a specific widget
   */
  subscribe(widgetId: string, listener: WidgetEventListener): () => void {
    if (!this.listeners.has(widgetId)) {
      this.listeners.set(widgetId, new Set());
    }
    this.listeners.get(widgetId)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(widgetId)?.delete(listener);
      if (this.listeners.get(widgetId)?.size === 0) {
        this.listeners.delete(widgetId);
      }
    };
  }

  /**
   * Subscribe to all widget events
   */
  subscribeAll(listener: WidgetEventListener): () => void {
    const allKey = "__all__";
    if (!this.listeners.has(allKey)) {
      this.listeners.set(allKey, new Set());
    }
    this.listeners.get(allKey)!.add(listener);

    return () => {
      this.listeners.get(allKey)?.delete(listener);
      if (this.listeners.get(allKey)?.size === 0) {
        this.listeners.delete(allKey);
      }
    };
  }

  /**
   * Emit an event for a specific widget
   */
  emit(payload: WidgetEventPayload): void {
    // Notify widget-specific listeners
    const widgetListeners = this.listeners.get(payload.widgetId);
    if (widgetListeners) {
      widgetListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (error) {
          console.error("[DashCraft] Widget event listener error:", error);
        }
      });
    }

    // Notify global listeners
    const allListeners = this.listeners.get("__all__");
    if (allListeners) {
      allListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (error) {
          console.error("[DashCraft] Widget event listener error:", error);
        }
      });
    }
  }

  /**
   * Clear all listeners for a widget
   */
  clear(widgetId: string): void {
    this.listeners.delete(widgetId);
  }

  /**
   * Clear all listeners
   */
  clearAll(): void {
    this.listeners.clear();
  }
}

// Singleton event bus instance
const eventBus = new WidgetEventBus();

/**
 * Hook to subscribe to widget lifecycle events.
 * Provides emit function to trigger events and handles cleanup.
 *
 * @param widgetId - The widget ID to subscribe events for
 * @param handlers - Object with event handlers for specific events
 * @returns Object with emit function for triggering events
 *
 * @example
 * ```tsx
 * const { emit } = useWidgetEvents(widgetId, {
 *   mount: (payload) => console.log('Widget mounted:', payload.widgetId),
 *   resize: (payload) => console.log('Widget resized:', payload.data),
 *   error: (payload) => console.error('Widget error:', payload.data),
 * });
 *
 * // Emit a custom event
 * emit('dataChange', { newValue: data });
 * ```
 */
export function useWidgetEvents(
  widgetId: string,
  handlers?: Partial<Record<WidgetEvent, WidgetEventListener>>
): { emit: (eventType: WidgetEvent, data?: unknown) => void } {
  const handlersRef = useRef(handlers);

  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Subscribe to events
  useEffect(() => {
    if (!handlersRef.current) return;

    const unsubscribe = eventBus.subscribe(widgetId, (payload) => {
      const handler = handlersRef.current?.[payload.eventType];
      if (handler) {
        handler(payload);
      }
    });

    // Emit mount event
    eventBus.emit({
      widgetId,
      eventType: "mount",
      timestamp: Date.now(),
    });

    // Cleanup: emit unmount event and unsubscribe
    return () => {
      eventBus.emit({
        widgetId,
        eventType: "unmount",
        timestamp: Date.now(),
      });
      unsubscribe();
    };
  }, [widgetId]);

  // Emit function for triggering events
  const emit = useCallback(
    (eventType: WidgetEvent, data?: unknown): void => {
      eventBus.emit({
        widgetId,
        eventType,
        timestamp: Date.now(),
        data,
      });
    },
    [widgetId]
  );

  return { emit };
}

/**
 * Hook to subscribe to all widget events (global listener).
 * Useful for analytics, logging, or debugging.
 *
 * @param listener - Callback function for all widget events
 *
 * @example
 * ```tsx
 * useWidgetEventsGlobal((payload) => {
 *   console.log(`[${payload.eventType}] Widget ${payload.widgetId}`, payload.data);
 * });
 * ```
 */
export function useWidgetEventsGlobal(listener: WidgetEventListener): void {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribeAll((payload) => {
      listenerRef.current(payload);
    });

    return unsubscribe;
  }, []);
}

/**
 * Get the event bus instance for direct access (advanced use cases).
 * Prefer using the hooks for most scenarios.
 */
export function getWidgetEventBus(): WidgetEventBus {
  return eventBus;
}