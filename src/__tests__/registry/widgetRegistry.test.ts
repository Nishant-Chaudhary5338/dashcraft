import { describe, it, expect, beforeEach } from "vitest";
import { widgetRegistry } from "../../registry/widgetRegistry";
import React from "react";

const MockComponent = () => React.createElement("div");

describe("widgetRegistry", () => {
  beforeEach(() => widgetRegistry.clear());

  it("should register a widget", () => {
    widgetRegistry.register({ type: "chart", label: "Chart", component: MockComponent, defaultSize: { width: 400, height: 300 } });
    expect(widgetRegistry.has("chart")).toBe(true);
  });

  it("should get a registered widget", () => {
    widgetRegistry.register({ type: "kpi", label: "KPI", component: MockComponent, defaultSize: { width: 200, height: 100 } });
    const reg = widgetRegistry.get("kpi");
    expect(reg?.label).toBe("KPI");
    expect(reg?.defaultSize).toEqual({ width: 200, height: 100 });
  });

  it("should return undefined for unregistered type", () => {
    expect(widgetRegistry.get("nonexistent")).toBeUndefined();
  });

  it("should unregister a widget", () => {
    widgetRegistry.register({ type: "a", label: "A", component: MockComponent, defaultSize: { width: 1, height: 1 } });
    expect(widgetRegistry.has("a")).toBe(true);
    widgetRegistry.unregister("a");
    expect(widgetRegistry.has("a")).toBe(false);
  });

  it("should list all types", () => {
    widgetRegistry.register({ type: "a", label: "A", component: MockComponent, defaultSize: { width: 1, height: 1 } });
    widgetRegistry.register({ type: "b", label: "B", component: MockComponent, defaultSize: { width: 1, height: 1 } });
    const types = widgetRegistry.list();
    expect(types).toContain("a");
    expect(types).toContain("b");
    expect(types).toHaveLength(2);
  });

  it("should listAll registrations", () => {
    widgetRegistry.register({ type: "x", label: "X", component: MockComponent, defaultSize: { width: 1, height: 1 } });
    const all = widgetRegistry.listAll();
    expect(all).toHaveLength(1);
    expect(all[0]?.label).toBe("X");
  });

  it("should filter by category", () => {
    widgetRegistry.register({ type: "a", label: "A", component: MockComponent, defaultSize: { width: 1, height: 1 }, category: "charts" });
    widgetRegistry.register({ type: "b", label: "B", component: MockComponent, defaultSize: { width: 1, height: 1 }, category: "metrics" });
    expect(widgetRegistry.getByCategory("charts")).toHaveLength(1);
    expect(widgetRegistry.getByCategory("charts")[0]?.type).toBe("a");
  });

  it("should searchByTags", () => {
    widgetRegistry.register({ type: "a", label: "A", component: MockComponent, defaultSize: { width: 1, height: 1 }, tags: ["chart", "line"] });
    widgetRegistry.register({ type: "b", label: "B", component: MockComponent, defaultSize: { width: 1, height: 1 }, tags: ["metric"] });
    const results = widgetRegistry.searchByTags(["chart"]);
    expect(results).toHaveLength(1);
    expect(results[0]?.type).toBe("a");
  });

  it("should getCategories", () => {
    widgetRegistry.register({ type: "a", label: "A", component: MockComponent, defaultSize: { width: 1, height: 1 }, category: "charts" });
    widgetRegistry.register({ type: "b", label: "B", component: MockComponent, defaultSize: { width: 1, height: 1 }, category: "metrics" });
    const cats = widgetRegistry.getCategories();
    expect(cats).toContain("charts");
    expect(cats).toContain("metrics");
  });

  it("should clear all registrations and return correct size", () => {
    widgetRegistry.register({ type: "a", label: "A", component: MockComponent, defaultSize: { width: 1, height: 1 } });
    expect(widgetRegistry.size).toBe(1);
    widgetRegistry.clear();
    expect(widgetRegistry.size).toBe(0);
  });
});
