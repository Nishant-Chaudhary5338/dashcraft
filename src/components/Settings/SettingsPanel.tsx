import React, { useState, useCallback, useMemo, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import type { WidgetSettings, WidgetTheme, CustomFieldConfig } from "../../types";
import { useDashboardContext } from "../Dashboard/Dashboard.context";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsThemeSection } from "./SettingsThemeSection";
import { SettingsHighlightSection } from "./SettingsHighlightSection";
import { SettingsEndpointSection } from "./SettingsEndpointSection";
import { SettingsMethodSection } from "./SettingsMethodSection";
import { SettingsPollingSection } from "./SettingsPollingSection";
import { SettingsBehaviorSection } from "./SettingsBehaviorSection";
import { SettingsCustomFields } from "./SettingsCustomFields";

// ============================================================
// Props
// ============================================================

export interface SettingsPanelProps {
  id: string;
  settings: WidgetSettings;
  /** Element that opens the popover (must be a DOM element or use forwardRef) */
  trigger: React.ReactNode;
  onSettingsChange?: (settings: WidgetSettings) => void;
}

// ============================================================
// Animation Variants
// ============================================================

const popoverVariants = {
  initial: { opacity: 0, scale: 0.95, y: -5 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    transition: { duration: 0.15 },
  },
};

// ============================================================
// Component
// ============================================================

