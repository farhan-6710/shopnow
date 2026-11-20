# Rules — ShopNow Client

Shared rules: [docs/RULES.md](../RULES.md). Product: [PRD](../PRD.md) · Structure: [ARCHITECTURE](./ARCHITECTURE.md) · Look: [DESIGN](./DESIGN.md).

## Non-negotiable (client)

- Brand copy only from `@/constants/brand` (`brand`, `mailtoHref`). Edit `brandManifest.json`, not components. The only allowed literals are the coupon code `SHOPNOW10` and the `shopnow-favicon.png` image path.
- Theme tokens only in `client/src/styles/globals.css` (`:root`, `.dark`, `@theme inline`). Components use semantic classes (`bg-primary`, `text-muted-foreground`), not raw colours. Product tag colours in `utils/products/products.ts` are the existing exception.
- No Prisma or Express code in the client. Do not add Next route handlers: `src/app/api/*` is leftover Supabase code.
- Add API calls to a `services/*Api.ts` module and its URL to `constants/api.ts`. Async cart, wishlist and feedback work goes through slices and sagas, not `fetch` in components.
- Axios keeps `withCredentials: true` so the auth cookie is sent.

## UX

- Toast after every cart, wishlist, auth and feedback action. Never fail silently.
- Optimistic updates must roll back on API failure (see the sagas).
- Icon-only buttons need an `aria-label`.

## Naming and folders

| Thing | Convention |
| --- | --- |
| Component | `PascalCase.tsx`, default export, grouped by feature. shadcn files in `components/ui/` stay kebab-case. Keep existing folder names (`product-details`, `filters-panel`, `headerOne`, `headerTwo`) |
| Hook | `useX.ts` in `src/hooks`, named export |
| API module | `*Api.ts` in `src/services`, named export object |
| Types | PascalCase in `src/types` |
| Constants | `UPPER_SNAKE_CASE` in `src/constants` |
| Imports | `@/` maps to `src/` |
| Quotes | Double quotes; keep each file's export style |

## Code

- `"use client"` only where the file uses client APIs.
- UI component files stay at or under 120 lines. Split into subcomponents, hooks, constants or types. Thirteen files are over today; see [TASKS](./TASKS.md). Do not grow them further.
- State: local state for forms and filters; Context for auth and theme; Redux for cart, wishlist, chat and feedback; React Query for the product catalog.
- Some UI still imports `redux/cart/` and `redux/wishlist/`. Keep the import path the file already uses.
- TypeScript strict, no `any`, no unused imports. Use `cn()` for conditional classes.

## Working

- Before finishing: `npm run lint`, `npx tsc --noEmit` and `npm run build` pass; check changed screens in light and dark, on phone and desktop widths.
- There is no client test framework. Update [TASKS](./TASKS.md) and [MEMORY](./MEMORY.md) when work lands.
