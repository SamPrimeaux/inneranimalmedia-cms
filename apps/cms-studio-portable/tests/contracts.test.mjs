import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync,readdirSync} from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const ts=require("typescript");
// Compile actual modules to CommonJS in memory; avoid alternate test implementations.
const cache=new Map();
function moduleAt(path){
  const url=new URL(path,import.meta.url);if(cache.has(url.href))return cache.get(url.href);
  if(url.pathname.endsWith(".css"))return new Proxy({}, {get:(_,key)=>String(key)});
  const source=readFileSync(url,"utf8");
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const compiledModule={exports:{}};
  const localRequire=specifier=>specifier.startsWith(".")?moduleAt(new URL(specifier.endsWith(".css")?specifier:specifier+(specifier.includes("MountedSection")?".tsx":".ts"),url).href):require(specifier);
  new Function("require","module","exports",compiled)(localRequire,compiledModule,compiledModule.exports);cache.set(url.href,compiledModule.exports);return compiledModule.exports;
}
const {parseDocument,validateBoundary,safeUrl}=moduleAt("../../../packages/studio-sections/src/validation.ts");
const {applySectionFieldEdit}=moduleAt("../../../packages/site-contracts/src/section-fields.ts");
const {catalog,createSection,moveItem}=moduleAt("../../../packages/studio-sections/src/catalog.ts");
const fixtures=readdirSync(new URL("../fixtures",import.meta.url)).filter(f=>f.endsWith(".json")).map(f=>JSON.parse(readFileSync(new URL("../fixtures/"+f,import.meta.url),"utf8")));
test("every canonical fixture imports and exports losslessly",()=>{for(const doc of fixtures)assert.deepEqual(parseDocument(JSON.stringify(doc)),doc);});
test("all registered presets produce valid canonical content",()=>{for(const entry of catalog){const doc=structuredClone(fixtures[0]);doc.pages[0].sections=[createSection(entry.preset,"new")];assert.deepEqual(validateBoundary(doc),[]);}});
test("unsafe URLs, malformed arrays and duplicate routes are rejected without crashing",()=>{
  for(const url of ["javascript:alert(1)","//evil.test","/\\evil.test","data:text/html,test","https://user:pass@example.com/"])assert.equal(safeUrl(url),undefined);
  for(const change of [d=>d.pages="bad",d=>d.pages.push(structuredClone(d.pages[0])),d=>d.pages[0].sections[0].data.ctaHref="javascript:alert(1)",d=>d.header.blocks="bad",d=>d.pages[0].sections[0].blocks=[{id:"x",type:"unknown",data:{}}]]){const doc=structuredClone(fixtures[0]);change(doc);assert.ok(validateBoundary(doc).length);}
});
test("approved text, CTA and media edits preserve other fields",()=>{
  const data={heading:"Before",ctaHref:"/",mediaKey:"missing.hero",future:{x:5}};
  assert.equal(applySectionFieldEdit(data,"heading","After").ok,true);
  assert.equal(applySectionFieldEdit(data,"ctaHref","javascript:alert(1)").ok,false);
  assert.equal(applySectionFieldEdit(data,"mediaKey","customer.hero",{mediaKeys:new Set(["customer.hero"])}).ok,true);
  assert.deepEqual(data.future,{x:5});assert.equal(applySectionFieldEdit(data,"future","x").ok,false);
});
test("ordered blocks and unknown future content survive canonical round trip",()=>{
  const doc=structuredClone(fixtures[0]);const s=doc.pages[0].sections[1];s.blocks=moveItem(s.blocks,0,1);s.data.future={nested:[{x:1}]};doc.extra={a:false};assert.deepEqual(parseDocument(JSON.stringify(doc)),doc);
});
test("uninstalled renderer is retained for an honest missing-renderer state",()=>{const doc=structuredClone(fixtures[0]);doc.pages[0].sections[0].preset="external/unknown";assert.deepEqual(parseDocument(JSON.stringify(doc)),doc);});

const {MountedSection,SitePreview}=moduleAt("../../../packages/studio-sections/src/MountedSection.tsx");
const React=require("react");const {renderToStaticMarkup}=require("react-dom/server");
test("the same compiled source renders two unrelated identities and isolated global blocks",()=>{
 const field=fixtures.find(d=>d.id==="field-studio"),rescue=fixtures.find(d=>d.id==="harbor-rescue");
 for(const doc of [field,rescue]){
  const html=renderToStaticMarkup(React.createElement(SitePreview,{document:doc,pageId:doc.pages[0].id,resolveMedia:()=>null}));
  assert.ok(html.includes(doc.brand.name));assert.ok(html.includes(doc.pages[0].sections[0].data.heading));assert.ok(html.includes("Media unavailable"));assert.equal((html.match(/<header/g)||[]).length,1);assert.equal((html.match(/<footer/g)||[]).length,1);assert.ok(!html.includes(doc===field?rescue.brand.name:field.brand.name));
  for(const entry of catalog){const section=createSection(entry.preset,"cross-brand");section.data.heading=doc.brand.name;const html=renderToStaticMarkup(React.createElement(MountedSection,{section,site:doc,resolveMedia:()=>null}));assert.ok(html.includes(doc.brand.name));assert.ok(!html.includes("iframe"));}
 }
});
test("missing provider and empty blocks never report transactions or substitute donor photos",()=>{
 for(const entry of catalog){const section=createSection(entry.preset,"empty");const html=renderToStaticMarkup(React.createElement(MountedSection,{section,site:fixtures[0],resolveMedia:()=>null}));assert.ok(!html.includes("unsplash")&&!html.includes("published")&&!html.includes("<form"));}
});
