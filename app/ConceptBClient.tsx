"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { FAQ, SUMMARY } from "./site-data";

type AnimationModules = {
  gsap: typeof import("gsap")["default"];
  ScrollTrigger: typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
};

type Locale = "ar" | "en";

const scenes = [
  { id: "exterior", ar: "الاقتراب الخارجي", en: "Exterior approach", lineAr: "رحلة عبر الجودة", lineEn: "A journey through quality", image: "/assets/fallbacks/01-exterior.jpg" },
  { id: "entry", ar: "دخول المصنع", en: "Factory entry", lineAr: "خبرة تتحرك داخل كل مرحلة", lineEn: "Experience moves through every stage", image: "/assets/fallbacks/02-entry.jpg" },
  { id: "receiving", ar: "الاستلام والتحضير", en: "Receiving & preparation", lineAr: "استلام وتحضير وفق متطلبات كل تشغيلة", lineEn: "Prepared for every production run", image: "/assets/fallbacks/03-receiving.jpg" },
  { id: "dyeing", ar: "الصباغة", en: "Jet dyeing", lineAr: "صباغة متجانسة بحمولات مرنة", lineEn: "Consistent dyeing across flexible loads", image: "/assets/fallbacks/05-dyeing.jpg", factAr: "200–1200 كجم", factEn: "200–1,200 kg" },
  { id: "dyeing-entry", ar: "قاعة الصباغة", en: "Dyeing hall", lineAr: "بيئة تشغيل منظمة لنتائج أكثر اتساقاً", lineEn: "An organised production environment for consistent results", image: "/assets/fallbacks/04-lab.jpg" },
  { id: "stenter", ar: "التجفيف والتثبيت", en: "Drying & heat-setting", lineAr: "تجفيف وتثبيت حراري لثبات الأبعاد", lineEn: "Drying and heat-setting for dimensional stability", image: "/assets/fallbacks/07-finishing.jpg" },
  { id: "mechanical-finishing", ar: "التجهيز الميكانيكي", en: "Mechanical finishing", lineAr: "معالجة ميكانيكية لكل أنواع الأقمشة", lineEn: "Mechanical treatment for every fabric type", image: "/assets/fallbacks/06-stenter.jpg" },
  { id: "inspection", ar: "الفحص والجودة", en: "Inspection & quality", lineAr: "أعلى معايير الجودة وأجود أنواع التغليف", lineEn: "The highest quality standards and finest packaging", image: "/assets/fallbacks/08-quality.jpg" },
  { id: "rolling", ar: "تدفق القماش", en: "Fabric flow", lineAr: "حركة منتظمة من خط الإنتاج إلى المنتج النهائي", lineEn: "Controlled movement from production line to the finished product", image: "/assets/fallbacks/09-warehouse.jpg", factAr: "+600 طن شهرياً", factEn: "600+ tons monthly" },
  { id: "ready", ar: "القماش الجاهز", en: "Finished fabric", lineAr: "جاهزون لتجهيز طلبكم القادم", lineEn: "Ready for your next production order", image: "/assets/fallbacks/10-exit.jpg", factAr: "استلام وتسليم 24/7", factEn: "24/7 receiving & delivery" },
] as const;

const DESKTOP_FRAME_COUNT = 225;
const MOBILE_FRAME_COUNT = 113;

