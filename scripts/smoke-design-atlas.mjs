#!/usr/bin/env node
/**
 * Optional real-browser smoke suite for the Revise site and source-backed atlas.
 * Run with PLAYWRIGHT_PACKAGE=/path/to/node_modules/playwright and optionally
 * REVISE_CHROME=/path/to/chrome to avoid introducing a package dependency.
 */
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
const require = createRequire(import.meta.url);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const playwright = require(process.env.PLAYWRIGHT_PACKAGE || "playwright");
const base = process.env.REVISE_PREVIEW_URL || "http://127.0.0.1:4319";
const chrome = process.env.REVISE_CHROME;
const launch = { headless: true, timeout: 16000, args: ["--no-first-run", "--disable-gpu", "--disable-background-networking"] };
if (chrome) {
  if (!existsSync(chrome)) throw new Error("Chrome executable not found: " + chrome);
  launch.executablePath = chrome;
}
const browser = await playwright.chromium.launch(launch);
let completed = 0;
async function check(name, callback) {
  await callback();
  console.log("PASS " + name);
  completed++;
}
try {
  await check("gallery indexing + category controls", async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await page.goto(base + "/library/", { waitUntil: "domcontentloaded" });
    const n = await page.locator(".atlas-card").count();
    assert(n >= 85, "Expected at least 85 gallery mounts, found " + n);
    const expected = { theme: 8, page: 35, section: 29, palette: 7, lab: 5, template: 2 };
    for (const [kind, count] of Object.entries(expected)) {
      await page.locator('[data-filter="' + kind + '"]').click();
      const visible = await page.locator(".atlas-card:visible").count();
      assert(visible === count, kind + " expected " + count + " visible, got " + visible);
    }
    await page.locator('[data-filter="all"]').click();
    await page.locator("[data-atlas-search]").fill("cypress");
    const visible = await page.locator(".atlas-card:visible").count();
    assert(visible >= 1 && visible < n, "Search filtering did not narrow the atlas");
    await page.close();
  });
  await check("theme preview mounted and interactive", async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/library/themes/cypress/", { waitUntil: "domcontentloaded" });
    const title = await page.locator(".atlas-detail__hero h1").innerText();
    assert(title === "Cypress", "Wrong detail title: " + title);
    const frame = page.frameLocator(".atlas-detail__frame iframe");
    await frame.locator("body").waitFor({ timeout: 12000 });
    const content = await frame.locator("body").innerText();
    assert(content.includes("Cypress"), "Historical theme preview rendered no source content");
    await page.locator('[data-viewport="mobile"]').click();
    assert(await page.locator(".atlas-detail__frame").evaluate((el) => el.classList.contains("is-mobile")),
      "Mobile viewport toggle did not change view");
    assert(errors.length === 0, "Theme preview JS errors: " + errors.join("; "));
    await page.close();
  });
  await check("live Revise section preview", async () => {
    const page = await browser.newPage({ viewport: { width: 1200, height: 820 } });
    await page.goto(base + "/library/presets/revise-sticky-curtain/embed/", { waitUntil: "domcontentloaded" });
    await page.locator(".iam-site-section").waitFor();
    assert((await page.locator(".iam-site-section").innerText()).includes("Time is the real horsepower"),
      "Section preview did not render canonical FNF content");
    await page.close();
  });
  await check("FNF multipage host and isolated section surfaces", async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-site-page="home"]').waitFor();
    const surfaces = await page.locator(".iam-site-section").count();
    assert(surfaces >= 4, "Home is not composed of independent sections");
    const position = await page.locator('[data-variant="revise/sticky-curtain"]').first()
      .evaluate((el) => getComputedStyle(el).position);
    assert(position !== "sticky", "Hero is leaking sticky background behind the rest of the page");
    await page.goto(base + "/products/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-site-page="products"]').waitFor();
    await page.close();
  });
  await check("legacy routes preserve separate visual evidence", async () => {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    for (const path of [
      "/library/pages/cypress-0/",
      "/library/sections/meauxchess_hero/",
      "/library/palettes/iam-ghost-tactical/",
      "/library/labs/browser-promo/",
      "/library/templates/starter-page/",
    ]) {
      await page.goto(base + path, { waitUntil: "domcontentloaded" });
      await page.locator(".atlas-detail__frame iframe").waitFor({ timeout: 6500 });
      const headline = await page.locator(".atlas-detail__hero h1").innerText();
      assert(headline.length > 2, path + " has no detail headline");
      const iframe = page.frameLocator(".atlas-detail__frame iframe");
      await iframe.locator("body").waitFor({ timeout: 6500 });
      const text = (await iframe.locator("body").innerText()).trim();
      assert(text.length > 30, path + " rendered no historic source content");
    }
    await page.close();
  });
  await check("site editor can open the atlas", async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    await page.locator("[data-editor-toggle]").first().click();
    await page.locator(".revise-site__editor.is-open").waitFor();
    await page.locator(".revise-site__editor-open-library").click();
    await page.waitForURL("**/library/");
    assert(await page.locator(".atlas-card").count() >= 85, "Editor did not navigate to the library");
    await page.close();
  });
  await check("responsive gallery widths", async () => {
    for (const width of [390, 768, 1440, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(base + "/library/?kind=theme", { waitUntil: "domcontentloaded" });
      await page.locator(".atlas-grid .atlas-card").first().waitFor();
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(scrollWidth <= width + 2, width + "px has horizontal overflow: " + scrollWidth);
      await page.close();
    }
  });
  console.log(completed + " real-browser smoke groups passed.");
} finally {
  await browser.close();
}
