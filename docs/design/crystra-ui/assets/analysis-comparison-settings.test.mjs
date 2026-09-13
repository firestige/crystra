import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('Analysis v8 reuses approved comparison settings and global time scope',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(new URL('./crystra-analysis-audit-v8.html?view=reports&period=30d',import.meta.url).href);
 const root=page.locator('#result-analysis-review');await root.waitFor({timeout:2500});const ghost=await root.getByRole('button',{name:'修改设置',exact:true}).evaluate(el=>({border:getComputedStyle(el).borderColor,bg:getComputedStyle(el).backgroundColor}));assert.equal(ghost.border,'rgba(0, 0, 0, 0)');assert.equal(ghost.bg,'rgba(0, 0, 0, 0)');assert.equal(await page.getByRole('combobox',{name:'观察范围',exact:true}).count(),0);assert.equal(await root.locator('table').count(),0);
 await root.getByRole('button',{name:'数据范围',exact:true}).click();const scope=page.getByRole('dialog',{name:'选择 Delivery',exact:true});await scope.getByText(/全局范围：.*48 个 Delivery/).waitFor();await scope.getByRole('button',{name:'取消当前命中',exact:true}).click();await scope.getByRole('checkbox').first().check();await scope.getByRole('button',{name:'应用数据范围',exact:true}).click();
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});await editor.getByRole('textbox',{name:'图表标题',exact:true}).fill('v8 费用观察');await editor.getByRole('button',{name:'保存设置',exact:true}).click();
 await page.getByRole('tab',{name:'总览',exact:true}).click();await page.getByRole('tab',{name:'对比分析',exact:true}).click();await root.getByRole('heading',{name:'v8 费用观察',exact:true}).waitFor();assert.ok((await root.getByRole('button',{name:'数据范围',exact:true}).innerText()).includes('已选 1 个'));
 await root.getByRole('button',{name:'数据范围',exact:true}).click();await scope.getByRole('button',{name:'恢复全局范围',exact:true}).click();await scope.getByRole('button',{name:'应用数据范围',exact:true}).click();
 await page.getByRole('button',{name:'选择日期范围',exact:true}).click();await page.getByRole('button',{name:'最近 7 天',exact:true}).click();await root.getByRole('button',{name:'数据范围',exact:true}).click();await scope.getByText(/全局范围：.*42 个 Delivery/).waitFor();await page.keyboard.press('Escape');
 for(const width of [1440,1920,2560]){await page.setViewportSize({width,height:1100});await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const widths=await root.locator('.observation-chart-card').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width));assert.ok(widths.every(w=>w>=479.9&&w<=640.1));const geometry=await root.locator('.observation-setting-view').first().evaluate(grid=>{const box=grid.getBoundingClientRect(),cards=[...grid.children].map(n=>n.getBoundingClientRect());return {left:Math.min(...cards.map(n=>n.left))-box.left,right:box.width-(Math.min(...cards.map(n=>n.left))-box.left)-getComputedStyle(grid).gridTemplateColumns.split(' ').reduce((sum,n)=>sum+parseFloat(n),0)-(getComputedStyle(grid).gridTemplateColumns.split(' ').length-1)*parseFloat(getComputedStyle(grid).columnGap),gap:parseFloat(getComputedStyle(grid).columnGap),columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,width:box.width};});assert.ok(Math.abs(geometry.left-geometry.right)<2);assert.ok(geometry.left>geometry.gap);assert.equal(geometry.columns,geometry.width>=2080?4:geometry.width>=1566?3:geometry.width>=1044?2:1);}
 await root.getByRole('list',{name:'观察设置列表'}).locator('.wsr-list-main').filter({hasText:'矩阵与多系列观察'}).click();await page.screenshot({path:new URL('./analysis-comparison-v8.png',import.meta.url).pathname});await root.getByRole('button',{name:'修改设置',exact:true}).click();await editor.screenshot({path:new URL('./analysis-comparison-editor-v8.png',import.meta.url).pathname});assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('comparison dialogs center with a backdrop and settings sidebar animates with whole-row actions',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1100}});await page.goto(new URL('./crystra-analysis-audit-v8.html?view=reports',import.meta.url).href);const root=page.locator('#result-analysis-review');
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});const modal=await editor.evaluate(el=>{const r=el.getBoundingClientRect(),b=getComputedStyle(el,'::backdrop');return {cx:r.x+r.width/2,cy:r.y+r.height/2,bg:b.backgroundColor,opacity:b.opacity,modal:el.matches(':modal')};});console.log('Modal placement',modal);assert.ok(modal.modal);assert.ok(Math.abs(modal.cx-960)<2);assert.ok(Math.abs(modal.cy-550)<2);assert.notEqual(modal.bg,'rgba(0, 0, 0, 0)');assert.notEqual(modal.opacity,'0');await page.screenshot({path:new URL('./analysis-comparison-modal-centered.png',import.meta.url).pathname});await page.keyboard.press('Escape');
 const list=root.getByRole('list',{name:'观察设置列表'}),row=list.locator('.wsr-list-item').first();const rowStyle=await row.evaluate(el=>({bg:getComputedStyle(el).backgroundColor,main:getComputedStyle(el.querySelector('.wsr-list-main')).backgroundColor,contains:el.contains(el.querySelector('.wsr-list-actions button'))}));assert.ok(rowStyle.contains);assert.notEqual(rowStyle.bg,'rgba(0, 0, 0, 0)');assert.equal(rowStyle.main,'rgba(0, 0, 0, 0)');
 const other=list.locator('.wsr-list-item').nth(1);await other.locator('.wsr-list-actions button').last().hover();await page.waitForFunction(()=>getComputedStyle(document.querySelector('#result-analysis-review .result-analysis-config .wsr-list-item:nth-child(2)')).backgroundColor!=='rgba(0, 0, 0, 0)');assert.notEqual(await other.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
 const sidebar=root.getByRole('complementary',{name:'观察设置目录',includeHidden:true});const before=await sidebar.boundingBox();assert.ok(before.width>300);assert.equal(await sidebar.evaluate(el=>getComputedStyle(el).borderRightWidth),'1px');
 await root.getByRole('button',{name:'收起观察设置',exact:true}).click();await page.waitForTimeout(100);const mid=await sidebar.boundingBox();assert.ok(mid.width>0&&mid.width<before.width);assert.equal(await sidebar.evaluate(el=>el.inert),true);await page.waitForTimeout(350);assert.ok((await sidebar.boundingBox()).width<2);
 await root.getByRole('button',{name:'展开观察设置',exact:true}).click();await page.waitForTimeout(100);const opening=await sidebar.boundingBox();assert.ok(opening.width>0&&opening.width<before.width);await page.waitForTimeout(350);assert.ok(Math.abs((await sidebar.boundingBox()).width-before.width)<2);assert.equal(await sidebar.evaluate(el=>el.inert),false);
 await page.emulateMedia({reducedMotion:'reduce'});assert.ok(await root.locator('.result-analysis-layout').evaluate(el=>getComputedStyle(el).transitionDuration.split(',').every(value=>parseFloat(value)<.001)));
 }finally{await browser.close();}
});

