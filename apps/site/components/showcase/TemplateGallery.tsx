"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRESETS, type Preset, type PresetKey } from "./presets";
import { TemplatePoster } from "./TemplatePoster";
import type { PlaygroundWidget } from "@/components/playground/widgetKit";

const PRESET_KEYS = Object.keys(PRESETS) as PresetKey[];
const THEMES = ["default", "brutalist", "glass"] as const;
type Theme = (typeof THEMES)[number];
export const PRESET_STORE = "dc-playground-preset";

/** Convert a showcase preset into playground widgets (layout + types + titles). */
function presetToPlayground(preset: Preset): PlaygroundWidget[] {
  return preset.widgets.map((w) => ({
    id: w.id,
    type: w.kind === "kpi" ? "kpi" : (`${w.chartType}_chart` as PlaygroundWidget["type"]),
    title: w.title,
    drag: true,
    resize: true,
    settings: false,
    delete: true,
    format: w.kind === "kpi" ? w.format : "number",
    defaultPosition: w.defaultPosition,
    defaultSize: w.defaultSize,
  }));
}

function TemplateCard({ preset, theme, onOpen }: { preset: Preset; theme: Theme; onOpen: () => void }) {
  return (
    <article className="tpl-card">
      <div className={`tpl-poster-frame tpl-theme-${theme}`}>
        <TemplatePoster preset={preset} />
      </div>
      <div className="tpl-card-body">
        <h3 className="font-display text-lg font-bold tracking-[-0.02em]">{preset.label}</h3>
        <p className="mt-1 text-[0.85rem] leading-snug text-[var(--text-muted)]">{preset.description}</p>
        <div className="mt-4">
          <button onClick={onOpen} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
            Open in Playground →
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Templates Gallery — prebuilt dashboards as lightweight posters. Each opens in
 * the playground (real widgets) or reveals its generated code. The theme filter
 * re-skins every poster from the SAME markup, proving the headless story.
 */
export function TemplateGallery(): React.ReactElement {
  const [theme, setTheme] = useState<Theme>("default");
  const router = useRouter();

  const open = (key: PresetKey) => {
    try {
      localStorage.setItem(PRESET_STORE, JSON.stringify(presetToPlayground(PRESETS[key])));
    } catch { /* ignore */ }
    router.push("/playground");
  };

  return (
    <section className="section">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">// Templates</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em]">Start from a real dashboard.</h2>
          </div>
          <div className="tab-list" role="tablist" aria-label="Preview theme">
            {THEMES.map((t) => (
              <button key={t} role="tab" aria-selected={theme === t} onClick={() => setTheme(t)} className={`tab-btn${theme === t ? " active" : ""}`} style={{ textTransform: "capitalize" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRESET_KEYS.map((key) => (
            <TemplateCard key={key} preset={PRESETS[key]} theme={theme} onOpen={() => open(key)} />
          ))}
        </div>
      </div>
    </section>
  );
}
