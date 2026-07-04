import { Marquee } from "@/components/ui/Marquee";

const WORDS = [
  { text: "DRAG" },
  { text: "·" },
  { text: "RESIZE", on: true },
  { text: "·" },
  { text: "CHART" },
  { text: "·" },
  { text: "THEME" },
  { text: "·" },
  { text: "SCREENSHOT → CODE", on: true },
  { text: "·" },
  { text: "SHIP" },
  { text: "·" },
  { text: "OWN IT" },
  { text: "·" },
];

/** Skewed kinetic banner separating the hero from the deep-dive sections. */
export function MarqueeBand(): React.ReactElement {
  // Outer clip prevents the skew+scale from adding horizontal page overflow.
  return (
    <div className="overflow-hidden">
      <div className="-rotate-[1.4deg] scale-[1.04]">
        <Marquee words={WORDS} />
      </div>
    </div>
  );
}
