import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try {
 for(const width of [1440,1920,2560]) {
  const page=await browser.newPage({viewport:{width,height:1080}});const samples=[];
  for(const kind of ['analysis-audit','workflow-studio']) {
   await page.goto(new URL(`crystra-${kind}-v8.html`,import.meta.url).href);
   await page.locator('[data-header-slot=navigation] [role=tab]').first().waitFor();
   samples.push(await page.locator('[data-section-id=workspace-header]').evaluate(h=>{
    const nav=h.querySelector('[role=tablist]'),tab=nav.querySelector('[role=tab]'),s=getComputedStyle(tab),n=nav.getBoundingClientRect(),r=h.getBoundingClientRect();
    return {navX:n.x-r.x,navBottom:n.bottom-r.bottom,height:r.height,font:s.fontSize,padding:s.padding,bg:s.backgroundColor,line:getComputedStyle(tab,'::after').height,gap:getComputedStyle(nav).gap};
   }));
   if(kind==='workflow-studio') {
    const nav=page.locator('[data-header-slot=navigation]');await nav.getByRole('tab',{name:'结晶分析',exact:true}).click();assert.equal(await nav.getByRole('tab',{name:'结晶分析',exact:true}).getAttribute('aria-selected'),'true');assert.equal(new URL(page.url()).searchParams.get('view'),'crystallization');
    await nav.getByRole('tab',{name:'流程设计',exact:true}).click();
    if(width===1920)await page.screenshot({path:new URL('workflow-studio-header-aligned-v8.png',import.meta.url).pathname});
   }
  }
  assert.deepEqual(samples[1],samples[0]);console.log(width,samples[1]);await page.close();
 }
}finally{await browser.close();}
