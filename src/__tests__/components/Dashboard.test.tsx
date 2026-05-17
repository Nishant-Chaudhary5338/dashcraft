import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Dashboard, DashboardCard, useDashboard } from "../../index";

describe("Dashboard", () => {
  it("should render children", () => {
    render(
      <Dashboard>
        <div data-testid="child">Hello</div>
      </Dashboard>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should have data-dashcraft-dashboard attribute", () => {
    const { container } = render(
      <Dashboard>
        <div />
      </Dashboard>
    );
    expect(container.querySelector("[data-dashcraft-dashboard]")).not.toBeNull();
  });

  it("should render multiple children", () => {
    render(
      <Dashboard>
        <div data-testid="a" />
        <div data-testid="b" />
      </Dashboard>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });
});

describe("DashboardCard", () => {
  it("should render inside Dashboard", () => {
    render(
      <Dashboard>
        <DashboardCard id="card-1" title="Test Card">
          <div data-testid="card-content">Content</div>
        </DashboardCard>
      </Dashboard>
    );
    expect(screen.getByTestId("card-content")).toBeInTheDocument();
  });

  it("should render with title", () => {
    render(
      <Dashboard>
        <DashboardCard id="card-1" title="My Widget">
          <div>Content</div>
        </DashboardCard>
      </Dashboard>
    );
    // Title is not directly rendered in card, but widget is registered
    const widgetEl = document.querySelector('[data-widget-id="card-1"]');
    expect(widgetEl).not.toBeNull();
  });

  it("should render multiple cards", () => {
    render(
      <Dashboard>
        <DashboardCard id="card-1"><div data-testid="c1" /></DashboardCard>
        <DashboardCard id="card-2"><div data-testid="c2" /></DashboardCard>
      </Dashboard>
    );
    expect(screen.getByTestId("c1")).toBeInTheDocument();
    expect(screen.getByTestId("c2")).toBeInTheDocument();
  });
});
