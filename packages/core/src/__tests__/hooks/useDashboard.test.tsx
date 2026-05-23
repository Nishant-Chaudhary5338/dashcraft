import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { Dashboard } from "../../components/Dashboard/Dashboard";
import { DashboardContext } from "../../components/Dashboard/Dashboard.context";

describe("useDashboard", () => {
  it("should return dashboard context when inside provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(Dashboard, null, children);

    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.isEditMode).toBe(false);
    expect(result.current.widgets).toEqual({});
    expect(typeof result.current.toggleEditMode).toBe("function");
    expect(typeof result.current.setEditMode).toBe("function");
    expect(typeof result.current.addWidget).toBe("function");
    expect(typeof result.current.removeWidget).toBe("function");
    expect(typeof result.current.saveLayout).toBe("function");
    expect(typeof result.current.loadLayout).toBe("function");
    expect(typeof result.current.resetLayout).toBe("function");
  });

  it("should throw when used outside Dashboard provider", () => {
    expect(() => {
      renderHook(() => useDashboard());
    }).toThrow("useDashboard must be used within a <Dashboard>");
  });
});
