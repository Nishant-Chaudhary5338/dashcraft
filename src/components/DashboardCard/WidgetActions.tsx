import React from "react";
import { GripVertical, MoveDiagonal } from "lucide-react";
import { useDashboardStore } from "../../store";

// ============================================================
// Action Button Position
// ============================================================

export type ActionButtonPosition = "top-left" | "top-left-second" | "top-right" | "bottom-left" | "bottom-right";

// ============================================================
// WidgetActionButton Props
// ============================================================

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

export interface DragHandleButtonProps {
  /** Whether button is visible */
  visible?: boolean;
  /** Additional className */
  className?: string;
  /** Drag attributes from useDraggable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragAttributes?: Record<string, any> | undefined;
  /** Drag listeners from useDraggable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragListeners?: Record<string, any> | undefined;
}

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
  if (documentListenerRegistered) return;
  documentListenerRegistered = true;

  document.addEventListener(
    "pointerdown",
    (e: PointerEvent): void => {
      const target = e.target as HTMLElement;
      // Check if the click is on a resize handle button
      const resizeBtn = target.closest?.("[data-resize-handle-btn]");
      if (resizeBtn) {
        console.log("[DEBUG] Document listener: resize handle detected, blocking dnd-kit");
        e.stopImmediatePropagation();
        // Also set isResizing in the store immediately
        useDashboardStore.getState().setIsResizing(true);
      }
    },
    { capture: true }
  );
  console.log("[DEBUG] Document-level pointerdown listener registered");
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
