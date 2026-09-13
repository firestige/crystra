const {test}=require('node:test'),assert=require('node:assert/strict');
const data=require('./branch-results.json');const {quality}=require('../workflow-puzzle/optimize.cjs');
test('auxiliary excursions stay next to their triggering decision without new crossings',()=>{
 for(const d of data)for(const direction of ['RIGHT','DOWN']){const l=d.layouts[direction+(2**d.groups.length-1)];const q=quality(l);assert.equal(q.crossings,0,d.name+' '+direction);assert.equal(q.overlap,0);assert.equal(q.blocked,0);
 for(const b of l.branchBlocks){const a=l.nodes.find(n=>n.id===b.trigger),h=l.nodes.find(n=>n.id===b.handler);assert.ok(direction==='RIGHT'?h.y>=a.y+a.height:h.x>=a.x+a.width);assert.ok(Math.abs(direction==='RIGHT'?a.x+a.width/2-h.x-h.width/2:a.y+a.height/2-h.y-h.height/2)<32);}
 }
});
test('all 56 states retain semantic interfaces, endpoints and non-overlapping geometry',()=>{
 let count=0;
 for(const d of data)for(const [key,l]of Object.entries(d.layouts)){count++;const baseline=d.baseline[key];assert.deepEqual(l.interfaces,baseline.interfaces);
 assert.deepEqual(l.nodes.map(n=>n.id).sort(),baseline.nodes.map(n=>n.id).sort());assert.deepEqual([...new Set(l.edges.map(e=>e.originalId))].sort(),[...new Set(baseline.edges.map(e=>e.originalId))].sort());
 const q=quality(l);assert.ok(q.crossings<=quality(baseline).crossings);assert.equal(q.blocked,0);assert.equal(q.overlap,0);assert.equal(q.labelCollisions,0);
 for(const b of l.boundaries){const endpoints=l.edges.filter(e=>e.originalId===b.edgeId).flatMap(e=>[e.points[0],e.points.at(-1)]);assert.ok(endpoints.filter(p=>Math.hypot(p.x-b.x,p.y-b.y)<.01).length>=2,'broken interface '+key+' '+b.id);}
 for(const e of l.edges)for(let i=1;i<e.points.length;i++){const p=e.points[i],a=e.points[i-1];assert.ok([p.x,p.y].every(Number.isFinite));assert.ok(Math.abs(p.x-a.x)<.01||Math.abs(p.y-a.y)<.01,'nonorthogonal');}
 for(const a of l.nodes.filter(n=>!n.expanded))for(const b of l.nodes.filter(n=>!n.expanded&&n.id>a.id))assert.ok(a.x+a.width<=b.x+.01||b.x+b.width<=a.x+.01||a.y+a.height<=b.y+.01||b.y+b.height<=a.y+.01,'node overlap '+a.id+' '+b.id);
 for(const e of d.ir.edges){for(const end of ['from','to']){const n=l.nodes.find(n=>n.id===e[end]&&!n.expanded);if(!n)continue;const candidates=l.edges.filter(x=>x.originalId===e.id).map(x=>end==='from'?x.points[0]:x.points.at(-1));assert.ok(candidates.some(p=>p.x>=n.x-.01&&p.x<=n.x+n.width+.01&&p.y>=n.y-.01&&p.y<=n.y+n.height+.01),'detached '+e.id);}}
 }
 assert.equal(count,56);
});
test('renamed and resized workflows use the same structural rule; ambiguous handlers stay untouched',async()=>{
 const {buildBranchBlocks}=require('./branch-block.cjs');
 for(const sample of data){const ir=structuredClone(sample.ir),before=JSON.stringify(ir),rename=id=>'renamed::'+id;
 for(const n of ir.nodes){n.id=rename(n.id);if(n.parent)n.parent=rename(n.parent);if(n.kind==='activity')n.title+='（扩展名称）';}for(const e of ir.edges){e.id=rename(e.id);e.from=rename(e.from);e.to=rename(e.to);}
 const renamedBefore=JSON.stringify(ir),l=await buildBranchBlocks(ir,new Set(ir.nodes.filter(n=>n.kind==='group').map(n=>n.id)));
 assert.equal(JSON.stringify(ir),renamedBefore);assert.equal(l.branchBlocks.length,sample.layouts['RIGHT'+(2**sample.groups.length-1)].branchBlocks.length);assert.ok(l.nodes.every(n=>n.id.startsWith('renamed::')));
 assert.equal(JSON.stringify(sample.ir),before);
 }
 const ir=structuredClone(data[0].ir);ir.edges.push({id:'additional-entry',from:'read',to:'ask',intent:'recovery',layoutRole:'advance'});const l=await buildBranchBlocks(ir,new Set(data[0].groups));assert.equal(l.branchBlocks.length,0);
});
test('transparent branch seams keep main flow straight and render each condition once',()=>{
 for(const d of data)for(const direction of ['RIGHT','DOWN']){const l=d.layouts[direction+(2**d.groups.length-1)];
 for(const b of l.branchBlocks){const trigger=l.nodes.find(n=>n.id===b.trigger);for(const e of d.ir.edges.filter(e=>e.intent==='expected'&&(e.from===b.trigger||e.to===b.trigger))){const segments=l.edges.filter(s=>s.originalId===e.id);assert.ok(segments.filter(s=>s.label).length<=d.baseline[direction+(2**d.groups.length-1)].edges.filter(s=>s.originalId===e.id&&s.label).length);const points=segments.flatMap(s=>s.points);const spread=Math.max(...points.map(p=>direction==='RIGHT'?p.y:p.x))-Math.min(...points.map(p=>direction==='RIGHT'?p.y:p.x));
 // Only incoming/outgoing links fully inside this real scope are a straight-mainline assertion.
 const other=d.ir.nodes.find(n=>n.id===(e.from===b.trigger?e.to:e.from));if(other.parent===trigger.parent)assert.ok(spread<.01,d.name+' main line dogleg '+e.id);
 }}
 }
});
test('an unobstructed auxiliary return has no seam-induced detour',()=>{
 for(const d of data)for(const direction of ['RIGHT','DOWN']){const l=d.layouts[direction+(2**d.groups.length-1)];
 for(const b of l.branchBlocks){let remaining=l.edges.filter(e=>e.originalId===b.returnEdge).map(e=>e.points.slice());const handler=l.nodes.find(n=>n.id===b.handler);
 const near=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<.01;
 const onHandler=p=>p.x>=handler.x-.01&&p.x<=handler.x+handler.width+.01&&p.y>=handler.y-.01&&p.y<=handler.y+handler.height+.01;
 const first=remaining.findIndex(p=>onHandler(p[0]));assert.ok(first>=0);const points=remaining.splice(first,1)[0];while(remaining.length){const next=remaining.findIndex(p=>near(p[0],points.at(-1)));assert.ok(next>=0,'return continuity');points.push(...remaining.splice(next,1)[0].slice(1));}
 const reduced=[];for(const p of points){if(reduced.length&&near(reduced.at(-1),p))continue;while(reduced.length>1){const a=reduced.at(-2),z=reduced.at(-1);if(Math.abs((z.x-a.x)*(p.y-z.y)-(z.y-a.y)*(p.x-z.x))>.01)break;reduced.pop();}reduced.push(p);}
 const edge=d.ir.edges.find(e=>e.id===b.returnEdge),target=l.nodes.find(n=>n.id===edge.to),start=reduced[0],end=reduced.at(-1);
 const corner=direction==='RIGHT'?{x:end.x,y:start.y}:{x:start.x,y:end.y};
 const contains=(n,p)=>p.x>=n.x&&p.x<=n.x+n.width&&p.y>=n.y&&p.y<=n.y+n.height;
 const blocked=l.nodes.filter(n=>n.id!==handler.id&&n.id!==target.id&&!contains(n,start)&&!contains(n,end)).some(n=>{
  const gap=28,x=n.x-gap,y=n.y-gap,w=n.width+2*gap,h=n.height+2*gap;
  return direction==='RIGHT'?start.y>y&&start.y<y+h&&Math.max(start.x,corner.x)>x&&Math.min(start.x,corner.x)<x+w:start.x>x&&start.x<x+w&&Math.max(start.y,corner.y)>y&&Math.min(start.y,corner.y)<y+h;
 });
 if(!blocked)assert.ok(reduced.length<=3,d.name+' '+direction+' unnecessary return corners: '+JSON.stringify(reduced));
 }
 }
});
