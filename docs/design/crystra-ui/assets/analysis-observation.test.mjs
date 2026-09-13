import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
const url=new URL('./crystra-analysis-audit-v8.html',import.meta.url).href;
function captureConfigurationFiles(page){
 page.on('download',async download=>{const stream=await download.createReadStream();let text='';for await(const chunk of stream)text+=chunk.toString();await page.evaluate(text=>window.__savedText=text,text);});
 page.on('filechooser',async chooser=>{const data=await page.evaluate(()=>({text:window.__fileText,cancel:window.__pickerCancelled}));await chooser.setFiles(data.cancel?[]:[{name:'layout.json',mimeType:'application/json',buffer:Buffer.from(data.text)}]);});
}

test('observation workspace connects overview, comparison settings and exact trace context',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 assert.ok(await page.locator('[data-section-id=observation-dashboard]').isVisible());await page.getByRole('tab',{name:'对比分析',exact:true}).click();assert.ok(await page.locator('[data-section-id=comparison-analysis]').isVisible());assert.equal(await page.locator('[data-section-id=analysis-reports-action]').getAttribute('aria-current'),'page');assert.equal(await page.getByRole('combobox',{name:'观察范围',exact:true}).count(),0);
 await page.getByRole('tab',{name:'调用追踪',exact:true}).click();await page.getByRole('button',{name:'树图',exact:true}).click();assert.ok(await page.getByTestId('trace-tree').isVisible());assert.equal(await page.locator('.trace-statistics').count(),0);
 for(const width of [1920,2560,3840]){await page.setViewportSize({width,height:960});for(const name of ['总览','调用追踪','对比分析']){await page.getByRole('tab',{name,exact:true}).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}}
 await page.goto(url+'?view=traces&plan_run_id=unknown&from_gate_id=G-3');assert.ok(await page.locator('[data-section-id=unresolved-context]').isVisible());assert.equal(await page.locator('[data-section-id=trace-reconstruction]').count(),0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('APM header has two-line identity with adjacent tabs, second-precision range and aligned refresh cadence',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url);
  await page.getByRole('button',{name:'选择日期范围',exact:true}).click();
  await page.getByRole('button',{name:'最近 30 天',exact:true}).click({timeout:3000});
  assert.ok(page.url().includes('period=30d'));
  const header=await page.locator('[data-section-id=workspace-header]').boundingBox();
  const nav=page.getByRole('tablist',{name:'观测工作面'});
  assert.equal(await nav.locator('..').getAttribute('data-appearance'),'underline');
  const tab=await nav.getByRole('tab').first().boundingBox();
  const identity=await page.locator('[data-header-slot=identity]').boundingBox();
  assert.ok(tab.x>=identity.x+identity.width,'navigation is to the right of identity');
  assert.ok(Math.abs(tab.y+tab.height-header.y-header.height)<2,'navigation is flush with header bottom');
  assert.ok(header.height<=90,'header has no third row');
  assert.equal(await page.getByRole('button',{name:'最近 7 天',exact:true}).count(),0);
  assert.equal(await page.getByRole('combobox',{name:'观察范围',exact:true}).count(),0);
  const alignment=await page.locator('.obs-refresh-controls>label').evaluate(el=>{const a=el.querySelector('span').getBoundingClientRect(),b=el.querySelector('select').getBoundingClientRect();return Math.abs(a.y+a.height/2-b.y-b.height/2)});
  assert.ok(alignment<1,'cadence label and value share vertical center');
  await page.getByRole('button',{name:'选择日期范围',exact:true}).click();
  await page.getByLabel('开始时间',{exact:true}).fill('2026-09-10T10:11:12');
  await page.getByLabel('结束时间',{exact:true}).fill('2026-09-08T18:19:20');
  assert.equal(await page.getByRole('button',{name:'应用日期范围',exact:true}).isDisabled(),true);
  await page.getByLabel('开始时间',{exact:true}).fill('2025-09-08T18:19:19');
  assert.equal(await page.getByRole('button',{name:'应用日期范围',exact:true}).isDisabled(),true,'one year plus one second is rejected');
  await page.getByLabel('开始时间',{exact:true}).fill('2025-09-08T18:19:20');
  assert.equal(await page.getByRole('button',{name:'应用日期范围',exact:true}).isDisabled(),false,'exactly one calendar year is allowed');
  await page.getByLabel('开始时间',{exact:true}).fill('2026-09-04T10:11:12');
  await page.getByLabel('结束时间',{exact:true}).fill('2026-09-08T18:19:20');
  assert.ok(page.url().includes('period=30d'),'draft calendar dates do not change active range');
  await page.getByRole('button',{name:'应用日期范围',exact:true}).click();
  assert.equal(new URL(page.url()).searchParams.get('period'),'custom:2026-09-04T10:11:12/2026-09-08T18:19:20');
  await page.getByRole('tab',{name:'对比分析',exact:true}).click();
  await page.locator('#result-analysis-review').getByRole('button',{name:'数据范围',exact:true}).click();assert.ok((await page.getByRole('dialog',{name:'选择 Delivery',exact:true}).innerText()).includes('09/04'));await page.keyboard.press('Escape');
  await page.clock.install();
  await page.getByRole('combobox',{name:'更新周期',exact:true}).selectOption('15');
  const before=await page.locator('[data-refresh-sequence]').getAttribute('data-refresh-sequence');
  await page.clock.fastForward(15000);
  assert.notEqual(await page.locator('[data-refresh-sequence]').getAttribute('data-refresh-sequence'),before);
  await page.getByRole('combobox',{name:'更新周期',exact:true}).selectOption('0');
  const stopped=await page.locator('[data-refresh-sequence]').getAttribute('data-refresh-sequence');
  await page.clock.fastForward(30000);
  assert.equal(await page.locator('[data-refresh-sequence]').getAttribute('data-refresh-sequence'),stopped);
  await page.getByRole('button',{name:'立即刷新',exact:true}).click();
  assert.notEqual(await page.locator('[data-refresh-sequence]').getAttribute('data-refresh-sequence'),stopped);
  await page.goto(url+'?view=traces&period='+encodeURIComponent('custom:2026-09-09T22:08:00/2026-09-09T22:08:01'));
  assert.equal(await page.locator('.delivery-directory [data-delivery-id]').count(),1,'only one Delivery starts in exact second range');
  assert.ok((await page.locator('.delivery-directory [data-delivery-id]').first().innerText()).includes('v3'));
  await page.goto(url+'?view=traces&period='+encodeURIComponent('custom:2026-09-09T22:08:01/2026-09-09T22:08:02'));
  assert.equal(await page.locator('[data-section-id=trace-reconstruction]').getAttribute('data-trace-id'),null,'second boundary excludes earlier trace');

 }finally{await browser.close();}
});

