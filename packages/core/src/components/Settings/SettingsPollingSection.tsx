import React, { useCallback } from "react";

// ============================================================
// Props
// ============================================================

export interface SettingsPollingSectionProps {
  pollingInterval: number;
  onChange: (value: number[]) => void;
}

// ============================================================
// Options
// ============================================================

const POLLING_OPTIONS: Array<{ label: string; value: number }> = [
  { label: "Off",  value: 0 },
  { label: "5s",   value: 5_000 },
  { label: "15s",  value: 15_000 },
  { label: "30s",  value: 30_000 },
  { label: "1m",   value: 60_000 },
  { label: "5m",   value: 300_000 },
];

// ============================================================
// Component
// ============================================================

export const SettingsPollingSection = React.memo(
  function SettingsPollingSection({
    pollingInterval,
    onChange,
  }: SettingsPollingSectionProps): React.JSX.Element {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange([Number(e.target.value)]);
      },
      [onChange]
    );

    return (
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Polling Interval
        </label>
        <select
          value={pollingInterval}
          onChange={handleChange}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          {POLLING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

SettingsPollingSection.displayName = "SettingsPollingSection";
