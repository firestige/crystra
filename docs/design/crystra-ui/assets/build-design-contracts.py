"""Export explicit document bindings for the four reviewed v8 pages."""
from pathlib import Path
import json
b=Path(__file__).resolve().parent.parent;a=b/'assets'
s=json.loads((b/'handoff/v8-design-audit/static-elements.json').read_text())
rules=[
 ('widget-tooltip','.crystra-widget-tooltip',['components/widget-component-contract.md']),
 ('configuration-file','input[type=file]',['components/configuration-files.md']),
 ('observation-settings','#result-analysis-review',['components/result-analysis-review.md']),
 ('delivery-directory','.delivery-directory',['components/delivery-directory-review.md']),
 ('trace-waterfall','.trace-waterfall',['components/library/trace-waterfall.md','pages/analysis-audit.md']),
 ('trace-tree','.trace-tree-graph',['components/library/trace-tree.md','pages/analysis-audit.md']),
 ('trace-passport','.span-passport',['components/library/inspector-details.md','pages/analysis-audit.md']),
 ('observation-calendar','.obs-time-controls,.obs-calendar-popover',['pages/analysis-audit.md']),
 ('observation-header','[data-section-id=workspace-header]',['pages/analysis-audit.md']),
 ('observation-layout','.obs-layout-editor,.obs-widget-modal',['pages/analysis-audit.md','components/widget-component-contract.md']),
 ('observation-widgets','.dashboard-grid,.obs-topic,.obs-add-widget,.wsr-widget-menu',['pages/analysis-audit.md','components/widget-expression-design.md']),
 ('resource-browser','.browser-host,#browser-rename-dialog,#browser-thumbnail-input,.task-context-menu',['pages/task-browser.md','pages/workflow-explorer.md','components/component-recipes.md']),
 ('search-field','.wsr-search-field,.wsr-expandable-search',['components/search-field-review.md']),
]
contracts={key:{'selectors':selector,'documents':docs} for key,selector,docs in rules}
static={}
for page,info in s['pages'].items():
 for el in info['elements']:
  key=el['key']
  if not key:continue
  docs=[d for d in el['exactIdReferences'] if not d.startswith('handoff/')]
  if not docs:
   if page.startswith('crystra-task-work'):docs=['pages/task-detail/README.md','components/context-viewers.md']
   elif 'analysis' in page:docs=['pages/analysis-audit.md']
   elif 'workflow-explorer' in page:docs=['pages/workflow-explorer.md']
   else:docs=['pages/task-browser.md']
  cid='region.'+key
  contracts.setdefault(cid,{'documents':docs,'elementKey':key})
  static[key]=cid
manifest={'version':1,'scope':s['scope'],'excluded':s['excluded'],'contracts':contracts,'staticKeys':static,'rules':[{'contract':key,'selector':selector} for key,selector,docs in rules]}
(a/'design-contracts.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
js='''/* Generated document ownership bindings; no visual or business behavior. */
(()=>{
const manifest=MANIFEST;
if(!manifest.scope.some(name=>location.pathname.endsWith(name)))return;
window.crystraDesignContracts=manifest;
const target='button,input,select,textarea,a,summary,[tabindex],[role],[data-section-id],section,article,aside,main,header,footer,dialog,form,fieldset,table';
function contractFor(el){
 for(const rule of manifest.rules)if(el.closest(rule.selector))return rule.contract;
 for(let p=el;p;p=p.parentElement){const key=p.getAttribute('data-section-id')||p.id;if(manifest.staticKeys[key])return manifest.staticKeys[key];}
 return null;
}
function bind(){
 for(const el of document.querySelectorAll(target)){
 const id=contractFor(el);if(id)el.setAttribute('data-design-contract',id);
 }
}
bind();let scheduled=false;
new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;bind();});}}).observe(document.body,{subtree:true,childList:true});
})();
'''.replace('MANIFEST',json.dumps(manifest,ensure_ascii=False))
(a/'design-contracts.js').write_text(js)
# Also expose a human-readable stable key table; no change to the contract text.
lines=['# v8 区域与组件契约绑定','','由 design-contracts.json 生成。data-design-contract 表示条款所有权，不把设计稿提升为系统语义 authority。控件状态和业务作用仍须阅读所指正文。新增区域／动作需要更新映射与对应契约，并重新验证。','','| 稳定键 | 对应文档 |','|---|---|']
for key,value in contracts.items():lines.append('| `'+key+'` | '+' · '.join('['+d+'](../'+d+')' for d in value['documents'])+' |')
(b/'handoff/v8-contract-bindings.md').write_text('\n'.join(lines)+'\n')
print('contracts',len(contracts))
