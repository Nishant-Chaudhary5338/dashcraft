import { createContext, useContext } from "react";
import type { DashboardContextValue } from "../../types";

// ============================================================
// Context Definition
// ============================================================

export const DashboardContext = createContext<DashboardContextValue | null>(null);

// ============================================================
// Hook to consume context
// ============================================================

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