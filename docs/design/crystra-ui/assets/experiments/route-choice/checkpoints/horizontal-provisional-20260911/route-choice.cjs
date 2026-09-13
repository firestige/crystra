const {quality}=require('../workflow-puzzle/optimize.cjs');
const SIDES=['WEST','NORTH','EAST','SOUTH'],DIR={WEST:4,NORTH:1,EAST:8,SOUTH:2};
let instance;
const near=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<.01;
const inside=(p,n,margin=0)=>p.x>=n.x+margin&&p.x<=n.x+n.width-margin&&p.y>=n.y+margin&&p.y<=n.y+n.height-margin;
function port(n,side,occupied){
 const horizontal=side==='WEST'||side==='EAST',span=horizontal?n.height:n.width;
 for(const offset of [0,-24,24,-48,48]){
  if(Math.abs(offset)>Math.max(0,span/2-16))continue;
  const p={x:n.x+(horizontal?(side==='WEST'?0:n.width):n.width/2+offset),y:n.y+(horizontal?n.height/2+offset:(side==='NORTH'?0:n.height))};
  if(occupied.filter(q=>horizontal?Math.abs(q.x-p.x)<.01:Math.abs(q.y-p.y)<.01).every(q=>Math.hypot(q.x-p.x,q.y-p.y)>=20))return {...p,offset,side};
 }
 return null;
}
function crossingBox(a,b,n){return a.x===b.x?a.x>n.x+.01&&a.x<n.x+n.width-.01&&Math.max(a.y,b.y)>n.y+.01&&Math.min(a.y,b.y)<n.y+n.height-.01:a.y>n.y+.01&&a.y<n.y+n.height-.01&&Math.max(a.x,b.x)>n.x+.01&&Math.min(a.x,b.x)<n.x+n.width-.01;}
async function candidate(ir,layout,ids,choices){
 const A=await(instance??=(async()=>{const {AvoidLib}=await import('../layout-library-spike/node_modules/libavoid-js/dist/index-node.mjs');await AvoidLib.load();return AvoidLib.getInstance();})());
 const edges=ids.map(id=>ir.edges.find(e=>e.id===id)),byId=new Map(layout.nodes.map(n=>[n.id,n]));
 const ancestors=id=>{const found=new Set();let p=ir.nodes.find(n=>n.id===id)?.parent;while(p){found.add(p);p=ir.nodes.find(n=>n.id===p)?.parent;}return found;};
 const endpointAncestors=new Set(edges.flatMap(e=>[...ancestors(e.from),...ancestors(e.to)]));
 // Preserve expanded siblings as obstacles, but omit their contained obstacles.
 const obstacles=layout.nodes.filter(n=>!endpointAncestors.has(n.id)&&!Array.from(ancestors(n.id)).some(id=>!endpointAncestors.has(id)&&byId.get(id)?.expanded));
 const fixed=layout.edges.filter(e=>!ids.includes(e.originalId));
 const labels=fixed.filter(e=>e.label).map(e=>({...e.label,id:'label:'+e.originalId}));
 const router=new A.Router(A.RouterFlag.OrthogonalRouting.value),owned=[],shapes=new Map();
 let invalid;
 try{
 for(const [k,v]of Object.entries({segmentPenalty:80,crossingPenalty:200,fixedSharedPathPenalty:200,idealNudgingDistance:12,shapeBufferDistance:28}))router.setRoutingParameter(A.RoutingParameter[k],v);
 for(const n of [...obstacles,...labels]){const a=new A.Point(n.x,n.y),b=new A.Point(n.x+n.width,n.y+n.height),rect=new A.Rectangle(a,b);owned.push(a,b,rect);shapes.set(n.id,new A.ShapeRef(router,rect));}
 const connectors=[],assigned=new Map();let pin=1;
 for(let i=0;i<edges.length;i++){
  const e=edges[i],a=byId.get(e.from),b=byId.get(e.to),choice=choices[i];
  if(!a||!b||!shapes.has(a.id)||!shapes.has(b.id)){invalid='endpoint unavailable';break;}
  if([a,b].some(n=>['decision','start','end'].includes(ir.nodes.find(s=>s.id===n.id)?.kind))){invalid='non-rectangular endpoint not supported in this probe';break;}
  const getPort=(n,side)=>port(n,side,[...fixed.flatMap(e=>[e.points[0],e.points.at(-1)]).filter(p=>inside(p,n)),...(assigned.get(n.id)||[])]);
  const source=getPort(a,choice.fromSide),target=getPort(b,choice.toSide);
  if(!source||!target){invalid='occupied endpoint face';break;}
  assigned.set(a.id,[...(assigned.get(a.id)||[]),source]);assigned.set(b.id,[...(assigned.get(b.id)||[]),target]);
  const ends=[[a,source],[b,target]].map(([n,p])=>{const id=pin++;new A.ShapeConnectionPin(shapes.get(n.id),id,(p.x-n.x)/n.width,(p.y-n.y)/n.height,true,0,DIR[p.side]);const end=new A.ConnEnd(shapes.get(n.id),id);owned.push(end);return end;});
  const c=new A.ConnRef(router,ends[0],ends[1]);c.setRoutingType(A.ConnType.ConnType_Orthogonal);connectors.push({e,c,source,target});
 }
 if(invalid)return {valid:false,reason:invalid,choices};
 router.processTransaction();
 const routed=[];
 for(const {e,c,source,target}of connectors){const r=c.displayRoute(),points=[];for(let i=0;i<r.size();i++){const p=r.at(i);points.push({x:p.x,y:p.y});}
  if(points.length<2||!near(points[0],source)||!near(points.at(-1),target))return {valid:false,reason:'routing failed',choices};
  const scope=ir.nodes.find(n=>n.id===e.from)?.parent,container=byId.get(scope)||{x:0,y:0,width:layout.width,height:layout.height};
  for(let i=0;i<points.length;i++){if(!inside(points[i],container))return {valid:false,reason:'leaves real scope',choices};if(i&&Math.abs(points[i].x-points[i-1].x)>.01&&Math.abs(points[i].y-points[i-1].y)>.01)return {valid:false,reason:'nonorthogonal',choices};}
  if(Math.hypot(points.at(-1).x-points.at(-2).x,points.at(-1).y-points.at(-2).y)<24)return {valid:false,reason:'short arrow lead',choices};
  for(const n of [...obstacles,...labels])for(let i=1;i<points.length;i++)if(crossingBox(points[i-1],points[i],n))return {valid:false,reason:'obstacle crossing',choices};
  routed.push({originalId:e.id,scope,points});
 }
 const combined={...layout,edges:[...fixed,...routed]},q=quality(combined),base=quality({...layout,edges:fixed});
 const crossings=q.crossings-base.crossings,overlap=q.overlap-base.overlap,clearance=q.clearanceDeficit-base.clearanceDeficit;
 const bends=routed.reduce((n,e)=>n+Math.max(0,e.points.length-2),0),length=routed.reduce((n,e)=>n+e.points.slice(1).reduce((t,p,i)=>t+Math.abs(p.x-e.points[i].x)+Math.abs(p.y-e.points[i].y),0),0);
 // Score the assembled routes, including conflicts with fixed routes. No favored side.
 const score=crossings*100000+overlap*10000+clearance*100+bends*80+length;
 return {valid:true,score,crossings,overlap,clearance,bends,length,choices,routed};
 }finally{router.delete();for(const o of owned)o.delete();}
}
async function chooseRoutes(ir,layout,ids){
 if(new Set(ids).size!==ids.length||ids.some(id=>!ir.edges.some(e=>e.id===id)))throw Error('Invalid edge selection');
 if(layout.edges.some(e=>ids.includes(e.originalId)&&e.label))throw Error('Label repositioning is outside this probe');
 if(new Set(ids.flatMap(id=>{const e=ir.edges.find(e=>e.id===id);return [e.from,e.to].map(id=>ir.nodes.find(n=>n.id===id)?.parent);})).size>1)throw Error('Returns must share one real scope');
 if(ids.length>2)throw Error('This bounded probe supports at most two jointly chosen returns per scope');
 if(!ids.length)return {layout:structuredClone(layout),audit:{candidates:[],chosen:[]}};
 let combinations=[[]];for(const id of ids)combinations=combinations.flatMap(prefix=>SIDES.flatMap(fromSide=>SIDES.map(toSide=>[...prefix,{id,fromSide,toSide}])));
 const candidates=[];let winner;
 for(const choices of combinations){const result=await candidate(ir,layout,ids,choices);candidates.push(result);if(result.valid&&(!winner||result.score<winner.score-.01))winner=result;}
 if(!winner)throw Object.assign(Error('No admissible routing candidate'),{candidates});
 const next=structuredClone(layout);next.edges=next.edges.filter(e=>!ids.includes(e.originalId));next.edges.push(...winner.routed);
 return {layout:next,audit:{candidates,chosen:winner.choices,score:winner.score}};
}
module.exports={chooseRoutes};
