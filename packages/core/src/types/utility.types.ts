// ============================================================
// Utility Types
// ============================================================

/**
 * Recursively makes every property of `T` (including nested objects)
 * `readonly`.
 *
 * Useful for exposing immutable state objects (e.g. a store snapshot) where
 * consumers should read but never mutate nested fields directly. Unlike
 * TypeScript's built-in `Readonly<T>`, this recurses into object-typed
 * properties instead of stopping at the top level.
 *
 * @example
 * ```ts
 * type ReadonlyWidget = DeepReadonly<WidgetState>;
 * // widget.position.x = 5; // error: readonly
 * ```
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Shorthand for a type that may also be `null`.
 *
 * @example
 * ```ts
 * type MaybeUser = Nullable<{ name: string }>;
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Derives a variant of `T` where the properties in `K` become optional,
 * while all other properties remain as originally declared.
 *
 * The inverse of {@link RequiredKeys}. Handy for "creation" DTOs where some
 * fields have server-assigned defaults.
 *
 * @example
 * ```ts
 * type NewUser = Optional<User, 'email' | 'phone'>;
 * ```
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Derives a variant of `T` where the properties in `K` become required,
 * while all other properties remain as originally declared.
 *
 * The inverse of {@link Optional}. Useful for narrowing a type after
 * validating that certain optional fields are now guaranteed present.
 *
 * @example
 * ```ts
 * type ValidatedUser = RequiredKeys<User, 'id' | 'name'>;
 * ```
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extracts the union of all value types of an object/record type `T`.
 *
 * @example
 * ```ts
 * type Values = ValueOf<{ a: number; b: string }>; // number | string
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Derives a type containing only the properties of `T` whose value type is
 * assignable to `U`.
 *
 * @example
 * ```ts
 * type StringProps = PickByType<User, string>; // only the string-valued properties
 * ```
 */
export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 * Recursively makes every property of `T` (including nested objects)
 * optional.
 *
 * The recursive counterpart of TypeScript's built-in `Partial<T>`; useful
 * for patch/update payloads on deeply nested config objects.
 *
 * @example
 * ```ts
 * function updateConfig(patch: DeepPartial<DashboardConfig>) { ... }
 * ```
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Recursively makes every property of `T` (including nested objects)
 * required, stripping `undefined` from each.
 *
 * The recursive counterpart of TypeScript's built-in `Required<T>`.
 *
 * @example
 * ```ts
 * type FullyResolvedConfig = DeepRequired<DashboardConfig>;
 * ```
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Extracts the resolved return type of a function, unwrapping `Promise` if
 * the function is `async`.
 *
 * Unlike the built-in `ReturnType<T>`, this collapses `Promise<R>` down to
 * `R` so synchronous and async functions can be handled uniformly.
 *
 * @example
 * ```ts
 * async function fetchUser() { return { id: "1" }; }
 * type User = AsyncReturnType<typeof fetchUser>; // { id: string }
 * ```
 */
export type AsyncReturnType<T extends (...args: unknown[]) => unknown> =
  T extends (...args: unknown[]) => Promise<infer R> ? R :
  T extends (...args: unknown[]) => infer R ? R : never;

/**
 * Converts a readonly tuple type into a union of its element types.
 *
 * @example
 * ```ts
 * type Method = TupleToUnion<["GET", "POST"]>; // "GET" | "POST"
 * ```
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number];

/**
 * Builds a numeric literal union `0 | 1 | ... | N` (simplified integer
 * range, recursion-depth limited by TypeScript's tuple-length recursion
 * limit — not suitable for large `N`).
 *
 * @example
 * ```ts
 * type Priority = NumberRange<5>; // 0 | 1 | 2 | 3 | 4 | 5
 * ```
 */
export type NumberRange<N extends number, Result extends unknown[] = []> =
  Result['length'] extends N
    ? Result[number] | N
    : NumberRange<N, [...Result, Result['length']]>;