import React, { useState, useCallback } from "react";
import { X, Plus } from "lucide-react";

// ============================================================
// Props
// ============================================================

export interface SettingsHeadersSectionProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
}

// ============================================================
// Component
// ============================================================

export const SettingsHeadersSection = React.memo(function SettingsHeadersSection({
  headers,
  onChange,
}: SettingsHeadersSectionProps): React.JSX.Element {
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const addHeader = useCallback(() => {
    const trimmedKey = keyInput.trim();
    if (!trimmedKey) return;
    onChange({ ...headers, [trimmedKey]: valueInput.trim() });
    setKeyInput("");
    setValueInput("");
  }, [headers, keyInput, valueInput, onChange]);

  const removeHeader = useCallback(
    (key: string) => {
      const next = { ...headers };
      delete next[key];
      onChange(next);
    },
    [headers, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") addHeader();
    },
    [addHeader]
  );

  const entries = Object.entries(headers);

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-2">
        Request Headers
      </label>

      {/* Existing headers */}
      {entries.length > 0 && (
        <div className="mb-2 space-y-1">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center gap-1.5 bg-gray-50 rounded px-2 py-1 text-xs group"
            >
              <span className="font-mono font-medium text-gray-700 flex-1 min-w-0 truncate">
                {k}
              </span>
              <span className="text-gray-400 flex-shrink-0">:</span>
              <span className="font-mono text-gray-500 flex-1 min-w-0 truncate">
                {v}
              </span>
              <button
                type="button"
                onClick={() => removeHeader(k)}
                className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${k} header`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new header row */}
      <div className="flex gap-1">
        <input
          type="text"
          value={keyInput}
          placeholder="Key"
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 px-2 py-1 text-xs font-mono border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
        />
        <input
          type="text"
          value={valueInput}
          placeholder="Value"
          onChange={(e) => setValueInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 px-2 py-1 text-xs font-mono border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
        />
        <button
          type="button"
          onClick={addHeader}
          disabled={!keyInput.trim()}
          className="flex-shrink-0 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-40 transition-colors flex items-center"
          aria-label="Add header"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
});

SettingsHeadersSection.displayName = "SettingsHeadersSection";
