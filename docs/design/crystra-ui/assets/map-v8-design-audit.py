"""Link inventory records to documented families, without claiming full contract coverage."""
from pathlib import Path
import json,csv
B=Path(__file__).resolve().parent.parent;O=B/'handoff/v8-design-audit'
runtime=json.loads((O/'runtime-elements.json').read_text());static=json.loads((O/'static-elements.json').read_text())
def family(page,e):
 a=' '.join(str(x) for x in e.get('parent',[]) if x) if isinstance(e.get('parent'),list) else str(e.get('parent',''))
 a+=' '+str(e.get('id',''))+' '+str(e.get('section',''))+' '+str(e.get('key',''))
 if any(x in a for x in ['input-stream','composer','host-approval','conversation-feed','better-sidebar']):return 'host-input-files',['components/input-and-host-slots.md','flows/cross-page-browsing.md']
 if any(x in a for x in ['crystra-sidebar','sidebar-','task-section','workflow-section','analysis-section','host-settings','all-tasks-action','all-workflows-action','new-task-action','surface-banner']):return 'shared-shell',['components/shell-and-sidebar.md','components/search-field-review.md']
 if 'task-browser' in page:return 'task-resource-browser',['pages/task-browser.md','components/component-recipes.md']
 if 'workflow-explorer' in page:return 'workflow-resource-browser',['pages/workflow-explorer.md','components/component-recipes.md']
 if 'analysis' in page:
  if any(x in a for x in ['result-analysis','observation-setting','observation-editor','编辑观察设置','添加数据列','选择 Delivery','分析帮助','观察设置','comparison-analysis']):return 'observation-settings',['components/result-analysis-review.md','pages/analysis-audit.md']
  if any(x in a for x in ['delivery-directory','Delivery 检索目录','trace-run-directory']):return 'delivery-directory',['components/delivery-directory-review.md','components/search-field-review.md']
  if any(x in a for x in ['trace-','span-passport','Recorded','Span','Tree camera']):return 'trace-views',['pages/analysis-audit.md','components/library/trace-waterfall.md','components/library/trace-tree.md']
  if any(x in a for x in ['widget','Widget','dashboard','Dashboard','obs-topic']):return 'overview-widgets',['pages/analysis-audit.md','components/widget-component-contract.md','components/widget-expression-design.md']
  return 'observation-page-context',['pages/analysis-audit.md']
 for name in ['grilling','plan','execution','gate','delivery']:
  if name+'-' in a or name+' ' in a:return 'task-'+name,['pages/task-detail/'+name+'.md','components/review-surfaces.md','components/graph-projections.md']
 return 'task-page-context',['pages/task-detail/README.md','components/context-viewers.md']
contracts=json.loads((B/'assets/design-contracts.json').read_text())['contracts']
rows=[]
for page,p in static['pages'].items():
 for i,e in enumerate(p['elements']):
  f,refs=family(page,e);rows.append([page,'static',i,e.get('line'),e.get('key'),e.get('tag'),e.get('interactive'),f,';'.join(refs),';'.join(e.get('exactIdReferences',[])),'family-reference; not full semantic certification'])
for state in runtime['states']:
 for i,e in enumerate(state['elements']):
  f=e['attributes'].get('data-design-contract','UNBOUND');refs=contracts.get(f,{}).get('documents',[]);rows.append([state['url'].split('/')[-1],state['name'],i,'',e.get('section') or e.get('id'),e['tag'],e['interactive'],f,';'.join(refs),'','explicit document owner; state census, not exhaustive behavior proof'])
with (O/'element-document-map.csv').open('w') as out:
 w=csv.writer(out);w.writerow(['page','state','inventoryIndex','sourceLine','elementKey','tag','interactive','family','familyDocuments','exactIdDocuments','evidenceLevel']);w.writerows(rows)
geometry=json.loads((B/'assets/geometry.tokens.json').read_text())
register={
 'status':'Reviewed geometry source exported to CSS and TypeScript; runtime theme probes recorded separately',
 'existingAssets':['assets/color.tokens.json','assets/geometry.tokens.json','assets/typography.tokens.json','assets/card-surfaces.css'],
 'observationRoles':geometry['groups']['observation'],
 'notAssetized':[],
 'unregisteredSemanticNameCandidates':[],
 'exceptionsToReviewSeparately':['--browser-card-width is runtime measurement','--crystra-widget-* optional host override','--tw-* tooling','chart data palettes and DSH-owned UI']}
(O/'semantic-asset-register.json').write_text(json.dumps(register,ensure_ascii=False,indent=2)+'\n')
print('mapped records',len(rows),'states',len(runtime['states']),'runtime failures',len(runtime['failures']))
print('Browser surfaces',[(s['name'],s['surfaces'][0]) for s in runtime['states'] if s['name'].endswith('-gallery')])
