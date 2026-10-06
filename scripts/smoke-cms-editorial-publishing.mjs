#!/usr/bin/env node
import { mkdtempSync, readFileSync, existsSync, statSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, extname } from "node:path";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  EDITORIAL_PRESETS, createCmsEditorialInstall, defaultEditorialSection,
  renderCmsEditorialPage, publishCmsEditorialPage, installCmsEditorialAssets,
  handleCmsEditorialPublishRequest,
} from "../integration/host-adapters/cms-editorial-publisher.js";

const root = mkdtempSync(join(tmpdir(), "cms-editorial-"));
const cli = resolve("bin/cms-runtime.mjs");
const run = (...args) => {
  const p = spawnSync(process.execPath, [cli, ...args, "--root", root, "--json"],
    { encoding: "utf8" });
  if (p.status !== 0) throw Error(p.stderr);
  return JSON.parse(p.stdout);
};
let server;
try {
  run("init", "--project", "cove");
  const db = new DatabaseSync(join(root, ".agentsam/cms.sqlite"));
  db.prepare("INSERT INTO cms_sites(id,name,initials,theme_json) VALUES(?,?,?,?)")
    .run("cove", "COVE / PAPER", "CP", JSON.stringify({ design: {
      accent: "#25516A", accentSoft: "#9BD6D5", paper: "#FFFFFF", ink: "#153144",
    } }));
  db.prepare("INSERT INTO cms_pages(id,site_id,title,slug) VALUES(?,?,?,?)")
    .run("home", "cove", "Cove Editorial", "home");
  db.close();
  EDITORIAL_PRESETS.forEach(({ preset }, index) => {
    const receipt = run("install-editorial", "--page", "home", "--preset", preset,
      "--id", "section-" + index);
    assert.equal(receipt.ok, true);
    assert.equal(receipt.preset, preset);
  });
  const result = run("publish-editorial", "--page", "home");
  assert.equal(result.ok, true);
  assert.equal(result.sectionCount, 7);
  const html = readFileSync(join(root, result.output), "utf8");
  assert(html.includes("COVE / PAPER"));
  assert.equal((html.match(/data-cms-editorial-root/g) ?? []).length, 7);
  assert(!html.includes("FORM / 26"));
  assert(existsSync(join(root, result.serveRoot, "cove/assets/editorial/editorial-runtime.js")));
  assert(existsSync(join(root, result.serveRoot, "cove/assets/editorial/editorial-runtime.css")));
  const next = run("publish-editorial", "--page", "home");
  assert.equal(next.revisionNum, 2);
  const persisted = new DatabaseSync(join(root, ".agentsam/cms.sqlite"));
  assert.equal(persisted.prepare("SELECT count(*) AS n FROM cms_revisions").get().n, 2);
  assert.equal(persisted.prepare("SELECT revision_num FROM cms_publications WHERE page_id='home'").get().revision_num, 2);
  persisted.close();
  console.log("PASS installed all seven sections in real SQLite; published HTML and versioned revisions");

  const writes = new Map();
  const bucket = { async put(key, body, opts) { writes.set(key, { body, opts }); } };
  const assets = Object.fromEntries(["editorial-runtime.js", "editorial-runtime.css"].map((name) =>
    [name, new Uint8Array(readFileSync(resolve("integration/host-adapters/editorial-assets", name)))]));
  await installCmsEditorialAssets({ bucket, prefix: "tenant-cove/editorial-v1", assets });
  const row = createCmsEditorialInstall("home", defaultEditorialSection("commons/faq-trust"));
  await publishCmsEditorialPage({
    bucket, key: "tenant-cove/home/index.html", page: { title: "Cove Editorial" },
    sections: [{ section_data: row.section_data }],
    assetBaseUrl: "https://cdn.example.com/tenant-cove/editorial-v1",
    brand: { name: "COVE / PAPER" },
  });
  assert.equal(writes.size, 3);
  assert.equal(writes.get("tenant-cove/home/index.html").opts.httpMetadata.contentType,
    "text/html; charset=utf-8");
  assert.rejects(() => publishCmsEditorialPage({
    bucket, key: "../outside/index.html", page: { title: "Unsafe" },
    sections: [{ section_data: row.section_data }],
    assetBaseUrl: "https://cdn.example.com/assets", brand: { name: "Cove" },
  }), /scoped/);
  assert.throws(() => renderCmsEditorialPage({
    page: { title: "Unsafe" }, sections: [{ section_data: { random: true } }],
    assetBaseUrl: "/assets", brand: { name: "Cove" },
  }), /not an installed/);
  const xss = createCmsEditorialInstall("home", defaultEditorialSection("commons/faq-trust"));
  xss.section_data.section.blocks[0].data.body = "</script><script>alert(1)</script>";
  const safe = renderCmsEditorialPage({
    page: { title: "<img onerror=alert(1)>" },
    sections: [{ section_data: xss.section_data }],
    assetBaseUrl: "/assets", brand: { name: "Cove" },
  });
  assert(!safe.includes("</script><script>alert"));
  assert(!safe.includes("<img onerror"));
  console.log("PASS R2 adapter asset writes, scoped keys, fail-closed mixed pages, and HTML/JSON escaping");
  const endpoint = "https://cms.example.test/api/cms/editorial/publish";
  const req = () => new Request(endpoint, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_id: "home", project_slug: "cove" }),
  });
  const hostOptions = {
    authorize: async () => ({ userId: "authorized" }),
    loadPage: async ({ pageId, projectSlug, actor }) => {
      assert.equal(pageId, "home");
      assert.equal(projectSlug, "cove");
      assert.equal(actor.userId, "authorized");
      return { page: { title: "Cove Editorial" },
        sections: [{ section_data: row.section_data }], brand: { name: "COVE / PAPER" } };
    },
    bucket, runtimeAssets: assets,
    assetOrigin: "https://cdn.example.test", assetPrefix: "cms-editorial/v1",
  };
  const forbidden = await handleCmsEditorialPublishRequest(req(), {
    ...hostOptions, authorize: async () => null,
  });
  assert.equal(forbidden.status, 403);
  const published = await handleCmsEditorialPublishRequest(req(), hostOptions);
  assert.equal(published.status, 200);
  assert.equal((await published.json()).key, "cove/home/index.html");
  assert(writes.has("cove/home/index.html"));
  const mixed = await handleCmsEditorialPublishRequest(req(), {
    ...hostOptions, loadPage: async () => ({ page: { title: "Mixed" },
      sections: [{ section_data: { other: "template" } }], brand: { name: "Cove" } }),
  });
  assert.equal(mixed.status, 422);
  console.log("PASS host publish endpoint authorization, page authority and fail-closed mixed layouts");

  const publicRoot = join(root, result.serveRoot);
  server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let file = resolve(publicRoot, "." + decodeURIComponent(url.pathname));
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!file.startsWith(publicRoot + "/") || !existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.setHeader("Content-Type", { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[extname(file)] ?? "text/plain");
    res.end(readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const port = server.address().port;
  const require = createRequire(import.meta.url);
  const playwright = require(process.env.PLAYWRIGHT_PACKAGE || "playwright");
  const options = { headless: true, args: ["--no-first-run", "--disable-gpu"] };
  if (process.env.REVISE_CHROME) options.executablePath = process.env.REVISE_CHROME;
  const browser = await playwright.chromium.launch(options);
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 850 } });
      const errors = [];
      page.on("pageerror", (err) => errors.push(err.message));
      await page.goto("http://127.0.0.1:" + port + "/cove/home/", { waitUntil: "networkidle" });
      await page.waitForFunction(() => [...document.querySelectorAll("[data-cms-editorial-root]")]
        .every((el) => el.shadowRoot?.querySelector("[data-section-preset]")));
      assert.equal(await page.locator("[data-cms-editorial-root]").count(), 7);
      assert.equal(await page.locator("[data-cms-editorial-error]").count(), 0);
      const body = await page.locator("body").innerText();
      assert(body.includes("Cove Editorial") === false); // document title is not body content
      const labels = await page.evaluate(() => [...document.querySelectorAll("[data-cms-editorial-root]")]
        .map((root) => root.shadowRoot?.querySelector("[data-section-preset]")?.getAttribute("data-section-preset")));
      assert.equal(new Set(labels).size, 7);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert(overflow <= 3, "Published sections overflow at " + width + "px: " + overflow);
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log("PASS actual published React islands mounted from package assets at mobile and desktop widths");
  } finally { await browser.close(); }
} finally {
  if (server) await new Promise((ok) => server.close(ok));
  rmSync(root, { recursive: true, force: true });
}
