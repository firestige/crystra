import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('setting list activates views while creation and editing stay in a transactional modal',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1680,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review'),list=root.getByRole('list',{name:'观察设置列表'});
 await list.waitFor();assert.equal((await root.getByRole('button',{name:'数据范围',exact:true}).innerText()).trim(),'数据范围');assert.equal(await root.getByRole('textbox',{name:'设置名称',exact:true}).count(),0);
 const cost=root.locator('[data-observation-chart=cost]'),cache=root.locator('[data-observation-chart=cache]');const old=await cost.innerText(),other=await cache.innerText();
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});
 await editor.getByRole('combobox',{name:'X 轴 · 分类',exact:true}).selectOption('model');assert.equal(await cost.innerText(),old);assert.ok((await editor.locator('[data-preview-chart=cost]').innerText()).includes('模型'));await editor.screenshot({path:new URL('./observation-setting-editor-preview.png',import.meta.url).pathname});
 await page.keyboard.press('Escape');assert.equal(await cost.innerText(),old);
 await root.getByRole('button',{name:'修改设置',exact:true}).click();await editor.getByRole('combobox',{name:'X 轴 · 分类',exact:true}).selectOption('model');await editor.getByRole('button',{name:'保存设置',exact:true}).click();
 assert.notEqual(await cost.innerText(),old);assert.equal(await cache.innerText(),other);
 await root.getByRole('button',{name:'数据范围',exact:true}).click();const scope=page.getByRole('dialog',{name:'选择 Delivery',exact:true});await scope.getByRole('button',{name:'取消当前命中',exact:true}).click();await scope.getByRole('checkbox').first().check();await scope.getByRole('button',{name:'应用数据范围',exact:true}).click();
 await list.locator('.wsr-list-main').filter({hasText:/模型与 Role 表现/}).click();assert.ok((await root.getByRole('button',{name:'数据范围',exact:true}).innerText()).includes('已选 1 个'));assert.equal(await root.locator('[data-observation-chart]').count(),1);
 await list.locator('.wsr-list-main').filter({hasText:/版本变更观察/}).click();
 const downloadPromise=page.waitForEvent('download');await root.getByRole('button',{name:'导出设置',exact:true}).click();const path=await(await downloadPromise).path();await root.getByLabel('导入观察设置文件',{exact:true}).setInputFiles(path);await root.getByText('已导入观察设置',{exact:true}).waitFor();assert.equal(await root.locator('[data-observation-chart]').count(),2);
 const count=await list.locator('.wsr-list-main').count();await root.getByRole('button',{name:'新建',exact:true}).click();await editor.getByRole('textbox',{name:'设置名称',exact:true}).fill('未提交设置');await editor.getByRole('button',{name:'取消',exact:true}).click();assert.equal(await list.locator('.wsr-list-main').count(),count);
 await root.getByRole('button',{name:'新建',exact:true}).click();await editor.getByRole('textbox',{name:'设置名称',exact:true}).fill('新观察');await editor.getByRole('button',{name:'添加图表',exact:true}).click();assert.ok(await editor.locator('[data-preview-chart] svg').count()>0);await editor.getByRole('button',{name:'添加数据列',exact:true}).click();await page.getByRole('dialog',{name:'添加数据列',exact:true}).getByRole('button',{name:/实际费用/}).click();await editor.getByRole('button',{name:'保存设置',exact:true}).click();assert.equal(await list.locator('.wsr-list-main').count(),count+1);assert.equal(await root.locator('[data-observation-chart]').count(),1);
 await list.locator('.wsr-list-main').filter({hasText:/版本变更观察/}).first().click();await root.getByRole('button',{name:'数据范围',exact:true}).click();await scope.getByRole('button',{name:'恢复全局范围',exact:true}).click();await scope.getByRole('button',{name:'应用数据范围',exact:true}).click();
 assert.equal((await root.getByRole('button',{name:'数据范围',exact:true}).innerText()).trim(),'数据范围');
 await page.waitForTimeout(200);await root.screenshot({path:new URL('./observation-settings-review.png',import.meta.url).pathname});assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('chart previews switch renderer and stack in fixed columns in source order',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1680,height:1100}});
 await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review');
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});
 await editor.getByRole('combobox',{name:'图形类型',exact:true}).selectOption('multi-line');
 assert.ok(await editor.locator('[data-preview-chart=cost] .structured-series').count()>0);
 await editor.getByRole('combobox',{name:'图形类型',exact:true}).selectOption('heatmap');
 assert.equal(await editor.getByRole('combobox',{name:'图形类型',exact:true}).inputValue(),'heatmap');
 await editor.getByRole('combobox',{name:'图形类型',exact:true}).selectOption('grouped-columns');
 await editor.getByRole('button',{name:'添加图表',exact:true}).click();
 await page.waitForTimeout(250);
 const cards=editor.locator('[data-preview-chart]');assert.equal(await cards.count(),3);
 const first=await cards.nth(0).locator(':scope > *').first().boundingBox(),second=await cards.nth(1).locator(':scope > *').first().boundingBox(),third=await cards.nth(2).locator(':scope > *').first().boundingBox();
 assert.ok(Math.abs(third.x-first.x)<2);const prior=Math.abs(second.x-third.x)<2?second:first;const gap=await editor.locator('.observation-setting-view').evaluate(n=>Math.ceil(parseFloat(getComputedStyle(n).columnGap)));assert.ok(Math.abs(third.y-(prior.y+prior.height+gap))<3);
 await editor.getByRole('combobox',{name:'图形类型',exact:true}).selectOption('grouped-bars');
 await page.waitForTimeout(200);await editor.screenshot({path:new URL('./observation-setting-chart-types.png',import.meta.url).pathname});
 const original=await cards.evaluateAll(nodes=>nodes.map(n=>n.dataset.previewChart));
 await editor.getByRole('list',{name:'图表排序列表'}).locator(`[data-chart-id="${original[2]}"] .wsr-list-main`).focus();await page.keyboard.press('Alt+ArrowUp');assert.deepEqual(await cards.evaluateAll(nodes=>nodes.map(n=>n.dataset.previewChart)),[original[0],original[2],original[1]]);
 await page.keyboard.press('Alt+ArrowDown');assert.deepEqual(await cards.evaluateAll(nodes=>nodes.map(n=>n.dataset.previewChart)),original);
 await editor.getByRole('button',{name:'保存设置',exact:true}).click();assert.deepEqual(await root.locator('[data-observation-chart]').evaluateAll(nodes=>nodes.map(n=>n.dataset.observationChart)),original);

 }finally{await browser.close();}
});

