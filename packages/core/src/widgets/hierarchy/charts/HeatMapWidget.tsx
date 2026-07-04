import React, { useMemo } from "react";
import type { HeatmapRowData, HierarchyChartComponentProps } from "../hierarchy.types";

// ============================================================
// HeatMapWidget — dependency-free CSS-grid heatmap
// ============================================================

/**
 * Parses a `"#rrggbb"` (optionally without `#`) hex color into an `[r, g, b]`
 * tuple for use in an `rgba()` string. Not exported — internal to
 * {@link HeatMapWidget}'s cell-tinting logic.
 *
 * @param hex - Hex color string to parse.
 * @returns `[r, g, b]` byte tuple, or `[99, 102, 241]` (brand indigo) if `hex` doesn't match the expected pattern.
 */
function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [99, 102, 241];
  const n = parseInt(m[1] ?? "0", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Dependency-free CSS-grid heatmap. Columns are derived from the union of
 * every row's `data[].x` values (first-seen order); cell background opacity
 * is scaled linearly between the dataset's min and max `y` value (0.12–1.0),
 * tinted with `colors[0]` (or the default indigo `#6366f1` if omitted or
 * unparseable). `animate` and `margin` are not applicable to this chart and
 * are ignored. Used internally by {@link HierarchyWidget} when `chartType="heatmap"`.
 *
 * @param props - {@link HierarchyChartComponentProps} with `data` as {@link HeatmapRowData}`[]` (`animate`/`margin` accepted but unused).
 * @returns A scrollable CSS-grid heatmap (no external chart library).
 *
 * @example
 * ```tsx
 * import { HierarchyWidget } from "@dashcraft/core";
 *
 * <HierarchyWidget
 *   chartType="heatmap"
 *   id="usage"
 *   title="Usage by Hour"
 *   data={[{ id: "Mon", data: [{ x: "9am", y: 12 }] }]}
 *   colors={["#22c55e"]}
 * />
 * ```
 *
 * @see {@link HierarchyWidget}
 */
export const HeatMapWidget = React.memo(function HeatMapWidget({
  data,
  colors,
  showLabels,
  showTooltip,
}: HierarchyChartComponentProps): React.JSX.Element {
  const rows = data as readonly HeatmapRowData[];

  const { columns, min, max, rgb } = useMemo(() => {
    const cols: string[] = [];
    let lo = Infinity;
    let hi = -Infinity;
    for (const row of rows) {
      for (const cell of row.data) {
        if (!cols.includes(cell.x)) cols.push(cell.x);
        if (cell.y < lo) lo = cell.y;
        if (cell.y > hi) hi = cell.y;
      }
    }
    return {
      columns: cols,
      min: lo === Infinity ? 0 : lo,
      max: hi === -Infinity ? 1 : hi,
      rgb: hexToRgb(colors?.[0] ?? "#6366f1"),
    };
  }, [rows, colors]);

  const intensity = (v: number): number =>
    max === min ? 0.5 : 0.12 + 0.88 * ((v - min) / (max - min));

  const cellStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 600,
    minHeight: 18,
    color: "#fff",
  };

  return (
    <div className="w-full h-full overflow-auto" style={{ fontFamily: "inherit" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `auto repeat(${columns.length}, minmax(28px, 1fr))`,
          gap: 3,
          minWidth: "fit-content",
        }}
      >
        {/* Header row */}
        <div />
        {columns.map((c) => (
          <div
            key={c}
            style={{ fontSize: 10, textAlign: "center", opacity: 0.6, padding: "0 2px" }}
          >
            {c}
          </div>
        ))}

        {/* Data rows */}
        {rows.map((row) => (
          <React.Fragment key={row.id}>
            <div
              style={{
                fontSize: 10,
                opacity: 0.6,
                paddingRight: 6,
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              {row.id}
            </div>
            {columns.map((col) => {
              const cell = row.data.find((d) => d.x === col);
              if (!cell) return <div key={col} style={{ ...cellStyle, background: "transparent" }} />;
              const a = intensity(cell.y);
              return (
                <div
                  key={col}
                  style={{ ...cellStyle, background: `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})` }}
                  title={showTooltip ? `${row.id} × ${col}: ${cell.y}` : undefined}
                >
                  {showLabels ? cell.y : ""}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});

HeatMapWidget.displayName = "HeatMapWidget";
