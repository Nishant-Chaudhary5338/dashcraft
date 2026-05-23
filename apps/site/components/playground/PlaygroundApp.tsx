"use client";

import { useState, useCallback, useRef } from "react";
import type { WidgetConfig } from "@/lib/codegen";
import { generateDashboardCode } from "@/lib/codegen";
import { CopyButton } from "@/components/ui/CopyButton";

const WIDGET_TYPES: Array<{
  type: WidgetConfig["type"];
  label: string;
  emoji: string;
  defaultConfig: WidgetConfig["config"];
}> = [
  { type: "kpi", label: "KPI Card", emoji: "◈", defaultConfig: { format: "number" } },
  { type: "bar_chart", label: "Bar Chart", emoji: "▐", defaultConfig: {} },
  { type: "line_chart", label: "Line Chart", emoji: "⌇", defaultConfig: {} },
  { type: "area_chart", label: "Area Chart", emoji: "△", defaultConfig: {} },
  { type: "pie_chart", label: "Pie Chart", emoji: "◔", defaultConfig: {} },
  { type: "scatter_chart", label: "Scatter Chart", emoji: "⁘", defaultConfig: {} },
  { type: "heatmap", label: "Heatmap", emoji: "▦", defaultConfig: {} },
  { type: "treemap", label: "Treemap", emoji: "⊞", defaultConfig: {} },
  { type: "sunburst", label: "Sunburst", emoji: "✺", defaultConfig: {} },
];

const TYPE_COLORS: Record<WidgetConfig["type"], string> = {
  kpi: "rgba(99,102,241,0.12)",
  bar_chart: "rgba(34,211,238,0.08)",
  line_chart: "rgba(168,85,247,0.08)",
  area_chart: "rgba(34,197,94,0.07)",
  pie_chart: "rgba(251,146,60,0.08)",
  scatter_chart: "rgba(244,114,182,0.08)",
  radar_chart: "rgba(250,204,21,0.07)",
  heatmap: "rgba(239,68,68,0.08)",
  treemap: "rgba(20,184,166,0.08)",
  sunburst: "rgba(132,204,22,0.08)",
};

const TYPE_BORDER: Record<WidgetConfig["type"], string> = {
  kpi: "rgba(99,102,241,0.3)",
  bar_chart: "rgba(34,211,238,0.2)",
  line_chart: "rgba(168,85,247,0.25)",
  area_chart: "rgba(34,197,94,0.2)",
  pie_chart: "rgba(251,146,60,0.2)",
  scatter_chart: "rgba(244,114,182,0.2)",
  radar_chart: "rgba(250,204,21,0.2)",
  heatmap: "rgba(239,68,68,0.2)",
  treemap: "rgba(20,184,166,0.2)",
  sunburst: "rgba(132,204,22,0.2)",
};

function makeWidget(type: WidgetConfig["type"], idx: number): WidgetConfig {
  const info = WIDGET_TYPES.find((w) => w.type === type)!;
  return {
    id: `widget-${idx}`,
    type,
    title: info.label,
    colStart: 1,
    colSpan: type === "kpi" ? 4 : 6,
    rowStart: 1,
    rowSpan: type === "kpi" ? 2 : 4,
    drag: true,
    resize: true,
    settings: false,
    delete: true,
    config: { ...info.defaultConfig },
  };
}

