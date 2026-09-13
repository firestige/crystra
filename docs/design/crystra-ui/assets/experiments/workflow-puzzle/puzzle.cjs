const path=require('node:path');
const ELK=require(path.resolve(__dirname,'../../../../../../wsr-ui/node_modules/elkjs/lib/elk.bundled.js'));
const elk=new ELK();
// Experimental compositor: each call to ELK receives a flat graph, not INCLUDE_CHILDREN.
async function buildPuzzle(ir,expanded,direction='RIGHT',config={}){
 const byId=new Map(ir.nodes.map(n=>[n.id,n]));
 const inside=(id,group)=>{if(!group)return true;while(id){if(id===group)return true;id=byId.get(id)?.parent;}return false;};
 const side=(e,endpoint)=>config.edgeSides?.[e.id]||((e.layoutRole?e.layoutRole==='return'||e.intent==='exit':e.intent&&e.intent!=='expected')?(direction==='RIGHT'?(e.intent==='recovery'?'SOUTH':'NORTH'):(e.intent==='recovery'?'EAST':'WEST')):direction==='RIGHT'?(endpoint==='to'?'WEST':'EAST'):(endpoint==='to'?'NORTH':'SOUTH'));
 const pid=(group,edge)=>JSON.stringify(['interface',group,edge]);
 const interfaces=ir.nodes.filter(n=>n.kind==='group').flatMap(g=>ir.edges.filter(e=>inside(e.from,g.id)!==inside(e.to,g.id)).map(e=>({id:pid(g.id,e.id),group:g.id,edgeId:e.id,direction:inside(e.to,g.id)?'in':'out',side:side(e,inside(e.to,g.id)?'to':'from'),target:inside(e.to,g.id)?e.to:e.from,external:inside(e.to,g.id)?e.from:e.to})));
 const baseOptions={'elk.algorithm':'layered','elk.direction':direction,'elk.edgeRouting':'ORTHOGONAL','elk.hierarchyHandling':'SEPARATE_CHILDREN','elk.layered.mergeEdges':'false','elk.spacing.nodeNode':'36','elk.layered.spacing.nodeNodeBetweenLayers':'40','elk.spacing.edgeNode':'28','elk.layered.spacing.edgeNodeBetweenLayers':'28','elk.spacing.edgeEdge':'20','elk.layered.spacing.edgeEdgeBetweenLayers':'20','elk.spacing.portPort':'24','elk.randomSeed':'17','elk.layered.cycleBreaking.strategy':'GREEDY','elk.padding':'[top=64,left=56,bottom=56,right=56]'};
 const fixedPorts=(entries,w,h,kind,nodeId)=>['NORTH','EAST','SOUTH','WEST'].flatMap(s=>{
  const list=entries.filter(p=>p.side===s).sort((a,b)=>a.id.localeCompare(b.id));if(config.portFlips?.[JSON.stringify([nodeId,s])])list.reverse();const horizontal=s==='EAST'||s==='WEST',extent=horizontal?h:w,depth=horizontal?w:h;
  return list.map((p,i)=>{const offset=(i-(list.length-1)/2)*Math.min(24,(extent-32)/Math.max(1,list.length-1));const contour=kind==='decision'?1-Math.abs(offset)/(extent/2):kind==='start'||kind==='end'?Math.sqrt(1-(offset/(extent/2))**2):1;const along=depth/2+(['EAST','SOUTH'].includes(s)?1:-1)*depth/2*contour;return {id:p.id,x:horizontal?along:extent/2+offset,y:horizontal?extent/2+offset:along,width:0,height:0,layoutOptions:{'elk.port.side':s,'elk.port.borderOffset':String(-depth/2*(1-contour))}};});
 });
 async function block(group){
  const direct=ir.nodes.filter(n=>n.parent===group).sort((a,b)=>a.id.localeCompare(b.id));
  const owner=id=>{if(!inside(id,group))return null;while(byId.get(id)?.parent!==group){id=byId.get(id)?.parent;if(!id)return null;}return id;};
  const connections=ir.edges.filter(e=>{const a=owner(e.from),b=owner(e.to);return (a||b)&&a!==b;});
  const children=[],subBlocks=new Map();
  for(const n of direct){
   if(n.kind==='group'&&expanded.has(n.id)){
    const child=await block(n.id);subBlocks.set(n.id,child);
    children.push({id:n.id,width:child.width,height:child.height,ports:child.ports.map(p=>({...p})),layoutOptions:{'elk.portConstraints':'FIXED_POS'}});continue;
   }
   const w=['start','end'].includes(n.kind)?48:['fork','join'].includes(n.kind)?(direction==='RIGHT'?14:120):Math.max(160,n.title.length*16+40),h=['start','end'].includes(n.kind)?48:['fork','join'].includes(n.kind)?(direction==='RIGHT'?96:14):n.kind==='decision'?136:88;
   const entries=n.kind==='group'?interfaces.filter(i=>i.group===n.id):connections.flatMap(e=>['from','to'].filter(end=>owner(e[end])===n.id).map(end=>({id:JSON.stringify(['endpoint',n.id,e.id,end]),side:side(e,end)})));
   const constrained=['group','decision','start','end'].includes(n.kind);
   children.push({id:n.id,width:w,height:h,layoutOptions:{'elk.portConstraints':constrained||Object.keys(config.portFlips||{}).some(k=>JSON.parse(k)[0]===n.id)?'FIXED_POS':'FIXED_SIDE',...(n.kind==='start'?{'elk.layered.layering.layerConstraint':'FIRST_SEPARATE'}:n.kind==='end'?{'elk.layered.layering.layerConstraint':'LAST_SEPARATE'}:{})},ports:fixedPorts(entries,w,h,n.kind,n.id)});
  }
  const own=interfaces.filter(i=>i.group===group);
  const endpoint=(e,end)=>{const node=owner(e[end]);if(!node)return pid(group,e.id);return byId.get(node).kind==='group'?pid(node,e.id):JSON.stringify(['endpoint',node,e.id,end]);};
  const edges=connections.map(e=>{const label=e.label||'';const lines=label.match(/.{1,7}/gu)||[];return {id:e.id,sources:[endpoint(e,e.layoutRole==='return'?'to':'from')],targets:[endpoint(e,e.layoutRole==='return'?'from':'to')],...(label?{labels:[{text:lines.join('\n'),width:Math.min(98,label.length*14)+12,height:lines.length*20+8}]}:{})};});
  const model={id:'$wrapper',layoutOptions:baseOptions,children:[{id:group||'$root',layoutOptions:{...baseOptions,...(config.nodePlacement?.[group||'$root']?{'elk.layered.nodePlacement.strategy':config.nodePlacement[group||'$root']}:{}),'elk.portConstraints':'FIXED_SIDE'},ports:own.map(p=>({id:p.id,width:0,height:0,layoutOptions:{'elk.port.side':p.side}})),children,edges}]};
  const result=(await elk.layout(structuredClone(model))).children[0];

  const nodes=[],segments=[],boundaries=[];
  for(const n of result.children){nodes.push({id:n.id,x:n.x,y:n.y,width:n.width,height:n.height,expanded:subBlocks.has(n.id),parent:group});const child=subBlocks.get(n.id);if(child){nodes.push(...child.nodes.map(x=>({...x,x:x.x+n.x,y:x.y+n.y})));segments.push(...child.edges.map(e=>({...e,points:e.points.map(p=>({x:p.x+n.x,y:p.y+n.y})),...(e.label?{label:{...e.label,x:e.label.x+n.x,y:e.label.y+n.y}}:{})})));boundaries.push(...child.boundaries.map(p=>({...p,x:p.x+n.x,y:p.y+n.y})));}}
  for(const e of result.edges||[])for(const section of e.sections||[])segments.push({originalId:e.id,scope:group,points:ir.edges.find(x=>x.id===e.id)?.layoutRole==='return'?[section.endPoint,...(section.bendPoints||[]).slice().reverse(),section.startPoint]:[section.startPoint,...section.bendPoints||[],section.endPoint],label:e.labels?.[0]});
  for(const p of result.ports||[]){const semantic=interfaces.find(i=>i.id===p.id);boundaries.push({...semantic,x:p.x,y:p.y});}
  return {width:result.width,height:result.height,ports:result.ports||[],nodes,edges:segments,boundaries};
 }
 return {...await block(undefined),interfaces};
}
module.exports={buildPuzzle};
