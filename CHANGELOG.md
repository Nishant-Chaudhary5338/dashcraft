# Changelog

All notable changes to `@dashcraft/core` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Interactive showcase page at `/showcase` with three real-world preset dashboards
- AI-native files: `llms.txt`, `AGENTS.md` for LLM and agent discoverability
- Full docs site: installation, API reference, components, hooks, 3 guides
- `/playground` drag-and-drop builder with AI import and project zip export
- MCP server `@dashcraft/mcp-codegen`: `analyze_dashboard`, `generate_code`, `generate_project`

---

## [0.1.0] — 2025-05-23

### Added
- `<Dashboard>` root container with Zustand state management
- `<DashboardCard>` widget wrapper with boolean props: `drag`, `resize`, `settings`, `delete`, `responsive`
- `<KPIWidget>` metric card with trend indicators and `currency | percentage | number | text` formats
- `<RechartsWidget>` supporting `bar`, `line`, `area`, `pie`, `scatter`, `radar` chart types
- `<NivoWidget>` supporting `heatmap`, `treemap`, `sunburst` chart types
- `useDashboard` — access dashboard state, toggle edit mode
- `useWidgetData` — push live data into widgets
- `useWidgetEvents` — subscribe to widget interaction events
- `usePersistence` — manual layout save/restore with custom storage backends
- `useDraggable` — raw @dnd-kit drag state for custom widgets
- `useResize` — raw resize state for custom widgets
- `useStateWithHistory` — undo/redo state management
- Accessibility: full keyboard navigation via @dnd-kit, ARIA attributes on all interactive elements
- TypeScript strict mode throughout, declaration files included
- ESM + CJS dual build via tsup

[Unreleased]: https://github.com/Nishant-Chaudhary5338/dashcraft/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Nishant-Chaudhary5338/dashcraft/releases/tag/v0.1.0
