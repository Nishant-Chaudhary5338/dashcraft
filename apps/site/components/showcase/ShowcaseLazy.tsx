"use client";
/**
 * SSR-safe wrapper for ShowcaseClient.
 *
 * @dashcraft/core uses browser-only APIs (document.addEventListener, localStorage).
 * Dynamic import with ssr:false ensures it only runs in the browser.
 */
import dynamic from "next/dynamic";

const ShowcaseClient = dynamic(
  () => import("./ShowcaseClient").then((m) => m.ShowcaseClient),
  {
    ssr: false,
    loading: () => (
      <div className="showcase-loading">
        <div className="showcase-loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="showcase-loading-card" style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
        <p className="showcase-loading-text">Loading dashboard…</p>
      </div>
    ),
  }
);

export function ShowcaseLazy() {
  return <ShowcaseClient />;
}
