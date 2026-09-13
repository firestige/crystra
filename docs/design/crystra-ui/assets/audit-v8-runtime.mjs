import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url))('playwright');
const out=new URL('../handoff/v8-design-audit/',import.meta.url);
const result={method:'Rendered DOM census, including hidden nodes, across named states. Not exhaustive traversal of all permutations or native host dialogs.',states:[],failures:[],themeProbe:[]};
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(4000);
const selector='button,input,select,textarea,a,summary,[tabindex],[role],[data-section-id],section,article,aside,main,header,footer,dialog,form,fieldset,table';
const snapshot=async name=>{
 const elements=await page.locator(selector).evaluateAll(nodes=>nodes.map(el=>{const a=Object.fromEntries([...el.attributes].map(a=>[a.name,a.value]));let p=el,parent=[];for(let i=0;p&&i<12;p=p.parentElement,i++)parent.push(p.id||p.getAttribute('data-section-id')||p.getAttribute('aria-label')||p.className?.baseVal||p.className||p.tagName);return {tag:el.tagName.toLowerCase(),id:el.id,section:a['data-section-id'],role:a.role,label:a['aria-label']||a.title||a.placeholder||el.textContent.trim().replace(/\s+/g,' ').slice(0,160),visible:!!el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden',interactive:el.matches('button,input,select,textarea,a,summary,[tabindex],[role=button],[role=tab],[role=menuitem],[role=slider],[role=switch]'),parent,attributes:a};}));
 const surfaces=await page.locator('.browser-task-card,.wsr-card,.observation-chart-card').evaluateAll(nodes=>nodes.slice(0,4).map(el=>{const s=getComputedStyle(el);return {className:el.className,bg:s.backgroundColor,border:s.borderColor,shadow:s.boxShadow,radius:s.borderRadius};}));
 const contracts=await page.evaluate(()=>window.crystraDesignContracts?.contracts||{});
 const unbound=elements.filter(e=>!contracts[e.attributes['data-design-contract']]);
 if(unbound.length)result.failures.push({name,error:'Unbound document contracts',elements:unbound.map(e=>e.id||e.label)});
 result.states.push({name,url:page.url(),elements,surfaces});console.log(name,elements.length);
};
const step=async(name,run)=>{try{await run();await snapshot(name);}catch(e){result.failures.push({name,error:e.message});console.log('FAILED',name,e.message.slice(0,150));}};
const goto=async file=>{await page.goto(new URL(file,import.meta.url).href);await page.waitForTimeout(350);};
try{
 await goto('crystra-task-work-v8-sidebar.html');await snapshot('task-all-static-workbenches');
 await step('task-sidebar-options',()=>page.locator('[data-section-id=task-view-options-action]').click());
 for(const kind of ['task-browser','workflow-explorer']){
  await goto(`crystra-${kind}-v8.html`);await snapshot(kind+'-gallery');
  await step(kind+'-card-menu',()=>page.locator('[data-card-more]').first().click());
  await step(kind+'-rename',()=>page.locator('[data-card-action=rename]').first().click());
  await page.keyboard.press('Escape');
  await step(kind+'-list',()=>page.locator('#browser-view-toggle-seat .wsr-toggle-switch').click());
  await step(kind+'-list-menu',()=>page.locator('#browser-list [data-card-more]').first().click());
 }
 await goto('crystra-analysis-audit-v8.html');await snapshot('analysis-overview');
 await step('analysis-calendar',()=>page.getByRole('button',{name:'选择日期范围',exact:true}).click());await page.keyboard.press('Escape');
 await step('analysis-layout-edit',()=>page.getByRole('button',{name:'编辑布局',exact:true}).click());
 await step('analysis-add-widget',()=>page.getByRole('button',{name:'添加 Widget',exact:true}).click());await page.keyboard.press('Escape');
 await goto('crystra-analysis-audit-v8.html?view=traces');await snapshot('analysis-waterfall');
 await step('analysis-tree',()=>page.getByRole('button',{name:'树图',exact:true}).click());
 await goto('crystra-analysis-audit-v8.html?view=reports');await snapshot('analysis-comparison');
 await step('analysis-setting-editor',()=>page.getByRole('button',{name:'修改设置',exact:true}).click());
 await step('analysis-metric-catalog',()=>page.getByRole('button',{name:'添加数据列',exact:true}).click());await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 await step('analysis-dataset',()=>page.getByRole('button',{name:'数据范围',exact:true}).click());await page.keyboard.press('Escape');
 await step('analysis-help',()=>page.getByRole('button',{name:'分析帮助',exact:true}).click());await page.keyboard.press('Escape');
 // Probe theme semantic values in a disposable page. No source assets are changed.
 await page.getByRole('button',{name:'修改设置',exact:true}).click();
 const probes=['.observation-chart-card','.observation-setting-name input','.result-analysis-help','.observation-settings-title','.result-analysis-layout'];
 const values=async()=>page.evaluate(selectors=>selectors.map(selector=>{const el=document.querySelector(selector);if(!el)return {selector,missing:true};const s=getComputedStyle(el);return {selector,bg:s.backgroundColor,color:s.color,border:s.borderColor,radius:s.borderRadius,shadow:s.boxShadow,gap:s.gap};}),probes);
 const before=await values();await page.addStyleTag({content:':root,.wsr-bi {--color-background-card:rgb(13,71,93)!important;--color-background-floating:rgb(13,71,93)!important;--color-background-inset:rgb(13,71,93)!important;--color-border-subtle:rgb(230,80,20)!important;--shape-panel:20px!important;--shape-control:16px!important;--layout-comparison-sidebar-gap:31px!important;--color-border-default:rgb(230,80,20)!important;}'});
 await page.waitForTimeout(400);result.themeProbe={before,after:await values()};
}finally{await browser.close();await writeFile(new URL('runtime-elements.json',out),JSON.stringify(result,null,2)+'\n');console.log('states',result.states.length,'failures',result.failures.length);}

if(result.failures.length)process.exitCode=1;
