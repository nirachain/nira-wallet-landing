import { TopNav } from "@/components/TopNav";
import { Hero } from "@/sections/Hero";
import { Ticker } from "@/sections/Ticker";
import { Features } from "@/sections/Features";
import { Statement } from "@/sections/Statement";
import { Sign } from "@/sections/Sign";
import { Security } from "@/sections/Security";
import { Playground } from "@/sections/Playground";
import { Nodes } from "@/sections/Nodes";
import { Cta } from "@/sections/Cta";
import { Footer } from "@/sections/Footer";

export default function Page() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas">
        Skip to content
      </a>
      <TopNav />
      <main id="main">
        <Hero />
        <Ticker />
        <Features />
        <Statement />
        <Sign />
        <Security />
        <Playground />
        <Nodes />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
