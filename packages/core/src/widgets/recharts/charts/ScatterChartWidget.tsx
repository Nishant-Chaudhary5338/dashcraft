import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartComponentProps } from "../recharts.types";

// ============================================================
// ScatterChartWidget Component
// ============================================================

/**
 * Renders a recharts `<ScatterChart>` — one `<Scatter>` series per entry in
 * `series`. For each series, every row's `x` is `Number(data[xAxisKey])`, `y`
 * is `Number(data[series.dataKey])`, and the bubble size (`z`) reuses the
 * same `y` value (there is no separate size field in {@link DataPoint} —
 * bubble size therefore tracks the plotted metric itself, not an independent
 * third dimension). Used internally by {@link RechartsWidget} when `chartType="scatter"`.
 *
 * @param props - {@link ChartComponentProps}.
 * @returns A `ResponsiveContainer`-wrapped recharts scatter chart.
 *
 * @example
 * ```tsx
 * import { RechartsWidget } from "@dashcraft/core";
 *
 * <RechartsWidget
 *   chartType="scatter"
 *   id="correlation"
 *   title="Price vs Demand"
 *   xAxisKey="price"
 *   data={[{ price: 10, demand: 90 }, { price: 20, demand: 60 }]}
 *   series={[{ dataKey: "demand", color: "#22c55e" }]}
 * />
 * ```
 *
 * @see {@link RechartsWidget}
 */
export const ScatterChartWidget = React.memo(function ScatterChartWidget({
  data,
  series,
  xAxisKey,
  showLegend,
  showTooltip,
  showGrid,
  animate,
}: ChartComponentProps): React.JSX.Element {
  // ==========================================================
  // Render
  // ==========================================================

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        )}
        <XAxis
          dataKey="x"
          name={xAxisKey}
          tick={{ fontSize: 12 }}
          stroke="#9ca3af"
        />
        <YAxis
          dataKey="y"
          name="Value"
          tick={{ fontSize: 12 }}
          stroke="#9ca3af"
        />
        <ZAxis
          dataKey="z"
          range={[50, 400]}
          name="Size"
        />
        {showTooltip && <Tooltip cursor={{ strokeDasharray: "3 3" }} />}
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Scatter
            key={s.dataKey}
            name={s.name}
            data={data.map((d) => ({
              x: Number(d[xAxisKey]) ?? 0,
              y: Number(d[s.dataKey]) ?? 0,
              z: Number(d[s.dataKey]) ?? 100,
            }))}
            fill={s.color}
            isAnimationActive={animate}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
});

ScatterChartWidget.displayName = "ScatterChartWidget";