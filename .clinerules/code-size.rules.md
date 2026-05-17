# Code Size Rules for DashCraft

## File Size Limits

- **Maximum 300 lines per file** (excluding comments and blank lines)
- If a file exceeds 300 lines, split it into smaller modules
- Use barrel exports (`index.ts`) to maintain clean public API

## Function Size Limits

- **Maximum 50 lines per function** (excluding JSDoc comments)
- If a function exceeds 50 lines, extract sub-functions
- Each function should have a single, clear responsibility

## Component Decomposition

### When to Split Components
- When JSX exceeds ~100 lines
- When a component has more than 5-6 concerns
- When render logic is deeply nested (>3 levels)
- When the same UI pattern repeats

### How to Split
1. **Extract sub-components** into separate files
2. **Use compound components** for related UI (e.g., `Card.Header`, `Card.Body`)
3. **Extract hooks** for reusable logic
4. **Create utility functions** for complex computations

## Examples

### ❌ Bad: Large Component
```tsx
function SettingsPanel() {
  // 200+ lines of mixed UI and logic
  return (
    <div>
      {/* 100+ lines of JSX */}
    </div>
  );
}
```

### ✅ Good: Decomposed Components
```tsx
// SettingsPanel.tsx
function SettingsPanel() {
  return (
    <div>
      <SettingsHeader />
      <ThemeSection />
      <HighlightSection />
      <EndpointSection />
    </div>
  );
}

// SettingsHeader.tsx
function SettingsHeader() { /* ... */ }

// ThemeSection.tsx
function ThemeSection() { /* ... */ }
```

## Enforcement

Before committing:
1. Count lines in each file (exclude comments/blank lines)
2. Count lines in each function
3. If limits exceeded, refactor immediately
4. Run `wc -l src/**/*.tsx` to check file sizes

## Rationale

- Smaller files are easier to read, test, and maintain
- Small functions are easier to understand and debug
- Component decomposition improves reusability
- Follows Single Responsibility Principle (SRP)