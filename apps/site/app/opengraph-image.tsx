import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "dashcraft — Ship the dashboard, not the prototype.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette: warm graphite bg + chartreuse accent. System fonts keep it
// self-contained (no font fetch), so the image always renders at build time.
export default function OpenGraphImage() {
  const bg = "#0E0C0A";
  const accent = "#C2FF3D";
  const muted = "#B8B2A8";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: "72px 80px",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Radial accent glow */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: accent,
            opacity: 0.14,
            filter: "blur(40px)",
            display: "flex",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: muted,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 16,
              height: 16,
              borderRadius: 4,
              background: accent,
            }}
          />
          Headless React dashboard library · MIT
        </div>

        {/* Wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              fontSize: 168,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              color: "#FBFAF8",
            }}
          >
            dashcraft
            <span style={{ display: "flex", color: accent }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 46,
              fontWeight: 600,
              color: accent,
              letterSpacing: -1,
            }}
          >
            Ship the dashboard, not the prototype.
          </div>
        </div>

        {/* Footer facts */}
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 27,
            color: muted,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          }}
        >
          <span style={{ display: "flex" }}>dashcraft-core</span>
          <span style={{ display: "flex", color: "#4A453D" }}>·</span>
          <span style={{ display: "flex" }}>screenshot → code</span>
          <span style={{ display: "flex", color: "#4A453D" }}>·</span>
          <span style={{ display: "flex" }}>own your repo</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
