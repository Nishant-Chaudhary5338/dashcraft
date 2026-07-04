import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartComponentProps } from "../recharts.types";

// ============================================================
// AreaChartWidget Component
// ============================================================

/**
 * Renders a recharts `<AreaChart>` — one monotone `<Area>` per series, filled
 * at 30% opacity of the series color. Used internally by {@link RechartsWidget}
 * when `chartType="area"`.
 *
 * @param props - {@link ChartComponentProps}.
 * @returns A `ResponsiveContainer`-wrapped recharts area chart.
 *
 * @example
 * ```tsx
 * import { RechartsWidget } from "@dashcraft/core";
 *
 * <RechartsWidget chartType="area" id="traffic" title="Traffic" data={data} series={series} />
 * ```
 *
 * @see {@link RechartsWidget}
 */
export const AreaChartWidget = React.memo(function AreaChartWidget({
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
      <AreaChart data={[...data]} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
        {showTooltip && <Tooltip />}
        {showLegend && (
          <Legend wrapperStyle={{ fontSize: 12 }} />
        )}
        {series.map((s) => (
          <Area
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.3}
            strokeWidth={2}
            isAnimationActive={animate}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
});

AreaChartWidget.displayName = "AreaChartWidget";