"use client";

import { motion } from "framer-motion";
import { stagger, staggerItem, cardHover, inView } from "@/lib/motion";

interface Pillar {
  no: string;
  title: string;
  body: string;
}

const PILLARS: readonly Pillar[] = [
  {
    no: "01",
    title: "Screenshot → Code",
    body: "Drop a dashboard image. The AI reads the widgets, layout and charts and emits real dashcraft-core code — not a throwaway prototype.",
  },
  {
    no: "02",
    title: "Headless",
    body: "Behaviour only — drag, resize, persist, theme. Zero visual opinions. Your tokens win, so there's nothing to override and nothing to fight.",
  },
  {
    no: "03",
    title: "You own it",
    body: "Export the whole Vite project. MIT, on npm, deploy anywhere. No runtime, no host, no seats — never hostage to a vendor.",
  },
] as const;

/** The wedge: the three-part mental model, set before the deep-dive sections. */
export function Wedge(): React.ReactElement {
  return (
    <section className="section">
      <motion.div
        className="container grid gap-5 md:grid-cols-3"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {PILLARS.map((p) => (
          <motion.article
            key={p.no}
            variants={staggerItem}
            whileHover={cardHover.whileHover}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-7"
          >
            <span className="font-mono text-[13px] tracking-[0.12em] text-[var(--accent)]">
              // {p.no}
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.02em]">
              {p.title}
            </h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--text-secondary)]">
              {p.body}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
