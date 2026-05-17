import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStateWithHistory } from "../../hooks/useStateWithHistory";

describe("useStateWithHistory", () => {
  it("should return initial state", () => {
    const { result } = renderHook(() => useStateWithHistory("initial"));
    expect(result.current[0].value).toBe("initial");
  });

  it("should update state and keep history", () => {
    const { result } = renderHook(() => useStateWithHistory("a"));
    act(() => result.current[0].set("b"));
    expect(result.current[0].value).toBe("b");
    expect(result.current[0].history).toContain("a");
    expect(result.current[0].history).toContain("b");
    expect(result.current[0].index).toBe(1);
  });

  it("should support functional updates", () => {
    const { result } = renderHook(() => useStateWithHistory(1));
    act(() => result.current[0].set((prev) => prev + 1));
    expect(result.current[0].value).toBe(2);
  });

  it("should go back in history", () => {
    const { result } = renderHook(() => useStateWithHistory("a"));
    act(() => result.current[0].set("b"));
    act(() => result.current[0].set("c"));
    act(() => result.current[0].back());
    expect(result.current[0].value).toBe("b");
    expect(result.current[0].index).toBe(1);
  });

  it("should go forward in history", () => {
    const { result } = renderHook(() => useStateWithHistory("a"));
    act(() => result.current[0].set("b"));
    act(() => result.current[0].set("c"));
    act(() => result.current[0].back());
    act(() => result.current[0].back());
    act(() => result.current[0].forward());
    expect(result.current[0].value).toBe("b");
    expect(result.current[0].index).toBe(1);
  });

  it("should go to specific index", () => {
    const { result } = renderHook(() => useStateWithHistory("a"));
    act(() => result.current[0].set("b"));
    act(() => result.current[0].set("c"));
    act(() => result.current[0].set("d"));
    act(() => result.current[0].go(0));
    expect(result.current[0].value).toBe("a");
    act(() => result.current[0].go(2));
    expect(result.current[0].value).toBe("c");
  });

  it("should report canGoBack and canGoForward", () => {
    const { result } = renderHook(() => useStateWithHistory("a"));
    expect(result.current[0].canGoBack).toBe(false);
    expect(result.current[0].canGoForward).toBe(false);

    act(() => result.current[0].set("b"));
    expect(result.current[0].canGoBack).toBe(true);
    expect(result.current[0].canGoForward).toBe(false);

    act(() => result.current[0].back());
    expect(result.current[0].canGoBack).toBe(false);
    expect(result.current[0].canGoForward).toBe(true);
  });

  it("should truncate future on new set after back", () => {
    const { result } = renderHook(() => useStateWithHistory("a"));
    act(() => result.current[0].set("b"));
    act(() => result.current[0].set("c"));
    act(() => result.current[0].back());
    act(() => result.current[0].set("d"));
    expect(result.current[0].value).toBe("d");
    expect(result.current[0].history).toEqual(["a", "b", "d"]);
  });

  it("should respect maxHistory limit", () => {
    const { result } = renderHook(() => useStateWithHistory("a", { maxHistory: 3 }));
    act(() => result.current[0].set("b"));
    act(() => result.current[0].set("c"));
    act(() => result.current[0].set("d"));
    expect(result.current[0].history.length).toBe(3);
    expect(result.current[0].history[0]).toBe("b");
  });

  it("should reset history", () => {
    const { result } = renderHook(() => useStateWithHistory("a"));
    act(() => result.current[0].set("b"));
    act(() => result.current[0].set("c"));
    act(() => result.current[0].reset("fresh");
    expect(result.current[0].value).toBe("fresh");
    expect(result.current[0].history).toEqual(["fresh"]);
    expect(result.current[0].index).toBe(0);
  });
});
