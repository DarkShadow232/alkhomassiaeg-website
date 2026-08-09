"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Locale = "ar" | "en";

const scenes = [
  { id: "exterior", ar: "الاقتراب الخارجي", en: "Exterior approach", lineAr: "من الخارج تبدأ الرؤية", lineEn: "The vision begins outside", image: "/assets/fallbacks/01-exterior.jpg" },
  { id: "entry", ar: "دخول المصنع", en: "Factory entry", lineAr: "خبرة تتحرك داخل كل مرحلة", lineEn: "Experience moves through every stage", image: "/assets/fallbacks/02-entry.jpg" },
  { id: "receiving", ar: "الاستلام والتحضير", en: "Receiving & preparation", lineAr: "استلام وتحضير وفق متطلبات كل تشغيلة", lineEn: "Prepared for every production run", image: "/assets/fallbacks/03-receiving.jpg" },
  { id: "lab", ar: "مطابقة الألوان", en: "Colour laboratory", lineAr: "مطابقة لون دقيقة قبل الإنتاج", lineEn: "Precise colour matching before production", image: "/assets/fallbacks/04-lab.jpg" },
  { id: "dyeing", ar: "الصباغة", en: "Jet dyeing", lineAr: "صباغة متجانسة بحمولات مرنة", lineEn: "Consistent dyeing across flexible loads", image: "/assets/fallbacks/05-dyeing.jpg", factAr: "200–1200 كجم", factEn: "200–1,200 kg" },
  { id: "stenter", ar: "التجفيف والتثبيت", en: "Drying & heat-setting", lineAr: "تجفيف وتثبيت حراري لثبات الأبعاد", lineEn: "Drying and heat-setting for dimensional stability", image: "/assets/fallbacks/06-stenter.jpg" },
  { id: "finishing", ar: "التجهيز", en: "Finishing", lineAr: "تجهيز يمنح القماش خواصه النهائية", lineEn: "Finishing gives fabric its final properties", image: "/assets/fallbacks/07-finishing.jpg" },
  { id: "quality", ar: "الفحص والجودة", en: "Quality control", lineAr: "فحص مستمر من أول متر إلى آخر لفة", lineEn: "Inspection from the first metre to the final roll", image: "/assets/fallbacks/08-quality.jpg" },
  { id: "warehouse", ar: "مخزن الجاهز", en: "Finished goods", lineAr: "جاهزية منظمة للتسليم", lineEn: "Organised and ready for dispatch", image: "/assets/fallbacks/09-warehouse.jpg", factAr: "+600 طن شهرياً", factEn: "600+ tons monthly" },
  { id: "dispatch", ar: "التسليم", en: "Dispatch", lineAr: "جاهزون لتجهيز طلبكم القادم", lineEn: "Ready for your next production order", image: "/assets/fallbacks/10-exit.jpg", factAr: "استلام وتسليم 24/7", factEn: "24/7 receiving & delivery" },
] as const;

const copy = {
  ar: {
    nav: ["الرئيسية", "الجولة", "قدراتنا", "خدماتنا", "الجودة", "تواصل معنا"],
    heroEyebrow: "صباغة وتجهيز الأقمشة · منذ أكثر من 45 عاماً",
    hero: "داخل الخماسية… تتحول الخبرة إلى جودة.",
    heroSub: "جولة عبر مراحل الصباغة والتجهيز من استلام الخام حتى التسليم.",
    explore: "ابدأ الجولة", quote: "اطلب عرض سعر", scroll: "مرّر لتقود الكاميرا",
    preview: "نسخة معاينة · صور المصنع الحالية",
    filmKicker: "رحلة إنتاج واحدة", filmTitle: "من الخام إلى الجاهز، داخل مصنع واحد.",
    capabilitiesKicker: "قدرات موثقة", capabilitiesTitle: "أرقام تشغيلية، لا وعود عامة.",
    servicesKicker: "منظومة متكاملة", servicesTitle: "كل مرحلة تحت رقابة واحدة.",
    materialsKicker: "الخامات", materialsTitle: "مرونة تناسب احتياجات التشغيل.",
    qualityKicker: "منهج العمل", qualityTitle: "الدقة جزء من العملية، وليست خطوة أخيرة.",
    formKicker: "ابدأ طلبك", formTitle: "أخبرنا عن التشغيلة القادمة.",
    mailNote: "بعد الإرسال سيفتح برنامج البريد برسالة جاهزة. لا يتم تخزين بياناتك على الموقع.",
    submit: "جهّز رسالة طلب السعر", consent: "أوافق على استخدام بياناتي للرد على هذا الاستفسار فقط.",
    footerLine: "خبرة مصرية في صباغة وتجهيز الأقمشة.", menu: "فتح القائمة", close: "إغلاق القائمة",
  },
  en: {
    nav: ["Home", "The tour", "Capabilities", "Services", "Quality", "Contact"],
    heroEyebrow: "Fabric dyeing & finishing · 45+ years",
    hero: "Inside Al Khomassia, experience becomes quality.",
    heroSub: "A journey through dyeing and finishing—from raw fabric receiving to dispatch.",
    explore: "Start the tour", quote: "Request a quote", scroll: "Scroll to guide the camera",
    preview: "Preview · current factory photography",
    filmKicker: "One production journey", filmTitle: "From raw to ready, inside one factory.",
    capabilitiesKicker: "Verified capabilities", capabilitiesTitle: "Operating facts, not broad promises.",
    servicesKicker: "Integrated process", servicesTitle: "Every stage under one system.",
    materialsKicker: "Materials", materialsTitle: "Flexible processing for your requirements.",
    qualityKicker: "Our method", qualityTitle: "Precision is part of the process, not a final step.",
    formKicker: "Start an inquiry", formTitle: "Tell us about your next production run.",
    mailNote: "Submitting opens your email app with a prepared message. This website does not store your data.",
    submit: "Prepare quote email", consent: "I consent to my details being used only to answer this inquiry.",
    footerLine: "Egyptian expertise in fabric dyeing and finishing.", menu: "Open menu", close: "Close menu",
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

function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`logo-lockup${compact ? " compact" : ""}`} href="#home" aria-label="الخماسية — الرئيسية">
      <img src="/assets/brand/logo.png" alt="شعار الخماسية" />
      <span><b>الخماسية</b><small>AL KHOMASSIA FOR TEXTILE INDUSTRIES</small></span>
    </a>
  );
}

