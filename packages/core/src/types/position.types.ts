// ============================================================
// Position & Size Types
// ============================================================

/**
 * 2D coordinates locating a widget on the dashboard canvas.
 *
 * Represents the top-left anchor point of a widget in pixels, relative to
 * the dashboard container's origin (0, 0 = top-left of the canvas). Used
 * wherever a widget's placement needs to be read or updated, e.g. drag
 * handlers and {@link DashboardContextValue.updateWidgetPosition}.
 *
 * @example
 * ```ts
 * const pos: Position = { x: 120, y: 40 };
 * ```
 * @see WidgetState
 * @see DashboardContextValue
 */
export interface Position {
  /** Horizontal offset from the canvas origin, in pixels. */
  readonly x: number;
  /** Vertical offset from the canvas origin, in pixels. */
  readonly y: number;
}

/**
 * Pixel dimensions of a widget's rendered box.
 *
 * Paired with {@link Position} to fully describe a widget's rect on the
 * canvas. Used for both current widget size ({@link WidgetState.size}) and
 * default sizing when registering a widget ({@link WidgetRegistrationConfig.defaultSize}).
 *
 * @example
 * ```ts
 * const size: Size = { width: 320, height: 240 };
 * ```
 * @see WidgetState
 * @see DashboardContextValue
 */
export interface Size {
  /** Width of the widget, in pixels. */
  readonly width: number;
  /** Height of the widget, in pixels. */
  readonly height: number;
}
