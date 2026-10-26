"use client";

import { ParticleText } from "@/components/lazy";
import { WordReveal } from "@/components/WordReveal";
import { DownloadButton } from "@/components/Download";
import { BrandQr } from "@/components/wallet/BrandQr";
import { DOWNLOAD_READY, DOWNLOAD_URL } from "@/lib/site";

/** The close, on the slab: the name gathering out of particles (the app's
 *  About screen) and Get Nira. A QR appears once the download is real. */
export function Cta() {
  return (
    <section aria-labelledby="cta-title" className="px-3 sm:px-5">
      <div className="slab relative overflow-hidden rounded-[32px] px-5 py-20 text-white lg:rounded-[44px] lg:py-28">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
          <div className="h-[clamp(110px,20vw,230px)] w-full" aria-hidden>
            <ParticleText
              text="NIRA"
              fontSize="clamp(4.5rem, 19vw, 14rem)"
              fontWeight={800}
              fontFamily='"Unbounded Variable", sans-serif'
              color="#FFFFFF"
              highlightColor="#03160E"
              highlightMode="motion"
              particleSize={2}
              density={4}
              gatherDuration={1400}
              stagger={380}
              repelRadius={110}
              pointerRepel={36}
            />
          </div>
          <WordReveal text="Your keys. Your phone. Your call." className="display mt-6 max-w-[16ch] text-balance text-[clamp(36px,5.4vw,80px)] font-extrabold leading-[0.96] tracking-[-0.05em] text-white" />
          <p className="mt-6 max-w-[32em] text-pretty text-[18px] font-medium leading-[1.55] text-white/85">
            For Android. Create a new wallet in a minute, or bring the one you have with its recovery phrase.
          </p>
          <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row">
            <DownloadButton tone="light" />
            {DOWNLOAD_READY && (
              <div className="flex items-center gap-4 text-left">
                <span className="block size-[104px] rounded-[20px] bg-white p-2.5">
                  <BrandQr value={DOWNLOAD_URL} label="QR code to download Nira" />
                </span>
                <span className="max-w-[140px] text-[13px] font-semibold leading-snug text-white/85">Or scan with your phone&apos;s camera</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
