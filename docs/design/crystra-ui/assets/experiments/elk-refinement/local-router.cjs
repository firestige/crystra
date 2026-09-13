let instance;
async function routeLocalBlock(result){
 const A=await(instance??=(async()=>{const {AvoidLib}=await import('../layout-library-spike/node_modules/libavoid-js/dist/index-node.mjs');await AvoidLib.load();return AvoidLib.getInstance();})());
 const router=new A.Router(A.RouterFlag.OrthogonalRouting.value),owned=[],shapes=new Map();
 try{
 for(const [k,v]of Object.entries({segmentPenalty:50,crossingPenalty:200,fixedSharedPathPenalty:200,idealNudgingDistance:12,shapeBufferDistance:12}))router.setRoutingParameter(A.RoutingParameter[k],v);
 for(const n of result.children){const a=new A.Point(n.x,n.y),b=new A.Point(n.x+n.width,n.y+n.height),rect=new A.Rectangle(a,b);owned.push(a,b,rect);shapes.set(n.id,{n,shape:new A.ShapeRef(router,rect)});}
 let pin=1;
 const endpoint=(p,adjacent)=>{
  const item=[...shapes.values()].find(({n})=>p.x>=n.x-.01&&p.x<=n.x+n.width+.01&&p.y>=n.y-.01&&p.y<=n.y+n.height+.01);
  if(!item){const point=new A.Point(p.x,p.y);owned.push(point);const end=new A.ConnEnd(point);owned.push(end);return end;}
  const {n,shape}=item;
  const port=n.ports.find(q=>Math.hypot(n.x+q.x-p.x,n.y+q.y-p.y)<.01);
  const dir={NORTH:1,SOUTH:2,WEST:4,EAST:8}[port?.layoutOptions?.['elk.port.side']];
  if(!dir)throw Error('Missing endpoint direction');const id=pin++;
  new A.ShapeConnectionPin(shape,id,(p.x-n.x)/n.width,(p.y-n.y)/n.height,true,0,dir);
  const end=new A.ConnEnd(shape,id);owned.push(end);return end;
 };
 const routes=[];
 for(const e of result.edges||[])for(const s of e.sections||[]){const p=[s.startPoint,...s.bendPoints||[],s.endPoint];const c=new A.ConnRef(router,endpoint(p[0],p[1]),endpoint(p.at(-1),p.at(-2)));c.setRoutingType(A.ConnType.ConnType_Orthogonal);routes.push({s,c});}
 router.processTransaction();
 for(const {s,c}of routes){const r=c.displayRoute(),points=[];for(let i=0;i<r.size();i++){const p=r.at(i);points.push({x:p.x,y:p.y});}if(points.length<2)throw Error('Local routing failed');s.startPoint=points[0];s.endPoint=points.at(-1);s.bendPoints=points.slice(1,-1);}
 return result;
 }finally{router.delete();for(const o of owned)o.delete();}
}
module.exports={routeLocalBlock};
