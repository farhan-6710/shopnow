# Architecture — ShopNow Server

Shared product and data: [PRD](../PRD.md) · [DATABASE](../DATABASE.md) · [RULES](../RULES.md). Client: [client ARCHITECTURE](../client/ARCHITECTURE.md).

## Stack

Express 5.2, TypeScript 5.9 (CommonJS, `strict`), Prisma 7.4 with `@prisma/adapter-pg`, Neon PostgreSQL, JWT in an HttpOnly cookie (`jsonwebtoken` 9, `cookie-parser`), `bcryptjs` 3, Google OAuth (`google-auth-library` 10), `cors`, `dotenv`. Dev tools: `nodemon`, `ts-node`, ESLint 10, Prettier 3, Jest 30 with `ts-jest`. The package name in `package.json` is `backend-course`.

## Folders

| Path | Purpose |
| --- | --- |
| `src/server.ts` | Process entry: loads env, connects the database, listens on `PORT` (default 5001), shuts down on errors and `SIGINT` |
| `src/app.ts` | CORS, JSON and form parsing, cookies, route mounting, error handler, `/health` |
| `src/routes` → `src/controllers` | HTTP layer, one pair per area: auth, products, cart, wishlist, feedback |
| `src/middlewares` | `authMiddleware.ts` (`protect`), `errorHandler.ts` |
| `src/utils` | `generateToken.ts` (JWT and cookie), `googleAuth.ts` (OAuth client) |
| `src/config/db.ts` | Prisma client with the pg adapter, `connectDB`, `disconnectDB` |
| `src/models/item.ts`, `src/types/env.d.ts` | Unused scaffold, env typings |
| `prisma/` | `schema.prisma`, `migrations/`, `products.json` (28 products), `seedProducts.ts` |
| `prisma.config.ts` | Prisma CLI config; reads `DATABASE_URL` |
| `dist/` | `tsc` output (ignored by git) |
| `migration.txt` | Old planning notes from the move off Supabase; not documentation |

## API

No version prefix. Success bodies are `{ success: true, data }` for products, cart and wishlist; auth returns `{ status: 'success', user, token? }`. Errors are `{ error: string }` or `{ success: false, error }`.

| Area | Routes |
| --- | --- |
| Auth | `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` (auth), `GET /auth/google`, `GET /auth/google/callback` |
| Products (public) | `GET /products`, `GET /products/names`, `GET /products/:itemName` (case-insensitive name match) |
| Cart (auth) | `GET /cart`, `POST /cart` (one item or an array; upsert sets the quantity), `PUT /cart` (`productId`, `quantity` of at least 1), `DELETE /cart` (`productId`, or `productIds`, or empty body to clear all) |
| Wishlist (auth) | `GET /wishlist`, `POST /wishlist` (one or many, skips duplicates), `DELETE /wishlist` |
| Feedback (auth) | `POST /feedback` (`topic`, `rating`, `message`; a word rating such as `excellent` maps to 5 to 1) |
| Health | `GET /health` returns `{ "status": "ok" }` |

## Auth

- `signup` and `login` hash with bcrypt (10 rounds), lowercase the email, and call `generateToken`: a JWT with the user id, 7 day expiry, set as an HttpOnly cookie (`secure` and `sameSite=none` in production, `lax` otherwise). The token is also returned in the JSON body.
- `protect` reads `Authorization: Bearer <token>` first, then the cookie, verifies it, loads the user and sets `req.user`. Any failure is `401`.
- Google: `/auth/google` redirects to Google (scopes `profile`, `email`). The callback finds or creates the user (random password), sets the cookie and redirects to `CLIENT_URL`, or to `CLIENT_URL/?error=oauth_failed`.

## Config

`server/.env` (names only): `PORT` (default 5001), `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `AUTH_COOKIE_NAME` (default `jwt-token`), `CLIENT_URL` (default `http://localhost:3000`, also the CORS origin), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`. `JWT_EXPIRES_IN` and `CREATOR_ID` appear in a typings file and a local `.env` but no code reads them. Production needs HTTPS on both client and API because of the `sameSite=none` cookie.

## Deploy

- **API:** Render, configured in its dashboard (no config file in the repo). Repo scripts: `npm run build` (`prisma generate` and `tsc`) and `npm start` (`node dist/server.js`).
- **Database:** Neon PostgreSQL. Apply schema changes with `npx prisma migrate deploy` and `DATABASE_URL` pointing at the target database, before deploying code that needs them.
