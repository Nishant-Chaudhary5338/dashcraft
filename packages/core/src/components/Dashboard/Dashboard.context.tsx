import { createContext, useContext } from "react";
import type { DashboardContextValue } from "../../types";

// ============================================================
// Context Definition
// ============================================================

/**
 * React context carrying the live {@link DashboardContextValue} (edit-mode flag, widget map, and
 * all widget/layout actions) provided by {@link Dashboard}.
 *
 * Exposed mainly so advanced consumers can read the raw context; most code should call
 * {@link useDashboardContext} (which throws a helpful error when used outside a `Dashboard`) or the
 * higher-level {@link useDashboard} hook instead. `null` until a `Dashboard` provider mounts.
 *
 * @see {@link useDashboardContext}
 * @see {@link Dashboard}
 */
export const DashboardContext = createContext<DashboardContextValue | null>(null);

// ============================================================
// Hook to consume context
// ============================================================

/**
 * Reads the nearest {@link Dashboard}'s context value — edit-mode state, the widget map, and the
 * layout/widget actions.
 *
 * Use inside any component rendered under a `Dashboard` to inspect or drive the dashboard (toggle
 * edit mode, add/remove widgets, save/load layout, etc.). Throws a descriptive error if called
 * outside a `Dashboard`, so a missing provider fails loudly rather than silently no-op'ing.
 *
 * @returns The current {@link DashboardContextValue}.
 * @throws Error when rendered outside a `<Dashboard>` provider.
 *
 * @example
 * ```tsx
 * import { useDashboardContext } from "@dashcraft/core";
 *
 * function EditToggle() {
 *   const { isEditMode, toggleEditMode } = useDashboardContext();
 *   return <button onClick={toggleEditMode}>{isEditMode ? "Done" : "Edit"}</button>;
 * }
 * ```
 *
 * @see {@link useDashboard} for a similar hook exposed at the package root.
 * @see {@link DashboardContextValue} for the returned shape.
 */
export function useDashboardContext(): DashboardContextValue {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "[DashCraft] useDashboard must be used within a <Dashboard> component. " +
        "Make sure your component is wrapped with <Dashboard>."
    );
  }

  return context;
}