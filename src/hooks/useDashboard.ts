import { useDashboardContext } from "../components/Dashboard/Dashboard.context";
import type { DashboardContextValue } from "../types";

// ============================================================
// useDashboard Hook
// ============================================================

/**
 * Access dashboard context within a <Dashboard> provider.
 * Provides all dashboard actions and state.
 *
 * @throws Error if used outside of <Dashboard> component
 */
export function useDashboard(): DashboardContextValue {
  return useDashboardContext();
}