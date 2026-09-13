import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('all v8 search entries use shared components and retain filtering',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const name of ['task-work-v8-sidebar','task-browser-v8','workflow-explorer-v8','analysis-audit-v8','workflow-studio-v8']) {
  await page.goto(new URL(`./crystra-${name}.html`,import.meta.url).href);
  for(const kind of ['task','workflow']) {
   const control=page.locator(`[data-section-id=${kind}-search-control]`);
   await control.locator('.wsr-expandable-search-trigger').click();
   const input=control.getByRole('searchbox');await input.fill('zzzz-no-match');
   const rows=page.locator(kind==='task'?'[data-task-row]:visible':'[data-section-id=workflow-current-list] [data-workflow-definition-id]:visible');
   assert.equal(await rows.count(),0,`${name} ${kind} filters`);
   const style=await input.evaluate(el=>{const s=getComputedStyle(el),p=getComputedStyle(el.parentElement);return {outline:s.outlineStyle,border:s.borderWidth,background:p.backgroundColor,edge:p.borderColor}});
   assert.equal(style.outline,'none');assert.equal(style.border,'0px');assert.equal(style.edge,'rgba(255, 255, 255, 0.06)');
   await input.press('Escape');
   assert.equal(await control.locator('.wsr-expandable-search-trigger').getAttribute('aria-expanded'),'false');
  }
  if(name==='task-work-v8-sidebar') {
   await page.goto(new URL('./crystra-task-work-v8-sidebar.html?surface=plan',import.meta.url).href);
   await page.locator('[data-section-id=plan-dag-entry]').click();
   const input=page.locator('[data-section-id=plan-dag-search] input');
   await input.fill('市场');
   assert.ok(await page.locator('[data-dag-node][data-search-match=true]').count()>0);
   assert.equal(await input.locator('..').getAttribute('class'),'wsr-search-surface');assert.equal(await input.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
   await input.fill('');
   assert.equal(await page.locator('[data-dag-node][data-search-match=true]').count(),0);
  }
  if(name.includes('browser')||name.includes('explorer')) {
   const input=page.locator('#browser-search');assert.equal(await input.locator('..').getAttribute('class'),'wsr-search-surface');assert.equal(await input.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');await input.fill('zzzz-no-match');await input.fill('');
  }
  if(name==='analysis-audit-v8') {
   await page.getByRole('tab',{name:'调用追踪',exact:true}).click();
   const input=page.getByRole('searchbox',{name:'Search recorded spans'});await input.fill('zzzz-no-match');assert.equal(await input.locator('..').getAttribute('class'),'wsr-search-surface');assert.equal(await input.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');await input.fill('');
   await page.getByRole('button',{name:'展开调用目录',exact:true}).click();await page.getByRole('searchbox',{name:'搜索调用记录',exact:true}).fill('zzzz-no-match');
   await page.waitForTimeout(400);
   await page.screenshot({path:new URL('./search-v8-analysis.png',import.meta.url).pathname});
  }
 }
 assert.deepEqual(errors,[]);
 } finally {await browser.close();}
});
