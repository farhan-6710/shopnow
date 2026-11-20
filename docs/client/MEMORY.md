# Memory — ShopNow Client

Short durable facts. Shared decisions: [docs/MEMORY.md](../MEMORY.md). Work left: [TASKS.md](./TASKS.md).

## Decisions

- The theme defaults to dark (`defaultTheme="dark"`). It uses the `class` strategy, not the system setting.
- Tailwind v4 reads `src/styles/globals.css` only. `tailwind.config.js` is empty and unused.
- `client/next.config.ts` sets `turbopack.root` and `outputFileTracingRoot` to the repo root so the client can import `../brandManifest.json`.
- Guest cart and wishlist persist in `localStorage` under redux-persist key `root`. The product list is not persisted; React Query caches it.
- Cart state stores one currency (`USD` or `INR`); each product carries both prices.
- `reactStrictMode` is off in `next.config.ts`.
- The assistant calls OpenRouter straight from the browser, so `NEXT_PUBLIC_OPENROUTER_API_KEY` is visible to anyone who opens the site. Use a restricted key.
- The only allowed "ShopNow" literals in `client/src` are the coupon code `SHOPNOW10` and the `shopnow-favicon.png` image path.
- SEO and share metadata live in `src/lib/seo.ts` and the manifest (`seo`, `logo`). Declaring `metadata.icons` replaces file-convention icons, so `src/app` has no `favicon.ico` or `icon` files; the icons are in `public/` and `public/brand/`.
- `siteUrl` uses `VERCEL_PROJECT_PRODUCTION_URL` when set, else the manifest `siteUrl`. Change the manifest if the production domain changes.
- The share card and favicons are generated: edit `scripts/share-card/` and run `npm run share-card`, do not hand-edit `public/brand/*`. Only one logo colourway exists, so the light and dark favicons are identical.
- Payment logos in the cart are decoration; there is no checkout.
