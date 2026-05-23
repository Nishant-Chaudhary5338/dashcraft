/**
 * Showcase preset configurations for the dashcraft demo.
 *
 * Each preset defines:
 * - `widgets` — array of DashboardCard props + widget data for rendering
 * - `label` / `description` — UI display text
 *
 * Pixel positions are calculated for a 1160px-wide canvas with 16px gutters.
 * Grid equivalents (colStart/colSpan) are included for code generation.
 *
 * @example
 * import { PRESETS } from "./presets"
 * const { widgets } = PRESETS.analytics
 */

export type ChartType = "area" | "bar" | "line" | "pie";

export interface ShowcaseKPI {
  kind: "kpi";
  id: string;
  title: string;
  value: number;
  previousValue: number;
  format: "currency" | "percentage" | "number";
  suffix?: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  /** CSS grid equiv for code export */
  grid: { colStart: number; colSpan: number; rowStart: number; rowSpan: number };
}

export interface ShowcaseChart {
  kind: "chart";
  id: string;
  title: string;
  chartType: ChartType;
  data: Record<string, unknown>[];
  series: { dataKey: string; name: string; color: string }[];
  xAxisKey: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  grid: { colStart: number; colSpan: number; rowStart: number; rowSpan: number };
}

export type ShowcaseWidget = ShowcaseKPI | ShowcaseChart;

export interface Preset {
  label: string;
  description: string;
  accent: string;
  widgets: ShowcaseWidget[];
}

/* ─────────────────────────────────────────────────────────────
   Analytics preset
───────────────────────────────────────────────────────────── */