test('compatible metrics share one plot and incompatible additions are disabled',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1680,height:1100}});await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review');
 await root.getByRole('list',{name:'观察设置列表'}).locator('.wsr-list-main').filter({hasText:/模型与 Role 表现/}).click();
 const card=root.locator('[data-observation-chart=latency]');assert.equal(await card.locator('.structured-series').count(),1);assert.equal(await card.locator('.structured-legend > span').count(),4);
 const style=await card.locator('.wsr-card').evaluate(el=>({border:getComputedStyle(el).borderTopColor,radius:getComputedStyle(el).borderTopLeftRadius,shadow:getComputedStyle(el).boxShadow}));console.log('Card surface',style);
 assert.equal(style.border,'rgba(255, 255, 255, 0.06)');assert.equal(style.radius,'12px');assert.notEqual(style.shadow,'none');
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});
 await editor.getByRole('combobox',{name:'图形类型',exact:true}).selectOption('multi-line');
 assert.equal(await editor.locator('[data-preview-chart=latency] .structured-series').count(),1);
 await editor.getByRole('button',{name:'添加数据列',exact:true}).click();const catalog=page.getByRole('dialog',{name:'添加数据列',exact:true});assert.equal(await catalog.getByRole('button',{name:/实际费用/}).isDisabled(),true);assert.equal(await catalog.getByRole('button',{name:/首次输出延时/}).isEnabled(),true);
 await page.keyboard.press('Escape');await page.waitForTimeout(150);await editor.screenshot({path:new URL('./observation-single-plot-preview.png',import.meta.url).pathname});
 }finally{await browser.close();}
});