test('metric references are read-only and selected token columns map to chart values',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1100}});
 await page.goto(new URL('./crystra-analysis-audit-v8.html?view=reports',import.meta.url).href);
 const root=page.locator('#result-analysis-review');await root.getByRole('button',{name:'修改设置',exact:true}).click();
 const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});await editor.getByRole('button',{name:'添加图表',exact:true}).click();
 await editor.getByRole('button',{name:'添加数据列',exact:true}).click();const catalog=page.getByRole('dialog',{name:'添加数据列',exact:true});
 assert.equal(await catalog.getByRole('button').filter({hasText:' · '}).count(),9);
 await catalog.getByRole('button',{name:'输入 Token 数 · Token',exact:true}).click();
 await editor.getByRole('button',{name:'添加数据列',exact:true}).click();await catalog.getByRole('button',{name:'输出 Token 数 · Token',exact:true}).click();
 assert.equal(await editor.locator('[data-analysis-item] input').count(),0);
 await editor.getByRole('combobox',{name:'X 轴 · 分类',exact:true}).selectOption('model');
 await editor.getByRole('checkbox',{name:'输出 Token 数',exact:true}).uncheck();
 const preview=editor.locator('[data-preview-chart]').last();await page.waitForTimeout(150);
 assert.ok((await preview.innerText()).includes('输入 Token 数'));assert.ok(!(await preview.innerText()).includes('输出 Token 数'));
 await editor.screenshot({path:new URL('./analysis-metric-mapping-v8.png',import.meta.url).pathname});
 await editor.getByRole('button',{name:'保存设置',exact:true}).click();
 }finally{await browser.close();}
});

test('each setting edits its own draft with edit positioned before delete',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1100}});
 await page.goto(new URL('./crystra-analysis-audit-v8.html?view=reports',import.meta.url).href);
 const root=page.locator('#result-analysis-review');
 const edit=root.getByRole('button',{name:'编辑设置 模型与 Role 表现',exact:true});
 const remove=root.getByRole('button',{name:'删除设置 模型与 Role 表现',exact:true});
 const e=await edit.boundingBox(),d=await remove.boundingBox();assert.ok(e.x+e.width<=d.x);
 await edit.click();const dialog=page.getByRole('dialog',{name:'编辑观察设置',exact:true});
 assert.equal(await dialog.getByRole('textbox',{name:'设置名称',exact:true}).inputValue(),'模型与 Role 表现');
 await dialog.getByRole('button',{name:'取消',exact:true}).click();
 assert.equal(await root.locator('.observation-view-header h3').innerText(),'版本变更观察');
 await edit.click();await dialog.getByRole('textbox',{name:'设置名称',exact:true}).fill('模型观察更新');await dialog.getByRole('button',{name:'保存设置',exact:true}).click();
 assert.equal(await root.locator('.observation-view-header h3').innerText(),'模型观察更新');
 }finally{await browser.close();}
});
