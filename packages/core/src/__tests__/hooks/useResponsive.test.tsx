import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useResponsive } from "../../hooks/useResponsive";

describe("useResponsive", () => {
  it("should return initial content when no breakpoints", () => {
    const { result } = renderHook(() =>
      useResponsive({ initial: React.createElement("div", { "data-testid": "initial" }, "Default") })
    );
    expect(result.current.content).toBeDefined();
    expect(result.current.currentBreakpoint).toBe("initial");
    expect(result.current.containerRef).toBeDefined();
  });

  it("should return initial content when breakpoints is undefined", () => {
    const { result } = renderHook(() =>
      useResponsive({ breakpoints: undefined, initial: "fallback" })
    );
    expect(result.current.content).toBe("fallback");
    expect(result.current.currentBreakpoint).toBe("initial");
  });

  it("should return containerRef as a ref object", () => {
    const { result } = renderHook(() =>
      useResponsive({ initial: "content" })
    );
    expect(result.current.containerRef).toHaveProperty("current");
  });
});
