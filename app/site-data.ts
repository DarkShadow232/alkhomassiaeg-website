/**
 * Single source of truth for the verified business facts.
 *
 * Every value below is taken from copy that already existed in this codebase
 * (hero, capabilities, services, materials, contact) or from the approved
 * company materials referenced in CONTENT_AUDIT.md. Nothing here is inferred.
 *
 * The visible summary/FAQ copy, the JSON-LD graph, sitemap.xml and llms.txt all
 * read from this module so structured data can never drift from what a visitor
 * (or an AI crawler) actually sees on the page — which is a hard requirement for
 * FAQPage markup.
 *
 * Deliberately ABSENT because the codebase does not state them — do not invent:
 *   sameAs (social profiles), foundingDate (only "45+ years" is documented),
 *   geo coordinates, postalCode, opening hours, priceRange, areaServed.
 */

export const SITE_URL = "https://www.alkhomassiaeg.com";
export const CANONICAL_URL = `${SITE_URL}/`;

export const ORG_NAME_AR = "الخماسية للصناعات النسيجية";
export const ORG_NAME_EN = "AL KHOMASSIA FOR TEXTILE INDUSTRIES";

export const PHONE_E164 = "+201273933043";
export const PHONE_DISPLAY = "+20 127 393 3043";
export const EMAIL = "sales@alkhomassiaeg.com";
export const WHATSAPP_URL = "https://wa.me/201273933043";

export const LOGO_URL = `${SITE_URL}/assets/brand/logo-transparent.png`;
export const OG_IMAGE_URL = `${SITE_URL}/assets/posters/tour-desktop-bdc60fe2.webp`;
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;

export const ADDRESS = {
  street: "المنطقة الصناعية A4",
  streetEn: "Industrial Zone A4",
  locality: "مدينة العاشر من رمضان",
  localityEn: "10th of Ramadan City",
  region: "الشرقية",
  regionEn: "Sharqia",
  country: "EG",
} as const;

/** Verified operating figures (approved company materials, August 2026). */
export const FACTS = {
  yearsExperience: "45",
  monthlyTons: "600",
  loadRange: "200–1200",
  receiving: "24/7",
} as const;

/**
 * Plain, directly-stated summary of what the business does, for whom and where.
 * AI answer engines extract from concise factual statements, so this is written
 * as flat declarative sentences rather than marketing copy.
 */
export const SUMMARY = {
  ar: "الخماسية للصناعات النسيجية مصنع مصري متخصص في صباغة وتجهيز الأقمشة القطنية والبوليستر والممزوجة. يقع المصنع في المنطقة الصناعية A4 بمدينة العاشر من رمضان بمحافظة الشرقية، مصر. يستقبل المصنع أقمشة العملاء الخام ويسلّمها مصبوغة ومجهّزة بعد ست مراحل إنتاج متصلة، من الاستلام والتحضير حتى الفحص والتسليم. تتجاوز الطاقة الإنتاجية 600 طن شهرياً بحمولات صباغة من 200 إلى 1200 كجم للتشغيلة، بخبرة تتجاوز 45 عاماً.",
  en: "AL KHOMASSIA FOR TEXTILE INDUSTRIES is an Egyptian factory specialising in the dyeing and finishing of cotton, polyester and blended fabrics. The plant is located in Industrial Zone A4, 10th of Ramadan City, Sharqia Governorate, Egypt. It receives customers' raw fabric and returns it dyed and finished through six connected production stages, from receiving and preparation to inspection and dispatch. Capacity exceeds 600 tons per month with dyeing loads from 200 to 1,200 kg per run, backed by more than 45 years of experience.",
} as const;

export type FaqItem = { qAr: string; aAr: string; qEn: string; aEn: string };

/**
 * Q&A pairs restating facts that already appear elsewhere on this page.
 * Answers are self-contained so they remain correct when quoted in isolation.
 */
