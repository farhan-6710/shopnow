# Design — ShopNow Client

Product behaviour: [PRD](../PRD.md). System layout: [ARCHITECTURE](./ARCHITECTURE.md). Rules: [RULES](./RULES.md).

## Product / UX

- Shoe catalog first: home is a filterable grid; the header search jumps to `/products/[name]`.
- Stay on the page: email login and sign-up are modals, the assistant is a sheet, toasts confirm cart, wishlist, filter and navigation actions.
- Guest then account: cart and wishlist work locally and merge into the API after login (`DataSyncProvider`, `useSyncUserData`).
- Instant feedback: reducers update on `*Request`; sagas call the API and roll back on failure.
- Perceived speed: product-card skeletons, list virtualization (`useVirtualizedProducts`), ISR on product pages, shutter transitions (`WindowOpener` on first load, `NavigationProvider` and `NavigationWindow` between pages).
- Theme: `next-themes` with the `class` strategy, **default dark**, floating `ModeToggle`. Prices show in USD or INR (a currency dropdown in the header, stored in cart state).
- Responsive: desktop filter sidebar, mobile `FilterSheet`. The sticky header sets `--header-height`. Cart, wishlist and filters carry landmark `aria-label`s.

## Visual system

Tokens live in `client/src/styles/globals.css`. `:root` and `.dark` set semantic CSS variables in `oklch`; `@theme inline` maps them to Tailwind v4 utilities. There is no `tailwind.config` (the empty `tailwind.config.js` is unused).

### Typography

Both fonts load through `next/font/google` in `app/layout.tsx`.

| Font | Variable | Use |
| --- | --- | --- |
| Convergence (weight 400) | `--font-convergence`, class `font-convergence` | Body text on `<body>`; `--font-serif` |
| Inter | `--font-inter` | `--font-sans` |
| System monospace stack | `--font-mono` | Code, if any |

### Colour

Same primary in both themes. Hex values are approximate conversions of the `oklch` tokens.

| Token | Light | Dark |
| --- | --- | --- |
| `--primary` (warm amber) | `oklch(0.7809 0.1691 69.9324)` ≈ `#fba101` | same |
| `--primary-foreground` | `oklch(0.1822 0 0)` ≈ `#121212` | same |
| `--background` | `oklch(1 0 0)` white | `oklch(0.1286 0 0)` near black |
| `--foreground` | `oklch(0.1448 0 0)` | `oklch(0.9491 0 0)` |
| `--card` | `oklch(0.9851 0 0)` | `oklch(0.1684 0 0)` |
| `--popover` | `oklch(0.9911 0 0)` | `oklch(0.209 0 0)` |
| `--secondary` | `oklch(0.92 0.0651 74.3695)` pale peach | `oklch(0.32 0.0202 67)` dark brown |
| `--secondary-foreground` | `oklch(0.3499 0.0685 40.8288)` | `oklch(0.9292 0.0499 67.1475)` |
| `--muted` / `--accent` | `oklch(0.9491 0 0)` / `oklch(0.931 0 0)` | both `oklch(0.252 0 0)` |
| `--muted-foreground` | `oklch(0.5486 0 0)` | `oklch(0.6993 0 0)` |
| `--border` / `--input` | `oklch(0.9401 0 0)` / `oklch(0.9006 0 0)` | `oklch(0.252 0 0)` / `oklch(0.3012 0 0)` |
| `--destructive` | `oklch(57.707% 0.21516 27.312)` ≈ `#dc2626` | same |
| `--ring` | same as primary | same |

Also defined: `--chart-1` to `--chart-5`, `--sidebar*` (mirror card and primary), shadow scale `--shadow-2xs` to `--shadow-2xl` (soft, low opacity black).

Product tags (`bestseller`, `trending`, `top-rated`, `added-to-cart`, `unavailable`) are the one exception to semantic classes: light and dark palettes of hard-coded hex pairs in `utils/products/products.ts`.

### Icon and share card

