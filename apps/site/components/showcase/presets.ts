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

/* ── Marketing preset ── */
const marketingWidgets: ShowcaseWidget[] = [
  { kind: "kpi", id: "mk-leads", title: "Leads", value: 12840, previousValue: 10420, format: "number",
    defaultPosition: { x: 0, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "mk-cac", title: "CAC", value: 38.2, previousValue: 44.1, format: "currency",
    defaultPosition: { x: 293, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "mk-conv", title: "Conversion", value: 4.6, previousValue: 3.9, format: "percentage",
    defaultPosition: { x: 586, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 7, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "mk-roas", title: "ROAS", value: 3.8, previousValue: 3.2, format: "number",
    defaultPosition: { x: 879, y: 0 }, defaultSize: { width: 281, height: 116 }, grid: { colStart: 10, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "chart", id: "mk-leadtrend", title: "Lead Volume", chartType: "area",
    data: [{ m: "Jan", v: 6200 }, { m: "Feb", v: 7400 }, { m: "Mar", v: 8100 }, { m: "Apr", v: 9800 }, { m: "May", v: 11200 }, { m: "Jun", v: 12840 }],
    series: [{ dataKey: "v", name: "Leads", color: "#6366f1" }], xAxisKey: "m",
    defaultPosition: { x: 0, y: 132 }, defaultSize: { width: 762, height: 296 }, grid: { colStart: 1, colSpan: 8, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "mk-channels", title: "Channel Mix", chartType: "pie",
    data: [{ name: "Paid Search", value: 38 }, { name: "Social", value: 27 }, { name: "Email", value: 20 }, { name: "Organic", value: 15 }],
    series: [{ dataKey: "value", name: "Share", color: "#6366f1" }], xAxisKey: "name",
    defaultPosition: { x: 778, y: 132 }, defaultSize: { width: 382, height: 296 }, grid: { colStart: 9, colSpan: 4, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "mk-spend", title: "Spend by Campaign", chartType: "bar",
    data: [{ c: "Brand", s: 42 }, { c: "Retarget", s: 31 }, { c: "Prospect", s: 26 }, { c: "Affiliate", s: 18 }],
    series: [{ dataKey: "s", name: "Spend $k", color: "#f59e0b" }], xAxisKey: "c",
    defaultPosition: { x: 0, y: 444 }, defaultSize: { width: 572, height: 240 }, grid: { colStart: 1, colSpan: 6, rowStart: 8, rowSpan: 4 } },
  { kind: "chart", id: "mk-convtrend", title: "Conversion Rate", chartType: "line",
    data: [{ w: "W1", r: 3.2 }, { w: "W2", r: 3.6 }, { w: "W3", r: 3.9 }, { w: "W4", r: 4.1 }, { w: "W5", r: 4.4 }, { w: "W6", r: 4.6 }],
    series: [{ dataKey: "r", name: "CVR %", color: "#22c55e" }], xAxisKey: "w",
    defaultPosition: { x: 588, y: 444 }, defaultSize: { width: 572, height: 240 }, grid: { colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 4 } },
];

/* ── Finance preset ── */
const financeWidgets: ShowcaseWidget[] = [
  { kind: "kpi", id: "fn-rev", title: "Revenue", value: 2480000, previousValue: 2120000, format: "currency",
    defaultPosition: { x: 0, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "fn-burn", title: "Monthly Burn", value: 312000, previousValue: 338000, format: "currency",
    defaultPosition: { x: 293, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "fn-runway", title: "Runway (mo)", value: 22, previousValue: 19, format: "number",
    defaultPosition: { x: 586, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 7, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "fn-margin", title: "Gross Margin", value: 71.4, previousValue: 68.2, format: "percentage",
    defaultPosition: { x: 879, y: 0 }, defaultSize: { width: 281, height: 116 }, grid: { colStart: 10, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "chart", id: "fn-cash", title: "Cash Balance", chartType: "area",
    data: [{ m: "Jan", v: 4.2 }, { m: "Feb", v: 4.0 }, { m: "Mar", v: 4.4 }, { m: "Apr", v: 4.9 }, { m: "May", v: 5.3 }, { m: "Jun", v: 6.1 }],
    series: [{ dataKey: "v", name: "Cash $M", color: "#6366f1" }], xAxisKey: "m",
    defaultPosition: { x: 0, y: 132 }, defaultSize: { width: 762, height: 296 }, grid: { colStart: 1, colSpan: 8, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "fn-expense", title: "Expenses", chartType: "pie",
    data: [{ name: "Payroll", value: 52 }, { name: "Infra", value: 18 }, { name: "Marketing", value: 16 }, { name: "Ops", value: 14 }],
    series: [{ dataKey: "value", name: "Share", color: "#6366f1" }], xAxisKey: "name",
    defaultPosition: { x: 778, y: 132 }, defaultSize: { width: 382, height: 296 }, grid: { colStart: 9, colSpan: 4, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "fn-byproduct", title: "Revenue by Product", chartType: "bar",
    data: [{ p: "Core", r: 1240 }, { p: "Pro", r: 720 }, { p: "Enterprise", r: 420 }, { p: "Add-ons", r: 100 }],
    series: [{ dataKey: "r", name: "Rev $k", color: "#06b6d4" }], xAxisKey: "p",
    defaultPosition: { x: 0, y: 444 }, defaultSize: { width: 572, height: 240 }, grid: { colStart: 1, colSpan: 6, rowStart: 8, rowSpan: 4 } },
  { kind: "chart", id: "fn-profit", title: "Net Profit", chartType: "line",
    data: [{ m: "Jan", p: -40 }, { m: "Feb", p: -20 }, { m: "Mar", p: 10 }, { m: "Apr", p: 60 }, { m: "May", p: 110 }, { m: "Jun", p: 180 }],
    series: [{ dataKey: "p", name: "Profit $k", color: "#f59e0b" }], xAxisKey: "m",
    defaultPosition: { x: 588, y: 444 }, defaultSize: { width: 572, height: 240 }, grid: { colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 4 } },
];

/* ── Support / Ops preset ── */
const supportWidgets: ShowcaseWidget[] = [
  { kind: "kpi", id: "sp-open", title: "Open Tickets", value: 342, previousValue: 418, format: "number",
    defaultPosition: { x: 0, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "sp-csat", title: "CSAT", value: 94.2, previousValue: 91.5, format: "percentage",
    defaultPosition: { x: 293, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "sp-resolve", title: "Avg Resolution (h)", value: 6.4, previousValue: 8.1, format: "number",
    defaultPosition: { x: 586, y: 0 }, defaultSize: { width: 277, height: 116 }, grid: { colStart: 7, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "kpi", id: "sp-sla", title: "SLA Met", value: 97.8, previousValue: 95.2, format: "percentage",
    defaultPosition: { x: 879, y: 0 }, defaultSize: { width: 281, height: 116 }, grid: { colStart: 10, colSpan: 3, rowStart: 1, rowSpan: 2 } },
  { kind: "chart", id: "sp-volume", title: "Ticket Volume", chartType: "area",
    data: [{ d: "Mon", v: 210 }, { d: "Tue", v: 264 }, { d: "Wed", v: 248 }, { d: "Thu", v: 288 }, { d: "Fri", v: 312 }, { d: "Sat", v: 180 }, { d: "Sun", v: 142 }],
    series: [{ dataKey: "v", name: "Tickets", color: "#6366f1" }], xAxisKey: "d",
    defaultPosition: { x: 0, y: 132 }, defaultSize: { width: 762, height: 296 }, grid: { colStart: 1, colSpan: 8, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "sp-category", title: "By Category", chartType: "pie",
    data: [{ name: "Billing", value: 34 }, { name: "Technical", value: 41 }, { name: "Account", value: 15 }, { name: "Other", value: 10 }],
    series: [{ dataKey: "value", name: "Share", color: "#6366f1" }], xAxisKey: "name",
    defaultPosition: { x: 778, y: 132 }, defaultSize: { width: 382, height: 296 }, grid: { colStart: 9, colSpan: 4, rowStart: 3, rowSpan: 5 } },
  { kind: "chart", id: "sp-priority", title: "By Priority", chartType: "bar",
    data: [{ p: "Urgent", n: 42 }, { p: "High", n: 96 }, { p: "Medium", n: 138 }, { p: "Low", n: 66 }],
    series: [{ dataKey: "n", name: "Tickets", color: "#f59e0b" }], xAxisKey: "p",
    defaultPosition: { x: 0, y: 444 }, defaultSize: { width: 572, height: 240 }, grid: { colStart: 1, colSpan: 6, rowStart: 8, rowSpan: 4 } },
  { kind: "chart", id: "sp-restime", title: "Resolution Time", chartType: "line",
    data: [{ w: "W1", h: 9.2 }, { w: "W2", h: 8.6 }, { w: "W3", h: 7.9 }, { w: "W4", h: 7.1 }, { w: "W5", h: 6.7 }, { w: "W6", h: 6.4 }],
    series: [{ dataKey: "h", name: "Hours", color: "#22c55e" }], xAxisKey: "w",
    defaultPosition: { x: 588, y: 444 }, defaultSize: { width: 572, height: 240 }, grid: { colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 4 } },
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
  marketing: {
    label: "Marketing", description: "Growth metrics: leads, CAC, conversion, ROAS, channel mix",
    accent: "#a855f7", widgets: marketingWidgets,
  },
  finance: {
    label: "Finance", description: "Financials: revenue, burn, runway, margin, cash & profit",
    accent: "#eab308", widgets: financeWidgets,
  },
  support: {
    label: "Support / Ops", description: "Service metrics: tickets, CSAT, resolution time, SLA, priority",
    accent: "#ef4444", widgets: supportWidgets,
  },
};

export type PresetKey = keyof typeof PRESETS;
