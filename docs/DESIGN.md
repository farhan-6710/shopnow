# Design

## Product / UX

- Shoe catalog first: home is a filterable grid; search in the header jumps to `/products/[name]`.
- Stay on the page: email login/signup is modal; the assistant is a sheet; toasts confirm cart, wishlist, filters, and navigation.
- Guest then account: cart and wishlist work locally; on login they merge to the API (`DataSyncProvider` / `useSyncUserData`).
- Instant feedback: cart and wishlist reducers update on `*Request`; sagas call the API and roll back on failure.
- Perceived speed: product-card skeletons, list virtualization (`useVirtualizedProducts`), ISR on product pages, shutter transitions (`WindowOpener`, `NavigationProvider`).
- Theme: `next-themes` class strategy, **default dark**; floating `ModeToggle`. Currency is USD or INR in cart state.
- Responsive: desktop filter sidebar; mobile `FilterSheet`. Sticky header exposes `--header-height`. Landmark `aria-label`s on cart, wishlist, and filters.

## Visual system

Tokens live in `client/src/styles/globals.css`. `:root` and `.dark` set semantic CSS variables; `@theme inline` maps them to Tailwind v4 utilities.

| Group   | Tokens                                                                                                      |
| ------- | ----------------------------------------------------------------------------------------------------------- |
| Surface | `--background`, `--foreground`, `--card`, `--popover`, `--muted`, `--accent`, `--sidebar` (+ `-foreground`) |
| Brand   | `--primary` (warm gold), `--secondary`, `--destructive`, `--ring`                                           |
| Chrome  | `--border`, `--input`, `--radius` (`0.6rem`), shadow scale                                                  |
| Type    | `--font-sans` → Inter, `--font-serif` / body → Convergence (`font-convergence`)                             |

shadcn/ui **New York**, `baseColor: neutral`, CSS variables, Lucide (`client/components.json`). Primitives in `components/ui/` (button CVA variants, dialog, sheet, drawer, select, dropdown, command, avatar, skeleton, sonner, spinner). Compose with `cn()` from `lib/utils`. Extra motion and layout CSS: `globals.css`, `mediaQueries.css`. Breakpoints include `--breakpoint-xs: 475px` and `--breakpoint-2xl: 1450px`. Product tags use light/dark palettes in `utils/products/products.ts`.

**Hierarchy**

1. `components/ui/` — primitives
2. `components/shared/` — `Sheet`, `Modal`, `ProductActions`, `WishlistToggle`, `TransitionLink`, `QuantityCounter`
3. Feature folders — `home/`, `headers/`, `cart/`, `wishlist/`, `product-details/`, `auth/`, `ai-assistant/`, `modals/`, `skeletons/`
4. `app/` pages — route shells only

## Screen composition

`layout.tsx` → `LayoutClient`: providers, `Header` (`HeaderOne` + `HeaderTwo` + `Sidebar`), `ModeToggle`, page, `Footer` + `FooterTwo`, `ScrollToTop`, `Toaster`.

| Screen    | Composition                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Home      | `ProductsLayout` → `ProductsFiltersPanel` (`FiltersSidebarContent` / `FilterSheet`) + `ProductsGrid` → `VirtualizedProductList` → `ProductCard` |
| Product   | Server page loads product → `ProductDetailsPageClient` → `ProductDetailsCard` (carousel, tags, `ProductActions`)                                |
| Cart      | `CartSection` → header, list, coupon, order summary, payment methods                                                                            |
| Wishlist  | `WishlistSection` → header, list or empty                                                                                                       |
| Auth      | `Modal` + `LoginForm` / `SignUpForm`                                                                                                            |
| Assistant | Header `Sheet` → `AiAssistant` (header, chat, welcome, footer)                                                                                  |

Logic stays in hooks (`useFilterProducts`, `useCartManagement`, `useProductsQuery`, `useSearchProduct`, `useAiAssistant`). Pages should not grow into feature implementations.

## Data flow

```
UI event
  → hook or AuthProvider
      → Redux dispatch (optimistic) and/or React Query
          → saga (cart, wishlist, feedback) or Query fn
              → services/*Api + axiosInstance
                  → Express (cookie JWT)
                      → Prisma
                          → Neon (PostgreSQL)
```

- **Catalog:** `useProductsQuery` → `GET /products`. Details: `getProduct` / `getAllProductNames` → `GET /products/:itemName` and `/names`.
- **Session:** `AuthProvider` → `authApi` (`/auth/*`). Google is a full redirect to `GET /auth/google`.
- **Persist:** redux-persist whitelist `cart`, `wishlist`, `chat`.
- **AI:** `useAiAssistant` → OpenRouter; messages stored in `chatSlice`.

## Component size

Every UI component file is **≤ 120 lines**. If it grows past that, split by responsibility: subcomponent, hook, constants, or types. Do not leave page files as large feature modules.
