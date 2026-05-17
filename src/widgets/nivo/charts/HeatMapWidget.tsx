import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import type { HeatMapSerie } from "@nivo/heatmap";
import type { HeatmapRowData, HeatmapDataPoint, NivoChartComponentProps } from "../nivo.types";

// ============================================================
// HeatMapWidget Component
// ============================================================

export const HeatMapWidget = React.memo(function HeatMapWidget({
  data,
  colorScheme,
  animate,
  showLabels,
  showTooltip,
  margin,
}: NivoChartComponentProps): React.JSX.Element {
  const heatmapData = data as readonly HeatmapRowData[];

  return (
    <ResponsiveHeatMap
      data={[...heatmapData] as unknown as HeatMapSerie<HeatmapDataPoint, HeatmapRowData>[]}
      margin={margin ?? { top: 20, right: 20, bottom: 60, left: 60 }}
      colors={{
        type: "sequential",
        scheme: colorScheme === "nivo" ? "blues" : colorScheme,
      } as any}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: "",
        legendOffset: 46,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: -40,
      }}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.8]],
      }}
      animate={animate}
      hoverTarget="cell"
      borderColor={{ theme: "background" }}
      {...(showLabels && { label: (e: { value: number | null }) => String(e.value ?? "") })}
      {...(showTooltip && {
        tooltip: ((e: { cell: { x: { id: string }; y: { id: string }; value: number; color: string } }) => (
          <div
            style={{
              padding: "8px 12px",
              background: "#fff",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: "12px",
            }}
          >
            <strong>{e.cell.y.id}</strong> × <strong>{e.cell.x.id}</strong>
            <br />
            Value: <strong>{e.cell.value}</strong>
          </div>
        )) as never,
      })}
    />
  );
});

HeatMapWidget.displayName = "HeatMapWidget";