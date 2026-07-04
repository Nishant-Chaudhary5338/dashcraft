// ============================================================
// Persistence Types
// ============================================================

/**
 * Adapter interface for reading and writing the persisted dashboard layout.
 *
 * Implement this to back layout persistence with any storage medium
 * (IndexedDB, a remote API, `AsyncStorage`, etc.) instead of the default
 * `localStorage`. All methods may return synchronously or a `Promise`,
 * matching the shape of the Web Storage API so it can be used as a drop-in
 * without wrapping.
 *
 * @example
 * ```ts
 * const memoryAdapter: PersistenceAdapter = {
 *   getItem: (key) => store.get(key) ?? null,
 *   setItem: (key, value) => { store.set(key, value); },
 *   removeItem: (key) => { store.delete(key); },
 * };
 * ```
 * @see PersistenceConfig
 */
export interface PersistenceAdapter {
  /** Retrieves the stored value for `key`, or `null` if nothing is stored. */
  readonly getItem: (key: string) => string | null | Promise<string | null>;
  /** Stores `value` under `key`, overwriting any existing value. */
  readonly setItem: (key: string, value: string) => void | Promise<void>;
  /** Removes any stored value for `key`. */
  readonly removeItem: (key: string) => void | Promise<void>;
}

/**
 * Configuration controlling how and when the dashboard layout is persisted.
 *
 * Consumed wherever layout auto-save is configured (e.g. alongside
 * {@link DashboardConfig}'s `persistenceKey`/`autoSave`/`autoSaveDelay`
 * fields, which mirror this shape for the top-level `Dashboard` component).
 *
 * @see PersistenceAdapter
 * @see DashboardConfig
 */
export interface PersistenceConfig {
  /** Storage key under which the layout is saved. */
  readonly key: string;
  /** Custom persistence adapter. Defaults to `localStorage` when omitted. */
  readonly adapter?: PersistenceAdapter;
  /** Whether to automatically save whenever the layout changes. */
  readonly autoSave?: boolean;
  /** Debounce delay, in milliseconds, before an auto-save write is committed. */
  readonly autoSaveDelay?: number;
}