export default function ConceptBClient() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [filmReady, setFilmReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const t = copy[locale];
  const isAr = locale === "ar";

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

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const next = window.scrollY;
      setHeaderHidden(next > last && next > 160 && !menuOpen);
      last = next;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
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
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (reducedMotion) return;
    const loaded: HTMLImageElement[] = [];
    let complete = 0;
    let settled = 0;
    const threshold = Math.ceil(scenes.length * 0.6);
    const finish = () => {
      settled += 1;
      setLoadProgress(Math.round((settled / scenes.length) * 100));
      if (complete >= threshold || settled === scenes.length) setFilmReady(true);
    };
    scenes.forEach((scene, index) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => { complete += 1; finish(); drawFrame(Math.round(progressRef.current * (scenes.length - 1)), loaded); };
      image.onerror = finish;
      image.src = scene.image;
      loaded[index] = image;
    });
    imagesRef.current = loaded;
    const safety = window.setTimeout(() => setFilmReady(true), 9000);
    return () => window.clearTimeout(safety);
  }, [reducedMotion]);

  function drawFrame(index: number, source = imagesRef.current) {
    const canvas = canvasRef.current;
    const image = source[index];
    if (!canvas || !image?.complete || !image.naturalWidth) return;
    if (currentFrame.current === index && canvas.width) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
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
    if (!filmReady || reducedMotion || !filmRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: filmRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const index = Math.min(scenes.length - 1, Math.round(self.progress * (scenes.length - 1)));
        setActiveScene(index);
        drawFrame(index);
      },
    });
    drawFrame(Math.round(trigger.progress * (scenes.length - 1)));
    const onResize = () => { currentFrame.current = -1; drawFrame(Math.round(progressRef.current * (scenes.length - 1))); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); trigger.kill(); };
  }, [filmReady, reducedMotion]);

  const jumpToScene = (index: number) => {
    const film = filmRef.current;
    if (!film) return;
    const start = film.offsetTop;
    const distance = film.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + distance * (index / (scenes.length - 1)), behavior: reducedMotion ? "auto" : "smooth" });
  };

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = isAr ? "طلب عرض سعر — موقع الخماسية" : "Quotation request — Al Khomassia website";
    const body = Array.from(data.entries()).filter(([key]) => key !== "consent").map(([key, value]) => `${key}: ${value}`).join("\n");
    window.location.href = `mailto:sales@alkhomassiaeg.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const navTargets = ["home", "film", "capabilities", "services", "quality", "contact"];
  const handleMenuKey = (event: KeyboardEvent<HTMLButtonElement>) => { if (event.key === "ArrowDown") setMenuOpen(true); };

  return (
    <>
      <a className="skip-link" href="#main">{isAr ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      <header className={`site-header${headerHidden ? " is-hidden" : ""}${menuOpen ? " menu-active" : ""}`}>
        <LogoLockup compact />
        <nav className="desktop-nav" aria-label={isAr ? "التنقل الرئيسي" : "Primary navigation"}>
          {t.nav.map((item, index) => <a key={item} href={`#${navTargets[index]}`}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language" onClick={() => setLocale(isAr ? "en" : "ar")} aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}>{isAr ? "EN" : "ع"}</button>
          <a className="button button-small" href="#contact">{t.quote}</a>
          <button ref={menuButtonRef} className="menu-button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? t.close : t.menu} onClick={() => setMenuOpen(!menuOpen)} onKeyDown={handleMenuKey}><span /><span /></button>
        </div>
      </header>

      {menuOpen && <div className="mobile-menu" id="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label={t.menu}>
        <button className="mobile-close" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}>{t.close}</button>
        <nav>{t.nav.map((item, index) => <a key={item} href={`#${navTargets[index]}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item}</a>)}</nav>
        <a className="button" href="#contact" onClick={() => setMenuOpen(false)}>{t.quote}</a>
      </div>}

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1 id="hero-title">{t.hero}</h1>
            <p className="hero-sub">{t.heroSub}</p>
            <div className="hero-actions"><a className="button" href="#film">{t.explore}</a><a className="text-link" href="#contact">{t.quote}<span aria-hidden="true">←</span></a></div>
          </div>
          <div className="hero-index" aria-hidden="true"><span>CONCEPT B</span><b>01</b></div>
          <a href="#film" className="scroll-cue"><span>{t.scroll}</span><i /></a>
        </section>

        <section className="intro-strip" aria-label={isAr ? "ملخص الجولة" : "Tour introduction"}>
          <p className="eyebrow">{t.filmKicker}</p><h2>{t.filmTitle}</h2>
          <p>{isAr ? "الكاميرا تتبع مسار التشغيل الحقيقي عبر عشر محطات مترابطة." : "The camera follows the real production route across ten connected stages."}</p>
        </section>

        <section ref={filmRef} className={`film${reducedMotion ? " reduced" : ""}`} id="film" aria-label={isAr ? "جولة المصنع" : "Factory tour"}>
          {reducedMotion ? <div className="static-chapters">{scenes.map((scene, index) => <article key={scene.id}><img src={scene.image} alt={isAr ? scene.ar : scene.en} loading={index > 1 ? "lazy" : "eager"} /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{isAr ? scene.lineAr : scene.lineEn}</h3>{scene.factAr && <b>{isAr ? scene.factAr : scene.factEn}</b>}</div></article>)}</div> :
          <div className="film-stage">
            <canvas ref={canvasRef} aria-hidden="true" />
            <div className="film-shade" aria-hidden="true" />
            {!filmReady && <div className="film-loader" role="status"><div><span style={{ width: `${loadProgress}%` }} /></div><p>{isAr ? `تهيئة الجولة ${loadProgress}%` : `Preparing the tour ${loadProgress}%`}</p></div>}
            <div className="preview-badge">{t.preview}</div>
            <div className="scene-copy" key={`${locale}-${activeScene}`}>
              <span>{String(activeScene + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</span>
              <p>{isAr ? scenes[activeScene].ar : scenes[activeScene].en}</p>
              <h3>{isAr ? scenes[activeScene].lineAr : scenes[activeScene].lineEn}</h3>
              {scenes[activeScene].factAr && <b>{isAr ? scenes[activeScene].factAr : scenes[activeScene].factEn}</b>}
            </div>
            <nav className="route" aria-label={isAr ? "مراحل الجولة" : "Tour stages"}>{scenes.map((scene, index) => <button key={scene.id} className={index === activeScene ? "active" : ""} onClick={() => jumpToScene(index)} aria-label={isAr ? scene.ar : scene.en}><span>{String(index + 1).padStart(2, "0")}</span><i /></button>)}</nav>
          </div>}
        </section>

        <section className="section capabilities" id="capabilities">
          <div className="section-head"><p className="eyebrow">{t.capabilitiesKicker}</p><h2>{t.capabilitiesTitle}</h2></div>
          <div className="stats-grid">{stats.map(([value, ar, en]) => <article key={value}><strong>{value}</strong><span>{isAr ? ar : en}</span></article>)}</div>
          <p className="source-note">{isAr ? "الأرقام وفق مواد الشركة المعتمدة، أغسطس 2026." : "Figures follow the approved company materials, August 2026."}</p>
        </section>

        <section className="section services" id="services">
          <div className="section-head split"><div><p className="eyebrow">{t.servicesKicker}</p><h2>{t.servicesTitle}</h2></div><p>{isAr ? "من استلام القماش الخام إلى تسليم اللفات الجاهزة، تمر كل تشغيلة في مسار واضح قابل للمتابعة." : "From receiving raw fabric to dispatching finished rolls, each run follows a clear controlled route."}</p></div>
          <div className="services-list">{serviceItems.map(([number, ar, en, bodyAr, bodyEn]) => <article key={number}><span>{number}</span><h3>{isAr ? ar : en}</h3><p>{isAr ? bodyAr : bodyEn}</p></article>)}</div>
        </section>

        <section className="materials" id="materials">
          <div className="materials-image"><img src="/assets/fallbacks/03-receiving.jpg" alt={isAr ? "لفات قماش داخل المصنع" : "Fabric rolls inside the factory"} loading="lazy" /></div>
          <div className="materials-copy"><p className="eyebrow">{t.materialsKicker}</p><h2>{t.materialsTitle}</h2><div className="material-row"><span>01</span><h3>{isAr ? "القطن" : "Cotton"}</h3></div><div className="material-row"><span>02</span><h3>{isAr ? "البوليستر" : "Polyester"}</h3></div><div className="material-row"><span>03</span><h3>{isAr ? "الأقمشة الممزوجة" : "Blended fabrics"}</h3></div><p>{isAr ? "تُضبط مراحل الصباغة والتجهيز وفق نوع الخامة ومتطلبات التشغيلة." : "Dyeing and finishing stages are set around material type and production requirements."}</p></div>
        </section>

        <section className="section quality" id="quality">
          <div className="section-head"><p className="eyebrow">{t.qualityKicker}</p><h2>{t.qualityTitle}</h2></div>
          <div className="quality-grid"><article><span>01</span><h3>{isAr ? "ثبات النتائج" : "Consistency"}</h3><p>{isAr ? "متابعة التشغيلة عبر مراحل الإنتاج للحفاظ على النتيجة المطلوبة." : "Monitoring through production to maintain the specified outcome."}</p></article><article><span>02</span><h3>{isAr ? "مطابقة اللون" : "Colour matching"}</h3><p>{isAr ? "اختبارات معملية قبل اعتماد التشغيل ومتابعة أثناء التنفيذ." : "Laboratory testing before production and monitoring during processing."}</p></article><article><span>03</span><h3>{isAr ? "الالتزام" : "On-time delivery"}</h3><p>{isAr ? "تنظيم التشغيل والتسليم ضمن المواعيد المتفق عليها." : "Production and dispatch organised around agreed timelines."}</p></article></div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-intro"><p className="eyebrow">{t.formKicker}</p><h2>{t.formTitle}</h2><div className="contact-lines"><a href="tel:+201273933043" dir="ltr">+20 127 393 3043</a><a href="mailto:sales@alkhomassiaeg.com">sales@alkhomassiaeg.com</a><p>{isAr ? "العاشر من رمضان · المنطقة الصناعية A4 · مصر" : "10th of Ramadan City · Industrial Zone A4 · Egypt"}</p></div></div>
          <form onSubmit={submitInquiry} className="inquiry-form">
            <label><span>{isAr ? "الاسم" : "Name"}</span><input name="name" required autoComplete="name" /></label>
            <label><span>{isAr ? "الشركة" : "Company"}</span><input name="company" required autoComplete="organization" /></label>
            <label><span>{isAr ? "الهاتف" : "Phone"}</span><input name="phone" required inputMode="tel" autoComplete="tel" dir="ltr" /></label>
            <label><span>{isAr ? "البريد الإلكتروني" : "Email"}</span><input name="email" required type="email" autoComplete="email" dir="ltr" /></label>
            <label><span>{isAr ? "نوع القماش" : "Fabric type"}</span><select name="fabric"><option>{isAr ? "قطن" : "Cotton"}</option><option>{isAr ? "بوليستر" : "Polyester"}</option><option>{isAr ? "ممزوج" : "Blended"}</option></select></label>
            <label><span>{isAr ? "الكمية المتوقعة" : "Expected quantity"}</span><input name="quantity" /></label>
            <label className="wide"><span>{isAr ? "الخدمة المطلوبة" : "Requested service"}</span><select name="service"><option>{isAr ? "صباغة" : "Dyeing"}</option><option>{isAr ? "تجهيز" : "Finishing"}</option><option>{isAr ? "صباغة وتجهيز" : "Dyeing & finishing"}</option></select></label>
            <label className="wide"><span>{isAr ? "تفاصيل الطلب" : "Inquiry details"}</span><textarea name="message" rows={4} /></label>
            <label className="consent wide"><input type="checkbox" name="consent" required /><span>{t.consent}</span></label>
            <p className="form-note wide">{t.mailNote}</p><button className="button wide" type="submit">{t.submit}</button>
          </form>
        </section>
      </main>

      <footer><LogoLockup /><p>{t.footerLine}</p><div><a href="https://www.alkhomassiaeg.com">alkhomassiaeg.com</a><span>© {new Date().getFullYear()}</span></div></footer>
    </>
  );
}