const copy = {
  ar: {
    nav: ["الرئيسية", "الجولة", "قدراتنا", "خدماتنا", "الجودة", "تواصل معنا"],
    heroEyebrow: "صباغة وتجهيز الأقمشة · منذ أكثر من 45 عاماً",
    hero: "داخل الخماسية… تتحول الخبرة إلى جودة.",
    heroSub: "جولة عبر مراحل الصباغة والتجهيز من استلام الخام حتى التسليم.",
    explore: "ابدأ الجولة", quote: "اطلب عرض سعر", scroll: "مرّر لتقود الكاميرا",
    preview: "جولة سينمائية · داخل المصنع",
    filmKicker: "رحلة إنتاج واحدة", filmTitle: "من الخام إلى الجاهز، داخل مصنع واحد.",
    capabilitiesKicker: "قدرات موثقة", capabilitiesTitle: "أرقام تشغيلية، لا وعود عامة.",
    servicesKicker: "منظومة متكاملة", servicesTitle: "كل مرحلة تحت رقابة واحدة.",
    materialsKicker: "الخامات", materialsTitle: "مرونة تناسب احتياجات التشغيل.",
    qualityKicker: "منهج العمل", qualityTitle: "الدقة جزء من العملية، وليست خطوة أخيرة.",
    formKicker: "تواصل مباشر", formTitle: "ابدأ طلبك عبر واتساب.",
    whatsappLead: "تواصل مباشرة مع فريق المبيعات، وأرسل تفاصيل القماش والكمية والخدمة المطلوبة داخل المحادثة.",
    whatsappButton: "تواصل عبر واتساب", whatsappNote: "سيفتح واتساب برسالة طلب سعر جاهزة إلى رقم المبيعات.",
    footerLine: "خبرة مصرية في صباغة وتجهيز الأقمشة.", menu: "فتح القائمة", close: "إغلاق القائمة",
    language: "اللغة", progress: "تقدم القراءة",
    topic: "صباغة وتجهيز الأقمشة",
    faqKicker: "أسئلة شائعة", faqTitle: "إجابات مباشرة عن الصباغة والتجهيز.",
    linkServices: "مراحل الصباغة والتجهيز الست",
    linkCapabilities: "الطاقة الإنتاجية والأرقام التشغيلية",
    linkFaq: "الأسئلة الشائعة عن الصباغة والتجهيز",
  },
  en: {
    nav: ["Home", "The tour", "Capabilities", "Services", "Quality", "Contact"],
    heroEyebrow: "Fabric dyeing & finishing · 45+ years",
    hero: "Inside Al Khomassia, experience becomes quality.",
    heroSub: "A journey through dyeing and finishing—from raw fabric receiving to dispatch.",
    explore: "Start the tour", quote: "Request a quote", scroll: "Scroll to guide the camera",
    preview: "Cinematic tour · inside the factory",
    filmKicker: "One production journey", filmTitle: "From raw to ready, inside one factory.",
    capabilitiesKicker: "Verified capabilities", capabilitiesTitle: "Operating facts, not broad promises.",
    servicesKicker: "Integrated process", servicesTitle: "Every stage under one system.",
    materialsKicker: "Materials", materialsTitle: "Flexible processing for your requirements.",
    qualityKicker: "Our method", qualityTitle: "Precision is part of the process, not a final step.",
    formKicker: "Direct contact", formTitle: "Start your request on WhatsApp.",
    whatsappLead: "Chat directly with our sales team and share your fabric, quantity and required service in the conversation.",
    whatsappButton: "Continue to WhatsApp", whatsappNote: "WhatsApp will open with a prepared quotation request to our sales number.",
    footerLine: "Egyptian expertise in fabric dyeing and finishing.", menu: "Open menu", close: "Close menu",
    language: "Language", progress: "Reading progress",
    topic: "Fabric dyeing and finishing",
    faqKicker: "Frequently asked questions", faqTitle: "Direct answers about dyeing and finishing.",
    linkServices: "the six dyeing and finishing stages",
    linkCapabilities: "production capacity and operating figures",
    linkFaq: "frequently asked questions about dyeing and finishing",
  },
} as const;

const stats = [
  ["+45", "سنة خبرة", "years of experience"],
  ["+600", "طن شهرياً", "tons monthly"],
  ["200–1200", "كجم للحمولة", "kg per load"],
  ["24/7", "استلام وتسليم", "receiving & delivery"],
] as const;

