import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { Hero } from "@/components/landing/Hero";
import { PainPoints } from "@/components/landing/PainPoints";
import { Features } from "@/components/landing/Features";
import { CodeShowcase } from "@/components/landing/CodeShowcase";
import { PlaygroundCTA } from "@/components/landing/PlaygroundCTA";
import { EcosystemLogos } from "@/components/landing/EcosystemLogos";
import { OpenSourceCTA } from "@/components/landing/OpenSourceCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Features />
        <CodeShowcase />
        <EcosystemLogos />
        <PlaygroundCTA />
        <OpenSourceCTA />
      </main>
      <Footer />
    </>
  );
}
