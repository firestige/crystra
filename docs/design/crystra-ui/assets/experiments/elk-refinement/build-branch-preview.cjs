const fs=require('node:fs');const {buildBranchBlocks}=require('./branch-block.cjs');const {quality}=require('../workflow-puzzle/optimize.cjs');
(async()=>{const data=JSON.parse(fs.readFileSync(__dirname+'/../workflow-puzzle/layouts.json')),metrics=[];
 for(const d of data){d.baseline=d.layouts;d.layouts={};for(const [key,b]of Object.entries(d.baseline)){const direction=key.startsWith('RIGHT')?'RIGHT':'DOWN',mask=+key.slice(direction.length);const l=await buildBranchBlocks(d.ir,new Set(d.groups.filter((g,i)=>mask&(1<<i))),direction,d.search[direction].config);d.layouts[key]=l;metrics.push({sample:d.name,key,baseline:quality(b),candidate:quality(l)});}}
 fs.writeFileSync(__dirname+'/branch-results.json',JSON.stringify(data));fs.writeFileSync(__dirname+'/branch-metrics.json',JSON.stringify(metrics,null,2));
 let t=fs.readFileSync(__dirname+'/../workflow-puzzle/preview.template.html','utf8');
 t=t.replace('<title>推进与返回 · 布局实验</title>','<title>ELK 局部分支对照</title>').replace('<h1>推进与返回</h1>','<h1>ELK 局部分支对照</h1>');
 t=t.replace('<select id="sample"','<select id="variant" aria-label="布局版本"><option value="candidate">改进 · 侧向补救分支</option><option value="baseline">基线 · spike 前</option></select><select id="sample"');
 t=t.replace("layout=()=>source().layouts[direction+mask]","layout=()=>(document.getElementById('variant').value==='baseline'?source().baseline:source().layouts)[direction+mask]");
 t=t.replace("document.getElementById('sample').onchange", "document.getElementById('variant').onchange=()=>render(true);\ndocument.getElementById('sample').onchange");
 t=t.replace('假设 layoutRole 已由用户确认。推进边确定主干；返回边保持真实箭头方向，但不反转主干。','与 spike 前最后一版 ELK 拼装引擎对照。侧向补救构件只影响符合条件的局部分支；其余布局与交互沿用基线。');
 fs.writeFileSync(__dirname+'/preview.html',t.replace('/*DATA*/',JSON.stringify(data).replaceAll('<','\\u003c')));
 console.log(metrics.length,'states',metrics.filter(m=>m.candidate.crossings>m.baseline.crossings).map(m=>[m.sample,m.key,m.baseline.crossings,m.candidate.crossings]));
})();