- Mark: the amber "SN" running shoe (`public/images/brand/shoe-logo.png`). Only one colourway exists, so `favicon-light.png` and `favicon-dark.png` are the same artwork: transparent, 192px, no glow or shadow. Amber reads on both light and dark browser chrome. The apple-touch icon is the mark on charcoal `#121212`, 180px, opaque. `favicon.ico` carries 16, 32 and 48px. The shoe is wide, so it is small at 16px.
- Share card (`public/brand/share-card.jpg`, 1200x630, under 100 KB): charcoal background with a soft amber glow, the dark wordmark, "Premium Branded Shoes" in Convergence with "Shoes" in primary amber, an amber rule, the line "Top brands. Latest styles. Everyday comfort." in Inter, two product shoes as the signature visual, and an amber domain strip. Keep text clear of the shoes and the strip when editing.
- Source and regeneration: `client/scripts/share-card/` and `npm run share-card` (see [ARCHITECTURE](./ARCHITECTURE.md)).

### Shape and layout

- Radius: `--radius: 0.6rem`; `rounded-sm/md/lg/xl` are radius minus 4px, minus 2px, radius, plus 4px.
- Breakpoints add `xs: 475px` and set `2xl: 1450px`; the rest are Tailwind defaults (`sm 640`, `md 768`, `lg 1024`, `xl 1280`).
- Spacing base `0.25rem`. Mobile-first extras live in `mediaQueries.css`.

### Motion

- Framer Motion for the shutter (`WindowOpener`, `NavigationWindow`); timings and easing are in `constants/animations.ts` (shutter 0.8 s, ease `[0.76, 0, 0.24, 1]`, first-load intro about 1 s before content).
- CSS keyframes in `globals.css`: `marquee` (promo bar), `slideDown`, `fadeIn` / `fadeOut`, `shake`, `rotate`, `tilt`, `wave`, `popup-enter` / `popup-exit`, `countdown`. `tw-animate-css` supplies the shadcn enter and exit animations.
- Skeletons while loading. There is no `prefers-reduced-motion` handling in the project CSS.

### Components

shadcn/ui **New York**, `baseColor: neutral`, CSS variables, Lucide icons (`client/components.json`; its `tailwind.css` path still says `src/app/globals.css` but the file is `src/styles/globals.css`). Primitives in `components/ui/`: avatar, button (CVA variants), command, dialog, drawer, dropdown-menu, select, sheet, skeleton, sonner, spinner. Compose classes with `cn()` from `@/lib/utils`.

**Hierarchy**

1. `components/ui/`: primitives only.
2. `components/shared/`: `Sheet`, `ProductActions`, `WishlistToggle`, `TransitionLink`, `QuantityCounter`, `ProductImage`, `ModeToggle`, `ScrollToTop`, `NavigationWindow`. `components/modals/` holds `Modal` and `ConfirmationModal`.
3. Feature folders: `home/`, `headers/`, `cart/`, `wishlist/`, `product-details/`, `auth/`, `ai-assistant/`, `skeletons/`, `footers/`.
4. `app/` pages: route shells only.

## Screen composition

`layout.tsx` → `LayoutClient`: providers, `Header` (`HeaderOne` promo and account bar, `HeaderTwo` logo, search and actions, `Sidebar`), `ModeToggle`, page, `Footer` + `FooterTwo`, `ScrollToTop`, `Toaster`.

| Screen | Composition |
| --- | --- |
| Home | `ProductsLayout` → `ProductsFiltersPanel` (`FiltersSidebarContent` on desktop, `FilterSheet` on mobile) + `ProductsGrid` → `VirtualizedProductList` → `ProductCard` |
| Product | Server page loads the product → `ProductDetailsPageClient` → `ProductDetailsCard` (carousel, tags, `ProductActions`) |
| Cart | `CartSection` → header, item list, `Coupon`, `OrderSummary`, `PaymentMethods` (logos only) |
| Wishlist | `WishlistSection` → header, list or empty state |
| Auth | `Modal` + `LoginForm` / `SignUpForm` |
| Assistant | Header `Sheet` → `AiAssistant` (header, chat area, welcome, footer, feedback form) |

Logic stays in hooks. Pages should not grow into feature implementations.

## Principles

- Brand copy from the manifest through `@/constants/brand`; colours from tokens, not raw values.
- Every mutation gets a toast; loading states use skeletons, not spinners over empty space.
- Every UI component file stays at or under 120 lines (some files do not meet this yet; see [TASKS](./TASKS.md)).
- Check each changed screen in light and dark, on phone and desktop.
