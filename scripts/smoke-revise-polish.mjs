#!/usr/bin/env node
/**
 * Real-browser acceptance for the Revise multipage polish pass.
 * Run with PLAYWRIGHT_PACKAGE=/absolute/path/to/playwright and optional
 * REVISE_CHROME=/Applications/...; never downloads a browser on install.
 */
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_PACKAGE || "playwright");
const url = process.env.REVISE_PREVIEW_URL || "http://127.0.0.1:4319";
const options = {
  headless: true,
  timeout: 16000,
  args: ["--no-first-run", "--disable-gpu", "--disable-background-networking"],
};
if (process.env.REVISE_CHROME) options.executablePath = process.env.REVISE_CHROME;
const browser = await playwright.chromium.launch(options);
const assert = (truth, message) => { if (!truth) throw new Error(message); };
const screenshots = process.env.REVISE_QA_SCREENSHOTS || "";
let passes = 0;
const open = async (path, width, height = 900) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(url + path, { waitUntil: "domcontentloaded", timeout: 12000 });
  return page;
};
async function check(label, test) {
  await test();
  passes++;
  console.log("PASS " + label);
}
try {
  await check("search opens as centered glass, focuses input, and restores focus", async () => {
    for (const width of [390, 1150]) {
      const page = await open("/campaigns/", width);
      const trigger = page.locator('[data-overlay-open="search"]').first();
      if (width === 390) assert(await trigger.isVisible(), "Mobile Search control hidden");
      await trigger.click();
      const dialog = page.locator('[data-overlay="search"]');
      await dialog.waitFor({ state: "visible" });
      const metrics = await dialog.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, width: r.width, top: r.top,
          blur: getComputedStyle(el).backdropFilter, modal: el.getAttribute("aria-modal") };
      });
      assert(metrics.left >= 8 && metrics.right <= width - 8, "Search escapes viewport at " + width);
      assert(metrics.width < width * .9 || width === 390, "Search is still a full-screen sheet");
      assert(metrics.blur.includes("blur("), "Search is not translucent glass");
      assert(metrics.modal === "true", "Search must be modal");
      await page.waitForFunction(() =>
        document.activeElement === document.querySelector("[data-site-search-input]"), { timeout: 1000 });
      assert(await page.locator(".revise-site__edit-trigger,[data-editor-toggle]").count() === 0,
        "A rejected source editor was reintroduced");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(260);
      assert(await dialog.getAttribute("data-state") === "closed", "Escape didn't close search");
      await page.close();
    }
  });
  await check("real index, keyboard results, and section navigation", async () => {
    const page = await open("/", 1150);
    await page.keyboard.press("Control+k");
    await page.locator('[data-overlay="search"][data-state="open"]').waitFor();
    await page.locator("[data-site-search-input]").fill("High Octane");
    const entries = page.locator("[data-search-hit]");
    assert(await entries.count() === 1, "Search returned duplicate High Octane results");
    assert((await entries.first().getAttribute("href")).includes("/campaigns/#"), "No deep link");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/campaigns/#campaigns-pinned-media-grid-2");
    assert(await page.locator('[data-site-page="campaigns"]').isVisible(), "Search didn't navigate");
    assert(await page.locator('[data-overlay="search"][data-state="closed"]').count() === 1, "Overlay stuck open");
    await page.close();
  });
  await check("all pages stay within viewport and retain per-section surfaces", async () => {
    const widths = [360, 390, 430, 744, 834, 1150, 1440, 1920];
    const paths = ["/", "/products/", "/stories/", "/campaigns/", "/ideas/"];
    for (const width of widths) {
      for (const path of paths) {
        const page = await open(path, width);
        const info = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          sections: document.querySelectorAll(".iam-site-section").length,
        }));
        assert(info.overflow <= 2, width + " " + path + " horizontal overflow " + info.overflow);
        assert(info.sections >= 4, path + " no independent sections");
        if (screenshots && [390, 1440].includes(width)) {
          await mkdir(screenshots, { recursive: true });
          await page.screenshot({
            path: screenshots + "/" + (path === "/" ? "home" : path.slice(1).replaceAll("/", "")) +
              "-" + width + ".png",
            fullPage: false,
          });
        }
        await page.close();
      }
    }
  });
  await check("campaign cards and editorial headings use real gutters on mobile and desktop", async () => {
    for (const width of [390, 744, 1150, 1920]) {
      const page = await open("/campaigns/", width);
      const measure = await page.evaluate(() => {
        const section = document.querySelector('[data-site-preset="revise/dark-promo-grid"]');
        const header = section?.querySelector(".iam-section-head__heading");
        const cards = section?.querySelector(".iam-editorial-grid__items");
        if (!section || !header || !cards) return null;
        const h = header.getBoundingClientRect(), c = cards.getBoundingClientRect();
        return { headingX: h.left, cardsX: c.left, cardsRight: c.right,
          display: getComputedStyle(section.querySelector("section")).display,
          count: cards.querySelectorAll(".iam-editorial-tile").length };
      });
      assert(measure !== null && measure.display !== "none", "Campaigns hidden at " + width);
      assert(measure.count === 3, "Missing campaign direction");
      assert(measure.headingX >= 15 && measure.cardsX >= 15 && measure.cardsRight <= width - 14,
        "Campaign content touches screen edge at " + width + ": " + JSON.stringify(measure));
      await page.close();
    }
    for (const [path, preset] of [
      ["/", "wardrobe-rail"], ["/products/", "tabbed-products"], ["/stories/", "full-bleed-grid"],
    ]) {
      const page = await open(path, 1150);
      const x = await page.locator('[data-site-preset="revise/' + preset + '"] .iam-section-head__heading')
        .first().evaluate((el) => el.getBoundingClientRect().left);
      assert(x >= 20, preset + " title is still flush against left edge");
      await page.close();
    }
  });
  await check("product and story dead-ends open truthful detail previews", async () => {
    const products = await open("/products/", 1150);
    const card = products.locator(".iam-product-card").first();
    await card.locator(".iam-product-card__quick").click();
    const productPanel = products.locator('[data-overlay="preview"]');
    await productPanel.waitFor({ state: "visible" });
    assert((await productPanel.locator("[data-preview-title]").innerText()).length > 2, "Product has no title");
    assert((await productPanel.locator("[data-preview-disclaimer]").innerText()).includes("live store"),
      "Preview falsely suggests checkout works");
    assert((await productPanel.locator("[data-preview-cta]").getAttribute("href")).startsWith("https://"),
      "Live product has no real storefront destination");
    await products.keyboard.press("Escape");
    await products.close();
    const stories = await open("/stories/", 1150);
    await stories.locator('.iam-social-tile[href="#"]').first().click();
    const storyPanel = stories.locator('[data-overlay="preview"]');
    await storyPanel.waitFor({ state: "visible" });
    assert((await storyPanel.locator("[data-preview-disclaimer]").innerText()).includes("editorial preview"),
      "Story card still a dead link");
    await stories.close();
  });
  await check("navigation retains its real page routes", async () => {
    const page = await open("/", 390);
    await page.locator('[data-overlay-open="menu"]').first().click();
    const links = page.locator('[data-overlay="menu"] .revise-nav-stack__row');
    assert(await links.count() === 5, "Missing menu destinations");
    assert(await page.locator(".revise-menu-editorial img").count() === 3, "Menu lost editorial media");
    await links.filter({ hasText: "Our Worlds" }).click();
    await page.waitForURL("**/campaigns/");
    assert(await page.locator('[data-site-page="campaigns"]').isVisible(), "Navigation didn't render campaigns");
    await page.close();
  });
  console.log(passes + " Revise visual/interaction checks passed.");
} finally {
  await browser.close();
}
