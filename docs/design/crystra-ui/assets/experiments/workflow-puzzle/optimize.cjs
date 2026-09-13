const {buildPuzzle}=require('./puzzle.cjs');
function quality(l){
 const segments=l.edges.flatMap(e=>e.points.slice(1).map((p,i)=>({id:e.originalId,a:e.points[i],b:p})));let crossings=0,overlap=0,clearanceDeficit=0,blocked=0,labelCollisions=0;const pairs=[];
 for(let i=0;i<segments.length;i++)for(let j=i+1;j<segments.length;j++){
  const a=segments[i],b=segments[j];if(a.id===b.id)continue;
  const h=a.a.y===a.b.y?a:b,v=h===a?b:a;
  if(h.a.y===h.b.y&&v.a.x===v.b.x&&v.a.x>Math.min(h.a.x,h.b.x)+.01&&v.a.x<Math.max(h.a.x,h.b.x)-.01&&h.a.y>Math.min(v.a.y,v.b.y)+.01&&h.a.y<Math.max(v.a.y,v.b.y)-.01){crossings++;pairs.push([a.id,b.id]);}
  for(const axis of ['x','y']){const other=axis==='x'?'y':'x';if(a.a[axis]!==a.b[axis]||b.a[axis]!==b.b[axis])continue;const gap=Math.abs(a.a[axis]-b.a[axis]),shared=Math.min(Math.max(a.a[other],a.b[other]),Math.max(b.a[other],b.b[other]))-Math.max(Math.min(a.a[other],a.b[other]),Math.min(b.a[other],b.b[other]));if(gap<12&&shared>1){clearanceDeficit+=(12-gap)*shared;pairs.push([a.id,b.id]);}}
  if(a.a.y===a.b.y&&b.a.y===b.b.y&&Math.abs(a.a.y-b.a.y)<.01)overlap+=Math.max(0,Math.min(Math.max(a.a.x,a.b.x),Math.max(b.a.x,b.b.x))-Math.max(Math.min(a.a.x,a.b.x),Math.min(b.a.x,b.b.x)));
  if(a.a.x===a.b.x&&b.a.x===b.b.x&&Math.abs(a.a.x-b.a.x)<.01)overlap+=Math.max(0,Math.min(Math.max(a.a.y,a.b.y),Math.max(b.a.y,b.b.y))-Math.max(Math.min(a.a.y,a.b.y),Math.min(b.a.y,b.b.y)));
 }
 for(const n of l.nodes.filter(n=>!n.expanded)){
  for(const s of segments){const ends=[s.a,s.b];if(ends.some(p=>p.x>=n.x-.01&&p.x<=n.x+n.width+.01&&p.y>=n.y-.01&&p.y<=n.y+n.height+.01))continue;
   if(s.a.y===s.b.y&&s.a.y>n.y+.01&&s.a.y<n.y+n.height-.01&&Math.max(s.a.x,s.b.x)>n.x&&Math.min(s.a.x,s.b.x)<n.x+n.width)blocked++;
   if(s.a.x===s.b.x&&s.a.x>n.x+.01&&s.a.x<n.x+n.width-.01&&Math.max(s.a.y,s.b.y)>n.y&&Math.min(s.a.y,s.b.y)<n.y+n.height)blocked++;
  }
  for(const {label:r}of l.edges)if(r&&r.x<n.x+n.width&&r.x+r.width>n.x&&r.y<n.y+n.height&&r.y+r.height>n.y)labelCollisions++;
 }
 return {crossings,pairs,overlap,clearanceDeficit,blocked,labelCollisions,bends:segments.length,length:segments.reduce((n,s)=>n+Math.abs(s.a.x-s.b.x)+Math.abs(s.a.y-s.b.y),0)};
}
function better(a,b){for(const k of ['blocked','labelCollisions','crossings','clearanceDeficit','overlap','bends','length']){if(Math.abs(a[k]-b[k])>.01)return a[k]<b[k];}return false;}
async function optimizePuzzle(ir,direction='RIGHT'){
 const expanded=new Set(ir.nodes.filter(n=>n.kind==='group').map(n=>n.id));let config={},layout=await buildPuzzle(ir,expanded,direction,config),q=quality(layout);const baseline={...q},accepted=[];let evaluated=1;
 for(let round=0;round<7&&(q.crossings||q.clearanceDeficit);round++){
  const bad=new Set(q.pairs.flat()),nodes=new Set(ir.edges.filter(e=>bad.has(e.id)).flatMap(e=>[e.from,e.to]));const candidates=[];
  for(const e of ir.edges.filter(e=>bad.has(e.id)&&(e.layoutRole==='return'||e.intent==='exit'))){for(const side of direction==='RIGHT'?['NORTH','SOUTH']:['WEST','EAST'])if(config.edgeSides?.[e.id]!==side)candidates.push({kind:'side',edge:e.id,side,config:{...config,edgeSides:{...config.edgeSides,[e.id]:side}}});}
  for(const id of nodes)for(const side of ['NORTH','EAST','SOUTH','WEST']){const key=JSON.stringify([id,side]);candidates.push({kind:'order',node:id,side,config:{...config,portFlips:{...config.portFlips,[key]:!config.portFlips?.[key]}}});}
  for(const scope of new Set(layout.edges.filter(e=>bad.has(e.originalId)).map(e=>e.scope||'$root')))for(const strategy of ['NETWORK_SIMPLEX','LINEAR_SEGMENTS','SIMPLE'])if(config.nodePlacement?.[scope]!==strategy)candidates.push({kind:'placement',scope,strategy,config:{...config,nodePlacement:{...config.nodePlacement,[scope]:strategy}}});
  let winner=null;
  for(const c of candidates){try{const next=await buildPuzzle(ir,expanded,direction,c.config);evaluated++;const score=quality(next);if(better(score,winner?.q||q))winner={...c,layout:next,q:score};}catch{/* A failed engine candidate is rejected, never rendered. */}}
  if(!winner)break;({config,layout,q}=winner);accepted.push({kind:winner.kind,edge:winner.edge,node:winner.node,side:winner.side,scope:winner.scope,strategy:winner.strategy,score:q});
 }
 return {config,layout,baseline,quality:q,accepted,evaluated};
}
module.exports={quality,optimizePuzzle};
