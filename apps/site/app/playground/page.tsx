import { Navbar } from "@/components/nav/Navbar";
import { PlaygroundLazy } from "@/components/playground/PlaygroundLazy";

export const metadata = {
  title: "Playground — dashcraft",
  description:
    "Build React dashboards visually. Drag widgets, configure behaviour, and download production-ready @dashcraft/core code.",
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
