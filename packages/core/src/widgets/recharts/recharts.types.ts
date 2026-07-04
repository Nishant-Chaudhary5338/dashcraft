// ============================================================
// Recharts Widget Types
// ============================================================

import type { ReactNode } from "react";
import type { DashboardCardProps } from "../../components/DashboardCard";

/**
 * Supported chart types for {@link RechartsWidgetProps.chartType}. Each value
 * maps 1:1 to one of the chart components exported alongside `RechartsWidget`
 * (e.g. `"bar"` → {@link BarChartWidget}, `"radialBar"` → {@link RadialBarChartWidget}).
 */
export type ChartType = "bar" | "line" | "area" | "pie" | "scatter" | "radar" | "radialBar";

/**
 * A single data row consumed by every recharts-backed widget. Keys not
 * explicitly listed (`name`, `value`) are free-form — they're read by
 * {@link SeriesConfig.dataKey} / {@link RechartsWidgetProps.xAxisKey} to plot
 * arbitrary fields, e.g. `{ name: "Jan", revenue: 4200, costs: 3100 }`.
 */
export interface DataPoint {
  /** Index signature: any additional field a series or the x-axis may reference by key. */
  readonly [key: string]: string | number | undefined;
  /** Conventional x-axis / category label (e.g. a month name). Not required — pass a custom {@link RechartsWidgetProps.xAxisKey} to use a different field. */
  readonly name?: string;
  /** Conventional single value field, used by charts (e.g. Pie) that plot one metric per row when no explicit `series[0].dataKey` is meaningful. */
  readonly value?: number;
}

/**
 * Configuration for a single plotted data series (one line, one set of bars, etc).
 */
export interface SeriesConfig {
  /** Key into each {@link DataPoint} whose value this series plots. */
  readonly dataKey: string;
  /** Display name shown in the legend/tooltip.
   * @default dataKey */
  readonly name?: string;
  /** Series color (any CSS color string, e.g. hex). Required — unlike the enriched internal type, callers must always supply a color. */
  readonly color: string;
  /** Stack ID: series sharing the same `stackId` are stacked together (bar/area charts). Omit for unstacked series. */
  readonly stackId?: string;
}

/**
 * Internal, fully-resolved series config passed down to the concrete chart
 * components once {@link RechartsWidget} has applied its default color
 * palette and `name` fallback. Not part of the public widget API surface —
 * consumers configure charts via {@link SeriesConfig}.
 */
export interface EnrichedSeriesConfig {
  /** Key into each {@link DataPoint} whose value this series plots. */
  readonly dataKey: string;
  /** Resolved display name (falls back to `dataKey` if the caller didn't supply one). */
  readonly name: string;
  /** Resolved color (falls back to the widget's default palette, cycled by series index). */
  readonly color: string;
  /** Stack ID for stacked charts, if any. */
  readonly stackId?: string;
}

/**
 * Props for {@link RechartsWidget}. Extends every base dashboard-card prop
 * (title, id, drag/resize handles, etc — see {@link DashboardCardProps})
 * except `children`, since the chart itself is the card's content.
 */
export interface RechartsWidgetProps extends Omit<DashboardCardProps, "children"> {
  /** Which recharts chart to render. */
  readonly chartType: ChartType;
  /** Rows to plot. An empty array renders a "No data available" placeholder instead of an empty chart. */
  readonly data: readonly DataPoint[];
  /** One entry per plotted series/metric. Determines which fields of `data` are drawn and how. */
  readonly series: readonly SeriesConfig[];
  /** Field of each {@link DataPoint} used for the x-axis / category axis (ignored by Pie and RadialBar charts).
   * @default "name" */
  readonly xAxisKey?: string;
  /** Whether to render the chart legend.
   * @default true */
  readonly showLegend?: boolean;
  /** Whether to render the hover tooltip.
   * @default true */
  readonly showTooltip?: boolean;
  /** Whether to render the cartesian background grid (ignored by Pie/Radar/RadialBar charts).
   * @default true */
  readonly showGrid?: boolean;
  /** Whether chart entry/update transitions are animated.
   * @default true */
  readonly animate?: boolean;
  /** Custom tooltip content, forwarded down to the underlying chart component via {@link ChartComponentProps.customTooltip}.
   * NOTE: as of this writing no concrete chart component (Bar/Line/Area/Pie/Scatter/Radar/RadialBar) actually renders it —
   * it is accepted and threaded through the props contract but has no visible effect yet. */
  readonly customTooltip?: ReactNode;
  /** Height of the chart area, in pixels if a number, or any CSS length if a string.
   * @default 300 */
  readonly chartHeight?: number | string;
}

/**
 * Props received by each concrete chart component (`BarChartWidget`,
 * `LineChartWidget`, etc) after {@link RechartsWidget} has resolved defaults
 * and enriched the series list. Not constructed directly by consumers —
 * documented here because it's the shared contract every chart widget below implements.
 */
export interface ChartComponentProps {
  /** Rows to plot, as passed to {@link RechartsWidget}. */
  readonly data: readonly DataPoint[];
  /** Fully-resolved series (colors and names defaulted). */
  readonly series: readonly EnrichedSeriesConfig[];
  /** Resolved x-axis field name (defaults already applied). */
  readonly xAxisKey: string;
  /** Resolved legend visibility. */
  readonly showLegend: boolean;
  /** Resolved tooltip visibility. */
  readonly showTooltip: boolean;
  /** Resolved grid visibility. */
  readonly showGrid: boolean;
  /** Resolved animation flag. */
  readonly animate: boolean;
  /** Custom tooltip content passed through from {@link RechartsWidgetProps.customTooltip}. */
  readonly customTooltip?: ReactNode;
}
