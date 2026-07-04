"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Logo } from "@/components/ui/Logo";

const GITHUB_URL = "https://github.com/Nishant-Chaudhary5338/dashcraft";
const NPM_URL = "https://npmjs.com/package/dashcraft-core";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ opacity: 0.9 }}>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
    </svg>
  );
}

export function Navbar(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" aria-label="dashcraft home" className="no-underline">
          <Logo />
        </Link>

        <div className="nav-links">
          <Link href="/docs" className="nav-link">Docs</Link>
          <Link href="/showcase" className="nav-link">Templates</Link>
          <Link href="/playground" className="nav-link">Playground</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="nav-link inline-flex items-center gap-1.5">
            <StarIcon /> 1.2k
          </a>
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
            npm
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={toggle}
            className="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="/playground" className="nav-cta nav-cta-desktop">
            Open Playground →
          </Link>
          <button
            className="nav-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile" onClick={() => setMenuOpen(false)}>
          <Link href="/docs" className="nav-mobile-link">Docs</Link>
          <Link href="/showcase" className="nav-mobile-link">Templates</Link>
          <Link href="/playground" className="nav-mobile-link">Playground</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="nav-mobile-link">GitHub ★ 1.2k</a>
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="nav-mobile-link">npm</a>
          <Link href="/playground" className="nav-cta" style={{ marginTop: 6 }}>Open Playground →</Link>
        </div>
      )}
    </nav>
  );
}
