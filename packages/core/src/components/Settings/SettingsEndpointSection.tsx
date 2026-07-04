import React, { useState, useCallback } from "react";

// ============================================================
// Props
// ============================================================

/**
 * Props for {@link SettingsEndpointSection}.
 */
export interface SettingsEndpointSectionProps {
  /** Current endpoint URL. Empty string means "no endpoint selected". */
  endpoint: string;
  /** Predefined endpoint URLs to show in the select.
   * @default [] */
  endpointOptions?: string[];
  /** Called on every keystroke in the custom-URL input, and whenever the select value changes. */
  onChange: (endpoint: string) => void;
  /** Called when the custom-URL input loses focus — use this to flush the value to persistent state. */
  onBlur?: () => void;
}

/** Sentinel `<option>` value that switches the select into "custom URL" input mode. Never sent to `onChange` as a real endpoint. */
const CUSTOM_SENTINEL = "__custom__";

// ============================================================
// Component
// ============================================================

/**
 * Settings section for choosing a widget's data endpoint: either one of a
 * predefined list ({@link SettingsEndpointSectionProps.endpointOptions}) or a
 * free-text custom URL.
 *
 * Selecting "Custom URL…" (or having an `endpoint` value that isn't in
 * `endpointOptions`) reveals a text input; the select and input are kept in
 * sync so re-opening the panel with a pre-existing custom endpoint shows the
 * input immediately.
 *
 * @example
 * ```tsx
 * import { SettingsEndpointSection } from "@dashcraft/core";
 *
 * <SettingsEndpointSection
 *   endpoint={settings.endpoint ?? ""}
 *   endpointOptions={["https://api.example.com/sales", "https://api.example.com/users"]}
 *   onChange={(endpoint) => setLocalEndpoint(endpoint)}
 *   onBlur={() => persistEndpoint()}
 * />
 * ```
 *
 * @see {@link SettingsPanel} for the container that composes this section.
 */
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
