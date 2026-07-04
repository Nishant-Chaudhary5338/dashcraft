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
 * A single cell within one row of a heatmap.
 */
export interface HeatmapDataPoint {
  /** Column key for this cell (rendered as the column header and matched against every row's cells). */
  readonly x: string;
  /** Numeric value for this cell — drives both the displayed label and the color intensity (scaled between the dataset's min/max). */
  readonly y: number;
}

/**
 * One row of a heatmap: a row label plus its cells across columns. Columns
 * are derived automatically from the union of every row's `data[].x` values,
 * in first-seen order — rows do not need to supply every column (missing
 * cells render as blank/transparent).
 */
export interface HeatmapRowData {
  /** Row label, shown in the left-hand header column. */
  readonly id: string;
  /** This row's cells. Does not need to cover every column present in other rows. */
  readonly data: readonly HeatmapDataPoint[];
}

/**
 * A single node in a treemap hierarchy. Leaf nodes (no `children`) size
 * themselves by `value`; parent nodes size themselves by the sum of their
 * descendants and only their **direct** children render an in-rect label.
 */
export interface TreemapDataNode {
  /** Node label, shown as the rectangle's name (only rendered for depth-1 rectangles large enough to fit text). */
  readonly id: string;
  /** Size driving the rectangle's proportional area. Ignored (but still required by the type) on nodes that have `children` — recharts derives parent sizing from descendants instead. */
  readonly value: number;
  /** Child nodes, if this is a branch rather than a leaf. */
  readonly children?: readonly TreemapDataNode[];
}

/**
 * A single node in a sunburst hierarchy (nested rings). Unlike
 * {@link TreemapDataNode}, parent node values here are explicitly summed from
 * children by the widget before rendering (recharts' Sunburst does not
 * auto-aggregate), so `value` on branch nodes is computed rather than read
 * from the data you pass in.
 */
export interface SunburstDataNode {
  /** Node label. */
  readonly id: string;
  /** Value for a leaf node (ignored/recomputed for branch nodes with `children`). */
  readonly value: number;
  /** Child nodes, if this is a branch rather than a leaf. */
  readonly children?: readonly SunburstDataNode[];
  /** Explicit fill color for this node/ring segment.
   * @default Cycled from the widget's palette by sibling index + depth. */
  readonly color?: string;
}

/**
 * Props for {@link HierarchyWidget}. Extends every base dashboard-card prop
 * (title, id, drag/resize handles, etc — see {@link DashboardCardProps})
 * except `children` and `type`, since the widget derives `type` itself
 * (`hierarchy-${chartType}`) and the chart is the card's content.
 */
export interface HierarchyWidgetProps extends Omit<DashboardCardProps, "children" | "type"> {
  /** Which hierarchy/matrix chart to render. */
  readonly chartType: HierarchyChartType;
  /** Data for the chart — shape depends on `chartType`: {@link HeatmapRowData}`[]` for `"heatmap"`, {@link TreemapDataNode}`[]` for `"treemap"`, {@link SunburstDataNode}`[]` for `"sunburst"`. An empty array renders a "No data available" placeholder. */
  readonly data: readonly HeatmapRowData[] | readonly TreemapDataNode[] | readonly SunburstDataNode[];
  /** Custom color palette, cycled across nodes/segments/heatmap intensity base color. Falls back to each chart's own built-in palette when omitted. */
  readonly colors?: readonly string[];
  /** Whether to animate chart entry/updates. Not read by every chart (e.g. the heatmap is a static CSS grid).
   * @default true */
  readonly animate?: boolean;
  /** Whether to show in-chart value labels (used by the heatmap's per-cell value text; treemap/sunburst labeling has its own internal rules).
   * @default true */
  readonly showLabels?: boolean;
  /** Whether to show the hover tooltip.
   * @default true */
  readonly showTooltip?: boolean;
  /** Height of the chart area, in pixels if a number, or any CSS length if a string.
   * @default 300 */
  readonly chartHeight?: number | string;
  /** Chart margin overrides (top/right/bottom/left), forwarded to the underlying chart component where applicable. */
  readonly margin?: { readonly top?: number; readonly right?: number; readonly bottom?: number; readonly left?: number };
}

/**
 * Props received by each concrete hierarchy chart component
 * ({@link HeatMapWidget}, {@link TreemapWidget}, {@link SunburstWidget}) after
 * {@link HierarchyWidget} has resolved defaults. Not constructed directly by
 * consumers — documented here because it's the shared contract each chart
 * below implements (though not every chart reads every field: see each
 * component's own docs for which props it actually uses).
 */
export interface HierarchyChartComponentProps {
  /** Data to render, shape depending on which concrete chart this is. */
  readonly data: readonly HeatmapRowData[] | readonly TreemapDataNode[] | readonly SunburstDataNode[];
  /** Resolved color palette, or `undefined` if the caller didn't supply one (each chart falls back to its own default palette). */
  readonly colors: readonly string[] | undefined;
  /** Resolved animation flag. */
  readonly animate: boolean;
  /** Resolved label-visibility flag. */
  readonly showLabels: boolean;
  /** Resolved tooltip-visibility flag. */
  readonly showTooltip: boolean;
  /** Resolved margin override, or `undefined` if not supplied. */
  readonly margin: { readonly top?: number; readonly right?: number; readonly bottom?: number; readonly left?: number } | undefined;
}
