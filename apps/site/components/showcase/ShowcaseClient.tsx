"use client";

import { useState, useCallback, useTransition } from "react";
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
    .map((w) => ({
      id: w.id,
      type: w.kind === "kpi" ? "kpi" : (`${w.chartType}_chart` as CodegenWidget["type"]),
      title: w.title,
      defaultPosition: w.defaultPosition,
      defaultSize: w.defaultSize,
      drag: true, resize: true, settings: true, delete: true,
      config: {
        format: w.kind === "kpi" ? w.format : undefined,
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

  const handlePresetSwitch = useCallback((key: PresetKey) => {
    startTransition(() => {
      import("dashcraft-core/store").then(({ useDashboardStore }) => {
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
    import("dashcraft-core/store").then(({ useDashboardStore }) => {
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
        {/* Preset Tabs — left */}
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

        {/* Actions — right, clear hierarchy */}
        <div className="showcase-actions">
          {/* Tertiary: Reset — ghost text link, appears inline */}
          {(deletedIds.size > 0) && (
            <button className="showcase-btn ghost small" onClick={handleReset}>
              ↺ Restore
            </button>
          )}
          <button className="showcase-btn ghost small" onClick={handleReset}>
            Reset
          </button>

          {/* Primary: Edit Layout — the demo's superpower */}
          <button
            className={`showcase-btn${editMode ? " active" : " primary-outline"}`}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "✓ Done" : "⊞ Edit Layout"}
          </button>

          {/* Secondary: Get Code (view + download) */}
          <button className="showcase-btn accent" onClick={() => setCodeOpen((v) => !v)}>
            {codeOpen ? "Hide Code" : "Get Code ↓"}
          </button>
        </div>
      </div>

      {/* ── Preset description bar ───────────────────── */}
      <div className="showcase-desc">
        <span className="showcase-desc-label">{currentPreset.label}</span>
        {" — "}
        {currentPreset.description}
        {editMode && (
          <span className="showcase-edit-hint"> · Drag to reposition · resize from corners · ✕ to delete</span>
        )}
        <span className="showcase-widget-count">{activeWidgets.length} widgets</span>
      </div>

      {/* ── Dashboard Canvas ─────────────────────────── */}
      <div className="showcase-canvas-wrap">
        <div className="showcase-canvas-scroll">
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
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
              src/Dashboard.tsx
            </span>
            {" "}— replace{" "}
            <code style={{ fontFamily: "var(--font-mono)", background: "var(--accent-subtle)", padding: "1px 5px", borderRadius: 3 }}>
              data={`{[]}`}
            </code>
            {" "}with real data
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CopyButton text={generatedCode} />
            <button className="showcase-btn small" onClick={handleDownload}>
              ↓ Full Project ZIP
            </button>
            <button
              className="showcase-btn ghost small"
              onClick={() => setCodeOpen(false)}
              aria-label="Close code panel"
            >
              ✕
            </button>
          </div>
        </div>
        <pre className="showcase-code-pre"><code>{generatedCode}</code></pre>
      </div>
    </div>
  );
}
