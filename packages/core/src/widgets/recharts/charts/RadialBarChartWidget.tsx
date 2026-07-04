import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartComponentProps } from "../recharts.types";

// ============================================================
// RadialBarChartWidget Component
// ============================================================

/**
 * Renders a recharts `<RadialBarChart>` (semicircle gauge layout, 180°→0°) —
 * one `<RadialBar>` per series with an inline value label. `xAxisKey` and
 * `showGrid` are not applicable and ignored. Used internally by
 * {@link RechartsWidget} when `chartType="radialBar"`.
 *
 * @param props - {@link ChartComponentProps} (`xAxisKey`/`showGrid` accepted but unused).
 * @returns A `ResponsiveContainer`-wrapped recharts radial bar chart.
 *
 * @example
 * ```tsx
 * import { RechartsWidget } from "@dashcraft/core";
 *
 * <RechartsWidget
 *   chartType="radialBar"
 *   id="completion"
 *   title="Completion"
 *   data={[{ name: "Progress", value: 72 }]}
 *   series={[{ dataKey: "value", color: "#f59e0b" }]}
 * />
 * ```
 *
 * @see {@link RechartsWidget}
 */
export const RadialBarChartWidget = React.memo(function RadialBarChartWidget({
  data,
  series,
  xAxisKey: _xAxisKey,
  showLegend,
  showTooltip,
  animate,
}: ChartComponentProps): React.JSX.Element {
  // ==========================================================
  // Render
  // ==========================================================

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        data={[...data]}
        cx="50%"
        cy="50%"
        innerRadius="20%"
        outerRadius="90%"
        startAngle={180}
        endAngle={0}
      >
        {series.map((s) => (
          <RadialBar
            key={s.dataKey}
            name={s.name}
            dataKey={s.dataKey}
            fill={s.color}
            background={{ fill: "#f3f4f6" }}
            isAnimationActive={animate}
            label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}
          />
        ))}
        {showTooltip && <Tooltip />}
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        )}
      </RadialBarChart>
    </ResponsiveContainer>
  );
});

RadialBarChartWidget.displayName = "RadialBarChartWidget";