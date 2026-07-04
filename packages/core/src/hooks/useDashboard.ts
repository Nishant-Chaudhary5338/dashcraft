import { useDashboardContext } from "../components/Dashboard/Dashboard.context";
import type { DashboardContextValue } from "../types";

// ============================================================
// useDashboard Hook
// ============================================================

/**
 * Reads the current dashboard's shared context.
 *
 * This is the escape hatch for any widget or child component that needs
 * direct access to dashboard-level state (layout, selection, resize flags)
 * or actions (add/remove/move widget) without prop-drilling them down from
 * the `<Dashboard>` root. It must be called from a component rendered
 * inside a `<Dashboard>` tree, since it reads from the context that
 * `<Dashboard>` provides.
 *
 * @returns The full {@link DashboardContextValue} — dashboard state plus
 * the actions to mutate it.
 * @throws Error if called outside of a `<Dashboard>` component tree (no
 * provider found).
 *
 * @example
 * ```tsx
 * import { useDashboard } from "@dashcraft/core";
 *
 * function WidgetToolbar() {
 *   const { removeWidget, selectedWidgetId } = useDashboard();
 *   if (!selectedWidgetId) return null;
 *   return <button onClick={() => removeWidget(selectedWidgetId)}>Remove</button>;
 * }
 * ```
 *
 * @see {@link DashboardContextValue}
 */
export function useDashboard(): DashboardContextValue {
  return useDashboardContext();
}