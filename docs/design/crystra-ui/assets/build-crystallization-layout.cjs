// Same compositor and route chooser as the workflow-design priority candidate.
// Input is semantic only. Generated positions must never be edited by hand.
const fs=require('node:fs'),path=require('node:path');
const {buildBranchBlocks}=require('./experiments/elk-refinement/branch-block.cjs');
const {chooseRoutes}=require('./experiments/route-choice/route-choice.cjs');
const {quality}=require('./experiments/workflow-puzzle/optimize.cjs');
const domain=path.resolve(__dirname,'../../../../wsr-ui/packages/bi/src/domain');
async function generate(ir,direction='RIGHT'){
 let layout=await buildBranchBlocks(ir,new Set(),direction);const audits=[];
 const scopes=new Map();for(const block of layout.branchBlocks){const ids=scopes.get(block.parent)||[];ids.push(block.returnEdge);scopes.set(block.parent,ids);}
 for(const ids of scopes.values()){const result=await chooseRoutes(ir,layout,ids);layout=result.layout;audits.push(result.audit);}
 const score=quality(layout);if(score.crossings||score.blocked||score.labelCollisions||score.overlap)throw Error('Rejected geometry: '+JSON.stringify(score));
 return {layout:{...layout,edges:layout.edges.map((e,i)=>({...e,id:e.originalId,segmentKey:e.originalId+':'+i,path:e.points.map((p,j)=>(j?'L':'M')+p.x+' '+p.y).join(' '),arrow:(()=>{const target=layout.nodes.find(n=>n.id===ir.edges.find(x=>x.id===e.originalId).to),last=e.points.at(-1);return last.x>=target.x-.1&&last.x<=target.x+target.width+.1&&last.y>=target.y-.1&&last.y<=target.y+target.height+.1;})()}))},score,audits};
}
module.exports={generate};
if(require.main===module)(async()=>{const fixtures=JSON.parse(fs.readFileSync(path.join(domain,'workflow-crystallization-ir.json')));const output={};const report={};for(const [key,ir]of Object.entries(fixtures)){const result=await generate(ir);output[key]={ir,layout:result.layout};report[key]={score:result.score,audits:result.audits};}fs.writeFileSync(path.join(domain,'workflow-crystallization-layouts.json'),JSON.stringify(output));fs.writeFileSync(path.join(__dirname,'workflow-crystallization-layout-audit.json'),JSON.stringify(report));console.log('Generated before/after with shared branch-block + route-choice; geometry checks passed.');})();
