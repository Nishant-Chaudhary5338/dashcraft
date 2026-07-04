interface LogoProps {
  /** Render the "dashcraft" wordmark next to the mark. */
  withWordmark?: boolean;
  /** Mark size in px (the wordmark scales with it). */
  size?: number;
  className?: string;
}

/**
 * dashcraft brand mark — an asymmetric bento of dashboard tiles (one filled in
 * the chartreuse signal, two dimmed) that reads as a dashboard mid-assembly.
 * Uses `currentColor` so the tiles inherit the accent from context.
 */
export function Logo({
  withWordmark = true,
  size = 26,
  className = "",
}: LogoProps): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ color: "var(--accent)" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        {/* KPI tile — the signal */}
        <rect x="3" y="3" width="14" height="12" rx="3" fill="currentColor" />
        {/* tall chart tile */}
        <rect x="19" y="3" width="10" height="26" rx="3" fill="currentColor" opacity="0.38" />
        {/* wide tile */}
        <rect x="3" y="17" width="14" height="12" rx="3" fill="currentColor" opacity="0.6" />
      </svg>
      {withWordmark && (
        <span
          className="font-display font-bold tracking-[-0.02em] text-[var(--text-primary)]"
          style={{ fontSize: size * 0.72 }}
        >
          dashcraft
        </span>
      )}
    </span>
  );
}