test('dashboard editor keeps drafts through add and file operations until confirm or cancel',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  captureConfigurationFiles(page);
  await page.addInitScript(()=>{
   window.__fileText='';window.__savedText='';window.__pickerCancelled=false;
   window.showSaveFilePicker=async()=>{throw Error('导出不应打开保存窗口')};
  });
  await page.goto(url);const header=page.locator('[data-section-id=workspace-header]');
  const count=await page.getByTestId('dashboard-panel').count();
  await header.getByRole('button',{name:'编辑布局',exact:true}).click();
  await header.getByRole('button',{name:'导出布局',exact:true}).waitFor({state:'visible'});
  for(const name of ['导出布局','导入布局','添加 Widget','保存布局','取消编辑'])assert.ok(await header.getByRole('button',{name,exact:true}).isVisible());
  await header.getByRole('button',{name:'导出布局',exact:true}).hover();assert.ok(await page.getByRole('tooltip').filter({hasText:'导出布局'}).isVisible());
  await header.getByRole('button',{name:'导出布局',exact:true}).click();
  await page.waitForFunction(()=>window.__savedText.length>0);
  assert.equal(JSON.parse(await page.evaluate(()=>window.__savedText)).widgets.length,count);
  await header.getByRole('button',{name:'添加 Widget',exact:true}).click();
  const modal=page.getByRole('dialog',{name:'添加 Widget',exact:true});
  await modal.getByRole('combobox',{name:'指标',exact:true}).selectOption('tokens');
  await modal.getByRole('combobox',{name:'时间组织',exact:true}).selectOption('daily');
  await modal.getByRole('textbox',{name:'标题',exact:true}).fill('新增 Token 趋势');
  await modal.getByRole('button',{name:'添加到末尾',exact:true}).click();
  await page.waitForFunction(n=>document.querySelectorAll('[data-testid=dashboard-panel]').length===n,count+1);
  assert.equal(await page.getByTestId('dashboard-panel').count(),count+1);
  assert.ok((await page.locator('[data-overview-topic=resources]').getByTestId('dashboard-panel').last().innerText()).includes('新增 Token 趋势'));
  await page.keyboard.press('Escape');assert.equal(await page.getByTestId('dashboard-grid').first().getAttribute('data-editing'),'true');
  await header.getByRole('button',{name:'导出布局',exact:true}).click();
  await page.waitForFunction(n=>JSON.parse(window.__savedText).widgets.length===n,count+1);
  await page.evaluate(()=>{window.__fileText=window.__savedText});
  await header.getByRole('button',{name:'取消编辑',exact:true}).click();assert.equal(await page.getByTestId('dashboard-panel').count(),count);
  await header.getByRole('button',{name:'编辑布局',exact:true}).click();
  await header.getByRole('button',{name:'导入布局',exact:true}).click();
  await page.waitForFunction(n=>document.querySelectorAll('[data-testid=dashboard-panel]').length===n,count+1);
  assert.equal(await page.getByTestId('dashboard-grid').first().getAttribute('data-editing'),'true');
  await header.getByRole('button',{name:'保存布局',exact:true}).click();
  await header.getByRole('button',{name:'编辑布局',exact:true}).click();
  await page.evaluate(()=>{window.__fileText='{"version":1,"widgets":[{"source":"unknown"}]}'});
  await header.getByRole('button',{name:'导入布局',exact:true}).click();
  await page.getByRole('status').filter({hasText:'无法导入'}).waitFor({state:'visible'});
  assert.equal(await page.getByTestId('dashboard-panel').count(),count+1);
  await page.evaluate(()=>{window.__pickerCancelled=true});
  await header.getByRole('button',{name:'导入布局',exact:true}).click();
  assert.equal(await page.getByTestId('dashboard-grid').first().getAttribute('data-editing'),'true');
  await header.getByRole('button',{name:'取消编辑',exact:true}).click();
  assert.equal(await page.getByTestId('dashboard-panel').count(),count+1);
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('layout toolbar folds to one compact frame before expanding the next content',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'no-preference'});await page.goto(url);
  const toolbar=page.locator('.obs-layout-editor');const right=await toolbar.evaluate(el=>el.getBoundingClientRect().right);
  async function sample(time){return toolbar.evaluate(async(el,time)=>{
   await new Promise(requestAnimationFrame);
   el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=time});
   return {width:el.getBoundingClientRect().width,right:el.getBoundingClientRect().right,group:Number(getComputedStyle(el.querySelector('.obs-layout-group')).opacity),trigger:Number(getComputedStyle(el.querySelector('.obs-layout-trigger')).opacity)};
  },time)}
  await page.getByRole('button',{name:'编辑布局',exact:true}).click();
  const openingPivot=await sample(252);assert.ok(Math.abs(openingPivot.width-34)<2);assert.equal(openingPivot.trigger,0);assert.equal(openingPivot.group,0);
  const opening=await sample(448);assert.ok(opening.width>34 && opening.width<184);assert.equal(opening.right,right);
  await toolbar.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.finish()));
  await page.getByRole('button',{name:'取消编辑',exact:true}).click();
  const closingPivot=await sample(252);assert.ok(Math.abs(closingPivot.width-34)<2);assert.equal(closingPivot.trigger,0);assert.equal(closingPivot.group,0);
  const closing=await sample(448);assert.ok(closing.width>34 && closing.width<104);assert.ok(closing.trigger>0);assert.equal(closing.right,right);
  await toolbar.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.finish()));
  assert.ok(await page.getByRole('button',{name:'编辑布局',exact:true}).isVisible());
 }finally{await browser.close()}
});

