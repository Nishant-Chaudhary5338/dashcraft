"use client";
/**
 * ShowcaseDashboard — renders a single preset using the actual @dashcraft/core library.
 *
 * Architecture notes:
 * - KPIWidget and RechartsWidget both extend DashboardCardProps and render their own
 *   DashboardCard internally. Do NOT wrap them in an extra DashboardCard.
 * - Props for drag/resize/delete/defaultPosition/defaultSize go directly on the widget.
 * - `key={preset.label}` on the parent forces React to fully unmount+remount widgets
 *   when the preset changes, clearing the global Zustand store's registrations.
 *
 * @example
 * <ShowcaseDashboard preset={PRESETS.analytics} editMode={false} onDelete={(id) => {}} />
 */

import "@dashcraft/core/styles.css";
import { Dashboard } from "@dashcraft/core";
import { KPIWidget } from "@dashcraft/core/widgets/kpi";
import { RechartsWidget } from "@dashcraft/core/widgets/recharts";
import type { Preset, ShowcaseKPI, ShowcaseChart } from "./presets";

interface Props {
  preset: Preset;
  editMode: boolean;
  onDelete: (id: string) => void;
}

function KPICard({ w, editMode, onDelete }: { w: ShowcaseKPI; editMode: boolean; onDelete: () => void }) {
  return (
    <KPIWidget
      id={w.id}
      label={w.title}
      value={w.value}
      previousValue={w.previousValue}
      format={w.format}
      drag={editMode}
      resize={editMode}
      settings
      delete={editMode}
      defaultPosition={w.defaultPosition}
      defaultSize={w.defaultSize}
      onDelete={onDelete}
      className="showcase-widget"
    />
  );
}

function ChartCard({ w, editMode, onDelete }: { w: ShowcaseChart; editMode: boolean; onDelete: () => void }) {
  return (
    <RechartsWidget
      id={w.id}
      title={w.title}
      chartType={w.chartType as import("@dashcraft/core/widgets/recharts").RechartsWidgetProps["chartType"]}
      data={w.data as import("@dashcraft/core/widgets/recharts").RechartsWidgetProps["data"]}
      series={w.series as unknown as import("@dashcraft/core/widgets/recharts").RechartsWidgetProps["series"]}
      xAxisKey={w.xAxisKey}
      drag={editMode}
      resize={editMode}
      settings
      delete={editMode}
      defaultPosition={w.defaultPosition}
      defaultSize={w.defaultSize}
      onDelete={onDelete}
      className="showcase-widget"
    />
  );
}

export function ShowcaseDashboard({ preset, editMode, onDelete }: Props) {
  return (
    <div style={{ position: "relative", width: 1160, minHeight: 700, background: "var(--bg-surface)" }}>
      <Dashboard defaultEditMode={editMode} style={{ width: 1160 }}>
        {preset.widgets.map((w) =>
          w.kind === "kpi" ? (
            <KPICard key={w.id} w={w} editMode={editMode} onDelete={() => onDelete(w.id)} />
          ) : (
            <ChartCard key={w.id} w={w} editMode={editMode} onDelete={() => onDelete(w.id)} />
          )
        )}
      </Dashboard>
    </div>
  );
}
