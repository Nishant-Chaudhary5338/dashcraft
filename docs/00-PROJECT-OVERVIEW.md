# DashCraft - Interactive Dashboard Library

## What is DashCraft?

DashCraft is a **headless, developer-friendly React library** for building interactive dashboards. It provides powerful dashboard features (drag, resize, settings, persistence) while giving developers **full control over layout and styling**.

**Tagline:** *"Craft dashboards, not headaches"*

---

## Core Philosophy

### Headless First
- Dashboard component is a **state provider**, NOT a layout container
- Developers use **any layout** they want (grid, flex, absolute, CSS Grid, etc.)
- All interactive features are provided through **React Context**
- Widget component wraps ANY React component with interactive features

### Three-Level API
1. **Level 1: DashboardCard** - Headless wrapper for ANY component (most flexible)
2. **Level 2: Pre-built Widgets** - DashboardCard + chart libraries (convenience)
3. **Level 3: Direct Usage** - Use chart libraries directly inside DashboardCard (full control)

### Agentic AI Ready
- JSON-serializable schemas for AI-generated dashboards
- `DashboardSchema` and `WidgetSchema` types for declarative config
- Factory functions for programmatic dashboard creation
- Template presets for quick generation

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Drag & Drop** | Free-form dragging using @dnd-kit |
| **Resize (8-direction)** | Free-form resize using re-resizable |
| **View Cycler** | Button to cycle through breakpoint views |
| **Delete Widget** | Remove widgets with confirmation |
| **Add Widget** | Dynamically add widgets |
| **Settings Menu** | Theme, highlight, endpoint, polling, custom fields |
| **Built-in HTTP Client** | Fetch + polling with auto-refresh |
| **Persistence** | Save/load layouts (localStorage + custom adapters) |
| **Responsive Content** | Different components at different widget sizes |
| **Z-Index Management** | Click-to-front stacking |
| **Smooth Animations** | Mount, drag, resize, settings (framer-motion) |
| **Multiple Entry Points** | Tree-shaking optimized imports |

---

## Package Name

`@repo/dashcraft`

---

## Dependencies

### Core
- `zustand` - State management
- `@dnd-kit/core` + `@dnd-kit/sortable` - Drag & drop
- `re-resizable` - Resize
- `framer-motion` - Animations
- `@radix-ui/*` - Accessible UI primitives

### Optional Peer Dependencies
- `recharts` - Chart library (optional)
- `nivo` - Chart library (optional)

---

## Project Location

```
packages/dashcraft/
```

Within the monorepo at `/Users/nishantchaudhary/Desktop/my-turborepo`