# Memory — ShopNow Client

Short durable facts. Shared decisions: [docs/MEMORY.md](../MEMORY.md). Work left: [TASKS.md](./TASKS.md).

## Decisions

- Tailwind must stay at 4.3.5 or newer. `next.config.ts` sets `turbopack.root` to the repo root (for `../brandManifest.json`); Tailwind 4.1/4.2 then resolved `@import "tailwindcss"` from the repo root, which has no `node_modules`, so `next dev` failed every CSS compile, respawned workers in a loop and never loaded a page. 4.3 resolves it from the CSS file and uses `module.registerHooks()`, which also removes Node 26's `DEP0205` warning. Don't set the PostCSS plugin's `base` option: it stopped utilities being generated.
- `redux/store.ts` gives redux-persist a no-op storage on the server and `createWebStorage("local")` in the browser, so the server render no longer logs "failed to create sync storage".
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
