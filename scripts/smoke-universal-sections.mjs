import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_PACKAGE || "playwright");
const base = process.env.CMS_UNIVERSAL_URL || "http://127.0.0.1:4324";
const options = {
  headless: true,
  args: ["--disable-gpu", "--disable-background-networking", "--no-first-run"],
};
if (process.env.REVISE_CHROME) options.executablePath = process.env.REVISE_CHROME;
const browser = await playwright.chromium.launch(options);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const previewPath = "/library/evidence/editorial-commons/index.html";
let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log("PASS " + name);
}

try {
  await check("same React hero supports two customer SiteDocuments without demo commerce leakage", async () => {
    for (const width of [390, 1150, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + previewPath + "?scene=curtain-hero", { waitUntil: "networkidle" });
      const originalImage = await page.locator("section img").first().getAttribute("src");
      assert((await page.locator("h1").innerText()).includes("EFFORTLESS"), "Donor hero changed unintentionally");
      await page.goto(base + previewPath + "?scene=curtain-hero&fixture=fieldwork",
        { waitUntil: "networkidle" });
      assert((await page.locator("h1").innerText()).includes("THE LONG WAY IS THE GOOD WAY"),
        "Canonical SiteSection heading not applied");
      assert((await page.locator("section").first().innerText()).includes("Out there is where the best stories begin"),
        "Canonical section body not applied");
      assert((await page.locator("section a").first().textContent()).includes("Explore the stories"),
        "Canonical section CTA not applied");
      assert((await page.locator("section a").first().getAttribute("href")) === "/stories/",
        "CTA destination was hardcoded");
      const newImage = await page.locator("section img").first().getAttribute("src");
      assert(newImage !== originalImage && newImage.includes("lookbook_leather"),
        "Host media resolver did not change the hero image");
      assert(await page.locator("section button").count() === 0,
        "Donor cart hotspots leaked into unrelated brand");
      assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 2,
        "Cross-brand hero has horizontal overflow at " + width);
      assert(errors.length === 0, "React preview errors at " + width + ": " + errors.join("; "));
      await page.close();
    }
  });

  await check("CMS section and block editing persists using the shared typed-field contract", async () => {
    const page = await browser.newPage({ viewport: { width: 1150, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/campaigns/", { waitUntil: "networkidle" });
    await page.locator("[data-editor-toggle]").first().click();
    const heading = page.locator('[data-editor-content][data-editor-key="heading"]').first();
    assert(await heading.count() > 0, "No typed section heading field");
    await heading.fill("A section you can move and reuse");
    await heading.press("Tab");
    assert((await page.locator("main").innerText()).includes("A section you can move and reuse"),
      "Editing heading did not update section rendering");
    const blockBody = page.locator('[data-editor-block-content][data-editor-key="body"]').first();
    assert(await blockBody.count() > 0, "No typed block copy field");
    await blockBody.fill("Data-driven copy works independently of the visual theme.");
    await blockBody.press("Tab");
    assert((await page.locator("main").innerText()).includes("Data-driven copy works independently"),
      "Editing a block did not update its rendered content");
    await page.reload({ waitUntil: "networkidle" });
    const saved = await page.locator("main").innerText();
    assert(saved.includes("A section you can move and reuse") &&
      saved.includes("Data-driven copy works independently"),
      "Typed edits did not persist in the SiteDocument local draft");
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.locator("[data-editor-toggle]").first().click();
    const cta = page.locator('[data-editor-content][data-editor-key="primaryAction.label"]').first();
    assert(await cta.count() > 0, "Existing FNF nested CTA labels are not editable");
    await cta.fill("Open the latest collection");
    await cta.press("Tab");
    assert((await page.locator("main").innerText()).includes("Open the latest collection"),
      "Nested CTA label was not propagated to the actual renderer");
    const href = page.locator('[data-editor-content][data-editor-key="primaryAction.href"]').first();
    await href.fill("/products/");
    await href.press("Tab");
    await page.reload({ waitUntil: "networkidle" });
    assert((await page.locator("main").innerText()).includes("Open the latest collection"),
      "CTA edits were not persisted");
    assert(errors.length === 0, "Editor JavaScript errors: " + errors.join("; "));
    await page.close();
  });

  await check("combined Design Atlas exposes donor scenes and cross-brand source preview", async () => {
    const page = await browser.newPage({ viewport: { width: 1180, height: 900 } });
    await page.goto(base + "/library/", { waitUntil: "networkidle" });
    assert(await page.locator("[data-gallery-entry]").count() >= 120, "Atlas entries disappeared");
    assert(await page.locator('[data-gallery-entry][data-search*="editorial commons"]').count() >= 41,
      "Not all Editorial Commons scenes are indexed");
    await page.goto(base + "/library/sections/commons-fieldwork-hero/", { waitUntil: "networkidle" });
    assert((await page.locator("h1").innerText()).includes("Curtain hero"),
      "Cross-brand scene detail route is missing");
    await page.goto(base + previewPath + "?gallery=1", { waitUntil: "networkidle" });
    assert(await page.locator('nav[aria-label="Scene collection"] button').count() === 39,
      "Missing source-backed component previews");
    assert(await page.getByText("Second brand ↗").count() >= 1,
      "Cross-brand visual sample not linked from the donor gallery");
    await page.close();
  });
  console.log(passed + " shared-section browser acceptance groups passed.");
} finally {
  await browser.close();
}
