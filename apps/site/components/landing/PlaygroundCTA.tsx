import Link from "next/link";

export function PlaygroundCTA() {
  return (
    <div className="playground-cta-section dot-grid">
      <div className="playground-cta-inner">
        <span className="badge" style={{ marginBottom: 24 }}>
          No account needed · No API key for builder mode
        </span>
        <h2 className="display-lg" style={{ marginBottom: 20 }}>
          See it live.
        </h2>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: 36, lineHeight: 1.7 }}>
          Upload a dashboard screenshot — or drag widgets yourself — and get production-ready{" "}
          <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.95em" }}>@dashcraft/core</span>{" "}
          code in seconds.
        </p>
        <Link href="/playground" className="btn btn-primary btn-lg">
          Open Playground →
        </Link>
        <p style={{ marginTop: 20, fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Builder mode · AI Import · Code Export · Project Zip
        </p>
      </div>
    </div>
  );
}