export const FAQ: readonly FaqItem[] = [
  {
    qAr: "ما الخدمات التي تقدمها الخماسية للصناعات النسيجية؟",
    aAr: "تقدم الخماسية صباغة وتجهيز الأقمشة عبر ست مراحل متصلة: الاستلام والتحضير، المعمل ومطابقة اللون، الصباغة، التجفيف والتثبيت الحراري، التجهيز الحراري والكيميائي والميكانيكي، ثم الفحص والتغليف والتسليم.",
    qEn: "What services does AL KHOMASSIA FOR TEXTILE INDUSTRIES provide?",
    aEn: "AL KHOMASSIA provides fabric dyeing and finishing across six connected stages: receiving and preparation, laboratory and colour matching, dyeing, drying and heat-setting, thermal/chemical/mechanical finishing, then inspection, packing and dispatch.",
  },
  {
    qAr: "أين يقع مصنع الخماسية؟",
    aAr: "يقع المصنع في المنطقة الصناعية A4 بمدينة العاشر من رمضان، محافظة الشرقية، مصر.",
    qEn: "Where is the AL KHOMASSIA factory located?",
    aEn: "The factory is located in Industrial Zone A4, 10th of Ramadan City, Sharqia Governorate, Egypt.",
  },
  {
    qAr: "ما أنواع الأقمشة التي تصبغها الخماسية؟",
    aAr: "تصبغ الخماسية وتجهّز الأقمشة القطنية والبوليستر والأقمشة المخلوطة. تُضبط مراحل الصباغة والتجهيز وفق نوع الخامة ومتطلبات كل تشغيلة.",
    qEn: "Which fabric types does AL KHOMASSIA dye?",
    aEn: "AL KHOMASSIA dyes and finishes cotton, polyester and blended fabrics. Dyeing and finishing stages are set around the material type and the requirements of each production run.",
  },
  {
    qAr: "ما الطاقة الإنتاجية للمصنع؟",
    aAr: "تتجاوز الطاقة الإنتاجية 600 طن شهرياً، وتتراوح حمولة الصباغة الواحدة بين 200 و1200 كجم، ما يتيح تنفيذ التشغيلات الصغيرة والكبيرة.",
    qEn: "What is the factory's production capacity?",
    aEn: "Capacity exceeds 600 tons per month, and a single dyeing load ranges from 200 to 1,200 kg, which allows both small and large production runs.",
  },
  {
    qAr: "كم سنة خبرة لدى الخماسية للصناعات النسيجية؟",
    aAr: "تمتلك الشركة خبرة تتجاوز 45 عاماً في صباغة وتجهيز الأقمشة في مصر.",
    qEn: "How much experience does AL KHOMASSIA have?",
    aEn: "The company has more than 45 years of experience in fabric dyeing and finishing in Egypt.",
  },
  {
    qAr: "كيف تضمنون مطابقة اللون قبل بدء التشغيل؟",
    aAr: "تُجرى اختبارات معملية لمطابقة العينة أو مرجع اللون قبل اعتماد التشغيل، مع متابعة التشغيلة أثناء التنفيذ للحفاظ على النتيجة المطلوبة.",
    qEn: "How is colour matching confirmed before production starts?",
    aEn: "Laboratory tests match the sample or colour reference before the run is approved, and the run is monitored during processing to maintain the specified result.",
  },
  {
    qAr: "هل الاستلام والتسليم متاح طوال الأسبوع؟",
    aAr: "نعم، الاستلام والتسليم متاح على مدار 24 ساعة طوال أيام الأسبوع (24/7).",
    qEn: "Is receiving and delivery available around the clock?",
    aEn: "Yes. Receiving and delivery are available 24 hours a day, seven days a week (24/7).",
  },
  {
    qAr: "كيف أطلب عرض سعر للصباغة والتجهيز؟",
    aAr: `يمكن طلب عرض السعر عبر واتساب أو الاتصال على ${PHONE_DISPLAY}، أو بمراسلة ${EMAIL}. يفضّل إرسال نوع القماش والكمية والخدمة المطلوبة لتسريع الرد.`,
    qEn: "How do I request a dyeing and finishing quote?",
    aEn: `Request a quote on WhatsApp or by calling ${PHONE_DISPLAY}, or email ${EMAIL}. Sending the fabric type, quantity and required service speeds up the reply.`,
  },
];

/** The six production stages, mirroring the services section. */
export const SERVICE_STAGES_EN = [
  "Receiving & preparation",
  "Laboratory & colour matching",
  "Fabric dyeing",
  "Drying & heat-setting",
  "Fabric finishing",
  "Inspection & dispatch",
] as const;
