import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('workflow identity, graph-led design and crystallization handoff',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=new URL('crystra-workflow-studio-v8.html',import.meta.url).href;
 await page.goto(url);const header=page.locator('[data-section-id=workspace-header]');await header.getByRole('heading',{name:'Implementation',exact:true}).waitFor();
 assert.deepEqual(await header.getByRole('tab').allTextContents(),['流程设计','结晶分析']);
 await header.getByRole('tab',{name:'结晶分析',exact:true}).click();await header.getByText('从 Goal 到已验证实现',{exact:true}).waitFor();await page.getByRole('button',{name:'定位结晶候选 · 校准测试',exact:true}).click();
 await page.getByRole('region',{name:'节点结晶分析'}).getByText('候选：测试结果整理 → script').waitFor();
 await page.getByRole('combobox',{name:'执行样本'}).selectOption('demo-delivery-02');
 assert.equal(await page.getByRole('region',{name:'节点结晶分析'}).getByText('demo-delivery-01',{exact:true}).count(),0);
 await page.screenshot({animations:'disabled',path:new URL('workflow-studio-crystallization-v8.png',import.meta.url).pathname});
 await page.getByRole('button',{name:'带回流程设计',exact:true}).click();assert.equal(await header.getByRole('tab',{name:'流程设计',exact:true}).getAttribute('aria-selected'),'true');
 assert.match(await page.locator('[data-host-owned=dsh-input] textarea').inputValue(),/script 候选/);
 await page.getByText('测试报告整理 → script · 待 Chat 生成配置差异',{exact:true}).waitFor();
 await page.screenshot({animations:'disabled',path:new URL('workflow-studio-design-v8.png',import.meta.url).pathname});
 await page.goto(url+'?workflow_definition_id=build-and-sign&revision=v3&view=crystallization');await header.getByRole('heading',{name:'build-and-sign',exact:true}).waitFor();await page.getByText('暂无执行样本',{exact:true}).waitFor();
 await page.goto(url+'?workflow_definition_id=unknown&revision=v7');await header.getByRole('heading',{name:'unknown',exact:true}).waitFor();await page.getByText('当前来源尚未解析',{exact:true}).waitFor();assert.equal(await page.locator('[data-activity-canvas]').count(),0);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
