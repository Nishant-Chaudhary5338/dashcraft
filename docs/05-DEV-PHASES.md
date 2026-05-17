# DashCraft Development Phases

## Testing Strategy Per Phase

After EACH phase:
1. Import the new feature into `apps/web/web-app-2/`
2. Create a test page that exercises the feature
3. Run MCP tools to check:
   - Re-render count (render-analyzer)
   - Memory leaks (performance-audit)
   - TypeScript violations (typescript-enforcer)
   - Accessibility (accessibility-checker)
4. Manual testing: drag, resize, resize window, test edge cases
5. Only proceed to next phase when current phase passes all checks

---

## Phase 1: Core Foundation

**Goal:** Dashboard context, store, types, basic shell

| # | Task | Status | Test |
|---|------|--------|------|
| 1.1 | Create package structure | ✅ Done | Verify folder structure |
| 1.2 | Create package.json | ✅ Done | pnpm install works |
| 1.3 | Create tsconfig.json | ✅ Done | TypeScript compiles |
| 1.4 | Define all TypeScript types | ✅ Done | No TS errors |
| 1.5 | Create Zustand store | ✅ Done | Store works |
| 1.6 | Create store barrel export | ✅ Done | Import works |
| 1.7 | Create Dashboard context | ✅ Done | Context defined |
| 1.8 | Create Dashboard component | ✅ Done | Renders children |
| 1.9 | Create useDashboard hook | ✅ Done | Hook returns context |
| 1.10 | Write tests | ☐ Pending | All pass |

---

## Phase 2: DashboardCard (Headless Core)

**Goal:** Card component with header, settings, view cycler, responsive

| # | Task | Status | Test |
|---|------|--------|------|
| 2.1 | Create DashboardCard shell | ✅ Done | Renders children |
| 2.2 | Create DashboardCardHeader | ✅ Done | Shows title, actions |
| 2.3 | Create DashboardCardSettings | ✅ Done | Settings popover |
| 2.4 | Create DashboardCardViewCycler | ✅ Done | Cycles views |
| 2.5 | Create useResponsive hook | ✅ Done | Breakpoint switching |
| 2.6 | Integrate responsive content | ✅ Done | Content changes |
| 2.7 | Add framer-motion animations | ✅ Done | Smooth animations |
| 2.8 | Write tests | ☐ Pending | All pass |

---

## Phase 3: Drag & Drop

**Goal:** Free-form dragging with @dnd-kit

| # | Task | Status | Test |
|---|------|--------|------|
| 3.1 | Install @dnd-kit | ✅ Done | Dependencies installed |
| 3.2 | Integrate DndContext | ✅ Done | Context wraps children |
| 3.3 | Add useDraggable to card | ✅ Done | Card is draggable |
| 3.4 | Handle drag events | ✅ Done | Position updates |
| 3.5 | Throttle drag (16ms) | ✅ Done | @dnd-kit handles 60fps internally; store update only on drag end |
| 3.6 | Update store on drag | ✅ Done | State persists |
| 3.7 | Write tests | ☐ Pending | All pass |

---

## Phase 4: Resize System

**Goal:** 8-direction free-form resize

| # | Task | Status | Test |
|---|------|--------|------|
| 4.1 | Install re-resizable | ✅ Done | Dependencies installed |
| 4.2 | Create resize handles | ✅ Done | 8 handles visible |
| 4.3 | Integrate with card | ✅ Done | Card is resizable |
| 4.4 | Debounce resize (150ms) | ✅ Done | Smooth updates |
| 4.5 | Update store on resize | ✅ Done | State persists |
| 4.6 | Write tests | ☐ Pending | All pass |

---

## Phase 5: HTTP Client

**Goal:** Built-in data fetching with polling

| # | Task | Status | Test |
|---|------|--------|------|
| 5.1 | Create http-client utility | ✅ Done | Fetch works |
| 5.2 | Create useWidgetData hook | ✅ Done | Data loads |
| 5.3 | Add polling support | ✅ Done | Auto-refresh works |
| 5.4 | Write tests | ☐ Pending | All pass |

---

## Phase 6: Persistence

**Goal:** Save/load layouts

| # | Task | Status | Test |
|---|------|--------|------|
| 6.1 | Create persistence utils | ✅ Done | localStorageAdapter works |
| 6.2 | Create usePersistence hook | ✅ Done | Full hook with save/load/clear/autoSave/usePersistedState |
| 6.3 | Integrate with Dashboard | ✅ Done | Auto-save works via `autoSave` prop |
| 6.4 | Write tests | ☐ Pending | All pass |

