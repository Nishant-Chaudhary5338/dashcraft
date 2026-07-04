"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDashboardStore } from "dashcraft-core";
import { generateDashboardCode } from "@/lib/codegen";
import { CopyButton } from "@/components/ui/CopyButton";
import { PlaygroundCanvas } from "./PlaygroundCanvas";
import { ConfigPanel } from "./ConfigPanel";
import { ImportPanel } from "./ImportPanel";
import { PALETTE, makeWidget, firstFitSlot, toCodegen, type PlaygroundType, type PlaygroundWidget } from "./widgetKit";

/** Read live drag/resize state from the dashcraft store so generated code
 *  reflects exactly how the user arranged the canvas. */
function readLive(widgets: PlaygroundWidget[]) {
  const store = useDashboardStore.getState();
  const live: Record<string, { position?: { x: number; y: number }; size?: { width: number; height: number } }> = {};
  for (const w of widgets) {
    const s = store.getWidgetState(w.id);
    const size = s?.size;
    live[w.id] = {
      position: s?.position,
      size:
        size && typeof size.width === "number" && typeof size.height === "number"
          ? { width: size.width, height: size.height }
          : undefined,
    };
  }
  return live;
}

export function PlaygroundApp(): React.ReactElement {
  const [widgets, setWidgets] = useState<PlaygroundWidget[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [tab, setTab] = useState<"builder" | "import">("builder");
  const [configOpen, setConfigOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const counter = useRef(0);

  // Preview = view mode: drives the dashcraft store's edit mode so all edit
  // affordances (drag handle, resize grips, delete, gear) hide.
  useEffect(() => {
    useDashboardStore.getState().setEditMode(!preview);
  }, [preview]);

  // Selecting a widget opens the contextual config panel.
  const selectWidget = useCallback((id: string) => {
    setSelectedId(id);
    setConfigOpen(true);
  }, []);

  const handleImport = useCallback((ws: PlaygroundWidget[]) => {
    setWidgets(ws);
    setSelectedId(ws[0]?.id ?? null);
    setTab("builder");
  }, []);

  // Load a template handed off from the Templates gallery ("Open in Playground").
  useEffect(() => {
    try {
      const raw = localStorage.getItem("dc-playground-preset");
      if (!raw) return;
      localStorage.removeItem("dc-playground-preset");
      const ws = JSON.parse(raw) as PlaygroundWidget[];
      if (Array.isArray(ws) && ws.length) {
        setWidgets(ws);
        setSelectedId(ws[0]?.id ?? null);
      }
    } catch { /* ignore */ }
  }, []);

  const addWidget = useCallback((type: PlaygroundType) => {
    const id = `w${++counter.current}`;
    const size = PALETTE.find((p) => p.type === type)!.size;
    setWidgets((prev) => {
      // Layout-aware placement: drop the new widget in the first open slot
      // (top-left first) using LIVE positions, not always at the bottom.
      const live = readLive(prev);
      const rects = prev.map((w) => {
        const p = live[w.id]?.position ?? w.defaultPosition;
        const s = live[w.id]?.size ?? w.defaultSize;
        return { x: p.x, y: p.y, w: s.width, h: s.height };
      });
      return [...prev, makeWidget(type, id, firstFitSlot(rects, size.width, size.height))];
    });
    setSelectedId(id);
    setConfigOpen(true);
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const patchSelected = useCallback(
    (patch: Partial<PlaygroundWidget>) =>
      setWidgets((prev) => prev.map((w) => (w.id === selectedId ? { ...w, ...patch } : w))),
    [selectedId],
  );

  const clear = useCallback(() => {
    setWidgets([]);
    setSelectedId(null);
    setCodeOpen(false);
  }, []);

  // Generated code is derived on demand (reads the live store for positions).
  const code = useMemo(
    () => (widgets.length ? generateDashboardCode(toCodegen(widgets, readLive(widgets))) : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [widgets, codeOpen],
  );

  const download = useCallback(async () => {
    const { downloadProjectZip } = await import("@/lib/zipgen");
    await downloadProjectZip(toCodegen(widgets, readLive(widgets)));
  }, [widgets]);

  return (
    <div className="pg-shell">
      <div className="pg-topbar">
        <div className="pg-tabs">
          {(["builder", "import"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pg-tab${tab === t ? " active" : ""}`}>
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
          <button
            onClick={() => { setPreview((v) => !v); setTab("builder"); }}
            className={`btn ${preview ? "btn-signal" : "btn-ghost"}`}
            style={{ padding: "5px 12px", fontSize: "0.82rem" }}
            disabled={!widgets.length}
            title={preview ? "Back to editing" : "Preview the finished dashboard"}
          >
            {preview ? "✎ Edit" : "◱ Preview"}
          </button>
          <button onClick={clear} className="btn btn-ghost" style={{ padding: "5px 12px", fontSize: "0.82rem" }}>
            Clear
          </button>
          <button onClick={download} className="btn btn-ghost" style={{ padding: "5px 12px", fontSize: "0.82rem" }} disabled={!widgets.length}>
            ↓ Download project
          </button>
          <button onClick={() => setCodeOpen((v) => !v)} className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.82rem" }}>
            {codeOpen ? "Hide Code" : "Get Code ↑"}
          </button>
        </div>
      </div>

      <div className={`pg-body${preview ? " is-preview" : configOpen && selectedId ? " cfg-open" : ""}`}>
        {!preview && (
          <aside className="playground-panel pg-rail">
            <div className="pg-rail-list">
              {PALETTE.map((p) => (
                <button key={p.type} className="pg-icon-btn" onClick={() => addWidget(p.type)} aria-label={`Add ${p.label}`}>
                  <span className="pg-icon-glyph">{p.icon}</span>
                  <span className="pg-icon-tip">{p.label}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        <div className="pg-canvas-scroll">
          {tab === "import" ? (
            <ImportPanel onImport={handleImport} />
          ) : widgets.length === 0 ? (
            <div className="canvas-empty">
              <p style={{ fontSize: "1.5rem", margin: 0 }}>⊞</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                Add a widget to start building
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                Pick one from the left — it drops in as a real, draggable widget.
              </p>
            </div>
          ) : (
            <PlaygroundCanvas widgets={widgets} onDelete={removeWidget} onSelect={selectWidget} selectedId={preview ? null : selectedId} preview={preview} />
          )}
        </div>

        {!preview && configOpen && selectedId && (
          <ConfigPanel
            widgets={widgets}
            selectedId={selectedId}
            onSelect={selectWidget}
            onPatch={patchSelected}
            onClose={() => setConfigOpen(false)}
          />
        )}
      </div>

      <div className={`code-export-panel${codeOpen ? " open" : ""}`}>
        <div className="pg-code-bar">
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem" }}>Generated Code</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CopyButton text={code} />
            <button onClick={() => setCodeOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.1rem" }}>
              ✕
            </button>
          </div>
        </div>
        <div className="pg-code-body">
          {widgets.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Add widgets to generate code.</p>
          ) : (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{code}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
