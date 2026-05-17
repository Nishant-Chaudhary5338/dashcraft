import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartComponentProps } from "../recharts.types";

// ============================================================
// RadarChartWidget Component
// ============================================================

export const RadarChartWidget = React.memo(function RadarChartWidget({
  data,
  series,
  xAxisKey,
  showLegend,
  showTooltip,
  animate,
}: ChartComponentProps): React.JSX.Element {
  // ==========================================================
  // Render
  // ==========================================================

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={[...data]} cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 12, fill: "#6b7280" }}
        />
        <PolarRadiusAxis
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
        />
        {series.map((s) => (
          <Radar
            key={s.dataKey}
            name={s.name}
            dataKey={s.dataKey}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.3}
            isAnimationActive={animate}
          />
        ))}
        {showTooltip && <Tooltip />}
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
      </RadarChart>
    </ResponsiveContainer>
  );
});

RadarChartWidget.displayName = "RadarChartWidget";