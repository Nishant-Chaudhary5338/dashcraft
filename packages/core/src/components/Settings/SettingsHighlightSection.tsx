import React, { useState, useCallback, useEffect } from "react";
import * as Switch from "@radix-ui/react-switch";

// ============================================================
// Props
// ============================================================

export interface SettingsHighlightSectionProps {
  isEnabled: boolean;
  color: string;
  onToggle: (checked: boolean) => void;
  onColorChange: (color: string) => void;
}

// ============================================================
// Component
// ============================================================

export const SettingsHighlightSection = React.memo(
  function SettingsHighlightSection({
    isEnabled,
    color,
    onToggle,
    onColorChange,
  }: SettingsHighlightSectionProps): React.JSX.Element {
    // Local draft — only flushes to the store on blur to avoid hammering state
    // on every mouse-move tick of the native color picker.
    const [colorDraft, setColorDraft] = useState(color);

    // Keep draft in sync when an external update arrives (e.g. panel re-open)
    useEffect(() => {
      setColorDraft(color);
    }, [color]);

    const handleColorChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setColorDraft(e.target.value);
      },
      []
    );

    const handleColorBlur = useCallback(() => {
      onColorChange(colorDraft);
    }, [colorDraft, onColorChange]);

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">
            Highlight Border
          </label>
          <Switch.Root
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="w-9 h-5 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
          >
            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-4" />
          </Switch.Root>
        </div>

        {isEnabled && (
          <div className="mt-2 flex items-center gap-2">
            <label className="text-xs text-gray-500">Color:</label>
            <input
              type="color"
              value={colorDraft}
              onChange={handleColorChange}
              onBlur={handleColorBlur}
              className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            />
            <span className="text-xs text-gray-500 font-mono">{colorDraft}</span>
          </div>
        )}
      </div>
    );
  }
);

SettingsHighlightSection.displayName = "SettingsHighlightSection";
