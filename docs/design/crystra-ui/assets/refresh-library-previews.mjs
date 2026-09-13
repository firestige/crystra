import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1080},colorScheme:'dark'});
const source=new URL('./library-preview.html',import.meta.url);
const captured=[];
async function shot(name){await page.screenshot({path:fileURLToPath(new URL(`./library-previews/${name}.png`,import.meta.url))});captured.push(name+'.png');}
try {
 await page.goto(source.href);
 for(const [name,title] of Object.entries({expressions:'表达方式',dashboard:'Dashboard 与图表',waterfall:'Trace 瀑布图',tree:'Trace 树图',statistics:'Trace 统计',passport:'Span 与回执详情'})){
  await page.getByRole('button',{name:title,exact:true}).click();await page.waitForTimeout(350);await shot(name);
 }
 await page.getByRole('button',{name:'Dashboard 与图表',exact:true}).click();
 await page.getByRole('button',{name:'Edit dashboard',exact:true}).click();await shot('dashboard-edit');
 const rework=page.locator('.dashboard-panel[data-panel-id="gauge"]');
 await rework.click({button:'right'});await shot('dashboard-context-menu');
 await page.getByRole('menuitemradio',{name:'1×1',exact:true}).click();await page.waitForTimeout(350);await shot('dashboard-compact');
 await page.getByRole('button',{name:'Cancel editing',exact:true}).click();
 await page.getByRole('button',{name:'Edit dashboard',exact:true}).click();await page.waitForTimeout(350);
 const card=page.locator('.dashboard-panel[data-panel-id="value"]');const r=await card.boundingBox();
 await page.mouse.move(r.x+80,r.y+88);await page.mouse.down();await page.mouse.move(r.x+212,r.y+206,{steps:12});await shot('dashboard-ghost');await page.mouse.up();
 await page.getByRole('button',{name:'表达方式',exact:true}).click();
 const trigger=page.locator('[data-icon-role="widget-signal"]').first();await trigger.hover();await page.getByRole('tooltip').waitFor();await shot('widget-tooltip');
 const hashes=Object.fromEntries(captured.map(name=>[name,createHash('sha256').update(readFileSync(new URL('./library-previews/'+name,import.meta.url))).digest('hex')]));
 writeFileSync(new URL('./library-previews/manifest.json',import.meta.url),JSON.stringify({source:'../library-preview.html',sourceSha256:createHash('sha256').update(readFileSync(source)).digest('hex'),viewport:{width:1920,height:1080},files:hashes},null,2)+'\n');
 console.log(`Refreshed ${captured.length} screenshots`);
} finally {await browser.close();}
