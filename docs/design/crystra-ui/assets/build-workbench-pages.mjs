import {readFile,writeFile} from 'node:fs/promises';
const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const dist=new URL('../../../../wsr-ui/packages/bi/dist-workbench-preview/',import.meta.url);
const build=await readFile(new URL('workbench-preview.html',dist),'utf8');
const js=await readFile(new URL(build.match(/<script[^>]*src="([^"]+)"/)[1].replace(/^\//,''),dist),'utf8');
const css=await readFile(new URL(build.match(/<link[^>]*href="([^"]+\.css)"/)[1].replace(/^\//,''),dist),'utf8');
await writeFile(new URL('workbench-preview.js',import.meta.url),js);
await writeFile(new URL('workbench-preview.css',import.meta.url),css);
const source=await read('crystra-task-work-v8-sidebar.html');
let sidebar=source.slice(source.indexOf('    const taskSearchControl ='),source.indexOf('    const previewSurface ='));
sidebar=sidebar.replace(/    const newTaskEmptyState =[\s\S]*?(?=    const setTaskSearchOpen)/,'');
const motion=source.slice(source.indexOf('  <div data-section-id="sidebar-tooltip"'),source.indexOf('<details id="icon-preview"'));
let input=source.slice(source.indexOf('        <section data-section-id="input-stream"'),source.indexOf('        <section data-section-id="control-workspace"'));
input=input.replace(/            <article class="rounded-lg border border-line bg-panel p-3 host-tool">[\s\S]*?(?=          <\/div>)/,'');
input=input.replace('请基于当前计划检查发布路径，并识别可以复用的模块化步骤。','我想把重复的包校验与市场兼容性检查整理成可复用工作流，异常时进入人工审核。').replace('已完成路径验证与步骤抽取，当前处于验证阶段，需要审阅结果。','右侧是构建与签名工作流的只读示例。你可以继续描述输入、输出与异常处理，再由 Chat 生成修订提案。');
for(const [kind,title] of [['workflow-studio','工作流工作台'],['analysis-audit','观测与分析']]){
 if(process.argv[2]&&process.argv[2]!==kind)continue;
 let shell=source.slice(0,source.indexOf('</aside>')+8).replace('Crystra · Task 工作台','Crystra · '+title);
 shell=shell.replace(/<script src="icon-preview.js"[^>]*><\/script>/,'');
 shell=shell.replace('<body','<body data-workbench-page="'+kind+'"');
 shell=shell.replace('</head>','<link rel="stylesheet" href="workbench-preview.css"><link rel="stylesheet" href="workbench-pages.css"></head>');
 const navigation=`document.querySelectorAll('[data-task-row]').forEach(row=>row.addEventListener('click',()=>location.href='crystra-task-work-v8-sidebar.html?task_id='+encodeURIComponent(row.dataset.taskId)));section('new-task-action').addEventListener('click',()=>location.href='crystra-task-work-v8-sidebar.html?new_task=1');document.querySelectorAll('[aria-current]').forEach(el=>el.removeAttribute('aria-current'));section('${kind==='workflow-studio'?'sidebar-rail-workflows':'sidebar-rail-analysis'}')?.setAttribute('aria-current','true');if('${kind}'==='analysis-audit') section('analysis-'+(new URLSearchParams(location.search).get('view')||'analysis')+'-action')?.setAttribute('aria-current','page');document.querySelectorAll('[data-section-id=composer] button').forEach(el=>{el.title='宿主 DSH 控件示意';});`;
 const active=`const p=new URLSearchParams(location.search);if('${kind}'==='workflow-studio'){const id=p.get('workflow_definition_id');document.querySelectorAll('[data-workflow-definition-id]').forEach(el=>{if(el.dataset.workflowDefinitionId===id)el.setAttribute('aria-current','page');});}else{const view=p.get('view')||'traces';section('analysis-'+(['dashboard','traces','reports'].includes(view)?view:'traces')+'-action')?.setAttribute('aria-current','page');}`;
 const html=shell+'<div id="workbench-root" data-page="'+kind+'"></div></main><template id="workbench-host-input">'+input+'</template><script>const section=name=>document.querySelector(`[data-section-id="${name}"]`);\n'+sidebar+'\n'+navigation+'\n'+active+'</script>'+motion+(kind==='workflow-studio'?'<script>'+await read('workflow-map-candidate.js')+';'+await read('workflow-resource-workspaces.js')+'</script>':'')+'<script type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script></body></html>';
 await writeFile(new URL('crystra-'+kind+'-v8.html',import.meta.url),html);
 console.log('Built '+kind+' with shared shell and library components.');
}

// Export the same semantic fixtures consumed by the preview; do not maintain a second copy.
for(const name of ['workflow-activity-ir.example.json','workflow-activity-ir.simple.json','workflow-projection-resources.example.json']){
 await writeFile(new URL(name,import.meta.url),await readFile(new URL('../../../../wsr-ui/packages/bi/src/domain/'+name,import.meta.url),'utf8'));
}
await import('./sync-search-components.mjs?build=workbench');
