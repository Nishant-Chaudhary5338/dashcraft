import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce, useDebouncedCallback } from "../../hooks/useDebounce";

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 100));
    expect(result.current).toBe("hello");
  });

  it("should debounce value updates", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "initial" },
    });

    expect(result.current).toBe("initial");

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("initial");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("updated");

    vi.useRealTimers();
  });

  it("should use default delay of 300ms", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("updated");

    vi.useRealTimers();
  });

  it("should reset timer on rapid changes", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(50));

    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(50));
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(50));
    expect(result.current).toBe("c");

    vi.useRealTimers();
  });
});

describe("useDebouncedCallback", () => {
  it("should debounce callback execution", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 200));

    act(() => result.current("arg1"));
    expect(callback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(callback).toHaveBeenCalledWith("arg1");
    expect(callback).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("should cancel previous call on rapid invocation", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 100));

    act(() => result.current("first"));
    act(() => vi.advanceTimersByTime(50));
    act(() => result.current("second"));
    act(() => vi.advanceTimersByTime(100));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");

    vi.useRealTimers();
  });

  it("should use latest callback reference", () => {
    vi.useFakeTimers();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 100),
      { initialProps: { cb: callback1 } }
    );

    rerender({ cb: callback2 });
    act(() => result.current());
    act(() => vi.advanceTimersByTime(100));

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
