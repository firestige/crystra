function project(ir,scope=null){
 const by=new Map(ir.nodes.map(n=>[n.id,n]));
 function local(id){let n=by.get(id);while(n){if((n.parent||null)===scope)return n.id;n=by.get(n.parent);}return null;}
 const nodes=ir.nodes.filter(n=>(n.parent||null)===scope).map(n=>({...n,width:n.kind==='decision'?136:['start','end'].includes(n.kind)?48:Math.max(160,n.title.length*16+40),height:n.kind==='decision'?136:['start','end'].includes(n.kind)?48:88}));
 const edges=[];
 for(const e of ir.edges){let from=local(e.from),to=local(e.to);if(from===to)continue;if(!from&&!to)continue;
  if(!from){from='$in:'+e.id;nodes.push({id:from,title:'入',kind:'boundary',width:20,height:20,original:e.from});}
  if(!to){to='$out:'+e.id;nodes.push({id:to,title:'出',kind:'boundary',width:20,height:20,original:e.to});}
  edges.push({...e,from,to,originalFrom:e.from,originalTo:e.to});
 }return {scope,nodes,edges};
}
function makeConstraints(g,direction='RIGHT',semantic=true){const axis=direction==='RIGHT'?'x':'y',cross=axis==='x'?'y':'x',dim=axis==='x'?'width':'height',cdim=axis==='x'?'height':'width';const cs=[];
 for(const e of g.edges){const a=g.nodes.findIndex(n=>n.id===e.from),b=g.nodes.findIndex(n=>n.id===e.to),u=g.nodes[a],v=g.nodes[b];
  if(e.layoutRole==='return'||e.intent==='exit')continue;
  if(semantic&&e.intent==='recovery'&&u.kind==='decision'&&v.kind!=='boundary'){
   cs.push({axis,left:a,right:b,gap:0,equality:true},{axis:cross,left:a,right:b,gap:(u[cdim]+v[cdim])/2+48});
  }else if(e.intent==='expected'||!semantic)cs.push({axis,left:a,right:b,gap:(u[dim]+v[dim])/2+48});
 }return cs;}
module.exports={project,makeConstraints};
