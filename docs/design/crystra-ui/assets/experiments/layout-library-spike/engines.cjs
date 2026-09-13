const path=require('node:path'),{execFileSync}=require('node:child_process');
const ELK=require(path.resolve(__dirname,'../../../../../../wsr-ui/node_modules/elkjs/lib/elk.bundled.js'));
const cola=require('webcola'),cytoscape=require('cytoscape');cytoscape.use(require('cytoscape-fcose'));
const {makeConstraints}=require('./model.cjs');
async function place(g,engine,direction='RIGHT'){
 const cs=makeConstraints(g,direction,true);let nodes=g.nodes.map((n,i)=>({...n,x:80+(i%4)*300,y:80+Math.floor(i/4)*180}));const idx=id=>nodes.findIndex(n=>n.id===id);let edges=g.edges.map(e=>({...e}));
 if(engine==='elk'){
  const out=await new ELK().layout({id:'root',layoutOptions:{'elk.algorithm':'layered','elk.direction':direction,'elk.edgeRouting':'ORTHOGONAL','elk.spacing.nodeNode':'48','elk.layered.spacing.nodeNodeBetweenLayers':'48','elk.layered.mergeEdges':'false'},children:nodes.map(n=>({id:n.id,width:n.width,height:n.height})),edges:edges.map(e=>({id:e.id,sources:[e.from],targets:[e.to]}))});
  nodes=out.children.map(n=>({...g.nodes.find(x=>x.id===n.id),x:n.x+n.width/2,y:n.y+n.height/2}));edges=out.edges.map(e=>({...g.edges.find(x=>x.id===e.id),points:e.sections?.flatMap(s=>[s.startPoint,...s.bendPoints||[],s.endPoint])||[]}));
 }else if(engine==='webcola'||engine==='webcola-basic'){
  const layout=new cola.Layout().nodes(nodes).links(edges.map(e=>({source:idx(e.from),target:idx(e.to)}))).avoidOverlaps(true).linkDistance(250).handleDisconnected(false);
  if(engine==='webcola')layout.constraints(cs);else layout.flowLayout(direction==='RIGHT'?'x':'y',200);
  layout.start(30,40,80,0,false);
 }else if(engine==='libcola'){
  const input=[`${nodes.length} ${edges.length} ${cs.length}`,...nodes.map(n=>`${n.x} ${n.y} ${n.width} ${n.height}`),...edges.map(e=>`${idx(e.from)} ${idx(e.to)}`),...cs.map(c=>`${c.axis==='x'?0:1} ${c.left} ${c.right} ${c.gap} ${c.equality?1:0}`)].join('\n');
  const out=execFileSync('/tmp/crystra-layout-build/cola-spike',{input,timeout:10000,encoding:'utf8'}).trim().split('\n').map(s=>s.trim().split(/\s+/).map(Number));nodes.forEach((n,i)=>{[n.x,n.y]=out[i];});
 }else if(engine==='fcose'){
  const cy=cytoscape({headless:true,styleEnabled:true,elements:[...nodes.map(n=>({data:{id:n.id,w:n.width,h:n.height},position:{x:n.x,y:n.y}})),...edges.map(e=>({data:{id:e.id,source:e.from,target:e.to}}))],style:[{selector:'node',style:{width:'data(w)',height:'data(h)'}}]});
  const alignment={vertical:[],horizontal:[]},relative=[];for(const c of cs){const a=nodes[c.left].id,b=nodes[c.right].id;if(c.equality)alignment[c.axis==='x'?'vertical':'horizontal'].push([a,b]);else relative.push(c.axis==='x'?{left:a,right:b,gap:c.gap}:{top:a,bottom:b,gap:c.gap});}
  cy.layout({name:'fcose',animate:false,randomize:false,quality:'proof',packComponents:false,idealEdgeLength:250,numIter:1500,alignmentConstraint:alignment,relativePlacementConstraint:relative}).run();nodes.forEach(n=>{const p=cy.getElementById(n.id).position();n.x=p.x;n.y=p.y;});cy.destroy();
 }nodes=nodes.map(n=>({...g.nodes.find(x=>x.id===n.id),x:n.x,y:n.y}));return {nodes,edges,constraints:engine==='elk'||engine==='webcola-basic'?[]:cs};
}
let aPromise;async function avoid(){return aPromise??=(async()=>{const {AvoidLib}=await import('libavoid-js');await AvoidLib.load();return AvoidLib.getInstance();})();}
async function route(layout,penalties=true){const A=await avoid(),router=new A.Router(A.RouterFlag.OrthogonalRouting.value);const refs=new Map();
 if(penalties)for(const [key,value]of Object.entries({segmentPenalty:50,crossingPenalty:200,fixedSharedPathPenalty:200,shapeBufferDistance:8,idealNudgingDistance:12,reverseDirectionPenalty:50}))router.setRoutingParameter(A.RoutingParameter[key],value);
 const owned=[];for(const n of layout.nodes){const p=new A.Point(n.x-n.width/2,n.y-n.height/2),q=new A.Point(n.x+n.width/2,n.y+n.height/2),rect=new A.Rectangle(p,q),shape=new A.ShapeRef(router,rect);refs.set(n.id,shape);owned.push(p,q,rect);
  for(const [x,y,dir]of [[0,.5,4],[1,.5,8],[.5,0,1],[.5,1,2]]){const pin=new A.ShapeConnectionPin(shape,1,x,y,true,0,dir);pin.setExclusive(false);}
 }
 const cons=layout.edges.map(e=>{const s=new A.ConnEnd(refs.get(e.from),1),t=new A.ConnEnd(refs.get(e.to),1),c=new A.ConnRef(router,s,t);c.setSourceEndpoint(s);c.setDestEndpoint(t);c.setRoutingType(A.ConnType.ConnType_Orthogonal);owned.push(s,t);return {e,c};});router.processTransaction();
 const edges=cons.map(({e,c})=>{const r=c.displayRoute(),points=[];for(let i=0;i<r.size();i++){const p=r.at(i);points.push({x:p.x,y:p.y});}return {...e,points};});router.delete();for(const o of owned)o.delete();return {...layout,edges};
}
module.exports={place,route};
