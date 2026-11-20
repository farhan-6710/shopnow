import type { Metadata, Viewport } from "next";
import { brand } from "@/constants/brand";

/**
 * Absolute base for canonical and Open Graph URLs, without a trailing slash.
 * On Vercel the production domain is set automatically; elsewhere the manifest's `siteUrl` is used.
 */
export const siteUrl = (
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : brand.siteUrl
).replace(/\/+$/, "");

const shareImage = { ...brand.seo.image, type: "image/jpeg" };

/** Root metadata. Tab icons follow the OS colour scheme; `public/favicon.ico` is the legacy fallback. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: brand.seo.title, template: brand.seo.titleTemplate },
  description: brand.seo.description,
  applicationName: brand.name,
  keywords: brand.seo.keywords,
  authors: [{ name: brand.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: brand.name,
    title: brand.seo.title,
    description: brand.seo.description,
    locale: brand.seo.locale,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.seo.title,
    description: brand.seo.description,
    images: [shareImage],
  },
  icons: {
    icon: [
      { url: brand.logo.favicon.ico, sizes: "any" },
      { url: brand.logo.favicon.light, type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: brand.logo.favicon.dark, type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: brand.logo.appleTouch, sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true },
};

export const rootViewport: Viewport = {
  themeColor: brand.seo.themeColor,
};

/** schema.org business card for search engines. */
export const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: brand.name,
  description: brand.seo.description,
  url: siteUrl,
  logo: `${siteUrl}${brand.logo.appleTouch}`,
  image: `${siteUrl}${brand.seo.image.url}`,
  email: brand.contact.email,
  slogan: brand.tagline,
};
