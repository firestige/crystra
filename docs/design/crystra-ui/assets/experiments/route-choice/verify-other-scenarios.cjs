const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(path.resolve(__dirname,'../../../../../../wsr-ui/node_modules/playwright'));
const data=require('./layouts.json'),audits=require('./candidates.json');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('file://'+__dirname+'/preview.html');
for(const [index,name]of [[1,'architecture'],[2,'research']]){
 const d=data[index];
 for(const direction of ['RIGHT','DOWN']){
  await page.selectOption('#sample',String(index));await page.selectOption('#direction',direction);await page.selectOption('#variant','candidate');
  for(const scope of [null,...d.groups]){
   await page.click('#collapse');if(scope)await page.locator('[data-enter="'+scope+'"]').click();
   const before=await page.locator('#canvas').getAttribute('viewBox');const p=await page.locator('#canvas').boundingBox();await page.mouse.move(p.x+20,p.y+20);await page.mouse.down();await page.mouse.move(p.x+80,p.y+70,{steps:4});await page.mouse.up();await page.click('#fit');assert.equal(await page.locator('#canvas').getAttribute('viewBox'),before);
   await page.screenshot({path:__dirname+'/'+name+'-'+direction+'-'+(scope||'overview')+'.png'});checks.push({name,direction,scope,focusRestored:true});
   if(scope){await page.locator('[data-toggle="'+scope+'"]').click();assert.equal(await page.locator('[data-toggle="'+scope+'"][aria-label^="收起"]').count(),0);}
  }
  await page.locator('[data-enter=""]').click();await page.click('#all');await page.screenshot({path:__dirname+'/'+name+'-'+direction+'-all.png'});checks.push({name,direction,scope:'all'});
 }
 // Render every exported state and compare actual displayed semantic nodes.
 for(const [key,l]of Object.entries(d.layouts)){const direction=key.startsWith('RIGHT')?'RIGHT':'DOWN',mask=+key.slice(direction.length);await page.evaluate(({index,direction:dir,mask:bits})=>{sample=index;direction=dir;mask=bits;scope=null;render(true);},{index,direction,mask});const count=await page.locator('#canvas .node').count();assert.equal(count,l.nodes.filter(n=>!n.expanded).length,name+' '+key);
 const badCaptions=await page.evaluate(()=>{const l=layout();return [...document.querySelectorAll('#canvas [data-node]')].flatMap(el=>{const n=l.nodes.find(n=>n.id===el.dataset.node);if(!n.caption)return [];const r=el.querySelector('.node-title').getBBox(),b=n.caption;return r.x<b.x-1||r.y<b.y-1||r.x+r.width>b.x+b.width+1||r.y+r.height>b.y+b.height+1?[{id:n.id,box:b,actual:{x:r.x,y:r.y,width:r.width,height:r.height}}]:[];});});assert.deepEqual(badCaptions,[],name+' '+key+' text escaped measured bounds');}
}
assert.deepEqual(errors,[]);const choices=audits.filter(a=>a.sample!=='development').map(a=>({sample:a.sample,key:a.key,scope:a.scope,chosen:a.chosen,validCandidates:a.candidates.filter(c=>c.valid).length,score:a.score}));
fs.writeFileSync(__dirname+'/other-scenarios-check.json',JSON.stringify({errors,renderedStates:24,checks,choices},null,2));console.log('24 states, 18 scope/direction screenshots; focus restore and collapse passed');
}finally{await browser.close();}})();
