import { useEffect, useRef, useCallback } from "react";

// ============================================================
// Widget Event System
// ============================================================

/**
 * The set of widget lifecycle event names understood by the widget event
 * bus. `"mount"` and `"unmount"` are emitted automatically by
 * {@link useWidgetEvents}; the rest (`"resize"`, `"dataChange"`,
 * `"focus"`, `"blur"`, `"error"`) are emitted manually via that hook's
 * returned `emit` function, or via {@link getWidgetEventBus}.
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
 * The payload delivered to every {@link WidgetEventListener}.
 */
export interface WidgetEventPayload {
  /** The widget the event originated from. */
  widgetId: string;
  /** Which lifecycle event occurred. */
  eventType: WidgetEvent;
  /** `Date.now()` at the moment the event was emitted. */
  timestamp: number;
  /** Optional event-specific payload, e.g. the new data on `"dataChange"` or the error on `"error"`. */
  data?: unknown;
}

/**
 * Callback invoked with a {@link WidgetEventPayload} whenever a subscribed
 * widget event fires. Thrown errors are caught and logged by the event
 * bus so one bad listener can't break others.
 */
export type WidgetEventListener = (payload: WidgetEventPayload) => void;

/**
 * Process-wide pub/sub bus for widget lifecycle events. A single
 * singleton instance backs both {@link useWidgetEvents} (per-widget
 * subscriptions) and {@link useWidgetEventsGlobal} (subscribe-to-all).
 * Most consumers should use those hooks rather than this class directly;
 * it's exposed via {@link getWidgetEventBus} for advanced cases like
 * emitting events from outside React (e.g. a non-React data adapter).
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
 * Subscribes a widget to its own lifecycle events and provides an `emit`
 * function to trigger custom ones.
 *
 * Automatically emits `"mount"` when the component using this hook mounts
 * and `"unmount"` when it unmounts (or when `widgetId` changes), and
 * unsubscribes cleanly on cleanup. Use this inside a widget's own
 * component to react to its lifecycle, or to broadcast custom events
 * (e.g. `"dataChange"`) that other parts of the dashboard can observe via
 * {@link useWidgetEventsGlobal}.
 *
 * @param widgetId - The widget ID to scope subscriptions and emitted
 * events to. Changing this unsubscribes from the old id and subscribes
 * to the new one.
 * @param handlers - Optional map of event name to handler; only events
 * with a handler present are acted on. Re-renders don't require a
 * memoized object — the latest `handlers` is always used via a ref.
 * @returns An object with `emit(eventType, data?)` to fire an event for
 * this widget.
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
 *
 * @see {@link useWidgetEventsGlobal} to listen to every widget's events at once.
 * @see {@link getWidgetEventBus} for direct bus access outside of React.
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
 * Subscribes to every widget's lifecycle events across the whole
 * dashboard, regardless of widget id.
 *
 * Useful for analytics, centralized logging, or a debug overlay that
 * needs visibility into all widgets at once, without each widget having
 * to forward its events manually.
 *
 * @param listener - Callback invoked for every event emitted by any
 * widget. Re-renders don't require memoizing `listener` — the latest
 * value is always used via a ref, and the subscription itself is only
 * set up once (on mount).
 *
 * @example
 * ```tsx
 * import { useWidgetEventsGlobal } from "@dashcraft/core";
 *
 * function DashboardDebugPanel() {
 *   useWidgetEventsGlobal((payload) => {
 *     console.log(`[${payload.eventType}] Widget ${payload.widgetId}`, payload.data);
 *   });
 *   return null;
 * }
 * ```
 *
 * @see {@link useWidgetEvents} to scope subscriptions to a single widget.
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
 * Returns the singleton widget event bus for direct, non-React access —
 * e.g. emitting an `"error"` event from a plain-JS data adapter, or
 * subscribing from code that runs outside a component's lifecycle. Prefer
 * {@link useWidgetEvents} or {@link useWidgetEventsGlobal} inside React
 * components, since they handle subscribe/unsubscribe cleanup for you.
 *
 * @returns The process-wide event bus instance.
 *
 * @example
 * ```tsx
 * import { getWidgetEventBus } from "@dashcraft/core";
 *
 * // From outside a React component, e.g. a websocket handler:
 * getWidgetEventBus().emit({
 *   widgetId: "sales-chart",
 *   eventType: "dataChange",
 *   timestamp: Date.now(),
 *   data: newDataset,
 * });
 * ```
 *
 * @see {@link useWidgetEvents}
 * @see {@link useWidgetEventsGlobal}
 */
export function getWidgetEventBus(): WidgetEventBus {
  return eventBus;
}