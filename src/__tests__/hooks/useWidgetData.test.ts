import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWidgetData } from "../../utils/http-client";

describe("useWidgetData", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should start with loading false and no data", () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useWidgetData({ endpoint: "/api/test" }));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should fetch and return data", async () => {
    const mockData = { value: 42 };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const { result } = renderHook(() => useWidgetData({ endpoint: "/api/data" }));
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    const { result } = renderHook(() => useWidgetData({ endpoint: "/api/fail" }));
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toContain("500");
  });

  it("should provide refetch function", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 1 }),
    } as Response);

    const { result } = renderHook(() => useWidgetData({ endpoint: "/api/data" }));
    await act(async () => {});

    expect(result.current.refetch).toBeInstanceOf(Function);
    await act(async () => result.current.refetch());
    expect(fetchMock).toHaveBeenCalled();
  });

  it("should provide cancel function", () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useWidgetData({ endpoint: "/api/data" }));
    expect(result.current.cancel).toBeInstanceOf(Function);
    act(() => result.current.cancel());
  });

  it("should not fetch when enabled is false", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    renderHook(() => useWidgetData({ endpoint: "/api/data", enabled: false }));
    await act(async () => {});
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
