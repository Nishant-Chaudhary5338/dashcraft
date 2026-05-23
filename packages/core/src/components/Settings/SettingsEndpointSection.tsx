import React, { useState, useCallback } from "react";

// ============================================================
// Props
// ============================================================

export interface SettingsEndpointSectionProps {
  endpoint: string;
  /** Predefined endpoint URLs to show in the select. Defaults to empty. */
  endpointOptions?: string[];
  onChange: (endpoint: string) => void;
  onBlur?: () => void;
}

const CUSTOM_SENTINEL = "__custom__";

// ============================================================
// Component
// ============================================================

export const SettingsEndpointSection = React.memo(
  function SettingsEndpointSection({
    endpoint,
    endpointOptions = [],
    onChange,
    onBlur,
  }: SettingsEndpointSectionProps): React.JSX.Element {
    const isCustom = endpoint !== "" && !endpointOptions.includes(endpoint);
    const [showCustomInput, setShowCustomInput] = useState(isCustom);

    const handleSelectChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === CUSTOM_SENTINEL) {
          setShowCustomInput(true);
          onChange("");
        } else {
          setShowCustomInput(false);
          onChange(val);
        }
      },
      [onChange]
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    const selectValue = showCustomInput || isCustom ? CUSTOM_SENTINEL : endpoint;

    return (
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Data Endpoint
        </label>
        <select
          value={selectValue}
          onChange={handleSelectChange}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="">— None —</option>
          {endpointOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value={CUSTOM_SENTINEL}>Custom URL…</option>
        </select>

        {(showCustomInput || isCustom) && (
          <input
            type="text"
            value={endpoint}
            onChange={handleInputChange}
            onBlur={onBlur}
            placeholder="https://api.example.com/data"
            className="mt-1.5 w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )}
      </div>
    );
  }
);

SettingsEndpointSection.displayName = "SettingsEndpointSection";
