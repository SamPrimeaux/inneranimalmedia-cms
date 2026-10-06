import { createRequire } from "node:module";
import { EDITORIAL_SCENES } from "../src/portable/scene-manifest";

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_PACKAGE || "playwright");
const base = process.env.EDITORIAL_PREVIEW_URL || "http://127.0.0.1:4331";
const browserArgs: Record<string, unknown> = {
  headless: true, timeout: 16000,
  args: ["--no-first-run", "--disable-gpu", "--disable-background-networking"],
};
if (process.env.EDITORIAL_CHROME) browserArgs.executablePath = process.env.EDITORIAL_CHROME;
const browser = await playwright.chromium.launch(browserArgs);
const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};
let checks = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1250, height: 900 } });
  const errors: string[] = [];
  page.on("pageerror", (error: Error) => errors.push(page.url() + ": " + error.message));
  assert(EDITORIAL_SCENES.length === 39, "All 34 originals + five multipage views must remain registered");
  assert(new Set(EDITORIAL_SCENES.map((item) => item.id)).size === EDITORIAL_SCENES.length, "Duplicate scene IDs");
  await page.goto(base + "/?gallery=1", { waitUntil: "domcontentloaded" });
  await page.getByText("One component at a time.").waitFor();
  assert(await page.locator('nav[aria-label="Scene collection"] button').count() === 39,
    "Gallery must expose every scene");
  console.log("PASS 39 registered scene previews");
  checks++;

  for (const scene of EDITORIAL_SCENES) {
    const initial = errors.length;
    await page.goto(base + "/?scene=" + encodeURIComponent(scene.id), { waitUntil: "domcontentloaded" });
    await page.locator('[data-editorial-scene="' + scene.id + '"]').waitFor({ timeout: 6000 });
    await page.waitForTimeout(65);
    assert(errors.length === initial, scene.id + " threw: " + errors.slice(initial).join("; "));
  }
  console.log("PASS every scene mounts in a fresh React tree without page errors");
  checks++;

  for (const route of ["#/", "#/collections", "#/lookbook", "#/maison",
    "#/reserve", "#/studio", "#/product/leather-tee"]) {
    const initial = errors.length;
    await page.goto(base + "/" + route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(125);
    assert(errors.length === initial, route + ": runtime errors");
    assert((await page.locator("main").count()) > 0, route + ": no page content");
  }
  console.log("PASS seven hash routes, including the inherited PDP");
  checks++;

  await page.goto(base + "/?scene=site-header&brand=Test%20Client", { waitUntil: "domcontentloaded" });
  assert(await page.getByText("Test Client").count() > 0, "Custom host brand not visible");
  console.log("PASS host-supplied brand overrides the original demo identity");
  checks++;

  await page.goto(base + "/?scene=bag-drawer", { waitUntil: "domcontentloaded" });
  await page.getByText("Your shopping bag is empty.").waitFor();
  assert(!((await page.locator("body").innerText()).includes("Order Confirmed")),
    "No preset orders may be implied");
  console.log("PASS bag defaults empty without fake checkout success");
  checks++;

  await page.goto(base + "/#/studio", { waitUntil: "domcontentloaded" });
  await page.getByText("No archive has been inspected", { exact: false }).waitFor();
  await page.goto(base + "/#/reserve", { waitUntil: "domcontentloaded" });
  await page.getByText("No live passes are issued", { exact: false }).waitFor();
  await page.goto(base + "/#/maison", { waitUntil: "domcontentloaded" });
  await page.getByText("not verified or live", { exact: false }).waitFor();
  console.log("PASS simulation labels on studio, reserve and booking surfaces");
  checks++;

  for (const width of [360, 390, 744, 1440, 1920]) {
    const mobile = await browser.newPage({ viewport: { width, height: 940 } });
    for (const route of ["?gallery=1", "#/collections", "#/lookbook", "#/maison", "#/reserve", "#/studio"]) {
      await mobile.goto(base + "/" + route, { waitUntil: "domcontentloaded" });
      await mobile.waitForTimeout(85);
      const over = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(over < 4, width + "px " + route + " has horizontal overflow " + over);
    }
    await mobile.close();
  }
  console.log("PASS 5 responsive widths × 6 pages without horizontal overflow");
  checks++;
  console.log(checks + " complete browser acceptance groups passed.");
} finally {
  await browser.close();
}
