import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {chromium}=require('playwright');
const url=new URL('./crystra-task-work-v8-sidebar.html',import.meta.url).href;
test('chart colors and effects remain independent when the page theme changes',async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
  const p=await browser.newPage({viewport:{width:1920,height:940}});
  await p.goto(url+'?surface=execution',{waitUntil:'networkidle'});
  const read=()=>p.locator('svg[role="img"]').evaluateAll(charts=>charts.map(chart=>({background:getComputedStyle(chart).backgroundColor,grid:getComputedStyle(chart).backgroundImage,nodes:[...chart.querySelectorAll('[fill],[stroke]')].map(e=>({fill:e.hasAttribute('fill')?getComputedStyle(e).fill:null,stroke:e.hasAttribute('stroke')?getComputedStyle(e).stroke:null,filter:getComputedStyle(e).filter}))})));
  const semantic=await read();
  // Exercise the CSS boundary directly; no product theme switcher is shipped.
  await p.evaluate(()=>document.documentElement.dataset.palette='original');
  assert.deepEqual(await read(),semantic);
 }finally {await browser.close();}
});
