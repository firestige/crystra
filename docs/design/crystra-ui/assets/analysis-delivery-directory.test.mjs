import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('Analysis uses shared Delivery directory and clears stale traces',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('./crystra-analysis-audit-v8.html?view=traces',import.meta.url).href);
 const trace=page.locator('[data-section-id=trace-reconstruction]');
 await page.waitForFunction(()=>document.querySelector('[data-section-id=trace-reconstruction]')?.dataset.deliveryId==='delivery-0001');
 await page.getByRole('button',{name:'展开调用目录',exact:true}).click();
 const directory=page.getByRole('region',{name:'Delivery 检索目录',exact:true});
 await directory.getByText('42 条命中',{exact:true}).waitFor();
 assert.equal(await directory.locator('.obs-task-group').count(),0);
 await directory.locator('[data-delivery-id=delivery-0002] button').click();
 assert.equal(await trace.getAttribute('data-delivery-id'),'delivery-0002');
 await page.getByRole('button',{name:'树图',exact:true}).click();
 assert.equal(await trace.getAttribute('data-trace-id'),'00000000000000000000000000000002');
 await directory.getByRole('combobox',{name:'检索字段',exact:true}).selectOption('deliveryId');
 const input=directory.getByRole('searchbox',{name:'检索值',exact:true});await input.fill('missing');await input.press('Enter');
 await directory.getByText('0 条命中',{exact:true}).waitFor();assert.equal(await trace.getAttribute('data-trace-id'),null);
 await input.fill('');await input.press('Enter');await directory.getByText('42 条命中',{exact:true}).waitFor();
 await directory.getByRole('button',{name:'筛选当前结果',exact:true}).click();
 await directory.getByRole('combobox',{name:'结果中的版本',exact:true}).selectOption('v3');
 await directory.getByText('11 条命中',{exact:true}).waitFor();
 await page.waitForTimeout(350);await page.screenshot({path:new URL('./analysis-delivery-directory.png',import.meta.url).pathname});
 assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
