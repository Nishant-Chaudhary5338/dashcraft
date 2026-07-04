"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/ui/CopyButton";
import { Thermal } from "@/components/ui/Thermal";
import { revealUp, stagger, pressable, inView } from "@/lib/motion";

/**
 * Final bookend CTA — a big Bricolage headline over the shared thermal glow,
 * the two primary paths (Playground / Docs) and a click-to-copy install line.
 * Mirrors the hero's entrance so the page closes where it opened.
 */
export function BookendCTA(): React.ReactElement {
  return (
    <section className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-surface)]">
      <Thermal />
      <div className="absolute inset-0 dot-grid opacity-60" aria-hidden />

      <motion.div
        className="container relative z-[1] flex flex-col items-center py-28 text-center"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <motion.p variants={revealUp} className="eyebrow mb-6">
          Two ways in
        </motion.p>

        <motion.h2
          variants={revealUp}
          className="max-w-[820px] font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.035em]"
        >
          Start with a screenshot,
          <br />
          or a <span className="text-[var(--accent)]">blank grid</span>.
        </motion.h2>

        <motion.div variants={revealUp} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <motion.div whileHover={pressable.whileHover} whileTap={pressable.whileTap}>
            <Link href="/playground" className="btn btn-primary btn-lg">
              Open the Playground →
            </Link>
          </motion.div>
          <motion.div whileHover={pressable.whileHover} whileTap={pressable.whileTap}>
            <Link href="/docs" className="btn btn-ghost btn-lg">
              Read the Docs
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={revealUp} className="mt-8 install-snippet">
          <span className="prompt">$</span>
          <span className="pkg">npm create dashcraft</span>
          <CopyButton text="npm create dashcraft" />
        </motion.div>

        <motion.p variants={revealUp} className="mt-6 font-mono text-[13px] text-[var(--text-muted)]">
          MIT · own the whole repo · deploy anywhere
        </motion.p>
      </motion.div>
    </section>
  );
}
