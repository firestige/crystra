import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const bi=fileURLToPath(new URL('../../../../wsr-ui/packages/bi/',import.meta.url));
const assets=fileURLToPath(new URL('./',import.meta.url));
for(const [entry,out] of [['search-bridge.html','dist-search-bridge'],['components.html','dist-components'],['workbench-preview.html','dist-workbench-preview']]) {
 execFileSync('../../node_modules/.bin/vite',['build','--config','vite.components.config.ts','--outDir',out],{cwd:bi,env:{...process.env,CRYSTRA_PREVIEW_ENTRY:entry},stdio:'inherit'});
}
for(const script of ['build-task-browser.mjs','build-workflow-explorer.mjs','build-workbench-pages.mjs']) execFileSync(process.execPath,[script],{cwd:assets,stdio:'inherit'});
execFileSync(process.execPath,[fileURLToPath(new URL('../../../../wsr-ui/scripts/export-component-preview.ts',import.meta.url)),fileURLToPath(new URL('component-preview.html',import.meta.url))],{stdio:'inherit'});