const serviceItems = [
  ["01", "الاستلام والتحضير", "Receiving & preparation", "تحديد متطلبات التشغيلة وتحضير القماش قبل بدء الإنتاج.", "Production requirements and fabric preparation before processing."],
  ["02", "المعمل ومطابقة اللون", "Laboratory & colour matching", "مطابقة العينة أو مرجع اللون قبل اعتماد التشغيل.", "Sample or colour-reference matching before production approval."],
  ["03", "الصباغة", "Fabric dyeing", "للأقمشة القطنية والبوليستر والممزوجة بحمولات مرنة.", "Cotton, polyester and blended fabrics across flexible load sizes."],
  ["04", "التجفيف والتثبيت", "Drying & heat-setting", "التحكم في الأبعاد والتجفيف عبر خطوط التجهيز الحراري.", "Drying and dimensional control through heat-setting lines."],
  ["05", "التجهيز", "Fabric finishing", "تجهيز حراري وكيميائي وميكانيكي وفق المتطلبات.", "Thermal, chemical and mechanical finishing to specification."],
  ["06", "الفحص والتسليم", "Inspection & dispatch", "فحص وقياس وتغليف قبل انتقال اللفة إلى الجاهز.", "Inspection, measurement and packing before dispatch."],
] as const;

const navTargets = ["home", "film", "capabilities", "services", "quality", "contact"] as const;

/* The transparent derivative of the authoritative emblem. It is placed with no
   plate, box, border or background of any kind — see .brand-mark in globals.css. */
function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`logo-lockup${compact ? " compact" : ""}`} href="#home" aria-label="الخماسية — الرئيسية">
      <span className="brand-mark"><img src="/assets/brand/logo-mark.v2.webp" alt="" width={240} height={192} loading="eager" fetchPriority="high" /></span>
      <span><b>الخماسية</b><small>AL KHOMASSIA FOR TEXTILE INDUSTRIES</small></span>
    </a>
  );
}

