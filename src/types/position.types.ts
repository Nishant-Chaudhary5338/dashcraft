// ============================================================
// Position & Size Types
// ============================================================

/**
 * 2D position coordinates for widget placement.
 */
export interface Position {
  /** Horizontal position in pixels */
  readonly x: number;
  /** Vertical position in pixels */
  readonly y: number;
}

/**
 * Dimensions for widget sizing.
 */
export interface Size {
  /** Width in pixels */
  readonly width: number;
  /** Height in pixels */
  readonly height: number;
}