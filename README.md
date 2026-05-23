# dashcraft

[![CI](https://github.com/Nishant-Chaudhary5338/dashcraft/actions/workflows/ci.yml/badge.svg)](https://github.com/Nishant-Chaudhary5338/dashcraft/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@dashcraft/core)](https://www.npmjs.com/package/@dashcraft/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Headless React dashboard library. Five boolean props. Your styles.**

dashcraft gives you drag-and-drop grids, resizable widgets, KPI cards, recharts + nivo charts, persistent layouts, and an MCP codegen server — without touching your design system.

→ **[Live site & playground](https://dashcraft.digitribe.world)** · [Docs](https://dashcraft.digitribe.world/docs) · [npm](https://www.npmjs.com/package/@dashcraft/core)

---

## Why dashcraft?

| Pain | dashcraft |
|---|---|
| Every dashboard library forces its design system | Fully headless — bring Tailwind, CSS Modules, or nothing |
| Wiring recharts to drag-drop takes days | `drag resize settings delete` — four props, done |
| AI tools don't know your component API | `llms.txt` + MCP codegen server built in |
| Saving layouts is a custom build every time | `persist="key"` — one prop, localStorage automatic |

---

## Install

```sh
npm install @dashcraft/core

# Optional chart peer deps
npm install recharts
npm install @nivo/core @nivo/heatmap @nivo/treemap @nivo/sunburst
```

---

## Quick start

```tsx
import { Dashboard, DashboardCard, KPIWidget, RechartsWidget } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

const data = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 18200 },
]

export function SalesDashboard() {
  return (
    <Dashboard id="sales" persist="sales-v1">
      <DashboardCard
        id="revenue"
        drag resize settings
        style={{ gridColumn: '1 / span 4', gridRow: '1 / span 2' }}
      >
        <KPIWidget title="Revenue" value={46200} format="currency" previousValue={38000} />
      </DashboardCard>

      <DashboardCard
        id="chart"
        drag resize settings delete
        style={{ gridColumn: '5 / span 8', gridRow: '1 / span 4' }}
      >
        <RechartsWidget
          title="Monthly Revenue"
          chartType="bar"
          data={data}
          series={[{ key: 'revenue', name: 'Revenue', color: '#6366f1' }]}
          xAxisKey="month"
        />
      </DashboardCard>
    </Dashboard>
  )
}
```

---

## The boolean API

Every interactive behaviour is a single boolean prop on `DashboardCard`:

| Prop | What it does |
|---|---|
| `drag` | Enables drag-and-drop via @dnd-kit |
| `resize` | Shows resize handles |
| `settings` | Shows settings gear icon |
| `delete` | Shows delete button |
| `responsive` | Enables responsive breakpoints |

No config objects. No verbose prop names. Just booleans.

---

## Components

| Component | Purpose |
|---|---|
| `<Dashboard>` | Root grid container, manages state + persistence |
| `<DashboardCard>` | Widget wrapper with all behaviour props |
| `<KPIWidget>` | Metric card with trend indicators |
| `<RechartsWidget>` | recharts (bar, line, area, pie, scatter, radar) |
| `<NivoWidget>` | @nivo (heatmap, treemap, sunburst) |

---

## Hooks

| Hook | Purpose |
|---|---|
| `useDashboard(id)` | Access state, toggle edit mode |
| `useWidgetData(id)` | Push live data into widgets |
| `useWidgetEvents(id)` | Subscribe to settings/delete/resize/drag events |
| `usePersistence(key)` | Manual save/restore with custom storage |
| `useDraggable(id)` | Raw @dnd-kit drag state |
| `useResize(id)` | Raw resize state |

---

## AI-native

dashcraft is built to work with AI tools out of the box:

- **`llms.txt`** at [`/llms.txt`](https://dashcraft.digitribe.world/llms.txt) — machine-readable API reference any LLM can fetch
- **`AGENTS.md`** at [`/AGENTS.md`](https://dashcraft.digitribe.world/AGENTS.md) — full agent guide for code generation
- **MCP server** — `@dashcraft/mcp-codegen` for Claude Desktop, Cursor, and any MCP client

### MCP setup

```sh
npm install -g @dashcraft/mcp-codegen
```

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "dashcraft": {
      "command": "dashcraft-mcp"
    }
  }
}
```

Tools: `analyze_dashboard` · `generate_code` · `generate_project`

---

## Monorepo structure

```
packages/
  core/           @dashcraft/core — the React library
apps/
  site/           Product site (Next.js 15)
tools/
  codegen/        @dashcraft/mcp-codegen — MCP server
```

---

## Development

```sh
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Start just the site
pnpm --filter @dashcraft/site dev

# Build the library
pnpm --filter @dashcraft/core build

# Run library tests
pnpm --filter @dashcraft/core test
```

Requires Node.js 20+, pnpm 9+.

---

## Contributing

Contributions are very welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Short version:
1. Fork → branch → code
2. `pnpm --filter @dashcraft/core build` must pass
3. `pnpm --filter @dashcraft/core test` must pass
4. Open a PR with the checklist filled out

---

## License

MIT © [Nishant Chaudhary](https://github.com/Nishant-Chaudhary5338)
