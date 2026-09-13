import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import test from 'node:test';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
const target=new URL('./crystra-workflow-explorer-v8.html?from_task_id=task-ui-workbench',import.meta.url).href;
test('Workflow Explorer: shared browser layout, exact revisions, resource operations and scrolling',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(target,{waitUntil:'networkidle'});
  const cards=page.locator('[data-workflow-card]');await cards.first().waitFor({timeout:2000});
  assert.equal(await page.locator('h1').innerText(),'全部工作流');
  assert.equal(await page.locator('[data-section-id=all-workflows-action]').getAttribute('aria-current'),'page');
  assert.equal(await page.locator('#browser-view-toggle-seat button').getAttribute('aria-label'),'工作流视图：Gallery，切换到 List');
  assert.equal(await page.locator('#browser-group').inputValue(),'none');
  assert.equal(await cards.locator('[role=progressbar],.task-attention-badge').count(),0);
  const first=cards.first(),id=await first.getAttribute('data-workflow-card');
  const href=await first.locator('.task-card-link').getAttribute('href');
  assert.ok(href.includes('workflow_definition_id=')&&href.includes('revision=')&&!href.includes('revision=latest'));
  assert.ok(href.includes('from_task_id=task-ui-workbench'));
  await page.screenshot({path:new URL('./workflow-explorer-gallery.png',import.meta.url).pathname});
  await first.locator('input').check();
  await page.locator('#browser-view-toggle-seat button').click();
  assert.equal(await page.locator('[data-list-workflow]').count(),12);
  assert.equal(await page.locator(`[data-list-workflow="${id}"] input`).isChecked(),true);
  assert.equal(await page.locator('#browser-list').evaluate(el=>getComputedStyle(el).borderWidth),'0px');
  const heads=await page.locator('#browser-list th').allTextContents();assert.ok(heads.includes('版本')&&heads.includes('节点'));assert.ok(!heads.includes('成本')&&!heads.includes('当前进度')&&!heads.includes('Workspace'));
  await page.screenshot({path:new URL('./workflow-explorer-list.png',import.meta.url).pathname});
  const row=page.locator(`[data-list-workflow="${id}"]`);await row.locator('[data-card-more]').click();await row.locator('[data-card-action=archive]').click();
  assert.equal(await row.count(),0);await page.locator('#browser-undo-archive').click();assert.equal(await row.count(),1);
  await row.locator('[data-card-more]').click();await row.locator('[data-card-action=rename]').click();
  await page.locator('#browser-rename-input').fill('显示名称');await page.locator('#browser-rename-save').click();
  assert.equal(await row.locator('.cell-primary').getAttribute('href'),href);
  await page.locator('[data-browser-filter=draft]').click();assert.ok((await page.locator('[data-list-workflow] .browser-chip').allTextContents()).every(s=>s==='草稿'));
  await page.locator('[data-browser-filter=all]').click();await page.locator('#browser-search').fill('不匹配');assert.equal(await page.locator('#browser-empty').isVisible(),true);
  await page.locator('#browser-search').fill('');await page.locator('#browser-view-toggle-seat button').click();await page.locator('#browser-group').selectOption('none');
  const count=await cards.count();await page.locator('[data-load-more]').first().scrollIntoViewIfNeeded();await page.waitForFunction(n=>document.querySelectorAll('[data-workflow-card]').length>n,count);
  await page.locator('#browser-select-all').check();assert.equal(await page.locator('#browser-selected-count').innerText(),'已选 96');
  for(const width of [1920,2560,3840]){await page.setViewportSize({width,height:1080});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('Workflow versions: collapse before filtering, expand exact revisions in both views',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(target,{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-version-mode=latest]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#browser-group option[value=workspace]').count(),0);
  await page.locator('#browser-search').fill('release-qualification-96');
  let cards=page.locator('[data-workflow-card]');
  assert.equal(await cards.count(),1);assert.equal(await cards.first().getAttribute('data-revision'),'10.0.0');
  await cards.first().locator('input').check();
  await page.locator('[data-version-mode=all]').click();
  assert.equal(await cards.count(),3);assert.equal(await page.locator('#browser-select-all').isChecked(),false);
  const ids=await cards.evaluateAll(els=>els.map(el=>el.dataset.resourceId));assert.equal(new Set(ids).size,3);
  const revisions=await cards.evaluateAll(els=>els.map(el=>el.dataset.revision));assert.deepEqual(revisions,['10.0.0','2.0.0','1.0.0']);
  await page.locator('#browser-view-toggle-seat button').click();
  assert.equal(await page.locator('[data-list-workflow]').count(),3);
  const old=page.locator('[data-list-workflow][data-revision="2.0.0"]');await old.locator('input').check();
  const oldHref=await old.locator('.cell-primary').getAttribute('href');assert.ok(oldHref.includes('revision=2.0.0'));
  await page.locator('[data-version-mode=latest]').click();
  assert.equal(await page.locator('[data-list-workflow]').count(),1);assert.equal(await page.locator('#browser-select-all').isChecked(),false);
  await page.locator('[data-version-mode=all]').click();
  await page.locator('#browser-search').fill('');await page.locator('#browser-view-toggle-seat button').click();
  await page.waitForFunction(()=>document.querySelectorAll('[data-workflow-card]').length>20);
  await page.waitForTimeout(400);
  await page.screenshot({path:new URL('./workflow-explorer-all-versions.png',import.meta.url).pathname});
  await page.locator('[data-version-mode=latest]').click();
  await page.locator('#browser-search').fill('build-and-sign');
  const latest=page.locator('[data-workflow-card][data-workflow-definition-id="build-and-sign"]');
  assert.equal(await latest.getAttribute('data-revision'),'10.0.0');
  await page.locator('[data-browser-filter=draft]').click();
  assert.equal(await page.locator('[data-workflow-card][data-workflow-definition-id="build-and-sign"]').count(),0);
 }finally{await browser.close();}
});
