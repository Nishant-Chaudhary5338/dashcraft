import React from "react";
import { DashboardCard } from "../../components/DashboardCard";
import type { HierarchyWidgetProps, HierarchyChartType } from "./hierarchy.types";
import { HeatMapWidget } from "./charts/HeatMapWidget";
import { TreemapWidget } from "./charts/TreemapWidget";
import { SunburstWidget } from "./charts/SunburstWidget";

// ============================================================
// Chart Component Map
// ============================================================

const chartComponents: Record<HierarchyChartType, React.ComponentType<import("./hierarchy.types").HierarchyChartComponentProps>> = {
  heatmap: HeatMapWidget,
  treemap: TreemapWidget,
  sunburst: SunburstWidget,
};

// ============================================================
// HierarchyWidget Component — treemap, sunburst, heatmap
// ============================================================

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
