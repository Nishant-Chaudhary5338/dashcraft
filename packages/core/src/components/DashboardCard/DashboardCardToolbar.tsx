import React from "react";
import { Settings, Trash2, GripHorizontal, ChevronRight, Scaling } from "lucide-react";
import type { WidgetState, WidgetSettings } from "../../types";
import type { ViewBreakpoints } from "../../types";
import { SettingsPanel } from "../Settings/SettingsPanel";

// ============================================================
// DashboardCardToolbar
// The card's edit-mode toolbar (settings · view-cycler · drag · delete)
// and the "always" view-mode settings gear. Extracted from DashboardCard
// to isolate the heavy-rendering concern. Chrome colors are driven by
// `--dc-toolbar-*` CSS variables (see styles.css) so any theme can restyle
// them; light-mode fallbacks keep the default look unchanged.
// ============================================================

export interface DashboardCardToolbarProps {
  isEditMode: boolean;
  id: string;
  widgetState?: WidgetState | undefined;
  showSettings: boolean;
  settingsVisibility: "edit-mode" | "always";
  customSettingsPanel?: React.ReactNode | undefined;
  onSettingsChange?: ((settings: WidgetSettings) => void) | undefined;
  draggable: boolean;
  deletable: boolean;
  onDelete: (e: React.MouseEvent) => void;
  dragAttributes?: Record<string, unknown> | undefined;
  dragListeners?: Record<string, unknown> | undefined;
  showViewCycler: boolean;
  viewBreakpoints?: ViewBreakpoints | undefined;
  viewCyclerIndex: number | null;
  setViewCyclerIndex: (index: number) => void;
  viewCyclerKeys: (number | "initial")[];
  viewCyclerLabel: string;
  /** Show a button that snaps the widget through its preset viewSizes */
  canCycleSize?: boolean;
  onCycleSize?: () => void;
}

// Radix's Popover.Trigger (asChild) clones this element and injects onClick/ref,
// so the trigger MUST be a DOM element (or ref-forwarding). A plain wrapper
// component that ignores injected props breaks the popover — keep it a <button>.
const SettingsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function SettingsTrigger({ className, title, ...rest }, ref) {
    return (
      <button ref={ref} type="button" className={className} title={title} aria-label={title as string} {...rest}>
        <Settings size={12} />
      </button>
    );
  }
);

export const DashboardCardToolbar = React.memo(function DashboardCardToolbar(props: DashboardCardToolbarProps) {
  const {
    isEditMode, id, widgetState, showSettings, settingsVisibility,
    customSettingsPanel, onSettingsChange, draggable, deletable, onDelete,
    dragAttributes, dragListeners, showViewCycler, viewBreakpoints,
    viewCyclerIndex, setViewCyclerIndex, viewCyclerKeys, viewCyclerLabel,
    canCycleSize, onCycleSize,
  } = props;

  const settingsExtra = {
    ...(customSettingsPanel !== undefined && { customContent: customSettingsPanel }),
    ...(onSettingsChange !== undefined && { onSettingsChange }),
  };

  // ── Edit-mode toolbar ──
  if (isEditMode) {
    return (
      <div className="dc-toolbar absolute inset-x-0 top-0 h-7 z-10 flex items-stretch rounded-t-lg overflow-hidden">
        {showSettings && widgetState && (
          <SettingsPanel
            id={id}
            settings={widgetState.settings}
            {...settingsExtra}
            trigger={<SettingsTrigger className="dc-toolbar-btn dc-toolbar-sep-r w-7 shrink-0 flex items-center justify-center transition-colors cursor-pointer" title="Widget settings" />}
          />
        )}

        {canCycleSize && onCycleSize && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onCycleSize(); }}
            className="dc-toolbar-btn dc-toolbar-sep-r w-7 shrink-0 flex items-center justify-center transition-colors cursor-pointer"
            title="Cycle view size (or double-click the widget)"
            aria-label="Cycle view size"
          >
            <Scaling size={12} />
          </button>
        )}

        {showViewCycler && viewBreakpoints && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const nextIdx = ((viewCyclerIndex ?? 0) + 1) % viewCyclerKeys.length;
              setViewCyclerIndex(nextIdx);
            }}
            className="dc-toolbar-accent dc-toolbar-sep-r w-8 shrink-0 flex items-center justify-center gap-0.5 text-[10px] font-bold tracking-wide transition-colors cursor-pointer"
            title={`Cycle view (${viewCyclerLabel})`}
            aria-label="Cycle view"
          >
            {viewCyclerLabel}
            <ChevronRight size={9} />
          </button>
        )}

        {draggable ? (
          <button
            type="button"
            className="dc-toolbar-btn flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors select-none"
            aria-label="Drag to move"
            {...(dragAttributes ?? {})}
            {...(dragListeners ?? {})}
          >
            <GripHorizontal size={13} />
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {deletable && (
          <button
            type="button"
            onClick={onDelete}
            className="dc-toolbar-del dc-toolbar-sep-l w-7 shrink-0 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete widget"
            aria-label="Delete widget"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    );
  }

  // ── View-mode "always" settings gear ──
  if (showSettings && settingsVisibility === "always" && widgetState) {
    return (
      <SettingsPanel
        id={id}
        settings={widgetState.settings}
        {...settingsExtra}
        trigger={<SettingsTrigger className="dc-view-gear widget-action-btn absolute top-1 left-1 flex items-center justify-center w-6 h-6 rounded shadow-sm transition-all duration-150 cursor-pointer pointer-events-auto z-10" title="Widget settings" />}
      />
    );
  }

  return null;
});
