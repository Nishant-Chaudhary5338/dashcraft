import { useCallback, useRef, useState } from "react";

// ============================================================
// Types
// ============================================================

/**
 * The value plus full undo/redo controls returned by
 * {@link useStateWithHistory}.
 */
export interface StateWithHistory<T> {
  /** The value at the current position in history — equivalent to `history[index]`. */
  value: T;
  /**
   * All recorded values in chronological order. When
   * {@link UseStateWithHistoryOptions.maxHistory} is set and exceeded, the
   * oldest entries are dropped so this array never grows past that limit.
   */
  history: T[];
  /** Position of `value` within `history` (0-based). */
  index: number;
  /** `true` if {@link back} would move to an earlier value. */
  canGoBack: boolean;
  /** `true` if {@link forward} would move to a later value. */
  canGoForward: boolean;
  /**
   * Sets a new current value, accepting either a value or an updater
   * function (like `useState`). Any "future" entries beyond the current
   * index are discarded first — branching from a past state overwrites
   * the redo stack, matching standard undo/redo semantics.
   */
  set: (valueOrUpdater: T | ((prev: T) => T)) => void;
  /** Moves one step back in history (undo). No-op if {@link canGoBack} is `false`. */
  back: () => void;
  /** Moves one step forward in history (redo). No-op if {@link canGoForward} is `false`. */
  forward: () => void;
  /** Jumps directly to an arbitrary history index, clamped to `[0, history.length - 1]`. */
  go: (index: number) => void;
  /** Discards all history and starts fresh at `initialValue` (index 0). */
  reset: (initialValue: T) => void;
}

/**
 * Configuration for {@link useStateWithHistory}.
 */
export interface UseStateWithHistoryOptions {
  /**
   * Maximum number of entries to retain in {@link StateWithHistory.history}.
   * Once exceeded, the oldest entries are dropped on each new `set` call.
   *
   * @default undefined (unlimited history)
   */
  maxHistory?: number;
}

// ============================================================
// Hook
// ============================================================

/**
 * Like `useState`, but keeps a full undo/redo-navigable history of every
 * value set.
 *
 * Use this for widget content that needs an undo/redo affordance — e.g. a
 * chart's filter state, a text-editor widget's content, or any
 * step-through-changes UI. History and index live in refs (not state) so
 * that reading `historyRef.current` inside `set` never sees a stale
 * closure; a single `forceUpdate` counter triggers the one re-render
 * needed per change.
 *
 * @param initialValue - The value history starts at (index 0).
 * @param options - Optional history size limit.
 * @returns A single-element tuple `[stateWithHistory]` containing the
 * current value and undo/redo controls. (The single-element tuple shape,
 * rather than returning the object directly, keeps this hook consistent
 * with other stateful hooks in this package that return tuples.)
 *
 * @example
 * ```tsx
 * import { useStateWithHistory } from "@dashcraft/core";
 *
 * function FilterPanel() {
 *   const [filter] = useStateWithHistory({ range: "7d" }, { maxHistory: 20 });
 *
 *   return (
 *     <div>
 *       <button onClick={filter.back} disabled={!filter.canGoBack}>Undo</button>
 *       <button onClick={filter.forward} disabled={!filter.canGoForward}>Redo</button>
 *       <button onClick={() => filter.set({ range: "30d" })}>Last 30 days</button>
 *       <pre>{JSON.stringify(filter.value)}</pre>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link StateWithHistory}
 */
export function useStateWithHistory<T>(
  initialValue: T,
  options?: UseStateWithHistoryOptions
): [StateWithHistory<T>] {
  const maxHistory = options?.maxHistory;

  // Store history and index in a ref to avoid stale closures while keeping
  // a single setState trigger that forces a re-render when anything changes.
  const historyRef = useRef<T[]>([initialValue]);
  const indexRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  const commit = useCallback(() => forceUpdate((n) => n + 1), []);

  const set = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      const current = historyRef.current[indexRef.current] as T;
      const next =
        typeof valueOrUpdater === "function"
          ? (valueOrUpdater as (prev: T) => T)(current)
          : valueOrUpdater;

      // Truncate future entries
      const newHistory = [...historyRef.current.slice(0, indexRef.current + 1), next];
      // Apply maxHistory limit
      const trimmed =
        maxHistory !== undefined && newHistory.length > maxHistory
          ? newHistory.slice(newHistory.length - maxHistory)
          : newHistory;

      historyRef.current = trimmed;
      indexRef.current = trimmed.length - 1;
      commit();
    },
    [maxHistory, commit]
  );

  const back = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      commit();
    }
  }, [commit]);

  const forward = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      commit();
    }
  }, [commit]);

  const go = useCallback(
    (targetIndex: number) => {
      const clamped = Math.max(0, Math.min(historyRef.current.length - 1, targetIndex));
      if (clamped !== indexRef.current) {
        indexRef.current = clamped;
        commit();
      }
    },
    [commit]
  );

  const reset = useCallback(
    (initialVal: T) => {
      historyRef.current = [initialVal];
      indexRef.current = 0;
      commit();
    },
    [commit]
  );

  const currentIndex = indexRef.current;
  const history = historyRef.current;

  const stateWithHistory: StateWithHistory<T> = {
    value: history[currentIndex] as T,
    history,
    index: currentIndex,
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < history.length - 1,
    set,
    back,
    forward,
    go,
    reset,
  };

  return [stateWithHistory];
}
