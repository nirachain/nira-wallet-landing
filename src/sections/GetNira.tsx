"use client";

import { ParticleText } from "@/components/lazy";
import { DownloadButton } from "@/components/Download";
import { BrandQr } from "@/components/wallet/BrandQr";
import { DOWNLOAD_READY, DOWNLOAD_URL } from "@/lib/site";

/** The close: the name gathering out of particles (the app's About screen),
 *  and the download. A QR appears once the download is a real link. */
export function GetNira() {
  return (
    <section id="download" aria-labelledby="download-title" className="relative overflow-hidden py-20 lg:py-32">
      <div className="wrap flex flex-col items-center text-center">
        <div className="h-[clamp(120px,22vw,240px)] w-full max-w-[1000px]" aria-hidden>
          <ParticleText
            text="NIRA"
            fontSize="clamp(5rem, 20vw, 14rem)"
            fontWeight={800}
            fontFamily='"Unbounded Variable", sans-serif'
            color="#1359A8"
            highlightColor="#1BEC8A"
            highlightMode="gradient"
            particleSize={2}
            density={4}
            gatherDuration={1400}
            stagger={380}
            repelRadius={110}
            pointerRepel={36}
          />
        </div>
        <h2 id="download-title" className="title mt-6">
          Get Nira for your phone
        </h2>
        <p className="lede mt-5">For Android. Create a new wallet in a minute, or bring the one you have with its recovery phrase.</p>
        <div className="mt-9 flex flex-col items-center gap-8 sm:flex-row">
          <DownloadButton />
          {DOWNLOAD_READY && (
            <div className="flex items-center gap-4 text-left">
              <span className="block size-[112px] rounded-[22px] bg-white p-2.5">
                <BrandQr value={DOWNLOAD_URL} label="QR code to download Nira" />
              </span>
              <span className="max-w-[140px] text-[13px] font-semibold leading-snug text-mute">Or scan with your phone&apos;s camera</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
