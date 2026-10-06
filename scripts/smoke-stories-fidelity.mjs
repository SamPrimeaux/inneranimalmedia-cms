/**
 * Real-Chrome source fidelity acceptance for /stories/.
 * Run after npm run build:site; no mocked renderer or alternate template.
 */
import assert from "node:assert/strict";
import http from "node:http";
import path from "node:path";
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "examples/revise-foundation/dist");
const index = path.join(dist, "index.html");
assert.ok(existsSync(index), "Run npm run build:site first");
const chrome = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium"
].find(existsSync);
assert.ok(chrome, "Real Chrome required");

function probe() {
  setTimeout(() => {
    const group = document.querySelector('[data-site-preset="revise/campaign-teaser"]');
    const copy = group?.querySelector(".iam-campaign-teaser__copy");
    const heading = copy?.querySelector("h2");
    const description = copy?.querySelector("p:not(.iam-section-head__eyebrow)");
    const media = group?.querySelector(".iam-campaign-teaser__media");
    const image = group?.querySelector(".iam-campaign-teaser__image");
    const presets = ["campaign-teaser", "sticky-card-deck", "full-bleed-grid", "brand-film"];
    const result = {
      width: window.innerWidth,
      chrome: [
        !!document.querySelector(".revise-announcement"),
        !!document.querySelector(".revise-header"),
        !!document.querySelector(".revise-site__intro"),
        !!document.querySelector(".revise-footer"),
      ],
      sections: presets.map(p => document.querySelectorAll(
        '[data-site-preset="revise/' + p + '"]').length),
      oldEditorControls: document.querySelectorAll(
        "[data-editor-toggle],#site-editor,.revise-site__edit-trigger").length,
      title: document.querySelector(".revise-site__intro h1")?.textContent?.trim(),
      headingColor: heading ? getComputedStyle(heading).color : null,
      copyColor: description ? getComputedStyle(description).color : null,
      mediaHeight: media ? Math.round(media.getBoundingClientRect().height) : 0,
      imageHeight: image ? Math.round(image.getBoundingClientRect().height) : 0,
      mediaPosition: media ? getComputedStyle(media).position : null,
      imagePosition: image ? getComputedStyle(image).position : null,
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
    const node = document.createElement("pre");
    node.id = "stories-result";
    node.textContent = JSON.stringify(result);
    document.body.appendChild(node);
  }, 1400);
}
const probeTag = "<script>(" + probe.toString() + ")()</script>";
const sourceHtml = readFileSync(index, "utf8").replace("</body>", probeTag + "</body>");
const mime = { ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".woff2": "font/woff2", ".mp4": "video/mp4" };
const server = http.createServer((req, res) => {
  const uri = new URL(req.url || "/", "http://localhost").pathname;
  if (uri === "/stories/" || uri === "/") {
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" }).end(sourceHtml); return;
  }
  const target = path.resolve(dist, "." + uri);
  if (!target.startsWith(dist + path.sep) || !existsSync(target) ||
      !statSync(target).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": mime[path.extname(target)] || "application/octet-stream" })
    .end(readFileSync(target));
});
const parseColor = (value) => {
  const v = value?.match(/\d+/g)?.slice(0, 3).map(Number);
  assert.equal(v?.length, 3, "Missing computed color: " + value); return v;
};
const lum = (rgb) => rgb.map(c => c / 255).map(c =>
  c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4)
  .reduce((n, c, i) => n + c * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => {
  const l = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l[0] + .05) / (l[1] + .05);
};

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
try {
  for (const width of [390, 744, 1180, 1920]) {
    const url = "http://127.0.0.1:" + server.address().port + "/stories/";
    const {stdout} = await exec(chrome, [
      "--headless=new", "--disable-gpu", "--disable-dev-shm-usage",
      "--no-sandbox", "--force-device-scale-factor=1",
      "--virtual-time-budget=5000", "--window-size=" + width + ",1000",
      "--dump-dom", url,
    ], { timeout: 60000, encoding: "utf8", maxBuffer: 1 << 24 });
    const encoded = stdout.match(/<pre id="stories-result">([^<]+)<\/pre>/)?.[1];
    assert.ok(encoded, "Stories runtime unavailable in Chrome at " + width);
    const d = JSON.parse(encoded.replaceAll("&quot;", '"').replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<").replaceAll("&gt;", ">"));
    assert.deepEqual(d.chrome, [true, true, true, true], "Missing global/page chrome");
    assert.deepEqual(d.sections, [1, 1, 1, 1], "Original renderer instances changed");
    assert.equal(d.oldEditorControls, 0, "Rejected authoring drawer exists");
    assert.equal(d.title, "Project Stories");
    assert.equal(d.mediaPosition, "relative");
    assert.equal(d.imagePosition, "absolute");
    assert.ok(d.mediaHeight >= 250 && Math.abs(d.imageHeight-d.mediaHeight) <= 2,
      "Feature image no longer fills its media rail");
    assert.ok(d.overflow <= 3, "Horizontal overflow at " + width + ": " + d.overflow);
    const background = [23,23,20];
    const headingRatio = contrast(parseColor(d.headingColor), background);
    const copyRatio = contrast(parseColor(d.copyColor), background);
    assert.ok(headingRatio >= 4.5 && copyRatio >= 4.5, "Unreadable dark feature copy");
    console.log("PASS stories " + width + "px: 8 layers, no drawer, filled media, contrast " +
      headingRatio.toFixed(1) + "/" + copyRatio.toFixed(1));
  }
} finally { server.close(); }
