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

/** Fallback palette applied (cycled by series index) to any {@link SeriesConfig} that omits `color`. */
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

/** Dispatch table from {@link ChartType} to its concrete chart component; selected by `RechartsWidget` based on `chartType`. */
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

/**
 * Single entry point for every recharts-backed chart type in `@dashcraft/core`
 * (bar, line, area, pie, scatter, radar, radialBar). Wraps the chosen chart
 * in a {@link DashboardCard} and picks the concrete chart component based on
 * `chartType`, so widget authors add one component to their dashboard rather
 * than importing a different one per chart type.
 *
 * Series without an explicit {@link SeriesConfig.color}/`name` are enriched
 * with a default color (cycled from a built-in 8-color palette by series
 * index) and a `name` fallback to `dataKey`. Renders a "No data available"
 * placeholder when `data` is empty instead of an empty chart canvas.
 *
 * @returns A {@link DashboardCard} containing the selected recharts chart.
 *
 * @example
 * ```tsx
 * import { RechartsWidget } from "@dashcraft/core";
 *
 * <RechartsWidget
 *   id="revenue-trend"
 *   title="Revenue Trend"
 *   chartType="line"
 *   data={[
 *     { name: "Jan", revenue: 4200, costs: 3100 },
 *     { name: "Feb", revenue: 4800, costs: 3300 },
 *   ]}
 *   series={[
 *     { dataKey: "revenue", name: "Revenue", color: "#3b82f6" },
 *     { dataKey: "costs", name: "Costs", color: "#ef4444" },
 *   ]}
 * />
 * ```
 *
 * @see {@link BarChartWidget}, {@link LineChartWidget}, {@link AreaChartWidget}, {@link PieChartWidget}, {@link ScatterChartWidget}, {@link RadarChartWidget}, {@link RadialBarChartWidget}
 */
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