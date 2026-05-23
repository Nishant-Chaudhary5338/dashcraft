import React, { useCallback } from "react";
import type { WidgetTheme } from "../../types";

// ============================================================
// Props
// ============================================================

export interface SettingsThemeSectionProps {
  currentTheme: WidgetTheme;
  onThemeChange: (theme: WidgetTheme) => void;
}

// ============================================================
// Theme Options
// ============================================================

const THEME_OPTIONS: Array<{ value: WidgetTheme; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "custom", label: "Custom" },
];

// ============================================================
// Component
// ============================================================

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