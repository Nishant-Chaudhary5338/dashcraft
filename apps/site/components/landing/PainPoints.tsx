export function PainPoints() {
  return (
    <section className="section-sm" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
      <div className="container">
        <div className="pain-grid">
          <div className="pain-cell">
            <p className="pain-problem">"Every dashboard library chooses your design system for you."</p>
            <p className="pain-solution">
              dashcraft is <strong>completely headless</strong>. Your Tailwind, your tokens, your design.
              We ship behaviour — you ship pixels.
            </p>
          </div>
          <div className="pain-cell">
            <p className="pain-problem">"Wiring recharts to react-grid-layout manually takes days."</p>
            <p className="pain-solution">
              Five boolean props. <strong>drag resize settings delete responsive.</strong> That is the entire API for 90% of dashboards.
            </p>
          </div>
          <div className="pain-cell">
            <p className="pain-problem">"AI tools don't know my component API — every suggestion is wrong."</p>
            <p className="pain-solution">
              <strong>llms.txt, MCP codegen server, and AGENTS.md</strong> included. Cursor and Claude understand dashcraft from the first keystroke.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
