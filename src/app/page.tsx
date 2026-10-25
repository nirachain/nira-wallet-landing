import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { ChainStory } from "@/sections/ChainStory";
import { Networks } from "@/sections/Networks";
import { Tour } from "@/sections/Tour";
import { Security } from "@/sections/Security";
import { Nfts } from "@/sections/Nfts";
import { Nodes } from "@/sections/Nodes";
import { GetNira } from "@/sections/GetNira";
import { Footer } from "@/sections/Footer";

export default function Page() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <ChainStory />
        <Networks />
        <Tour />
        <Security />
        <Nfts />
        <Nodes />
        <GetNira />
      </main>
      <Footer />
    </>
  );
}
