const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('v8 candidate preserves all 56 engine layouts and rejects stale edited IR',()=>{
 const window={};vm.runInNewContext(fs.readFileSync(__dirname+'/../../workflow-map-candidate.js','utf8'),{window});const adapter=window.crystraWorkflowMapCandidate;
 const sources=require('./layouts.json');let count=0;
 for(const d of sources)for(const [key,l]of Object.entries(d.layouts)){
 const dir=key.startsWith('RIGHT')?'RIGHT':'DOWN',mask=+key.slice(dir.length),expanded=d.groups.filter((_,i)=>mask&(1<<i));
 const got=adapter.layout(d.ir,new Set(expanded),dir);assert.equal(got.nodes.length,l.nodes.length);assert.equal(got.edges.length,l.edges.length);assert.equal(got.boundaries.length,l.boundaries.length);assert.equal(JSON.stringify(got.nodes),JSON.stringify(l.nodes));count++;
 }
 assert.equal(count,56);assert.ok(adapter.layout(sources[0].ir,new Set(),'RIGHT').edges.filter(e=>e.arrow).length>=6);const changed=structuredClone(sources[0].ir);changed.nodes[0].title+=' changed';assert.equal(adapter.layout(changed,new Set(),'RIGHT'),null);
});
