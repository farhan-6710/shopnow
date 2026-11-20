# Rules — ShopNow Server

Shared rules: [docs/RULES.md](../RULES.md). Product: [PRD](../PRD.md) · Data: [DATABASE](../DATABASE.md) · Structure: [ARCHITECTURE](./ARCHITECTURE.md).

## Non-negotiable (server)

- Flow is `routes/*Routes.ts` → `controllers/*Controller.ts` → Prisma. Register routers in `src/app.ts`.
- Protect user routes with `protect` (`router.use(protect)` for a whole router). Read the user id from `req.user`, never from the body.
- Convert BigInt ids to `Number` before sending JSON.
- Validate inputs in the controller and return the right status with an error body. Log details on the server; send generic text for 500s.
- Schema changes go through a Prisma migration; applied migrations are never edited.
- Never log secrets or OAuth config.

## Naming and folders

| Thing | Convention |
| --- | --- |
| Files | camelCase (`cartController.ts`, `authRoutes.ts`) |
| Folders | `routes`, `controllers`, `middlewares`, `config`, `utils`, `prisma/` |
| Quotes | Single quotes, semicolons, trailing commas (`.prettierrc`) |
| Types | PascalCase |

## Working

- Before finishing: `npm run build` (runs `prisma generate` and `tsc`) passes. `npm run lint` and `npx tsc --noEmit` pass too.
- Jest is configured and matches `**/tests/**/*.test.(ts|js)`; there are no tests yet. Add tests only under a `tests/` folder.
- Update [TASKS](./TASKS.md) and [MEMORY](./MEMORY.md) when work lands.
