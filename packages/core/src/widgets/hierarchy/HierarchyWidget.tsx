import React from "react";
import { DashboardCard } from "../../components/DashboardCard";
import type { HierarchyWidgetProps, HierarchyChartType } from "./hierarchy.types";
import { HeatMapWidget } from "./charts/HeatMapWidget";
import { TreemapWidget } from "./charts/TreemapWidget";
import { SunburstWidget } from "./charts/SunburstWidget";

// ============================================================
// Chart Component Map
// ============================================================

/** Dispatch table from {@link HierarchyChartType} to its concrete chart component; selected by `HierarchyWidget` based on `chartType`. */
const chartComponents: Record<HierarchyChartType, React.ComponentType<import("./hierarchy.types").HierarchyChartComponentProps>> = {
  heatmap: HeatMapWidget,
  treemap: TreemapWidget,
  sunburst: SunburstWidget,
};

// ============================================================
// HierarchyWidget Component — treemap, sunburst, heatmap
// ============================================================

/**
 * Single entry point for hierarchical/matrix visualizations in
 * `@dashcraft/core`: heatmap (dependency-free CSS grid), treemap, and
 * sunburst (both recharts-backed). Wraps the chosen chart in a
 * {@link DashboardCard} — the card's `type` is derived automatically as
 * `hierarchy-${chartType}`. Renders a "No data available" placeholder when
 * `data` is empty instead of an empty chart canvas.
 *
 * The expected shape of `data` depends on `chartType` — see
 * {@link HierarchyWidgetProps.data} for the mapping.
 *
 * @returns A {@link DashboardCard} containing the selected hierarchy/matrix chart.
 *
 * @example
 * ```tsx
 * import { HierarchyWidget } from "@dashcraft/core";
 *
 * // Heatmap: rows of {x, y} cells
 * <HierarchyWidget
 *   id="activity-heatmap"
 *   title="Weekly Activity"
 *   chartType="heatmap"
 *   data={[
 *     { id: "Mon", data: [{ x: "9am", y: 12 }, { x: "5pm", y: 40 }] },
 *     { id: "Tue", data: [{ x: "9am", y: 8 },  { x: "5pm", y: 22 }] },
 *   ]}
 * />
 * ```
 *
 * @see {@link HeatMapWidget}, {@link TreemapWidget}, {@link SunburstWidget}
 */
export const HierarchyWidget = React.memo(function HierarchyWidget({
  chartType,
  data,
  colors,
  animate = true,
  showLabels = true,
  showTooltip = true,
  chartHeight = 300,
  margin,
  ...cardProps
}: HierarchyWidgetProps): React.JSX.Element {
  const ChartComponent = chartComponents[chartType];

  return (
    <DashboardCard
      {...cardProps}
      type={`hierarchy-${chartType}`}
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
            colors={colors}
            animate={animate}
            showLabels={showLabels}
            showTooltip={showTooltip}
            margin={margin}
          />
        )}
      </div>
    </DashboardCard>
  );
});

HierarchyWidget.displayName = "HierarchyWidget";
