import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.alkhomassiaeg.com"),
  title: {
    default: "الخماسية للصناعات النسيجية",
    template: "%s | الخماسية",
  },
  description:
    "صباغة وتجهيز الأقمشة في مدينة العاشر من رمضان، مصر. خبرة تتجاوز 45 عاماً وطاقة إنتاجية تتجاوز 600 طن شهرياً.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    siteName: "AL Khomassia For Textile Industries",
    title: "الخماسية للصناعات النسيجية",
    description: "رحلة متكاملة من استلام الخام حتى الفحص والتسليم.",
  },
  icons: { icon: "/assets/brand/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
