import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../..');
const packages=[];
const presentation=JSON.parse(fs.readFileSync(path.join(here,'resource-presentation-v1.json'),'utf8'));
if(presentation.schemaVersion!=='crystra.resource-presentation@1')throw Error('Unsupported resource presentation version');
for(const [dir,title] of [['implementation','Implementation'],['system-design','系统设计']]){
 const base=path.join(repo,'workflow-package',dir),files=[],nodes=[],edges=[];
 const add=(from,to,label)=>{if(!edges.some(e=>e.from===from&&e.to===to&&e.label===label))edges.push({from,to,label});};
 function walk(folder){for(const e of fs.readdirSync(folder,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(e.name.startsWith('.')||e.name==='node_modules'||e.isSymbolicLink())continue;const full=path.join(folder,e.name);if(e.isDirectory())walk(full);else if(e.isFile()){const rel=path.relative(base,full).split(path.sep).join('/'),bytes=fs.readFileSync(full);const mime=({'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.svg':'image/svg+xml','.avif':'image/avif','.bmp':'image/bmp'})[path.extname(rel).toLowerCase()];if(mime){files.push({path:rel,content:'',truncated:false,internal:false,...(bytes.length<=5000000?{imageData:'data:'+mime+';base64,'+bytes.toString('base64')}:{})});nodes.push({id:'file:'+rel,label:e.name,kind:'file',file:rel});continue;}if(bytes.includes(0))continue;const text=bytes.toString('utf8');files.push({path:rel,content:text.slice(0,300000),truncated:text.length>300000,size:bytes.length,internal:/^(definition|schemas|validators|conformance)\//.test(rel)});nodes.push({id:'file:'+rel,label:rel.split('/').at(-1),kind:'file',file:rel});}}}walk(base);
 const read=name=>JSON.parse(fs.readFileSync(path.join(base,'definition',name+'.json'),'utf8'));
 const pkg=read('package'),actions=read('actions').actions,routes=read('routes').routes,roles=read('roles').roles,artifacts=read('artifacts').artifacts;
 for(const r of [...pkg.resources.owned,...pkg.resources.referenced]){let rel=r.path?path.relative(base,path.resolve(base,'definition',r.path)).split(path.sep).join('/'):undefined;if(rel&&!files.some(f=>f.path===rel))rel=undefined;nodes.push({id:r.id,label:r.id,kind:'resource',file:rel,detail:JSON.stringify(r,null,2)});if(rel)add(r.id,'file:'+rel,'资源定义');}
 for(const r of roles)nodes.push({id:r.id,label:r.name||r.id,kind:'role',file:'definition/roles.json',detail:JSON.stringify(r,null,2)});
 for(const r of routes){nodes.push({id:r.id,label:r.id.replace(/^route\./,''),kind:'route',file:'definition/routes.json',detail:JSON.stringify(r,null,2)});add(r.id,r.role,'使用职责');if(r.resources.rolePrompt)add(r.role,r.resources.rolePrompt.id,'职责指令');for(const key of ['skills','tools'])for(const resource of r.resources[key]||[])add(r.id,resource.id,key==='skills'?'使用能力':'可用工具');if(r.resources.driver)add(r.id,r.resources.driver.id,'执行适配');for(const a of r.resources.actionPrompts||[])add(a.action,a.prompt.id,'活动工作指令');}
 for(const a of actions){nodes.push({id:a.id,label:a.name||a.id,kind:'action',file:'definition/actions.json',detail:JSON.stringify(a,null,2)});for(const route of a.allowedRoutes||[])add(a.id,route,'可用执行配置');}
 for(const a of artifacts){nodes.push({id:a.id,label:a.name||a.id,kind:'artifact',file:'definition/artifacts.json',detail:JSON.stringify(a,null,2)});if(a.template?.reference?.id)add(a.id,a.template.reference.id,'采用模板');if(a.producedBy)add(a.producedBy,a.id,'形成产出');for(const id of a.consumedBy||[])add(id,a.id,'使用材料');}
 for(const n of read('workflow').graph.nodes||[]){if(n.action){nodes.push({id:'activity:'+n.id,label:actions.find(a=>a.id===n.action)?.name||n.id,kind:'activity',file:'definition/workflow.json',detail:JSON.stringify(n,null,2)});add('activity:'+n.id,n.action,'活动定义');}}
 // Directory membership is explicitly NOT proof of runtime invocation.
 for(const skill of files.filter(f=>/^skills\/[^/]+\/SKILL\.md$/.test(f.path))){const folder=path.dirname(skill.path)+'/';for(const f of files.filter(f=>f.path.startsWith(folder)&&f.path!==skill.path))add('file:'+skill.path,'file:'+f.path,'随能力包提供');}
 // Only explicit relative Markdown links resolving to a local file are indexed.
 for(const f of files){if(!f.path.endsWith('.md'))continue;for(const m of f.content.matchAll(/\]\(([^\s)#]+)(?:#[^)]*)?\)/g)){const href=m[1];if(/^[a-z]+:|^\//i.test(href))continue;let target;try{target=path.posix.normalize(path.posix.join(path.posix.dirname(f.path),decodeURIComponent(href)));}catch{continue;}if(files.some(x=>x.path===target))add('file:'+f.path,'file:'+target,'文档链接');}}
 const ids=new Set(nodes.map(n=>n.id));for(const e of edges){for(const id of [e.from,e.to])if(!ids.has(id)){nodes.push({id,label:id,kind:'external',detail:'该引用未解析为当前 workspace 内的文件。'});ids.add(id);}}
 const claimed=new Set(),presentationIds=new Set();
 for(const view of presentation.workspaces['workflow-package/'+dir]||[]){
  if(!view.id||presentationIds.has(view.id))throw Error('Duplicate or missing presentation ID');presentationIds.add(view.id);
  if(view.type!=='cli'||view.renderer!=='markdown'||!view.memberRefs.includes(view.entryRef))throw Error('Invalid CLI presentation');
  const memberNodes=view.memberRefs.map(id=>{const n=nodes.find(n=>n.id===id&&n.kind==='resource');if(!n?.file||claimed.has(id))throw Error('Missing or duplicate member '+id);claimed.add(id);return n;});
  const entry=memberNodes.find(n=>n.id===view.entryRef),file=files.find(f=>f.path===entry.file);if(!file||!file.path.endsWith('.md'))throw Error('Missing Markdown entry');
  file.presentation={id:view.id,type:view.type,name:view.name,renderer:view.renderer,members:memberNodes.map(n=>n.file),aliases:[...view.memberRefs,...memberNodes.map(n=>'file:'+n.file)]};
 }
 packages.push({title,root:'workflow-package/'+dir,version:pkg.package.version,files,nodes,edges});
}
fs.writeFileSync(path.join(here,'workflow-resource-workspaces.js'),'window.crystraResourceWorkspaces='+JSON.stringify(packages).replaceAll('<','\\u003c')+';');
console.log(packages.map(p=>`${p.root}: ${p.files.length} files, ${p.edges.length} declared/membership edges`).join('\n'));
