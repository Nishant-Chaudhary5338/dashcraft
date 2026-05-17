# Tailwind Rules for DashCraft

## Design Tokens (MANDATORY)

NEVER use hardcoded colors. ALWAYS use design tokens:
```tsx
// ✅ GOOD - Design tokens
<div className="bg-primary text-primary-foreground" />
<div className="bg-destructive text-destructive-foreground" />
<div className="bg-muted text-muted-foreground" />
<div className="border-border" />

// ❌ BAD - Hardcoded colors
<div className="bg-blue-500 text-white" />
<div className="bg-red-500" />
<div className="border-gray-200" />
```

### Available Tokens
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `destructive`, `destructive-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `border`, `input`, `ring`
- `chart-1` through `chart-5`

## Class Merging

ALWAYS use `cn()` utility for class merging:
```tsx
import { cn } from "@repo/dashcraft/utils";

<div className={cn("base-class", condition && "conditional-class", className)} />
```

## Dynamic Values

Use inline styles ONLY for dynamic values (position, size):
```tsx
// ✅ GOOD - Dynamic position
<div style={{ transform: `translate(${x}px, ${y}px)` }} />

// ✅ GOOD - Static styles use Tailwind tokens
<div className="bg-primary text-primary-foreground" />
```

## Dark Mode

Tokens automatically adapt to dark mode. Use `dark:` only for non-token overrides.

## Class Order
1. Layout (display, position, flex, grid)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (bg, border, shadow) - MUST use tokens
5. Interactive (hover, focus)
6. Animation (transition, transform)