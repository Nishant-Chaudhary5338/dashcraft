import React, { useMemo } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import type { TreemapDataNode, HierarchyChartComponentProps } from "../hierarchy.types";

// ============================================================
// TreemapWidget — recharts-backed (no external chart dependency)
// ============================================================

/** Default fill palette cycled by sibling index when {@link HierarchyWidgetProps.colors} is omitted. */
const DEFAULT_PALETTE: readonly string[] = [
  "#6366f1", "#22d3ee", "#a855f7", "#22c55e",
  "#fb923c", "#f472b6", "#facc15", "#14b8a6",
];

/** Internal shape recharts' `<Treemap>` expects; not part of the public API. */
interface RechartsTreemapNode {
  name: string;
  size?: number;
  fill: string;
  children?: RechartsTreemapNode[];
  [key: string]: unknown;
}

/**
 * Maps dashcraft's `{id, value, children}` {@link TreemapDataNode} tree into
 * recharts' `{name, size, fill}` shape, assigning each node a fill color
 * cycled from `palette` by sibling index. Branch nodes (with non-empty
 * `children`) omit `size` — recharts derives their area from descendants.
 * Not exported — internal to {@link TreemapWidget}.
 *
 * @param nodes - Source nodes to convert.
 * @param palette - Colors to cycle through by sibling index.
 * @returns Recharts-shaped node tree.
 */
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

/** Props recharts passes to a `<Treemap content>` renderer for a single rectangle. Not part of the public API. */
interface CellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name?: string;
  fill?: string;
  depth?: number;
}

/**
 * Custom recharts `<Treemap>` cell renderer: draws the rectangle and, only
 * for depth-1 rectangles large enough to fit text (`width > 48 && height > 24`),
 * an in-rect label. Not exported — internal to {@link TreemapWidget}.
 */
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

/**
 * Renders a recharts `<Treemap>` from a {@link TreemapDataNode} tree, using a
 * custom cell renderer ({@link TreemapCell}) so only depth-1 rectangles large
 * enough to fit text get an in-rect label. `showLabels` and `margin` are
 * not read by this component and are ignored. Used internally by
 * {@link HierarchyWidget} when `chartType="treemap"`.
 *
 * @param props - {@link HierarchyChartComponentProps} with `data` as {@link TreemapDataNode}`[]` (`showLabels`/`margin` accepted but unused).
 * @returns A `ResponsiveContainer`-wrapped recharts treemap.
 *
 * @example
 * ```tsx
 * import { HierarchyWidget } from "@dashcraft/core";
 *
 * <HierarchyWidget
 *   chartType="treemap"
 *   id="portfolio"
 *   title="Portfolio Allocation"
 *   data={[
 *     { id: "Equities", value: 0, children: [{ id: "Tech", value: 40 }, { id: "Healthcare", value: 20 }] },
 *     { id: "Bonds", value: 40 },
 *   ]}
 * />
 * ```
 *
 * @see {@link HierarchyWidget}
 */
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
