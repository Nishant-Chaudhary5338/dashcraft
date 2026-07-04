/**
 * Deterministic sample data for the playground's live widgets. Kept out of the
 * render path so the widget catalog stays readable. Every widget added to the
 * canvas is a real, data-bound dashcraft-core widget — not a mockup.
 */

export const CHART_DATA: Record<string, unknown>[] = [
  { label: "Jan", v: 42, w: 30 },
  { label: "Feb", v: 38, w: 44 },
  { label: "Mar", v: 61, w: 51 },
  { label: "Apr", v: 55, w: 40 },
  { label: "May", v: 78, w: 62 },
  { label: "Jun", v: 69, w: 58 },
  { label: "Jul", v: 85, w: 71 },
];

export const SERIES = [
  { dataKey: "v", name: "Revenue", color: "#C2FF3D" },
  { dataKey: "w", name: "Target", color: "#FF6A2C" },
];

export const PIE_DATA: Record<string, unknown>[] = [
  { label: "Direct", v: 40 },
  { label: "Social", v: 28 },
  { label: "Email", v: 18 },
  { label: "Other", v: 14 },
];

export const SCATTER_DATA: Record<string, unknown>[] = Array.from({ length: 12 }, (_, i) => ({
  label: `p${i}`,
  v: Math.round(20 + i * 6 + Math.sin(i) * 10),
  w: Math.round(30 + i * 4 + Math.cos(i) * 12),
}));

export const HEATMAP_DATA = [
  { id: "Mon", data: [{ x: "W1", y: 12 }, { x: "W2", y: 28 }, { x: "W3", y: 44 }, { x: "W4", y: 19 }] },
  { id: "Tue", data: [{ x: "W1", y: 34 }, { x: "W2", y: 22 }, { x: "W3", y: 51 }, { x: "W4", y: 40 }] },
  { id: "Wed", data: [{ x: "W1", y: 18 }, { x: "W2", y: 47 }, { x: "W3", y: 33 }, { x: "W4", y: 61 }] },
] as const;

export const TREEMAP_DATA = [
  {
    id: "root",
    value: 0,
    children: [
      { id: "Search", value: 42 },
      { id: "Social", value: 28 },
      { id: "Direct", value: 18 },
      { id: "Referral", value: 12 },
    ],
  },
] as const;

export const SUNBURST_DATA = [
  {
    id: "Traffic",
    value: 0,
    children: [
      { id: "Organic", value: 40, color: "#C2FF3D" },
      { id: "Paid", value: 25, color: "#FF6A2C" },
      { id: "Social", value: 20, color: "#8FCC00" },
      { id: "Email", value: 15, color: "#FFB08A" },
    ],
  },
] as const;

export const KPI_SAMPLE: Record<string, { value: number; previousValue: number }> = {
  number: { value: 2847, previousValue: 2540 },
  currency: { value: 84200, previousValue: 79800 },
  percentage: { value: 67, previousValue: 63 },
};
