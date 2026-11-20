# Product Requirements — ShopNow

A shoe storefront. Visitors browse and filter a catalog of 28 branded shoes (Nike, Adidas, Puma, Vans), open product pages, and keep a cart and wishlist. Signing in saves the cart and wishlist to the account. An in-page assistant answers product questions. There is no checkout: the cart ends at an order summary.

## Users

| User | Entry | Can do |
| --- | --- | --- |
| Visitor | `/`, `/products/[itemName]`, `/cart`, `/wishlist` | Browse and filter products, search by name, read product pages, use a local cart and wishlist, apply a coupon, switch USD or INR, use the assistant |
| Signed-in user | same routes | Everything above, with the cart and wishlist stored in the database and merged from the guest state on login; send feedback to the team from the assistant |

## Requirements

**Catalog.** The home page lists all products as a grid. Filters: category, color, price range and sort by price. Header search jumps to a product page. Product pages are statically generated and revalidated every 5 minutes. Each product has a brand, category, color, rating, prices in USD and INR, tags and an availability status.

**Cart and wishlist.** Add, remove and change quantity without signing in; both survive a reload (`localStorage`). Updates show at once and roll back if the API call fails. Signing in sends the local items to the account in bulk, then loads the merged result. The server upserts each item, so a guest quantity replaces the stored quantity for the same product (see [client ARCHITECTURE](./client/ARCHITECTURE.md)). The cart has one coupon, `SHOPNOW10`, worth 10% off.

**Auth.** Email and password sign-up and login, or Google sign-in. Login and sign-up are modals, not routes. The session is an HttpOnly cookie that lasts 7 days. Logout clears it.

**Assistant.** A chat sheet in the header calls OpenRouter from the browser (`useAiAssistant`). It is given the product list as context. It needs `NEXT_PUBLIC_OPENROUTER_API_KEY`. A feedback form (topic, rating, message) posts to the API for signed-in users.

**Look and feel.** Dark by default with a light option, responsive from phone to desktop, skeleton loaders and shutter page transitions. See [client DESIGN](./client/DESIGN.md).

## Out of scope today

Checkout and payments (the payment logos are decoration), orders and order history, stock levels, product reviews, admin or product management UI, password reset, email verification, search results page, tests. See [client TASKS](./client/TASKS.md) and [server TASKS](./server/TASKS.md).
