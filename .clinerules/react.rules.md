# React Rules for DashCraft

## Components

- **React.memo** on ALL components - no exceptions
- **forwardRef** for components that accept refs
- **displayName** on all forwardRef components
- Destructure props in function signature
- Default props via destructuring defaults

## Hooks

- **useCallback** for ALL event handlers
- **useMemo** for computed values
- **useRef** for DOM refs and previous values
- **useEffect** must have cleanup function
- No conditional hooks

## Performance Pattern
```tsx
const Component = React.memo(function Component({ id, onAction }: Props) {
  const handleClick = useCallback(() => {
    onAction(id);
  }, [id, onAction]);

  return <button onClick={handleClick}>Click</button>;
});
Component.displayName = "Component";
```

## No Inline Functions/Objects in JSX
```tsx
// ✅ GOOD
const handleClick = useCallback(() => doSomething(id), [id]);
return <button onClick={handleClick}>Click</button>;

// ❌ BAD
return <button onClick={() => doSomething(id)}>Click</button>;