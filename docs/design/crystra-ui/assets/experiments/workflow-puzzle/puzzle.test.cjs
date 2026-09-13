const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {buildPuzzle}=require('./puzzle.cjs');
const domain=path.resolve(__dirname,'../../../../../../wsr-ui/packages/bi/src/domain');
for(const name of ['development','architecture','research'])for(const direction of ['RIGHT','DOWN'])test(name+' '+direction+' preserves interfaces and semantic edges',async()=>{
 const ir=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures',name+'.json'))),before=JSON.stringify(ir);
 const a=await buildPuzzle(ir,new Set(),direction),b=await buildPuzzle(ir,new Set(ir.nodes.filter(n=>n.kind==='group').map(n=>n.id)),direction);
 assert.equal(JSON.stringify(ir),before);
 assert.deepEqual(a.interfaces,b.interfaces);
 assert.deepEqual([...new Set(b.edges.map(e=>e.originalId))].sort(),ir.edges.map(e=>e.id).sort());
 for(const e of b.edges)for(let i=1;i<e.points.length;i++)assert.ok(Math.abs(e.points[i].x-e.points[i-1].x)<.01||Math.abs(e.points[i].y-e.points[i-1].y)<.01,'non orthogonal '+e.originalId);
 for(const a of b.nodes.filter(n=>!n.expanded))for(const c of b.nodes.filter(n=>!n.expanded&&n.id>a.id))assert.ok(a.x+a.width<=c.x+.01||c.x+c.width<=a.x+.01||a.y+a.height<=c.y+.01||c.y+c.height<=a.y+.01,'overlap');
 for(const boundary of b.boundaries){const ends=b.edges.filter(e=>e.originalId===boundary.edgeId).flatMap(e=>[e.points[0],e.points.at(-1)]);assert.ok(ends.filter(p=>Math.hypot(p.x-boundary.x,p.y-boundary.y)<.01).length>=2,'disconnected interface '+boundary.id);}
});
test('external activity size changes do not rearrange a built child',async()=>{
 const ir=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures','development.json')));const expanded=new Set(['plan']);
 const first=await buildPuzzle(ir,expanded);ir.nodes.find(n=>n.id==='work').title='外部活动名称变得非常长但不应该重新排列当前子流程';const second=await buildPuzzle(ir,expanded);
 const local=l=>{const g=l.nodes.find(n=>n.id==='plan');return l.nodes.filter(n=>n.parent==='plan').map(n=>[n.id,n.x-g.x,n.y-g.y,n.width,n.height]);};assert.deepEqual(local(first),local(second));
});

test('declared progression stays forward at every expanded level',async()=>{
 for(const name of ['development','architecture','research'])for(const direction of ['RIGHT','DOWN']){
 const ir=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures',name+'.json')));const l=await buildPuzzle(ir,new Set(ir.nodes.filter(n=>n.kind==='group').map(n=>n.id)),direction);
 for(const e of ir.edges.filter(e=>e.layoutRole==='advance')){const a=l.nodes.find(n=>n.id===e.from),b=l.nodes.find(n=>n.id===e.to);assert.ok(direction==='RIGHT'?a.x+a.width<=b.x+.01:a.y+a.height<=b.y+.01,'forward order reversed '+name+' '+e.id);}
 const start=l.nodes.find(n=>ir.nodes.find(x=>x.id===n.id).kind==='start');for(const n of l.nodes.filter(n=>n.id!==start.id))assert.ok(direction==='RIGHT'?start.x<n.x:start.y<n.y,'start is buried');
 }
});
test('candidate search resolves the reported branch and return crossings without losing boundaries',async()=>{
 const {optimizePuzzle,quality}=require('./optimize.cjs');const ir=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures','development.json')));
 const {layout,config}=await optimizePuzzle(ir,'RIGHT');assert.equal(quality(layout).clearanceDeficit,0,'parallel routes are visually indistinguishable');
 for(const scope of ['plan','work','tdd'])assert.equal(quality({...layout,edges:layout.edges.filter(e=>e.scope===scope)}).crossings,0,scope+' crossing remains');
 const collapsed=await buildPuzzle(ir,new Set(),'RIGHT',config);assert.deepEqual(collapsed.interfaces,layout.interfaces);
 for(const boundary of layout.boundaries){const ends=layout.edges.filter(e=>e.originalId===boundary.edgeId).flatMap(e=>[e.points[0],e.points.at(-1)]);assert.ok(ends.filter(p=>Math.hypot(p.x-boundary.x,p.y-boundary.y)<.01).length>=2,'disconnected interface');}
});
test('all exported states keep negotiated interfaces and orthogonal geometry',()=>{
 const samples=JSON.parse(fs.readFileSync(path.join(__dirname,'layouts.json')));let checked=0;
 for(const sample of samples)for(const direction of ['RIGHT','DOWN']){
  const contract=sample.layouts[direction+'0'].interfaces;
  for(const [key,l]of Object.entries(sample.layouts).filter(([key])=>key.startsWith(direction))){checked++;assert.deepEqual(l.interfaces,contract);
   for(const e of l.edges){for(const p of e.points)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));for(let i=1;i<e.points.length;i++)assert.ok(Math.abs(e.points[i].x-e.points[i-1].x)<.01||Math.abs(e.points[i].y-e.points[i-1].y)<.01,key+' non orthogonal');}
   for(const b of l.boundaries){const ends=l.edges.filter(e=>e.originalId===b.edgeId).flatMap(e=>[e.points[0],e.points.at(-1)]);assert.ok(ends.filter(p=>Math.hypot(p.x-b.x,p.y-b.y)<.01).length>=2,'disconnected '+key+' '+b.id);}
   for(const a of l.nodes.filter(n=>!n.expanded))for(const b of l.nodes.filter(n=>!n.expanded&&n.id>a.id))assert.ok(a.x+a.width<=b.x+.01||b.x+b.width<=a.x+.01||a.y+a.height<=b.y+.01||b.y+b.height<=a.y+.01,'node overlap '+key);
  }
 }assert.equal(checked,56);
});
