import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { WidgetActionButton, WidgetActions, DragHandleButton } from "../../components/DashboardCard/WidgetActions";

describe("WidgetActions", () => {
  it("should render children when visible", () => {
    render(
      <WidgetActions visible={true}>
        <span data-testid="child">Action</span>
      </WidgetActions>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should return null when not visible", () => {
    const { container } = render(
      <WidgetActions visible={false}>
        <span>Action</span>
      </WidgetActions>
    );
    expect(container.innerHTML).toBe("");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <WidgetActions visible={true} className="custom-class">
        <span>Action</span>
      </WidgetActions>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

describe("WidgetActionButton", () => {
  it("should render button with icon", () => {
    render(
      <WidgetActionButton
        position="top-right"
        icon={<span data-testid="icon">Icon</span>}
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should return null when not visible", () => {
    const { container } = render(
      <WidgetActionButton
        position="top-right"
        icon={<span>Icon</span>}
        visible={false}
      />
    );
    expect(container.innerHTML).toBe("");
  });

  it("should call onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <WidgetActionButton
        position="top-right"
        icon={<span>Icon</span>}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should set tooltip as title and aria-label", () => {
    render(
      <WidgetActionButton
        position="top-right"
        icon={<span>Icon</span>}
        tooltip="My tooltip"
      />
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("title", "My tooltip");
    expect(btn).toHaveAttribute("aria-label", "My tooltip");
  });

  it("should apply position class", () => {
    render(
      <WidgetActionButton
        position="top-left"
        icon={<span>Icon</span>}
      />
    );
    expect(screen.getByRole("button")).toHaveClass("top-2", "left-2");
  });
});

describe("DragHandleButton", () => {
  it("should render when visible", () => {
    render(<DragHandleButton visible={true} />);
    expect(screen.getByTitle("Drag to move")).toBeInTheDocument();
  });

  it("should not render when not visible", () => {
    const { container } = render(<DragHandleButton visible={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("should apply custom className", () => {
    render(<DragHandleButton visible={true} className="extra-class" />);
    expect(screen.getByRole("button")).toHaveClass("extra-class");
  });
});
