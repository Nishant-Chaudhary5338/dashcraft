import React, { useMemo } from "react";
import { ResponsiveContainer, SunburstChart, Tooltip } from "recharts";
import type { SunburstDataNode, HierarchyChartComponentProps } from "../hierarchy.types";

// ============================================================
// SunburstWidget — recharts-backed (no external chart dependency)
// ============================================================

/** Default fill palette cycled by sibling index + depth when {@link HierarchyWidgetProps.colors} is omitted and a node has no explicit {@link SunburstDataNode.color}. */
const DEFAULT_PALETTE: readonly string[] = [
  "#6366f1", "#22d3ee", "#a855f7", "#22c55e",
  "#fb923c", "#f472b6", "#facc15", "#14b8a6",
];

/** Internal shape recharts' `<SunburstChart>` expects; not part of the public API. */
interface RechartsSunburstNode {
  name: string;
  value?: number;
  fill: string;
  children?: RechartsSunburstNode[];
  [key: string]: unknown;
}

/**
 * Recursively maps a {@link SunburstDataNode} tree into recharts'
 * `{name, value, fill, children}` shape. Because recharts' Sunburst does not
 * auto-aggregate parent values from children, branch nodes here get an
 * explicit `value` computed as the sum of their (already-converted)
 * children's values. Not exported — internal to {@link SunburstWidget}.
 *
 * @param nodes - Source nodes to convert.
 * @param palette - Colors to cycle through (by sibling index + depth) for nodes without an explicit `color`.
 * @param depth - Current recursion depth, used to vary the palette cycle offset per ring.
 * @returns Recharts-shaped node tree with explicit values on every node.
 */
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

/** Sums the (already-resolved) `value` of each top-level converted node. Not exported — internal to {@link SunburstWidget}. */
function sumValues(nodes: readonly RechartsSunburstNode[]): number {
  return nodes.reduce((sum, n) => sum + (n.value ?? 0), 0);
}

/**
 * Renders a recharts `<SunburstChart>` (nested-ring hierarchy) from a
 * {@link SunburstDataNode} tree. A synthetic invisible `"root"` node is
 * created to host the top-level entries, with its `value` computed as their
 * sum (see {@link toNodes}). `animate`, `showLabels`, and `margin` are not
 * read by this component and are ignored. Used internally by
 * {@link HierarchyWidget} when `chartType="sunburst"`.
 *
 * @param props - {@link HierarchyChartComponentProps} with `data` as {@link SunburstDataNode}`[]` (`animate`/`showLabels`/`margin` accepted but unused).
 * @returns A `ResponsiveContainer`-wrapped recharts sunburst chart.
 *
 * @example
 * ```tsx
 * import { HierarchyWidget } from "@dashcraft/core";
 *
 * <HierarchyWidget
 *   chartType="sunburst"
 *   id="org-structure"
 *   title="Org Structure"
 *   data={[
 *     { id: "Engineering", value: 0, children: [{ id: "Frontend", value: 12 }, { id: "Backend", value: 18 }] },
 *     { id: "Sales", value: 10 },
 *   ]}
 * />
 * ```
 *
 * @see {@link HierarchyWidget}
 */
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
