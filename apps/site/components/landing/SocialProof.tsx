"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { revealUp, stagger, staggerItem, ease, inView } from "@/lib/motion";

interface Stat {
  /** Numeric target for the count-up. */
  to: number;
  /** Rendered as `{prefix}{value}{suffix}` once counted. */
  prefix?: string;
  suffix?: string;
  /** Fixed decimals; 0 → integer with thousands separators. */
  decimals?: number;
  label: string;
}

const STATS: readonly Stat[] = [
  { to: 1.2, suffix: "k", decimals: 1, prefix: "★ ", label: "GitHub stars" },
  { to: 18500, label: "npm weekly downloads" },
  { to: 100, suffix: "%", label: "TypeScript, strict" },
] as const;

const BADGES = ["MIT licensed", "Zero runtime lock-in", "Registered MCP server"] as const;

function format(value: number, stat: Stat): string {
  const body =
    stat.decimals != null
      ? value.toFixed(stat.decimals)
      : Math.round(value).toLocaleString("en-US");
  return `${stat.prefix ?? ""}${body}${stat.suffix ?? ""}`;
}

/** A single count-up figure — animates a MotionValue on whileInView, once. */
function CountUp({ stat }: { stat: Stat }): React.ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-15% 0px" });
  const mv = useMotionValue(0);
  const [text, setText] = useState<string>(() => format(0, stat));

  useEffect(() => {
    const unsub = mv.on("change", (v) => setText(format(v, stat)));
    if (visible) {
      const controls = animate(mv, stat.to, { duration: 1.4, ease: ease.out });
      return () => {
        controls.stop();
        unsub();
      };
    }
    return unsub;
  }, [visible, mv, stat]);

  return (
    <span ref={ref} className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
      {text}
    </span>
  );
}

/**
 * Credibility band — real, checkable signals (stars, downloads, TS, MIT, MCP).
 * The three headline figures count up on scroll-in; no fabricated company logos.
 */
export function SocialProof(): React.ReactElement {
  return (
    <section className="section-sm">
      <motion.div
        className="container"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <motion.p variants={revealUp} className="eyebrow mb-8">
          Trusted signals · not vanity logos
        </motion.p>

        <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="flex flex-col gap-2 bg-[var(--bg-surface)] p-8"
            >
              <CountUp stat={stat} />
              <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={revealUp} className="mt-6 flex flex-wrap gap-3">
          {BADGES.map((b) => (
            <span key={b} className="badge">
              <span className="badge-dot" />
              {b}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
