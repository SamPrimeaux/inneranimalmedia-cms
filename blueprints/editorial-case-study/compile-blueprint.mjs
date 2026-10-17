#!/usr/bin/env node
// Deterministic blueprint compiler. No database/network writes.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.dirname(fileURLToPath(import.meta.url));
const source=JSON.parse(fs.readFileSync(path.join(root,"editorial-case-study.blueprint.json"),"utf8"));
const [,,brandArg, tokenFileArg,outputDirArg]=process.argv;
if(!brandArg||!tokenFileArg||!outputDirArg){console.error("Usage: node compile-blueprint.mjs BRAND path/to/tokens.json output-dir");process.exit(2)}
const brand=brandArg.toUpperCase();
if(!/^[A-Z][A-Z0-9]{1,5}$/.test(brand))throw Error("BRAND must be 2–6 uppercase alphanumeric chars");
const tokens=JSON.parse(fs.readFileSync(path.resolve(tokenFileArg),"utf8"));
const resolved={...source.tokenContract.defaults,...tokens};
for(const k of source.tokenContract.required)if(!resolved[k]||typeof resolved[k]!=="string")throw Error("Missing token: "+k);
const slug=(value)=>value.replace(/[^a-z0-9-]/gi,"-").replace(/-+/g,"-").toUpperCase();
const sku=(layer,code)=>[brand,layer,slug(code),"V1"].join("-");
const items=[
 ...source.mediaLayouts.map(m=>({kind:"media_layout",key:m.key,sku:sku("MED",m.code),schema:m})),
 ...source.sections.map(s=>({kind:"section",key:s.key,sku:sku("SEC",s.code),schema:s})),
 ...source.pagePresets.map(p=>({kind:"page_preset",key:p.key,sku:sku("PG",p.code),schema:p}))
];
const unique=new Set(items.map(x=>x.sku));if(unique.size!==items.length)throw Error("SKU collision");
const build={schema:"iam.blueprint-build.v1",blueprintKey:source.key,version:source.version,brand,requiredApprovals:source.requiredPipeline,siteTokens:resolved,items,provenance:source.origin,installationStatus:"draft_pending_validation",sourceOfTruth:"git",targetR2Binding:source.storage.bucketBinding};
fs.mkdirSync(path.resolve(outputDirArg),{recursive:true});
fs.writeFileSync(path.resolve(outputDirArg,"manifest.json"),JSON.stringify(build,null,2)+"\n");
fs.writeFileSync(path.resolve(outputDirArg,"inventory.csv"),["sku,kind,key,version,status",...items.map(x=>[x.sku,x.kind,x.key,source.version,"draft"].join(","))].join("\n")+"\n");
fs.writeFileSync(path.resolve(outputDirArg,"tokens.css"),":root{\n"+Object.entries(resolved).map(([k,v])=>"  --iam-"+k.replace(/\./g,"-")+": "+v+";").join("\n")+"\n}\n");
console.log(JSON.stringify({brand,items:items.length,output:path.resolve(outputDirArg),readyToPublish:false}));
