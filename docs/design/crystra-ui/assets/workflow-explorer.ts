// Workflow resource adapter. Package status follows workflow-dsl@1.1.0;
// catalog metadata and display aliases are local prototype consumer fields.
type WorkflowCatalogItem=BrowserResource & {
 definitionId:string;revision:string;packageName:string;packageVersion:string;
 purpose:string;status:'DRAFT'|'CONFIRMED'|'DEPRECATED';
 createdAt:string;updatedAt:string;nodeCount:number;versionOrder:number;
};
mountResourceBrowser<WorkflowCatalogItem>(({escape,icon,stamp})=>{
 const labels={DRAFT:'草稿',CONFIRMED:'已确认',DEPRECATED:'已弃用'};
 const tones={DRAFT:'attention',CONFIRMED:'confirmed',DEPRECATED:'idle'};
 let versionMode:'latest'|'all'='latest';
 const samples=[
  ['build-and-sign','构建与签名','构建产物、验证依赖并生成签名'],
  ['market-validation','市场发布验证','检查上架信息、兼容性与发布条件'],
  ['publish-documentation','发布文档','整理变更说明并核对文档引用'],
  ['design-review','设计审核','审查设计边界、证据与验收条件'],
  ['resource-import','资源导入检查','验证导入资源的完整性与结构'],
  ['test-evidence','测试证据整理','收集执行记录并归并可核验证据'],
  ['dependency-check','依赖兼容检查','检查版本组合与运行环境要求'],
  ['release-qualification','发布资格验证','核对产物与发布检查清单']
 ];
 // The directory adapter supplies version order; neither updatedAt nor display name defines latest.
 const resources:WorkflowCatalogItem[]=Array.from({length:96},(_,i)=>{
  const sample=samples[i%samples.length];
  const definitionId=i<3?sample[0]:sample[0]+'-'+(i+1);
  return [1,2,10].map((version,index)=>{
   const revision=version+'.0.0';
   return {
    id:definitionId+'@'+revision,title:sample[1]+(i<8?'':' · '+(i+1)),definitionId,revision,
    packageName:definitionId,packageVersion:revision,purpose:sample[2],versionOrder:version,
    status:index===2?(['CONFIRMED','DRAFT','CONFIRMED','DEPRECATED'] as const)[i%4]:index===1?'DRAFT' as const:'CONFIRMED' as const,
    createdAt:new Date(Date.UTC(2026,7,18+i%12,2+i%7,12)+index*60000).toISOString(),
    updatedAt:new Date(Date.UTC(2026,8,8,8,40)-i*23*60000+index*60000).toISOString(),
    nodeCount:4+i%12+index,
    thumbnail:i===0?'color-semantic-plan.png':i===1?'color-semantic-delivery.png':undefined
   };
  });
 }).flat();
 const project=(items:WorkflowCatalogItem[])=>{
  if(versionMode==='all')return items;
  const latest=new Map<string,WorkflowCatalogItem>();
  for(const item of items){const previous=latest.get(item.definitionId);if(!previous||item.versionOrder>previous.versionOrder)latest.set(item.definitionId,item);}
  return [...latest.values()];
 };
 for(const button of document.querySelectorAll<HTMLButtonElement>('[data-version-mode]'))button.onclick=()=>{
  versionMode=button.dataset.versionMode==='all'?'all':'latest';
  document.querySelectorAll<HTMLButtonElement>('[data-version-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.versionMode===versionMode)));
  document.dispatchEvent(new CustomEvent('browser-projection-changed'));
 };
 const href=(t:WorkflowCatalogItem)=>{
  const params=new URLSearchParams({workflow_definition_id:t.definitionId,revision:t.revision});
  const from=new URLSearchParams(location.search).get('from_task_id');
  if(from)params.set('from_task_id',from);
  return 'crystra-workflow-studio-v8.html?'+params.toString();
 };
 const status=(t:WorkflowCatalogItem)=>'<span class="browser-chip tone-'+tones[t.status]+'">'+labels[t.status]+'</span>';
 return {
  kind:'workflow',noun:'工作流',defaultIcon:'git-branch',resources,defaultGrouping:'none',project,
  itemNoun:()=>versionMode==='all'?'版本':'工作流',
  resultLabel:items=>versionMode==='latest'?items.length+' 个工作流':items.length+' 个版本 · '+new Set(items.map(t=>t.definitionId)).size+' 个工作流',
  linkLabel:t=>'打开工作流：'+t.title+' v'+t.revision,
  subtitle:t=>t.purpose,
  searchText:t=>[t.title,t.definitionId,t.revision,t.packageName,t.purpose].join(' '),
  filter:(t,key)=>(key!=='confirmed'||t.status==='CONFIRMED')&&(key!=='draft'||t.status==='DRAFT'),
  compare:(a,b,key)=>key==='name'?a.title.localeCompare(b.title,'zh-CN'):Date.parse(key==='created'?b.createdAt:b.updatedAt)-Date.parse(key==='created'?a.createdAt:a.updatedAt),
  groupBy:(t,key)=>key==='status'?labels[t.status]:'全部工作流',
  href,renderStatus:status,
  renderSeparator:()=>'<div class="gallery-divider"></div>',
  renderBadge:t=>'<span class="workflow-revision" title="定义版本 '+escape(t.revision)+'">v'+escape(t.revision)+'</span>',
  extraAttributes:t=>'data-workflow-definition-id="'+escape(t.definitionId)+'" data-revision="'+escape(t.revision)+'"',
  renderCells:t=>`<td><a class="cell-primary" href="${href(t)}">${escape(t.title)}</a><span class="cell-secondary">${escape(t.purpose)}</span></td><td class="workflow-version-cell" title="${escape(t.definitionId)} @ ${escape(t.revision)}">v${escape(t.revision)}</td><td>${status(t)}</td><td class="workflow-node-cell">${t.nodeCount}</td><td>${stamp(t.createdAt)}</td><td>${stamp(t.updatedAt)}</td>`
 };
});
