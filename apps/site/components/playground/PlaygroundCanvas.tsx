"use client";

import "dashcraft-core/styles.css";
import { Dashboard } from "dashcraft-core";
import { renderWidget, type PlaygroundWidget } from "./widgetKit";

const CANVAS_WIDTH = 1160;

/** Wrapper component so each real widget gets a stable React key under Dashboard. */
function WidgetView({ w, onDelete }: { w: PlaygroundWidget; onDelete: (id: string) => void }) {
  return renderWidget(w, onDelete);
}

/**
 * The live playground canvas — the ACTUAL dashcraft-core `Dashboard` in edit
 * mode. Widgets are real, data-bound components; drag + resize + delete work
 * exactly as they will in the user's own app (this is the dogfood surface).
 */
export function PlaygroundCanvas({
  widgets,
  onDelete,
  onSelect,
  selectedId,
  preview = false,
}: {
  widgets: PlaygroundWidget[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
  preview?: boolean;
}): React.ReactElement {
  return (
    <div
      style={{ position: "relative", width: CANVAS_WIDTH, minHeight: 560, margin: "0 auto" }}
      onClickCapture={preview ? undefined : (e) => {
        const el = (e.target as HTMLElement).closest("[data-widget-id]");
        const id = el?.getAttribute("data-widget-id");
        if (id) onSelect(id);
      }}
    >
      {/* Highlight the selected widget — click any widget to configure it. */}
      {selectedId && (
        <style>{`[data-widget-id="${selectedId}"]{outline:2px solid var(--accent);outline-offset:3px;border-radius:14px;}`}</style>
      )}
      <Dashboard defaultEditMode style={{ width: CANVAS_WIDTH, minHeight: 560 }}>
        {widgets.map((w) => (
          <WidgetView key={w.id} w={w} onDelete={onDelete} />
        ))}
      </Dashboard>
    </div>
  );
}