export default function ConceptBClient() {
  const lenis = useLenis();
  const [locale, setLocale] = useState<Locale>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [filmReady, setFilmReady] = useState(false);
  const [animation, setAnimation] = useState<AnimationModules | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLElement>(null);
  const filmBarRef = useRef<HTMLSpanElement>(null);
  const pageBarRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const activeSceneRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const t = copy[locale];
  const isAr = locale === "ar";
  const whatsappMessage = isAr
    ? "مرحباً، أريد طلب عرض سعر من الخماسية للصناعات النسيجية."
    : "Hello, I would like to request a quotation from Al Khomassia For Textile Industries.";
  const whatsappHref = `https://wa.me/201273933043?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }, [locale, isAr]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Lenis emits once per smoothed frame, so all global scroll-derived UI reads
     the same animated scroll position instead of subscribing to native scroll. */
  useEffect(() => {
    if (!lenis) return;
    let last = lenis.scroll;

    /* Layout-dependent values are read ONCE here and refreshed only on
       resize / content growth — never inside the per-frame scroll handler.
       With syncTouch on, `scroll` fires ~60fps on mobile, so keeping the hot
       path free of scrollHeight / getComputedStyle / offsetTop reads is what
       prevents layout thrashing while the finger drags. */
    let limit = 0;
    let headerOffset = 90;
    const targetOffsets: number[] = [];
    const recompute = () => {
      limit = document.documentElement.scrollHeight - window.innerHeight;
      headerOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "78") + 12;
      targetOffsets.length = 0;
      navTargets.forEach((id) => {
        targetOffsets.push(document.getElementById(id)?.offsetTop ?? Infinity);
      });
    };

    const measure = (y: number) => {
      const ratio = limit > 0 ? Math.min(1, Math.max(0, y / limit)) : 0;
      if (pageBarRef.current) pageBarRef.current.style.transform = `scaleX(${ratio})`;
      setScrolled(y > 12);
      setHeaderHidden(y > last && y > 240 && !menuOpen);
      last = y;

      const line = y + headerOffset;
      let current = 0;
      for (let i = 0; i < targetOffsets.length; i += 1) {
        if (targetOffsets[i] <= line) current = i;
      }
      setActiveNav(current);
    };

    recompute();
    measure(lenis.scroll);
    const stopListening = lenis.on("scroll", (state) => measure(state.scroll));
    const onResize = () => { recompute(); measure(lenis.scroll); };
    window.addEventListener("resize", onResize, { passive: true });
    // Content height changes as the film sequence / images load — refresh the
    // cached limit and section offsets without touching the scroll hot path.
    const ro = new ResizeObserver(() => { recompute(); measure(lenis.scroll); });
    ro.observe(document.body);
    return () => {
      stopListening();
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [lenis, menuOpen]);

  /* Progressive reveal for section content — inert when reduced motion is on. */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reducedMotion) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [reducedMotion, locale]);

  /* Mobile menu: focus trap, Escape to close and a background scroll lock. */
  useEffect(() => {
    if (!menuOpen) return;
    document.body.classList.add("menu-open");
    // Freeze Lenis so a touch-drag over the overlay can't scroll the page
    // behind it; the menu itself scrolls natively (data-lenis-prevent).
    lenis?.stop();
    const root = menuRef.current;
    const focusable = root?.querySelectorAll<HTMLElement>("a,button");
    focusable?.[0]?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  useEffect(() => {
    if (!lenis || reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const frameCount = mobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
    const sequence = mobile ? "sequence-mobile" : "sequence-desktop";
    // Keep every frame index intact. Only the request order and readiness change.
    const loaded = Array.from({ length: frameCount }, () => new Image());
    const requested = new Set<number>();
    const attempts = new Map<number, number>();
    let complete = 0;
    let inFlight = 0;
    let disposed = false;
    let near = false;
    let visible = false;
    let started = false;
    let ready = false;
    let modules: AnimationModules | null = null;
    let initialIndex = 0;
    imagesRef.current = loaded;
    currentFrame.current = -1;

    const centerIndex = () => ready
      ? Math.round(targetProgressRef.current * (frameCount - 1))
      : initialIndex;
    const markReady = () => {
      const image = loaded[centerIndex()];
      if (!ready && modules && image?.complete && image.naturalWidth) {
        ready = true;
        setAnimation(modules);
        setFilmReady(true);
      }
    };

    const pump = () => {
      if (disposed || !started || !near) return;
      const center = centerIndex();
      // Prepare a small window before entry; fill the rest only while visible.
      const candidates = Array.from({ length: frameCount }, (_, index) => index)
        .filter((index) => !requested.has(index) && (visible || Math.abs(index - center) <= 6))
        .sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
      while (inFlight < 3 && candidates.length) {
        const index = candidates.shift()!;
        const image = loaded[index];
        requested.add(index);
        attempts.set(index, (attempts.get(index) ?? 0) + 1);
        inFlight += 1;
        image.src = `/assets/${sequence}/f${String(index).padStart(3, "0")}.jpg`;
      }
    };
    loaded.forEach((image, index) => {
      image.decoding = "async";
      image.fetchPriority = "low";
      const failed = () => {
        if (disposed) return;
        inFlight -= 1;
        if ((attempts.get(index) ?? 0) < 2) requested.delete(index);
        else if (!ready && index === centerIndex()) setLoadError(true);
        pump();
      };
      image.onload = async () => {
        try { await image.decode(); } catch { failed(); return; }
        if (disposed) return;
        inFlight -= 1;
        complete += 1;
        setLoadProgress(Math.round((complete / frameCount) * 100));
        markReady();
        if (ready) drawFrame(Math.round(progressRef.current * (frameCount - 1)), loaded);
        pump();
      };
      image.onerror = failed;
    });

    const start = () => {
      if (disposed || started || !near || document.readyState !== "complete") return;
      started = true;
      setFilmReady(false);
      setLoadError(false);
      setLoadProgress(0);
      const film = filmRef.current;
      if (film) {
        const distance = film.offsetHeight - window.innerHeight;
        initialIndex = Math.round(Math.min(1, Math.max(0, distance > 0 ? (lenis.scroll - film.offsetTop) / distance : 0)) * (frameCount - 1));
      }
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
        if (disposed) return;
        modules = { gsap: gsapModule.default, ScrollTrigger: triggerModule.ScrollTrigger };
        markReady();
      }).catch(() => { if (!disposed) setLoadError(true); });
      pump();
    };
    const nearObserver = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      start();
      pump();
    }, { rootMargin: "600px 0px" });
    const visibleObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      pump();
    });
    if (filmRef.current) {
      nearObserver.observe(filmRef.current);
      visibleObserver.observe(filmRef.current);
    }
    window.addEventListener("load", start, { once: true });
    return () => {
      disposed = true;
      nearObserver.disconnect();
      visibleObserver.disconnect();
      window.removeEventListener("load", start);
      loaded.forEach((image) => { image.onload = null; image.onerror = null; });
    };
  }, [reducedMotion, loadAttempt, lenis]);

  function drawFrame(index: number, source = imagesRef.current) {
    const canvas = canvasRef.current;
    const image = source[index];
    if (!canvas || !image?.complete || !image.naturalWidth) return;
    if (currentFrame.current === index && canvas.width) return;
    const width = canvas.width;
    const height = canvas.height;
    if (!width || !height) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#11100e";
    ctx.fillRect(0, 0, width, height);
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawW = image.naturalWidth * scale;
    const drawH = image.naturalHeight * scale;
    ctx.drawImage(image, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
    currentFrame.current = index;
  }

  useEffect(() => {
    if (!filmReady || !animation || reducedMotion || !filmRef.current || !lenis) return;
    const { gsap, ScrollTrigger } = animation;
    gsap.registerPlugin(ScrollTrigger);
    let animationFrame = 0;

    /* Canvas geometry is measured only when its size changes. The hot render
       loop below performs no layout reads, which avoids forced reflow while
       the user is scrubbing through the sequence. */
    const syncCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      currentFrame.current = -1;
      return true;
    };

    /* Lenis already interpolates the scroll position. Render its normalized
       progress directly to avoid adding a second lagging lerp in the film. */
    const renderProgress = () => {
      animationFrame = 0;
      const next = targetProgressRef.current;
      progressRef.current = next;

      const frameIndex = Math.min(imagesRef.current.length - 1, Math.round(next * (imagesRef.current.length - 1)));
      const sceneIndex = Math.min(scenes.length - 1, Math.floor(next * scenes.length));
      if (sceneIndex !== activeSceneRef.current) {
        activeSceneRef.current = sceneIndex;
        setActiveScene(sceneIndex);
      }
      if (filmBarRef.current) filmBarRef.current.style.transform = `scaleX(${next})`;
      drawFrame(frameIndex);
    };

    const queueRender = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(renderProgress);
    };

    syncCanvasSize();
    const stopListening = lenis.on("scroll", () => ScrollTrigger.update());

    const trigger = ScrollTrigger.create({
      trigger: filmRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        targetProgressRef.current = self.progress;
        queueRender();
      },
    });
    progressRef.current = trigger.progress;
    targetProgressRef.current = trigger.progress;
    activeSceneRef.current = Math.min(scenes.length - 1, Math.floor(trigger.progress * scenes.length));
    setActiveScene(activeSceneRef.current);
    if (filmBarRef.current) filmBarRef.current.style.transform = `scaleX(${trigger.progress})`;
    drawFrame(Math.round(trigger.progress * (imagesRef.current.length - 1)));
    const resizeObserver = new ResizeObserver(() => {
      if (syncCanvasSize()) queueRender();
    });
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    return () => {
      stopListening();
      resizeObserver.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      trigger.kill();
    };
  }, [filmReady, animation, reducedMotion, lenis]);

  const jumpToScene = useCallback((index: number) => {
    const film = filmRef.current;
    if (!film || !lenis) return;
    const start = film.offsetTop;
    const distance = film.offsetHeight - window.innerHeight;
    lenis.scrollTo(start + distance * (index / (scenes.length - 1)), { immediate: reducedMotion });
  }, [lenis, reducedMotion]);

  const closeMenu = () => { setMenuOpen(false); menuButtonRef.current?.focus(); };

  return (
    <>
      <a className="skip-link" href="#main">{isAr ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      <header className={`site-header${headerHidden ? " is-hidden" : ""}${scrolled ? " is-scrolled" : ""}${menuOpen ? " menu-active" : ""}`}>
        <LogoLockup compact />
        <nav className="desktop-nav" aria-label={isAr ? "التنقل الرئيسي" : "Primary navigation"}>
          {t.nav.map((item, index) => (
            <a key={item} href={`#${navTargets[index]}`} aria-current={activeNav === index ? "true" : undefined}>{item}</a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="lang-switch" role="group" aria-label={t.language}>
            <button type="button" lang="ar" aria-pressed={isAr} onClick={() => setLocale("ar")} title="العربية">ع</button>
            <button type="button" lang="en" aria-pressed={!isAr} onClick={() => setLocale("en")} title="English">EN</button>
          </div>
          <a className="button button-small" href="#contact">{t.quote}</a>
          <button ref={menuButtonRef} type="button" className="menu-button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? t.close : t.menu} onClick={() => setMenuOpen(!menuOpen)}><i aria-hidden="true" /></button>
        </div>
        <div className="header-progress" aria-hidden="true"><span ref={pageBarRef} /></div>
      </header>

      {menuOpen && <div className="mobile-menu" id="mobile-menu" ref={menuRef} data-lenis-prevent role="dialog" aria-modal="true" aria-label={t.menu}>
        <nav aria-label={isAr ? "التنقل الرئيسي" : "Primary navigation"}>
          {t.nav.map((item, index) => (
            <a key={item} href={`#${navTargets[index]}`} aria-current={activeNav === index ? "true" : undefined} onClick={() => setMenuOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item}
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <a className="button" href="#contact" onClick={() => setMenuOpen(false)}>{t.quote}</a>
          <div className="menu-contact">
            <a href="tel:+201273933043" dir="ltr">+20 127 393 3043</a>
            <a href="mailto:sales@alkhomassiaeg.com">sales@alkhomassiaeg.com</a>
          </div>
          <button type="button" className="mobile-close" onClick={closeMenu}>{t.close}</button>
        </div>
      </div>}

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true">
            <img
              src="/assets/hero/hero-factory-blur.5c8cc607ef5b.webp"
              alt=""
              width={1672}
              height={941}
              fetchPriority="high"
            />
          </div>
          <div className="hero-grain" aria-hidden="true" />
          <h1 className="sr-only" id="hero-title">{t.topic} — {t.hero}</h1>
          <div className="hero-emblem" aria-hidden="true">
            <img
              src="/assets/brand/hero-lockup.v2.webp"
              alt=""
              width={651}
              height={527}
              fetchPriority="high"
            />
          </div>
          <a href="#film" className="scroll-cue" aria-label={t.scroll}><i aria-hidden="true" /></a>
        </section>

        <section className="intro-strip" aria-label={isAr ? "ملخص الجولة" : "Tour introduction"}>
          <p className="eyebrow" data-reveal>{t.filmKicker}</p>
          <h2 data-reveal>{t.filmTitle}</h2>
          <p className="intro-lead" data-reveal>{isAr ? "الكاميرا تتبع مسار التشغيل الحقيقي عبر عشر محطات مترابطة." : "The camera follows the real production route across ten connected stages."}</p>
          <div className="intro-summary" data-reveal>
            <p>{isAr ? SUMMARY.ar : SUMMARY.en}</p>
            <p className="intro-links">
              <a href="#services">{t.linkServices}</a>
              <a href="#capabilities">{t.linkCapabilities}</a>
              <a href="#faq">{t.linkFaq}</a>
            </p>
          </div>
        </section>

        <section ref={filmRef} className={`film${reducedMotion ? " reduced" : ""}`} id="film" aria-label={isAr ? "جولة المصنع" : "Factory tour"}>
          {reducedMotion ? <div className="static-chapters">{scenes.map((scene, index) => <article key={scene.id}><img src={scene.image} alt={isAr ? scene.ar : scene.en} loading={index > 1 ? "lazy" : "eager"} /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{isAr ? scene.lineAr : scene.lineEn}</h3>{scene.factAr && <b>{isAr ? scene.factAr : scene.factEn}</b>}</div></article>)}</div> :
          <div className="film-stage">
            <picture className="film-poster">
              <source media="(max-width: 760px)" srcSet="/assets/posters/tour-mobile-bdc60fe2.webp" />
              <img src="/assets/posters/tour-desktop-bdc60fe2.webp" alt="" width={1920} height={1080} loading="lazy" decoding="async" />
            </picture>
            <canvas ref={canvasRef} aria-hidden="true" />
            <div className="film-shade" aria-hidden="true" />
            <div className="film-progress" aria-hidden="true"><span ref={filmBarRef} /></div>
            {!filmReady && <div className="film-loader" role="status"><div><span style={{ width: `${loadProgress}%` }} /></div><p>{loadError ? (isAr ? "تعذّر تحميل الجولة" : "The tour could not load") : (isAr ? "تهيئة الجولة" : "Preparing the tour")}</p>{loadError && <button className="button" type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>{isAr ? "حاول مجدداً" : "Retry"}</button>}</div>}
            <p className="preview-badge">{t.preview}</p>
            <div className="scene-copy" key={`${locale}-${activeScene}`}>
              <span>{String(activeScene + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</span>
              <p>{isAr ? scenes[activeScene].ar : scenes[activeScene].en}</p>
              <h3>{isAr ? scenes[activeScene].lineAr : scenes[activeScene].lineEn}</h3>
              {scenes[activeScene].factAr && <b>{isAr ? scenes[activeScene].factAr : scenes[activeScene].factEn}</b>}
            </div>
            <nav className="route" aria-label={isAr ? "مراحل الجولة" : "Tour stages"}>{scenes.map((scene, index) => <button key={scene.id} type="button" className={index === activeScene ? "active" : ""} onClick={() => jumpToScene(index)} aria-label={isAr ? scene.ar : scene.en} aria-current={index === activeScene ? "true" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /></button>)}</nav>
          </div>}
        </section>

        <section className="section capabilities" id="capabilities">
          <div className="section-head"><p className="eyebrow" data-reveal>{t.capabilitiesKicker}</p><h2 data-reveal>{t.capabilitiesTitle}</h2></div>
          <div className="stats-grid" data-reveal>{stats.map(([value, ar, en]) => <article key={value}><strong>{value}</strong><span>{isAr ? ar : en}</span></article>)}</div>
          <p className="source-note">{isAr ? "الأرقام وفق مواد الشركة المعتمدة، أغسطس 2026." : "Figures follow the approved company materials, August 2026."}</p>
        </section>

        <section className="section services" id="services">
          <div className="section-head split"><div><p className="eyebrow" data-reveal>{t.servicesKicker}</p><h2 data-reveal>{t.servicesTitle}</h2></div><p data-reveal>{isAr ? "من استلام القماش الخام إلى تسليم اللفات الجاهزة، تمر كل تشغيلة في مسار واضح قابل للمتابعة." : "From receiving raw fabric to dispatching finished rolls, each run follows a clear controlled route."}</p></div>
          <div className="services-list">{serviceItems.map(([number, ar, en, bodyAr, bodyEn]) => <article key={number} data-reveal><span>{number}</span><h3>{isAr ? ar : en}</h3><p>{isAr ? bodyAr : bodyEn}</p></article>)}</div>
        </section>

        <section className="materials" id="materials">
          <div className="materials-image"><img src="/assets/references/materials-factory-floor.jpeg" alt={isAr ? "خطوط تجهيز الأقمشة داخل المصنع" : "Fabric finishing production lines inside the factory"} width={1448} height={1086} loading="lazy" /></div>
          <div className="materials-copy"><p className="eyebrow" data-reveal>{t.materialsKicker}</p><h2 data-reveal>{t.materialsTitle}</h2><div className="material-row" data-reveal><span>01</span><h3>{isAr ? "القطن" : "Cotton"}</h3></div><div className="material-row" data-reveal><span>02</span><h3>{isAr ? "البوليستر" : "Polyester"}</h3></div><div className="material-row" data-reveal><span>03</span><h3>{isAr ? "الأقمشة المخلوطة" : "Blended fabrics"}</h3></div><p>{isAr ? "تُضبط مراحل الصباغة والتجهيز وفق نوع الخامة ومتطلبات التشغيلة." : "Dyeing and finishing stages are set around material type and production requirements."}</p></div>
        </section>

        <section className="section quality" id="quality">
          <div className="section-head"><p className="eyebrow" data-reveal>{t.qualityKicker}</p><h2 data-reveal>{t.qualityTitle}</h2></div>
          <div className="quality-grid" data-reveal><article><span>01</span><h3>{isAr ? "ثبات النتائج" : "Consistency"}</h3><p>{isAr ? "متابعة التشغيلة عبر مراحل الإنتاج للحفاظ على النتيجة المطلوبة." : "Monitoring through production to maintain the specified outcome."}</p></article><article><span>02</span><h3>{isAr ? "مطابقة اللون" : "Colour matching"}</h3><p>{isAr ? "اختبارات معملية قبل اعتماد التشغيل ومتابعة أثناء التنفيذ." : "Laboratory testing before production and monitoring during processing."}</p></article><article><span>03</span><h3>{isAr ? "الالتزام" : "On-time delivery"}</h3><p>{isAr ? "تنظيم التشغيل والتسليم ضمن المواعيد المتفق عليها." : "Production and dispatch organised around agreed timelines."}</p></article></div>
        </section>

        <section className="section faq" id="faq">
          <div className="section-head"><p className="eyebrow" data-reveal>{t.faqKicker}</p><h2 data-reveal>{t.faqTitle}</h2></div>
          <div className="faq-list">{FAQ.map((item) => <article key={item.qEn} data-reveal><h3>{isAr ? item.qAr : item.qEn}</h3><p>{isAr ? item.aAr : item.aEn}</p></article>)}</div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-intro"><p className="eyebrow" data-reveal>{t.formKicker}</p><h2 data-reveal>{t.formTitle}</h2><div className="contact-lines"><a href="tel:+201273933043" dir="ltr">+20 127 393 3043</a><a href="mailto:sales@alkhomassiaeg.com">sales@alkhomassiaeg.com</a><p>{isAr ? "العاشر من رمضان · المنطقة الصناعية A4 · مصر" : "10th of Ramadan City · Industrial Zone A4 · Egypt"}</p></div></div>
          <div className="whatsapp-card" data-reveal>
            <span className="whatsapp-label" dir="ltr">WhatsApp</span>
            <p>{t.whatsappLead}</p>
            <a className="button whatsapp-button" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <span>{t.whatsappButton}</span><b aria-hidden="true">↗</b>
            </a>
            <small>{t.whatsappNote}</small>
          </div>
        </section>
      </main>

      <footer><LogoLockup /><p>{t.footerLine}</p><div><a href="https://www.alkhomassiaeg.com">alkhomassiaeg.com</a><span>© {new Date().getFullYear()}</span></div></footer>
    </>
  );
}
