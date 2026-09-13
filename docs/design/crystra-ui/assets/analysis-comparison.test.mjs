import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('comparison keeps multiple metrics visible and uses selected Delivery sources',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('./crystra-analysis-audit-v8.html?view=reports',import.meta.url).href);
 const view=page.locator('[data-section-id=research-report]');
 await page.getByRole('tab',{name:'对比分析',exact:true}).waitFor();
 assert.equal(await view.locator('.obs-report-chart').count(),2);
 await view.getByRole('checkbox',{name:'单次平均输入 Token',exact:true}).check();
 assert.equal(await view.locator('.obs-report-chart').count(),3);
 await view.getByRole('checkbox',{name:'Engineer',exact:true}).uncheck();
 assert.ok(!(await view.locator('tbody').innerText()).includes('Engineer'));
 await view.getByRole('checkbox',{name:'v2',exact:true}).uncheck();
 assert.ok(!(await view.locator('tbody').innerText()).includes('v2'));
 await view.getByRole('button',{name:/数据源 ·/}).click();
 await view.getByRole('button',{name:'取消全部',exact:true}).click();
 assert.equal(await view.locator('.obs-report-chart').count(),0);
 await view.getByRole('checkbox',{name:/delivery-0001 ·/}).check();
 assert.equal(await view.locator('.obs-report-chart').count(),3);
 assert.equal(await view.locator('tbody tr').count(),2);
 await view.getByRole('textbox',{name:'分析名称',exact:true}).fill('Delivery 对比');
 await view.getByRole('button',{name:'保存分析',exact:true}).click();
 await view.getByRole('combobox',{name:'工作流',exact:true}).selectOption('workflow-review');
 assert.ok(!(await view.locator('tbody').innerText()).includes('delivery-0001'));
 await view.getByRole('button',{name:'Delivery 对比',exact:true}).click();
 assert.equal(await view.getByRole('combobox',{name:'工作流',exact:true}).inputValue(),'workflow-implementation');
 assert.equal(await view.locator('tbody tr').count(),2);
 await page.screenshot({path:new URL('./analysis-comparison-v8.png',import.meta.url).pathname});
 assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
