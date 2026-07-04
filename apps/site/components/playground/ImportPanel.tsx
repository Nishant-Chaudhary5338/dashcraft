"use client";

import { useCallback, useRef, useState } from "react";
import type { PlaygroundWidget, PlaygroundType } from "./widgetKit";

const KEY_STORE = "dc-anthropic-key";
const GUTTER = 16;
const COLS = 12;
const CANVAS_WIDTH = 1160;
const ROW_HEIGHT = 96;
const COL_WIDTH = (CANVAS_WIDTH - (COLS - 1) * GUTTER) / COLS;

interface AnalysisWidget {
  id?: string;
  type: PlaygroundType;
  title?: string;
  colStart?: number;
  colSpan?: number;
  rowStart?: number;
  rowSpan?: number;
  config?: { format?: string };
}

/** Map a vision-analysis grid slot to a real PlaygroundWidget (pixel canvas). */
function toPlayground(a: AnalysisWidget, i: number): PlaygroundWidget {
  const colStart = a.colStart ?? 1;
  const colSpan = a.colSpan ?? 4;
  const rowStart = a.rowStart ?? 1;
  const rowSpan = a.rowSpan ?? 2;
  const rawFmt = a.config?.format;
  const format = (rawFmt === "percent" ? "percentage" : rawFmt) as PlaygroundWidget["format"];
  return {
    id: a.id || `imp${i}`,
    type: a.type,
    title: a.title || "Widget",
    drag: true,
    resize: true,
    settings: false,
    delete: true,
    format: format ?? "number",
    defaultPosition: {
      x: Math.round((colStart - 1) * (COL_WIDTH + GUTTER)),
      y: Math.round((rowStart - 1) * (ROW_HEIGHT + GUTTER)),
    },
    defaultSize: {
      width: Math.round(colSpan * COL_WIDTH + (colSpan - 1) * GUTTER),
      height: Math.round(rowSpan * ROW_HEIGHT + (rowSpan - 1) * GUTTER),
    },
  };
}

/**
 * AI Import (bring-your-own-key). The user pastes their Anthropic key (kept in
 * localStorage, sent per-request and never stored on our servers) and drops a
 * dashboard screenshot; Claude Vision returns a widget layout that becomes real
 * draggable dashcraft-core widgets on the canvas.
 */
export function ImportPanel({ onImport }: { onImport: (widgets: PlaygroundWidget[]) => void }): React.ReactElement {
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try { return localStorage.getItem(KEY_STORE) ?? ""; } catch { return ""; }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveKey = (v: string) => {
    setApiKey(v);
    try { localStorage.setItem(KEY_STORE, v); } catch { /* ignore */ }
  };

  const analyze = useCallback(async (file: File) => {
    if (!apiKey.trim()) { setError("Add your Anthropic API key first."); return; }
    setBusy(true);
    setError(null);
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res((r.result as string).split(",")[1] ?? "");
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-anthropic-key": apiKey.trim() },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type || "image/png" }),
      });
      if (!resp.ok) {
        const e = (await resp.json().catch(() => ({}))) as { message?: string; error?: string };
        throw new Error(e.message || e.error || `Request failed (${resp.status})`);
      }
      const data = (await resp.json()) as { widgets?: AnalysisWidget[] };
      const widgets = (data.widgets ?? []).map(toPlayground);
      if (!widgets.length) throw new Error("No widgets detected in that image.");
      onImport(widgets);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setBusy(false);
    }
  }, [apiKey, onImport]);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label className="config-field-label">Anthropic API key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => saveKey(e.target.value)}
          placeholder="sk-ant-…"
          className="config-input"
          style={{ fontFamily: "var(--font-mono)" }}
        />
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>
          Bring your own key. Stored only in this browser; sent per-request and never saved on our servers.
        </p>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void analyze(f); }}
        className="pg-dropzone"
      >
        <p style={{ fontSize: "1.8rem", margin: 0 }}>⬆</p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", margin: "8px 0 4px" }}>
          Drop a dashboard screenshot
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>PNG or JPG · Claude Vision maps it to widgets</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void analyze(f); }} />

      {busy && <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent)" }}>Analyzing with Claude…</p>}
      {error && (
        <p style={{ background: "rgba(240,81,47,0.1)", border: "1px solid rgba(240,81,47,0.3)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#F0512F" }}>
          {error}
        </p>
      )}
    </div>
  );
}