test('overview separates resource trends and workflow quality with working breakdowns',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{const page=await browser.newPage({viewport:{width:1920,height:1080}});await page.goto(url);
 const resources=page.locator('[data-overview-topic=resources]'),quality=page.locator('[data-overview-topic=quality]');
 await resources.getByRole('heading',{name:'资源消耗',exact:true}).waitFor({timeout:3000});await quality.getByRole('heading',{name:'Workflow 运行质量',exact:true}).waitFor();
 for(const id of ['spend','equivalent','calls','input']){
  const widget=resources.locator(`[data-panel-id=${id}] .expression-widget`);
  assert.equal(await widget.getAttribute('data-size'),'1x2');
  const box=await widget.boundingBox();assert.equal(Math.round(box.width),336);assert.equal(Math.round(box.height),160);
  assert.ok(await widget.locator('.crystra-monitoring-widget-title').isVisible());
 }
 assert.ok(await resources.locator('[data-panel-id=costTrend] [data-chart-view=stacked-columns]').isVisible());
 assert.equal(await resources.locator('[data-panel-id=callTrend] .structured-legend>span').count(),3);
 await resources.getByRole('button',{name:'Model',exact:true}).click();
 assert.equal(await resources.locator('[data-panel-id=callTrend] .structured-legend>span').count(),6);
 assert.ok((await resources.locator('[data-panel-id=subscription]').innerText()).includes('160'));
 const chart=quality.locator('[data-panel-id=roleDuration]');const before=await chart.innerText();
 await quality.getByRole('combobox',{name:'Workflow',exact:true}).selectOption('research');
 assert.notEqual(await chart.innerText(),before);
 await page.getByRole('button',{name:'编辑布局',exact:true}).click();
 await page.getByRole('button',{name:'添加 Widget',exact:true}).click();
 await page.getByRole('dialog',{name:'添加 Widget',exact:true}).getByRole('combobox',{name:'指标',exact:true}).selectOption('roleDuration');
 await page.getByRole('button',{name:'添加到末尾',exact:true}).click();
 await page.waitForFunction(()=>document.querySelectorAll('[data-overview-topic=quality] [data-testid=dashboard-panel]').length===7);
 assert.equal(await resources.getByTestId('dashboard-panel').count(),11);
 }finally{await browser.close()}
});

