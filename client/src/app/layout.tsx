import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Inter, Convergence } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import LayoutClient from "./LayoutClient";
import { rootMetadata, rootViewport, storeJsonLd } from "@/lib/seo";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const convergence = Convergence({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-convergence",
});

export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${convergence.variable}`}
      suppressHydrationWarning
    >
      <body className="font-convergence">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
