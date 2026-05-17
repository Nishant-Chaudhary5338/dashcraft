// ============================================================
// Recharts Widget Types
// ============================================================

import type { ReactNode } from "react";
import type { DashboardCardProps } from "../../components/DashboardCard";

/**
 * Supported chart types for RechartsWidget.
 */
export type ChartType = "bar" | "line" | "area" | "pie" | "scatter" | "radar" | "radialBar";

/**
 * Data point for charts.
 * Each key-value pair represents a data field.
 */
export interface DataPoint {
  readonly [key: string]: string | number | undefined;
  readonly name?: string;
  readonly value?: number;
}

/**
 * Configuration for a single data series.
 */
export interface SeriesConfig {
  /** Data key for this series */
  readonly dataKey: string;
  /** Display name for legend */
  readonly name?: string;
  /** Series color */
  readonly color: string;
  /** Stack ID for stacked charts */
  readonly stackId?: string;
}

/**
 * Internal enriched series config with required fields.
 */
export interface EnrichedSeriesConfig {
  readonly dataKey: string;
  readonly name: string;
  readonly color: string;
  readonly stackId?: string;
}

/**
 * Props for RechartsWidget component.
 */
export interface RechartsWidgetProps extends Omit<DashboardCardProps, "children"> {
  /** Chart type to render */
  readonly chartType: ChartType;
  /** Data array for the chart */
  readonly data: readonly DataPoint[];
  /** Series configurations */
  readonly series: readonly SeriesConfig[];
  /** X-axis data key */
  readonly xAxisKey?: string;
  /** Whether to show legend */
  readonly showLegend?: boolean;
  /** Whether to show tooltip */
  readonly showTooltip?: boolean;
  /** Whether to show grid */
  readonly showGrid?: boolean;
  /** Whether to animate */
  readonly animate?: boolean;
  /** Custom tooltip content */
  readonly customTooltip?: ReactNode;
  /** Height of the chart area (default: 300) */
  readonly chartHeight?: number | string;
}

/**
 * Props for individual chart components.
 */
export interface ChartComponentProps {
  /** Data array */
  readonly data: readonly DataPoint[];
  /** Series configurations */
  readonly series: readonly EnrichedSeriesConfig[];
  /** X-axis data key */
  readonly xAxisKey: string;
  /** Whether to show legend */
  readonly showLegend: boolean;
  /** Whether to show tooltip */
  readonly showTooltip: boolean;
  /** Whether to show grid */
  readonly showGrid: boolean;
  /** Whether to animate */
  readonly animate: boolean;
  /** Custom tooltip content */
  readonly customTooltip?: ReactNode;
}
