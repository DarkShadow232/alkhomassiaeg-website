import type { Metadata } from "next";
import ConceptBClient from "./ConceptBClient";
import { CANONICAL_URL, ORG_NAME_AR } from "./site-data";
import { pageGraph, serializeJsonLd } from "./structured-data";

export const metadata: Metadata = {
  // Keep the browser tab focused on the company name only.
  title: { absolute: ORG_NAME_AR },
  description:
    "مصنع صباغة وتجهيز أقمشة في العاشر من رمضان: قطن وبوليستر وممزوج، حمولات 200–1200 كجم، وطاقة تتجاوز 600 طن شهرياً. اطلب عرض سعر.",
  alternates: { canonical: CANONICAL_URL },
};

export default function Home() {
  return (
    <>
      <ConceptBClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageGraph) }}
      />
    </>
  );
}
