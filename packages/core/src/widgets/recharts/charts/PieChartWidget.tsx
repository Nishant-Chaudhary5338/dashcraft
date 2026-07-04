import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartComponentProps } from "../recharts.types";

// ============================================================
// PieChartWidget Component
// ============================================================

/**
 * Renders a recharts donut-style `<PieChart>` (52%–78% radius ring). Unlike
 * the other chart widgets, a pie chart plots exactly one metric per row, so
 * only `series[0].dataKey` is used as the value field (falls back to
 * `"value"` if `series` is empty); each `DataPoint`'s `name` field is used as
 * the slice label via `nameKey="name"`. `xAxisKey` and `showGrid` are not
 * applicable and ignored. Slice colors cycle through `series[index % series.length].color`.
 * Used internally by {@link RechartsWidget} when `chartType="pie"`.
 *
 * @param props - {@link ChartComponentProps} (`xAxisKey`/`showGrid` accepted but unused).
 * @returns A `ResponsiveContainer`-wrapped recharts pie/donut chart.
 *
 * @example
 * ```tsx
 * import { RechartsWidget } from "@dashcraft/core";
 *
 * <RechartsWidget
 *   chartType="pie"
 *   id="share"
 *   title="Market Share"
 *   data={[{ name: "Product A", value: 40 }, { name: "Product B", value: 60 }]}
 *   series={[{ dataKey: "value", color: "#3b82f6" }]}
 * />
 * ```
 *
 * @see {@link RechartsWidget}
 */
export const PieChartWidget = React.memo(function PieChartWidget({
  data,
  series,
  showLegend,
  showTooltip,
  animate,
}: ChartComponentProps): React.JSX.Element {
  // ==========================================================
  // For pie charts, we use the first series dataKey as the value
  // and "name" as the label
  // ==========================================================

  const valueKey = series[0]?.dataKey ?? "value";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {showTooltip && <Tooltip formatter={(value, name) => [value, name]} />}
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
        )}
        <Pie
          data={[...data]}
          cx="50%"
          cy="50%"
          innerRadius="52%"
          outerRadius="78%"
          labelLine={false}
          dataKey={valueKey}
          nameKey="name"
          isAnimationActive={animate}
          paddingAngle={3}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={series[index % series.length]?.color ?? "#8884d8"}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
});

PieChartWidget.displayName = "PieChartWidget";