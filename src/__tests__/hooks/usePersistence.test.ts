import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistence, usePersistedState } from "../../hooks/usePersistence";

describe("usePersistence", () => {
  beforeEach(() => localStorage.clear());

  it("should use default value when no stored data", async () => {
    const { result } = renderHook(() =>
      usePersistence({ key: "test", defaultValue: "default" })
    );
    await act(async () => { /* wait for load */ });
    expect(result.current.value).toBe("default");
  });

  it("should update value with setValue", async () => {
    const { result } = renderHook(() =>
      usePersistence({ key: "test", defaultValue: 0 })
    );
    await act(async () => {});
    act(() => result.current.setValue(42));
    expect(result.current.value).toBe(42);
  });

  it("should support functional setValue updates", async () => {
    const { result } = renderHook(() =>
      usePersistence({ key: "test", defaultValue: 0 })
    );
    await act(async () => {});
    act(() => result.current.setValue((prev: number) => prev + 1));
    expect(result.current.value).toBe(1);
  });

  it("should track dirty state", async () => {
    const { result } = renderHook(() =>
      usePersistence({ key: "test", defaultValue: "initial" })
    );
    await act(async () => {});
    expect(result.current.isDirty).toBe(false);
    act(() => result.current.setValue("changed"));
    expect(result.current.isDirty).toBe(true);
  });

  it("should save to storage", async () => {
    const onSave = vi.fn();
    const { result } = renderHook(() =>
      usePersistence({ key: "save-test", defaultValue: { a: 1 }, onSave })
    );
    await act(async () => {});
    act(() => result.current.setValue({ a: 2 }));
    const saved = await act(async () => result.current.save());
    expect(saved).toBe(true);
    expect(onSave).toHaveBeenCalledWith({ a: 2 });
    expect(result.current.isDirty).toBe(false);
  });

  it("should load from storage", async () => {
    localStorage.setItem("dashcraft-layout-load-test", JSON.stringify({ loaded: true }));
    const onLoad = vi.fn();
    const { result } = renderHook(() =>
      usePersistence({ key: "load-test", defaultValue: { loaded: false }, onLoad })
    );
    const loaded = await act(async () => result.current.load());
    expect(loaded).toEqual({ loaded: true });
    expect(onLoad).toHaveBeenCalledWith({ loaded: true });
  });

  it("should clear storage", async () => {
    const { result } = renderHook(() =>
      usePersistence({ key: "clear-test", defaultValue: "initial" })
    );
    await act(async () => {});
    act(() => result.current.setValue("something"));
    await act(async () => result.current.save());
    const cleared = await act(async () => result.current.clear());
    expect(cleared).toBe(true);
    expect(result.current.value).toBe("initial");
  });

  it("should reset to default value", async () => {
    const { result } = renderHook(() =>
      usePersistence({ key: "reset-test", defaultValue: "default" })
    );
    await act(async () => {});
    act(() => result.current.setValue("changed"));
    act(() => result.current.reset());
    expect(result.current.value).toBe("default");
  });

  it("should use custom serializer/deserializer", async () => {
    const serializer = (v: number) => String(v);
    const deserializer = (v: string) => Number(v);
    const { result } = renderHook(() =>
      usePersistence({
        key: "custom-ser",
        defaultValue: 0,
        serializer,
        deserializer,
      })
    );
    await act(async () => {});
    act(() => result.current.setValue(42));
    await act(async () => result.current.save());
    expect(localStorage.getItem("dashcraft-layout-custom-ser")).toBe("42");
  });
});

describe("usePersistedState", () => {
  beforeEach(() => localStorage.clear());

  it("should return value and setter tuple", async () => {
    const { result } = renderHook(() => usePersistedState("tuple-test", 0));
    await act(async () => {});
    expect(result.current[0]).toBe(0);
    act(() => result.current[1](42));
    expect(result.current[0]).toBe(42);
  });
});
