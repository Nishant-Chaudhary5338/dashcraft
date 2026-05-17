import React, { useMemo } from "react";
import { DashboardCard } from "../../components/DashboardCard";
import type { RechartsWidgetProps, ChartType } from "./recharts.types";
import { BarChartWidget } from "./charts/BarChartWidget";
import { LineChartWidget } from "./charts/LineChartWidget";
import { AreaChartWidget } from "./charts/AreaChartWidget";
import { PieChartWidget } from "./charts/PieChartWidget";
import { ScatterChartWidget } from "./charts/ScatterChartWidget";
import { RadarChartWidget } from "./charts/RadarChartWidget";
import { RadialBarChartWidget } from "./charts/RadialBarChartWidget";

// ============================================================
// Default Colors
// ============================================================

const DEFAULT_COLORS: readonly string[] = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f97316", // orange
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f59e0b", // amber
];

// ============================================================
// Chart Component Map
// ============================================================

const chartComponents: Record<ChartType, React.ComponentType<import("./recharts.types").ChartComponentProps>> = {
  bar: BarChartWidget,
  line: LineChartWidget,
  area: AreaChartWidget,
  pie: PieChartWidget,
  scatter: ScatterChartWidget,
  radar: RadarChartWidget,
  radialBar: RadialBarChartWidget,
};

// ============================================================
// RechartsWidget Component
// ============================================================

export const RechartsWidget = React.memo(function RechartsWidget({
  chartType,
  data,
  series,
  xAxisKey = "name",
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  animate = true,
  customTooltip,
  chartHeight = 300,
  ...cardProps
}: RechartsWidgetProps): React.JSX.Element {
  // ==========================================================
  // Computed Values
  // ==========================================================

  const enrichedSeries = useMemo(() => {
    return series.map((s, index) => ({
      ...s,
      color: s.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      name: s.name ?? s.dataKey,
    }));
  }, [series]);

  const ChartComponent = chartComponents[chartType];

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <DashboardCard
      {...cardProps}
      type={`recharts-${chartType}`}
    >
      <div
        className="w-full min-h-[250px]"
        style={{ height: typeof chartHeight === 'number' ? `${chartHeight}px` : chartHeight }}
      >
        {data.length === 0 ? (
          <div className="text-gray-400 text-sm">No data available</div>
        ) : (
          <ChartComponent
            data={data}
            series={enrichedSeries}
            xAxisKey={xAxisKey}
            showLegend={showLegend}
            showTooltip={showTooltip}
            showGrid={showGrid}
            animate={animate}
            customTooltip={customTooltip}
          />
        )}
      </div>
    </DashboardCard>
  );
});

RechartsWidget.displayName = "RechartsWidget";