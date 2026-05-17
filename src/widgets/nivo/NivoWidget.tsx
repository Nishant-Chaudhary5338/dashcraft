import React from "react";
import { DashboardCard } from "../../components/DashboardCard";
import type { NivoWidgetProps, NivoChartType } from "./nivo.types";
import { HeatMapWidget } from "./charts/HeatMapWidget";
import { TreemapWidget } from "./charts/TreemapWidget";
import { SunburstWidget } from "./charts/SunburstWidget";

// ============================================================
// Chart Component Map
// ============================================================

const chartComponents: Record<NivoChartType, React.ComponentType<import("./nivo.types").NivoChartComponentProps>> = {
  heatmap: HeatMapWidget,
  treemap: TreemapWidget,
  sunburst: SunburstWidget,
};

// ============================================================
// NivoWidget Component
// ============================================================

export const NivoWidget = React.memo(function NivoWidget({
  chartType,
  data,
  colorScheme = "nivo",
  colors,
  animate = true,
  showLabels = true,
  showTooltip = true,
  chartHeight = 300,
  margin,
  ...cardProps
}: NivoWidgetProps): React.JSX.Element {
  // ==========================================================
  // Computed Values
  // ==========================================================

  const ChartComponent = chartComponents[chartType];

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <DashboardCard
      {...cardProps}
      type={`nivo-${chartType}`}
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
            colorScheme={colorScheme}
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

NivoWidget.displayName = "NivoWidget";