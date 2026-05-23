export default function PlaygroundLoading() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 60px)",
      background: "var(--bg-base)",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 8px)",
          gridTemplateRows: "repeat(3, 8px)",
          gap: "4px",
          animation: "pulse 1.4s ease-in-out infinite",
        }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "var(--accent)",
              opacity: 0.3 + (i % 3) * 0.2,
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "var(--font-mono)" }}>
          Loading playground…
        </p>
      </div>
    </div>
  );
}
