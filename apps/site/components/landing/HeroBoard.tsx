"use client";

import "dashcraft-core/styles.css";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Dashboard } from "dashcraft-core";
import { KPIWidget } from "dashcraft-core/widgets/kpi";
import { RechartsWidget } from "dashcraft-core/widgets/recharts";
import { spring } from "@/lib/motion";

// Fixed box + clipped overflow + bounded drag ⇒ the figure can never overflow.
const BOARD_W = 468;
const BOARD_H = 356;

const AREA = [
  { d: "1", v: 42, w: 30 }, { d: "2", v: 55, w: 40 }, { d: "3", v: 48, w: 44 },
  { d: "4", v: 72, w: 51 }, { d: "5", v: 66, w: 58 }, { d: "6", v: 88, w: 62 },
  { d: "7", v: 84, w: 71 },
] as const;
const AREA_SERIES = [{ dataKey: "v", name: "Sessions", color: "#C2FF3D" }];
const BAR_SERIES = [{ dataKey: "w", name: "Source", color: "#C2FF3D" }];

// Inner widgets are static — the WHOLE board is the interactive object.
const STATIC = { drag: false, resize: false, delete: false, settings: false } as const;
type RData = import("dashcraft-core/widgets/recharts").RechartsWidgetProps["data"];
type RSeries = import("dashcraft-core/widgets/recharts").RechartsWidgetProps["series"];

const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));

/**
 * The hero's live board — the ACTUAL dashcraft-core Dashboard rendered as ONE
 * draggable, spinnable 3D object. Grab it anywhere to fling it around (bounded
 * so it stays on screen); moving the pointer spins it in 3D (clamped, no
 * backface). Fixed size + clipped overflow guarantee it never overflows.
 */
export function HeroBoard(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Rest pose ≈ rotateY -8° / rotateX 4°; pointer position spins around it.
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-32, 16]), spring.smooth);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [20, -12]), spring.smooth);

  function onMove(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set(clamp((e.clientX - r.left) / r.width - 0.5));
    py.set(clamp((e.clientY - r.top) / r.height - 0.5));
  }
  function onLeave() { px.set(0); py.set(0); }

  return (
    <div className="hero-board" style={{ perspective: 1500 }}>
      <motion.div
        ref={ref}
        drag
        dragConstraints={{ top: -46, bottom: 46, left: -72, right: 72 }}
        dragElastic={0.16}
        whileDrag={{ cursor: "grabbing" }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ transformStyle: "preserve-3d", width: BOARD_W, rotateX, rotateY, cursor: "grab" }}
        className="hero-board-card"
      >
        <div className="hero-board-bar">
          <span style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map((i) => <span key={i} className="hero-board-dot" />)}
          </span>
          <span className="hero-board-live">
            <span className="hero-board-led" /> LIVE · DRAG · SPIN
          </span>
        </div>

        <div style={{ position: "relative", width: BOARD_W, height: BOARD_H, overflow: "hidden" }}>
          <Dashboard style={{ width: BOARD_W, height: BOARD_H }}>
            <KPIWidget
              id="hb-rev" label="Revenue" value={284621} previousValue={253000} format="currency"
              {...STATIC} defaultPosition={{ x: 0, y: 0 }} defaultSize={{ width: 226, height: 96 }}
            />
            <KPIWidget
              id="hb-users" label="Active Users" value={127452} previousValue={117000} format="number"
              {...STATIC} defaultPosition={{ x: 238, y: 0 }} defaultSize={{ width: 226, height: 96 }}
            />
            <RechartsWidget
              id="hb-sessions" title="Sessions · 30d" chartType="area"
              data={AREA as unknown as RData} series={AREA_SERIES as unknown as RSeries} xAxisKey="d"
              {...STATIC} defaultPosition={{ x: 0, y: 108 }} defaultSize={{ width: 292, height: 236 }}
            />
            <RechartsWidget
              id="hb-source" title="By source" chartType="bar"
              data={AREA as unknown as RData} series={BAR_SERIES as unknown as RSeries} xAxisKey="d"
              {...STATIC} defaultPosition={{ x: 304, y: 108 }} defaultSize={{ width: 160, height: 236 }}
            />
          </Dashboard>
        </div>
      </motion.div>
    </div>
  );
}
