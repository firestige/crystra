import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
for(const kind of ['workflow-studio','analysis-audit']) test(kind+' uses current shell and read-only bench',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('./crystra-'+kind+'-v8.html',import.meta.url).href);
  await page.locator('[data-section-id=workspace-header] h1').waitFor({timeout:2500});
  assert.equal(await page.locator('[data-header-slot=navigation]').isVisible(),true);
  assert.equal(await page.locator('[data-section-id=workflow-save-draft],[data-section-id=workflow-validate]').count(),0);
  if(kind==='workflow-studio'){
   const input=await page.locator('[data-host-owned=dsh-input]').boundingBox(),bench=await page.locator('[data-section-id=control-bench]').boundingBox();
   assert.ok(Math.abs(input.y-bench.y)<2&&Math.abs(input.height-bench.height)<2);
   assert.equal(await page.locator('[data-flow-entry=intake]').count(),1);
   const graphTabs=page.getByRole('tablist',{name:'流程图'});
   assert.equal(await page.locator('[data-activity-canvas]').getAttribute('data-layout-engine'),'elk-layered');
   for(const name of ['紧凑布局','纵向布局','横向布局']){
    await page.getByRole('button',{name,exact:true}).click();
    assert.equal(await page.locator('[data-activity-canvas]').getAttribute('data-direction'),name==='紧凑布局'?'COMPACT':name==='纵向布局'?'DOWN':'RIGHT');
    await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-elk-'+(name==='紧凑布局'?'compact':name==='纵向布局'?'vertical':'horizontal')+'-v8.png',import.meta.url).pathname});
    await page.getByRole('button',{name:'适应视图',exact:true}).click();
    await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-elk-'+(name==='紧凑布局'?'compact':name==='纵向布局'?'vertical':'horizontal')+'-overview-v8.png',import.meta.url).pathname});
    await page.getByRole('button',{name:'100%',exact:true}).click();
   }
   assert.deepEqual(await graphTabs.getByRole('tab').allTextContents(),['主流程','测试阶梯','按需外查']);
   assert.equal(await page.getByRole('combobox',{name:'图视图'}).count(),0);
   assert.equal(await page.locator('[data-section-id=workflow-inspector]').count(),0);
   assert.equal(await page.locator('[data-node-badge][data-node-id=ladder]').count(),1);
   assert.ok((await page.locator('[data-graph-legend]').innerText()).includes('可触发流程'));
   assert.equal(await page.getByRole('button',{name:'简单流程',exact:true}).count(),0);
   await page.getByRole('button',{name:'路由：选择 Goal / rung',exact:true}).click();
   assert.ok((await page.locator('[data-section-id=workflow-inspector]').innerText()).includes('已声明'));
   await page.getByRole('button',{name:'关闭详情',exact:true}).click();
   await page.getByRole('button',{name:'放大活动图',exact:true}).click();
   await page.locator('[data-activity-canvas]').evaluate(el=>{el.scrollLeft=100;el.scrollTop=20;});
   await page.locator('[data-node-badge=ladder-detail]').scrollIntoViewIfNeeded();
   const before=await page.locator('[data-activity-canvas]').evaluate(el=>({left:el.scrollLeft,top:el.scrollTop}));
   await page.locator('[data-node-badge=ladder-detail]').click();
   assert.equal(await graphTabs.getByRole('tab',{name:'测试阶梯',exact:true}).getAttribute('aria-selected'),'true');
   assert.equal(await page.locator('[data-activity-node=calibrate]').getAttribute('data-selected'),'true');
   await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-ladder-v8.png',import.meta.url).pathname});
   await graphTabs.getByRole('tab',{name:'主流程',exact:true}).click();
   assert.equal(await page.locator('[data-activity-canvas]').getAttribute('data-zoom'),'1.25');
   assert.deepEqual(await page.locator('[data-activity-canvas]').evaluate(el=>({left:el.scrollLeft,top:el.scrollTop})),before);
   assert.equal(await page.locator('[data-activity-node=select-goal]').getAttribute('data-selected'),'true');
   await page.getByRole('button',{name:'适应视图',exact:true}).click();
   await page.locator('[data-node-badge=intake-research]').click();
   assert.equal(await graphTabs.getByRole('tab',{name:'按需外查',exact:true}).getAttribute('aria-selected'),'true');
   assert.ok((await page.locator('[data-flow-associations]').innerText()).includes('准备与确认'));
   await page.getByRole('button',{name:'Evidence Scout：外查与整理',exact:true}).click();
   assert.ok((await page.locator('[data-section-id=workflow-inspector]').innerText()).includes('DeepSeek v4 Flash'));
   await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-research-detail-v8.png',import.meta.url).pathname});
   await page.keyboard.press('Escape');
   await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-research-v8.png',import.meta.url).pathname});
   await page.getByRole('button',{name:'定位来源：准备与确认',exact:true}).click();
   assert.equal(await page.locator('[data-activity-node=intake]').getAttribute('data-selected'),'true');
   await graphTabs.getByRole('tab',{name:'主流程',exact:true}).focus();
   await page.keyboard.press('ArrowRight');
   await page.keyboard.press('Enter');
   assert.equal(await graphTabs.getByRole('tab',{name:'测试阶梯',exact:true}).getAttribute('aria-selected'),'true');
   await page.getByRole('button',{name:'活动图阅读帮助',exact:true}).click();
   assert.equal(await page.getByRole('complementary',{name:'活动图帮助'}).isVisible(),true);
   await page.keyboard.press('Escape');
   await page.getByRole('button',{name:'紧凑布局',exact:true}).click();
   await page.getByRole('button',{name:'适应视图',exact:true}).click();
   await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-ladder-v8.png',import.meta.url).pathname});
   await page.getByRole('tab',{name:'结晶分析',exact:true}).click();
   assert.equal(await page.getByRole('combobox',{name:'执行样本'}).isVisible(),true);
   await page.getByRole('tab',{name:'流程设计',exact:true}).click();
   await page.getByRole('button',{name:'适应视图',exact:true}).click();
   await page.waitForFunction(()=>{const el=document.querySelector('[data-activity-canvas]'),svg=el.querySelector('svg');return svg.getBoundingClientRect().height<=el.clientHeight+1;});
  }else{
   assert.equal(await page.locator('[data-section-id=observation-dashboard]').isVisible(),true);
   await page.getByRole('tab',{name:'调用追踪',exact:true}).click();
   assert.equal(await page.locator('[data-section-id=trace-reconstruction]').isVisible(),true);
   assert.equal(await page.getByRole('button',{name:'统计',exact:true}).count(),0);
  await page.getByRole('button',{name:'树图',exact:true}).click();
   assert.equal(await page.getByTestId('trace-tree').isVisible(),true);
   assert.equal(await page.locator('.trace-statistics').count(),0);
   await page.getByRole('button',{name:'瀑布图',exact:true}).click();
  }
  await page.screenshot({animations:'disabled',path:new URL('./'+kind+'-v8.png',import.meta.url).pathname});
  await page.locator('[data-section-id=sidebar-toggle]').click();
  await page.waitForFunction(()=>document.querySelector('[data-section-id=app-shell]').dataset.sidebarCollapsed==='true');
  await page.locator('[data-section-id=surface-banner]').click();
  await page.waitForFunction(()=>document.querySelector('[data-section-id=app-shell]').dataset.sidebarCollapsed==='false');
  for(const width of [1920,2560,3840]){await page.setViewportSize({width,height:960});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(kind==='workflow-studio'){
    await page.getByRole('button',{name:'适应视图',exact:true}).click();
    await page.waitForFunction(()=>{const el=document.querySelector('[data-activity-canvas]'),svg=el.querySelector('svg');return svg.getBoundingClientRect().width<=el.clientWidth+1&&svg.getBoundingClientRect().height<=el.clientHeight+1;});
   }
  }
  await page.goto(new URL('./crystra-'+kind+'-v8.html?'+(kind==='workflow-studio'?'workflow_definition_id=missing&revision=v99':'plan_run_id=missing&from_gate_id=G-3'),import.meta.url).href);
  await page.locator('[data-section-id=unresolved-context]').waitFor();
  assert.equal(await page.locator('[data-section-id=workflow-map],[data-section-id=trace-reconstruction]').count(),0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});


