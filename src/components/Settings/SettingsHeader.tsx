import React from "react";
import * as Popover from "@radix-ui/react-popover";

// ============================================================
// SettingsHeader Component
// ============================================================

export function SettingsHeader(): React.JSX.Element {
  return (
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-sm font-semibold text-gray-700">Widget Settings</h4>
      <Popover.Close className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Popover.Close>
    </div>
  );
}