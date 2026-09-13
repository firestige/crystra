const fs=require('node:fs');const {buildBranchBlocks}=require('./branch-block.cjs');const {quality}=require('../workflow-puzzle/optimize.cjs');
(async()=>{const data=JSON.parse(fs.readFileSync(__dirname+'/../workflow-puzzle/layouts.json'));for(const d of data){for(const direction of ['RIGHT','DOWN']){
 const l=await buildBranchBlocks(d.ir,new Set(d.groups),direction,d.search[direction].config);const b=d.layouts[direction+(2**d.groups.length-1)];console.log(d.name,direction,quality(b),quality(l),l.branchBlocks.map(x=>({x,positions:l.nodes.filter(n=>[x.trigger,x.handler].includes(n.id))})));
 d.layouts[direction+(2**d.groups.length-1)]=l;
 }}fs.writeFileSync(__dirname+'/branch-results.json',JSON.stringify(data));})();