---

## Phase 7: Settings System

**Goal:** Widget settings with theme, highlight, endpoint

| # | Task | Status | Test |
|---|------|--------|------|
| 7.1 | Create settings UI components | ✅ Done | SettingsPanel, SettingsHeader, SettingsCustomFields |
| 7.2 | Theme selector | ✅ Done | SettingsThemeSection |
| 7.3 | Highlight toggle + color | ✅ Done | SettingsHighlightSection |
| 7.4 | Endpoint input | ✅ Done | SettingsEndpointSection |
| 7.5 | Polling interval slider | ✅ Done | SettingsPollingSection |
| 7.6 | Write tests | ☐ Pending | All pass |

---

## Phase 8: Pre-built Widgets

**Goal:** RechartsWidget, NivoWidget, KPIWidget wrappers

| # | Task | Status | Test |
|---|------|--------|------|
| 8.1 | Create RechartsWidget wrapper | ✅ Done | DashboardCard + Recharts with chart type routing |
| 8.2 | Create Recharts chart components | ✅ Done | Bar, Line, Area, Pie, Scatter, Radar, RadialBar |
| 8.3 | Create NivoWidget wrapper | ✅ Done | DashboardCard + Nivo with chart type routing |
| 8.4 | Create Nivo chart components | ✅ Done | HeatMap, Treemap, Sunburst |
| 8.5 | Create KPIWidget | ✅ Done | Value, label, trend, icon, formatting |
| 8.6 | Create Widget Registry | ✅ Done | Central registration system with category/tag search |
| 8.7 | Write tests | ☐ Pending | All pass |

---

## Phase 9: Polish & Export

**Goal:** Final optimizations, docs, multiple entry points

| # | Task | Status | Test |
|---|------|--------|------|
| 9.1 | Set up multiple entry points | ✅ Done | 10 exports in package.json (., ./card, ./widgets, ./widgets/recharts, ./widgets/nivo, ./widgets/kpi, ./hooks, ./store, ./http, ./utils) |
| 9.2 | Add React.memo everywhere | ✅ Done | All components memoized |
| 9.3 | Add JSDoc comments | ☐ Pending | Docs generate |
| 9.4 | Create README.md | ☐ Pending | Clear usage guide |
| 9.5 | Run full test suite | ☐ Pending | All pass |
| 9.6 | Performance audit | ☐ Pending | No leaks, fast |
| 9.7 | Create .clinerules | ✅ Done | Rules documented |

---

## Current Status

**Phase:** 9 (Polish & Export) — In Progress
**Next Tasks:** Write tests (all phases), JSDoc comments, README.md, performance audit
**Blockers:** None
**Completed:** Phases 1, 2, 3, 4, 5, 6, 7, 8

## Additional Changes Made

### Architecture
- **Widget Registry** (`src/registry/widgetRegistry.ts`): Singleton registry for widget type registration with category/tag search, hooks for consuming registrations
- **Store Selectors** (`src/store/dashboardStore.selectors.ts`): Typed selectors for fine-grained Zustand subscriptions
- **Store Middleware** (`src/store/dashboardStore.middleware.ts`): Zustand middleware configuration
- **Barrel exports** at every level: types, hooks, store, utils, widgets, components

### Widget Ecosystem
- **RechartsWidget**: Wrapper with 7 chart types (Bar, Line, Area, Pie, Scatter, Radar, RadialBar), auto-color assignment, configurable legend/tooltip/grid/animation
- **NivoWidget**: Wrapper with 3 chart types (HeatMap, Treemap, Sunburst), Nivo color schemes
- **KPIWidget**: Value display with trend calculation, formatting (number/currency/percentage/text), icon support

### Utilities
- **Animations** (`src/utils/animations.ts`): Preset animations, spring-to-CSS conversion, CSS transition helpers
- **Constants** (`src/utils/constants.ts`): Default widget size/position
- **Persistence** (`src/utils/persistence.ts`): localStorage adapter with pluggable adapter pattern

### 10 Type Files
- `animation.types.ts`, `breakpoint.types.ts`, `dashboard.types.ts`, `http.types.ts`, `persistence.types.ts`, `position.types.ts`, `schema.types.ts`, `settings.types.ts`, `utility.types.ts`, `widget.types.ts`

### 8 Hooks
- `useDashboard`, `useDraggable`, `useResize`, `useDebounce`, `useThrottle`, `useWidgetData`, `useWidgetEvents`, `usePersistence`