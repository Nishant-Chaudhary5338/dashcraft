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
 * Named collection of all built-in animation presets, keyed by
 * {@link AnimationPresetKey}. Use these for consistent motion across the
 * dashboard instead of inventing per-widget spring/tween values.
 *
 * Each entry is either a spring config (`type: "spring"` with `stiffness`/
 * `damping`, optionally `mass`) or a tween config (`type: "tween"` with
 * `duration` in seconds) — shape it directly to a Framer Motion `transition`
 * prop, or run it through {@link springToCss} / {@link getCssTransition} to
 * get a plain CSS transition string.
 *
 * @example
 * ```tsx
 * import { animationPresets } from "@dashcraft/core";
 *
 * // In framer-motion
 * <motion.div animate={{ x: 100 }} transition={animationPresets.spring} />
 *
 * // In CSS (via getCssTransition)
 * const style = { transition: getCssTransition("snappy", "transform") };
 * ```
 * @see getAnimationPreset
 * @see getCssTransition
 * @see AnimationPresetKey
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
 * Union of every valid key into {@link animationPresets} (`"spring"` |
 * `"snappy"` | `"gentle"` | `"tween"` | `"bounce"` | `"stiff"` | `"slow"`).
 *
 * Use this type wherever an API accepts a preset name, e.g.
 * {@link getAnimationPreset} and {@link getCssTransition}.
 * @example
 * ```ts
 * import type { AnimationPresetKey } from "@dashcraft/core";
 *
 * function applyPreset(key: AnimationPresetKey) { ... }
 * ```
 * @see animationPresets
 */
export type AnimationPresetKey = keyof typeof animationPresets;

/**
 * Looks up a single animation preset by its key.
 *
 * Equivalent to `animationPresets[key]`, provided as a function for call
 * sites that prefer not to import the full `animationPresets` object.
 * @param key - One of {@link AnimationPresetKey}.
 * @returns The preset's spring or tween configuration.
 * @example
 * ```ts
 * import { getAnimationPreset } from "@dashcraft/core";
 *
 * const spring = getAnimationPreset("bounce");
 * ```
 * @see animationPresets
 */
export function getAnimationPreset(key: AnimationPresetKey) {
  return animationPresets[key];
}

// ============================================================
// CSS Transition Helpers
// ============================================================

/**
 * Approximates spring physics (stiffness/damping) as a CSS `cubic-bezier()`
 * timing function.
 *
 * CSS has no native spring easing, so this maps the same stiffness/damping
 * inputs used by {@link animationPresets}'s spring entries to the closest
 * cubic-bezier curve — useful when a widget needs spring-like motion via
 * plain CSS transitions rather than Framer Motion. The approximation is
 * deliberately simple and will diverge from true spring physics (e.g. no
 * overshoot) for extreme stiffness/damping combinations.
 * @param stiffness - Spring stiffness; higher values start the motion
 * faster.
 * @default 400
 * @param damping - Spring damping; higher values reduce overshoot.
 * @default 25
 * @returns A `cubic-bezier(x1, y1, x2, y2)` string usable as a CSS
 * `transition-timing-function`.
 * @example
 * ```ts
 * import { springToCss } from "@dashcraft/core";
 *
 * const easing = springToCss(600, 30); // "cubic-bezier(0.27, ...)"
 * ```
 * @see getCssTransition
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
 * Builds a complete CSS `transition` shorthand string from a named
 * animation preset.
 *
 * Resolves the preset via {@link animationPresets}, converts spring presets
 * to an approximate easing curve via {@link springToCss} (tween presets use
 * `ease` via the browser default when no easing keyword is added — the
 * cubic-bezier is only computed for spring-type presets), and combines it
 * with a duration and target CSS property list into one transition value.
 * @param preset - Preset key to base the transition on.
 * @param properties - CSS properties to animate, space-separated.
 * @default "all"
 * @param duration - Overrides the preset's duration, in seconds. For spring
 * presets (which have no inherent duration), defaults to `0.2`; for tween
 * presets, defaults to the preset's own `duration`.
 * @returns A CSS transition value, e.g. `"transform 0.2s cubic-bezier(...)"`.
 * @example
 * ```ts
 * import { getCssTransition } from "@dashcraft/core";
 *
 * const style = { transition: getCssTransition("snappy", "transform, opacity") };
 * ```
 * @see animationPresets
 * @see springToCss
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