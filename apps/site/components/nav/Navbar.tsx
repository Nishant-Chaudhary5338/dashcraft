"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-grid" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="nav-logo-dot" />
            ))}
          </span>
          dashcraft
        </Link>

        <div className="nav-links">
          <Link href="/docs" className="nav-link">Docs</Link>
          <Link href="/showcase" className="nav-link">Showcase</Link>
          <Link href="/playground" className="nav-link">Playground</Link>
          <a
            href="https://github.com/nishant-chaudhary/dashcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
          <a
            href="https://npmjs.com/package/@dashcraft/core"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
          >
            npm
          </a>
        </div>

        <Link href="/docs/installation" className="nav-cta">
          Get Started →
        </Link>
      </div>
    </nav>
  );
}
