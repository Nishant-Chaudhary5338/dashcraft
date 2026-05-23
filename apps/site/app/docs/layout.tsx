import type { Metadata } from "next";
import { DocsNav } from "@/components/docs/DocsNav";

export const metadata: Metadata = {
  title: { template: "%s — dashcraft docs", default: "Docs — dashcraft" },
  description: "Full API reference, component docs, and developer guides for @dashcraft/core.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-layout">
      <DocsNav />
      <main className="docs-content">{children}</main>
    </div>
  );
}
