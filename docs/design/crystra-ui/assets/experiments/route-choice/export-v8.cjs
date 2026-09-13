// Export generated geometry, never handwritten business coordinates. Preview-only adapter.
const fs=require('node:fs');const data=require('./layouts.json').map(({ir,groups,layouts})=>({ir,groups,layouts}));
const code=`(()=>{const data=${JSON.stringify(data).replaceAll('<','\\u003c')};
window.crystraWorkflowMapCandidate={samples:data.map(d=>d.ir),layout(ir,expanded,direction){
 const d=data.find(d=>JSON.stringify(d.ir)===JSON.stringify(ir));if(!d)return null;
 const mask=d.groups.reduce((m,id,i)=>m|(expanded.has(id)?1<<i:0),0),l=d.layouts[direction+mask];if(!l)return null;
 return {...l,edges:l.edges.map((e,i)=>{const semantic=ir.edges.find(s=>s.id===e.originalId),last=e.points.at(-1);let targetId=semantic.to;while(targetId&&!l.nodes.some(n=>n.id===targetId))targetId=ir.nodes.find(n=>n.id===targetId)?.parent;const target=l.nodes.find(n=>n.id===targetId&&!n.expanded);
 return {...e,id:e.originalId,segmentKey:e.originalId+':'+i,path:e.points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' '),arrow:!!target&&last.x>=target.x-.1&&last.x<=target.x+target.width+.1&&last.y>=target.y-.1&&last.y<=target.y+target.height+.1};})};
}};})();`;
fs.writeFileSync(__dirname+'/../../workflow-map-candidate.js',code);
