# dashcraft-core

[![npm version](https://img.shields.io/npm/v/dashcraft-core)](https://www.npmjs.com/package/dashcraft-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-C2FF3D.svg)](https://opensource.org/licenses/MIT)

**Headless React dashboard engine.** Drag-and-drop grids, resizable widgets, KPI cards, recharts-backed charts, and persistent layouts — with a boolean prop API and **zero visual opinions**. Bring your own styles.

→ **[Live playground](https://dashcraft.digitribe.world/playground)** · **[Docs](https://dashcraft.digitribe.world/docs)** · **[Templates](https://dashcraft.digitribe.world/showcase)**

```bash
npm install dashcraft-core
```

## Quick start

Widgets render their own card, so you drop them straight into a `<Dashboard>` and position them with `defaultPosition` / `defaultSize`:

```tsx
import { Dashboard } from "dashcraft-core";
import { KPIWidget } from "dashcraft-core/widgets/kpi";
import { RechartsWidget } from "dashcraft-core/widgets/recharts";
import "dashcraft-core/styles.css";

export function SalesDashboard() {
  return (
    <Dashboard persistenceKey="sales" defaultEditMode>
      <KPIWidget
        id="revenue"
        label="Revenue"
        value={124500}
        previousValue={98000}
        format="currency"
        drag resize
        defaultPosition={{ x: 0, y: 0 }}
        defaultSize={{ width: 280, height: 130 }}
      />
      <RechartsWidget
        id="trend"
        title="Monthly Sales"
        chartType="bar"
        data={data}
        series={[{ dataKey: "value", name: "Sales", color: "#C2FF3D" }]}
        xAxisKey="month"
        drag resize
        defaultPosition={{ x: 296, y: 0 }}
        defaultSize={{ width: 560, height: 320 }}
      />
    </Dashboard>
  );
}
```

## The boolean API

Every widget/card takes the same feature flags — all default to `true` in edit mode:

| Prop | What it enables |
|---|---|
| `drag` | Reposition the widget (drag handle) |
| `resize` | Corner grips — defaults to **both** bottom corners so edge-anchored widgets always have a reachable grip |
| `delete` | Remove affordance |
| `settings` | Built-in settings panel (or pass a `ReactNode` for a custom one) |

Extras: `viewSizes` + `snapOnDoubleClick` cycle a widget through preset sizes on double-click; `persistenceKey` saves the layout to storage.

## Widgets

- **`KPIWidget`** — metric cards (`format`: `currency` · `percentage` · `number`), trend deltas.
- **`RechartsWidget`** — `chartType`: `bar` · `line` · `area` · `pie` · `scatter` · `radar`.
- **`HierarchyWidget`** — `chartType`: `heatmap` · `treemap` · `sunburst`.

All are headless: layout & behaviour are provided, visuals are yours.

## Headless by design

`dashcraft-core` ships behaviour, not a look. Style it with Tailwind, CSS variables, CSS Modules — or nothing. Your design system always wins.

## AI / MCP

Turn a **screenshot into code** with the companion MCP server [`dashcraft-mcp-codegen`](https://www.npmjs.com/package/dashcraft-mcp-codegen), or build visually in the [playground](https://dashcraft.digitribe.world/playground) and export a full Vite project.

## License

MIT © Nishant Chaudhary
