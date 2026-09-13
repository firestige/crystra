import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('search comparison contains only controls and supports visual states',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  await page.goto(new URL('./component-preview.html',import.meta.url).href);
  await page.getByText('展开原有搜索形式（现状对照，非候选）',{exact:true}).click();
  const gallery=page.locator('#search-inventory');
  assert.equal(await gallery.locator('iframe').count(),0);
  assert.equal(await gallery.locator('[data-search-sample]').count(),7);
  for(const id of ['sidebar-task','sidebar-workflow']) {
   const sample=gallery.locator(`[data-search-sample=${id}]`);
   await sample.getByRole('button').click();
   await sample.locator('input').fill('检索');
   await sample.locator('input').press('Escape');
   assert.equal(await sample.locator('input').count(),0);
  }
  for(const input of await gallery.locator('input').all()) { await input.fill('搜索样式'); assert.equal(await input.inputValue(),'搜索样式'); await input.fill(''); }
  const candidate=page.locator('#search-candidate');
  const input=candidate.getByRole('searchbox',{name:'搜索资源',exact:true});
  const surface=input.locator('..');
  const before=await surface.evaluate(el=>getComputedStyle(el).backgroundColor);
  await input.focus();
  await page.waitForTimeout(200);
  const state=await input.evaluate(el=>({outline:getComputedStyle(el).outlineStyle,border:getComputedStyle(el).borderWidth,shadow:getComputedStyle(el).boxShadow,bg:getComputedStyle(el.parentElement).backgroundColor,outer:getComputedStyle(el.parentElement).borderColor}));
  assert.equal(state.outline,'none');assert.equal(state.border,'0px');assert.equal(state.shadow,'none');assert.notEqual(state.bg,before);assert.equal(state.outer,'rgba(255, 255, 255, 0.06)');
  const trigger=candidate.getByRole('button',{name:'搜索任务',exact:true});
  const initialX=(await trigger.boundingBox()).x;
  await trigger.click();
  await page.waitForTimeout(120);
  const middleX=(await trigger.boundingBox()).x;
  await page.waitForTimeout(260);
  const finalX=(await trigger.boundingBox()).x;
  assert.ok(initialX > middleX && middleX > finalX);
  const dismiss=candidate.getByRole('button',{name:'关闭搜索',exact:true});
  await dismiss.focus();
  const dismissStyle=await dismiss.evaluate(el=>{const s=getComputedStyle(el);return [s.borderWidth,s.backgroundColor,s.boxShadow,s.outlineStyle]});
  assert.deepEqual(dismissStyle,['0px','rgba(0, 0, 0, 0)','none','none']);

  await candidate.getByRole('searchbox',{name:'搜索任务',exact:true}).press('Escape');
  await page.waitForTimeout(30);
  assert.equal(await candidate.getByRole('button',{name:'搜索任务',exact:true}).evaluate(el=>el===document.activeElement),true);
  await input.focus();
  await candidate.screenshot({path:new URL('./search-candidate.png',import.meta.url).pathname});
  await gallery.screenshot({path:new URL('./search-preview.png',import.meta.url).pathname});
 } finally {await browser.close();}
});
