import type { Transition, Variants } from "framer-motion";

/**
 * Motion vocabulary for the dashcraft site — spring-physics first.
 * Springs express "aliveness" (the drag/resize/reflow story); eased tweens are
 * reserved for opacity/colour only. Everything here animates transform/opacity/
 * filter exclusively so it stays compositor-only.
 */

/** Three named springs, tuned by the weight of what they move. */
export const spring = {
  /** Buttons, toggles, press — instant, no overshoot to speak of. */
  snappy: { type: "spring", stiffness: 520, damping: 32, mass: 0.7 },
  /** Cards, panels, layout reflow — the default for tiles. */
  smooth: { type: "spring", stiffness: 260, damping: 30, mass: 1 },
  /** Hero and large reveals — a slow, lofted settle. */
  lofted: { type: "spring", stiffness: 120, damping: 22, mass: 1.1 },
} as const satisfies Record<string, Transition>;

/** Expo-out family for fades/reveals where a spring would feel loose. */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Reveal-on-scroll: rise + de-blur. The blur is the premium tell (Linear-style). */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: ease.out },
  },
};

/** Container that staggers its children into view in reading order. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** Child of {@link stagger} — springs up into place. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.smooth },
};

/** whileHover/whileTap for any pressable control. */
export const pressable = {
  whileHover: { y: -2, transition: spring.snappy },
  whileTap: { scale: 0.97, transition: spring.snappy },
} as const;

/** Subtle lift for bento/product cards. Pair with a pointer-tilt for 3D. */
export const cardHover = {
  whileHover: { y: -4, scale: 1.012, transition: spring.smooth },
} as const;

/** Shared viewport config so every reveal fires once, slightly early. */
export const inView = { once: true, margin: "-12% 0px 0px" } as const;
