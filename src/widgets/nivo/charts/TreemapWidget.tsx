import React from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import type { TreemapDataNode, NivoChartComponentProps } from "../nivo.types";

// ============================================================
// TreemapWidget Component
// ============================================================

export const TreemapWidget = React.memo(function TreemapWidget({
  data,
  colorScheme,
  colors,
  animate,
  showLabels,
  showTooltip,
  margin,
}: NivoChartComponentProps): React.JSX.Element {
  const treemapData = data as readonly TreemapDataNode[];

  return (
    <ResponsiveTreeMap
      data={[...treemapData]}
      identity="id"
      value="value"
      margin={margin ?? { top: 10, right: 10, bottom: 10, left: 10 }}
      labelSkipSize={showLabels ? 12 : 9999}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.8]],
      }}
      parentLabelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      colors={colors ? [...colors] : { scheme: colorScheme }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.3]],
      }}
      animate={animate}
      {...(showTooltip && {
        tooltip: ((e: { node: { id: string; value: number; color: string } }) => (
          <div
            style={{
              padding: "8px 12px",
              background: "#fff",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: "12px",
            }}
          >
            <strong style={{ color: e.node.color }}>{e.node.id}</strong>
            <br />
            Value: <strong>{e.node.value.toLocaleString()}</strong>
          </div>
        )) as never,
      })}
    />
  );
});

TreemapWidget.displayName = "TreemapWidget";