test('metric query config compares providers in one widget and survives layout round trips',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  captureConfigurationFiles(page);
  await page.addInitScript(()=>{
   window.__savedText='';window.__fileText='';
   window.showSaveFilePicker=async()=>{throw Error('导出不应打开保存窗口')};
  });
  await page.goto(url);await page.getByRole('button',{name:'编辑布局',exact:true}).click();
  await page.getByRole('button',{name:'添加 Widget',exact:true}).click();
  const modal=page.getByRole('dialog',{name:'添加 Widget',exact:true});
  const metric=modal.getByRole('combobox',{name:'指标',exact:true});
  assert.equal(await metric.locator('option').count(),11);
  assert.equal((await metric.innerText()).includes('DeepSeek'),false);
  await metric.selectOption('cache');
  const preview=modal.locator('.obs-widget-preview');
  for(const provider of ['DeepSeek','OpenAI','Copilot'])assert.ok((await preview.innerText()).includes(provider));
  const geometry=await preview.locator('[data-chart-view=grouped-columns] > svg').evaluate(svg=>{
   const axis=svg.querySelector('line');const bars=[...svg.querySelectorAll('rect')];
   return {mid:(Number(axis.getAttribute('x1'))+Number(axis.getAttribute('x2')))/2,center:bars.reduce((n,r)=>n+Number(r.getAttribute('x'))+Number(r.getAttribute('width'))/2,0)/bars.length};
  });
  assert.ok(Math.abs(geometry.mid-geometry.center)<1,'one summary group is centered in the plot');
  await modal.getByRole('combobox',{name:'时间组织',exact:true}).selectOption('daily');
  assert.ok(await preview.locator('[data-chart-view=multi-line]').isVisible());
  assert.equal(await preview.locator('.structured-legend>span').count(),3);
  assert.equal((await modal.getByRole('combobox',{name:'Widget 表达方式',exact:true}).innerText()).includes('堆叠'),false);
  assert.equal(await modal.getByRole('combobox',{name:'数值范围',exact:true}).inputValue(),'auto');
  const automaticTicks=await preview.locator('[data-chart-view=multi-line] > svg text').allTextContents();
  assert.ok(Number(automaticTicks.find(text=>/^\d/.test(text)))>0,'automatic range should not force the lower bound to zero');
  await modal.getByRole('combobox',{name:'数值范围',exact:true}).selectOption('custom');
  await modal.getByRole('spinbutton',{name:'数值下限',exact:true}).fill('35');
  await modal.getByRole('spinbutton',{name:'数值上限',exact:true}).fill('80');
  assert.ok((await preview.locator('[data-chart-view=multi-line] > svg').textContent()).includes('35'));
  await modal.getByRole('combobox',{name:'Provider',exact:true}).selectOption('selected');
  await modal.getByRole('checkbox',{name:'Copilot',exact:true}).uncheck();
  assert.equal(await preview.locator('.structured-legend>span').count(),2);
  await modal.getByRole('combobox',{name:'分组',exact:true}).selectOption('model');
  assert.equal(await preview.locator('.structured-legend>span').count(),4);
  await modal.getByRole('combobox',{name:'Model',exact:true}).selectOption('selected');
  await modal.getByRole('checkbox',{name:'OpenAI / GPT-5 mini',exact:true}).uncheck();
  assert.equal(await preview.locator('.structured-legend>span').count(),3);
  await modal.getByRole('button',{name:'自定义',exact:true}).click();
  await modal.getByRole('spinbutton',{name:'行数',exact:true}).fill('4');
  await modal.getByRole('spinbutton',{name:'列数',exact:true}).fill('5');
  let box=await preview.locator('.expression-widget').boundingBox();
  assert.equal(Math.round(box.width),864);assert.equal(Math.round(box.height),688);
  await modal.getByRole('spinbutton',{name:'行数',exact:true}).fill('1');
  assert.equal(await modal.getByRole('button',{name:'添加到末尾',exact:true}).isDisabled(),true);
  await modal.getByRole('spinbutton',{name:'行数',exact:true}).fill('4');
  await modal.getByRole('textbox',{name:'标题',exact:true}).fill('缓存命中率 · 来源对比');
  await modal.getByRole('button',{name:'添加到末尾',exact:true}).click();
  const added=page.getByTestId('dashboard-panel').filter({hasText:'缓存命中率 · 来源对比'});
  assert.equal(await added.locator('.structured-legend>span').count(),3);
  await added.click({button:'right'});
  let menu=page.getByRole('menu');
  await menu.getByRole('menuitem',{name:'自定义尺寸…',exact:true}).click();
  await menu.getByRole('spinbutton',{name:'自定义行数',exact:true}).fill('5');
  await menu.getByRole('spinbutton',{name:'自定义列数',exact:true}).fill('6');
  await menu.getByRole('button',{name:'应用尺寸',exact:true}).click();
  assert.equal(await added.getAttribute('data-grid-width'),'6');assert.equal(await added.getAttribute('data-grid-height'),'5');
  await added.click({button:'right'});menu=page.getByRole('menu');
  await menu.getByRole('menuitem',{name:'数值范围…',exact:true}).click();
  const rangeDialog=page.getByRole('dialog',{name:'图表数值范围',exact:true});
  await rangeDialog.getByRole('combobox',{name:'数值范围',exact:true}).selectOption('auto');
  await rangeDialog.getByRole('button',{name:'应用范围',exact:true}).click();
  await page.getByRole('button',{name:'导出布局',exact:true}).click();await page.waitForFunction(()=>window.__savedText.length>0);
  const file=JSON.parse(await page.evaluate(()=>window.__savedText));const saved=file.widgets.find(w=>w.title==='缓存命中率 · 来源对比');
  assert.deepEqual(saved.query.providers,['DeepSeek','OpenAI']);assert.equal(saved.query.metric,'cache');assert.equal(saved.query.time,'daily');assert.equal(saved.query.groupBy,'model');assert.equal(saved.query.models.length,3);assert.equal(saved.source,undefined);assert.equal(saved.grid.w,6);assert.equal(saved.grid.h,5);assert.deepEqual(saved.range,{mode:'auto'});
  await page.getByRole('button',{name:'取消编辑',exact:true}).click();assert.equal(await added.count(),0);
  await page.getByRole('button',{name:'编辑布局',exact:true}).click();await page.evaluate(()=>window.__fileText=window.__savedText);
  await page.getByRole('button',{name:'导入布局',exact:true}).click();await added.waitFor();assert.equal(await added.locator('.structured-legend>span').count(),3);
  await page.getByRole('button',{name:'保存布局',exact:true}).click();assert.equal(await added.count(),1);assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});

