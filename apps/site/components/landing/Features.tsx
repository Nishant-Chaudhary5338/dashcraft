const FEATURES = [
  {
    symbol: "⌥",
    title: "Boolean API",
    desc: "drag resize settings delete responsive — five props. Full behavioural control with no configuration objects, no layout arrays, no boilerplate.",
  },
  {
    symbol: "◈",
    title: "Headless by Design",
    desc: "Zero opinion on colours or spacing. Bring Tailwind, CSS Modules, or anything else. Your dashboard looks exactly like your product — not ours.",
  },
  {
    symbol: "⬡",
    title: "Chart-Agnostic",
    desc: "recharts and nivo are optional peer deps. Use one, both, or neither. Drop any chart renderer inside a DashboardCard and it just works.",
  },
  {
    symbol: "✦",
    title: "AI-Native",
    desc: "Ships with llms.txt, a typed MCP codegen server, and AGENTS.md. Your AI coding assistant understands the API from the first keystroke.",
  },
  {
    symbol: "⌖",
    title: "@dnd-kit Powered",
    desc: "WCAG-compliant drag-and-drop with full keyboard navigation and screen reader announcements. No compromises on accessibility.",
  },
  {
    symbol: "◌",
    title: "Persistent Layouts",
    desc: "Pass persist=\"key\" and dashcraft automatically saves and restores every widget position across sessions. One prop — no backend required.",
  },
];

export function Features() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 60 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent-hover)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            Features
          </p>
          <h2 className="display-lg" style={{ maxWidth: 560 }}>
            Everything a dashboard needs.<br />Nothing it doesn't.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ fontSize: "1.1rem" }}>
                {f.symbol}
              </div>
              <p className="feature-title">{f.title}</p>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
