const esc=s=>String(s||'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function toBpmn(ir,expanded=new Set(),mode='scoped'){
 const by=new Map(ir.nodes.map(n=>[n.id,n])),groups=ir.nodes.filter(n=>n.kind==='group');
 function inside(id,g){for(let n=by.get(id);n;n=by.get(n.parent))if(n.id===g)return true;return false;}
 function local(id,p){for(let n=by.get(id);n;n=by.get(n.parent))if((n.parent||null)===p)return n.id;return null;}
 const boundaries=groups.map(g=>({id:g.id,entries:[...new Set(ir.edges.filter(e=>!inside(e.from,g.id)&&inside(e.to,g.id)).map(e=>e.to))],exits:[...new Set(ir.edges.filter(e=>inside(e.from,g.id)&&!inside(e.to,g.id)).map(e=>e.from))]}));
 if(mode==='scoped'&&boundaries.some(b=>b.entries.length!==1||b.exits.length!==1))throw Error('multiple or absent subprocess entry/exit targets; cannot silently normalize');
 const scopes=new Map([null,...groups.map(n=>n.id)].map(g=>[g,[]]));for(const e of ir.edges){if(mode==='raw'){scopes.get(by.get(e.from).parent||null).push({...e});continue;}let p=by.get(e.from).parent||null;while(p&&!local(e.to,p))p=by.get(p).parent||null;scopes.get(p).push({...e,from:local(e.from,p),to:local(e.to,p)});}
 if(mode==='scoped')for(const b of boundaries){scopes.get(b.id).push({id:b.id+'_entry_bridge',from:b.id+'_start',to:local(b.entries[0],b.id)},{id:b.id+'_exit_bridge',from:local(b.exits[0],b.id),to:b.id+'_end'});}
 const flows=[...scopes.values()].flat();const refs=id=>flows.filter(e=>e.to===id).map(e=>`<bpmn:incoming>${e.id}</bpmn:incoming>`).join('')+flows.filter(e=>e.from===id).map(e=>`<bpmn:outgoing>${e.id}</bpmn:outgoing>`).join('');
 function scope(p){let out='';if(p&&mode==='scoped')out+=`<bpmn:startEvent id="${p}_start">${refs(p+'_start')}</bpmn:startEvent><bpmn:endEvent id="${p}_end">${refs(p+'_end')}</bpmn:endEvent>`;
 for(const n of ir.nodes.filter(n=>(n.parent||null)===p)){const type={start:'startEvent',end:'endEvent',activity:'task',decision:'exclusiveGateway',fork:'parallelGateway',join:'parallelGateway',group:'subProcess'}[n.kind];out+=`<bpmn:${type} id="${n.id}" name="${esc(n.title)}">${refs(n.id)}${n.kind==='group'?scope(n.id):n.kind==='end'&&n.outcome==='terminated'?`<bpmn:terminateEventDefinition id="${n.id}_termination"/>`:''}</bpmn:${type}>`;}
 for(const e of scopes.get(p))out+=`<bpmn:sequenceFlow id="${e.id}" sourceRef="${e.from}" targetRef="${e.to}" name="${esc(e.label)}"/>`;return out;}
 const di=groups.map(g=>`<bpmndi:BPMNShape id="di_${g.id}" bpmnElement="${g.id}" isExpanded="${expanded.has(g.id)}"><dc:Bounds x="0" y="0" width="100" height="80"/></bpmndi:BPMNShape>`).join('');
 return {xml:`<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions" targetNamespace="https://crystra.test/spike"><bpmn:process id="Process" isExecutable="false">${scope(null)}</bpmn:process><bpmndi:BPMNDiagram id="Diagram"><bpmndi:BPMNPlane id="Plane" bpmnElement="Process">${di}</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`,boundaries,mode};
}
module.exports={toBpmn};
