/**
 * Public entry point for DashCraft's Zustand store module.
 *
 * Re-exports the {@link useDashboardStore} hook, its typed selectors, and
 * the {@link DashboardStoreState} contract from `./dashboardStore`. Import
 * from here (or from the package root `@dashcraft/core`) rather than
 * reaching into `./dashboardStore` directly.
 *
 * @see useDashboardStore
 * @see DashboardStoreState
 */
export {
  useDashboardStore,
  selectIsEditMode,
  selectWidgets,
  selectWidgetById,
  selectWidgetCount,
} from "./dashboardStore";

export type { DashboardStoreState } from "./dashboardStore";