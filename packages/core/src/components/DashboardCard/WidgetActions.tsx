import React from "react";
import { GripVertical, MoveDiagonal } from "lucide-react";
import { useDashboardStore } from "../../store";

// ============================================================
// Action Button Position
// ============================================================

/**
 * Corner (or second-slot) anchor for a widget action button, relative to the card.
 *
 * `"top-left-second"` sits just to the right of `"top-left"` so a drag handle and a
 * settings/second button can coexist in the top-left without overlapping.
 *
 * @see {@link WidgetActionButtonProps.position}
 */
export type ActionButtonPosition = "top-left" | "top-left-second" | "top-right" | "bottom-left" | "bottom-right";

// ============================================================
// WidgetActionButton Props
// ============================================================

/**
 * Props for {@link WidgetActionButton}. Extra unknown keys are spread onto the underlying
 * `<button>` (used to forward drag attributes/listeners from {@link useDraggable}).
 */
export interface WidgetActionButtonProps {
  /** Button position in the widget */
  position: ActionButtonPosition;
  /** Icon to display */
  icon: React.ReactNode;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Tooltip text */
  tooltip?: string;
  /** Additional className */
  className?: string;
  /** Whether button is visible */
  visible?: boolean;
  /** Additional props to spread onto the button element (e.g., drag attributes/listeners) */
  [key: string]: unknown;
}

// ============================================================
// Position Styles Map
// ============================================================

const positionStyles: Record<ActionButtonPosition, string> = {
  "top-left": "top-1 left-1",
  "top-left-second": "top-1 left-7",
  "top-right": "top-1 right-1",
  "bottom-left": "bottom-1 left-1",
  "bottom-right": "bottom-1 right-1",
};

// ============================================================
// WidgetActionButton Component
// ============================================================

/**
 * A small, absolutely-positioned icon button anchored to a corner of a widget card.
 *
 * The low-level primitive behind the card's toolbar affordances (drag, resize, delete, settings).
 * Use it when composing a custom widget chrome; returns `null` when `visible` is `false`. Any
 * extra props are forwarded to the `<button>`, which is how drag attributes/listeners are attached.
 *
 * @param props - see {@link WidgetActionButtonProps}.
 * @returns The button, or `null` when hidden.
 *
 * @example
 * ```tsx
 * import { WidgetActions, WidgetActionButton } from "@dashcraft/core";
 * import { Trash2 } from "lucide-react";
 *
 * <WidgetActions>
 *   <WidgetActionButton position="top-right" icon={<Trash2 size={12} />} tooltip="Remove" onClick={remove} />
 * </WidgetActions>
 * ```
 *
 * @see {@link WidgetActions} for the container.
 * @see {@link DragHandleButton} for the pre-built drag affordance.
 */
export const WidgetActionButton = React.memo(function WidgetActionButton({
  position,
  icon,
  onClick,
  tooltip,
  className = "",
  visible = true,
  ...rest
}: WidgetActionButtonProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className={`widget-action-btn absolute ${positionStyles[position]}
        flex items-center justify-center
        w-6 h-6 rounded
        bg-slate-100
        border border-slate-300
        text-slate-600
        hover:text-slate-800
        hover:bg-slate-200
        hover:border-slate-400
        shadow-sm hover:shadow-md
        transition-all duration-150 ease-in-out
        cursor-pointer
        pointer-events-auto
        z-10
        ${className}`}
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip}
      {...rest}
    >
      {icon}
    </button>
  );
});

WidgetActionButton.displayName = "WidgetActionButton";

// ============================================================
// WidgetActions Props
// ============================================================

