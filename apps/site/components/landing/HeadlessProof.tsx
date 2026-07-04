"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { revealUp, spring, pressable, inView } from "@/lib/motion";

type ThemeId = "default" | "brutalist" | "glass";

interface Skin {
  id: ThemeId;
  label: string;
  note: string;
  /** CSS-var overrides applied to the SAME card markup — this is the whole point. */
  vars: CSSProperties;
}

const SKINS: readonly Skin[] = [
  {
    id: "default",
    label: "Default",
    note: "No opinions shipped. Behaviour only.",
    vars: {
      "--card-bg": "var(--bg-elevated)",
      "--card-border": "1px solid var(--border)",
      "--card-radius": "12px",
      "--card-shadow": "none",
      "--card-blur": "none",
      "--card-accent": "var(--accent)",
      "--card-heading": "var(--font-display)",
    } as CSSProperties,
  },
  {
    id: "brutalist",
    label: "Brutalist",
    note: "Hard edges, thick borders, mono type.",
    vars: {
      "--card-bg": "var(--bg-base)",
      "--card-border": "2px solid var(--text-primary)",
      "--card-radius": "0px",
      "--card-shadow": "6px 6px 0 var(--text-primary)",
      "--card-blur": "none",
      "--card-accent": "var(--cta)",
      "--card-heading": "var(--font-mono)",
    } as CSSProperties,
  },
  {
    id: "glass",
    label: "Glass",
    note: "Translucent, blurred, soft radius.",
    vars: {
      "--card-bg": "rgba(255,252,245,0.06)",
      "--card-border": "1px solid rgba(255,252,245,0.16)",
      "--card-radius": "18px",
      "--card-shadow": "0 24px 60px -20px rgba(0,0,0,0.6)",
      "--card-blur": "blur(14px)",
      "--card-accent": "var(--accent)",
      "--card-heading": "var(--font-display)",
    } as CSSProperties,
  },
] as const;

const BARS = [48, 66, 54, 82, 60, 74] as const;

/** The one card that gets restyled — reads only from --card-* vars. */
function ProofCard(): React.ReactElement {
  return (
    <div
      className="w-full max-w-[380px] p-6"
      style={{
        background: "var(--card-bg)",
        border: "var(--card-border)",
        borderRadius: "var(--card-radius)",
        boxShadow: "var(--card-shadow)",
        backdropFilter: "var(--card-blur)",
        WebkitBackdropFilter: "var(--card-blur)",
      }}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]"
          style={{ fontFamily: "var(--card-heading)" }}
        >
          Revenue
        </p>
        <span className="h-2 w-2 rounded-full" style={{ background: "var(--card-accent)" }} />
      </div>
      <p
        className="mt-2 text-3xl font-bold tracking-[-0.02em] text-[var(--text-primary)]"
        style={{ fontFamily: "var(--card-heading)" }}
      >
        $284,621
      </p>
      <p className="mt-1 font-mono text-[12px]" style={{ color: "var(--card-accent)" }}>
        ↑ 12.4% this month
      </p>
      <div className="mt-5 flex items-end gap-1.5" style={{ height: 48 }}>
        {BARS.map((h, i) => (
          <i
            key={i}
            className="flex-1"
            style={{ height: `${h}%`, background: "var(--card-accent)", opacity: 0.35 + i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * "Unstyled on purpose. Your tokens win." A segmented control restyles the SAME
 * card live via CSS-variable overrides — proving the engine is truly headless.
 * The swap springs (scale settle) so the reskin feels physical, not a cut.
 */
export function HeadlessProof(): React.ReactElement {
  const [active, setActive] = useState<ThemeId>("default");
  const skin = SKINS.find((s) => s.id === active) ?? SKINS[0];

  return (
    <section className="section">
      <div className="container grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={revealUp} initial="hidden" whileInView="show" viewport={inView}>
          <p className="eyebrow mb-5">Headless by design</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Unstyled on purpose.
            <br />
            <span className="text-[var(--accent)]">Your tokens win.</span>
          </h2>
          <p className="mt-5 max-w-[440px] text-[1.05rem] leading-relaxed text-[var(--text-secondary)]">
            The engine ships behaviour — drag, resize, persist — and zero visual
            opinions. Same card, three identities. Nothing to override, nothing
            to fight.
          </p>

          <div className="tab-list mt-8" role="tablist" aria-label="Preview theme">
            {SKINS.map((s) => (
              <motion.button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active === s.id}
                onClick={() => setActive(s.id)}
                className={`tab-btn${active === s.id ? " active" : ""}`}
                whileTap={pressable.whileTap}
              >
                {s.label}
              </motion.button>
            ))}
          </div>
          <p className="mt-3 font-mono text-[12px] text-[var(--text-muted)]">{skin.note}</p>
        </motion.div>

        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="flex min-h-[280px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 dot-grid"
        >
          <motion.div
            key={active}
            style={skin.vars}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={spring.smooth}
            className="flex w-full justify-center"
          >
            <ProofCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
