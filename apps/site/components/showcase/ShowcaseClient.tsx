"use client";
/**
 * ShowcaseClient — interactive dashboard showcase with preset switcher.
 *
 * Features:
 * - 3 real-world preset dashboards using actual @dashcraft/core components
 * - Edit Mode toggle: enables drag, resize, delete on all cards
 * - Reset Layout: restores default widget positions via store resetLayout()
 * - Download Code: generates @dashcraft/core TSX via lib/codegen.ts
 * - Deleted widgets tracked in local state; restore-all on preset switch
 *
 * @example
 * // Used on /showcase page
 * import { ShowcaseClient } from "@/components/showcase/ShowcaseClient"
 * <ShowcaseClient />
 */

import { useState, useCallback, useTransition, useEffect } from "react";
import { PRESETS, type PresetKey } from "./presets";
import { ShowcaseDashboard } from "./ShowcaseDashboard";
import { generateDashboardCode } from "@/lib/codegen";
import { downloadProjectZip } from "@/lib/zipgen";
import type { WidgetConfig as CodegenWidget } from "@/lib/codegen";
import { CopyButton } from "@/components/ui/CopyButton";

const PRESET_KEYS = Object.keys(PRESETS) as PresetKey[];

function presetToCodegen(presetKey: PresetKey, deletedIds: Set<string>): CodegenWidget[] {
  return PRESETS[presetKey].widgets
    .filter((w) => !deletedIds.has(w.id))
    .map((w, i) => ({
      id: w.id,
      type: w.kind === "kpi" ? "kpi" : (`${w.chartType}_chart` as CodegenWidget["type"]),
      title: w.title,
      colStart: w.grid.colStart,
      colSpan: w.grid.colSpan,
      rowStart: w.grid.rowStart,
      rowSpan: w.grid.rowSpan,
      drag: true, resize: true, settings: true, delete: true,
      config: {
        format: w.kind === "kpi"
          ? (w.format === "percentage" ? "percent" : w.format) as "currency" | "percent" | "number"
          : undefined,
        chartType: w.kind === "chart" ? w.chartType : undefined,
      },
    }));
}

export function ShowcaseClient() {
  const [preset, setPreset] = useState<PresetKey>("analytics");
  const [editMode, setEditMode] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [codeOpen, setCodeOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Reset deleted widgets when switching presets
  const handlePresetSwitch = useCallback((key: PresetKey) => {
    startTransition(() => {
      // Reset the global dashcraft store before switching so old widget
      // positions don't bleed into the new preset's layout
      import("@dashcraft/core/store").then(({ useDashboardStore }) => {
        useDashboardStore.getState().resetLayout();
        setPreset(key);
        setDeletedIds(new Set());
        setEditMode(false);
        setCodeOpen(false);
      });
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeletedIds((prev) => new Set([...prev, id]));
  }, []);

  const handleReset = useCallback(() => {
    import("@dashcraft/core/store").then(({ useDashboardStore }) => {
      useDashboardStore.getState().resetLayout();
      setDeletedIds(new Set());
    });
  }, []);

  const handleDownload = useCallback(async () => {
    const widgets = presetToCodegen(preset, deletedIds);
    await downloadProjectZip(widgets, `dashcraft-${preset}-dashboard`);
  }, [preset, deletedIds]);

  const currentPreset = PRESETS[preset];
  const activeWidgets = currentPreset.widgets.filter((w) => !deletedIds.has(w.id));
  const generatedCode = generateDashboardCode(
    presetToCodegen(preset, deletedIds),
    `${preset.charAt(0).toUpperCase() + preset.slice(1)}Dashboard`
  );

  return (
    <div className="showcase-root">
      {/* ── Top Controls ─────────────────────────────── */}
      <div className="showcase-topbar">
        {/* Preset Tabs */}
        <div className="showcase-tabs">
          {PRESET_KEYS.map((key) => (
            <button
              key={key}
              className={`showcase-tab${preset === key ? " active" : ""}`}
              onClick={() => handlePresetSwitch(key)}
            >
              <span className="showcase-tab-dot" style={{ background: PRESETS[key].accent }} />
              {PRESETS[key].label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="showcase-actions">
          {deletedIds.size > 0 && (
            <button className="showcase-btn ghost" onClick={handleReset}>
              ↺ Restore All
            </button>
          )}
          <button className="showcase-btn ghost" onClick={handleReset}>
            Reset Layout
          </button>
          <button
            className={`showcase-btn${editMode ? " active" : ""}`}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "✓ Done Editing" : "⊞ Edit Layout"}
          </button>
          <button className="showcase-btn accent" onClick={() => setCodeOpen((v) => !v)}>
            {codeOpen ? "Hide Code" : "View Code"}
          </button>
          <button className="showcase-btn accent" onClick={handleDownload}>
            ↓ Download
          </button>
        </div>
      </div>

      {/* ── Preset description ───────────────────────── */}
      <div className="showcase-desc">
        <span className="showcase-desc-label">{currentPreset.label}</span>
        {" — "}
        {currentPreset.description}
        {editMode && (
          <span className="showcase-edit-hint"> · Drag widgets to reposition. Resize from the corner. Click ✕ to delete.</span>
        )}
        <span className="showcase-widget-count">{activeWidgets.length} widgets</span>
      </div>

      {/* ── Dashboard Canvas ─────────────────────────── */}
      <div className="showcase-canvas-wrap">
        <div className="showcase-canvas-scroll">
          {/* key changes on preset switch, forcing full unmount+remount */}
          <ShowcaseDashboard
            key={preset}
            preset={currentPreset}
            editMode={editMode}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* ── Code Panel ───────────────────────────────── */}
      <div className={`showcase-code-panel${codeOpen ? " open" : ""}`}>
        <div className="showcase-code-header">
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>src/Dashboard.tsx</span>
            {" "}— copy into your project, replace <code>data={`{[]}`}</code> with real data
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <CopyButton text={generatedCode} />
            <button className="showcase-btn" onClick={handleDownload}>↓ Full Project ZIP</button>
            <button className="showcase-btn ghost" onClick={() => setCodeOpen(false)}>✕</button>
          </div>
        </div>
        <pre className="showcase-code-pre"><code>{generatedCode}</code></pre>
      </div>
    </div>
  );
}
