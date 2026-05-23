// ============================================================
// Animation Types
// ============================================================

/**
 * Available animation preset types.
 */
export type AnimationPreset = "spring" | "tween" | "inertia";

/**
 * Configuration for widget animations.
 */
export interface AnimationConfig {
  /** Animation type */
  readonly type?: AnimationPreset;
  /** Spring stiffness (higher = faster) */
  readonly stiffness?: number;
  /** Spring damping (higher = less bouncy) */
  readonly damping?: number;
  /** Tween duration in seconds */
  readonly duration?: number;
  /** Tween easing function */
  readonly ease?: string;
}