const analyticsWidgets: ShowcaseWidget[] = [
  { kind: "kpi", id: "an-sessions", title: "Total Sessions", value: 284621, previousValue: 253847, format: "number",
    defaultPosition: { x: 0, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "an-users", title: "Unique Users", value: 127452, previousValue: 117224, format: "number",
    defaultPosition: { x: 293, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "an-bounce", title: "Bounce Rate", value: 34.2, previousValue: 36.3, format: "percentage",
    defaultPosition: { x: 586, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 7, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "an-duration", title: "Avg. Session", value: 227, previousValue: 218, format: "number", suffix: "s",
    defaultPosition: { x: 879, y: 0 }, defaultSize: { width: 281, height: 116 },
    grid: { colStart: 10, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "chart", id: "an-trend", title: "Sessions Trend", chartType: "area",
    data: [
      { d: "May 1", v: 8240 }, { d: "May 3", v: 9180 }, { d: "May 5", v: 7820 }, { d: "May 7", v: 9640 },
      { d: "May 9", v: 10250 }, { d: "May 11", v: 8970 }, { d: "May 13", v: 11380 }, { d: "May 15", v: 10190 },
      { d: "May 17", v: 9650 }, { d: "May 19", v: 12840 }, { d: "May 21", v: 11760 }, { d: "May 23", v: 14220 },
    ],
    series: [{ dataKey: "v", name: "Sessions", color: "#6366f1" }], xAxisKey: "d",
    defaultPosition: { x: 0, y: 132 }, defaultSize: { width: 762, height: 296 },
    grid: { colStart: 1, colSpan: 8, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "an-sources", title: "Traffic Sources", chartType: "pie",
    data: [
      { name: "Organic", value: 42 }, { name: "Direct", value: 28 },
      { name: "Social", value: 18 }, { name: "Referral", value: 12 },
    ],
    series: [{ dataKey: "value", name: "Share", color: "#6366f1" }], xAxisKey: "name",
    defaultPosition: { x: 778, y: 132 }, defaultSize: { width: 382, height: 296 },
    grid: { colStart: 9, colSpan: 4, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "an-devices", title: "Device Breakdown", chartType: "bar",
    data: [{ device: "Desktop", pct: 58 }, { device: "Mobile", pct: 34 }, { device: "Tablet", pct: 8 }],
    series: [{ dataKey: "pct", name: "Share %", color: "#22c55e" }], xAxisKey: "device",
    defaultPosition: { x: 0, y: 444 }, defaultSize: { width: 572, height: 240 },
    grid: { colStart: 1, colSpan: 6, rowStart: 8, rowSpan: 4 } },
  { kind: "chart", id: "an-dau", title: "Daily Active Users", chartType: "line",
    data: [
      { d: "W1", v: 38200 }, { d: "W2", v: 41800 }, { d: "W3", v: 39600 }, { d: "W4", v: 44200 },
      { d: "W5", v: 47100 }, { d: "W6", v: 43900 }, { d: "W7", v: 51300 }, { d: "W8", v: 56400 },
    ],
    series: [{ dataKey: "v", name: "DAU", color: "#f59e0b" }], xAxisKey: "d",
    defaultPosition: { x: 588, y: 444 }, defaultSize: { width: 572, height: 240 },
    grid: { colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 4 } },
];

/* ─────────────────────────────────────────────────────────────
   E-commerce preset
───────────────────────────────────────────────────────────── */

const ecommerceWidgets: ShowcaseWidget[] = [
  { kind: "kpi", id: "ec-gmv", title: "Gross Revenue", value: 1284521, previousValue: 1041200, format: "currency",
    defaultPosition: { x: 0, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "ec-orders", title: "Orders", value: 8432, previousValue: 7320, format: "number",
    defaultPosition: { x: 293, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "ec-aov", title: "Avg. Order Value", value: 152.37, previousValue: 142.21, format: "currency",
    defaultPosition: { x: 586, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 7, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "ec-return", title: "Return Rate", value: 2.3, previousValue: 2.7, format: "percentage",
    defaultPosition: { x: 879, y: 0 }, defaultSize: { width: 281, height: 116 },
    grid: { colStart: 10, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "chart", id: "ec-revenue", title: "Revenue Trend", chartType: "line",
    data: [
      { m: "Nov", rev: 820000, target: 900000 }, { m: "Dec", rev: 1140000, target: 1100000 },
      { m: "Jan", rev: 780000, target: 800000 }, { m: "Feb", rev: 890000, target: 860000 },
      { m: "Mar", rev: 1020000, target: 980000 }, { m: "Apr", rev: 1180000, target: 1100000 },
      { m: "May", rev: 1284521, target: 1200000 },
    ],
    series: [{ dataKey: "rev", name: "Revenue", color: "#6366f1" }, { dataKey: "target", name: "Target", color: "#334155" }],
    xAxisKey: "m",
    defaultPosition: { x: 0, y: 132 }, defaultSize: { width: 762, height: 296 },
    grid: { colStart: 1, colSpan: 8, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "ec-category", title: "Orders by Category", chartType: "pie",
    data: [
      { name: "Electronics", value: 34 }, { name: "Apparel", value: 27 },
      { name: "Home", value: 19 }, { name: "Beauty", value: 20 },
    ],
    series: [{ dataKey: "value", name: "Orders", color: "#6366f1" }], xAxisKey: "name",
    defaultPosition: { x: 778, y: 132 }, defaultSize: { width: 382, height: 296 },
    grid: { colStart: 9, colSpan: 4, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "ec-products", title: "Top Products", chartType: "bar",
    data: [
      { p: "Pro Max", sales: 2840 }, { p: "Ultrabook", sales: 2210 }, { p: "Headphones", sales: 1880 },
      { p: "Sneakers", sales: 1560 }, { p: "Skincare", sales: 1320 },
    ],
    series: [{ dataKey: "sales", name: "Units", color: "#06b6d4" }], xAxisKey: "p",
    defaultPosition: { x: 0, y: 444 }, defaultSize: { width: 572, height: 240 },
    grid: { colStart: 1, colSpan: 6, rowStart: 8, rowSpan: 4 } },
  { kind: "chart", id: "ec-channel", title: "Revenue by Channel", chartType: "bar",
    data: [
      { ch: "Direct", rev: 487000 }, { ch: "Search", rev: 384000 }, { ch: "Social", rev: 218000 },
      { ch: "Email", rev: 195000 },
    ],
    series: [{ dataKey: "rev", name: "Revenue", color: "#f59e0b" }], xAxisKey: "ch",
    defaultPosition: { x: 588, y: 444 }, defaultSize: { width: 572, height: 240 },
    grid: { colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 4 } },
];

/* ─────────────────────────────────────────────────────────────
   SaaS Metrics preset
───────────────────────────────────────────────────────────── */

const saasWidgets: ShowcaseWidget[] = [
  { kind: "kpi", id: "ss-mrr", title: "Monthly MRR", value: 84250, previousValue: 80090, format: "currency",
    defaultPosition: { x: 0, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "ss-churn", title: "Churn Rate", value: 2.1, previousValue: 2.4, format: "percentage",
    defaultPosition: { x: 293, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "ss-nps", title: "NPS Score", value: 67, previousValue: 63, format: "number",
    defaultPosition: { x: 586, y: 0 }, defaultSize: { width: 277, height: 116 },
    grid: { colStart: 7, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "ss-dau", title: "DAU / MAU", value: 42.3, previousValue: 40.5, format: "percentage",
    defaultPosition: { x: 879, y: 0 }, defaultSize: { width: 281, height: 116 },
    grid: { colStart: 10, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "chart", id: "ss-mrr-chart", title: "MRR Growth", chartType: "area",
    data: [
      { m: "Nov", mrr: 64200 }, { m: "Dec", mrr: 68400 }, { m: "Jan", mrr: 70100 },
      { m: "Feb", mrr: 73600 }, { m: "Mar", mrr: 77800 }, { m: "Apr", mrr: 80090 }, { m: "May", mrr: 84250 },
    ],
    series: [{ dataKey: "mrr", name: "MRR", color: "#6366f1" }], xAxisKey: "m",
    defaultPosition: { x: 0, y: 132 }, defaultSize: { width: 762, height: 296 },
    grid: { colStart: 1, colSpan: 8, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "ss-plans", title: "Users by Plan", chartType: "pie",
    data: [
      { name: "Enterprise", value: 14 }, { name: "Pro", value: 38 },
      { name: "Starter", value: 48 },
    ],
    series: [{ dataKey: "value", name: "Users", color: "#6366f1" }], xAxisKey: "name",
    defaultPosition: { x: 778, y: 132 }, defaultSize: { width: 382, height: 296 },
    grid: { colStart: 9, colSpan: 4, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "ss-features", title: "Feature Adoption", chartType: "bar",
    data: [
      { f: "Analytics", pct: 84 }, { f: "API Access", pct: 71 }, { f: "Integrations", pct: 63 },
      { f: "Exports", pct: 58 }, { f: "Custom Dash", pct: 41 },
    ],
    series: [{ dataKey: "pct", name: "Adoption %", color: "#22c55e" }], xAxisKey: "f",
    defaultPosition: { x: 0, y: 444 }, defaultSize: { width: 572, height: 240 },
    grid: { colStart: 1, colSpan: 6, rowStart: 8, rowSpan: 4 } },
  { kind: "chart", id: "ss-retention", title: "Weekly Retention", chartType: "line",
    data: [
      { w: "W1", r: 100 }, { w: "W2", r: 82 }, { w: "W3", r: 74 }, { w: "W4", r: 68 },
      { w: "W5", r: 63 }, { w: "W6", r: 60 }, { w: "W7", r: 57 }, { w: "W8", r: 55 },
    ],
    series: [{ dataKey: "r", name: "Retention %", color: "#f59e0b" }], xAxisKey: "w",
    defaultPosition: { x: 588, y: 444 }, defaultSize: { width: 572, height: 240 },
    grid: { colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 4 } },
];

export const PRESETS: Record<string, Preset> = {
  analytics: {
    label: "Analytics", description: "Web analytics: sessions, users, bounce rate, device breakdown",
    accent: "#6366f1", widgets: analyticsWidgets,
  },
  ecommerce: {
    label: "E-commerce", description: "Store metrics: revenue, orders, AOV, top products, channels",
    accent: "#06b6d4", widgets: ecommerceWidgets,
  },
  saas: {
    label: "SaaS Metrics", description: "Product metrics: MRR, churn, NPS, feature adoption, retention",
    accent: "#22c55e", widgets: saasWidgets,
  },
};

export type PresetKey = keyof typeof PRESETS;
