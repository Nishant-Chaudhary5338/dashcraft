import { useEffect, useRef, useState } from "react";

/**
 * A DOM element's measured content-box dimensions, rounded to whole
 * pixels.
 */
export interface ElementSize {
  /** Content-box width in pixels, rounded. `0` before the first measurement. */
  readonly width: number;
  /** Content-box height in pixels, rounded. `0` before the first measurement. */
  readonly height: number;
}

/**
 * Measures an element's content-box size live via `ResizeObserver`.
 *
 * Headless logic for building width/height-driven responsive widget
 * views — attach the returned ref to the element you want to observe and
 * use the size to drive your own layout/rendering decisions (e.g. switch
 * a chart's orientation once width drops below some threshold). Falls
 * back to `{ width: 0, height: 0 }` in environments without
 * `ResizeObserver` (e.g. some test/SSR environments).
 *
 * @returns A `[ref, size]` tuple: attach `ref` to the element to measure;
 * `size` is `{ width: 0, height: 0 }` until the first measurement, then
 * updates on every resize.
 *
 * @example
 * ```tsx
 * import { useMeasure } from "@dashcraft/core";
 *
 * function ResponsiveChart() {
 *   const [ref, { width, height }] = useMeasure<HTMLDivElement>();
 *   return (
 *     <div ref={ref} className="h-full w-full">
 *       {width > 0 && <Chart width={width} height={height} />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useMeasureWidth} for a width-only convenience version.
 * @see {@link useResize} if you need to actively control (not just observe) size.
 */
export function useMeasure<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  ElementSize,
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const box = entry.contentBoxSize?.[0];
        setSize({
          width: Math.round(box?.inlineSize ?? entry.contentRect.width),
          height: Math.round(box?.blockSize ?? entry.contentRect.height),
        });
      }
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}

/**
 * Convenience wrapper around {@link useMeasure} for the common case of
 * only needing an element's width (e.g. picking a breakpoint-driven
 * layout).
 *
 * @returns A `[ref, width]` tuple; `width` is `0` until the first measurement.
 *
 * @example
 * ```tsx
 * import { useMeasureWidth } from "@dashcraft/core";
 *
 * function AdaptiveList() {
 *   const [ref, width] = useMeasureWidth<HTMLUListElement>();
 *   return <ul ref={ref}>{width > 600 ? <WideLayout /> : <NarrowLayout />}</ul>;
 * }
 * ```
 *
 * @see {@link useMeasure}
 */
export function useMeasureWidth<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  number,
] {
  const [ref, size] = useMeasure<T>();
  return [ref, size.width];
}
