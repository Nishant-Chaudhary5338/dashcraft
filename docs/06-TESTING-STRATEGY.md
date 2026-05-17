# DashCraft Testing Strategy

## Testing Philosophy

For a DOM-heavy interactive library, testing is CRITICAL. Every feature must be tested before moving to the next phase.

---

## Testing Layers

### 1. Unit Tests (Hooks & Utils)
- Test each hook in isolation
- Test utility functions
- Mock dependencies
- Test edge cases (null, undefined, empty)

### 2. Integration Tests (Components)
- Test components with context
- Test component interactions
- Test store updates
- Test event handlers

### 3. Manual Testing (In web-app-2)
- Import into `apps/web/web-app-2/`
- Create test pages
- Test drag, resize, settings, persistence
- Test responsive behavior
- Test edge cases manually

### 4. MCP Tool Testing (Automated)
- Run after each phase
- Check for issues before proceeding

---

## MCP Tool Checklist (Run After Each Phase)

### Render Analyzer
```bash
# Check for unnecessary re-renders
use_mcp_tool: render-analyzer
```
- Target: < 5 re-renders per interaction
- Fix: Add React.memo, useMemo, useCallback

### Performance Audit
```bash
# Check for memory leaks and performance issues
use_mcp_tool: performance-audit
```
- Target: No memory leaks
- Target: < 16ms per frame (60fps)
- Fix: Clean up effects, cancel requests

### TypeScript Enforcer
```bash
# Check for type safety violations
use_mcp_tool: typescript-enforcer
```
- Target: 0 violations
- Fix: Add proper types, remove any

### Accessibility Checker
```bash
# Check for accessibility issues
use_mcp_tool: accessibility-checker
```
- Target: WCAG AA compliance
- Fix: Add ARIA labels, keyboard support

---

## Test Files Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   └── Dashboard.test.tsx
│   └── DashboardCard/
│       └── DashboardCard.test.tsx
├── hooks/
│   └── hooks.test.tsx
├── utils/
│   └── utils.test.ts
└── store/
    └── dashboardStore.test.ts
```

---

## Test Patterns

### Hook Testing
```tsx
import { renderHook, act } from '@testing-library/react';
import { useDashboard } from './useDashboard';
import { DashboardProvider } from '../components/Dashboard';

const wrapper = ({ children }) => (
  <DashboardProvider>{children}</DashboardProvider>
);

describe('useDashboard', () => {
  it('should return isEditMode', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.isEditMode).toBe(false);
  });

  it('should toggle edit mode', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => result.current.toggleEditMode());
    expect(result.current.isEditMode).toBe(true);
  });
});
```

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { DashboardCard } from './DashboardCard';

describe('DashboardCard', () => {
  it('should render children', () => {
    render(
      <Dashboard>
        <DashboardCard id="test">
          <div>Test Content</div>
        </DashboardCard>
      </Dashboard>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should show title', () => {
    render(
      <Dashboard>
        <DashboardCard id="test" title="My Widget">
          <div>Content</div>
        </DashboardCard>
      </Dashboard>
    );
    expect(screen.getByText('My Widget')).toBeInTheDocument();
  });
});
```

### Store Testing
```tsx
import { useDashboardStore } from './dashboardStore';

describe('dashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState({ widgets: {}, isEditMode: false, maxZIndex: 0 });
  });

  it('should add widget', () => {
    useDashboardStore.getState().addWidget({ id: 'test' });
    expect(useDashboardStore.getState().widgets['test']).toBeDefined();
  });

  it('should remove widget', () => {
    useDashboardStore.getState().addWidget({ id: 'test' });
    useDashboardStore.getState().removeWidget('test');
    expect(useDashboardStore.getState().widgets['test']).toBeUndefined();
  });
});
```

---

## Manual Testing Checklist

### Dashboard
- [ ] Renders children correctly
- [ ] Context provides all actions
- [ ] Edit mode toggle works
- [ ] Persistence saves/loads

### DashboardCard
- [ ] Renders children
- [ ] Shows title
- [ ] Header actions work
- [ ] Settings popover opens
- [ ] View cycler works
- [ ] Delete works

### Drag
- [ ] Can drag widget
- [ ] Position updates in store
- [ ] Smooth 60fps
- [ ] Works on touch
- [ ] Keyboard accessible

### Resize
- [ ] All 8 handles work
- [ ] Size updates in store
- [ ] Min/max constraints enforced
- [ ] Smooth transitions

### Settings
- [ ] Theme changes
- [ ] Highlight works
- [ ] Endpoint changes
- [ ] Polling interval changes

### Persistence
- [ ] Save layout works
- [ ] Load layout works
- [ ] Auto-save works
- [ ] Reset works

### Performance
- [ ] No unnecessary re-renders
- [ ] 60fps during drag
- [ ] No memory leaks
- [ ] Fast initial render