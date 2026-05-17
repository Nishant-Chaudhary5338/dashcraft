import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThrottle, useThrottledCallback } from "../../hooks/useThrottle";

describe("useThrottle", () => {
  it("should return initial value", () => {
    const { result } = renderHook(() => useThrottle("hello", 100));
    expect(result.current).toBe("hello");
  });

  it("should throttle value updates", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 300), {
      initialProps: { value: "a" },
    });

    expect(result.current).toBe("a");

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("b");

    vi.useRealTimers();
  });

  it("should use default interval of 300ms", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useThrottle(value), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("b");

    vi.useRealTimers();
  });
});

describe("useThrottledCallback", () => {
  it("should execute callback immediately on first call", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 200));

    act(() => result.current("arg1"));
    expect(callback).toHaveBeenCalledWith("arg1");
    expect(callback).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("should throttle subsequent calls", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 200));

    act(() => result.current("first"));
    expect(callback).toHaveBeenCalledTimes(1);

    // Call again immediately - should be throttled
    act(() => result.current("second"));
    expect(callback).toHaveBeenCalledTimes(1);

    // After interval, the last scheduled call should execute
    act(() => vi.advanceTimersByTime(200));
    expect(callback).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("should update callback reference", () => {
    vi.useFakeTimers();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useThrottledCallback(cb, 100),
      { initialProps: { cb: callback1 } }
    );

    act(() => result.current());
    expect(callback1).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(100));
    rerender({ cb: callback2 });

    act(() => result.current());
    expect(callback2).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
