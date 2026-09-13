import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('graph intent, draft persistence and exact-version publication gate',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('crystra-workflow-studio-v8.html',import.meta.url).href);await page.getByRole('button',{name:'发布版本',exact:true}).waitFor();
 assert.equal(await page.getByRole('button',{name:'2 处待补充',exact:true}).count(),1);
 await page.screenshot({animations:'disabled',path:new URL('studio-intent-overview-v8.png',import.meta.url).pathname});
 await page.getByRole('button',{name:'发布版本',exact:true}).click();const dialog=page.getByRole('dialog',{name:'发布工作流版本'});await dialog.getByText('还有 2 处问题，暂不能发布',{exact:true}).waitFor();assert.equal(await dialog.getByRole('button',{name:'确认发布',exact:true}).isDisabled(),true);
 await page.screenshot({animations:'disabled',path:new URL('studio-intent-release-blocked-v8.png',import.meta.url).pathname});await dialog.getByRole('button',{name:'继续设计',exact:true}).click();
 const input=page.locator('[data-host-owned=dsh-input] textarea');await input.fill('验收失败时返回实现与验证');await page.locator('[data-section-id=composer-send]').click();await page.getByRole('complementary',{name:'变更详情'}).waitFor();await page.screenshot({animations:'disabled',path:new URL('studio-intent-change-v8.png',import.meta.url).pathname});await page.getByRole('button',{name:'采用建议',exact:true}).click();
 await page.reload();await page.getByRole('button',{name:'1 处待补充',exact:true}).waitFor();await input.fill('绑定测试编写资源');await input.press('Enter');await page.getByRole('button',{name:'采用建议',exact:true}).click();await page.getByRole('button',{name:'没有待补充问题',exact:true}).waitFor();
 await page.getByRole('button',{name:'发布版本',exact:true}).click();await dialog.getByText('当前草稿通过演示检查',{exact:true}).waitFor();await dialog.getByRole('button',{name:'确认发布',exact:true}).click();await page.getByRole('button',{name:'继续编辑草稿',exact:true}).waitFor();assert.equal(await page.getByRole('combobox',{name:'工作流版本'}).inputValue(),'v2');assert.equal(await page.getByRole('button',{name:'发布版本',exact:true}).count(),0);
 await page.getByRole('combobox',{name:'工作流版本'}).selectOption('v1');assert.equal(await page.getByRole('button',{name:'继续编辑草稿',exact:true}).count(),1);
 await page.getByRole('button',{name:'继续编辑草稿',exact:true}).click();await page.getByRole('searchbox',{name:'查找活动或资源'}).fill('测试编写');await page.locator('.intent-search-results').getByRole('button').first().click();await page.getByRole('complementary',{name:'活动详情'}).getByText('测试编写指南',{exact:true}).waitFor();
 await page.screenshot({animations:'disabled',path:new URL('studio-intent-detail-v8.png',import.meta.url).pathname});assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
