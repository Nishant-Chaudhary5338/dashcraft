# TypeScript Rules for DashCraft

## STRICT MODE ALWAYS

- `"strict": true` in tsconfig.json
- No `any` - use `unknown` + type guards
- Explicit return types on all exported functions
- No type assertions (`as`) unless documented why

## Branded Types for IDs
```typescript
type WidgetId = string & { readonly __brand: unique symbol };
const createWidgetId = (id: string): WidgetId => id as WidgetId;
```

## Readonly Where Possible
```typescript
interface WidgetState {
  readonly id: WidgetId;
  readonly position: Position;
  readonly size: Size;
}
```

## Discriminated Unions
```typescript
type WidgetType = "bar" | "line" | "area" | "pie" | "kpi" | "table" | "custom";
```

## No Implicit Any
Every variable must have an explicit or inferrable type.