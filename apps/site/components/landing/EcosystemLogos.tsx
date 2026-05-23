const ITEMS = [
  "React", "TypeScript", "Vite", "Next.js", "Tailwind CSS",
  "recharts", "nivo", "@dnd-kit", "Zustand", "Framer Motion",
  "shadcn/ui", "Radix UI", "TanStack Query",
];

export function EcosystemLogos() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <section style={{ padding: "48px 0", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
      <p style={{
        textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.72rem",
        color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 28,
      }}>
        Works beautifully with
      </p>
      <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-divider" style={{ marginLeft: 32, color: "var(--border)" }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
