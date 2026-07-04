"use client";

import type { KPIFormat } from "dashcraft-core/widgets/kpi";
import type { PlaygroundWidget } from "./widgetKit";

const TOGGLES: readonly { key: "drag" | "resize" | "settings" | "delete"; label: string }[] = [
  { key: "drag", label: "Draggable" },
  { key: "resize", label: "Resizable" },
  { key: "settings", label: "Settings" },
  { key: "delete", label: "Deletable" },
];

function Toggle({ label, prop, checked, onChange }: { label: string; prop: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="config-toggle-row">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="config-label">{label}</span>
        <span className="config-prop-tag">{prop}</span>
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-track" />
        <span className="toggle-thumb" />
      </label>
    </div>
  );
}

interface Props {
  widgets: PlaygroundWidget[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPatch: (patch: Partial<PlaygroundWidget>) => void;
  onClose?: () => void;
}

/** Right rail: pick a widget, then edit its title, boolean API, and KPI format. */
export function ConfigPanel({ widgets, selectedId, onSelect, onPatch, onClose }: Props): React.ReactElement {
  const selected = widgets.find((w) => w.id === selectedId) ?? null;

  return (
    <div className="playground-config">
      <div className="pg-panel-head">
        <span className="config-heading" style={{ margin: 0 }}>Configure</span>
        {onClose && (
          <button className="pg-collapse" title="Close" aria-label="Close config" onClick={onClose}>✕</button>
        )}
      </div>
      <div style={{ padding: "12px 16px 16px" }}>
        <p className="config-heading">Widgets on canvas</p>
        {widgets.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "8px 0 0" }}>
            Add a widget from the left, then drag it on the canvas to arrange.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 }}>
            {widgets.map((w) => (
              <button
                key={w.id}
                onClick={() => onSelect(w.id)}
                className={`config-widget-row${selectedId === w.id ? " selected" : ""}`}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {w.type.replace(/_/g, " ")}
                </span>
                <span style={{ fontSize: "0.82rem" }}>{w.title}</span>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <>
            <p className="config-heading" style={{ marginTop: 4 }}>Config</p>
            <div style={{ marginBottom: 16 }}>
              <label className="config-field-label">Title</label>
              <input
                type="text"
                value={selected.title}
                onChange={(e) => onPatch({ title: e.target.value })}
                className="config-input"
              />
            </div>

            {TOGGLES.map((t) => (
              <Toggle
                key={t.key}
                label={t.label}
                prop={t.key}
                checked={selected[t.key]}
                onChange={(v) => onPatch({ [t.key]: v })}
              />
            ))}

            {selected.type === "kpi" && (
              <div style={{ marginTop: 16 }}>
                <label className="config-field-label">Format</label>
                <select
                  value={selected.format}
                  onChange={(e) => onPatch({ format: e.target.value as KPIFormat })}
                  className="config-input"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <option value="number">number</option>
                  <option value="currency">currency</option>
                  <option value="percentage">percentage</option>
                </select>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
