import type { Preset, ShowcaseWidget } from "./presets";

const CANVAS_WIDTH = 1160;

function fmtValue(v: number, format: string): string {
  if (format === "currency") return `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`;
  if (format === "percentage") return `${v}%`;
  return v >= 1000 ? v.toLocaleString() : String(v);
}

/** Representative mini-viz for a chart tile (poster only — not data-exact). */
function Glyph({ w }: { w: Extract<ShowcaseWidget, { kind: "chart" }> }) {
  if (w.chartType === "pie") {
    return (
      <svg viewBox="0 0 40 40" style={{ width: 64, height: 64, margin: "8px auto 0", display: "block" }}>
        <circle cx="20" cy="20" r="15" fill="none" stroke="var(--tpl-accent, #C2FF3D)" strokeWidth="9" strokeDasharray="55 100" />
        <circle cx="20" cy="20" r="15" fill="none" stroke="var(--tpl-accent2, #FF6A2C)" strokeWidth="9" strokeDasharray="30 100" strokeDashoffset="-55" opacity="0.7" />
      </svg>
    );
  }
  if (w.chartType === "bar") {
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70, marginTop: 12 }}>
        {[50, 78, 40, 90, 62, 82, 55].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, background: "var(--tpl-accent, #C2FF3D)", borderRadius: "3px 3px 0 0", opacity: 0.9 }} />
        ))}
      </div>
    );
  }
  // line / area
  return (
    <svg viewBox="0 0 200 70" style={{ width: "100%", height: 70, marginTop: 10 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`tg-${w.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--tpl-accent, #C2FF3D)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--tpl-accent, #C2FF3D)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {w.chartType === "area" && (
        <path d="M0,55 C30,48 45,30 70,34 C100,39 120,14 150,20 C175,25 190,10 200,8 L200,70 L0,70Z" fill={`url(#tg-${w.id})`} />
      )}
      <path d="M0,55 C30,48 45,30 70,34 C100,39 120,14 150,20 C175,25 190,10 200,8" fill="none" stroke="var(--tpl-accent, #C2FF3D)" strokeWidth="2.5" />
    </svg>
  );
}

function Tile({ w }: { w: ShowcaseWidget }) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: w.defaultPosition.x,
    top: w.defaultPosition.y,
    width: w.defaultSize.width,
    height: w.defaultSize.height,
  };
  return (
    <div className="tpl-tile" style={style}>
      <p className="tpl-tile-label">{w.title}</p>
      {w.kind === "kpi" ? (
        <p className="tpl-tile-value">{fmtValue(w.value, w.format)}{w.suffix ?? ""}</p>
      ) : (
        <Glyph w={w} />
      )}
    </div>
  );
}

/**
 * A scaled, non-interactive poster of a template — renders the preset's widgets
 * as lightweight positioned tiles (no dashcraft-core store, so several posters
 * can render at once). Theming comes from the parent's `--tpl-*` CSS vars.
 */
export function TemplatePoster({ preset, height = 240 }: { preset: Preset; height?: number }): React.ReactElement {
  const contentHeight = Math.max(...preset.widgets.map((w) => w.defaultPosition.y + w.defaultSize.height), 1);
  const scale = height / contentHeight;
  return (
    <div className="tpl-poster" style={{ height, overflow: "hidden" }}>
      <div style={{ position: "relative", width: CANVAS_WIDTH, height: contentHeight, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {preset.widgets.map((w) => (
          <Tile key={w.id} w={w} />
        ))}
      </div>
    </div>
  );
}
