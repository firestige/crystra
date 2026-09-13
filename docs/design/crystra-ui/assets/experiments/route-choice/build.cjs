const fs=require('node:fs');const {chooseRoutes}=require('./route-choice.cjs');const {quality}=require('../workflow-puzzle/optimize.cjs');
(async()=>{const data=JSON.parse(fs.readFileSync(__dirname+'/checkpoints/horizontal-provisional-20260911/layouts.json')),audits=[];
for(const d of data){d.baseline=d.layouts;d.layouts={};d.routingSeeds={};for(const [key,l]of Object.entries(d.baseline)){
 const direction=key.startsWith('RIGHT')?'RIGHT':'DOWN',mask=+key.slice(direction.length);
 let seed=structuredClone(l);if(direction==='DOWN')seed=await require('../elk-refinement/branch-block.cjs').buildBranchBlocks(d.ir,new Set(d.groups.filter((g,i)=>mask&(1<<i))),direction,{...d.search[direction].config,captionMetrics:require('./caption-metrics.json')});
 d.routingSeeds[key]=structuredClone(seed);let result=structuredClone(seed);const scopes=new Map();for(const b of l.branchBlocks){if(!l.nodes.some(n=>n.id===b.handler))continue;const ids=scopes.get(b.parent)||[];ids.push(b.returnEdge);scopes.set(b.parent,ids);}
 for(const [scope,ids]of scopes){const r=await chooseRoutes(d.ir,result,ids).catch(e=>{fs.writeFileSync(__dirname+'/failure.json',JSON.stringify({sample:d.name,key,scope,ids,candidates:e.candidates},null,2));throw e;});result=r.layout;audits.push({sample:d.name,key,scope,ids,...r.audit});}
 d.layouts[key]=result;
 const a=quality(l),b=quality(result);if(b.crossings>a.crossings||b.overlap>a.overlap||b.blocked>a.blocked)console.log('REGRESSION',d.name,key,{a,b});
}}
fs.writeFileSync(__dirname+'/layouts.json',JSON.stringify(data));fs.writeFileSync(__dirname+'/candidates.json',JSON.stringify(audits));
const extra=await require('./counterexample.cjs').counterexamples();fs.writeFileSync(__dirname+'/counterexamples.json',JSON.stringify(extra));
let t=fs.readFileSync(__dirname+'/../workflow-puzzle/preview.template.html','utf8');
t=t.replace('<title>推进与返回 · 布局实验</title>','<title>返回线 · 自动选择出口</title>').replace('<h1>推进与返回</h1>','<h1>返回线 · 自动选择出口</h1>');
t=t.replace('<option value="2">科研管理</option>','<option value="2">科研管理</option><option value="3">无遮挡反例</option><option value="4">遮挡反例</option>');
t=t.replace('x="${cx}" y="${[\'start\',\'end\',\'fork\',\'join\'].includes(s.kind)?n.y+n.height+23:cy+6}"','x="${n.caption?n.caption.x+n.caption.width/2:cx}" y="${n.caption?n.caption.y+n.caption.baseline:[\'start\',\'end\',\'fork\',\'join\'].includes(s.kind)?n.y+n.height+23:cy+6}"');
t=t.replace('<select id="sample"','<select id="variant" aria-label="布局版本"><option value="candidate">端口与标签改进</option><option value="baseline">已标记基线</option></select><select id="sample"');
t=t.replace("layout=()=>source().layouts[direction+mask]","layout=()=>(document.getElementById('variant').value==='baseline'?source().baseline:source().layouts)[direction+mask]");
t=t.replace("document.getElementById('sample').onchange", "document.getElementById('variant').onchange=()=>render(true);\ndocument.getElementById('sample').onchange");
t=t.replace('假设 layoutRole 已由用户确认。推进边确定主干；返回边保持真实箭头方向，但不反转主干。','纵向标题先参与布局；返回线再比较出口和同面端口位置。');
t=t.replace("sample=+e.target.value;mask=0;scope=null;render(true);","sample=+e.target.value;mask=0;scope=null;info.textContent=source().ir.title+' · 文字参与布局，比较出口与同面端口';render(true);");
fs.writeFileSync(__dirname+'/preview.html',t.replace('/*DATA*/',JSON.stringify([...data,...extra.samples]).replaceAll('<','\\u003c')));
console.log('states',data.reduce((n,d)=>n+Object.keys(d.layouts).length,0),'scope probes',audits.length,'candidates',audits.reduce((n,a)=>n+a.candidates.length,0));
for(const a of audits.filter(a=>a.key==='RIGHT'+(2**data.find(d=>d.name===a.sample).groups.length-1)))console.log(a.sample,a.scope,a.chosen,a.score);
})();