test('trace keeps only visualization and a collapsible searchable directory',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url+'?view=traces');
  for(const name of ['瀑布图','树图']){
   await page.getByRole('button',{name,exact:true}).click();
   assert.equal(await page.locator('.obs-trace-main .trace-summary').count(),0);
   assert.equal(await page.getByRole('button',{name:'来源与记录',exact:true}).count(),0);
   assert.equal(await page.getByRole('button',{name:'研究同类调用',exact:true}).count(),0);
   assert.equal(await page.locator('.obs-trace-layout').getByText('示例',{exact:true}).count(),0);
  }
  const drawer=page.getByRole('complementary',{name:'调用记录目录'});
  assert.equal(await page.getByRole('dialog').count(),0);
  const before=await page.locator('.obs-trace-main').boundingBox();
  assert.equal(await drawer.isVisible(),false);
  await page.getByRole('button',{name:'展开调用目录',exact:true}).click();
  await page.screenshot({animations:'disabled',path:new URL('./analysis-trace-directory-v8.png',import.meta.url).pathname});
  await page.waitForFunction(()=>Math.abs(document.querySelector('#trace-run-directory').getBoundingClientRect().width-320)<1);
  const expanded=await page.locator('.obs-trace-main').boundingBox();
  const directory=await drawer.boundingBox();
  assert.ok(expanded.x>=directory.x+directory.width,'directory occupies layout space');
  assert.ok(expanded.width<before.width,'trace gives space to expanded directory');
  const search=drawer.getByRole('searchbox',{name:'检索值',exact:true});
  await search.fill('不存在');await search.press('Enter');
  await drawer.getByText('0 条命中',{exact:true}).waitFor();
  assert.equal(await drawer.locator('[data-delivery-id]').count(),0);
  await search.fill('');await search.press('Enter');
  await drawer.getByText('42 条命中',{exact:true}).waitFor();
  await drawer.getByRole('button',{name:'筛选当前结果',exact:true}).click();
  await drawer.getByRole('combobox',{name:'结果中的版本',exact:true}).selectOption('v2');
  await drawer.locator('[data-delivery-id] button').first().click();
  assert.equal(await drawer.isVisible(),true,'selection keeps directory expanded');
  await page.getByRole('button',{name:'收起调用目录',exact:true}).click();
  assert.equal(await drawer.isVisible(),false);
  await page.waitForFunction(()=>document.querySelector('#trace-run-directory').getBoundingClientRect().width<1);
  assert.ok(Math.abs((await page.locator('.obs-trace-main').boundingBox()).width-before.width)<2);
  assert.ok(await page.getByTestId('trace-tree').isVisible());
  await page.getByRole('button',{name:'展开调用目录',exact:true}).click();
  assert.equal(await drawer.getByRole('combobox',{name:'结果中的版本',exact:true}).inputValue(),'v2');
  assert.equal(await drawer.locator('.wsr-list-item[data-selected=true]').count(),1);
  await page.getByRole('button',{name:'收起调用目录',exact:true}).click();
  assert.equal(await drawer.isVisible(),false);
 }finally{await browser.close();}
});

