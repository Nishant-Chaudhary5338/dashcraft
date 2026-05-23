// ============================================================
// Persistence Types
// ============================================================

/**
 * Adapter interface for layout persistence.
 * Implement this to use custom storage (IndexedDB, server, etc.).
 */
export interface PersistenceAdapter {
  /** Retrieve a value by key */
  readonly getItem: (key: string) => string | null | Promise<string | null>;
  /** Store a value by key */
  readonly setItem: (key: string, value: string) => void | Promise<void>;
  /** Remove a value by key */
  readonly removeItem: (key: string) => void | Promise<void>;
}

/**
 * Configuration for layout persistence.
 */
export interface PersistenceConfig {
  /** Storage key for the layout */
  readonly key: string;
  /** Custom persistence adapter (default: localStorage) */
  readonly adapter?: PersistenceAdapter;
  /** Whether to auto-save on changes */
  readonly autoSave?: boolean;
  /** Debounce delay for auto-save in milliseconds */
  readonly autoSaveDelay?: number;
}