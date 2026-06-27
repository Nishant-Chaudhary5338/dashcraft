import React, { useMemo } from "react";
import { ResponsiveContainer, SunburstChart, Tooltip } from "recharts";
import type { SunburstDataNode, HierarchyChartComponentProps } from "../hierarchy.types";

// ============================================================
// SunburstWidget — recharts-backed (no external chart dependency)
// ============================================================

const DEFAULT_PALETTE: readonly string[] = [
  "#6366f1", "#22d3ee", "#a855f7", "#22c55e",
  "#fb923c", "#f472b6", "#facc15", "#14b8a6",
];

interface RechartsSunburstNode {
  name: string;
  value?: number;
  fill: string;
  children?: RechartsSunburstNode[];
  [key: string]: unknown;
}

function toNodes(
  nodes: readonly SunburstDataNode[],
  palette: readonly string[],
  depth = 0
): RechartsSunburstNode[] {
  return nodes.map((n, i) => {
    const fill = n.color ?? palette[(i + depth) % palette.length] ?? DEFAULT_PALETTE[0]!;
    if (n.children && n.children.length) {
      const children = toNodes(n.children, palette, depth + 1);
      // recharts Sunburst does not auto-sum: every node needs an explicit value.
      const value = children.reduce((sum, c) => sum + (c.value ?? 0), 0);
      return { name: n.id, fill, value, children };
    }
    return { name: n.id, fill, value: n.value };
  });
}

function sumValues(nodes: readonly RechartsSunburstNode[]): number {
  return nodes.reduce((sum, n) => sum + (n.value ?? 0), 0);
}

export const SunburstWidget = React.memo(function SunburstWidget({
  data,
  colors,
  showTooltip,
}: HierarchyChartComponentProps): React.JSX.Element {
  const palette = colors && colors.length ? [...colors] : DEFAULT_PALETTE;
  const root = useMemo<RechartsSunburstNode>(() => {
    const children = toNodes(data as readonly SunburstDataNode[], palette);
    return { name: "root", fill: "transparent", value: sumValues(children), children };
  }, [data, palette]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <SunburstChart data={root} dataKey="value" nameKey="name" stroke="rgba(0,0,0,0.3)">
        {showTooltip && <Tooltip />}
      </SunburstChart>
    </ResponsiveContainer>
  );
});

SunburstWidget.displayName = "SunburstWidget";
