import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
const require = createRequire(new URL('../../../../wsr-ui/package.json', import.meta.url));
const { chromium } = require('playwright');
const html = new URL('./crystra-task-work-v8-sidebar.html', import.meta.url);
const selector = name => `[data-section-id="${name}"]`;

test('sidebar collapse retains Task context and offers keyboard-dismissable quick navigation', async () => {
  const browser = await chromium.launch({headless:true, executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(html.href+'?surface=plan', {waitUntil:'networkidle'});
    const oldInput = await page.locator(selector('input-stream')).elementHandle();
    const before = await page.locator(selector('control-workspace')).boundingBox();
    await page.locator(selector('sidebar-toggle')).click();
    assert.equal(await page.locator(selector('sidebar-toggle')).getAttribute('aria-expanded'),'false');
    await page.waitForFunction(() => Math.abs(document.querySelector('[data-section-id="sidebar"]').getBoundingClientRect().width-64)<1);
    assert.ok(Math.abs((await page.locator(selector('sidebar')).boundingBox()).width-64)<1);
    assert.equal(await page.locator('input[name="control-surface"]:checked').inputValue(),'plan');
    assert.equal(await oldInput.evaluate(el=>el.isConnected),true);
    assert.ok((await page.locator(selector('control-workspace')).boundingBox()).width>before.width);
    await page.locator(selector('sidebar-rail-tasks')).click();
    assert.ok(await page.locator(selector('task-list')).isVisible());
    const popup = await page.locator(selector('task-working-set')).boundingBox();
    assert.ok(popup.x>=64 && popup.x+popup.width<=1440);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator(selector('task-list')).isVisible(),false);
    assert.equal(await page.locator(selector('sidebar-rail-tasks')).evaluate(el=>el===document.activeElement),true);
    await page.locator(selector('sidebar-rail-analysis')).click();
    assert.ok(await page.locator(selector('analysis-dashboard-action')).isVisible());
    await page.locator(selector('workspace-header')).click();
    assert.equal(await page.locator(selector('analysis-dashboard-action')).isVisible(),false);
    await page.locator(selector('surface-banner')).click();
    await page.waitForFunction(() => document.querySelector('[data-section-id="sidebar"]').getBoundingClientRect().width>259);
    assert.ok((await page.locator(selector('sidebar')).boundingBox()).width>200);
    assert.equal(await page.locator('input[name="control-surface"]:checked').inputValue(),'plan');
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
});

test('quick directories preserve section preferences and Escape dismisses search before the panel', async () => {
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    await page.goto(html.href,{waitUntil:'networkidle'});
    await page.locator(selector('workflow-section-toggle')).click();
    await page.locator(selector('sidebar-toggle')).click();
    await page.locator(selector('sidebar-rail-workflows')).click();
    assert.ok(await page.locator(selector('workflow-current-list')).isVisible());
    await page.keyboard.press('Escape');
    await page.locator(selector('sidebar-rail-tasks')).click();
    await page.locator(selector('task-search-action')).click();
    await page.locator(selector('task-search-input')).fill('市场');
    await page.keyboard.press('Escape');
    assert.ok(await page.locator(selector('task-list')).isVisible());
    assert.equal(await page.locator(selector('task-search-input')).evaluate(el=>!!el.closest('[inert]')),true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator(selector('task-list')).isVisible(),false);
    await page.locator(selector('surface-banner')).click();
    assert.equal(await page.locator(selector('workflow-section-toggle')).getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator(selector('workflow-current-list')).isVisible(),false);
  } finally {await browser.close();}
});

test('desktop widths keep the collapsed rail and file utility aligned with a visible footer', async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page=await browser.newPage();
    for(const [width,height] of [[1366,650],[1440,900],[1920,1080],[2560,1080],[5120,1440]]) {
      await page.setViewportSize({width,height});
      await page.goto(html.href+'?sidebar=collapsed&better_sidebar=1',{waitUntil:'networkidle'});
      const rail=await page.locator(selector('sidebar')).boundingBox();
      const main=await page.locator(selector('task-workspace')).boundingBox();
      const settings=await page.locator(selector('host-settings')).boundingBox();
      assert.equal(rail.width,64);
      assert.equal(main.x,64);
      assert.ok(settings.y+settings.height<=height,`footer must fit at ${width}x${height}`);
      assert.ok(await page.locator(selector('input-stream')).isVisible());
      await page.locator(selector('better-sidebar-edge-handle')).hover();
      await page.locator(selector('better-sidebar-toggle')).click();
      const utility=await page.locator(selector('better-sidebar-surface')).boundingBox();
      assert.ok(utility.x+utility.width<=width+1);
      assert.ok(utility.y+utility.height<=height+1);
      assert.equal(await page.locator(selector('app-shell')).getAttribute('data-sidebar-collapsed'),'true');
    }
  } finally {await browser.close();}
});


