# Tasks — ShopNow Client

`[x]` done · `[ ]` to do.

Product: [PRD](../PRD.md) · Structure: [ARCHITECTURE](./ARCHITECTURE.md).

## Done

Derived from `git log` and the code.

- [x] Product grid with category, color, price-range and sort filters, search, virtualized list, skeletons
- [x] Product pages with ISR (`revalidate = 300`) and a carousel
- [x] Cart and wishlist with optimistic updates, rollback, Redux Persist for guests, and sync to the API after login
- [x] Cart coupon (`SHOPNOW10`), order summary, USD and INR prices
- [x] Modal email auth and Google sign-in through the Express API (moved off Supabase)
- [x] AI assistant sheet (OpenRouter) with a feedback form
- [x] Dark and light theme, shutter transitions, keyframe animations, responsive header and sidebar
- [x] Brand manifest at the repo root, read through `constants/brand.ts`
- [x] Image assets reorganized under `public/images/` (`banners`, `brand`, `payments`, `products`)
- [x] Docs in `docs/`, one root `CLAUDE.md`
- [x] Light and dark favicons, favicon.ico and apple-touch icon from the logo mark (`npm run share-card`)
- [x] Share card for WhatsApp and social previews, root metadata, JSON-LD, `robots.ts` and `sitemap.ts`

## Needs the owner

- [ ] Decide whether to delete the leftover Supabase code: `src/app/api/{products,cart,wishlist,feedback}/route.ts`, `src/utils/supabase/`, `scripts/seed-products.ts`, `scripts/schema.sql`, the `seed` script, and the `@supabase/*` packages. Nothing in the app calls them.
- [ ] `tagline` in the manifest is not used by any component; show it or drop it.
- [ ] Restrict or rotate the OpenRouter key; it ships to the browser.
- [ ] Confirm the Vercel setting that lets the build read `brandManifest.json` outside `client/` (needed for a Root Directory of `client`).
- [ ] Footer copy and the sidebar "About" text are still written into the components (they restate the manifest description). Decide whether to add `footer` and `about` fields to the manifest.

- [ ] After deploy, paste the production URL into WhatsApp and into opengraph.xyz to check the card, title and description. WhatsApp caches previews, so a change can need a new URL or a few hours.
- [ ] After deploy, check `/robots.txt` and `/sitemap.xml`, and submit the sitemap in Google Search Console.

## Later

- [ ] Split the 13 UI files over 120 lines: `SignUpForm` (293), `LoginForm` (251), `product-details/extension/Carousel` (199), `Sidebar` (179), `UserAvatar` (177), `FeedbackForm` (171), `HeaderActions` (168), `Footer` (156), `WishlistItem` (149), `authContext` (146), `ProductCard` (138), `ProductDetailsCard` (126), `NavigationWindow` (125)
- [ ] Remove dead code: `components/home/carousel-section/Carousel.tsx` (not imported), empty `components/landing/`, the older `redux/cart/` and `redux/wishlist/` slices once the UI imports `redux/slices/`
- [ ] Fix `components.json` (`tailwind.css` points at `src/app/globals.css`) and remove the unused `tailwind.config.js`
- [ ] Clear two lint warnings (`'error' is defined but never used` in `utils/products/products.ts`)
- [ ] Derive filter options from the API instead of the static `constants/products.ts`
- [ ] Add `prefers-reduced-motion` handling
- [ ] Tests (none exist)
- [ ] Checkout and orders (see [PRD](../PRD.md), out of scope today)

Server work is tracked in [server TASKS](../server/TASKS.md).
