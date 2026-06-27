import React, { useMemo } from "react";
import type { HeatmapRowData, HierarchyChartComponentProps } from "../hierarchy.types";

// ============================================================
// HeatMapWidget — dependency-free CSS-grid heatmap
// ============================================================

/** Parse "#rrggbb" into [r,g,b]. Falls back to the brand indigo. */
function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [99, 102, 241];
  const n = parseInt(m[1] ?? "0", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

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
