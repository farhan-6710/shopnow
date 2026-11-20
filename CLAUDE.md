# ShopNow

Shoe storefront: browse and filter products, product pages, cart and wishlist, sign-in, and an in-page assistant. Two packages, no root workspace: `client/` (Next.js 16 App Router) and `server/` (Express 5 + Prisma 7 + Neon PostgreSQL). Brand copy lives in `brandManifest.json` at the repo root.

This is the only `CLAUDE.md`. It loads the shared docs and each package's docs below. When docs conflict, [docs/RULES.md](./docs/RULES.md) wins.

@docs/RULES.md
@docs/PRD.md
@docs/DATABASE.md
@docs/MEMORY.md

Client:

@docs/client/RULES.md
@docs/client/ARCHITECTURE.md
@docs/client/DESIGN.md
@docs/client/TASKS.md
@docs/client/MEMORY.md

Server:

@docs/server/RULES.md
@docs/server/ARCHITECTURE.md
@docs/server/TASKS.md
@docs/server/MEMORY.md

## Key directories

| Path | Holds |
| --- | --- |
| `brandManifest.json` | Brand copy (name, tagline, description, SEO, contact, assistant) |
| `client/src/app/` | Routes `/`, `/products/[itemName]`, `/cart`, `/wishlist`; `api/` is leftover Supabase code |
| `client/src/components/` | `ui/` (shadcn), `shared/`, feature folders |
| `client/src/constants/brand.ts` | Reads the manifest (`brand`, `mailtoHref`) |
| `client/src/hooks/`, `providers/`, `redux/`, `services/` | Logic, providers, store and sagas, Axios API modules |
| `client/src/styles/globals.css` | Theme tokens |
| `server/src/` | `app.ts`, `routes/`, `controllers/`, `middlewares/`, `config/db.ts` |
| `server/prisma/` | Schema, migrations, seed |

## Brand and theme

- Brand copy comes only from `brandManifest.json`; the client reads it through `@/constants/brand`. Nothing is generated from it: edit the JSON and rebuild. The server shows no brand text.
- Theme tokens stay in `client/src/styles/globals.css`.

## Conventions

- Client imports use `@/` (`@/*` maps to `client/src/*`).
- Components: PascalCase files grouped by feature. Hooks: `useX.ts`. API modules: `*Api.ts`. Server files: camelCase (`cartController.ts`).
- Quotes: double in client, single in server. Keep each file's export style.
- UI component files stay at or under 120 lines (13 existing files are over; see client TASKS).
- Layers: UI in `app/` and `components/`; state in local state, Context (auth, theme), Redux (cart, wishlist, chat, feedback) or React Query (catalog); API in `services/*Api.ts`; server flow is route, controller, Prisma.
- No Prisma or Express code in the client. Do not add Next route handlers (`client/src/app/api` is leftover Supabase code).
- User id for writes comes from the JWT, never the request body.
- Schema changes: edit `server/prisma/schema.prisma`, run `npx prisma migrate dev --name <name>`, never edit an applied migration; run `npx prisma migrate deploy` on the target database before deploying code that needs it.
- Never commit `.env` or `.env.local`; document env names only.
- Prefer editing existing files. No drive-by refactors.

## Commands

Scripts are run with npm (both packages also have `bun.lock`).

| | `client/` | `server/` |
| --- | --- | --- |
| Install | `npm install` | `npm install` |
| Dev | `npm run dev` (port 3000) | `npm run dev` (port 5001) |
| Lint | `npm run lint` | `npm run lint` (broken: ESLint 10 needs a flat config) |
| Type-check | `npx tsc --noEmit` | `npx tsc --noEmit` |
| Build | `npm run build` | `npm run build` (`prisma generate` + `tsc`) |
| Test | none | `npm test` (Jest, no tests yet) |
| Seed | `npm run seed` (Supabase, legacy) | `npm run seed:products` (see server TASKS) |
| Migrate | | `npx prisma migrate dev` / `npx prisma migrate deploy` |

## Before you finish

- `client`: `npm run lint`, `npx tsc --noEmit` and `npm run build` pass.
- `server`: `npm run build` and `npx tsc --noEmit` pass (`npm run lint` is broken until a flat ESLint config is added).
- No hard-coded brand copy: `git grep -n -i "shopnow" client/src server/src` shows only the coupon code `SHOPNOW10` and the `shopnow-favicon.png` path.
- Check changed screens in light and dark, on phone and desktop.

## Docs

| Doc | Covers |
| --- | --- |
| [docs/](./docs/) | PRD, DATABASE, RULES, MEMORY (shared) |
| [docs/client/](./docs/client/) | Architecture, design, rules, tasks, memory |
| [docs/server/](./docs/server/) | Architecture, rules, tasks, memory |
| [README.md](./README.md) | Setup, routes, deploy |
