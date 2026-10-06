import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
const repo = resolve(fileURLToPath(new URL("..",import.meta.url)));
const out = resolve(process.argv[2] || "/tmp/iam-cms-gallery-fresh-consumer");
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const packDir = resolve(out,"packs");
fs.mkdirSync(packDir,{recursive:true});
for(const name of ["site-contracts","section-library"]) {
  execFileSync("npm",["pack",resolve(repo,"packages",name),"--pack-destination",packDir,"--silent"],{stdio:"pipe"});
}
const files = fs.readdirSync(packDir).filter((f)=>f.endsWith(".tgz")).map((f)=>resolve(packDir,f));
if(files.length!==2) throw new Error("Expected two packed standalone dependencies");
const consumer = resolve(out,"consumer");
fs.mkdirSync(consumer,{recursive:true});
fs.copyFileSync(resolve(repo,"examples/portability-gallery-consumer/consumer.mjs"),resolve(consumer,"consumer.mjs"));
fs.writeFileSync(resolve(consumer,"package.json"),'{"name":"independent-gallery-consumer","private":true,"type":"module"}\n');
execFileSync("npm",["install","--no-save","--no-audit","--no-fund","--ignore-scripts",...files],
  {cwd:consumer,stdio:"pipe"});
const proof = execFileSync("node",["consumer.mjs"],{cwd:consumer,encoding:"utf8"}).trim();
const receipt = JSON.parse(proof);
if(!receipt.ok) throw new Error("Consumer proof failed");
console.log(JSON.stringify({ok:true,consumer_path:consumer,packs:files.map((x)=>basename(x)),receipt},null,2));
