# Rules — ShopNow (client and server)

Package rules: [client](./client/RULES.md) · [server](./server/RULES.md). Product: [PRD.md](./PRD.md). Data: [DATABASE.md](./DATABASE.md).

## Non-negotiable

- **Brand copy** only from `brandManifest.json` at the repo root: name, tagline, description, site URL, SEO title, template and keywords, contact email, assistant names. The client reads it through `client/src/constants/brand.ts` (`brand`, `mailtoHref`). Never type the brand name, contact email or SEO text into code; interpolate it. The server shows no brand text.
- **User id** for writes comes from the verified JWT (`req.user`), never from the request body.
- **Secrets**: never commit `.env` or `.env.local`, never paste secret values into docs, chats or code. Document variable names only.
- **No Prisma or Express code in the client**, and no SQL in React. The client talks to the API only through `client/src/services/`.
- **Migrations** are append-only. Run `prisma migrate deploy` on a database before deploying code that needs it. Test schema changes on a Neon branch, never on production.
- **Auth** is an HttpOnly cookie sent with `withCredentials: true`; keep CORS `credentials: true` and a single `CLIENT_URL` origin.

## Working

- Smallest change that solves the problem. Match existing names and folders. No drive-by refactors, new folders or libraries unless asked.
- Update the package's `TASKS.md` and `MEMORY.md` when work lands. Create other markdown only when asked.
- When a doc and the code disagree, fix whichever is wrong in the same change.
