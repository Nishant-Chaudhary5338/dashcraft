// ============================================================
// Animation Types
// ============================================================

/**
 * Motion model used to animate widget position/size transitions.
 *
 * - `"spring"` — physics-based motion driven by `stiffness`/`damping`.
 * - `"tween"` — fixed-duration motion driven by `duration`/`ease`.
 * - `"inertia"` — momentum-based motion that decelerates naturally, useful
 *   for drag "throw" gestures.
 *
 * @see AnimationConfig
 */
export type AnimationPreset = "spring" | "tween" | "inertia";

/**
 * Configuration for widget position/size animations.
 *
 * Which fields apply depends on `type`: `stiffness`/`damping` configure a
 * `"spring"`, while `duration`/`ease` configure a `"tween"`. Fields
 * irrelevant to the chosen `type` are ignored rather than validated.
 *
 * @example
 * ```ts
 * const spring: AnimationConfig = { type: "spring", stiffness: 300, damping: 30 };
 * const tween: AnimationConfig = { type: "tween", duration: 0.2, ease: "easeOut" };
 * ```
 * @see AnimationPreset
 */
export interface AnimationConfig {
  /** Motion model to use. */
  readonly type?: AnimationPreset;
  /** Spring stiffness; higher values produce faster, snappier motion. Only used when `type` is `"spring"`. */
  readonly stiffness?: number;
  /** Spring damping; higher values reduce oscillation/bounce. Only used when `type` is `"spring"`. */
  readonly damping?: number;
  /** Tween duration in seconds. Only used when `type` is `"tween"`. */
  readonly duration?: number;
  /** Tween easing function name (e.g. `"easeOut"`, `"linear"`). Only used when `type` is `"tween"`. */
  readonly ease?: string;
}
