# Database — ShopNow

Neon Postgres, accessed only by the Express server through Prisma (`server/prisma/schema.prisma`, `@prisma/adapter-pg`, connection string from `DATABASE_URL`). The client never connects to it. Column names are camelCase in both Prisma and the database (no `@map`).

## Model

```text
users 1─* cart_items *─1 products
  ├────── 1─* wishlist_items *─1 products
  └────── 1─* feedbacks
```

Prisma model names are `User`, `Product`, `CartItem`, `WishlistItem`, `Feedback`.

| Model | Key | Notes |
| --- | --- | --- |
| `User` | `id` uuid | `email` unique (stored lowercase); `password` is a bcrypt hash (Google users get a random one); `picture` optional, set by Google sign-in |
| `Product` | `id` BigInt autoincrement | `name`, `imgSource` (path under `client/public`), `brand`, `category`, `color`, `description`, `rating` (Float), `prices` (Json: `{ "USD": number, "INR": number }`), `priceRange`, `tags` (`String[]`), `status`, timestamps |
| `CartItem` | composite (`userId`, `productId`) | `quantity` defaults to 1; indexed on `userId` |
| `WishlistItem` | composite (`userId`, `productId`) | indexed on `userId` |
| `Feedback` | `id` BigInt autoincrement | `userId`, `topic`, `rating` (Int 1 to 5), `message`; `createdAt` is `timestamptz`; indexed on `userId` |

Enums:

| Enum | Values |
| --- | --- |
| `Brand` | `Nike`, `Adidas`, `Puma`, `Vans` |
| `Category` | `sneakers`, `flats`, `Canvas`, `heels` |
| `Color` | `white`, `red`, `green`, `black`, `blue` |
| `PriceRange` | `cheap`, `affordable`, `expensive` |
| `ProductStatus` | `available`, `unavailable` |

Deleting a user cascades to their cart items, wishlist items and feedback. Deleting a product cascades to the cart and wishlist rows that point at it.

## Rules

- Product and BigInt ids are converted to `Number` before they leave the API, because JSON cannot carry BigInt.
- The price a user sees is read from `prices` in the chosen currency; the database stores no currency per user.
- Orders, stock counts and reviews do not exist in the schema.
- Change the schema in `schema.prisma`, then run `npx prisma migrate dev --name <name>` and commit the migration. Never edit an applied migration. Apply to a deployed database with `npx prisma migrate deploy` before deploying code that needs it.
- Migrations so far: `added_product_table`, `added_other_tables`, `improve_timestamps_and_indexes`, `user_model_changed`, `add_user_picture` (all March 2026).
- `client/scripts/schema.sql` is the old Supabase schema, not this one. See [client TASKS](./client/TASKS.md).