test('chart-specific mappings render a matrix, radar and area without result tables',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1680,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review');
 await root.getByRole('list',{name:'观察设置列表'}).locator('.wsr-list-main').filter({hasText:/矩阵与多系列观察/}).click();
 assert.equal(await root.locator('table').count(),0);assert.equal(/\d+\.\d{3,}/.test(await root.innerText()),false);
 assert.equal(await root.locator('[data-observation-chart=matrix] .expression-matrix-row').count(),2);
 assert.equal(await root.locator('[data-observation-chart=matrix] .expression-matrix-row > div').count(),4);
 assert.equal(await root.locator('[data-observation-chart=radar] .expression-radar-body').count(),1);
 assert.ok(await root.locator('[data-observation-chart=area] [data-area-fill]').count()>0);
 await root.screenshot({path:new URL('./observation-chart-mappings.png',import.meta.url).pathname});
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});
 assert.equal(await editor.getByRole('combobox',{name:'列维度',exact:true}).inputValue(),'model');assert.equal(await editor.getByRole('combobox',{name:'行维度',exact:true}).inputValue(),'role');
 await editor.getByRole('button',{name:'模型延时分布',exact:true}).click();await editor.getByText('指标轴',{exact:true}).waitFor();assert.equal(await editor.getByRole('combobox',{name:'比较对象',exact:true}).inputValue(),'model');
 assert.equal(await editor.getByRole('combobox',{name:'图表表达',exact:true}).count(),0);assert.equal(await editor.locator('table').count(),0);
 await editor.screenshot({path:new URL('./observation-chart-mapping-editor.png',import.meta.url).pathname});assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('three editor columns allow list drag sorting and chart headers own legends',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1880,height:1150}});await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review');
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});
 const list=editor.getByRole('list',{name:'图表排序列表'});await list.waitFor({timeout:2000});
 const first=await list.boundingBox(),middle=await editor.getByRole('region',{name:'图表设置',exact:true}).boundingBox(),last=await editor.getByRole('region',{name:'设置图表预览',exact:true}).boundingBox();assert.ok(first.x+first.width<=middle.x);assert.ok(middle.x+middle.width<=last.x);
 await list.locator('[data-chart-id=cache]').dragTo(list.locator('[data-chart-id=cost]'));
 assert.deepEqual(await editor.locator('[data-preview-chart]').evaluateAll(nodes=>nodes.map(n=>n.dataset.previewChart)),['cache','cost']);
 await list.getByRole('button',{name:'版本费用',exact:true}).click();await editor.getByRole('textbox',{name:'图表标题',exact:true}).fill('我的费用比较');
 const card=editor.locator('[data-preview-chart=cost]');await card.getByRole('heading',{name:'我的费用比较',exact:true}).waitFor();assert.equal(await card.locator('.wsr-card-actions .structured-legend').count(),1);assert.equal(await card.locator('.wsr-card-content .structured-legend').count(),0);assert.ok(!(await card.innerText()).includes('Workflow 版本 × Role'));
 assert.ok((await card.locator('.structured-series > svg').textContent()).includes('Workflow 版本'));
 await editor.screenshot({path:new URL('./observation-three-column-editor.png',import.meta.url).pathname});
 await editor.getByRole('button',{name:'保存设置',exact:true}).click();assert.deepEqual(await root.locator('[data-observation-chart]').evaluateAll(nodes=>nodes.map(n=>n.dataset.observationChart)),['cache','cost']);
 }finally{await browser.close();}
});

test('responsive columns stack independently and charts can be deleted through an empty draft',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1880,height:1150}});await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review');
 await root.getByRole('list',{name:'观察设置列表'}).locator('.wsr-list-main').filter({hasText:/矩阵与多系列观察/}).click();await page.waitForTimeout(200);
 const cardBox=id=>root.locator(`[data-observation-chart=${id}] > .wsr-card`).boundingBox();const first=await cardBox('matrix'),second=await cardBox('radar'),third=await cardBox('area');const ticks=await root.locator('[data-observation-chart=area] .structured-series text').evaluateAll(nodes=>nodes.filter(n=>/^2026-/.test(n.textContent)).map(n=>({x:n.getBoundingClientRect().x,right:n.getBoundingClientRect().right})));assert.ok(ticks.length>=2);assert.ok(ticks.slice(1).every((t,i)=>t.x>=ticks[i].right));assert.ok(first.width>=480&&first.width<=640);assert.ok(second.width>=480&&second.width<=640);assert.ok(third.width>=480&&third.width<=640);assert.ok(Math.abs(third.x-first.x)<1);const previous=Math.abs(first.x-second.x)<1?second:first;assert.ok(Math.abs(third.y-previous.y-previous.height-Math.ceil(await root.locator('.observation-setting-view').first().evaluate(n=>parseFloat(getComputedStyle(n).columnGap))))<2);
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});assert.equal(await editor.getByRole('combobox',{name:'图表宽度',exact:true}).count(),0);
 const list=editor.getByRole('list',{name:'图表排序列表'});await list.getByRole('button',{name:'删除图表 模型 × Role 缓存命中率',exact:true}).click();assert.equal(await editor.locator('[data-preview-chart=matrix]').count(),0);assert.equal(await editor.getByRole('textbox',{name:'图表标题',exact:true}).inputValue(),'模型延时分布');
 await list.getByRole('button',{name:'删除图表 模型延时分布',exact:true}).click();await list.getByRole('button',{name:'删除图表 每日费用',exact:true}).click();assert.equal(await editor.locator('[data-preview-chart]').count(),0);await editor.getByText('选择或添加图表',{exact:true}).waitFor();
 await editor.getByRole('button',{name:'取消',exact:true}).click();assert.equal(await root.locator('[data-observation-chart]').count(),3);
 await root.getByRole('button',{name:'修改设置',exact:true}).click();await list.getByRole('button',{name:'删除图表 模型 × Role 缓存命中率',exact:true}).click();await editor.getByRole('button',{name:'保存设置',exact:true}).click();assert.equal(await root.locator('[data-observation-chart]').count(),2);
 }finally{await browser.close();}
});

