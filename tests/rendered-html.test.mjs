import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

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

test("server-renders the Arabic-first Concept B site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="ar" dir="rtl">/);
  assert.match(html, /الخماسية للصناعات النسيجية/);
  assert.match(html, /AL KHOMASSIA FOR TEXTILE INDUSTRIES/);
  assert.match(html, /داخل الخماسية/);
  assert.match(html, /\+600/);
  assert.match(html, /200–1200/);
  assert.match(html, /sales@alkhomassiaeg\.com/);
  assert.match(html, /<form class="inquiry-form">/);
  assert.match(html, /role="status"/);
  assert.doesNotMatch(html, /\bKor\b|\+966|info@alkhomassia\.com/i);
  assert.doesNotMatch(html, /<video\b/i);
});

test("ships the canvas, accessibility and responsive sequence contracts", async () => {
  const [client, css, packageJson, fallbackFiles, desktopFrames, mobileFrames] = await Promise.all([
    readFile(new URL("../app/ConceptBClient.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../public/assets/fallbacks/", import.meta.url)),
    readdir(new URL("../public/assets/sequence-desktop/", import.meta.url)),
    readdir(new URL("../public/assets/sequence-mobile/", import.meta.url)),
  ]);
  assert.match(client, /ScrollTrigger\.create/);
  assert.match(client, /getContext\("2d"\)/);
  assert.match(client, /Math\.min\(2, window\.devicePixelRatio/);
  assert.match(client, /prefers-reduced-motion: reduce/);
  assert.match(client, /window\.setTimeout\(\(\) => setFilmReady\(true\), 9000\)/);
  assert.match(client, /mailto:sales@alkhomassiaeg\.com/);
  assert.doesNotMatch(client, /video\.currentTime|<video/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.film-stage \{ position: sticky/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.equal(fallbackFiles.filter((file) => /\.jpg$/i.test(file)).length, 10);
  assert.equal(desktopFrames.filter((file) => /^f\d{3}\.jpg$/i.test(file)).length, 225);
  assert.equal(mobileFrames.filter((file) => /^f\d{3}\.jpg$/i.test(file)).length, 113);
  await access(new URL("../CONTENT_AUDIT.md", import.meta.url));
  await access(new URL("../HIGGSFIELD-PROMPTS-CONCEPT-B.md", import.meta.url));
  await access(new URL("../ASSET_MANIFEST.md", import.meta.url));
});
