# Optimization Rules for DashCraft

## CRITICAL: DOM-Heavy Library

Every optimization matters. Target: 60fps during all interactions.

## Mandatory Optimizations

### React.memo on ALL Components
```tsx
const Component = React.memo(function Component(props) {
  return <div>...</div>;
});
```

### useCallback on ALL Handlers
```tsx
const handleClick = useCallback(() => {
  // handler logic
}, [deps]);
```

### useMemo on Computed Values
```tsx
const sortedWidgets = useMemo(() => {
  return Object.values(widgets).sort(sortFn);
}, [widgets]);
```

### Throttle Drag (16ms = 60fps)
```tsx
const handleDrag = useThrottledCallback((pos) => {
  updateWidgetPosition(id, pos);
}, 16);
```

### Debounce Resize (150ms)
```tsx
const handleResize = useDebouncedCallback((size) => {
  updateWidgetSize(id, size);
}, 150);
```

### CSS Transforms (NOT left/top)
```tsx
// ✅ GPU accelerated
<div style={{ transform: `translate(${x}px, ${y}px)` }} />

// ❌ Layout reflow
<div style={{ left: x, top: y }} />
```

### Shallow Zustand Selectors
```tsx
// ✅ Granular subscription
const isEditMode = useDashboardStore(selectIsEditMode);

// ❌ Re-renders on ANY change
const store = useDashboardStore();
```

## Performance Budget
- Initial render: < 100ms
- Drag frame: < 16ms
- Resize frame: < 16ms
- Re-renders per interaction: < 5
- Bundle: < 50kb gzipped
- Memory: No leaks