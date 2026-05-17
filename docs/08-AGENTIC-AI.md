# DashCraft Agentic AI Integration

## Vision

Make DashCraft the best library for **AI-generated dashboards**. An AI agent should be able to create production-grade dashboards from a simple prompt.

---

## AI-Friendly Design Principles

### 1. JSON-Serializable Everything
All configurations must be serializable to JSON. No React nodes in configs.

```tsx
// ✅ GOOD - JSON serializable
const widget: WidgetSchema = {
  id: "sales-chart",
  type: "bar",
  title: "Monthly Sales",
  dataSource: { endpoint: "/api/sales" }
};

// ❌ BAD - React nodes not serializable
const widget = {
  id: "sales-chart",
  content: <BarChart data={data} />  // Can't serialize!
};
```

### 2. Declarative Configuration
AI defines WHAT, not HOW.

```tsx
// ✅ GOOD - Declarative
{
  type: "bar",
  dataSource: { endpoint: "/api/sales", pollingInterval: 30000 }
}

// ❌ BAD - Imperative
// AI would have to write React code
```

### 3. Sensible Defaults
AI shouldn't need to specify every property.

```tsx
// ✅ GOOD - Minimal config
{ id: "chart-1", type: "bar" }

// All other properties have defaults:
// - draggable: true
// - resizable: true
// - deletable: true
// - size: { width: 400, height: 300 }
```

### 4. Template Presets
Common dashboard patterns as templates.

```tsx
// AI can request a template
const dashboard = createDashboard("analytics");
// Or "monitoring", "sales", "executive"
```

---

## Schema Types

### DashboardSchema
```typescript
interface DashboardSchema {
  id?: string;
  title?: string;
  layout?: "grid" | "flex" | "free";
  columns?: number;
  gap?: number;
  widgets: WidgetSchema[];
  settings?: {
    theme?: "light" | "dark";
    persistenceKey?: string;
    defaultEditMode?: boolean;
  };
}
```

### WidgetSchema
```typescript
interface WidgetSchema {
  id: string;
  type: "bar" | "line" | "area" | "pie" | "kpi" | "table" | "custom";
  title?: string;
  colSpan?: number;           // For grid layouts
  rowSpan?: number;           // For grid layouts
  gridPosition?: {            // For absolute positioning
    col: number;
    row: number;
  };
  size?: {
    width: number;
    height: number;
  };
  draggable?: boolean;        // Default: true
  resizable?: boolean;        // Default: true
  deletable?: boolean;        // Default: true
  settings?: {
    theme?: "light" | "dark";
    highlight?: boolean;
    highlightColor?: string;
    pollingInterval?: number;
  };
  dataSource?: {
    endpoint: string;
    method?: "GET" | "POST";
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    pollingInterval?: number;
    transform?: string;       // JS code to transform response
  };
}
```

---

## Factory Functions

### createDashboard
```typescript
function createDashboard(
  schema: DashboardSchema
): {
  schema: DashboardSchema;
  toJSON: () => string;
  toJSX: () => string;
  addWidget: (widget: WidgetSchema) => DashboardSchema;
  removeWidget: (id: string) => DashboardSchema;
  setTheme: (theme: "light" | "dark") => DashboardSchema;
}
```

### createWidget
```typescript
function createWidget(
  type: WidgetSchema["type"],
  options?: Partial<WidgetSchema>
): WidgetSchema
```

### createFromTemplate
```typescript
function createFromTemplate(
  template: "analytics" | "monitoring" | "sales" | "executive"
): DashboardSchema
```

---

## AI Usage Examples

### Simple Dashboard from Prompt

**Prompt:** "Create a sales dashboard with revenue KPI, monthly sales chart, and top products table"

**AI Output:**
```json
{
  "title": "Sales Dashboard",
  "layout": "grid",
  "columns": 3,
  "widgets": [
    {
      "id": "revenue-kpi",
      "type": "kpi",
      "title": "Total Revenue",
      "colSpan": 1,
      "settings": {
        "theme": "light",
        "highlight": true
      },
      "dataSource": {
        "endpoint": "/api/revenue"
      }
    },
    {
      "id": "monthly-sales",
      "type": "bar",
      "title": "Monthly Sales",
      "colSpan": 2,
      "dataSource": {
        "endpoint": "/api/sales/monthly",
        "pollingInterval": 30000
      }
    },
    {
      "id": "top-products",
      "type": "table",
      "title": "Top Products",
      "colSpan": 3,
      "dataSource": {
        "endpoint": "/api/products/top"
      }
    }
  ]
}
```

### From Template

**Prompt:** "Give me a monitoring dashboard"

**AI Output:**
```json
{
  "title": "System Monitoring",
  "widgets": [
    {
      "id": "cpu-usage",
      "type": "line",
      "title": "CPU Usage",
      "dataSource": {
        "endpoint": "/api/metrics/cpu",
        "pollingInterval": 5000
      }
    },
    {
      "id": "memory-usage",
      "type": "line",
      "title": "Memory Usage",
      "dataSource": {
        "endpoint": "/api/metrics/memory",
        "pollingInterval": 5000
      }
    },
    {
      "id": "active-alerts",
      "type": "kpi",
      "title": "Active Alerts",
      "settings": { "highlight": true },
      "dataSource": {
        "endpoint": "/api/alerts/count",
        "pollingInterval": 10000
      }
    }
  ]
}
```

---

## DashboardFromSchema Component

```tsx
import { DashboardFromSchema } from '@repo/dashcraft';

function AIGeneratedDashboard() {
  const schema: DashboardSchema = {
    // AI-generated JSON
  };

  return <DashboardFromSchema schema={schema} />;
}
```

This component:
1. Takes a DashboardSchema
2. Creates a Dashboard with proper config
3. Maps widget types to components
4. Connects data sources
5. Renders the complete dashboard

---

## Context for AI Agents

When building dashboards with AI, provide this context:

```
You are using @repo/dashcraft, a headless React dashboard library.

Key concepts:
- Dashboard: Context provider, doesn't control layout
- DashboardCard: Headless wrapper for any component
- Widgets: Pre-built wrappers (RechartsWidget, KPIWidget)
- Schema: JSON-serializable config for AI generation

Widget types available: bar, line, area, pie, kpi, table, custom

Features per widget:
- draggable: Can be dragged (default: true)
- resizable: Can be resized (default: true)
- deletable: Can be deleted (default: true)
- settings: Theme, highlight, endpoint, polling
- viewBreakpoints: Different components at different sizes
- dataSource: Built-in HTTP client with polling

Use DashboardSchema for JSON-serializable configs.
Use factory functions for programmatic creation.