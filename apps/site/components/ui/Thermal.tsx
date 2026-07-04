/**
 * Warm "thermal" glow field — two blurred, slowly drifting brand-hue blobs.
 * Purely decorative depth; place inside a `position: relative; overflow: hidden`
 * parent. Animation pauses under `prefers-reduced-motion`.
 */
export function Thermal({ className = "" }: { className?: string }): React.ReactElement {
  return <div aria-hidden className={`thermal ${className}`} />;
}
