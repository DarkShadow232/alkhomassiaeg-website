import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("built static scripts and styles have byte-equivalent Brotli/gzip variants", async () => {
  const root = new URL("../dist/client/_next/static/", import.meta.url);
  const files = await readdir(root, { recursive: true });
  const originals = files.filter((file) => /\.(js|css)$/.test(file));
  assert.ok(originals.some((file) => file.endsWith(".js")));
  assert.ok(originals.some((file) => file.endsWith(".css")));
  for (const file of originals) {
    const url = new URL(file.replaceAll("\\", "/"), root);
    const [original, br, gz] = await Promise.all([
      readFile(url), readFile(`${fileURLToPath(url)}.br`), readFile(`${fileURLToPath(url)}.gz`),
    ]);
    assert.deepEqual(brotliDecompressSync(br), original);
    assert.deepEqual(gunzipSync(gz), original);
  }
});

test("server-renders the Arabic-first Concept B site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.match(html, /<title>الخماسية للصناعات النسيجية<\/title>/);
  assert.match(html, /\/assets\/brand\/logo-transparent\.png/);
  assert.match(html, /الخماسية للصناعات النسيجية/);
  assert.match(html, /AL KHOMASSIA FOR TEXTILE INDUSTRIES/);
  assert.match(html, /داخل الخماسية/);
  assert.match(html, /\+600/);
  assert.match(html, /200–1200/);
  assert.match(html, /sales@alkhomassiaeg\.com/);
  assert.match(html, /https:\/\/wa\.me\/201273933043/);
  assert.match(html, /class="whatsapp-card"/);
  assert.doesNotMatch(html, /<form class="inquiry-form">/);
  assert.match(html, /role="status"/);
  assert.doesNotMatch(html, /\bKor\b|\+966|info@alkhomassia\.com/i);
  assert.doesNotMatch(html, /<video\b/i);
  assert.match(html, /class="film-poster"/);
  assert.match(html, /tour-mobile-bdc60fe2\.webp/);
  assert.match(html, /tour-desktop-bdc60fe2\.webp/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});

test("ships the canvas, accessibility and responsive sequence contracts", async () => {
  const [client, smoothScroll, layout, css, packageJson, generationRecord, fallbackFiles, desktopFrames, mobileFrames] = await Promise.all([
    readFile(new URL("../app/ConceptBClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SmoothScroll.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../public/assets/generation-records/supplied-master-sequence.json", import.meta.url), "utf8"),
    readdir(new URL("../public/assets/fallbacks/", import.meta.url)),
    readdir(new URL("../public/assets/sequence-desktop/", import.meta.url)),
    readdir(new URL("../public/assets/sequence-mobile/", import.meta.url)),
  ]);
  assert.match(client, /ScrollTrigger\.create/);
  assert.match(client, /useLenis\(\)/);
  assert.match(client, /lenis\.on\("scroll"/);
  assert.match(client, /ScrollTrigger\.update\(\)/);
  assert.match(client, /const next = targetProgressRef\.current/);
  assert.doesNotMatch(client, /window\.scrollY|window\.scrollTo|addEventListener\("scroll"|SCROLL_LERP_FACTOR/);
  assert.match(client, /if \(animationFrame\) return/);
  assert.match(client, /new ResizeObserver/);
  assert.match(client, /start: "top top"/);
  assert.match(client, /end: "bottom bottom"/);
  assert.match(client, /getContext\("2d"\)/);
  const drawFrameSource = client.slice(client.indexOf("function drawFrame"), client.indexOf("useEffect(() =>", client.indexOf("function drawFrame")));
  assert.doesNotMatch(drawFrameSource, /getBoundingClientRect/);
  assert.match(client, /reducedMotion \? <div className="static-chapters"/);
  assert.match(client, /Math\.min\(2, window\.devicePixelRatio/);
  assert.match(client, /prefers-reduced-motion: reduce/);
  assert.match(client, /hero-lockup\.v2\.webp/);
  assert.match(client, /materials-factory-floor\.jpeg/);
  assert.doesNotMatch(client, /setTimeout\(\(\) => setFilmReady/);
  assert.match(client, /mailto:sales@alkhomassiaeg\.com/);
  assert.match(client, /wa\.me\/201273933043/);
  assert.match(client, /ابدأ طلبك عبر واتساب/);
  assert.doesNotMatch(client, /video\.currentTime|<video/);
  assert.match(client, /رحلة عبر الجودة/);
  assert.match(client, /التجهيز الميكانيكي/);
  assert.match(client, /معالجة ميكانيكية لكل أنواع الأقمشة/);
  assert.match(client, /الفحص والجودة/);
  assert.match(client, /أعلى معايير الجودة وأجود أنواع التغليف/);
  assert.match(client, /المنتج النهائي/);
  assert.match(client, /جاهزون لتجهيز طلبكم القادم/);
  assert.doesNotMatch(client, /مستعدون|اللفة النهائية/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /html \{ scroll-behavior: auto/);
  assert.match(css, /\.film-stage \{ position: sticky/);
  assert.match(css, /--step-body: clamp\(1rem/);
  assert.match(css, /\.film canvas \{ position: absolute; inset: 0; width: 100%; height: 100%; \}/);
  assert.doesNotMatch(css, /aspect-ratio: (?:9 \/ 16|16 \/ 9)/);
  assert.match(css, /\.route button \{ min-height: var\(--tap\); min-width: var\(--tap\)/);
  assert.match(css, /\.materials-image \{ min-height: 0; aspect-ratio: 4 \/ 3; \}/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(packageJson, /"lenis": "\^1\.3\.26"/);
  assert.match(layout, /import "lenis\/dist\/lenis\.css"/);
  assert.match(layout, /<SmoothScroll>\{children\}<\/SmoothScroll>/);
  assert.match(smoothScroll, /<ReactLenis[^>]*root[^>]*options=\{options\}/);
  assert.match(smoothScroll, /autoRaf: false/);
  assert.match(smoothScroll, /lerp: 0\.12/);
  assert.match(smoothScroll, /anchors: \{ offset: -96 \}/);
  assert.match(smoothScroll, /lenisRef\.current\?\.lenis\?\.raf\(time\)/);
  assert.equal(fallbackFiles.filter((file) => /\.jpg$/i.test(file)).length, 10);
  assert.equal(desktopFrames.filter((file) => /^f\d{3}\.jpg$/i.test(file)).length, 225);
  assert.equal(mobileFrames.filter((file) => /^f\d{3}\.jpg$/i.test(file)).length, 113);
  const media = JSON.parse(generationRecord);
  assert.equal(media.source_master.width, 3840);
  assert.equal(media.source_master.height, 2160);
  assert.deepEqual(
    [media.desktop.width, media.desktop.height, media.mobile.width, media.mobile.height],
    [1920, 1080, 1080, 1920],
  );
  await access(new URL("../CONTENT_AUDIT.md", import.meta.url));
  await access(new URL("../HIGGSFIELD-PROMPTS-CONCEPT-B.md", import.meta.url));
  await access(new URL("../ASSET_MANIFEST.md", import.meta.url));
  await access(new URL("../public/assets/brand/hero-lockup-gold-3d-transparent.png", import.meta.url));
});
