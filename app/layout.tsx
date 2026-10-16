import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "./SmoothScroll";
import {
  CANONICAL_URL,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  ORG_NAME_AR,
  ORG_NAME_EN,
  SITE_URL,
} from "./site-data";
import { serializeJsonLd, siteGraph } from "./structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: ORG_NAME_AR,
    template: `%s | ${ORG_NAME_AR}`,
  },
  description:
    "مصنع صباغة وتجهيز الأقمشة القطنية والبوليستر والممزوجة في العاشر من رمضان، مصر. خبرة تتجاوز 45 عاماً وطاقة إنتاجية تتجاوز 600 طن شهرياً.",
  applicationName: ORG_NAME_EN,
  alternates: { canonical: CANONICAL_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    url: CANONICAL_URL,
    siteName: ORG_NAME_EN,
    title: `صباغة وتجهيز الأقمشة | ${ORG_NAME_AR}`,
    description:
      "مصنع مصري لصباغة وتجهيز الأقمشة القطنية والبوليستر والممزوجة، بطاقة تتجاوز 600 طن شهرياً وحمولات من 200 إلى 1200 كجم.",
    images: [
      {
        url: OG_IMAGE_URL,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        type: "image/webp",
        alt: "داخل مصنع الخماسية للصناعات النسيجية — خطوط صباغة وتجهيز الأقمشة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `صباغة وتجهيز الأقمشة | ${ORG_NAME_AR}`,
    description:
      "مصنع مصري لصباغة وتجهيز الأقمشة القطنية والبوليستر والممزوجة، بطاقة تتجاوز 600 طن شهرياً.",
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: [{ url: "/assets/brand/logo-transparent.png", type: "image/png" }],
    shortcut: "/assets/brand/logo-transparent.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteGraph) }}
        />
      </body>
    </html>
  );
}
