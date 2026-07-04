"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { revealUp, stagger, staggerItem, ease, inView } from "@/lib/motion";

/** Pre-baked "generated" JSX — a masked/typed reveal, no network, no parsing. */
const CODE_LINES: readonly { indent: number; html: string }[] = [
  { indent: 0, html: `<span class="tok-tag">&lt;Dashboard</span> <span class="tok-attr">cols</span><span class="tok-punct">=</span><span class="tok-number">{12}</span><span class="tok-tag">&gt;</span>` },
  { indent: 1, html: `<span class="tok-tag">&lt;Card</span> <span class="tok-attr">span</span><span class="tok-punct">=</span><span class="tok-number">{4}</span> <span class="tok-attr">metric</span><span class="tok-punct">=</span><span class="tok-string">"Revenue"</span> <span class="tok-tag">/&gt;</span>` },
  { indent: 1, html: `<span class="tok-tag">&lt;Card</span> <span class="tok-attr">span</span><span class="tok-punct">=</span><span class="tok-number">{4}</span> <span class="tok-attr">metric</span><span class="tok-punct">=</span><span class="tok-string">"Users"</span> <span class="tok-tag">/&gt;</span>` },
  { indent: 1, html: `<span class="tok-tag">&lt;AreaChart</span> <span class="tok-attr">span</span><span class="tok-punct">=</span><span class="tok-number">{8}</span> <span class="tok-attr">series</span><span class="tok-punct">=</span><span class="tok-string">"sessions"</span> <span class="tok-tag">/&gt;</span>` },
  { indent: 1, html: `<span class="tok-tag">&lt;BarChart</span> <span class="tok-attr">span</span><span class="tok-punct">=</span><span class="tok-number">{4}</span> <span class="tok-attr">series</span><span class="tok-punct">=</span><span class="tok-string">"channels"</span> <span class="tok-tag">/&gt;</span>` },
  { indent: 0, html: `<span class="tok-tag">&lt;/Dashboard&gt;</span>` },
];

const BARS = [46, 70, 52, 84, 64] as const;

/** Left panel — a poster dashboard screenshot with an animated scan-line sweep. */
function SourcePoster(): React.ReactElement {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
        dashboard-final.png
      </p>
      <div className="grid grid-cols-6 gap-2" style={{ gridAutoRows: "44px" }}>
        <div className="col-span-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2">
          <div className="h-1.5 w-10 rounded bg-[var(--border-hover)]" />
          <div className="mt-1.5 h-3 w-16 rounded bg-[var(--text-muted)]/40" />
        </div>
        <div className="col-span-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2">
          <div className="h-1.5 w-10 rounded bg-[var(--border-hover)]" />
          <div className="mt-1.5 h-3 w-14 rounded bg-[var(--text-muted)]/40" />
        </div>
        <div className="col-span-4 row-span-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2">
          <div className="h-1.5 w-12 rounded bg-[var(--border-hover)]" />
          <div className="mt-3 h-[52%] w-full rounded bg-gradient-to-t from-[var(--accent-subtle)] to-transparent" />
        </div>
        <div className="col-span-2 row-span-2 flex items-end gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2">
          {BARS.map((h, i) => (
            <i key={i} className="flex-1 rounded-t-[2px] bg-[var(--text-muted)]/45" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* Scan-line sweep — pure transform/opacity, respects reduced-motion via CSS. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[46%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--accent-subtle) 60%, transparent), linear-gradient(to bottom, transparent 94%, var(--accent) 96%, transparent)",
          mixBlendMode: "screen",
        }}
        animate={{ y: ["-46%", "220%"] }}
        transition={{ duration: 2.4, ease: ease.inOut, repeat: Infinity, repeatDelay: 0.6 }}
      />
    </div>
  );
}

/** Right panel — generated code materializing into a small rendered result. */
function GeneratedOutput({ progress }: { progress: MotionValue<string> }): React.ReactElement {
  return (
    <div className="code-window">
      <div className="code-window-bar">
        <span className="code-filename">Dashboard.tsx</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-[var(--accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          GENERATED
        </span>
      </div>
      <motion.div
        className="code-content"
        style={{ WebkitMaskImage: progress, maskImage: progress }}
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <pre>
          {CODE_LINES.map((line, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              style={{ paddingLeft: line.indent * 16 }}
              dangerouslySetInnerHTML={{ __html: line.html }}
            />
          ))}
        </pre>
      </motion.div>
    </div>
  );
}

/**
 * The signature "wow" — drop a screenshot on the left, watch it become live
 * dashcraft-core code (masked/typed reveal) on the right. A scroll-linked mask
 * wipes the code in as the section enters; a scan-line sweeps the source poster.
 */
export function ScreenshotToCode(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.55"] });
  // Scroll drives the reveal mask — code wipes top→bottom as you scroll in.
  const mask = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "linear-gradient(to bottom, #000 0%, transparent 6%)",
      "linear-gradient(to bottom, #000 100%, transparent 106%)",
    ],
  );

  return (
    <section className="section">
      <div className="container">
        <motion.div variants={revealUp} initial="hidden" whileInView="show" viewport={inView} className="max-w-[560px]">
          <p className="eyebrow mb-5">The signature move</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            A screenshot in.{" "}
            <span className="text-[var(--accent)]">Shippable code</span> out.
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-[var(--text-secondary)]">
            Point the AI at any dashboard image. It reads the widgets, the grid
            and the charts, then emits real components — not a throwaway mock.
          </p>
        </motion.div>

        <div ref={ref} className="mt-12 grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]">
          <SourcePoster />

          <div className="flex items-center justify-center py-2 lg:py-0">
            <motion.span
              aria-hidden
              className="font-mono text-2xl text-[var(--accent)]"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.6, ease: ease.inOut, repeat: Infinity }}
            >
              <span className="hidden lg:inline">→</span>
              <span className="lg:hidden">↓</span>
            </motion.span>
          </div>

          <GeneratedOutput progress={mask} />
        </div>
      </div>
    </section>
  );
}
