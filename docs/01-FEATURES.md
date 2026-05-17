# DashCraft Features

## Core Features (Phase 1-5)

### 1. Dashboard Context Provider
- Provides state management via React Context
- Tracks all widget states (position, size, settings, z-index)
- Exposes actions (add, remove, update, bring-to-front)
- Supports edit mode toggle
- Headless - doesn't control layout

### 2. DashboardCard (Headless Core)
- Wraps ANY React component with interactive features
- Configurable: draggable, resizable, deletable, settings
- Responsive content via view breakpoints
- View cycler button to switch between breakpoint views
- Smooth animations on mount/unmount/drag/resize (framer-motion)
- Components: DashboardCard, DashboardCardHeader, DashboardCardDragHandle, DashboardCardViewCycler, WidgetActions

### 3. Drag & Drop
- Free-form dragging (no grid snapping)
- Uses @dnd-kit for accessibility
- Visual drag at 60fps via @dnd-kit internals; store update only on drag end
- Works with mouse, touch, keyboard
- Bring-to-front on drag start

### 4. Resize System
- 8-direction resize handles (n, ne, e, se, s, sw, w, nw)
- Free-form resize (no snapping)
- Min/max size constraints
- Debounced updates (150ms)
- Uses re-resizable

### 5. View Cycler
- Button in widget header
- Cycles through defined breakpoints: initial → 300 → 600 → 900 → initial
- Smooth animated size transitions (framer-motion)
- Content switches based on current breakpoint

### 6. Widget Settings
- Settings button opens Radix Popover
- Theme selector (light/dark/custom) — SettingsThemeSection
- Highlight toggle + color picker — SettingsHighlightSection
- Endpoint input with test button — SettingsEndpointSection
- Polling interval slider — SettingsPollingSection
- Custom fields support — SettingsCustomFields
- Settings persist in widget state
- Components: SettingsPanel, SettingsHeader

### 7. Built-in HTTP Client
- `useWidgetData` hook
- Configurable endpoint, method, headers, body
- Auto-polling with configurable interval
- Loading/error states
- Refetch and cancel functions
- Works with settings panel endpoint

### 8. Persistence
- Save/load layouts to localStorage
- Custom adapter support via `PersistenceAdapter` interface
- Auto-save with configurable delay
- `usePersistence` hook with save/load/clear/reset/isDirty
- `usePersistedState` simplified hook (useState-like)
- Layout includes positions, sizes, settings, z-indices

### 9. Z-Index Management
- Global counter in Zustand store
- Click brings widget to front
- Configurable stacking behavior

### 10. Animations (framer-motion)
- Mount: fade in + scale up (spring)
- Unmount: fade out + scale down
- Drag: scale up + shadow
- Resize: smooth size transition
- Settings: slide + fade
- View cycler: smooth width/height animation

---

## Pre-built Widget Wrappers (Phase 8) ✅ Complete

### RechartsWidget
- DashboardCard + Recharts integration
- Chart types: bar, line, area, pie, scatter, radar, radialBar
- Auto-color assignment from palette
- Configurable: legend, tooltip, grid, animation
- Individual chart components also exportable

### KPIWidget
- DashboardCard + KPI display
- Shows value, label, trend (up/down/neutral with icons)
- Formatting: number, currency, percentage, text
- Auto-trend calculation from previousValue
- Icon support, value color override
- Background gradient option

### NivoWidget
- DashboardCard + Nivo integration
- Chart types: heatmap, treemap, sunburst
- Nivo color scheme support
- Optional peer dependency (@nivo/core, @nivo/heatmap, @nivo/treemap, @nivo/sunburst)

---

## Widget Registry

- Central singleton registry for widget type registration
- Register/unregister widget types with metadata
- Search by category or tags
- Hooks: `useWidgetRegistration`, `useWidgetRegistrations`, `useWidgetRegistrationsByCategory`
- Enables dynamic widget discovery and creation

---

## Agentic AI Features (Phase 8)

### JSON Schema
- `DashboardSchema` - full dashboard config
- `WidgetSchema` - widget config
- `DataSourceSchema` - API data source
- All JSON-serializable

### Templates
- Predefined dashboard templates
- Analytics, monitoring, sales, executive

### Factory Functions
- `createDashboard()` - build from schema
- `addWidget()`, `removeWidget()` - modify
- `toJSON()`, `toJSX()` - export

---

## Future Features

### Collision Detection
- Detect overlapping widgets
- Visual indicators

### Pushback System
- Auto-push widgets on overlap
- Configurable behavior

### Gesture Support
- Pinch to resize
- Rotate on mobile
- Two-finger drag

### Keyboard Navigation
- Tab through widgets
- Arrow keys to move
- Enter to select