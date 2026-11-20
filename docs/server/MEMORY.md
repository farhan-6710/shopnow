# Memory — ShopNow Server

Short durable facts. Shared decisions: [docs/MEMORY.md](../MEMORY.md). Work left: [TASKS.md](./TASKS.md).

## Decisions

- The cookie is `secure` and `sameSite=none` in production so the Vercel client can send it to the Render API.
- Cart `POST` is an upsert that sets the quantity, which is what the guest-to-account sync relies on.
- Wishlist `POST` skips products already saved and reports `added` and `skipped`.
- Product names are matched case-insensitively with `decodeURIComponent`, so product page URLs use the product name.
- The Prisma client is created once in `config/db.ts` with the pg adapter; the seed script builds its own client.
- The server keeps `package-lock.json` next to `bun.lock`; after dependency changes keep both in sync.
