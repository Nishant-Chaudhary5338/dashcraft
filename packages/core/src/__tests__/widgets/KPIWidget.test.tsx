import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { KPIWidget } from "../../widgets/kpi/KPIWidget";
import { Dashboard } from "../../components/Dashboard/Dashboard";

describe("KPIWidget", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Dashboard, null, children);

  it("should render value and label", () => {
    render(<KPIWidget id="kpi-1" value={42} label="Revenue" />, { wrapper });
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("should format currency value", () => {
    render(<KPIWidget id="kpi-2" value={1234.56} label="Revenue" format="currency" currency="USD" decimals={2} />, { wrapper });
    expect(screen.getByText("$1,234.56")).toBeInTheDocument();
  });

  it("should format percentage value", () => {
    render(<KPIWidget id="kpi-3" value={85.5} label="Accuracy" format="percentage" decimals={1} />, { wrapper });
    expect(screen.getByText("85.5%")).toBeInTheDocument();
  });

  it("should pass through string values unchanged", () => {
    render(<KPIWidget id="kpi-4" value="Healthy" label="Status" />, { wrapper });
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("should calculate up trend from previousValue", () => {
    render(<KPIWidget id="kpi-5" value={120} label="Sales" previousValue={100} decimals={0} />, { wrapper });
    expect(screen.getByText("+20%")).toBeInTheDocument();
  });

  it("should calculate down trend from previousValue", () => {
    render(<KPIWidget id="kpi-6" value={80} label="Sales" previousValue={100} decimals={0} />, { wrapper });
    expect(screen.getByText("-20%")).toBeInTheDocument();
  });

  it("should use custom trendLabel when provided", () => {
    render(<KPIWidget id="kpi-7" value={50} label="Users" trendLabel="vs last week" />, { wrapper });
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    render(<KPIWidget id="kpi-8" value={100} label="Count" icon={<span data-testid="icon">Icon</span>} />, { wrapper });
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should apply valueColor", () => {
    render(<KPIWidget id="kpi-9" value={42} label="Test" valueColor="#ff0000" />, { wrapper });
    expect(screen.getByText("42").style.color).toContain("255, 0, 0");
  });

  it("should render widget with type kpi", () => {
    render(<KPIWidget id="kpi-10" value={1} label="Test" />, { wrapper });
    expect(document.querySelector('[data-widget-type="kpi"]')).not.toBeNull();
  });
});