function Toggle({
  label,
  prop,
  checked,
  onChange,
}: {
  label: string;
  prop: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = `toggle-${prop}`;
  return (
    <div className="config-toggle-row">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="config-label">{label}</span>
        <span className="config-prop-tag">{prop}</span>
      </div>
      <label className="toggle-switch">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-track" />
        <span className="toggle-thumb" />
      </label>
    </div>
  );
}

export function PlaygroundApp() {
  const [tab, setTab] = useState<"builder" | "import">("builder");
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const widgetCounter = useRef(0);

  const selected = widgets.find((w) => w.id === selectedId) ?? null;

  const addWidget = useCallback((type: WidgetConfig["type"]) => {
    const w = makeWidget(type, ++widgetCounter.current);
    setWidgets((prev) => [...prev, w]);
    setSelectedId(w.id);
  }, []);

  const updateSelected = useCallback(
    (patch: Partial<WidgetConfig>) => {
      setWidgets((prev) =>
        prev.map((w) => (w.id === selectedId ? { ...w, ...patch } : w))
      );
    },
    [selectedId]
  );

  const updateConfig = useCallback(
    (patch: Partial<WidgetConfig["config"]>) => {
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === selectedId ? { ...w, config: { ...w.config, ...patch } } : w
        )
      );
    },
    [selectedId]
  );

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setImporting(true);
    setImportError(null);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload = () => {
          const result = reader.result as string;
          res(result.split(",")[1]);
        };
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const mimeType = file.type || "image/jpeg";
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? "Analysis failed");
      }
      const data = await resp.json();
      const imported: WidgetConfig[] = (data.widgets ?? []).map(
        (w: {
          id: string;
          type: WidgetConfig["type"];
          title: string;
          colStart: number;
          colSpan: number;
          rowStart: number;
          rowSpan: number;
          config: WidgetConfig["config"];
        }) => ({
          id: w.id ?? `widget-${++widgetCounter.current}`,
          type: w.type,
          title: w.title ?? "Widget",
          colStart: w.colStart ?? 1,
          colSpan: w.colSpan ?? 6,
          rowStart: w.rowStart ?? 1,
          rowSpan: w.rowSpan ?? 4,
          drag: true,
          resize: true,
          settings: false,
          delete: true,
          config: w.config ?? {},
        })
      );
      setWidgets(imported);
      setTab("builder");
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setImporting(false);
    }
  }, []);

  const generatedCode = generateDashboardCode(widgets);

  return (
    <div style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 48, borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["builder", "import"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 500,
                padding: "5px 14px", borderRadius: "var(--radius-sm)", border: "none",
                background: tab === t ? "var(--bg-elevated)" : "transparent",
                color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {t === "builder" ? "⊞ Builder" : "✦ AI Import"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {widgets.length > 0 && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {widgets.length} widget{widgets.length !== 1 ? "s" : ""}
            </span>
          )}
          <button onClick={() => { setWidgets([]); setSelectedId(null); setCodeOpen(false); }}
            className="btn btn-ghost" style={{ padding: "5px 12px", fontSize: "0.82rem" }}>
            Clear
          </button>
          <button onClick={() => setCodeOpen((v) => !v)}
            className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
            {codeOpen ? "Hide Code" : "Get Code ↑"}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 260px", flex: 1, overflow: "hidden" }}>

        {/* Left — palette */}
        <div className="playground-panel">
          <div style={{ padding: "16px 14px" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
              Widgets
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {WIDGET_TYPES.map((wt) => (
                <button key={wt.type} className="widget-card-palette"
                  onClick={() => addWidget(wt.type)}
                  style={{ width: "100%", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ fontSize: "1rem", width: 20, flexShrink: 0 }}>{wt.emoji}</span>
                  <span style={{ fontSize: "0.82rem" }}>{wt.label}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 16, lineHeight: 1.5 }}>
              Click to add widgets to the canvas →
            </p>
          </div>
        </div>

        {/* Center — canvas */}
        <div style={{ background: "var(--bg-base)", overflow: "auto", position: "relative" }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        >
          {tab === "import" ? (
            <div style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", gap: 16 }}>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={async (e) => {
                  e.preventDefault(); setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) await handleFileUpload(file);
                }}
                style={{
                  width: "100%", maxWidth: 480, border: `1.5px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-xl)", padding: "64px 32px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.2s",
                  background: dragOver ? "var(--accent-subtle)" : "var(--bg-surface)",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: 12 }}>⬆</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>
                  Drop a dashboard screenshot here
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                  PNG, JPG, PDF · up to 10 MB
                </p>
              </div>
              <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
              />
              {importing && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Analyzing with Claude… ✦
                </p>
              )}
              {importError && (
                <div style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "var(--radius-md)", padding: "12px 16px",
                  fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#fca5a5", maxWidth: 480, width: "100%",
                }}>
                  {importError}
                  {importError.includes("ANTHROPIC_API_KEY") && (
                    <p style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Set ANTHROPIC_API_KEY in your Vercel environment variables to enable AI import.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: 24, minHeight: "100%" }}>
              {widgets.length === 0 ? (
                <div className="canvas-empty">
                  <p style={{ fontSize: "1.5rem", margin: 0 }}>⊞</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                    Drag a widget here to start building
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                    Or click any widget in the left panel
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 10 }}>
                  {widgets.map((w) => (
                    <div key={w.id} onClick={() => setSelectedId(w.id)}
                      className={`placed-widget${selectedId === w.id ? " selected" : ""}`}
                      style={{
                        gridColumn: `${w.colStart} / span ${w.colSpan}`,
                        background: TYPE_COLORS[w.type],
                        borderColor: selectedId === w.id ? "var(--accent)" : TYPE_BORDER[w.type],
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {w.type.replace("_", " ")}
                          </p>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>
                            {w.title}
                          </p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeWidget(w.id); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px 4px", fontSize: "0.8rem", lineHeight: 1 }}
                        >
                          ✕
                        </button>
                      </div>
                      <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {w.drag && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "2px 6px", background: "var(--accent-subtle)", color: "var(--accent-hover)", borderRadius: 4 }}>drag</span>}
                        {w.resize && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "2px 6px", background: "var(--accent-subtle)", color: "var(--accent-hover)", borderRadius: 4 }}>resize</span>}
                        {w.settings && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "2px 6px", background: "var(--accent-subtle)", color: "var(--accent-hover)", borderRadius: 4 }}>settings</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — config */}
        <div className="playground-config">
          <div style={{ padding: "16px 16px" }}>
            {selected ? (
              <>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
                  Widget Config
                </p>

                {/* Title */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Title</label>
                  <input type="text" value={selected.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                    style={{
                      width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)", padding: "7px 10px", color: "var(--text-primary)",
                      fontFamily: "var(--font-body)", fontSize: "0.875rem", outline: "none",
                    }}
                  />
                </div>

                {/* Behaviours */}
                <Toggle label="Draggable" prop="drag" checked={selected.drag} onChange={(v) => updateSelected({ drag: v })} />
                <Toggle label="Resizable" prop="resize" checked={selected.resize} onChange={(v) => updateSelected({ resize: v })} />
                <Toggle label="Settings" prop="settings" checked={selected.settings} onChange={(v) => updateSelected({ settings: v })} />
                <Toggle label="Deletable" prop="delete" checked={selected.delete} onChange={(v) => updateSelected({ delete: v })} />

                {/* KPI format */}
                {selected.type === "kpi" && (
                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Format</label>
                    <select value={selected.config.format ?? "number"}
                      onChange={(e) => updateConfig({ format: e.target.value as "currency" | "percent" | "number" })}
                      style={{
                        width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)", padding: "7px 10px", color: "var(--text-primary)",
                        fontFamily: "var(--font-mono)", fontSize: "0.82rem", outline: "none",
                      }}
                    >
                      <option value="number">number</option>
                      <option value="currency">currency</option>
                      <option value="percent">percent</option>
                    </select>
                  </div>
                )}

                {/* Grid */}
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
                    Grid Position
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(["colStart", "colSpan", "rowStart", "rowSpan"] as const).map((key) => (
                      <div key={key}>
                        <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "block", marginBottom: 4 }}>{key}</label>
                        <input type="number" value={selected[key]} min={1} max={key.includes("Span") ? 12 : 12}
                          onChange={(e) => updateSelected({ [key]: parseInt(e.target.value) || 1 })}
                          style={{
                            width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)", padding: "5px 8px", color: "var(--text-primary)",
                            fontFamily: "var(--font-mono)", fontSize: "0.82rem", outline: "none",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <p style={{ fontSize: "1.5rem", margin: "0 0 12px" }}>◈</p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                  Click a widget on the canvas to configure its props
                </p>
              </div>
            )}

            {/* Download project */}
            {widgets.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
                <button
                  onClick={async () => {
                    const { downloadProjectZip } = await import("@/lib/zipgen");
                    await downloadProjectZip(widgets);
                  }}
                  className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem" }}
                >
                  ↓ Download Full Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className={`code-export-panel${codeOpen ? " open" : ""}`}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem" }}>
              Generated Code
            </span>
            <span className="badge" style={{ fontSize: "0.7rem" }}>Dashboard.tsx</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CopyButton text={generatedCode} />
            <button onClick={() => setCodeOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1 }}>
              ✕
            </button>
          </div>
        </div>
        <div style={{ padding: "16px 20px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: 1.8, overflowY: "auto", height: "calc(45vh - 48px)", color: "var(--text-secondary)" }}>
          {widgets.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              Add widgets to the canvas to generate code.
            </p>
          ) : (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{generatedCode}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
