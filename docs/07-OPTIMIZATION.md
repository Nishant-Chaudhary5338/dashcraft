# DashCraft Optimization Guide

## Why Optimization Matters

DashCraft is a **DOM-heavy interactive library**. Users drag, resize, and interact with widgets constantly. Every unnecessary re-render, every layout reflow, every unoptimized animation degrades the experience.

**Target: 60fps during all interactions**

---

## Optimization Techniques

### 1. React.memo (Mandatory on ALL Components)

```tsx
// ✅ GOOD
const DashboardCard = React.memo(function DashboardCard(props) {
  return <div>...</div>;
});

// ❌ BAD - Re-renders when parent re-renders
function DashboardCard(props) {
  return <div>...</div>;
}
```

### 2. useCallback (All Event Handlers)

```tsx
// ✅ GOOD - Stable reference
const handleDrag = useCallback((position) => {
  updateWidgetPosition(id, position);
}, [id, updateWidgetPosition]);

// ❌ BAD - New function every render
const handleDrag = (position) => {
  updateWidgetPosition(id, position);
};
```

### 3. useMemo (Computed Values)

```tsx
// ✅ GOOD - Cached
const widgetList = useMemo(() => {
  return Object.values(widgets).sort((a, b) => a.zIndex - b.zIndex);
}, [widgets]);

// ❌ BAD - Recalculated every render
const widgetList = Object.values(widgets).sort((a, b) => a.zIndex - b.zIndex);
```

### 4. Debounce (Resize Events)

Resize fires on every pixel. Debounce to reduce updates.

```tsx
const debouncedResize = useDebouncedCallback((size) => {
  updateWidgetSize(id, size);
}, 150); // 150ms delay
```

### 5. Throttle (Drag Events)

Drag fires at 60+ fps. Throttle to 60fps max.

```tsx
const throttledDrag = useThrottledCallback((position) => {
  updateWidgetPosition(id, position);
}, 16); // ~60fps
```

### 6. CSS Transforms (NOT left/top)

```tsx
// ✅ GOOD - GPU accelerated, no layout reflow
<div style={{ transform: `translate(${x}px, ${y}px)` }}>...</div>

// ❌ BAD - Causes layout reflow on every update
<div style={{ left: x, top: y, position: 'absolute' }}>...</div>
```

### 7. will-change (Hint Browser)

```tsx
// ✅ GOOD - Browser optimizes for animation
<div style={{ willChange: 'transform' }}>...</div>

// ❌ BAD - Browser doesn't optimize
<div>...</div>
```

### 8. requestAnimationFrame (Animation Loops)

```tsx
// ✅ GOOD - Synced with browser repaint
useEffect(() => {
  let rafId: number;
  const animate = () => {
    // Update animation
    rafId = requestAnimationFrame(animate);
  };
  rafId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(rafId);
}, []);

// ❌ BAD - Can cause jank
useEffect(() => {
  const interval = setInterval(() => {
    // Update animation
  }, 16);
  return () => clearInterval(interval);
}, []);
```

### 9. useRef (DOM Refs & Previous Values)

```tsx
// ✅ GOOD - No re-render on ref change
const containerRef = useRef<HTMLDivElement>(null);
const prevSize = useRef<Size>(size);

// ❌ BAD - Causes re-render
const [container, setContainer] = useState<HTMLDivElement | null>(null);
```

### 10. Shallow Comparison (Zustand Selectors)

```tsx
// ✅ GOOD - Only re-renders when isEditMode changes
const isEditMode = useDashboardStore(selectIsEditMode);

// ❌ BAD - Re-renders on ANY store change
const store = useDashboardStore();
```

### 11. Lazy Loading (Heavy Components)

```tsx
// ✅ GOOD - Loaded on demand
const SettingsPanel = React.lazy(() => import('./SettingsPanel'));

// ❌ BAD - Always loaded
import SettingsPanel from './SettingsPanel';
```

### 12. Passive Event Listeners

```tsx
// ✅ GOOD - Doesn't block scroll
element.addEventListener('pointermove', handler, { passive: true });

// ❌ BAD - Can block scroll
element.addEventListener('pointermove', handler);
```

---

## Performance Checklist

| Technique | Status | Where |
|-----------|--------|-------|
| React.memo | ☐ | All components |
| useCallback | ☐ | All handlers |
| useMemo | ☐ | Computed values |
| Debounce (150ms) | ☐ | Resize events |
| Throttle (16ms) | ☐ | Drag events |
| CSS transforms | ☐ | Position updates |
| will-change | ☐ | Animated elements |
| requestAnimationFrame | ☐ | Animation loops |
| useRef | ☐ | DOM refs, prev values |
| Shallow selectors | ☐ | Zustand subscriptions |
| Lazy loading | ☐ | Settings panel |
| Passive listeners | ☐ | Pointer events |

---

## Performance Budget

| Metric | Target | Method |
|--------|--------|--------|
| Initial render | < 100ms | Lazy loading, code splitting |
| Drag frame | < 16ms (60fps) | Throttle, CSS transforms |
| Resize frame | < 16ms (60fps) | Debounce, CSS transforms |
| Re-renders per interaction | < 5 | React.memo, selectors |
| Bundle size | < 50kb gzipped | Tree shaking, multiple entry points |
| Memory | No leaks | Cleanup effects, cancel requests |