test('trace canvas fills remaining height with borderless navigation',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url+'?view=traces');
  for(const height of [900,1200]){
   await page.setViewportSize({width:1920,height});
   for(const name of ['瀑布图','树图']){
    await page.getByRole('button',{name,exact:true}).click();
    for(const open of [false,true]){
     if(open) await page.getByRole('button',{name:'展开调用目录',exact:true}).click();
     const canvas=page.locator(name==='树图'?'.trace-tree-canvas-shell':'.trace-waterfall-canvas');
     await page.waitForFunction(selector=>{const c=document.querySelector(selector).getBoundingClientRect();const p=document.querySelector('.obs-trace-main');return Math.abs(c.bottom-(p.getBoundingClientRect().bottom-parseFloat(getComputedStyle(p).paddingBottom)))<2;},name==='树图'?'.trace-tree-canvas-shell':'.trace-waterfall-canvas');
     const buttons=page.locator('.obs-trace-toolbar button');
     assert.ok(await buttons.evaluateAll(es=>es.every(e=>parseFloat(getComputedStyle(e).borderTopWidth)===0)));
     assert.equal(await page.locator('.obs-trace-toolbar [data-iconify="tabler:chevron-down"]').count(),1);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight),false);
     if(open) await page.getByRole('button',{name:'收起调用目录',exact:true}).click();
    }
   }
  }
 }finally{await browser.close();}
});


