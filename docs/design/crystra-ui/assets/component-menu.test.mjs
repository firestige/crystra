import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import test from 'node:test';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
test('select, action Menu and Popover open below their triggers',async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1080}});
  await page.goto(new URL('./component-preview.html',import.meta.url).href);
  const select=page.getByLabel('排列顺序',{exact:true});
  await select.scrollIntoViewIfNeeded();
  assert.equal(await select.evaluate(el=>getComputedStyle(el).appearance),'base-select');
  await select.click();
  const anchor=await select.boundingBox(), option=await page.getByRole('option',{name:'示例顺序',exact:true}).boundingBox();
  assert.ok(option.y>=anchor.y+anchor.height);
  await page.getByRole('option',{name:'示例逆序',exact:true}).click();
  assert.equal(await select.inputValue(),'desc');
  for(const [name,role] of [['发布插件市场方案操作','menu'],['筛选条件','dialog']]){
   const button=page.getByRole('button',{name,exact:true});
   await button.evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().bottom-innerHeight+95));
   await button.click();
   const a=await button.boundingBox(),panel=await page.getByRole(role,{name,exact:true}).boundingBox();
   assert.ok(panel.y>=a.y+a.height);
   assert.ok(panel.y+panel.height<=1080);
   await page.keyboard.press('Escape');
  }
  await select.scrollIntoViewIfNeeded();await select.click();
  await page.screenshot({path:new URL('./component-menu-downward.png',import.meta.url).pathname});
 }finally{await browser.close();}
});
