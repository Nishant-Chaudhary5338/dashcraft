import { KPIWidget } from "dashcraft-core/widgets/kpi";
import { RechartsWidget } from "dashcraft-core/widgets/recharts";
import { HierarchyWidget } from "dashcraft-core/widgets/hierarchy";
import type { KPIFormat } from "dashcraft-core/widgets/kpi";
import type { RechartsWidgetProps } from "dashcraft-core/widgets/recharts";
import type { WidgetConfig } from "@/lib/codegen";
import {
  CHART_DATA, SERIES, PIE_DATA, SCATTER_DATA,
  HEATMAP_DATA, TREEMAP_DATA, SUNBURST_DATA, KPI_SAMPLE,
} from "./sampleData";

export type PlaygroundType = WidgetConfig["type"];

/** A widget on the playground canvas — one real dashcraft-core widget. */
export interface PlaygroundWidget {
  id: string;
  type: PlaygroundType;
  title: string;
  drag: boolean;
  resize: boolean;
  settings: boolean;
  delete: boolean;
  format: KPIFormat;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
}

interface PaletteEntry {
  type: PlaygroundType;
  label: string;
  icon: string;
  size: { width: number; height: number };
}

export const PALETTE: readonly PaletteEntry[] = [
  { type: "kpi", label: "KPI Card", icon: "◈", size: { width: 280, height: 130 } },
  { type: "bar_chart", label: "Bar Chart", icon: "▐", size: { width: 420, height: 300 } },
  { type: "line_chart", label: "Line Chart", icon: "⌇", size: { width: 420, height: 300 } },
  { type: "area_chart", label: "Area Chart", icon: "△", size: { width: 420, height: 300 } },
  { type: "pie_chart", label: "Pie Chart", icon: "◔", size: { width: 340, height: 300 } },
  { type: "scatter_chart", label: "Scatter Chart", icon: "⁘", size: { width: 420, height: 300 } },
  { type: "radar_chart", label: "Radar Chart", icon: "✳", size: { width: 360, height: 300 } },
  { type: "heatmap", label: "Heatmap", icon: "▦", size: { width: 440, height: 300 } },
  { type: "treemap", label: "Treemap", icon: "⊞", size: { width: 440, height: 300 } },
  { type: "sunburst", label: "Sunburst", icon: "✺", size: { width: 360, height: 320 } },
] as const;

const RECHARTS = new Set<PlaygroundType>(["bar_chart", "line_chart", "area_chart", "pie_chart", "scatter_chart", "radar_chart"]);
const HIERARCHY = new Set<PlaygroundType>(["heatmap", "treemap", "sunburst"]);

/** Build a new widget, stacking it just below the current content. */
export function makeWidget(type: PlaygroundType, id: string, y: number): PlaygroundWidget {
  const entry = PALETTE.find((p) => p.type === type)!;
  return {
    id,
    type,
    title: entry.label,
    drag: true,
    resize: true,
    settings: false,
    delete: true,
    format: "number",
    defaultPosition: { x: 0, y },
    defaultSize: entry.size,
  };
}

function rechartsData(type: PlaygroundType): {
  data: RechartsWidgetProps["data"];
  series: RechartsWidgetProps["series"];
} {
  if (type === "pie_chart") {
    return { data: PIE_DATA as RechartsWidgetProps["data"], series: [SERIES[0]] as unknown as RechartsWidgetProps["series"] };
  }
  if (type === "scatter_chart") {
    return { data: SCATTER_DATA as RechartsWidgetProps["data"], series: SERIES as unknown as RechartsWidgetProps["series"] };
  }
  return { data: CHART_DATA as RechartsWidgetProps["data"], series: SERIES as unknown as RechartsWidgetProps["series"] };
}

const HIERARCHY_DATA = {
  heatmap: HEATMAP_DATA,
  treemap: TREEMAP_DATA,
  sunburst: SUNBURST_DATA,
} as const;

/**
 * Render one playground widget as the real dashcraft-core component. The
 * widgets extend DashboardCardProps and render their own DashboardCard, so
 * drag/resize/delete flags go directly on them (no extra wrapper).
 */
export function renderWidget(w: PlaygroundWidget, onDelete: (id: string) => void): React.ReactElement {
  const common = {
    id: w.id,
    drag: w.drag,
    resize: w.resize,
    settings: w.settings,
    delete: w.delete,
    defaultPosition: w.defaultPosition,
    defaultSize: w.defaultSize,
    onDelete: () => onDelete(w.id),
  } as const;

  if (w.type === "kpi") {
    const s = KPI_SAMPLE[w.format] ?? KPI_SAMPLE.number;
    return <KPIWidget {...common} label={w.title} value={s.value} previousValue={s.previousValue} format={w.format} />;
  }
  if (RECHARTS.has(w.type)) {
    const { data, series } = rechartsData(w.type);
    const chartType = w.type.replace("_chart", "") as RechartsWidgetProps["chartType"];
    return <RechartsWidget {...common} title={w.title} chartType={chartType} data={data} series={series} xAxisKey="label" />;
  }
  if (HIERARCHY.has(w.type)) {
    const chartType = w.type as "heatmap" | "treemap" | "sunburst";
    const data = HIERARCHY_DATA[chartType] as unknown as import("dashcraft-core/widgets/hierarchy").HierarchyWidgetProps["data"];
    return <HierarchyWidget {...common} title={w.title} chartType={chartType} data={data} />;
  }
  return <KPIWidget {...common} label={w.title} value={0} previousValue={0} format="number" />;
}

/** Map playground widgets (+ any live drag/resize overrides) to codegen input. */
export function toCodegen(
  widgets: PlaygroundWidget[],
  live: Record<string, { position?: { x: number; y: number }; size?: { width: number; height: number } }>,
): WidgetConfig[] {
  return widgets.map((w) => ({
    id: w.id,
    type: w.type,
    title: w.title,
    defaultPosition: live[w.id]?.position ?? w.defaultPosition,
    defaultSize: live[w.id]?.size ?? w.defaultSize,
    drag: w.drag,
    resize: w.resize,
    settings: w.settings,
    delete: w.delete,
    // codegen's format union excludes "text" — fold it to "number".
    config: { format: w.format === "text" ? "number" : w.format },
  }));
}
