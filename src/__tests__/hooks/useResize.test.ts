import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useResize } from "../../hooks/useResize";

describe("useResize", () => {
  it("should return initial size", () => {
    const { result } = renderHook(() =>
      useResize({ initialSize: { width: 300, height: 200 } })
    );
    expect(result.current.size).toEqual({ width: 300, height: 200 });
  });

  it("should not be resizing initially", () => {
    const { result } = renderHook(() =>
      useResize({ initialSize: { width: 300, height: 200 } })
    );
    expect(result.current.isResizing).toBe(false);
    expect(result.current.activeHandle).toBeNull();
  });

  it("should set size with setSize", () => {
    const { result } = renderHook(() =>
      useResize({ initialSize: { width: 300, height: 200 } })
    );
    act(() => result.current.setSize({ width: 500, height: 400 }));
    expect(result.current.size).toEqual({ width: 500, height: 400 });
  });

  it("should support functional setSize", () => {
    const { result } = renderHook(() =>
      useResize({ initialSize: { width: 300, height: 200 } })
    );
    act(() => result.current.setSize((prev) => ({ width: prev.width + 100, height: prev.height + 50 })));
    expect(result.current.size).toEqual({ width: 400, height: 250 });
  });

  it("should respect minSize constraints", () => {
    const { result } = renderHook(() =>
      useResize({
        initialSize: { width: 300, height: 200 },
        minSize: { width: 100, height: 100 },
      })
    );
    act(() => result.current.setSize({ width: 50, height: 50 }));
    expect(result.current.size).toEqual({ width: 100, height: 100 });
  });

  it("should respect maxSize constraints", () => {
    const { result } = renderHook(() =>
      useResize({
        initialSize: { width: 300, height: 200 },
        maxSize: { width: 500, height: 400 },
      })
    );
    act(() => result.current.setSize({ width: 1000, height: 800 }));
    expect(result.current.size).toEqual({ width: 500, height: 400 });
  });

  it("should snap to grid", () => {
    const { result } = renderHook(() =>
      useResize({
        initialSize: { width: 300, height: 200 },
        gridSize: 10,
      })
    );
    act(() => result.current.setSize({ width: 313, height: 217 }));
    expect(result.current.size).toEqual({ width: 310, height: 220 });
  });

  it("should reset to initial size", () => {
    const { result } = renderHook(() =>
      useResize({ initialSize: { width: 300, height: 200 } })
    );
    act(() => result.current.setSize({ width: 500, height: 400 }));
    act(() => result.current.resetSize());
    expect(result.current.size).toEqual({ width: 300, height: 200 });
  });

  it("should return handle props", () => {
    const { result } = renderHook(() =>
      useResize({ initialSize: { width: 300, height: 200 } })
    );
    const handleProps = result.current.getHandleProps("bottomRight");
    expect(handleProps).toHaveProperty("onMouseDown");
    expect(handleProps).toHaveProperty("onTouchStart");
    expect(handleProps["data-resize-handle"]).toBe("bottomRight");
    expect(handleProps.style).toBeDefined();
  });

  it("should return container props", () => {
    const { result } = renderHook(() =>
      useResize({ initialSize: { width: 300, height: 200 } })
    );
    const containerProps = result.current.getContainerProps();
    expect(containerProps.style.width).toBe(300);
    expect(containerProps.style.height).toBe(200);
    expect(containerProps.style.position).toBe("relative");
  });

  it("should call onResizeStart on mouse down", () => {
    const onResizeStart = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialSize: { width: 300, height: 200 },
        onResizeStart,
      })
    );
    const handleProps = result.current.getHandleProps("right");

    act(() => {
      handleProps.onMouseDown({ clientX: 100, clientY: 100, preventDefault: () => {}, stopPropagation: () => {} } as any);
    });

    expect(onResizeStart).toHaveBeenCalledWith("right");
    expect(result.current.isResizing).toBe(true);
  });

  it("should call onResizeEnd on mouse up", () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialSize: { width: 300, height: 200 },
        onResizeEnd,
      })
    );
    const handleProps = result.current.getHandleProps("bottomRight");

    act(() => {
      handleProps.onMouseDown({ clientX: 0, clientY: 0, preventDefault: () => {}, stopPropagation: () => {} } as any);
    });

    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });

    expect(onResizeEnd).toHaveBeenCalledWith({ width: 300, height: 200 });
    expect(result.current.isResizing).toBe(false);
  });
});
