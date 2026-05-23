// ============================================================
// Animation Presets
// ============================================================

/**
 * Spring animation preset - balanced spring physics
 * Good for general UI animations
 */
export const springPreset = {
  type: "spring",
  stiffness: 400,
  damping: 25,
} as const;

/**
 * Snappy animation preset - faster, more responsive
 * Good for interactive elements like buttons
 */
export const snappyPreset = {
  type: "spring",
  stiffness: 600,
  damping: 30,
} as const;

/**
 * Gentle animation preset - slower, smoother
 * Good for large movements or background elements
 */
export const gentlePreset = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

/**
 * Tween animation preset - linear timing
 * Good for simple transitions
 */
export const tweenPreset = {
  type: "tween",
  duration: 0.2,
} as const;

/**
 * Bounce animation preset - playful bounce effect
 * Good for attention-grabbing elements
 */
export const bouncePreset = {
  type: "spring",
  stiffness: 300,
  damping: 10,
  mass: 1,
} as const;

/**
 * Stiff animation preset - very responsive
 * Good for drag interactions
 */
export const stiffPreset = {
  type: "spring",
  stiffness: 800,
  damping: 40,
} as const;

/**
 * Slow animation preset - very slow and smooth
 * Good for ambient animations
 */
export const slowPreset = {
  type: "spring",
  stiffness: 100,
  damping: 15,
} as const;

// ============================================================
// Animation Presets Collection
// ============================================================

/**
 * Collection of all animation presets
 * Use these for consistent animations across the dashboard
 *
 * @example
 * ```tsx
 * import { animationPresets } from '@dashcraft/utils';
 *
 * // In framer-motion
 * <motion.div animate={{ x: 100 }} transition={animationPresets.spring}>
 *
 * // In CSS
 * .widget {
 *   transition: transform 0.2s cubic-bezier(...);
 * }
 * ```
 */
export const animationPresets = {
  spring: springPreset,
  snappy: snappyPreset,
  gentle: gentlePreset,
  tween: tweenPreset,
  bounce: bouncePreset,
  stiff: stiffPreset,
  slow: slowPreset,
} as const;

/**
 * Type for animation preset keys
 */
export type AnimationPresetKey = keyof typeof animationPresets;

/**
 * Get an animation preset by key
 * @param key - Preset key
 * @returns Animation preset configuration
 */
export function getAnimationPreset(key: AnimationPresetKey) {
  return animationPresets[key];
}

// ============================================================
// CSS Transition Helpers
// ============================================================

/**
 * Convert spring physics to CSS cubic-bezier approximation
 * @param stiffness - Spring stiffness (default: 400)
 * @param damping - Spring damping (default: 25)
 * @returns CSS cubic-bezier string
 */
export function springToCss(
  stiffness: number = 400,
  damping: number = 25
): string {
  // Approximate spring physics to cubic-bezier
  // Higher stiffness = faster start
  // Higher damping = less overshoot
  const dampingRatio = damping / (2 * Math.sqrt(stiffness));
  const frequency = Math.sqrt(stiffness) / (2 * Math.PI);

  // Approximate cubic-bezier values
  const x1 = Math.min(0.5, dampingRatio * 0.5);
  const y1 = frequency * 0.3;
  const x2 = 1 - x1;
  const y2 = 1 - y1;

  return `cubic-bezier(${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)})`;
}

/**
 * Get CSS transition string for common properties
 * @param preset - Animation preset key
 * @param properties - CSS properties to animate (default: 'all')
 * @param duration - Override duration in seconds
 * @returns CSS transition string
 */
export function getCssTransition(
  preset: AnimationPresetKey,
  properties: string = "all",
  duration?: number
): string {
  const config = animationPresets[preset];
  const cssDuration = duration ?? (config.type === "tween" ? config.duration : 0.2);
  const easing = springToCss(
    config.type === "spring" ? config.stiffness : 400,
    config.type === "spring" ? config.damping : 25
  );

  return `${properties} ${cssDuration}s ${easing}`;
}