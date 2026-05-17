# DashCraft Development Rules

## TypeScript Rules (STRICT)

### Compiler Options
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": true,
  "noUncheckedIndexedAccess": true,
  "noFallthroughCasesInSwitch": true
}
```

### Coding Standards
- **NO `any`** - Use `unknown` + type guards
- **Explicit return types** on all exported functions
- **Discriminated unions** for widget types
- **Branded types** for IDs (WidgetId, DashboardId)
- **Readonly** where possible (immutable state)
- **const assertions** for literal types
- **Type predicates** for type narrowing
- **No type assertions** (`as`) unless absolutely necessary

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Types: `camelCase.types.ts` or in `types/index.ts`
- Tests: `*.test.tsx` or `*.test.ts`
- Stories: `*.stories.tsx`

---

## React Rules

### Component Rules
- **React.memo** on ALL components
- **forwardRef** for components that accept refs
- **displayName** on all forwardRef components
- **No inline functions** in JSX (useCallback)
- **No inline objects** in JSX (useMemo)
- **Destructure props** in function signature
- **Default props** via destructuring defaults

### Hooks Rules
- **useMemo** for computed values
- **useCallback** for all event handlers
- **useRef** for DOM refs and previous values
- **useEffect** cleanup functions always
- **Custom hooks** for reusable logic
- **No conditional hooks**

### Performance
- **Lazy loading** for heavy components
- **Suspense** boundaries for async components
- **React.startTransition** for non-urgent updates

---

## Tailwind Rules

### Usage
- Use `cn()` utility for all class merging
- No inline styles except dynamic values (position, size)
- Dark mode support via `dark:` prefix
- Responsive via `sm:`, `md:`, `lg:` prefixes
- Use CSS variables for theming

### Class Order
1. Layout (display, position, flex, grid)
2. Box model (width, height, padding, margin)
3. Typography (font, text, leading)
4. Visual (bg, border, shadow, opacity)
5. Interactive (hover, focus, active)
6. Animation (transition, transform)

---

## Architecture Rules (SOLID)

### Single Responsibility
- One component, one job
- Extract complex logic to hooks
- Separate concerns (UI, state, effects)

### Open/Closed
- Extend via props, not modification
- Use composition over inheritance
- Render props or children for customization

### Liskov Substitution
- Components work with any valid props
- No prop type narrowing in components

### Interface Segregation
- Small, focused interfaces
- Optional props for non-essential features
- Discriminated unions for variants

### Dependency Inversion
- Hooks abstract implementations
- Store is the single source of truth
- Components depend on abstractions (context), not concrete state

---

## DRY Rules

### Code Reuse
- Shared types in `types/`
- Shared utilities in `utils/`
- Shared animation variants in `DashboardCard.styles.ts`
- Shared hooks in `hooks/`
- NO duplicate logic

### Barrel Exports
- Each folder has `index.ts`
- Re-export types and components
- Clear public API

---

## Testing Rules

### Coverage
- Unit tests for all hooks
- Integration tests for components
- Test coverage > 80%
- Test edge cases (null, undefined, empty)

### Test Structure
- Arrange → Act → Assert
- Descriptive test names
- One assertion per test (ideally)
- Mock external dependencies

---

## Git Rules

### Commits
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- One feature per commit
- Meaningful commit messages

### Branches
- `feat/feature-name` for features
- `fix/bug-name` for fixes
- `docs/update-name` for docs

---

## Optimization Rules (CRITICAL)

This is a DOM-heavy library. Every optimization matters.

### Mandatory Optimizations
| Technique | Where | Why |
|-----------|-------|-----|
| React.memo | All components | Prevent unnecessary re-renders |
| useMemo | Computed values | Cache expensive calculations |
| useCallback | All handlers | Stable references for memo |
| Debounce | Resize events (150ms) | Reduce update frequency |
| Throttle | Drag events (16ms) | 60fps smooth updates |
| CSS transforms | Position/size | GPU acceleration |
| will-change | Animated elements | Browser optimization hint |
| requestAnimationFrame | Animation loops | Sync with browser repaint |
| useRef | DOM refs, prev values | Avoid re-renders |
| Shallow comparison | Zustand selectors | Granular subscriptions |

### Performance Patterns
```tsx
// ✅ Good: Memoized component with callback
const Widget = React.memo(function Widget({ id, onDrag }: Props) {
  const handleDrag = useCallback((e) => {
    onDrag(id, e);
  }, [id, onDrag]);

  return <div onDrag={handleDrag}>...</div>;
});

// ❌ Bad: New function every render
function Widget({ id, onDrag }: Props) {
  return <div onDrag={(e) => onDrag(id, e)}>...</div>;
}
```

```tsx
// ✅ Good: Throttled drag handler
const handleDrag = useThrottledCallback((position) => {
  updateWidgetPosition(id, position);
}, 16); // 60fps

// ❌ Bad: Unthrottled store updates on every pixel
const handleDrag = (position) => {
  updateWidgetPosition(id, position); // Fires hundreds of times per second
};
```

```tsx
// ✅ Good: CSS transform for position
<div style={{ transform: `translate(${x}px, ${y}px)` }}>...</div>

// ❌ Bad: Left/top causes layout reflow
<div style={{ left: x, top: y }}>...</div>
```

---

## Naming Conventions

### Variables
- `isEditMode` - boolean
- `widgetId` - ID strings
- `handleDrag` - event handlers
- `useDashboard` - hooks
- `DashboardCard` - components

### Files
- `DashboardCard.tsx` - component
- `DashboardCard.types.ts` - types
- `DashboardCard.test.tsx` - tests
- `DashboardCard.styles.ts` - styles/variants
- `useDashboard.ts` - hook

### Constants
- `DEFAULT_WIDGET_SIZE` - defaults
- `STORAGE_KEY_PREFIX` - prefixes