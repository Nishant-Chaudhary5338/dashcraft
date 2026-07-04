// ============================================================
// Widgets — Barrel Export
// ============================================================

// Recharts Widgets
export { RechartsWidget } from "./recharts/RechartsWidget";
export type { RechartsWidgetProps, ChartType, DataPoint, SeriesConfig } from "./recharts/recharts.types";
export { BarChartWidget } from "./recharts/charts/BarChartWidget";
export { LineChartWidget } from "./recharts/charts/LineChartWidget";
export { AreaChartWidget } from "./recharts/charts/AreaChartWidget";
export { PieChartWidget } from "./recharts/charts/PieChartWidget";
export { ScatterChartWidget } from "./recharts/charts/ScatterChartWidget";
export { RadarChartWidget } from "./recharts/charts/RadarChartWidget";
export { RadialBarChartWidget } from "./recharts/charts/RadialBarChartWidget";

// Hierarchy Widgets (treemap, sunburst, heatmap)
export { HierarchyWidget } from "./hierarchy/HierarchyWidget";
export type { HierarchyWidgetProps, HierarchyChartType, HeatmapRowData, TreemapDataNode, SunburstDataNode } from "./hierarchy/hierarchy.types";
export { HeatMapWidget } from "./hierarchy/charts/HeatMapWidget";
export { TreemapWidget } from "./hierarchy/charts/TreemapWidget";
export { SunburstWidget } from "./hierarchy/charts/SunburstWidget";

// KPI Widgets
export { KPIWidget } from "./kpi/KPIWidget";
export type { KPIWidgetProps, KPITrend, KPIFormat } from "./kpi/KPIWidget";