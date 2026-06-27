// ============================================================
// Hierarchy Widget Types — treemap, sunburst, heatmap
// ============================================================

import type { DashboardCardProps } from "../../components/DashboardCard";

/**
 * Supported hierarchy/matrix chart types.
 * (treemap + sunburst render via recharts; heatmap via a built-in CSS-grid widget.)
 */
export type HierarchyChartType = "heatmap" | "treemap" | "sunburst";

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
 * Props for HierarchyWidget component.
 */
export interface HierarchyWidgetProps extends Omit<DashboardCardProps, "children" | "type"> {
  /** Chart type to render */
  readonly chartType: HierarchyChartType;
  /** Data for the chart */
  readonly data: readonly HeatmapRowData[] | readonly TreemapDataNode[] | readonly SunburstDataNode[];
  /** Custom colors array (used as the chart palette) */
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
 * Props for individual hierarchy chart components.
 */
export interface HierarchyChartComponentProps {
  readonly data: readonly HeatmapRowData[] | readonly TreemapDataNode[] | readonly SunburstDataNode[];
  readonly colors: readonly string[] | undefined;
  readonly animate: boolean;
  readonly showLabels: boolean;
  readonly showTooltip: boolean;
  readonly margin: { readonly top?: number; readonly right?: number; readonly bottom?: number; readonly left?: number } | undefined;
}
