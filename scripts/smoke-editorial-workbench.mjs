#!/usr/bin/env node
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT_PACKAGE || "playwright");
const base = (process.env.CMS_UNIVERSAL_URL || "http://127.0.0.1:4324") +
 "/library/evidence/editorial-commons/index.html";
const config = { headless: true, args: ["--no-first-run", "--disable-gpu"] };
if (process.env.REVISE_CHROME) config.executablePath = process.env.REVISE_CHROME;
const browser = await pw.chromium.launch(config);
const assert = (ok, message) => { if (!ok) throw Error(message); };
try {
  for (const width of [360,390,768,1440,1920]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    for (const [scene,text,number] of [
      ["curtain-hero","THE LONG WAY",0],
      ["wardrobe-gallery","Choose your own direction.",3],
      ["split-media","Go beyond the familiar.",2],
      ["editorial-statement","Take the route",0],
    ]) {
      await page.goto(base+"?scene="+scene+"&fixture=fieldwork",{waitUntil:"networkidle"});
      const root=page.locator('[data-editorial-scene="'+scene+'"]');
      assert((await root.textContent()).toLowerCase().includes(text.toLowerCase()),"wrong content: "+scene);
      assert(!((await root.innerText()).includes("SABLE BLAZER")),"donor content leaked");
      if (scene==="wardrobe-gallery")
        assert(await root.locator("a").count()===number,"wrong categories");
      if (scene==="split-media")
        assert(await root.locator("article").count()===number,"wrong panels");
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert(overflow<=2,scene+" overflows at "+width+": "+overflow);
    }
    assert(errors.length===0,errors.join(";"));
    await page.close();
  }
  console.log("PASS 4 scenes x 5 responsive widths");
  const ctx=await browser.newContext({acceptDownloads:true,viewport:{width:1300,height:940}});
  const page=await ctx.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(base+"?workbench=1",{waitUntil:"networkidle"});
  assert(await page.getByLabel("Site brand name").inputValue()==="FIELDWORK / STUDIO","default brand");
  await page.getByRole("button",{name:"wardrobe gallery"}).click();
  await page.getByLabel("Heading").fill("Categories made to travel");
  await page.getByLabel("Heading").press("Tab");
  assert((await page.locator("[data-workbench-preview] h2").textContent()).includes("Categories made to travel"),"heading edit");
  await page.getByLabel("Caption").first().fill("New independent content");
  await page.getByLabel("Caption").first().press("Tab");
  assert((await page.locator("[data-workbench-preview]").textContent()).includes("New independent content"),"block edit");
  const original=await page.locator("[data-workbench-preview] img").first().getAttribute("src");
  await page.getByLabel("Media Key").first().selectOption("fieldwork.archive");
  assert((await page.locator("[data-workbench-preview] img").first().getAttribute("src"))!==original,"media change");
  await page.getByLabel("Section background").selectOption("inverse");
  const bg=await page.locator('[data-section-preset="commons/wardrobe-gallery"]').evaluate(node=>getComputedStyle(node).backgroundColor);
  assert(bg==="rgb(17, 17, 17)","background doesn't change "+bg);
  await page.getByLabel("Brand accent").fill("#123456");
  const accent=await page.locator("[data-editorial-scene]").first().evaluate(node=>getComputedStyle(node).getPropertyValue("--editorial-accent").trim());
  assert(accent==="#123456","theme accent not applied");
  const before=await page.locator("[data-workbench-preview] a").count();
  await page.getByRole("button",{name:"+ Add content block"}).click();
  assert(await page.locator("[data-workbench-preview] a").count()===before+1,"add block");
  await page.getByRole("button",{name:"Move block 4 up"}).click();
  await page.getByLabel("Href").first().fill("javascript:alert(1)");
  await page.getByLabel("Href").first().press("Tab");
  assert((await page.getByRole("status").innerText()).includes("Invalid href"),"bad URL not caught");
  await page.getByRole("button",{name:"Full page"}).click();
  assert(await page.locator("[data-workbench-preview] [data-editorial-scene]").count()===7,"full page");
  await page.reload({waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Full page"}).click();
  assert((await page.locator("[data-workbench-preview]").textContent()).includes("Categories made to travel"),"persistence");
  const waiting=page.waitForEvent("download");
  await page.getByRole("button",{name:"Export SiteDocument"}).click();
  const download=await waiting;
  const data=JSON.parse(readFileSync(await download.path(),"utf8"));
  assert(data.schemaVersion===1 && data.design.accent==="#123456","export invalid");
  data.brand.name="Imported customer site";
  await page.getByLabel("Import SiteDocument").setInputFiles({
    name:"client.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(data)),
  });
  await page.waitForTimeout(350);
  await page.getByLabel("Site brand name").waitFor();
  await page.waitForFunction(() => (document.querySelector('input[aria-label="Site brand name"]')?.value ?? "") === "Imported customer site");
  assert(await page.getByLabel("Site brand name").inputValue()==="Imported customer site","import failed");
  await page.getByRole("button", {name:"+ Add page"}).click();
  assert(await page.getByLabel("Select page").locator("option").count()===2,"new page wasn't added");
  await page.getByLabel("Page title").fill("Campaign landing");
  await page.getByLabel("Page path").fill("/campaign/");
  await page.getByLabel("Page path").press("Tab");
  await page.getByLabel("Add a section").selectOption("editorial-statement");
  assert(await page.locator('[data-editorial-scene="editorial-statement"]').count()===1,
    "a newly-added page didn't mount its section");
  await page.reload({waitUntil:"networkidle"});
  assert(await page.getByLabel("Page title").inputValue()==="Campaign landing","selected page was not restored");
  const secondDownload=page.waitForEvent("download");
  await page.getByRole("button",{name:"Export SiteDocument"}).click();
  const exported=JSON.parse(readFileSync(await (await secondDownload).path(),"utf8"));
  assert(exported.pages.length===2 && exported.pages[1].path==="/campaign/" &&
    exported.pages[1].sections.length===1,"multi-page SiteDocument export is incomplete");
  assert(errors.length===0,"runtime errors: "+errors.join(";"));
  console.log("PASS edit, blocks, reorder, style tokens, invalid URL, persistence, import/export");
  await ctx.close();
} finally { await browser.close(); }