test('brand expands from the top left and expanded banners switch surfaces both ways', async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    await page.goto(html.href+'?surface=plan',{waitUntil:'networkidle'});
    const input=await page.locator(selector('input-stream')).elementHandle();
    const banner=page.locator(selector('surface-banner'));
    await page.locator(selector('sidebar-toggle')).click();
    await page.mouse.move(800,100);
    await banner.blur();
    assert.equal(await page.locator(selector('sidebar-toggle')).isVisible(),false);
    assert.ok(await page.locator('[data-brand-crystra]').isVisible());
    await banner.hover();
    assert.ok(await page.locator('[data-brand-expand]').isVisible());
    assert.equal(await page.locator('[data-brand-crystra]').isVisible(),false);
    assert.equal(await banner.getAttribute('aria-label'),'展开侧边栏');
    assert.ok((await banner.boundingBox()).y<60);
    await banner.click();
    assert.equal(await page.locator(selector('app-shell')).getAttribute('data-product-surface'),'crystra');
    await banner.click();
    assert.equal(await page.locator(selector('sidebar-brand-name')).innerText(),'DeepSeek');
    assert.ok(await page.locator(selector('harness-preview')).isVisible());
    await banner.click();
    assert.equal(await page.locator(selector('sidebar-brand-name')).innerText(),'Crystra');
    assert.ok(await page.locator(selector('task-workspace')).isVisible());
    assert.equal(await input.evaluate(el=>el.isConnected),true);
    assert.equal(await page.locator('input[name="control-surface"]:checked').inputValue(),'plan');
    assert.equal(page.url(),html.href+'?surface=plan');
    await page.locator(selector('sidebar-toggle')).click();
    await page.mouse.move(800,100);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.locator('[data-brand-expand]').isVisible());
    await page.keyboard.press('Enter');
    assert.equal(await page.locator(selector('app-shell')).getAttribute('data-product-surface'),'crystra');
  } finally {await browser.close();}
});

test('Task header tools highlight independently and do not bubble hover or click to the header',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:940}});
  for(const colors of ['semantic']){
   await page.goto(html.href+'?surface=gate&colors='+colors,{waitUntil:'networkidle'});
   const header=page.locator(selector('task-section-header'));
   const bg=el=>el.evaluate(e=>getComputedStyle(e).backgroundColor);
   await page.mouse.move(700,100);const rest=await bg(header);
   await page.locator(selector('task-section-toggle')).hover();await page.waitForTimeout(200);
   assert.notEqual(await bg(header),rest,'hovering the section title should highlight its header');
   await page.mouse.move(700,100);
   await header.evaluate(el=>{window.headerToolEvents=[];for(const type of ['pointerover','mouseover','click'])el.addEventListener(type,e=>window.headerToolEvents.push(e.type));});
   for(const id of ['task-search-action','task-view-options-action']){
    const tool=page.locator(selector(id));const idle=await bg(tool);const idleColor=await tool.evaluate(el=>getComputedStyle(el).color);
    await tool.hover();await page.waitForTimeout(200);
    assert.equal(await bg(header),rest,colors+': tool hover must not highlight the header');
    if(id==='task-search-action') { assert.equal(await bg(tool),idle); assert.notEqual(await tool.evaluate(el=>getComputedStyle(el).color),idleColor); } else assert.notEqual(await bg(tool),idle,'the icon button should highlight itself');
    await page.mouse.move(700,100);await page.waitForTimeout(200);
   }
   await page.locator(selector('task-search-action')).click();
   assert.equal(await page.locator(selector('task-search-control')).getAttribute('data-open'),'true');
   assert.equal(await page.locator(selector('task-working-set')).getAttribute('data-expanded'),'true');
   await page.locator(selector('task-search-input')).press('Escape');
   await page.locator(selector('task-view-options-action')).focus();await page.keyboard.press('Enter');
   assert.ok(await page.locator(selector('task-view-options-menu')).isVisible());
   assert.deepEqual(await page.evaluate(()=>window.headerToolEvents),[]);
  }
 }finally{await browser.close();}
});

test('resource headers contain all navigation and Workflow tools filter, sort and dismiss independently', async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(html.href,{waitUntil:'networkidle'});
  for(const [kind,plural,label] of [['task','tasks','全部任务'],['workflow','workflows','全部工作流']]){
   const header=page.locator(selector(kind+'-section-header'));
   const all=header.locator(selector('all-'+plural+'-action'));
   assert.equal(await all.count(),1,'all resources belongs in the title row');
   await all.hover();
   assert.equal(await page.locator(selector('sidebar-tooltip')).innerText(),label);
   assert.ok(await page.locator(selector('sidebar-tooltip')).isVisible());
   const h=await header.boundingBox(),a=await all.boundingBox();
   assert.ok(a.y>=h.y && a.y+a.height<=h.y+h.height+1);
  }
  await page.locator(selector('workflow-search-action')).click();
  await page.locator(selector('workflow-search-input')).fill('market');
  assert.equal(await page.locator(selector('workflow-current-list')+' a:visible').count(),1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator(selector('workflow-current-list')+' a:visible').count(),3);
  await page.locator(selector('workflow-view-options-action')).click();
  const menu=await page.locator(selector('workflow-view-options-menu')).boundingBox();
  const button=await page.locator(selector('workflow-view-options-action')).boundingBox();
  assert.ok(menu.y>=button.y+button.height);
  await page.locator('input[name="workflow-sort"][value="descending"]').check();
  assert.equal(await page.locator(selector('workflow-current-list')+' a').first().getAttribute('data-workflow-definition-id'),'publish-documentation');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator(selector('workflow-view-options-menu')).isVisible(),false);
  await page.locator(selector('sidebar-toggle')).click();
  await page.locator(selector('sidebar-rail-workflows')).click();
  await page.locator(selector('workflow-search-action')).click();
  await page.keyboard.press('Escape');
  assert.ok(await page.locator(selector('workflow-current-list')).isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator(selector('workflow-current-list')).isVisible(),false);
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
});
