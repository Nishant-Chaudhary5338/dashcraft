import { useCallback, useState } from "react";

/**
 * State and controls returned by {@link useTabs}.
 */
export interface UseTabsReturn<T> {
  /** The currently active tab value. */
  readonly active: T;
  /** Sets the active tab directly to any value from `tabs`. */
  readonly setActive: (tab: T) => void;
  /** Advances to the next tab, wrapping around to the first after the last. */
  readonly next: () => void;
  /** The full list of tab values, as passed in (echoed back for convenience when rendering). */
  readonly tabs: readonly T[];
}

/**
 * Headless tab/segment state — e.g. a 1M/3M/1Y timeframe filter on a
 * chart widget, or a view-mode toggle (table/grid).
 *
 * This hook only tracks which value is active; it renders nothing, so you
 * can build the tab strip's markup and styling however fits your design
 * system while reusing the selection logic (including keyboard/next
 * cycling) across widgets.
 *
 * @param tabs - The ordered set of selectable values. Must be a stable
 * reference (or re-created only when the tab set actually changes) since
 * it's used to compute `next()`'s wraparound.
 * @param initial - The tab to start on. Defaults to `tabs[0]`.
 * @returns The active tab and controls to change it.
 *
 * @example
 * ```tsx
 * import { useTabs } from "@dashcraft/core";
 *
 * function TimeframeToggle() {
 *   const { active, setActive, tabs } = useTabs(["1M", "3M", "1Y"] as const, "3M");
 *   return (
 *     <div role="tablist">
 *       {tabs.map((t) => (
 *         <button key={t} aria-selected={t === active} onClick={() => setActive(t)}>
 *           {t}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTabs<T extends string | number>(
  tabs: readonly T[],
  initial?: T,
): UseTabsReturn<T> {
  const [active, setActive] = useState<T>(initial ?? tabs[0]!);
  const next = useCallback(() => {
    setActive((cur) => {
      const i = tabs.indexOf(cur);
      return tabs[(i + 1) % tabs.length]!;
    });
  }, [tabs]);
  return { active, setActive, next, tabs };
}
