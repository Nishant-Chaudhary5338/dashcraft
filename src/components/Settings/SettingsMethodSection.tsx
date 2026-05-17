import React, { useCallback } from "react";

// ============================================================
// Props
// ============================================================

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface SettingsMethodSectionProps {
  method: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

// ============================================================
// Constants
// ============================================================

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET:    "text-green-700  bg-green-50  border-green-200  data-[active]:bg-green-600  data-[active]:border-green-600  data-[active]:text-white",
  POST:   "text-blue-700   bg-blue-50   border-blue-200   data-[active]:bg-blue-600   data-[active]:border-blue-600   data-[active]:text-white",
  PUT:    "text-yellow-700 bg-yellow-50 border-yellow-200 data-[active]:bg-yellow-500 data-[active]:border-yellow-500 data-[active]:text-white",
  PATCH:  "text-orange-700 bg-orange-50 border-orange-200 data-[active]:bg-orange-500 data-[active]:border-orange-500 data-[active]:text-white",
  DELETE: "text-red-700    bg-red-50    border-red-200    data-[active]:bg-red-600    data-[active]:border-red-600    data-[active]:text-white",
};

// ============================================================
// Component
// ============================================================

export const SettingsMethodSection = React.memo(function SettingsMethodSection({
  method,
  onChange,
}: SettingsMethodSectionProps): React.JSX.Element {
  const handleClick = useCallback(
    (m: HttpMethod) => () => onChange(m),
    [onChange]
  );

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-2">
        HTTP Method
      </label>
      <div className="flex gap-1.5 flex-wrap">
        {METHODS.map((m) => (
          <button
            key={m}
            type="button"
            data-active={method === m ? "" : undefined}
            onClick={handleClick(m)}
            className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${METHOD_COLORS[m]}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
});

SettingsMethodSection.displayName = "SettingsMethodSection";
