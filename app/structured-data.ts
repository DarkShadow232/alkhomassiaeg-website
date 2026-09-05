/**
 * schema.org JSON-LD graphs.
 *
 * Split in two, cross-referenced by @id:
 *   siteGraph  — Organization + WebSite, sitewide identity (rendered in layout)
 *   pageGraph  — WebPage/FAQPage + Service for "/" (rendered in page)
 *
 * Every property is backed by a fact in site-data.ts. Optional properties we
 * cannot verify (sameAs, foundingDate, geo, openingHours, priceRange,
 * areaServed) are omitted rather than filled with placeholders, so the output
 * validates with no empty or invented required fields.
 */

import {
  ADDRESS,
  CANONICAL_URL,
  EMAIL,
  FAQ,
  LOGO_URL,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  ORG_NAME_AR,
  ORG_NAME_EN,
  PHONE_E164,
  SERVICE_STAGES_EN,
  SITE_URL,
  SUMMARY,
} from "./site-data";

const ORG_ID = `${CANONICAL_URL}#organization`;
const WEBSITE_ID = `${CANONICAL_URL}#website`;
const WEBPAGE_ID = `${CANONICAL_URL}#webpage`;
const SERVICE_ID = `${CANONICAL_URL}#service`;
const LOGO_ID = `${CANONICAL_URL}#logo`;

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 2000,
      height: 1600,
      caption: ORG_NAME_AR,
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: ORG_NAME_AR,
      alternateName: ORG_NAME_EN,
      url: CANONICAL_URL,
      logo: { "@id": LOGO_ID },
      image: { "@id": LOGO_ID },
      description: SUMMARY.ar,
      telephone: PHONE_E164,
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.street,
        addressLocality: ADDRESS.locality,
        addressRegion: ADDRESS.region,
        addressCountry: ADDRESS.country,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: PHONE_E164,
          email: EMAIL,
          availableLanguage: ["ar", "en"],
        },
      ],
      knowsAbout: [
        "صباغة الأقمشة",
        "تجهيز الأقمشة",
        "صباغة الأقمشة القطنية",
        "صباغة البوليستر",
        "الأقمشة الممزوجة",
        "Fabric dyeing",
        "Fabric finishing",
        "Textile heat-setting",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: CANONICAL_URL,
      name: ORG_NAME_AR,
      alternateName: ORG_NAME_EN,
      description: SUMMARY.ar,
      publisher: { "@id": ORG_ID },
      inLanguage: "ar",
    },
  ],
} as const;

export const pageGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // Multi-typed so the single public URL is both the page entity and the
      // FAQ entity — no duplicate node competes for the same canonical URL.
      "@type": ["WebPage", "FAQPage"],
      "@id": WEBPAGE_ID,
      url: CANONICAL_URL,
      name: `${ORG_NAME_AR} | صباغة وتجهيز الأقمشة`,
      description: SUMMARY.ar,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      inLanguage: "ar",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE_URL,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
      },
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.qAr,
        acceptedAnswer: { "@type": "Answer", text: item.aAr },
      })),
    },
    {
      "@type": "Service",
      "@id": SERVICE_ID,
      name: "صباغة وتجهيز الأقمشة",
      alternateName: "Fabric dyeing and finishing",
      serviceType: "Fabric dyeing and finishing",
      description: SUMMARY.ar,
      provider: { "@id": ORG_ID },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "مراحل الإنتاج",
        itemListElement: SERVICE_STAGES_EN.map((stage, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: { "@type": "Service", name: stage },
        })),
      },
    },
  ],
} as const;

/** Serialise for embedding in a <script> without allowing tag break-out. */
export function serializeJsonLd(graph: unknown): string {
  return JSON.stringify(graph)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export { SITE_URL };