test('trace directory and chevron animate together and respect reduced motion',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url+'?view=traces');
  await page.getByRole('button',{name:'展开调用目录',exact:true}).click();
  const samples=await page.evaluate(()=>{
   const layout=document.querySelector('.obs-trace-layout'), icon=document.querySelector('.obs-directory-chevron');
   const animations=[...layout.getAnimations(),...icon.getAnimations()];
   animations.forEach(a=>{a.pause();a.currentTime=170;});
   return {count:animations.length,width:document.querySelector('#trace-run-directory').getBoundingClientRect().width, transform:getComputedStyle(icon).transform};
  });
  assert.ok(samples.count>=2);
  assert.ok(samples.width>0&&samples.width<320);
  await page.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));
  await page.getByRole('button',{name:'收起调用目录',exact:true}).click();
  assert.equal(await page.locator('#trace-run-directory').getAttribute('inert'),'');
  await page.getByRole('button',{name:'展开调用目录',exact:true}).click();
  await page.waitForFunction(()=>Math.abs(document.querySelector('#trace-run-directory').getBoundingClientRect().width-320)<1);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:'收起调用目录',exact:true}).click();
  assert.equal(await page.locator('#trace-run-directory').evaluate(e=>e.getBoundingClientRect().width),0);
  await page.getByRole('button',{name:'展开调用目录',exact:true}).click();
  assert.equal(await page.locator('#trace-run-directory').evaluate(e=>e.getBoundingClientRect().width),320);
 }finally{await browser.close();}
});


test('trace view titles default to consistent Chinese copy',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url+'?view=traces');
  assert.ok(await page.getByRole('heading',{name:'调用时间线',exact:true}).isVisible());
  await page.getByRole('button',{name:'树图',exact:true}).click();
  assert.ok(await page.getByRole('heading',{name:'调用关系树',exact:true}).isVisible());
  assert.equal(await page.getByText('Span call tree',{exact:true}).count(),0);
  for(const name of ['瀑布图','树图']){
   await page.getByRole('button',{name,exact:true}).click();
   assert.ok(await page.locator('.trace-waterfall-canvas,.trace-tree-canvas-shell').evaluateAll(es=>es.every(e=>getComputedStyle(e).borderTopWidth==='1px'&&Math.abs(Number(getComputedStyle(e).borderTopColor.split(',').at(-1).replace(')',''))-15/255)<0.002&&getComputedStyle(e).boxShadow!=='none'&&parseFloat(getComputedStyle(e).borderTopLeftRadius)>0)));
  }
 }finally{await browser.close();}
});


