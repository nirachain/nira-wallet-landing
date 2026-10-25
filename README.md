# Nira Wallet landing page

Marketing site for the Nira wallet. Next.js (App Router, static export), Tailwind 3 and Motion,
built from the wallet app's own tokens, components and animations.

## Run

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # static site in out/
pnpm check        # type check
```

## Settings

| Variable | Use |
| --- | --- |
| `NEXT_PUBLIC_DOWNLOAD_URL` | Where every Download button goes (APK now, Play Store later). Unset, it points at the download section, and the QR code stays hidden. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata. |

## Where things come from

- `src/components/wallet/` are copies of the app's components (`nira-wallet/src/components`):
  the UI kit, Odometer, SlideCommit, SwipeRow, NumberPad, BrandQr, and the WebGL/canvas pieces in
  `animated/`. `src/components/TabBar.tsx` is the app's BottomNav without its router.
- `src/components/WelcomeScene.tsx` is the app's welcome scene (glyph ring, coins on a chain, padlock),
  driven by page scroll instead of a pager.
- `src/app/globals.css` and `tailwind.config.js` carry the app's dark-theme tokens.
- Phone screens in `src/components/screens/` use sample data, labelled as such. Every claim on the
  page describes something the wallet does today; Nodes is marked as coming.
