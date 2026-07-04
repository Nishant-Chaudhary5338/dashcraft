import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartComponentProps } from "../recharts.types";

// ============================================================
// BarChartWidget Component
// ============================================================

/**
 * Renders a recharts `<BarChart>` from a resolved {@link ChartComponentProps}
 * contract — one `<Bar>` per series, stacked when series share a `stackId`.
 * Used internally by {@link RechartsWidget} when `chartType="bar"`; rarely
 * imported directly since it expects already-enriched series (colors/names
 * resolved) rather than the raw {@link SeriesConfig} array.
 *
 * @param props - {@link ChartComponentProps}. `customTooltip` is accepted but currently unused (not yet wired to recharts' `<Tooltip content>`).
 * @returns A `ResponsiveContainer`-wrapped recharts bar chart.
 *
 * @example
 * ```tsx
 * import { RechartsWidget } from "@dashcraft/core";
 *
 * // Prefer going through RechartsWidget so series get default colors/names:
 * <RechartsWidget chartType="bar" id="sales" title="Sales" data={data} series={series} />
 * ```
 *
 * @see {@link RechartsWidget}
 */
export const BarChartWidget = React.memo(function BarChartWidget({
  data,
  series,
  xAxisKey,
  showLegend,
  showTooltip,
  showGrid,
  animate,
  customTooltip: _customTooltip,
}: ChartComponentProps): React.JSX.Element {
  // ==========================================================
  // Render
  // ==========================================================

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[...data]} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        )}
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          stroke="#9ca3af"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#9ca3af"
        />
        {showTooltip && (
          <Tooltip />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
        )}
        {series.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            fill={s.color}
            {...(s.stackId !== undefined && { stackId: s.stackId })}
            isAnimationActive={animate}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
});

BarChartWidget.displayName = "BarChartWidget";