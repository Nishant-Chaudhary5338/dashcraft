# AGENTS.md — dashcraft

This file tells AI agents how to work with the dashcraft ecosystem.

## Repository Layout

```
packages/core/          @dashcraft/core — the React library
apps/site/              Product site (Next.js 15)
tools/codegen/          @dashcraft/mcp-codegen MCP server
```

## Key Files for AI Agents

| File | Purpose |
|------|---------|
| `packages/core/src/index.ts` | All public exports |
| `packages/core/src/types/widget.types.ts` | TypeScript interfaces |
| `packages/core/src/components/Dashboard.tsx` | Root container |
| `packages/core/src/components/DashboardCard.tsx` | Widget wrapper |
| `packages/core/src/components/widgets/KPIWidget.tsx` | Metric card |
| `packages/core/src/components/widgets/RechartsWidget.tsx` | recharts wrapper |
| `packages/core/src/components/widgets/NivoWidget.tsx` | nivo wrapper |

## How to Generate a Dashboard

1. Install: `npm install @dashcraft/core recharts`
2. Import styles: `import '@dashcraft/core/styles.css'`
3. Wrap with `<Dashboard>`, add `<DashboardCard>` children
4. Each card takes boolean props: `drag resize settings delete`
5. Nest a widget component inside each card

## Complete Example

```tsx
import { Dashboard, DashboardCard, KPIWidget, RechartsWidget } from '@dashcraft/core'
import '@dashcraft/core/styles.css'

const data = [
  { month: 'Jan', revenue: 12400, expenses: 8200 },
  { month: 'Feb', revenue: 15600, expenses: 9100 },
  { month: 'Mar', revenue: 18200, expenses: 11400 },
]

export function SalesDashboard() {
  return (
    <Dashboard id="sales" persist="sales-v1">
      <DashboardCard
        id="total-revenue"
        drag resize settings
        style={{ gridColumn: '1 / span 3', gridRow: '1 / span 2' }}
      >
        <KPIWidget
          title="Total Revenue"
          value={46200}
          format="currency"
          previousValue={38000}
        />
      </DashboardCard>

      <DashboardCard
        id="monthly-chart"
        drag resize settings delete
        style={{ gridColumn: '4 / span 9', gridRow: '1 / span 4' }}
      >
        <RechartsWidget
          title="Monthly Revenue vs Expenses"
          chartType="bar"
          data={data}
          series={[
            { key: 'revenue', name: 'Revenue', color: '#6366f1' },
            { key: 'expenses', name: 'Expenses', color: '#f43f5e' },
          ]}
          xAxisKey="month"
        />
      </DashboardCard>
    </Dashboard>
  )
}
```

## Using the MCP Server

```bash
# Install
npm install -g @dashcraft/mcp-codegen

# Register with Claude Desktop — add to claude_desktop_config.json:
{
  "mcpServers": {
    "dashcraft": {
      "command": "dashcraft-mcp"
    }
  }
}
```

### MCP Tools

**`analyze_dashboard`** — Vision analysis of a screenshot
```json
{
  "imageSource": "/path/to/screenshot.png"
}
```
Returns: Array of detected widgets with types, positions, and dashcraft component mappings.

**`generate_code`** — TSX code from widget config
```json
{
  "widgets": [...],
  "componentName": "MyDashboard"
}
```
Returns: Valid `@dashcraft/core` TSX source.

**`generate_project`** — Full Vite project
```json
{
  "widgets": [...],
  "projectName": "my-dashboard"
}
```
Returns: Base64-encoded zip of a complete, runnable Vite + React project.

## Coding Conventions

- Widget IDs must be unique within a Dashboard
- `persist` prop should be versioned (`"key-v1"`) to reset layout on schema changes
- Styles are unstyled by default — add `className` to `DashboardCard` for custom styling
- All widgets accept `className` and `style` props for customization
- TypeScript strict mode — all props are fully typed

## Running Tests

```bash
cd packages/core
pnpm test
```

## Contributing

PRs welcome. See GitHub for contribution guide.
