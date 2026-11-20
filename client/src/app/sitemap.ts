import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getAllProductNames } from "@/utils/products/products";

export const revalidate = 3600;

/** Home plus every product page. /cart, /wishlist and /api are excluded (see robots.ts). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductNames();
  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    ...products.map((product) => ({
      url: `${siteUrl}/products/${encodeURIComponent(product.name)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
