const {test}=require('node:test'),assert=require('node:assert/strict');
const {chooseRoutes}=require('./route-choice.cjs');
const fixture=()=>({ir:{nodes:[{id:'source',kind:'activity'},{id:'target',kind:'activity'}],edges:[{id:'r',from:'source',to:'target',intent:'recovery'}]},layout:{width:700,height:500,nodes:[{id:'source',x:400,y:300,width:160,height:88},{id:'target',x:60,y:60,width:160,height:88}],edges:[],interfaces:[],boundaries:[]}});
test('enumerates all 16 faces and selects a different outlet when an obstacle blocks the short route',async()=>{
 const f=fixture(),a=await chooseRoutes(f.ir,f.layout,['r']);assert.equal(a.audit.candidates.length,16);assert.equal(a.audit.chosen[0].fromSide,'WEST');
 f.layout.nodes.push({id:'wall',x:250,y:160,width:70,height:290});f.ir.nodes.push({id:'wall',kind:'activity'});
 const b=await chooseRoutes(f.ir,f.layout,['r']);assert.notEqual(b.audit.chosen[0].fromSide,'WEST');assert.equal(b.audit.candidates.length,16);
});
test('routing preserves nodes and unrelated lines and is invariant to renaming',async()=>{
 const f=fixture(),before=structuredClone(f.layout);const a=await chooseRoutes(f.ir,f.layout,['r']);assert.deepEqual(f.layout,before);assert.deepEqual(a.layout.nodes,before.nodes);
 f.ir.nodes.forEach(n=>n.id='new-'+n.id);f.ir.edges.forEach(e=>{e.id='new-'+e.id;e.from='new-'+e.from;e.to='new-'+e.to;});f.layout.nodes.forEach(n=>n.id='new-'+n.id);
 const b=await chooseRoutes(f.ir,f.layout,['new-r']);assert.deepEqual(a.layout.edges[0].points,b.layout.edges[0].points);
});
test('rotating the geometry rotates the chosen outlet instead of keeping WEST',async()=>{
 const f=fixture();f.layout.nodes=f.layout.nodes.map(n=>({...n,x:500-n.y-n.height,y:n.x,width:n.height,height:n.width}));f.layout.width=500;f.layout.height=700;
 const r=await chooseRoutes(f.ir,f.layout,['r']);assert.equal(r.audit.chosen[0].fromSide,'NORTH');
});
test('two related returns are scored jointly across all 256 face combinations',async()=>{
 const f=fixture();f.ir.nodes.push({id:'s2',kind:'activity'},{id:'t2',kind:'activity'});f.ir.edges.push({id:'r2',from:'s2',to:'t2',intent:'rework'});
 f.layout.height=650;f.layout.nodes.push({id:'s2',x:440,y:480,width:160,height:88},{id:'t2',x:60,y:240,width:160,height:88});
 const r=await chooseRoutes(f.ir,f.layout,['r','r2']);assert.equal(r.audit.candidates.length,256);assert.equal(r.audit.score,Math.min(...r.audit.candidates.filter(c=>c.valid).map(c=>c.score)));assert.equal(r.layout.edges.length,2);
});
test('all real sample states preserve geometry and all unrelated route segments',()=>{
 const data=require('./layouts.json'),audits=require('./candidates.json');assert.equal(audits.length,32);assert.equal(audits.reduce((n,a)=>n+a.candidates.length,0),512);
 let count=0;for(const d of data)for(const [key,l]of Object.entries(d.layouts)){count++;const old=d.baseline[key];assert.deepEqual(l.nodes,old.nodes);assert.deepEqual(l.boundaries,old.boundaries);assert.deepEqual(l.interfaces,old.interfaces);
 const ids=new Set(audits.filter(a=>a.sample===d.name&&a.key===key).flatMap(a=>a.ids));assert.deepEqual(l.edges.filter(e=>!ids.has(e.originalId)),old.edges.filter(e=>!ids.has(e.originalId)));
 }assert.equal(count,56);
 for(const a of audits){assert.equal(a.score,Math.min(...a.candidates.filter(c=>c.valid).map(c=>c.score)));const win=a.candidates.find(c=>c.valid&&c.score===a.score);assert.equal(win.crossings,0);assert.equal(win.overlap,0);}
});
