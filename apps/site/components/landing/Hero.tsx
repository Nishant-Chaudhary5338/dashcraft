"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/ui/CopyButton";
import { Thermal } from "@/components/ui/Thermal";
import { HeroBoard } from "@/components/landing/HeroBoard";
import { revealUp, stagger } from "@/lib/motion";

/**
 * Landing hero — the product is the pitch. A kinetic Bricolage headline over a
 * warm-graphite canvas, a thermal glow field behind, and a live 3D-tilt
 * dashboard board on the right. Copy leads with the screenshot→code + headless
 * + own-your-code wedge.
 */
export function Hero(): React.ReactElement {
  return (
    <section className="relative flex min-h-[calc(100svh-60px)] items-center overflow-hidden py-16">
      <Thermal />
      <div className="hero-grid container relative z-[1] grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p variants={revealUp} className="eyebrow mb-6">
            Screenshot → Code · Headless · Yours to ship
          </motion.p>

          <motion.h1
            variants={revealUp}
            className="font-display font-extrabold leading-[0.94] tracking-[-0.035em]"
            style={{ fontSize: "var(--text-hero)" }}
          >
            Ship the <span className="text-[var(--accent)]">dashboard</span>,
            <br />
            not the prototype.
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mt-6 max-w-[520px] text-[1.05rem] leading-relaxed text-[var(--text-secondary)]"
          >
            A headless React dashboard engine with a live drag-and-resize
            playground — and an AI tool that turns a screenshot into shippable{" "}
            <span className="text-[var(--text-primary)]">dashcraft-core</span>{" "}
            code. Own the whole repo.
          </motion.p>

          <motion.div variants={revealUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/playground" className="btn btn-primary btn-lg">
              Open the Playground →
            </Link>
            <div className="install-snippet">
              <span className="prompt">$</span>
              <span className="pkg">npm create dashcraft</span>
              <CopyButton text="npm create dashcraft" />
            </div>
          </motion.div>

          <motion.div
            variants={revealUp}
            className="mt-7 flex flex-wrap gap-6 font-mono text-[13px] text-[var(--text-muted)]"
          >
            <span>
              <b className="text-[var(--text-primary)]">MIT</b> licensed
            </span>
            <span>
              <b className="text-[var(--text-primary)]">0</b> runtime lock-in
            </span>
            <span>
              <b className="text-[var(--text-primary)]">1.2k</b> ★ on GitHub
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <HeroBoard />
        </motion.div>
      </div>
    </section>
  );
}
