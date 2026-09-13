/** Map existing v8 instances to the same recipes exported by wsr-ui; preserve IDs and behavior. */
import {readFileSync,writeFileSync}from'node:fs';import{createRequire}from'node:module';const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));const{JSDOM}=require('jsdom');const root=import.meta.dirname;const path=root+'/crystra-task-work-v8-sidebar.html';const dom=new JSDOM(readFileSync(path,'utf8'));const d=dom.window.document;const q=(id:string)=>d.querySelector(`[data-section-id="${id}"]`);const mapping:object[]=[];
d.documentElement.classList.add('wsr-bi');d.documentElement.setAttribute('data-crystra-theme','dark');
const prune=(e:Element,pattern:RegExp)=>{for(const c of [...e.classList])if(pattern.test(c))e.classList.remove(c);};
for(const id of ['gate-decision-state','plan-outcome-summary','plan-control-envelope-summary','plan-proof-readiness','plan-context-health','grilling-question-map','grilling-live-brief']){
 const e=q(id);if(!e)throw Error(id);prune(e,/^(rounded|border|bg-|p-)/);e.classList.add('wsr-surface','wsr-card');e.setAttribute('data-component','Card');e.setAttribute('data-level','panel');e.setAttribute('data-padding','regular');e.setAttribute('data-tone','neutral');e.setAttribute('data-border','solid');mapping.push({id,component:'Card',props:{level:'panel',padding:'regular',tone:'neutral',border:'solid'}});
 for(const text of e.querySelectorAll('[data-type]')){const variant=text.getAttribute('data-type');text.classList.add('wsr-typography');text.setAttribute('data-variant',variant);}
}
for(const id of ['gate-context-back','plan-document-back','execution-wave-copy-plan-run','execution-wave-copy-wave','execution-wave-copy-workflow','execution-wave-copy-run','execution-wave-copy-trace-root','plan-dag-zoom-in','plan-dag-zoom-out']){
 const e=q(id);if(!e)throw Error(id);const icon=id.includes('copy-')||id.includes('zoom-');prune(e,/^(rounded|border|bg-|p[xy]?-|text-(xs|sm|blue|slate)|hover:|transition)/);e.classList.add('wsr-button');e.setAttribute('data-component',icon?'IconButton':'Button');e.setAttribute('data-appearance','outline');e.setAttribute('data-tone',icon?'neutral':'primary');e.setAttribute('data-size',icon?'compact':'regular');if(icon)e.setAttribute('data-icon-button','true');mapping.push({id,component:icon?'IconButton':'Button',props:{appearance:'outline',tone:icon?'neutral':'primary',size:icon?'compact':'regular'},nativeTag:e.tagName.toLowerCase()});
}
if(!d.querySelector('link[href="component-recipes.css"]')){const l=d.createElement('link');l.rel='stylesheet';l.href='component-recipes.css';d.head.append(l);}
const nav=q('task-workbench-navigation');
if(!nav)throw Error('task-workbench-navigation');
nav.classList.add('wsr-tab-list');nav.setAttribute('data-component','Tabs');
for(const label of nav.querySelectorAll('[data-surface-option]')){prune(label,/^(rounded|px-|py-)/);label.classList.add('wsr-tab');}
mapping.push({id:'task-workbench-navigation',component:'Tabs',props:{appearance:'soft',size:'regular'},adapter:'Prototype retains native radio controls and existing surface handlers; React sample uses tab/tabpanel semantics.'});
writeFileSync(path,dom.serialize());writeFileSync(root+'/component-instance-map.json',JSON.stringify({status:'first-batch-accepted-second-batch-review',source:'wsr-ui/packages/bi/src/components/design-system.tsx',scope:'Existing v8 instances; host Input, Sidebar animation, charts and scrolling are preserved.',instances:mapping},null,2)+'\n');console.log(mapping.length,'instances mapped');