test('waterfall minimap shares the timeline column and passport spans full height',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url+'?view=traces');
  for(const open of [false,true]){
   if(open){await page.getByRole('button',{name:'展开调用目录',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#trace-run-directory').getBoundingClientRect().width>=319);}
   const mini=await page.locator('.trace-minimap').boundingBox(), timeline=await page.locator('.trace-waterfall-canvas').boundingBox(),passport=await page.locator('.span-passport').boundingBox();
   assert.ok(Math.abs(mini.x-timeline.x)<1&&Math.abs(mini.width-timeline.width)<1,'minimap and timeline are aligned');
   assert.ok(Math.abs(passport.y-mini.y)<1,'passport starts at minimap top');
   assert.ok(Math.abs(passport.y+passport.height-timeline.y-timeline.height)<1,'passport fills full column');
   assert.ok(await page.locator('.trace-minimap,.span-passport').evaluateAll(es=>es.every(e=>getComputedStyle(e).borderTopWidth==='1px'&&Math.abs(Number(getComputedStyle(e).borderTopColor.split(',').at(-1).replace(')',''))-15/255)<0.002&&getComputedStyle(e).boxShadow!=='none'&&parseFloat(getComputedStyle(e).borderTopLeftRadius)>0)));
  }
 }finally{await browser.close();}
});


test('trace auxiliary cards use Chinese titles and leave room around zoom controls',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url+'?view=traces');
  assert.ok(await page.getByText('调用缩略图',{exact:true}).isVisible());
  const passport = page.getByTestId('span-passport');
  assert.equal(await passport.getByText('调用详情',{exact:true}).count(),0);
  assert.equal(await passport.getByText('当前调用',{exact:true}).count(),0);
  const heading = passport.locator('.trace-passport-head h2');
  const original = await heading.innerText();
  assert.ok(await passport.locator('.trace-passport-head .trace-passport-sigil').isVisible());
  assert.equal(await passport.locator('.trace-passport-body .trace-passport-title').count(),0);
  await page.getByTestId('trace-waterfall-row').nth(1).click();
  assert.notEqual(await heading.innerText(),original);
  assert.ok(await passport.locator('.trace-passport-head').getByText(/深度 1/).isVisible());
  await page.getByRole('tab',{name:'总览',exact:true}).click();
  const widgets=page.locator('.crystra-monitoring-widget');
  assert.ok(await widgets.count()>0);
  assert.ok(await widgets.evaluateAll(es=>es.every(e=>Math.abs(Number(getComputedStyle(e).borderTopColor.split(',').at(-1).replace(')',''))-15/255)<0.002&&getComputedStyle(e).boxShadow!=='none')));
  await page.getByRole('tab',{name:'调用追踪',exact:true}).click();
  for(const open of [false,true]){
   if(open){await page.getByRole('button',{name:'展开调用目录',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#trace-run-directory').getBoundingClientRect().width>=319);}
   const box=await page.locator('.trace-minimap').boundingBox(),zoom=await page.getByTestId('trace-waterfall-data-zoom').boundingBox();
   assert.ok(Math.abs(box.x+box.width-zoom.x-zoom.width-7)<1,'zoom right inset is 6px plus 1px border');
   assert.ok(zoom.y>box.y&&zoom.y+zoom.height<box.y+box.height,'zoom has vertical breathing room');
   if(!open) await page.screenshot({animations:'disabled',path:new URL('./analysis-audit-v8.png',import.meta.url).pathname});
  }
 }finally{await browser.close();}
});
