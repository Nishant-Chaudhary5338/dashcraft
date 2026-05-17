// ============================================================
// Nivo Widget Types
// ============================================================

import type { DashboardCardProps } from "../../components/DashboardCard";

/**
 * Supported nivo chart types.
 */
export type NivoChartType = "heatmap" | "treemap" | "sunburst";

/**
 * Heatmap data point.
 */
export interface HeatmapDataPoint {
  readonly x: string;
  readonly y: number;
}

/**
 * Heatmap row data.
 */
export interface HeatmapRowData {
  readonly id: string;
  readonly data: readonly HeatmapDataPoint[];
}

/**
 * Treemap data node.
 */
export interface TreemapDataNode {
  readonly id: string;
  readonly value: number;
  readonly children?: readonly TreemapDataNode[];
}

/**
 * Sunburst data node.
 */
export interface SunburstDataNode {
  readonly id: string;
  readonly value: number;
  readonly children?: readonly SunburstDataNode[];
  readonly color?: string;
}

/**
 * Nivo color scheme options.
 */
export type NivoColorScheme =
  | "nivo"
  | "category10"
  | "accent"
  | "dark2"
  | "paired"
  | "pastel1"
  | "pastel2"
  | "set1"
  | "set2"
  | "set3"
  | "brown_blueGreen"
  | "purpleRed_green"
  | "pink_yellowGreen"
  | "purple_orange"
  | "red_blue"
  | "red_grey"
  | "red_yellow_blue"
  | "red_yellow_green"
  | "spectral";

/**
 * Props for NivoWidget component.
 */
export interface NivoWidgetProps extends Omit<DashboardCardProps, "children" | "type"> {
  /** Chart type to render */
  readonly chartType: NivoChartType;
  /** Data for the chart */
  readonly data: readonly HeatmapRowData[] | readonly TreemapDataNode[] | readonly SunburstDataNode[];
  /** Color scheme */
  readonly colorScheme?: NivoColorScheme;
  /** Custom colors array */
  readonly colors?: readonly string[];
  /** Whether to animate */
  readonly animate?: boolean;
  /** Whether to show labels */
  readonly showLabels?: boolean;
  /** Whether to show tooltip */
  readonly showTooltip?: boolean;
  /** Height of the chart area (default: 300) */
  readonly chartHeight?: number | string;
  /** Margin configuration */
  readonly margin?: { readonly top?: number; readonly right?: number; readonly bottom?: number; readonly left?: number };
}

/**
 * Props for individual nivo chart components.
 */
export interface NivoChartComponentProps {
  readonly data: readonly HeatmapRowData[] | readonly TreemapDataNode[] | readonly SunburstDataNode[];
  readonly colorScheme: NivoColorScheme;
  readonly colors: readonly string[] | undefined;
  readonly animate: boolean;
  readonly showLabels: boolean;
  readonly showTooltip: boolean;
  readonly margin: { readonly top?: number; readonly right?: number; readonly bottom?: number; readonly left?: number } | undefined;
}
