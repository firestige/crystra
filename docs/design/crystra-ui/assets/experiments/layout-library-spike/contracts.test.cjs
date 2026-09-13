const {test}=require('node:test');const assert=require('node:assert/strict');
const {project,makeConstraints}=require('./model.cjs');
const ir=require('../workflow-puzzle/fixtures/development.json');
test('scope projection preserves crossing-edge identities through explicit boundary nodes',()=>{
 const g=project(ir,'plan');assert(g.nodes.some(n=>n.id==='ask'));
 assert(!g.nodes.some(n=>n.id==='ready'));assert(g.edges.some(e=>e.id==='reconsider-design'));
 for(const e of g.edges){assert(g.nodes.some(n=>n.id===e.from));assert(g.nodes.some(n=>n.id===e.to));}
 assert.equal(g.edges.length,new Set(g.edges.map(e=>e.id)).size);
});
test('semantic recovery constraints permit alignment beside the triggering decision without business-name rules',()=>{
 const g={nodes:[{id:'a',kind:'decision',width:136,height:136},{id:'b',kind:'activity',width:160,height:88},{id:'c',kind:'activity',width:160,height:88}],edges:[{from:'a',to:'b',intent:'recovery',layoutRole:'advance'},{from:'a',to:'c',intent:'expected',layoutRole:'advance'}]};
 const cs=makeConstraints(g,'RIGHT',true);assert(cs.some(c=>c.axis==='x'&&c.left===0&&c.right===1&&c.equality&&c.gap===0));
 assert(cs.some(c=>c.axis==='y'&&c.left===0&&c.right===1&&c.gap>0));
 const down=makeConstraints(g,'DOWN',true);assert(down.some(c=>c.axis==='y'&&c.equality));
});
const {metrics}=require('./metrics.cjs');
test('measurement detects crossing, obstacle penetration and overlaps independently',()=>{
 const l={nodes:[{id:'a',x:10,y:10,width:10,height:10},{id:'b',x:12,y:10,width:10,height:10}],edges:[{id:'x',from:'other',to:'other2',points:[{x:0,y:10},{x:20,y:10}]},{id:'y',points:[{x:10,y:0},{x:10,y:20}]}]};
 const m=metrics(l);assert.equal(m.crossings,1);assert.equal(m.nodeOverlaps,1);assert.equal(m.blocked,4);assert.equal(m.nonOrthogonal,0);
});
test('recorded local outputs retain all projected nodes and edges and have finite orthogonal routes',()=>{
 for(const r of require('./results.json')){assert(!r.error);const original=require('../workflow-puzzle/fixtures/'+r.name+'.json');const g=project(original,r.scope);assert.deepEqual(r.layout.nodes.map(n=>n.id).sort(),g.nodes.map(n=>n.id).sort());assert.deepEqual(r.layout.edges.map(e=>e.id).sort(),g.edges.map(e=>e.id).sort());assert(r.metrics.finite);assert.equal(r.metrics.nonOrthogonal,0);assert.equal(r.metrics.missingRoutes,0);}
});
