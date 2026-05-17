import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { SettingsHeader } from "../../components/Settings/SettingsHeader";
import { SettingsThemeSection } from "../../components/Settings/SettingsThemeSection";
import { SettingsEndpointSection } from "../../components/Settings/SettingsEndpointSection";
import { SettingsPollingSection } from "../../components/Settings/SettingsPollingSection";
import { SettingsHighlightSection } from "../../components/Settings/SettingsHighlightSection";
import { SettingsCustomFields } from "../../components/Settings/SettingsCustomFields";

const popoverWrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Popover.Root, { open: true },
    React.createElement(Popover.Content, null, children)
  );

describe("SettingsHeader", () => {
  it("should render widget settings title", () => {
    render(<SettingsHeader />, { wrapper: popoverWrapper });
    expect(screen.getByText("Widget Settings")).toBeInTheDocument();
  });

  it("should render close button", () => {
    render(<SettingsHeader />, { wrapper: popoverWrapper });
    const closeBtn = screen.getByRole("button");
    expect(closeBtn).toBeInTheDocument();
  });
});

describe("SettingsThemeSection", () => {
  it("should render theme options", () => {
    render(<SettingsThemeSection currentTheme="light" onThemeChange={() => {}} />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("should call onThemeChange when option clicked", () => {
    const onThemeChange = vi.fn();
    render(<SettingsThemeSection currentTheme="light" onThemeChange={onThemeChange} />);
    fireEvent.click(screen.getByText("Dark"));
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("should highlight current theme", () => {
    render(<SettingsThemeSection currentTheme="dark" onThemeChange={() => {}} />);
    expect(screen.getByText("Dark").className).toContain("bg-blue-500");
  });
});

describe("SettingsEndpointSection", () => {
  it("should render with label and input", () => {
    render(<SettingsEndpointSection endpoint="" onChange={() => {}} onBlur={() => {}} />);
    expect(screen.getByText("Data Endpoint")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("https://api.example.com/data")).toBeInTheDocument();
  });

  it("should call onChange on input change", () => {
    const onChange = vi.fn();
    render(<SettingsEndpointSection endpoint="" onChange={onChange} onBlur={() => {}} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "https://api.test.com" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("should call onBlur and display endpoint value", () => {
    const onBlur = vi.fn();
    render(<SettingsEndpointSection endpoint="https://example.com" onChange={() => {}} onBlur={onBlur} />);
    expect(screen.getByRole("textbox")).toHaveValue("https://example.com");
    fireEvent.blur(screen.getByRole("textbox"));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe("SettingsPollingSection", () => {
  it("should render label and display Off when interval is 0", () => {
    render(<SettingsPollingSection pollingInterval={0} onChange={() => {}} />);
    expect(screen.getByText("Polling Interval")).toBeInTheDocument();
    expect(screen.getByText("Off")).toBeInTheDocument();
  });

  it("should display interval in seconds when > 0", () => {
    render(<SettingsPollingSection pollingInterval={5000} onChange={() => {}} />);
    expect(screen.getByText("5s")).toBeInTheDocument();
  });
});

describe("SettingsHighlightSection", () => {
  it("should render label and show color picker when enabled", () => {
    render(<SettingsHighlightSection isEnabled={true} color="#ff0000" onToggle={() => {}} onColorChange={() => {}} />);
    expect(screen.getByText("Highlight Border")).toBeInTheDocument();
    expect(screen.getByText("Color:")).toBeInTheDocument();
    expect(screen.getByText("#ff0000")).toBeInTheDocument();
  });

  it("should not show color picker when disabled", () => {
    render(<SettingsHighlightSection isEnabled={false} color="#ff0000" onToggle={() => {}} onColorChange={() => {}} />);
    expect(screen.queryByText("Color:")).not.toBeInTheDocument();
  });

  it("should call onColorChange when color input changes", () => {
    const onColorChange = vi.fn();
    render(<SettingsHighlightSection isEnabled={true} color="#ff0000" onToggle={() => {}} onColorChange={onColorChange} />);
    fireEvent.change(screen.getByDisplayValue("#ff0000"), { target: { value: "#00ff00" } });
    expect(onColorChange).toHaveBeenCalledWith("#00ff00");
  });
});

describe("SettingsCustomFields", () => {
  it("should return null when no fields", () => {
    const { container } = render(<SettingsCustomFields fields={{}} values={{}} onChange={() => {}} />);
    expect(container.innerHTML).toBe("");
  });

  it("should render text field with value", () => {
    render(<SettingsCustomFields fields={{ name: { type: "text", label: "Name" } }} values={{ name: "test" }} onChange={() => {}} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("test");
  });

  it("should call onChange when text field changes", () => {
    const onChange = vi.fn();
    render(<SettingsCustomFields fields={{ name: { type: "text", label: "Name" } }} values={{ name: "" }} onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "new value" } });
    expect(onChange).toHaveBeenCalledWith("name", "new value");
  });

  it("should render select field with options", () => {
    render(<SettingsCustomFields fields={{ color: { type: "select", label: "Color", options: ["red", "blue"] } }} values={{ color: "red" }} onChange={() => {}} />);
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should render multiple fields", () => {
    render(<SettingsCustomFields fields={{ a: { type: "text", label: "Field A" }, b: { type: "text", label: "Field B" } }} values={{ a: "1", b: "2" }} onChange={() => {}} />);
    expect(screen.getByText("Field A")).toBeInTheDocument();
    expect(screen.getByText("Field B")).toBeInTheDocument();
  });
});
