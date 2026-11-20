# Architecture — ShopNow Client

Shared product and data: [PRD](../PRD.md) · [DATABASE](../DATABASE.md) · [RULES](../RULES.md). API: [server ARCHITECTURE](../server/ARCHITECTURE.md).

## System

```text
Browser (Next.js) ── Axios + HttpOnly cookie ──► Express ──► Prisma ──► Neon Postgres
        └── assistant sheet ──► OpenRouter (direct from the browser)
```

The API has no `/api` prefix: endpoints are `/auth`, `/products`, `/cart`, `/wishlist`, `/feedback`.

## Stack

Next.js 16.1 (App Router, Turbopack), React 19.2, TypeScript 5 (strict), Tailwind CSS v4 (`@tailwindcss/postcss`, `tw-animate-css`), shadcn/ui New York with Radix primitives, `cmdk`, `vaul`, Lucide plus Font Awesome and `react-icons`, `next-themes`, Redux Toolkit 2 + Redux Saga 1 + redux-persist 6, TanStack Query 5, Axios 1, Framer Motion 12, Embla carousel, Sonner. Fonts through `next/font/google`.

## Routes

`/` filterable product grid · `/products/[itemName]` product details (statically generated from `GET /products/names`, `revalidate = 300`) · `/cart` · `/wishlist`. Login and sign-up are modals. `app/error.tsx` is the error boundary.

## Folders

| Path | Purpose |
| --- | --- |
| `src/app` | Routes, `layout.tsx` (fonts, metadata from `lib/seo.ts`, JSON-LD), `robots.ts`, `sitemap.ts`, `LayoutClient.tsx` (providers and chrome) |
| `src/app/api` | Leftover Supabase route handlers (`products`, `cart`, `wishlist`, `feedback`). Not called by the app. Do not extend |
| `src/components` | `ui/` shadcn primitives; `shared/`; feature folders `home`, `headers`, `cart`, `wishlist`, `product-details`, `auth`, `ai-assistant`, `modals`, `skeletons`, `footers` (`landing/` is empty) |
| `src/hooks` | Data and UI logic: `useProductsQuery`, `useFilterProducts`, `useCartManagement`, `useCartCoupon`, `useSearchProduct`, `useVirtualizedProducts`, `useSyncUserData`, `useAiAssistant` |
| `src/services` | `axiosInstance` plus `authApi`, `cartApi`, `wishlistApi`; endpoint URLs in `constants/api.ts` |
| `src/providers` | `AppProviders`, `authContext` (`AuthProvider`), `DataSyncProvider`, `NavigationProvider`, `ReactQueryProvider`, `ThemeProvider` |
| `src/redux` | `store.ts`, `rootSaga.ts`, `slices/` (cart, wishlist, chat, feedback), `sagas/`. `redux/cart/` and `redux/wishlist/` hold older copies of the slices that some UI still imports |
| `src/constants` | `api`, `routes`, `filters`, `animations`, `products` (static `PRODUCTS_DATA` used to derive filter options), `brand` |
| `src/types`, `src/utils`, `src/lib`, `src/config` | Types, helpers (`utils/products/products.ts` loads products for server pages), `cn()` in `lib/utils.ts`, toast config |
| `src/styles` | `globals.css` (tokens, keyframes), `mediaQueries.css` |
| `scripts/` | `seed-products.ts` and `schema.sql`: legacy Supabase seed and schema. `share-card/`: share card and favicon generator (see SEO and sharing) |
| `../brandManifest.json` | Brand copy, the single source |

Dependencies flow down: pages → components → hooks → services → API.

## Data flow

```text
UI event → hook or AuthProvider
  → Redux dispatch (optimistic) and/or React Query
    → saga (cart, wishlist, feedback) or query function
      → services/*Api + axiosInstance → Express (cookie JWT) → Prisma → Neon
```

