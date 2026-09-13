const {chooseRoutes}=require('./route-choice.cjs');
async function counterexamples(){const samples=[],audits=[];
for(const blocked of [false,true]){const d={name:blocked?'obstructed':'unobstructed',ir:{title:blocked?'遮挡反例':'无遮挡反例',nodes:[{id:'source',kind:'activity',title:'补救活动'},{id:'target',kind:'activity',title:'前序活动'}],edges:[{id:'r',from:'source',to:'target',intent:'recovery'}]},groups:[],layouts:{},baseline:{}};
 const nodes=[{id:'source',x:400,y:300,width:160,height:88},{id:'target',x:60,y:60,width:160,height:88}];if(blocked){nodes.push({id:'wall',x:250,y:160,width:70,height:290});d.ir.nodes.push({id:'wall',kind:'activity',title:'障碍'});}
 for(const direction of ['RIGHT','DOWN']){const l={width:direction==='RIGHT'?700:500,height:direction==='RIGHT'?500:700,nodes:direction==='RIGHT'?nodes:nodes.map(n=>({...n,x:500-n.y-n.height,y:n.x,width:n.height,height:n.width})),edges:[],interfaces:[],boundaries:[]};const r=await chooseRoutes(d.ir,l,['r']);const fixed=r.audit.candidates.filter(c=>c.valid&&c.choices[0].fromSide===(direction==='RIGHT'?'WEST':'NORTH')&&c.choices[0].toSide===(direction==='RIGHT'?'SOUTH':'EAST')).sort((a,b)=>a.score-b.score)[0];
 if(!fixed)throw Error('Counterexample fixed pair unexpectedly unavailable');d.baseline[direction+'0']={...l,edges:fixed.routed};d.layouts[direction+'0']=r.layout;audits.push({sample:d.name,direction,...r.audit});}
 samples.push(d);
}return {samples,audits};}
module.exports={counterexamples};
