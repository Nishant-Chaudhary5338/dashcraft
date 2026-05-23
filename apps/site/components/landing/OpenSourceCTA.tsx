export function OpenSourceCTA() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 700, textAlign: "center", margin: "0 auto" }}>
        <span className="badge" style={{ marginBottom: 28 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--success)" }}>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          MIT Licensed · Free Forever
        </span>

        <h2 className="display-lg" style={{ marginBottom: 20 }}>
          Your next dashboard is<br />one afternoon away.
        </h2>

        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 40 }}>
          dashcraft is free, open source, and MIT licensed. No per-seat fees.
          No vendor lock-in. No design opinions. Just a clean boolean API,
          accessible drag-and-drop, and the chart library you already use.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://github.com/nishant-chaudhary/dashcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            View on GitHub
          </a>
          <a
            href="https://github.com/nishant-chaudhary/dashcraft/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-lg"
          >
            Join the Community
          </a>
        </div>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[
            ["MIT", "License"],
            ["0", "Dependencies on design"],
            ["5", "Boolean props"],
            ["∞", "Chart libraries"],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
                {num}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
