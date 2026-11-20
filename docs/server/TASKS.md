# Tasks — ShopNow Server

`[x]` done · `[ ]` to do.

Product: [PRD](../PRD.md) · Structure: [ARCHITECTURE](./ARCHITECTURE.md).

## Done

- [x] `npm run lint` works: `eslint.config.mjs` flat config with `@eslint/js` and `typescript-eslint` (same as HireHub); six lint errors fixed without behaviour changes. The old `.eslintrc.js` is ignored by ESLint 10 and can be deleted

Derived from `git log` and the code.

- [x] Express API in TypeScript with a health route
- [x] Moved from Supabase to Prisma and Neon PostgreSQL (five migrations, March 2026)
- [x] Auth: email and password, JWT cookie, `GET /auth/me`, Google OAuth
- [x] Products: list, names, lookup by name
- [x] Cart and wishlist: bulk add, update, bulk remove, clear
- [x] Feedback from the assistant
- [x] Seed script and `products.json` (28 products)

## Needs the owner

- [ ] Run `npm run seed:products` against a Neon branch to see whether it works (not run here because it writes data). The script spreads `created_at` and `updated_at` from `products.json` into `prisma.product.create`, but the schema fields are `createdAt` and `updatedAt`, so it probably fails.
- [ ] Set `GOOGLE_REDIRECT_URL` to the route the server really serves, `<API origin>/auth/google/callback`, and make the same URL an authorized redirect in the Google console.
- [ ] Decide whether `JWT_EXPIRES_IN` and `CREATOR_ID` stay in `.env`; no code reads them (expiry is fixed at 7 days in `generateToken.ts`).

## Later

- [ ] Clear the logout cookie with the same options it was set with (`sameSite: 'none'` in production); it uses `strict` today, which can leave the cookie in place across sites
- [ ] Remove the `DEBUG_OAUTH_ENV` console log in `googleAuthInit`; it prints the OAuth client id
- [ ] The `googleAuth.ts` fallback redirect URL says `/api/auth/google/callback`, which is not a route; correct it to `/auth/google/callback`
- [ ] One error shape: `errorHandler` returns `{ message }`, controllers return `{ error }` or `{ success: false, error }`
- [ ] Validate request bodies (non-numeric `productId` makes `BigInt()` throw and returns 500; password and email rules are minimal)
- [ ] Rate limit login and sign-up; stop returning the JWT in the response body
- [ ] Fix controller doc comments that say `/api/...` (routes are mounted without a prefix)
- [ ] Remove the unused `src/models/item.ts` and `migration.txt`
- [ ] Add a `migrate:deploy` script and tests (Jest is configured, no tests exist)
- [ ] Pagination for `GET /products`

Client work is tracked in [client TASKS](../client/TASKS.md).
