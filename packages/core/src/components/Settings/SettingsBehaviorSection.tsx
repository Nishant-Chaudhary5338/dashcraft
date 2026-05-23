import React, { useState, useCallback, useEffect } from "react";
import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";

// ============================================================
// Props
// ============================================================

export interface SettingsBehaviorSectionProps {
  opacity: number;
  requestTimeout: number | undefined;
  refreshOnFocus: boolean;
  cacheEnabled: boolean;
  cacheDuration: number | undefined;
  description: string;
  onOpacityChange: (value: number) => void;
  onRequestTimeoutChange: (value: number | undefined) => void;
  onRefreshOnFocusChange: (checked: boolean) => void;
  onCacheEnabledChange: (checked: boolean) => void;
  onCacheDurationChange: (value: number | undefined) => void;
  onDescriptionChange: (value: string) => void;
}

// ============================================================
// Component
// ============================================================

export const SettingsBehaviorSection = React.memo(function SettingsBehaviorSection({
  opacity,
  requestTimeout,
  refreshOnFocus,
  cacheEnabled,
  cacheDuration,
  description,
  onOpacityChange,
  onRequestTimeoutChange,
  onRefreshOnFocusChange,
  onCacheEnabledChange,
  onCacheDurationChange,
  onDescriptionChange,
}: SettingsBehaviorSectionProps): React.JSX.Element {
  // Local draft for text/number inputs — flushed to store on blur
  const [timeoutDraft, setTimeoutDraft] = useState(
    requestTimeout !== undefined ? String(requestTimeout) : ""
  );
  const [cacheDurationDraft, setCacheDurationDraft] = useState(
    cacheDuration !== undefined ? String(cacheDuration) : ""
  );
  const [descriptionDraft, setDescriptionDraft] = useState(description);

  // Keep drafts in sync if the widget changes externally
  useEffect(() => {
    setTimeoutDraft(requestTimeout !== undefined ? String(requestTimeout) : "");
  }, [requestTimeout]);

  useEffect(() => {
    setCacheDurationDraft(cacheDuration !== undefined ? String(cacheDuration) : "");
  }, [cacheDuration]);

  useEffect(() => {
    setDescriptionDraft(description);
  }, [description]);

  const handleOpacityChange = useCallback(
    (vals: number[]) => {
      if (vals[0] !== undefined) onOpacityChange(vals[0]);
    },
    [onOpacityChange]
  );

  const handleTimeoutBlur = useCallback(() => {
    const v = parseInt(timeoutDraft);
    onRequestTimeoutChange(isNaN(v) || v <= 0 ? undefined : v);
  }, [timeoutDraft, onRequestTimeoutChange]);

  const handleCacheDurationBlur = useCallback(() => {
    const v = parseInt(cacheDurationDraft);
    onCacheDurationChange(isNaN(v) || v <= 0 ? undefined : v);
  }, [cacheDurationDraft, onCacheDurationChange]);

  const handleDescriptionBlur = useCallback(() => {
    onDescriptionChange(descriptionDraft);
  }, [descriptionDraft, onDescriptionChange]);

  const opacityPercent = Math.round(opacity * 100);

  return (
    <div>
      {/* Opacity */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Opacity</label>
          <span className="text-xs text-gray-500 tabular-nums">{opacityPercent}%</span>
        </div>
        <Slider.Root
          value={[opacity]}
          onValueChange={handleOpacityChange}
          min={0.1}
          max={1}
          step={0.05}
          className="relative flex items-center select-none touch-none w-full h-5"
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Slider.Root>
      </div>

      {/* Request timeout */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Request Timeout (ms)
        </label>
        <input
          type="number"
          value={timeoutDraft}
          placeholder="e.g. 5000"
          min={0}
          step={500}
          onChange={(e) => setTimeoutDraft(e.target.value)}
          onBlur={handleTimeoutBlur}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
        />
      </div>

      {/* Refresh on focus */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <label className="text-xs font-medium text-gray-600">
            Refresh on Window Focus
          </label>
          <p className="text-xs text-gray-400 mt-0.5">Re-fetch when tab becomes active</p>
        </div>
        <Switch.Root
          checked={refreshOnFocus}
          onCheckedChange={onRefreshOnFocusChange}
          className="w-9 h-5 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors shrink-0"
        >
          <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-4" />
        </Switch.Root>
      </div>

      {/* Cache */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="text-xs font-medium text-gray-600">Cache Responses</label>
            <p className="text-xs text-gray-400 mt-0.5">Store API responses locally</p>
          </div>
          <Switch.Root
            checked={cacheEnabled}
            onCheckedChange={onCacheEnabledChange}
            className="w-9 h-5 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors shrink-0"
          >
            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-4" />
          </Switch.Root>
        </div>
        {cacheEnabled && (
          <input
            type="number"
            value={cacheDurationDraft}
            placeholder="TTL in ms (e.g. 60000)"
            min={1000}
            step={1000}
            onChange={(e) => setCacheDurationDraft(e.target.value)}
            onBlur={handleCacheDurationBlur}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
          />
        )}
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Widget Notes
        </label>
        <textarea
          value={descriptionDraft}
          placeholder="Add notes about this widget…"
          rows={2}
          onChange={(e) => setDescriptionDraft(e.target.value)}
          onBlur={handleDescriptionBlur}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 resize-none"
        />
      </div>
    </div>
  );
});

SettingsBehaviorSection.displayName = "SettingsBehaviorSection";
