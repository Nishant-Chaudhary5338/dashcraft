import React, { useMemo } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import type { TreemapDataNode, HierarchyChartComponentProps } from "../hierarchy.types";

// ============================================================
// TreemapWidget — recharts-backed (no external chart dependency)
// ============================================================

const DEFAULT_PALETTE: readonly string[] = [
  "#6366f1", "#22d3ee", "#a855f7", "#22c55e",
  "#fb923c", "#f472b6", "#facc15", "#14b8a6",
];

interface RechartsTreemapNode {
  name: string;
  size?: number;
  fill: string;
  children?: RechartsTreemapNode[];
  [key: string]: unknown;
}

/** Map dashcraft's {id, value, children} nodes into recharts' {name, size, fill} shape. */
function toRechartsNodes(
  nodes: readonly TreemapDataNode[],
  palette: readonly string[]
): RechartsTreemapNode[] {
  return nodes.map((n, i) => {
    const fill = palette[i % palette.length] ?? DEFAULT_PALETTE[0]!;
    return {
      name: n.id,
      fill,
      ...(n.children && n.children.length
        ? { children: toRechartsNodes(n.children, palette) }
        : { size: n.value }),
    };
  });
}

interface CellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name?: string;
  fill?: string;
  depth?: number;
}

function TreemapCell({ x, y, width, height, name, fill, depth }: CellProps): React.JSX.Element {
  const showLabel = width > 48 && height > 24 && depth === 1;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill ?? DEFAULT_PALETTE[0]}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={1}
        rx={2}
      />
      {showLabel && name && (
        <text x={x + 6} y={y + 16} fill="#fff" fontSize={11} fontWeight={600}>
          {name}
        </text>
      )}
    </g>
  );
}

export const TreemapWidget = React.memo(function TreemapWidget({
  data,
  colors,
  animate,
  showTooltip,
}: HierarchyChartComponentProps): React.JSX.Element {
  const palette = colors && colors.length ? [...colors] : DEFAULT_PALETTE;
  const rechartsData = useMemo(
    () => toRechartsNodes(data as readonly TreemapDataNode[], palette),
    [data, palette]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={rechartsData}
        dataKey="size"
        nameKey="name"
        isAnimationActive={animate}
        content={<TreemapCell x={0} y={0} width={0} height={0} />}
      >
        {showTooltip && <Tooltip />}
      </Treemap>
    </ResponsiveContainer>
  );
});

TreemapWidget.displayName = "TreemapWidget";
