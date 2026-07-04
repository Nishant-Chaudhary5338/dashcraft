import type { Metadata } from "next";
import { Navbar } from "@/components/nav/Navbar";
import { PlaygroundLazy } from "@/components/playground/PlaygroundLazy";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Build a React dashboard in the browser, then own the code. Drag and resize widgets, toggle behaviour with boolean props, and export production-ready dashcraft-core TSX — or a full Vite project. Headless and MIT, no sign-up.",
  alternates: { canonical: "/playground" },
  openGraph: {
    title: "Playground — dashcraft",
    description:
      "Drag, resize, and configure widgets, then download production-ready dashcraft-core code you own. Headless, MIT, no sign-up.",
    url: "https://dashcraft.digitribe.world/playground",
  },
};

export default function PlaygroundPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 60 }}>
        <PlaygroundLazy />
      </div>
    </>
  );
}
