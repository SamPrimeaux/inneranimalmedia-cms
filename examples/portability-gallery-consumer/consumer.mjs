import assert from "node:assert/strict";
import fs from "node:fs";
import { join } from "node:path";
import { bindSiteDocument } from "@inneranimalmedia/site-contracts";
import { renderSection } from "@inneranimalmedia/section-library";

// This customer/consumer is intentionally unrelated to the historical donor.
// It uses the same renderer package, but its own content records and assets.
const definitions = [
  { id: "gallery", version: 1, fields: [
    { key:"heading", type:"text", required:true },
    { key:"intro", type:"text" },
    { key:"items", type:"entry", referenceType:"gallery-item", list:true },
  ] },
  { id: "gallery-item", version:1, fields: [
    { key:"title", type:"text", required:true },
    { key:"caption", type:"text" },
    { key:"category", type:"text", required:true },
    { key:"media", type:"asset", required:true },
  ] },
];
const entries = [
  { id:"portfolio-gallery", definitionId:"gallery", definitionVersion:1, fields:{
    heading:"Independent Architecture Journal",
    intro:"A new customer, new records, and new media — original gallery design.",
    items:[
      { kind:"entry", id:"project-plaza", type:"gallery-item" },
      { kind:"entry", id:"project-studio", type:"gallery-item" },
      { kind:"entry", id:"project-garden", type:"gallery-item" },
    ],
  } },
  { id:"project-plaza", definitionId:"gallery-item", definitionVersion:1, fields:{
    title:"Evening Plaza", caption:"Civic spaces", category:"urban", media:{kind:"asset",key:"evening-plaza"},
  } },
  { id:"project-studio", definitionId:"gallery-item", definitionVersion:1, fields:{
    title:"Material Studio", caption:"Material research", category:"studio", media:{kind:"asset",key:"material-studio"},
  } },
  { id:"project-garden", definitionId:"gallery-item", definitionVersion:1, fields:{
    title:"Rain Garden", caption:"Living landscapes", category:"urban", media:{kind:"asset",key:"rain-garden"},
  } },
];
const doc = {
  schemaVersion:1,id:"northline-journal",theme:"consumer-original",
  brand:{name:"Northline Journal",home:"/",description:"Independent"},
  header:{settings:{sticky:false,pill:false},announcement:{enabled:false,messages:[]},blocks:[]},
  footer:{settings:{background:"paper",copyright:"Northline"},blocks:[]},
  pages:[{id:"home",path:"/",title:"Journal",description:"",sections:[
    {id:"gallery",type:"gallery.filterable-grid",preset:"gallery.filterable-grid@1",
     settings:{surface:"paper"},data:{}},
  ]}],
};
const plan = {schema:"iam.cms.bindings.v1",siteId:"northline-journal",sections:[
  {pageId:"home",sectionId:"gallery",slots:[
    {slot:"heading",entryId:"portfolio-gallery",field:"heading"},
    {slot:"intro",entryId:"portfolio-gallery",field:"intro"},
    {slot:"items",entryId:"portfolio-gallery",field:"items",project:"entry-list"},
  ]},
]};
const bound = bindSiteDocument(doc,plan,entries,definitions);
const section = bound.pages[0].sections[0];
const html = renderSection({
  type:section.type,preset:section.preset,layout:{width:"full",bleed:"none"},data:section.data,
},{
  theme:"northline",
  resolveMedia:(key)=>"/assets/"+encodeURIComponent(key)+".svg",
});
assert.match(html,/Independent Architecture Journal/);
assert.equal((html.match(/class="gallery-item"/g)||[]).length,3);
assert.doesNotMatch(html,/cdn\.shopify\.com|Meauxbility|Sam Primeaux/);
assert.match(html,/shadowrootmode="open"/);
assert.match(html,/data-filter="urban"/);
assert.equal(doc.pages[0].sections[0].data.heading,undefined);

// The content can be edited without changing a renderer or template instance.
const changed = structuredClone(entries);
changed[0].fields.heading = "Updated Without Editing a Section";
const rebound = bindSiteDocument(doc,plan,changed,definitions);
assert.equal(rebound.pages[0].sections[0].data.heading,"Updated Without Editing a Section");

const colors = [
  ["evening-plaza","#1c3947","#d4a27d"],
  ["material-studio","#2b342f","#c5bd98"],
  ["rain-garden","#183b38","#78ac97"],
];
fs.mkdirSync("assets",{recursive:true});
for(const [name,a,b] of colors) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760">'+
    '<defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs>'+
    '<rect width="600" height="760" fill="url(#g)"/>'+
    '<path d="M0 540 180 250 310 480 470 180 600 480V760H0Z" fill="rgba(255,255,255,.16)"/>'+
    '</svg>';
  fs.writeFileSync(join("assets",name+".svg"),svg);
}
const page = '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Northline / Gallery portability</title>'+
  '<style>body{margin:0;font-family:system-ui;background:#e9e6db;color:#223;padding:24px}h2{margin:0 0 12px}</style>'+
  '</head><body><h2>Independent consumer / portable gallery proof</h2>'+
  html+'<script type="module" src="/bootstrap.mjs"></script></body></html>';
fs.writeFileSync("index.html",page);
fs.writeFileSync("bootstrap.mjs",
  'import { defineFilterableGalleryElement } from "./node_modules/@inneranimalmedia/section-library/dist/sections/gallery-filterable.js";\n'+
  'defineFilterableGalleryElement(document);\n'+
  'const gallery=document.querySelector("iam-filterable-gallery");\n'+
  'const root=gallery.shadowRoot;\n'+
  'const before=root.querySelectorAll(".gallery-item:not(.hidden)").length;\n'+
  'root.querySelector("button[data-filter=urban]").click();\n'+
  'const after=root.querySelectorAll(".gallery-item:not(.hidden)").length;\n'+
  'const pressed=root.querySelector("button[data-filter=urban]").getAttribute("aria-pressed");\n'+
  'document.body.dataset.galleryFilterTest=(before===3&&after===2&&pressed==="true")?"pass":"fail";\n');
fs.writeFileSync("acceptance.json",JSON.stringify({
  schema:"iam.gallery-portability-proof.v1",consumer:"northline-journal",
  donor_access_required:false,shopify_runtime_required:false,
  content_entry_count:entries.length,rendered_items:3,
  content_reuse_passed:true,source_css_scoped:true,
  original_preview_pixel_fidelity:"not-yet-verified",
  publication_rollback:"not-yet-verified",
},null,2)+"\n");
console.log(JSON.stringify({ok:true,consumer:"northline-journal",items:3,output:"index.html"}));
