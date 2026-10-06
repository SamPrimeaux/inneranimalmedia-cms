#!/usr/bin/env node
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT_PACKAGE || "playwright");
const base = (process.env.CMS_UNIVERSAL_URL || "http://127.0.0.1:4324") +
  "/library/evidence/editorial-commons/index.html";
const launch = { headless: true, args: ["--no-first-run", "--disable-gpu"] };
if (process.env.REVISE_CHROME) launch.executablePath = process.env.REVISE_CHROME;
const browser = await pw.chromium.launch(launch);
const assert = (value, message) => { if (!value) throw Error(message); };
try {
  for (const width of [360, 390, 768, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 880 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const [scene, text] of [
      ["collection-carousel", "The collected edit"],
      ["lookbook-hotspots", "Find the interesting details"],
      ["faq-trust", "Questions along the way"],
    ]) {
      await page.goto(base + "?scene=" + scene + "&fixture=fieldwork", { waitUntil: "networkidle" });
      const surface = page.locator('[data-editorial-scene="' + scene + '"]');
      assert((await surface.textContent()).includes(text), scene + " did not use the customer SiteDocument");
      assert(!(await surface.textContent()).includes("SABLE BLAZER"), scene + " leaked demo products");
      assert(!(await surface.textContent()).includes("ADD TO BAG"), scene + " leaked purchase actions");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert(overflow <= 2, scene + " has " + overflow + "px overflow at " + width);
    }
    assert(errors.length === 0, "Responsive scene runtime errors: " + errors.join("; "));
    await page.close();
  }
  console.log("PASS three new SiteDocument scenes across five viewports");
  for (const width of [360, 1440]) {
    const second = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    second.on("pageerror", error => errors.push(error.message));
    for (const [scene, heading, cardCount] of [
      ["collection-carousel", "A quieter collection", 2],
      ["lookbook-hotspots", "A study in composition", 2],
      ["faq-trust", "A few useful answers", 2],
    ]) {
      await second.goto(base + "?scene=" + scene + "&fixture=cove", { waitUntil: "networkidle" });
      const root = second.locator('[data-editorial-scene="' + scene + '"]');
      assert((await root.textContent()).includes(heading), "Independent Cove content not rendered in " + scene);
      assert(!(await root.textContent()).includes("The collected edit"), "Fieldwork content leaked into Cove");
      if (scene === "collection-carousel")
        assert(await root.locator("article").count() === cardCount, "Cove collection count");
      if (scene === "lookbook-hotspots") {
        assert(await root.getByRole("button", { name: /^View / }).count() === cardCount, "Cove hotspot count");
        const background = await root.evaluate(element => getComputedStyle(element).backgroundColor);
        assert(background === "rgb(255, 255, 255)", "Cove lookbook ignores paper surface");
      }
      if (scene === "faq-trust")
        assert(await root.locator("h3 button").count() === cardCount, "Cove FAQ count");
      const overflow = await second.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert(overflow <= 2, scene + " overflow for independent consumer");
    }
    assert(errors.length === 0, "Cove consumer errors: " + errors.join("; "));
    await second.close();
  }
  console.log("PASS second independent SiteDocument, layout and media surfaces at phone and desktop");
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base + "?scene=collection-carousel&fixture=fieldwork", { waitUntil: "networkidle" });
  assert(await page.locator('[aria-label="Collection cards"] article').count() === 3, "Incorrect card count");
  await page.getByRole("button", { name: "Stories" }).click();
  assert(await page.locator('[aria-label="Collection cards"] article').count() === 1,
    "Group filter ignored canonical card group");
  await page.getByRole("button", { name: "All" }).click();
  assert(await page.locator('[aria-label="Collection cards"] article').count() === 3,
    "Reset filter didn't restore cards");
  console.log("PASS customer-owned collection blocks, group tabs, navigation and no fake cart");
  await page.goto(base + "?scene=lookbook-hotspots&fixture=fieldwork", { waitUntil: "networkidle" });
  assert(await page.getByRole("button", { name: "View The open road" }).count() === 1,
    "First lookbook marker missing");
  await page.getByRole("button", { name: "View The open road" }).click();
  assert((await page.locator('[aria-live="polite"]').textContent()).includes("A moment worth remembering."),
    "Lookbook marker doesn't reveal customer content");
  assert(await page.locator('[aria-live="polite"] a[href="/stories/open-road/"]').count() === 1,
    "Lookbook details don't link to customer route");
  await page.getByRole("button", { name: "Close hotspot details" }).click();
  assert(await page.getByRole("button", { name: "Close hotspot details" }).count() === 0,
    "Lookbook details couldn't close");
  console.log("PASS accessible hotspot markers with customer-owned story routes");
  await page.goto(base + "?scene=faq-trust&fixture=fieldwork", { waitUntil: "networkidle" });
  assert(await page.getByRole("button", { name: "Where can I see the collection?" }).getAttribute("aria-expanded") === "false",
    "FAQ should start closed");
  await page.getByRole("button", { name: "Where can I see the collection?" }).click();
  assert(await page.getByRole("button", { name: "Where can I see the collection?" }).getAttribute("aria-expanded") === "true",
    "FAQ toggle didn't expose accessible expansion state");
  assert((await page.locator('[data-section-preset="commons/faq-trust"]').textContent()).includes("Browse the collection pages"),
    "FAQ answer not loaded from block");
  assert(!(await page.locator('[data-section-preset="commons/faq-trust"]').textContent()).includes("EXPRESS GLOBAL FULFILLMENT"),
    "Unverified legacy trust claims leaked");
  console.log("PASS content-owned FAQ, accessible state and no inherited trust claims");
  await page.goto(base + "?workbench=1", { waitUntil: "networkidle" });
  for (const [id, expected] of [
    ["collection-carousel", "The collected edit"],
    ["lookbook-hotspots", "Find the interesting details"],
    ["faq-trust", "Questions along the way"],
  ]) {
    await page.getByRole("button", { name: id.replaceAll("-", " ") }).click();
    assert((await page.locator("[data-workbench-preview]").textContent()).includes(expected),
      "Workbench cannot select " + id);
  }
  await page.getByRole("button", { name: "collection carousel" }).click();
  await page.getByLabel("Group").first().fill("Experiences");
  await page.getByLabel("Group").first().press("Tab");
  await page.getByRole("button", { name: "Experiences" }).waitFor();
  await page.getByRole("button", { name: "lookbook hotspots" }).click();
  await page.getByLabel("Hotspot X").first().fill("74");
  await page.getByLabel("Hotspot X").first().press("Tab");
  const hotspot = page.getByRole("button", { name: "View The open road" });
  const coordinate = await hotspot.evaluate(element => getComputedStyle(element).left);
  assert(Number.parseFloat(coordinate) > 200, "Edited hotspot coordinate not applied to rendered scene");
  await page.getByRole("button", { name: "faq trust" }).click();
  await page.getByLabel("Body").last().fill("An answer from this customer's draft");
  await page.getByLabel("Body").last().press("Tab");
  await page.getByRole("button", { name: "Where can I see the collection?" }).click();
  assert((await page.locator('[data-section-preset="commons/faq-trust"]').textContent()).includes("An answer from this customer's draft"),
    "FAQ field edit doesn't reach renderer");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "faq trust" }).click();
  assert((await page.locator("[data-workbench-preview]").textContent()).includes("An answer from this customer's draft"),
    "New adapter fields didn't persist");
  await page.getByLabel("Add a section").selectOption("lookbook-hotspots");
  const newImage = page.locator('[data-editorial-scene="lookbook-hotspots"] [role="img"][aria-label="Editorial image not configured"]');
  assert(await newImage.count() === 1,
    "Newly scaffolded sections must not silently inherit donor photographs");
  assert(errors.length === 0, "Workbench errors: " + errors.join("; "));
  console.log("PASS generic workbench edits filter, hotspot position and FAQ answer; persists after reload");
  await ctx.close();
} finally {
  await browser.close();
}
