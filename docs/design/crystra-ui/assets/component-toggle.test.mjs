import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import test from 'node:test';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
test('Toggle / Switch preview supports keyboard, sliding state, two shapes and disabled samples',async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1080}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('./component-preview.html',import.meta.url).href);
  const plain=page.getByRole('switch',{name:'圆角 · 纯滑块 A',exact:true});
  await plain.focus();await page.keyboard.press('Space');
  assert.equal(await plain.getAttribute('aria-checked'),'true');
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.wsr-toggle-switch .wsr-switch-thumb')).transform.includes('22'));
  await page.keyboard.press('Enter');assert.equal(await plain.getAttribute('aria-checked'),'false');
  const choice=page.locator('.wsr-toggle-switch[data-shape=square][data-mode=choice]').first();
  await choice.click();assert.equal(await choice.getAttribute('data-checked'),'true');
  assert.equal(await choice.locator('svg').count(),2);
  await choice.click();
  assert.equal(await page.locator('.wsr-toggle-switch[data-shape=round]').count(),6);
  assert.equal(await page.locator('.wsr-toggle-switch[data-shape=square]').count(),6);
  await page.getByLabel('禁用',{exact:true}).check();
  assert.equal(await page.locator('.wsr-toggle-switch:disabled').count(),12);
  await page.getByLabel('禁用',{exact:true}).uncheck();
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await plain.locator('.wsr-switch-thumb').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  assert.deepEqual(errors,[]);
  const panel=page.locator('.wsr-card').filter({has:page.getByRole('heading',{name:'Toggle / Switch',exact:true})});
  await panel.screenshot({path:new URL('./component-toggle-preview.png',import.meta.url).pathname});
 }finally{await browser.close();}
});
