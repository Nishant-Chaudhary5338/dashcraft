import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWidgetEvents, useWidgetEventsGlobal, getWidgetEventBus } from "../../hooks/useWidgetEvents";

describe("useWidgetEvents", () => {
  it("should provide emit function", () => {
    const { result } = renderHook(() => useWidgetEvents("widget-1"));
    expect(result.current.emit).toBeInstanceOf(Function);
  });

  it("should emit mount event on mount", () => {
    const handler = vi.fn();
    renderHook(() => useWidgetEvents("widget-1", { mount: handler }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ widgetId: "widget-1", eventType: "mount" })
    );
  });

  it("should emit unmount event on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useWidgetEvents("widget-1", { unmount: handler }));
    unmount();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ widgetId: "widget-1", eventType: "unmount" })
    );
  });

  it("should emit custom events", () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useWidgetEvents("widget-1", { dataChange: handler }));

    act(() => result.current.emit("dataChange", { value: 42 }));

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ widgetId: "widget-1", eventType: "dataChange", data: { value: 42 } })
    );
  });

  it("should not receive events for other widgets", () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useWidgetEvents("widget-1", { resize: handler }));

    act(() => result.current.emit("resize", { width: 500 }));
    expect(handler).toHaveBeenCalledTimes(1);

    const handler2 = vi.fn();
    renderHook(() => useWidgetEvents("widget-2", { resize: handler2 }));
    expect(handler2).not.toHaveBeenCalled();
  });
});

describe("useWidgetEventsGlobal", () => {
  it("should receive all widget events", () => {
    const listener = vi.fn();
    renderHook(() => useWidgetEventsGlobal(listener));

    const { result } = renderHook(() => useWidgetEvents("widget-1"));

    act(() => result.current.emit("dataChange", { test: true }));

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ widgetId: "widget-1", eventType: "dataChange" })
    );
  });
});

describe("getWidgetEventBus", () => {
  it("should return the singleton event bus", () => {
    const bus1 = getWidgetEventBus();
    const bus2 = getWidgetEventBus();
    expect(bus1).toBe(bus2);
  });
});
