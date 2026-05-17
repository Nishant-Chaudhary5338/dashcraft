# Architecture Rules for DashCraft

## SOLID Principles

### Single Responsibility
- One file, one component or one hook
- Extract complex logic to custom hooks
- Separate concerns: UI, state, effects

### Open/Closed
- Extend via props, not modification
- Use composition over inheritance
- children prop for content injection

### Liskov Substitution
- Components work with any valid props
- DashboardCard wraps ANY React component

### Interface Segregation
- Small, focused interfaces
- Optional props for non-essential features

### Dependency Inversion
- Components depend on context (abstraction), not store directly
- Hooks abstract implementations

## DRY

- Shared types in `types/index.ts`
- Shared utilities in `utils/`
- NO duplicate logic anywhere
- Barrel exports in every folder's `index.ts`

## Headless Pattern

- Dashboard = context provider (no DOM of its own)
- DashboardCard = headless wrapper (provides features, not layout)
- Developer controls all styling and layout