test('projection tools combine graph issues, resources and a branching rehearsal',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('./crystra-workflow-studio-v8.html',import.meta.url).href);
  await page.getByRole('button',{name:'静态关注 0',exact:true}).click();
  await page.getByRole('button',{name:'查看缺失绑定样例',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'静态关注 1',exact:true}).count(),1);
  await page.getByRole('button',{name:'定位活动',exact:true}).click();
  assert.equal(await page.locator('[data-activity-canvas]').getAttribute('data-scene'),'ladder');
  assert.equal(await page.locator('[data-activity-node=implement]').getAttribute('data-selected'),'true');
  assert.equal(await page.getByRole('button',{name:'定位缺失资源关注项',exact:true}).count(),1);
  await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-projection-issues-v8.png',import.meta.url).pathname});
  await page.getByRole('button',{name:'恢复完整资源样例',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'定位缺失资源关注项',exact:true}).count(),0);
  await page.getByRole('button',{name:'关闭详情',exact:true}).click();
  await page.getByRole('button',{name:'绑定资源 5',exact:true}).click();
  await page.getByRole('button',{name:/Skill.*Evolutionary TDD/}).click();
  assert.ok((await page.locator('.projection-resource-content').innerText()).includes('Never edit formal tests'));
  await page.getByRole('textbox',{name:'消息输入'}).fill('保留已有草稿');
  await page.getByRole('button',{name:'引用到 Chat 讨论',exact:true}).click();
  assert.ok((await page.getByRole('textbox',{name:'消息输入'}).inputValue()).startsWith('保留已有草稿'));
  assert.ok((await page.getByRole('textbox',{name:'消息输入'}).inputValue()).includes('evolutionary-tdd-implementation'));
  await page.locator('[data-projection-resources]').evaluate(el=>el.scrollTop=0);
  await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-projection-resource-v8.png',import.meta.url).pathname});
  await page.getByRole('button',{name:'关闭详情',exact:true}).click();
  await page.getByRole('button',{name:'打开推演',exact:true}).click();
  const player=page.getByRole('region',{name:'交互推演'});
  await player.getByRole('button',{name:'播放',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('[data-rehearsal-node]')?.dataset.rehearsalNode==='rung-result');
  await player.getByRole('button',{name:'RED 且有进展',exact:true}).click();
  assert.equal(await player.getAttribute('data-rehearsal-node'),'implement');
  await player.getByRole('button',{name:'单步',exact:true}).click();
  await player.getByRole('button',{name:'rung GREEN',exact:true}).click();
  assert.equal(await player.getAttribute('data-rehearsal-node'),'coverage');
  assert.ok((await page.locator('.projection-data').innerText()).includes('GREEN'));
  await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-projection-rehearsal-v8.png',import.meta.url).pathname});
  await page.getByRole('button',{name:'绑定资源 5',exact:true}).click();
  assert.equal(await player.isVisible(),true);
  await page.getByRole('button',{name:'查看全部资源',exact:true}).click();
  await page.screenshot({animations:'disabled',path:new URL('./workflow-studio-projection-combined-v8.png',import.meta.url).pathname});
  await page.getByRole('button',{name:'关闭详情',exact:true}).click();
  await player.getByRole('button',{name:'推演上一步',exact:true}).click();
  assert.equal(await player.getAttribute('data-rehearsal-node'),'rung-result');
  await player.getByRole('button',{name:'重置推演',exact:true}).click();
  assert.equal(await page.locator('.projection-history>button').count(),1);
  await player.getByRole('button',{name:'关闭推演',exact:true}).click();
  assert.equal(await page.locator('[data-rehearsal-node]').count(),0);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
