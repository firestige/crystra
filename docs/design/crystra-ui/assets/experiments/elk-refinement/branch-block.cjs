const {buildPuzzle}=require('./puzzle-candidate.cjs');
// Candidate composition policy: a single auxiliary excursion is placed in a
// transverse ELK block with its triggering decision. No activity IDs or coordinates.
async function buildBranchBlocks(ir,expanded,direction='RIGHT',config={}){
 const input=structuredClone(ir),byId=new Map(input.nodes.map(n=>[n.id,n]));
 const main=new Set(input.edges.filter(e=>e.intent==='expected').flatMap(e=>[e.from,e.to]));
 const used=new Set(),blocks=[];
 for(const e of input.edges){
  const trigger=byId.get(e.from),handler=byId.get(e.to);
  if(e.layoutRole!=='advance'||!['recovery','rework'].includes(e.intent)||trigger?.kind!=='decision'||handler?.kind!=='activity'||trigger.parent!==handler.parent||main.has(handler.id)||used.has(trigger.id)||used.has(handler.id))continue;
  const incoming=input.edges.filter(x=>x.to===handler.id),outgoing=input.edges.filter(x=>x.from===handler.id);
  if(incoming.length!==1||outgoing.length!==1||byId.get(outgoing[0].to)?.parent!==trigger.parent)continue;
  const rejoins=outgoing[0].layoutRole==='advance'&&input.edges.some(x=>x.from===trigger.id&&x.to===outgoing[0].to&&x.intent==='expected');
  if(outgoing[0].layoutRole!=='return'&&!rejoins)continue;
  const id=JSON.stringify(['auxiliary-block',trigger.id,handler.id]);
  if(byId.has(id))throw Error('Synthetic identity collision');
  blocks.push({id,parent:trigger.parent,trigger:trigger.id,handler:handler.id,edge:e.id,returnEdge:outgoing[0].id,rejoins});used.add(trigger.id);used.add(handler.id);
 }
 const cfg=structuredClone(config);cfg.blockHandlers={};cfg.blockTriggers={};cfg.blockDirections={};cfg.endpointSides={};cfg.blockPadding={};cfg.edgeSides={...cfg.edgeSides};
 const open=new Set(expanded);
 for(const b of blocks){
  input.nodes.push({id:b.id,kind:'group',title:'',parent:b.parent});
  byId.get(b.trigger).parent=b.id;byId.get(b.handler).parent=b.id;open.add(b.id);
  cfg.blockTriggers[b.id]=b.trigger;cfg.blockHandlers[b.id]=b.handler;
  cfg.blockDirections[b.id]=direction==='RIGHT'?'DOWN':'RIGHT';
  cfg.blockPadding[b.id]='[top=12,left=12,bottom=12,right=12]';
  // Return towards the preceding main-flow activity from the upstream face,
  // then enter that activity from the auxiliary side. This leaves the main axis clear.
  cfg.endpointSides[b.returnEdge]=direction==='RIGHT'?{from:b.rejoins?'EAST':'WEST',to:'SOUTH'}:{from:b.rejoins?'SOUTH':'NORTH',to:'EAST'};
  cfg.endpointSides[b.edge]=direction==='RIGHT'?{from:'SOUTH',to:'NORTH'}:{from:'EAST',to:'WEST'};
 }
 const l=await buildPuzzle(input,open,direction,cfg),ids=new Set(blocks.map(b=>b.id));
 const realParent=p=>blocks.find(b=>b.id===p)?.parent;
 l.nodes=l.nodes.filter(n=>!ids.has(n.id)).map(n=>({...n,parent:ids.has(n.parent)?realParent(n.parent):n.parent}));
 l.edges=l.edges.map(e=>({...e,...(ids.has(e.scope)&&l.edges.some(other=>other.originalId===e.originalId&&!ids.has(other.scope))?{label:undefined}:{}),scope:ids.has(e.scope)?realParent(e.scope):e.scope}));
 l.boundaries=l.boundaries.filter(b=>!ids.has(b.group));l.interfaces=l.interfaces.filter(b=>!ids.has(b.group));
 return {...l,branchBlocks:blocks};
}
module.exports={buildBranchBlocks};
