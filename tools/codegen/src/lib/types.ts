// ============================================================================
// SHARED TYPES for @dashcraft/mcp-codegen
// ============================================================================

export type WidgetType =
  | 'kpi'
  | 'bar_chart'
  | 'line_chart'
  | 'area_chart'
  | 'pie_chart'
  | 'scatter_chart'
  | 'radar_chart'
  | 'heatmap'
  | 'treemap'
  | 'sunburst'
  | 'table'
  | 'text';

export type DashcraftComponent = 'KPIWidget' | 'RechartsWidget' | 'NivoWidget';

export type KPIFormat = 'currency' | 'percent' | 'number';

export type RechartsChartType =
  | 'bar_chart'
  | 'line_chart'
  | 'area_chart'
  | 'pie_chart'
  | 'scatter_chart'
  | 'radar_chart';

export type NivoChartType = 'heatmap' | 'treemap' | 'sunburst';

export interface WidgetConfig {
  format?: KPIFormat;
  chartType?: RechartsChartType | NivoChartType;
  [key: string]: unknown;
}

export interface WidgetAnalysis {
  id: string;
  type: WidgetType;
  dashcraftComponent: DashcraftComponent;
  title: string;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
  config: WidgetConfig;
}

export interface DashboardAnalysis {
  widgets: WidgetAnalysis[];
  totalColumns: number;
  totalRows: number;
  suggestedLayout: string;
}

// MCP-compatible result shape
export interface ToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}
