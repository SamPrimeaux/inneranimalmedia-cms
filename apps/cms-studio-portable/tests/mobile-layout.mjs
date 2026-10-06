import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE||"playwright-core");
const root=resolve(import.meta.dirname,"../../..","examples/revise-foundation/public");
const server=createServer(async(req,res)=>{
  const path=resolve(root,"."+new URL(req.url,"http://localhost").pathname);
  if(!path.startsWith(root+"/")){res.writeHead(403);res.end();return;}
  try{const data=await readFile(path);res.setHeader("Content-Type",({".js":"text/javascript",".css":"text/css",".html":"text/html"})[extname(path)]||"application/octet-stream");res.end(data);}catch{res.writeHead(404);res.end();}
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
const browser=await chromium.launch({headless:true,executablePath:process.env.REVISE_CHROME});
try{
  for(const [width,height] of [[360,740],[390,844],[430,932],[744,900],[834,900],[900,900],[844,390],[1440,1000],[1920,1080]]){
    const page=await browser.newPage({viewport:{width,height},reducedMotion:"reduce"});
    const errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto("http://127.0.0.1:"+server.address().port+"/library/evidence/cms-studio/index.html");
    if(width<=900)await page.getByRole("button",{name:"Edit",exact:true}).click();
    const heading=page.getByLabel("Heading",{exact:true});
    await heading.fill("Edited at "+width);
    await heading.press("End");await heading.pressSequentially(" pixels");
    assert.equal(await heading.inputValue(),"Edited at "+width+" pixels");
    assert.ok(await page.locator("[data-site-preview] h2").first().textContent().then(t=>t.includes("Edited at "+width+" pixels")));
    const canvas=await page.locator(".studio-canvas").boundingBox();
    const inspector=await page.locator(".studio-inspector").boundingBox();
    assert.ok(canvas.height>45,"Preview too short at "+width);
    if(width<=900){
      assert.ok(canvas.y+canvas.height<=inspector.y+1,"Editor overlays preview at "+width);
      await page.locator(".studio-inspector").getByRole("button",{name:"Expand",exact:true}).click();
      const expanded=await page.locator(".studio-canvas").boundingBox();assert.ok(expanded.height>45,"Expanded editor hides preview");
      await page.locator(".studio-inspector").getByRole("button",{name:"Close",exact:true}).click();
      assert.equal(await page.locator(".studio-inspector").isVisible(),false);
      await page.getByRole("button",{name:"Pages",exact:true}).last().click();
      assert.ok(await page.locator(".studio-canvas").isVisible(),"Outline hides preview");
      await page.getByRole("button",{name:"Edit",exact:true}).click();
      if(height>600){
        await page.evaluate(()=>{Object.defineProperty(window.visualViewport,"height",{value:360,configurable:true});window.visualViewport.dispatchEvent(new Event("resize"));});
        assert.equal(await page.locator(".studio").getAttribute("data-keyboard"),"true");
        const keyCanvas=await page.locator(".studio-canvas").boundingBox();assert.ok(keyCanvas.height>40,"Keyboard viewport hides preview");
        assert.ok(await heading.isVisible());
      }
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,"Horizontal overflow at "+width);
    assert.deepEqual(errors,[]);
    console.log("PASS mobile editing, preview visibility, keyboard layout and overflow "+width+"x"+height);
    await page.close();
  }
}finally{await browser.close();await new Promise(done=>server.close(done));}
