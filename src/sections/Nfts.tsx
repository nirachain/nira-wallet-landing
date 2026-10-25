"use client";

import { HoloCard } from "@/components/lazy";

/** Collectibles: the app's foil card, tilting under the pointer, over an
 *  animated on-chain-style artwork (the foil is drawn over the real image,
 *  as the app does, so the art keeps moving). */
export function Nfts() {
  return (
    <section id="nfts" aria-labelledby="nfts-title" className="relative py-20 lg:py-28">
      <div className="wrap grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 flex justify-center lg:order-1">
          <div className="h-[380px] sm:h-[440px]">
            <HoloCard
              image="/art/genesis.svg"
              overlay
              ratio={1}
              width={340}
              radius={26}
              preset="stars"
              intensity={0.4}
              glare={0.4}
              alt="Nira Genesis, an animated chain-and-padlock artwork"
              className="max-w-[86vw]"
            />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 id="nfts-title" className="title">
            Collectibles, in full
          </h2>
          <p className="lede mt-5">
            NFTs on EVM networks and Solana, with video, animated art, music and 3D models playing right in the app. Each one is fetched
            through Nira, never straight from a creator&apos;s link.
          </p>
          <p className="lede mt-4">
            Sending one goes through the same checks as a payment: the chain confirms you hold it, the transfer is tested first, and your PIN
            or fingerprint approves it. Likely scam airdrops stay hidden.
          </p>
          <p className="mt-6 flex items-center gap-2.5 text-[14px] font-semibold text-accent-soft">
            <span aria-hidden className="brand-fill h-1.5 w-6 -skew-x-[30deg] rounded-[2px]" />
            Run a finger or the pointer across the card.
          </p>
        </div>
      </div>
    </section>
  );
}
