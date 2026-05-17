import { describe, it, expect, beforeEach } from "vitest";
import { act } from "react";
import {
  useDashboardStore,
  selectIsEditMode,
  selectWidgets,
  selectWidgetById,
  selectWidgetCount,
} from "../../store/dashboardStore";

describe("dashboardStore", () => {
  beforeEach(() => {
    act(() => {
      useDashboardStore.getState().resetLayout();
      useDashboardStore.getState().setEditMode(false);
    });
  });

  describe("initial state", () => {
    it("should have isEditMode as false by default", () => {
      expect(useDashboardStore.getState().isEditMode).toBe(false);
    });

    it("should have empty widgets by default", () => {
      expect(useDashboardStore.getState().widgets).toEqual({});
    });

    it("should have maxZIndex as 0 by default", () => {
      expect(useDashboardStore.getState().maxZIndex).toBe(0);
    });
  });

  describe("edit mode", () => {
    it("should toggle edit mode", () => {
      act(() => useDashboardStore.getState().toggleEditMode());
      expect(useDashboardStore.getState().isEditMode).toBe(true);
      act(() => useDashboardStore.getState().toggleEditMode());
      expect(useDashboardStore.getState().isEditMode).toBe(false);
    });

    it("should set edit mode explicitly", () => {
      act(() => useDashboardStore.getState().setEditMode(true));
      expect(useDashboardStore.getState().isEditMode).toBe(true);
      act(() => useDashboardStore.getState().setEditMode(false));
      expect(useDashboardStore.getState().isEditMode).toBe(false);
    });
  });

  describe("widget CRUD", () => {
    it("should add a widget", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1", type: "chart", title: "My Chart" }));
      const w = useDashboardStore.getState().widgets["w1"];
      expect(w).toBeDefined();
      expect(w?.title).toBe("My Chart");
      expect(w?.type).toBe("chart");
      expect(w?.zIndex).toBe(1);
    });

    it("should use default position and size", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      const w = useDashboardStore.getState().widgets["w1"];
      expect(w?.position).toEqual({ x: 0, y: 0 });
      expect(w?.size).toEqual({ width: 300, height: 200 });
    });

    it("should use custom position and size", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1", defaultPosition: { x: 100, y: 200 }, defaultSize: { width: 400, height: 300 } }));
      const w = useDashboardStore.getState().widgets["w1"];
      expect(w?.position).toEqual({ x: 100, y: 200 });
      expect(w?.size).toEqual({ width: 400, height: 300 });
    });

    it("should not add duplicate widget", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1", title: "First" }));
      act(() => useDashboardStore.getState().addWidget({ id: "w1", title: "Second" }));
      expect(Object.keys(useDashboardStore.getState().widgets)).toHaveLength(1);
      expect(useDashboardStore.getState().widgets["w1"]?.title).toBe("First");
    });

    it("should increment maxZIndex when adding widgets", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      expect(useDashboardStore.getState().maxZIndex).toBe(1);
      act(() => useDashboardStore.getState().addWidget({ id: "w2" }));
      expect(useDashboardStore.getState().maxZIndex).toBe(2);
    });

    it("should remove a widget", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      act(() => useDashboardStore.getState().removeWidget("w1"));
      expect(useDashboardStore.getState().widgets["w1"]).toBeUndefined();
    });

    it("should not fail removing non-existent widget", () => {
      act(() => useDashboardStore.getState().removeWidget("non-existent"));
      expect(useDashboardStore.getState().widgets).toEqual({});
    });

    it("should update widget position", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      act(() => useDashboardStore.getState().updateWidgetPosition("w1", { x: 150, y: 250 }));
      expect(useDashboardStore.getState().widgets["w1"]?.position).toEqual({ x: 150, y: 250 });
    });

    it("should update widget size", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      act(() => useDashboardStore.getState().updateWidgetSize("w1", { width: 500, height: 400 }));
      expect(useDashboardStore.getState().widgets["w1"]?.size).toEqual({ width: 500, height: 400 });
    });

    it("should merge widget settings", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1", settings: { theme: "dark", endpoint: "/api" } as any }));
      act(() => useDashboardStore.getState().updateWidgetSettings("w1", { theme: "light" } as any));
      const w = useDashboardStore.getState().widgets["w1"];
      expect(w?.settings).toEqual({ theme: "light", endpoint: "/api" });
    });
  });

  describe("bringToFront", () => {
    it("should bring widget to front", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      act(() => useDashboardStore.getState().addWidget({ id: "w2" }));
      act(() => useDashboardStore.getState().addWidget({ id: "w3" }));
      act(() => useDashboardStore.getState().bringToFront("w1"));
      expect(useDashboardStore.getState().widgets["w1"]?.zIndex).toBe(4);
      expect(useDashboardStore.getState().maxZIndex).toBe(4);
    });
  });

  describe("registerWidget / unregisterWidget", () => {
    it("should register and unregister a widget", () => {
      act(() => useDashboardStore.getState().registerWidget("w1", { id: "w1" }));
      expect(useDashboardStore.getState().widgets["w1"]).toBeDefined();
      act(() => useDashboardStore.getState().unregisterWidget("w1"));
      expect(useDashboardStore.getState().widgets["w1"]).toBeUndefined();
    });
  });

  describe("layout persistence", () => {
    it("should save and load layout", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1", title: "Test" }));
      act(() => useDashboardStore.getState().saveLayout("test-key"));
      expect(localStorage.getItem("dashcraft-layout-test-key")).not.toBeNull();
      act(() => {
        useDashboardStore.getState().resetLayout();
        useDashboardStore.getState().loadLayout("test-key");
      });
      expect(useDashboardStore.getState().widgets["w1"]).toBeDefined();
      expect(useDashboardStore.getState().widgets["w1"]?.title).toBe("Test");
    });

    it("should reset layout", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      act(() => useDashboardStore.getState().resetLayout());
      expect(useDashboardStore.getState().widgets).toEqual({});
      expect(useDashboardStore.getState().maxZIndex).toBe(0);
    });
  });

  describe("typed selectors", () => {
    it("selectIsEditMode", () => {
      expect(selectIsEditMode(useDashboardStore.getState())).toBe(false);
      act(() => useDashboardStore.getState().setEditMode(true));
      expect(selectIsEditMode(useDashboardStore.getState())).toBe(true);
    });

    it("selectWidgets", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      expect(selectWidgets(useDashboardStore.getState())["w1"]).toBeDefined();
    });

    it("selectWidgetById", () => {
      act(() => useDashboardStore.getState().addWidget({ id: "w1", title: "Test" }));
      expect(selectWidgetById("w1")(useDashboardStore.getState())?.title).toBe("Test");
    });

    it("selectWidgetCount", () => {
      expect(selectWidgetCount(useDashboardStore.getState())).toBe(0);
      act(() => useDashboardStore.getState().addWidget({ id: "w1" }));
      expect(selectWidgetCount(useDashboardStore.getState())).toBe(1);
    });
  });
});