/** Props for {@link WidgetActions}, the overlay container for {@link WidgetActionButton}s. */
export interface WidgetActionsProps {
  /** Whether actions should be visible */
  visible?: boolean;
  /** Children action buttons */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

// ============================================================
// WidgetActions Component
// ============================================================

/**
 * An absolutely-positioned overlay that hosts a widget's action buttons and fades them in/out.
 *
 * Renders its children (typically {@link WidgetActionButton}s) inside the card's bounds and is
 * marked `aria-hidden` since the affordances duplicate keyboard-accessible controls. Returns
 * `null` when `visible` is `false`.
 *
 * @param props - see {@link WidgetActionsProps}.
 * @returns The overlay, or `null` when hidden.
 *
 * @example
 * ```tsx
 * import { WidgetActions, DragHandleButton } from "@dashcraft/core";
 *
 * <WidgetActions visible={isEditMode}>
 *   <DragHandleButton dragAttributes={attributes} dragListeners={listeners} />
 * </WidgetActions>
 * ```
 *
 * @see {@link WidgetActionButton}
 * @see {@link DragHandleButton}
 */
export const WidgetActions = React.memo(function WidgetActions({
  visible = true,
  children,
  className = "",
}: WidgetActionsProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`widget-actions absolute inset-1 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
});

WidgetActions.displayName = "WidgetActions";

// ============================================================
// DragHandleButton (Pre-built drag handle)
// ============================================================

/**
 * Props for {@link DragHandleButton}. `dragAttributes`/`dragListeners` come straight from a
 * {@link useDraggable} call and are spread onto the button so pointer-drag activates there.
 */
export interface DragHandleButtonProps {
  /**
   * Whether the handle is shown.
   * @default true
   */
  visible?: boolean;
  /** Additional className */
  className?: string;
  /** Drag attributes from {@link useDraggable} (`attributes`) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragAttributes?: Record<string, any> | undefined;
  /** Drag listeners from {@link useDraggable} (`listeners`) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragListeners?: Record<string, any> | undefined;
}

/**
 * A ready-made drag handle button (grip icon, top-left) that wires dnd-kit drag attributes onto
 * a {@link WidgetActionButton}.
 *
 * Drop it into a card's chrome and forward the `attributes`/`listeners` from {@link useDraggable}
 * so grabbing the handle starts a drag. Unlike {@link WidgetActionButton}, it always renders an
 * element (never `null`) so the layout slot is stable.
 *
 * @param props - see {@link DragHandleButtonProps}.
 * @returns The drag handle button element.
 *
 * @example
 * ```tsx
 * import { DragHandleButton, useDraggable } from "@dashcraft/core";
 *
 * const { attributes, listeners } = useDraggable({ id: "chart-1" });
 * <DragHandleButton dragAttributes={attributes} dragListeners={listeners} />
 * ```
 *
 * @see {@link useDraggable}
 * @see {@link WidgetActionButton}
 */
export const DragHandleButton = React.memo(function DragHandleButton({
  visible = true,
  className = "",
  dragAttributes,
  dragListeners,
}: DragHandleButtonProps): React.JSX.Element {
  return (
    <WidgetActionButton
      position="top-left"
      icon={<GripVertical size={11} />}
      tooltip="Drag to move"
      visible={visible}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      {...(dragAttributes ?? {})}
      {...(dragListeners ?? {})}
    />
  );
});

DragHandleButton.displayName = "DragHandleButton";

// ============================================================
// ResizeHandleButton (Pre-built resize handle)
// ============================================================

export interface ResizeHandleButtonProps {
  /** Whether button is visible */
  visible?: boolean;
  /** Button position in the widget */
  position: ActionButtonPosition;
  /** Additional className */
  className?: string;
  /** Mouse down handler for resize */
  onMouseDown?: (e: React.MouseEvent) => void;
  /** Touch start handler for resize */
  onTouchStart?: (e: React.TouchEvent) => void;
  /** Custom style to override default positioning */
  style?: React.CSSProperties;
}

// Document-level pointerdown listener to block dnd-kit before it sees the event.
// dnd-kit's PointerSensor listens at document level, so we must also listen there
// and fire BEFORE it does (both use capture phase, first registered wins).
let documentListenerRegistered = false;

function ensureDocumentListener(): void {
  // SSR-safe: no-op on the server. Registering at import time must never touch
  // `document` during server rendering (Next.js, Remix, etc.).
  if (typeof document === "undefined") return;
  if (documentListenerRegistered) return;
  documentListenerRegistered = true;

  document.addEventListener(
    "pointerdown",
    (e: PointerEvent): void => {
      const target = e.target as HTMLElement;
      // Check if the click is on a resize handle button
      const resizeBtn = target.closest?.("[data-resize-handle-btn]");
      if (resizeBtn) {
        e.stopImmediatePropagation();
        // Also set isResizing in the store immediately
        useDashboardStore.getState().setIsResizing(true);
      }
    },
    { capture: true }
  );
}

// Register at module load time — before any component renders,
// ensuring this listener fires before dnd-kit's listener.
ensureDocumentListener();

export const ResizeHandleButton = React.memo(function ResizeHandleButton({
  visible = true,
  position,
  className = "",
  onMouseDown,
  onTouchStart,
  style,
}: ResizeHandleButtonProps): React.JSX.Element {

  if (!visible) {
    return <></> as unknown as React.JSX.Element;
  }

  return (
    <button
      type="button"
      data-resize-handle-btn=""
      className={`widget-action-btn absolute ${positionStyles[position]}
        flex items-center justify-center
        w-6 h-6 rounded
        bg-indigo-50
        border border-indigo-200
        text-indigo-500
        hover:text-indigo-700
        hover:bg-indigo-100
        hover:border-indigo-400
        shadow-sm hover:shadow-md
        transition-all duration-150 ease-in-out
        cursor-nwse-resize
        pointer-events-auto
        z-10
        ${className}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      title="Resize widget"
      aria-label="Resize widget"
      style={style}
    >
      <MoveDiagonal size={10} />
    </button>
  );
});

ResizeHandleButton.displayName = "ResizeHandleButton";
