import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
test('field conditions, independent chips and inline result filters',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(new URL('./component-preview.html',import.meta.url).href);
  const review=page.locator('#delivery-directory-review'),rows=review.locator('[data-delivery-id]'),output=review.getByLabel('目录选中结果');
  const add=async(field,value)=>{await review.getByRole('combobox',{name:'检索字段',exact:true}).selectOption(field);await review.getByRole('searchbox',{name:'检索值',exact:true}).fill(value);await review.getByRole('searchbox',{name:'检索值',exact:true}).press('Enter');};
  await review.getByText('42 条命中',{exact:true}).waitFor();assert.equal(await rows.count(),10);
  await review.getByTestId('delivery-directory-scroll').evaluate(el=>el.scrollTop=el.scrollHeight);
  await page.waitForFunction(()=>document.querySelectorAll('#delivery-directory-review [data-delivery-id]').length>10);
  assert.equal(await review.locator('.wsr-search-leading').getByRole('combobox',{name:'检索字段',exact:true}).count(),1);
  assert.equal(await review.getByRole('button',{name:'添加检索条件'}).count(),0);
  await add('workflowRef','imple');await review.getByText('14 条命中',{exact:true}).waitFor();
  await add('taskId','发布插件市场方案');await review.getByText('0 条命中',{exact:true}).waitFor();assert.ok((await output.innerText()).includes('无选中'));
  await add('taskName','发布插件市场方案');await review.getByText('21 条命中',{exact:true}).waitFor();
  await add('workflowRef','Implementation@v3');await review.getByText('4 条命中',{exact:true}).waitFor();
  assert.equal(await review.locator('[aria-label="已应用检索条件"]').count(),0);
  await add('workflowRef','');await review.getByText('42 条命中',{exact:true}).waitFor();
  await add('taskName','发布插件市场方案');
  const toggle=review.getByRole('button',{name:/筛选当前结果/});await toggle.click();
  assert.equal(await review.locator('[role=dialog]').count(),0);
  await review.getByRole('combobox',{name:'结果中的 Task',exact:true}).selectOption('demo-release-copy');
  await review.getByRole('combobox',{name:'结果中的版本',exact:true}).selectOption('v3');await review.getByText('1 条命中',{exact:true}).waitFor();
  await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await review.getByRole('button',{name:'移除条件：Task：发布插件市场方案 · demo-release-copy',exact:true}).click();
  assert.ok(await review.getByRole('button',{name:'移除条件：版本：v3',exact:true}).isVisible());
  await review.getByText('11 条命中',{exact:true}).waitFor();
  await toggle.click();assert.equal(await review.getByRole('combobox',{name:'结果中的版本',exact:true}).inputValue(),'v3');
  await page.waitForTimeout(300);
  await review.screenshot({path:new URL('./delivery-directory-review.png',import.meta.url).pathname});
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
