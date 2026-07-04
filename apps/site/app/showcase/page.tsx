import type { Metadata } from "next";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { Grain } from "@/components/ui/Grain";
import { TemplateGallery } from "@/components/showcase/TemplateGallery";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Prebuilt React dashboard templates built with dashcraft-core. Open any one in the playground, restyle it live to prove it's headless, or export the code as a full Vite project. Free and MIT — the code is yours.",
  alternates: { canonical: "/showcase" },
  openGraph: {
    title: "Templates — dashcraft",
    description:
      "Real dashboards, real code. Open a template in the playground, restyle it live, and export a full Vite project you own. Headless, MIT.",
    url: "https://dashcraft.digitribe.world/showcase",
  },
};

export default function ShowcasePage() {
  return (
    <>
      <Grain />
      <Navbar />
      <main style={{ paddingTop: 88 }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 640, marginInline: "auto" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>Templates · dashcraft-core</p>
          <h1 className="mt-4 font-display font-extrabold tracking-[-0.035em]" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", lineHeight: 1.02 }}>
            Real dashboards. Real code.
          </h1>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[var(--text-secondary)]">
            Prebuilt layouts you can open in the playground, restyle live to prove
            it&apos;s headless, and export as a full Vite project.
          </p>
        </div>
        <TemplateGallery />
      </main>
      <Footer />
    </>
  );
}