export const SettingsPanel = React.memo(function SettingsPanel({
  id,
  settings,
  trigger,
  onSettingsChange,
}: SettingsPanelProps): React.JSX.Element {
  const { updateWidgetSettings } = useDashboardContext();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [localSettings, setLocalSettings] = useState<WidgetSettings>(settings);

  // Re-sync localSettings when the settings prop changes (e.g. persisted layout loads)
  // but only while the panel is closed so we don't overwrite in-progress user edits.
  useEffect(() => {
    if (!isOpen) {
      setLocalSettings(settings);
    }
  }, [settings, isOpen]);

  // ── Helpers ────────────────────────────────────────────────

  const applyChange = useCallback(
    (patch: Partial<WidgetSettings>) => {
      const next: WidgetSettings = { ...localSettings, ...patch };
      setLocalSettings(next);
      updateWidgetSettings(id, patch);
      onSettingsChange?.(next);
    },
    [id, localSettings, updateWidgetSettings, onSettingsChange]
  );

  // ── Handlers ───────────────────────────────────────────────

  const handleOpenChange = useCallback((open: boolean) => setIsOpen(open), []);

  const handleThemeChange = useCallback(
    (theme: WidgetTheme) => applyChange({ theme }),
    [applyChange]
  );

  const handleHighlightToggle = useCallback(
    (highlight: boolean) => applyChange({ highlight }),
    [applyChange]
  );

  const handleHighlightColorChange = useCallback(
    (highlightColor: string) => applyChange({ highlightColor }),
    [applyChange]
  );

  // Endpoint: update local state on change, flush to store on blur
  const handleEndpointChange = useCallback(
    (endpoint: string) =>
      setLocalSettings((prev) => ({ ...prev, endpoint })),
    []
  );

  const handleEndpointBlur = useCallback(() => {
    if (localSettings.endpoint !== undefined) {
      updateWidgetSettings(id, { endpoint: localSettings.endpoint });
    }
    onSettingsChange?.(localSettings);
  }, [id, localSettings, updateWidgetSettings, onSettingsChange]);

  const handleMethodChange = useCallback(
    (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE") =>
      applyChange({ method }),
    [applyChange]
  );

  const handlePollingChange = useCallback(
    (value: number[]) => {
      const pollingInterval = value[0];
      if (pollingInterval !== undefined) applyChange({ pollingInterval });
    },
    [applyChange]
  );

  const handleOpacityChange = useCallback(
    (opacity: number) => applyChange({ opacity }),
    [applyChange]
  );

  const handleRequestTimeoutChange = useCallback(
    (requestTimeout: number | undefined) =>
      applyChange({ requestTimeout } as Partial<WidgetSettings>),
    [applyChange]
  );

  const handleRefreshOnFocusChange = useCallback(
    (refreshOnFocus: boolean) => applyChange({ refreshOnFocus }),
    [applyChange]
  );

  const handleCacheEnabledChange = useCallback(
    (cacheEnabled: boolean) => applyChange({ cacheEnabled }),
    [applyChange]
  );

  const handleCacheDurationChange = useCallback(
    (cacheDuration: number | undefined) =>
      applyChange({ cacheDuration } as Partial<WidgetSettings>),
    [applyChange]
  );

  const handleDescriptionChange = useCallback(
    (description: string) => applyChange({ description }),
    [applyChange]
  );

  const handleCustomFieldChange = useCallback(
    (fieldKey: string, value: unknown) => {
      const existing = localSettings.customFields ?? {};
      const existingField = existing[fieldKey];
      const updatedField: CustomFieldConfig = existingField
        ? { ...existingField }
        : { type: "text", label: fieldKey };
      applyChange({
        customFields: { ...existing, [fieldKey]: updatedField },
        [fieldKey]: value,
      });
    },
    [applyChange, localSettings.customFields]
  );

  // ── Derived values ─────────────────────────────────────────

  const currentTheme = useMemo<WidgetTheme>(
    () => localSettings.theme ?? "light",
    [localSettings.theme]
  );

  const customFields = useMemo<Record<string, CustomFieldConfig>>(
    () => localSettings.customFields ?? {},
    [localSettings.customFields]
  );

  // ── Render ─────────────────────────────────────────────────

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        {/* No asChild — Popover.Content must be a real DOM boundary so Radix can
            correctly detect pointer-down-outside. Using asChild with a non-DOM
            wrapper (AnimatePresence) loses that boundary and every internal click
            is treated as "outside", instantly closing the panel. */}
        <Popover.Content
          side="bottom"
          sideOffset={4}
          align="start"
          collisionPadding={16}
          style={{ zIndex: 10000 }}
          className="outline-none"
        >
          <motion.div
            className="w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            initial="initial"
            animate="animate"
            variants={popoverVariants}
          >
            {/* Header — sits outside scroll container, always visible */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <SettingsHeader />
            </div>

            {/* Scrollable sections */}
            <div className="overflow-y-auto overscroll-contain max-h-110 px-4 py-3 space-y-0">
              <SettingsThemeSection
                currentTheme={currentTheme}
                onThemeChange={handleThemeChange}
              />
              <SettingsHighlightSection
                isEnabled={localSettings.highlight ?? false}
                color={localSettings.highlightColor ?? "#3b82f6"}
                onToggle={handleHighlightToggle}
                onColorChange={handleHighlightColorChange}
              />
              <SettingsEndpointSection
                endpoint={localSettings.endpoint ?? ""}
                onChange={handleEndpointChange}
                onBlur={handleEndpointBlur}
                endpointOptions={[]}
              />
              <SettingsMethodSection
                method={localSettings.method ?? "GET"}
                onChange={handleMethodChange}
              />
              <SettingsPollingSection
                pollingInterval={localSettings.pollingInterval ?? 0}
                onChange={handlePollingChange}
              />
              <SettingsBehaviorSection
                opacity={localSettings.opacity as number ?? 1}
                requestTimeout={localSettings.requestTimeout as number | undefined}
                refreshOnFocus={localSettings.refreshOnFocus as boolean ?? false}
                cacheEnabled={localSettings.cacheEnabled as boolean ?? false}
                cacheDuration={localSettings.cacheDuration as number | undefined}
                description={localSettings.description as string ?? ""}
                onOpacityChange={handleOpacityChange}
                onRequestTimeoutChange={handleRequestTimeoutChange}
                onRefreshOnFocusChange={handleRefreshOnFocusChange}
                onCacheEnabledChange={handleCacheEnabledChange}
                onCacheDurationChange={handleCacheDurationChange}
                onDescriptionChange={handleDescriptionChange}
              />
              <SettingsCustomFields
                fields={customFields}
                values={localSettings}
                onChange={handleCustomFieldChange}
              />
            </div>
          </motion.div>
          <Popover.Arrow className="fill-white drop-shadow-sm" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

SettingsPanel.displayName = "SettingsPanel";
