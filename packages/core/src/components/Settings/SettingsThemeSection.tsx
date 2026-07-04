import React, { useCallback } from "react";
import type { WidgetTheme } from "../../types";

// ============================================================
// Props
// ============================================================

/**
 * Props for {@link SettingsThemeSection}.
 */
export interface SettingsThemeSectionProps {
  /** The theme currently applied to the widget (`"light" | "dark" | "custom"`). */
  currentTheme: WidgetTheme;
  /** Called with the newly selected theme when the user clicks a theme button. */
  onThemeChange: (theme: WidgetTheme) => void;
}

// ============================================================
// Theme Options
// ============================================================

/** The three theme choices rendered as a segmented button group, in display order. */
const THEME_OPTIONS: Array<{ value: WidgetTheme; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "custom", label: "Custom" },
];

// ============================================================
// Component
// ============================================================

/**
 * Settings section rendering a segmented button group for switching a
 * widget between the built-in `"light"`/`"dark"` themes and `"custom"`
 * (consumer-supplied) theming.
 *
 * @example
 * ```tsx
 * import { SettingsThemeSection } from "@dashcraft/core";
 *
 * <SettingsThemeSection
 *   currentTheme={settings.theme ?? "light"}
 *   onThemeChange={(theme) => updateSettings({ theme })}
 * />
 * ```
 *
 * @see {@link SettingsPanel} for the container that composes this section.
 */
export const SettingsThemeSection = React.memo(function SettingsThemeSection({
  currentTheme,
  onThemeChange,
}: SettingsThemeSectionProps): React.JSX.Element {
  const handleClick = useCallback(
    (theme: WidgetTheme) => () => {
      onThemeChange(theme);
    },
    [onThemeChange]
  );

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-2">
        Theme
      </label>
      <div className="flex gap-2">
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={handleClick(option.value)}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
              currentTheme === option.value
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});

SettingsThemeSection.displayName = "SettingsThemeSection";