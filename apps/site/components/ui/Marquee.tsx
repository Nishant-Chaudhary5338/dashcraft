interface MarqueeWord {
  text: string;
  /** Stroke the word in the chartreuse signal colour instead of muted ink. */
  on?: boolean;
}

/**
 * Kinetic outline-type banner — a slow horizontal loop of oversized display
 * words rendered as text-stroke (transparent fill). The track is duplicated so
 * the translateX loop is seamless.
 */
export function Marquee({ words }: { words: MarqueeWord[] }): React.ReactElement {
  const sequence = [...words, ...words];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {sequence.map((word, i) => (
          <span key={i} className={`marquee-word${word.on ? " on" : ""}`}>
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
}