- **Catalog:** `useProductsQuery` calls `GET /products` (stale after 5 minutes). Product pages call `getProduct` and `getAllProductNames` on the server.
- **Cart and wishlist:** reducers update on `*Request`, sagas call the API, and roll back on failure. Cart quantity updates are debounced. Guests keep items in the store only.
- **Login sync:** `DataSyncProvider` runs `useSyncUserData` once the user is known. Sagas send guest items in bulk, remove items the guest deleted offline, then fetch the merged cart and wishlist.
- **Session:** `AuthProvider` uses `authApi` (`/auth/me`, `/login`, `/signup`, `/logout`). Google sign-in is a full-page redirect to `GET /auth/google`; the server redirects back to `/` with the cookie set.
- **Persist:** redux-persist key `root`, `localStorage`, whitelist `cart`, `chat`, `wishlist`.
- **Assistant:** `useAiAssistant` posts to `https://openrouter.ai/api/v1/chat/completions` with the product list as system context. Messages live in `chatSlice`.

## Provider order

`Provider` (Redux) → `PersistGate` → `ReactQueryProvider` → `ThemeProvider` (class strategy, default dark) → `AuthProvider` → `DataSyncProvider` → `NavigationProvider` → `WindowOpener` (shutter intro) → page. `LayoutClient` renders `Header`, `ModeToggle`, the page, `Footer`, `FooterTwo`, `ScrollToTop` and `Toaster` (top-center).

## SEO and sharing

- `src/lib/seo.ts` builds the root `metadata` and `viewport` and the schema.org `OnlineStore` JSON-LD, which `layout.tsx` renders in `<body>`. Copy, keywords, theme colour, share image and icon paths come from `../brandManifest.json` (`seo`, `logo`) through `constants/brand.ts`.
- `siteUrl` is `https://$VERCEL_PROJECT_PRODUCTION_URL` on Vercel, otherwise the manifest `siteUrl` (the production URL from the README deploy table), trailing slash removed. It feeds `metadataBase`, the canonical link, Open Graph and Twitter image URLs, `robots.ts` and `sitemap.ts`.
- Title is `seo.title` with the template `%s | ShopNow`. Open Graph and Twitter use `public/brand/share-card.jpg` (1200x630, with width, height, alt and type).
- Icons: `/favicon.ico` (any size), `favicon-light.png` and `favicon-dark.png` with `prefers-color-scheme` media queries, and `apple-icon.png` (180x180) declared in `metadata.icons`. There are no file-convention icons in `src/app`, because they would add extra `<link>` tags.
- `robots.ts` allows `/` and disallows `/api/`, `/cart` and `/wishlist`. `sitemap.ts` lists the home page and every product page from `getAllProductNames()` (revalidated hourly; it falls back to the home page alone when the API is unreachable at build).
- Regenerate the card and icons with `npm run share-card` in `client/` (`scripts/share-card/render.sh`: headless Chrome renders `card.html`, Pillow writes the JPG, `icons.py` writes the favicons). It needs Google Chrome, python3 with Pillow, and network access for Google Fonts. Edit `card.html` for copy or layout; rerun after any logo or product image change.

## Config

`client/.env.local` (names only): `NEXT_PUBLIC_SERVER_URL` (default `http://localhost:5001`, no path suffix), `NEXT_PUBLIC_OPENROUTER_API_KEY`, `NEXT_PUBLIC_OPENROUTER_MODEL` (falls back to a free NVIDIA model in code). The leftover Supabase code reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `ANALYZE=true` turns on the bundle analyzer. `@/*` maps to `src/*`.

## Deploy

Vercel builds the client. `NEXT_PUBLIC_SERVER_URL` is baked in at build time. The client imports `../brandManifest.json`, so the build must include files outside `client/`; `next.config.ts` sets `turbopack.root` and `outputFileTracingRoot` to the repo root. Set the API's `CLIENT_URL` to the Vercel origin. There is no `vercel.json` in the repo.