test('observation settings can be deleted through empty state and recreated',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1680,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review'),list=root.getByRole('list',{name:'观察设置列表'});
 assert.equal(await root.getByRole('group',{name:'观察设置操作'}).getByRole('button',{name:/删除/}).count(),0);await list.getByRole('button',{name:'删除设置 矩阵与多系列观察',exact:true}).click({timeout:2000});await root.locator('.observation-view-header').getByRole('heading',{name:'版本变更观察',exact:true}).waitFor();await list.getByRole('button',{name:'删除设置 版本变更观察',exact:true}).click();assert.equal(await list.locator('.wsr-list-main').count(),1);await root.locator('.observation-view-header').getByRole('heading',{name:'模型与 Role 表现',exact:true}).waitFor();
 await list.getByRole('button',{name:'删除设置 模型与 Role 表现',exact:true}).click();assert.equal(await list.locator('.wsr-list-main').count(),0);await root.getByText('新建或导入观察设置以开始对比分析。',{exact:true}).waitFor();assert.equal(await root.locator('[data-observation-chart]').count(),0);
 for(const name of ['修改设置','导出设置'])assert.equal(await root.getByRole('button',{name,exact:true}).isDisabled(),true);
 assert.equal(await root.getByRole('button',{name:'导入设置',exact:true}).isEnabled(),true);
 await root.getByRole('button',{name:'新建',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});await editor.getByRole('textbox',{name:'设置名称',exact:true}).fill('重新开始');await editor.getByRole('button',{name:'保存设置',exact:true}).click();assert.equal(await list.locator('.wsr-list-main').count(),1);assert.equal(await list.getByRole('button',{name:'删除设置 重新开始',exact:true}).isEnabled(),true);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('chart cards have a distinct surface above their workspace in page and editor',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1680,height:1100}});await page.goto(new URL('./component-preview.html',import.meta.url).href);const root=page.locator('#result-analysis-review');
 const colors=await root.evaluate(el=>{const chart=el.querySelector('[data-observation-chart] .wsr-card');return {parent:getComputedStyle(el.querySelector(':scope > .wsr-card')).backgroundColor,card:getComputedStyle(chart).backgroundColor,shadow:getComputedStyle(chart).boxShadow,border:getComputedStyle(chart).borderColor};});console.log('Chart elevation',colors);assert.notEqual(colors.card,colors.parent);assert.notEqual(colors.shadow,'none');assert.equal(colors.border,'rgba(255, 255, 255, 0.06)');
 await root.getByRole('button',{name:'修改设置',exact:true}).click();const editor=page.getByRole('dialog',{name:'编辑观察设置',exact:true});const surfaces=await editor.evaluate(el=>({parent:getComputedStyle(el.querySelector(':scope > .wsr-card')).backgroundColor,card:getComputedStyle(el.querySelector('[data-preview-chart] .wsr-card')).backgroundColor}));assert.notEqual(surfaces.card,surfaces.parent);await editor.screenshot({path:new URL('./observation-card-surfaces.png',import.meta.url).pathname});
 }finally{await browser.close();}
});
