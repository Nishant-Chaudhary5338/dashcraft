import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import type { SunburstDataNode, NivoChartComponentProps } from "../nivo.types";

// ============================================================
// SunburstWidget Component
// ============================================================

export const SunburstWidget = React.memo(function SunburstWidget({
  data,
  colorScheme,
  colors,
  animate,
  showLabels,
  showTooltip,
  margin,
}: NivoChartComponentProps): React.JSX.Element {
  const sunburstData = data as readonly SunburstDataNode[];

  return (
    <ResponsiveSunburst
      data={{ id: "root", children: [...sunburstData] } as never}
      id="id"
      value="value"
      margin={margin ?? { top: 10, right: 10, bottom: 10, left: 10 }}
      cornerRadius={3}
      borderColor={{ theme: "background" }}
      colors={colors ? [...colors] : { scheme: colorScheme }}
      childColor={{
        from: "color",
        modifiers: [["brighter", 0.4]],
      }}
      enableArcLabels={showLabels}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 1.4]],
      }}
      animate={animate}
      {...(showTooltip && {
        tooltip: (e: { data: { id: string; value: number; percentage: number; color: string } }) => (
          <div
            style={{
              padding: "8px 12px",
              background: "#fff",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: "12px",
            }}
          >
            <strong style={{ color: e.data.color }}>{e.data.id}</strong>
            <br />
            Value: <strong>{e.data.value.toLocaleString()}</strong>
            <br />
            Share: <strong>{e.data.percentage?.toFixed(1) ?? 'N/A'}%</strong>
          </div>
        ),
      })}
    />
  );
});

SunburstWidget.displayName = "SunburstWidget";