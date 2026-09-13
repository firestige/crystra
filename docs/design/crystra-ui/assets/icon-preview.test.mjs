import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));const {chromium}=require('playwright');
const url=new URL('./crystra-task-work-v8-sidebar.html',import.meta.url).href;
test('icon candidates unify copy and tool sizes without resetting page context or changing accepted typography',async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{const p=await b.newPage({viewport:{width:1920,height:940}});p.setDefaultTimeout(5000);const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url+'?surface=gate',{waitUntil:'networkidle'});
 const input=await p.locator('[data-section-id="input-stream"]').elementHandle();await p.locator('#icon-preview summary').click();
 for(const [name,size,hit] of [['compact','14px','28px'],['balanced','16px','32px'],['prominent','18px','36px']]){
  await p.locator(`input[name="icon-candidate"][value="${name}"]`).check();
  assert.equal(await p.locator('[data-section-id="task-search-action"] svg').evaluate(e=>getComputedStyle(e).width),size);
  assert.equal(await p.locator('[data-section-id="execution-wave-copy-plan-run"] [data-copy-icon]').evaluate(e=>getComputedStyle(e).width),size);
  assert.equal(await p.locator('[data-section-id="execution-wave-copy-plan-run"]').evaluate(e=>getComputedStyle(e).width),hit);
  assert.equal(await p.locator('[data-section-id="gate-decision-question-title"]').evaluate(e=>getComputedStyle(e).fontSize),'18px');
  assert.equal(await p.locator('input[name="control-surface"]:checked').inputValue(),'gate');assert.equal(await input.evaluate(e=>e.isConnected),true);
 }
 await p.locator('input[name="icon-candidate"][value="original"]').check();
 assert.equal(await p.locator('[data-section-id="execution-wave-copy-plan-run"] [data-copy-icon]').evaluate(e=>getComputedStyle(e).width),'15px');
 await p.locator('input[name="icon-candidate"][value="balanced"]').check();await p.keyboard.press('Escape');assert.equal(await p.locator('#icon-preview').getAttribute('open'),null);
 await p.locator('[data-section-id="sidebar-toggle"]').click();await p.waitForTimeout(400);
 assert.equal(await p.locator('[data-section-id="sidebar-rail-tasks"]').evaluate(e=>getComputedStyle(e).width),'40px');assert.deepEqual(errors,[]);
 }finally{await b.close();}
});
