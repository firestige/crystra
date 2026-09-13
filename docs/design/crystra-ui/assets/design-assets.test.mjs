import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
const url=new URL('./crystra-task-work-v8-sidebar.html',import.meta.url).href;
test('accepted design has no preview selectors and old preview query params cannot change it',async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const p=await b.newPage({viewport:{width:1920,height:940}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url+'?surface=gate&typography=comfortable&colors=original',{waitUntil:'networkidle'});
  assert.equal(await p.locator('#type-preview,#color-preview,input[name="type-candidate"],input[name="color-palette"]').count(),0);
  assert.equal(await p.locator('[data-section-id="gate-decision-question-title"]').evaluate(e=>getComputedStyle(e).fontSize),'18px');
  assert.equal(await p.locator('[data-section-id="gate-decision-state"]').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(35, 35, 36)');
  const input=await p.locator('[data-section-id="input-stream"]').elementHandle();
  await p.locator('input[name="control-surface"][value="delivery"]').check({force:true});
  assert.equal(await input.evaluate(e=>e.isConnected),true);assert.deepEqual(errors,[]);
 }finally{await b.close();}
});
test('standalone design assets render the accepted typography and colors without Tailwind',async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(new URL('./design-system/index.html',import.meta.url).href,{waitUntil:'networkidle'});
  assert.equal(await p.locator('[data-type="page-title"]').first().evaluate(e=>getComputedStyle(e).fontSize),'24px');
  assert.equal(await p.locator('[data-swatch="background-card"]').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(35, 35, 36)');
  assert.equal(await p.locator('[data-swatch="status-success-solid"]').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(34, 197, 94)');
  assert.equal(await p.locator('script').count(),0);assert.deepEqual(errors,[]);
 }finally{await b.close();}
});
