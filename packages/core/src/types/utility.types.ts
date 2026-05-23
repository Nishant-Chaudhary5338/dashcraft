// ============================================================
// Utility Types
// ============================================================

/**
 * Makes all properties of T deeply readonly.
 * Useful for immutable state objects.
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Makes T nullable (T | null).
 */
export type Nullable<T> = T | null;

/**
 * Makes specified properties K optional while keeping others required.
 * @example Optional<User, 'email' | 'phone'>
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specified properties K required while keeping others as-is.
 * @example Required<User, 'id' | 'name'>
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extracts the value type from a record/object type.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Creates a type with only the specified properties.
 * @example PickByType<User, string> // Only string properties
 */
export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 * Makes all properties optional recursively.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties required recursively.
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Extract function return type (works with async functions).
 */
export type AsyncReturnType<T extends (...args: unknown[]) => unknown> = 
  T extends (...args: unknown[]) => Promise<infer R> ? R :
  T extends (...args: unknown[]) => infer R ? R : never;

/**
 * Create a union of all value types in a tuple.
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number];

/**
 * Create a type that represents a range of numbers (simplified).
 * @example NumberRange<1, 5> = 1 | 2 | 3 | 4 | 5
 */
export type NumberRange<N extends number, Result extends unknown[] = []> =
  Result['length'] extends N
    ? Result[number] | N
    : NumberRange<N, [...Result, Result['length']]>;