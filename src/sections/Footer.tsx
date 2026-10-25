import { BrandWordmark } from "@/components/wallet/Logo";
import { DOWNLOAD_URL, NAV } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-8 shadow-[inset_0_1px_0_rgb(var(--line)/0.6)]">
      <div className="wrap grid grid-cols-1 gap-12 py-14 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="max-w-[420px]">
          <BrandWordmark width={170} />
          <p className="mt-5 text-pretty text-[14px] leading-[1.6] text-mute">
            A self-custody wallet. Nira never holds your funds or your recovery phrase, and cannot restore a lost one. Not financial advice.
          </p>
        </div>
        <div className="flex gap-16 text-[14px]">
          <nav aria-label="Footer">
            <p className="font-bold text-ink">Wallet</p>
            <ul className="mt-3 flex flex-col gap-2">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-mute transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-bold text-ink">Get it</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a href={DOWNLOAD_URL} className="text-mute transition-colors hover:text-ink">
                  Android
                </a>
              </li>
              <li className="text-faint">iPhone, later</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap pb-10 text-[13px] text-faint">© {new Date().getFullYear()} Nira Wallet</div>
    </footer>
  );
}
