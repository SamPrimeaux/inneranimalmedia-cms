import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),app=resolve(root,'apps/cms-studio-portable'),output=resolve(root,'examples/revise-foundation/public/library/evidence/cms-studio');
if(!existsSync(resolve(app,'node_modules/.bin/vite')))throw new Error('Install Studio dependencies: npm ci --prefix apps/cms-studio-portable --ignore-scripts');
rmSync(output,{recursive:true,force:true});
execFileSync('npm',['run','build','--','--base','/library/evidence/cms-studio/','--outDir',output,'--emptyOutDir'],{cwd:app,stdio:'inherit'});
if(!readFileSync(resolve(output,'index.html'),'utf8').includes('/library/evidence/cms-studio/assets/')||!readdirSync(resolve(output,'assets')).some(name=>name.endsWith('.js')))throw new Error('Compiled Studio evidence missing');
console.log('Studio source-backed evidence ready');
