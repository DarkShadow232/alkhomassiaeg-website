import type { Metadata } from "next";
import ConceptBClient from "./ConceptBClient";

export const metadata: Metadata = {
  title: "الخماسية للصناعات النسيجية | صباغة وتجهيز الأقمشة",
  description:
    "أكثر من 45 عاماً في صباغة وتجهيز الأقمشة القطنية والبوليستر والممزوجة، بطاقة إنتاجية تتجاوز 600 طن شهرياً.",
};

export default function Home() {
  return <ConceptBClient />;
}
