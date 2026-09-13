// Shared local prototype browser. Domain adapters own fields, queries and exact links.
declare const browserIcons:Record<string,string>;
type BrowserResource={id:string;title:string;thumbnail?:string};
type BrowserHelpers={escape:(value:unknown)=>string;icon:(name:string)=>string;stamp:(iso:string)=>string};
type BrowserConfig<T extends BrowserResource>={
 kind:'task'|'workflow';noun:string;defaultIcon:string;resources:T[];
 subtitle:(item:T)=>string;searchText:(item:T)=>string;
 filter:(item:T,key:string)=>boolean;compare:(a:T,b:T,key:string)=>number;
 groupBy:(item:T,key:string)=>string;href:(item:T)=>string;
 renderStatus:(item:T)=>string;renderCells:(item:T)=>string;
 renderSeparator:(item:T)=>string;renderBadge?:(item:T)=>string;
 extraAttributes?:(item:T)=>string;linkLabel?:(item:T)=>string;
 defaultGrouping?:string;project?:(items:T[])=>T[];
 resultLabel?:(items:T[])=>string;itemNoun?:()=>string;
};
function mountResourceBrowser<T extends BrowserResource>(createConfig:(h:BrowserHelpers)=>BrowserConfig<T>){
const $=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
const escape=(value:unknown)=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const icon=(name:string)=>browserIcons[name]||browserIcons.file;
const time=(iso:string)=>{
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(iso)).map(p=>[p.type,p.value]));
 return `${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
};
const stamp=(iso:string)=>`<time class="browser-time" datetime="${iso}" title="${new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',dateStyle:'medium',timeStyle:'long'}).format(new Date(iso))}">${time(iso)}</time>`;
const config=createConfig({escape,icon,stamp}),resources=config.resources;
let view:'gallery'|'list'='gallery',filter='all',grouping=config.defaultGrouping||'workspace',sort='activity',query='',page=1,pageSize=12;
const itemNoun=()=>config.itemNoun?.()||config.noun;
const selected=new Set<string>(),archived=new Set<string>(),pinned=new Set<string>();
let lastArchived:string[]=[];
const collapsed=new Set<string>(),loaded=new Map<string,number>();
let columns=1,observer:IntersectionObserver|null=null;
const scroll=$('browser-scroll');
const checkbox=(t:T)=>`<input type="checkbox" data-select-resource="${t.id}" aria-label="选择${config.noun}：${escape(t.title)}" ${selected.has(t.id)?'checked':''}>`;
const cardMenu=(t:T,scope='gallery')=>`<button class="task-more" data-card-more aria-label="${config.noun}操作：${escape(t.title)}" title="${config.noun}操作" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-${scope}-${t.id}">${icon('dots')}</button><div class="task-context-menu" id="menu-${scope}-${t.id}" role="menu" aria-label="${config.noun}操作" ${scope==='list'?'popover="manual"':''} hidden>
 <button role="menuitem" data-card-action="thumbnail">${icon('photo')}修改缩略图</button>
 <button role="menuitem" data-card-action="rename">${icon('pencil')}改名</button>
 <button role="menuitem" data-card-action="archive">${icon('archive')}归档</button>
 <button role="menuitem" data-card-action="pin">${icon(pinned.has(t.id)?'pinned-off':'pin')}${pinned.has(t.id)?'取消 Pin':'Pin'}</button>
 </div>`;
const card=(t:T)=>`<article class="browser-task-card" data-${config.kind}-card="${t.id}" data-resource-id="${t.id}" ${config.extraAttributes?.(t)||''} data-selected="${selected.has(t.id)}"><label class="task-select">${checkbox(t)}</label>${pinned.has(t.id)?`<span class="task-pin-marker" title="已 Pin" aria-label="已 Pin">${icon('pin')}</span>`: ''}<a class="task-card-link" href="${config.href(t)}" aria-label="${escape(config.linkLabel?.(t)||('打开'+config.noun+'：'+t.title))}">
 <div class="task-thumbnail">${t.thumbnail?`<img src="${t.thumbnail}" alt="${escape(t.title)}的缩略图" loading="lazy">`:icon(config.defaultIcon)}</div>
 ${config.renderSeparator(t)}
 ${config.renderBadge?.(t)||''}
 <div class="task-card-body"><div class="task-card-heading"><h3 title="${escape(t.title)}">${escape(t.title)}</h3>${config.renderStatus(t)}</div><p class="task-card-goal" title="${escape(config.subtitle(t))}">${escape(config.subtitle(t))}</p></div></a>${cardMenu(t)}</article>`;
const row=(t:T)=>`<tr data-list-${config.kind}="${t.id}" data-resource-id="${t.id}" ${config.extraAttributes?.(t)||''} data-selected="${selected.has(t.id)}"><td class="selection-cell"><label>${checkbox(t)}</label></td>${config.renderCells(t)}<td class="row-actions">${cardMenu(t,'list')}</td></tr>`;
const matches=()=>(config.project?.(resources)||resources).filter(t=>!archived.has(t.id)&&(!query||config.searchText(t).toLocaleLowerCase().includes(query))&&config.filter(t,filter)).sort((a,b)=>(Number(pinned.has(b.id))-Number(pinned.has(a.id)))||config.compare(a,b,sort));
const batch=()=>{
 const rowHeight=(document.querySelector('.browser-task-card')?.getBoundingClientRect().height||220)+16;
 return columns*Math.max(1,Math.ceil(scroll.clientHeight/rowHeight));
};
function measure(){
 const available=$('browser-gallery').clientWidth||scroll.clientWidth-64;
 columns=Math.max(1,Math.floor((available+16)/(272+16)));
 $('browser-gallery').style.setProperty('--browser-card-width',`${(available-(columns-1)*16)/columns}px`);
}
function gallery(items:T[]){
 observer?.disconnect();
 const groups=new Map<string,T[]>();
 for(const t of items){const key=config.groupBy(t,grouping);if(!groups.has(key))groups.set(key,[]);groups.get(key)!.push(t);}
 $('browser-gallery').replaceChildren();
 observer=new IntersectionObserver(entries=>{
  for(const e of entries){if(!e.isIntersecting)continue;const marker=e.target as HTMLElement;const bounds=marker.getBoundingClientRect(),viewport=scroll.getBoundingClientRect();if(bounds.top>viewport.bottom+scroll.clientHeight*.5||bounds.bottom<viewport.top)continue;const key=marker.dataset.loadMore!;const values=groups.get(key)!;if(collapsed.has(grouping+':'+key))continue;
   const previous=loaded.get(grouping+':'+key)||0;const next=Math.min(values.length,previous+batch());if(next===previous)continue;
   marker.previousElementSibling!.insertAdjacentHTML('beforeend',values.slice(previous,next).map(card).join(''));
   loaded.set(grouping+':'+key,next);marker.textContent=next===values.length?`${values.length} 个${itemNoun()}`:`已显示 ${next} / ${values.length}`;
   if(next===values.length)observer!.unobserve(marker);
   else {observer!.unobserve(marker);requestAnimationFrame(()=>{if(marker.isConnected&&view==='gallery')observer!.observe(marker);});}
  }
 },{root:scroll,rootMargin:`0px 0px ${Math.round(scroll.clientHeight*.5)}px 0px`});
 for(const [key,values] of groups){
  const stateKey=grouping+':'+key,closed=collapsed.has(stateKey),count=Math.min(values.length,Math.max(loaded.get(stateKey)||0,columns));loaded.set(stateKey,count);
  const group=document.createElement('section');group.className='browser-group';
  group.innerHTML=`<button class="browser-group-heading" data-group-toggle aria-expanded="${!closed}"><span class="group-chevron">${icon('chevron-down')}</span>${icon(grouping==='workspace'?'file':'table')}<span>${escape(key)}</span><span class="group-count">${values.length} 个${itemNoun()}</span></button><div class="browser-group-content" ${closed?'hidden':''}><div class="browser-flow">${values.slice(0,count).map(card).join('')}</div><div data-load-more="${escape(key)}">${count===values.length?`${values.length} 个${itemNoun()}`:`已显示 ${count} / ${values.length}`}</div></div>`;
  $('browser-gallery').append(group);
  const marker=group.querySelector<HTMLElement>('[data-load-more]')!;
  if(count<values.length&&!closed)observer.observe(marker);
  group.querySelector('button')!.onclick=()=>{
   const close=!collapsed.has(stateKey);if(close)collapsed.add(stateKey);else collapsed.delete(stateKey);
   group.querySelector('button')!.setAttribute('aria-expanded',String(!close));group.querySelector<HTMLElement>('.browser-group-content')!.hidden=close;
   if(close)observer!.unobserve(marker);else if((loaded.get(stateKey)||0)<values.length)observer!.observe(marker);
  };
 }
}
function syncSelection(){
 $('browser-batch-actions').hidden=selected.size===0;
 $<HTMLButtonElement>('browser-archive').disabled=selected.size===0;
 $('browser-selected-count').textContent=`已选 ${selected.size}`;
 const items=matches(),count=items.filter(t=>selected.has(t.id)).length;
 const all=$<HTMLInputElement>('browser-select-all');
 all.checked=items.length>0&&count===items.length;all.indeterminate=count>0&&count<items.length;all.disabled=items.length===0;
 document.querySelectorAll<HTMLInputElement>('[data-select-resource]').forEach(input=>{
  input.checked=selected.has(input.dataset.selectResource!);
  input.closest<HTMLElement>('[data-resource-id]')!.dataset.selected=String(input.checked);
 });
}
scroll.addEventListener('change',event=>{
 const input=event.target as HTMLInputElement;
 if(!input.matches('[data-select-resource]'))return;
 if(input.checked)selected.add(input.dataset.selectResource!);else selected.delete(input.dataset.selectResource!);
 syncSelection();
});
$('browser-select-all').onchange=()=>{
 for(const t of matches()){if($<HTMLInputElement>('browser-select-all').checked)selected.add(t.id);else selected.delete(t.id);}
 syncSelection();
};
$('browser-clear-selection').onclick=()=>{selected.clear();syncSelection();$('browser-select-all').focus();};
function archiveTasks(ids:string[]){
 if(!ids.length)return;
 lastArchived=ids;lastArchived.forEach(id=>{archived.add(id);selected.delete(id);});
 $('browser-archive-message').textContent=`已归档 ${lastArchived.length} 个${itemNoun()}`;
 $('browser-archive-notice').hidden=false;loaded.clear();render();$('browser-undo-archive').focus();
}
$('browser-archive').onclick=()=>archiveTasks([...selected]);
$('browser-undo-archive').onclick=()=>{
 lastArchived.forEach(id=>archived.delete(id));lastArchived=[];
 $('browser-archive-notice').hidden=true;loaded.clear();render();$('browser-select-all').focus();
};
$('browser-dismiss-notice').onclick=()=>{$('browser-archive-notice').hidden=true;$('browser-select-all').focus();};
function render(){
 closeCardMenu();
 syncSelection();
 const items=matches(),pages=Math.max(1,Math.ceil(items.length/pageSize));page=Math.min(page,pages);
 $('browser-result-count').textContent=(config.resultLabel?.(items)||`${items.length} 个${config.noun}`)+(query?' · 搜索结果':'');
 $('browser-gallery').hidden=view!=='gallery';$('browser-list').hidden=view!=='list'||!items.length;
 $('browser-pagination').hidden=view!=='list';$('browser-group-label').hidden=view!=='gallery';$('browser-empty').hidden=!!items.length;
 $('browser-view-toggle-seat').dataset.view=view;
 document.dispatchEvent(new CustomEvent('browser-view-changed',{detail:view}));

 if(view==='gallery'){measure();gallery(items);}else{
  observer?.disconnect();$('browser-list-body').innerHTML=items.slice((page-1)*pageSize,page*pageSize).map(row).join('');
  $('browser-page-label').textContent=items.length?`${(page-1)*pageSize+1}–${Math.min(page*pageSize,items.length)} / ${items.length} · 第 ${page} / ${pages} 页`:`0 个${config.noun}`;
  $<HTMLButtonElement>('browser-prev').disabled=page===1;$<HTMLButtonElement>('browser-next').disabled=page>=pages;
 }
}
function reset(){page=1;loaded.clear();render();scroll.scrollTop=0;}
document.addEventListener('browser-projection-changed',()=>{selected.clear();reset();});
$<HTMLInputElement>('browser-search').oninput=e=>{query=(e.target as HTMLInputElement).value.trim().toLocaleLowerCase();selected.clear();reset();};
const sortButton=$('browser-sort-toggle'),sortMenu=$('browser-sort-menu');
const sortOptions=Array.from(sortMenu.querySelectorAll<HTMLButtonElement>('[data-sort-option]'));
function closeSort(restore=false){sortMenu.hidden=true;sortButton.setAttribute('aria-expanded','false');if(restore)sortButton.focus();}
function openSort(){sortMenu.hidden=false;sortButton.setAttribute('aria-expanded','true');sortOptions.find(b=>b.dataset.sortOption===sort)!.focus();}
sortButton.onclick=()=>{if(sortMenu.hidden)openSort();else closeSort();};
sortButton.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();openSort();}};
for(const option of sortOptions)option.onclick=()=>{
 sort=option.dataset.sortOption!;
 sortOptions.forEach(b=>b.setAttribute('aria-checked',String(b===option)));
 const label=`排序：${option.textContent}，${option.dataset.direction||'降序'}`;sortButton.title=label;sortButton.setAttribute('aria-label',label);
 closeSort(true);reset();
};
sortMenu.onkeydown=e=>{
 if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeSort(true);}
 if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
  e.preventDefault();const current=sortOptions.indexOf(document.activeElement as HTMLButtonElement);
  const next=e.key==='Home'?0:e.key==='End'?sortOptions.length-1:(current+(e.key==='ArrowDown'?1:-1)+sortOptions.length)%sortOptions.length;sortOptions[next].focus();
 }
};
document.addEventListener('pointerdown',e=>{if(!(e.target as HTMLElement).closest('.browser-sort-control'))closeSort();});
document.addEventListener('focusin',e=>{if(!(e.target as HTMLElement).closest('.browser-sort-control'))closeSort();});
window.addEventListener('resize',()=>closeSort());
scroll.addEventListener('scroll',()=>closeSort(),{passive:true});
$<HTMLSelectElement>('browser-group').onchange=e=>{grouping=(e.target as HTMLSelectElement).value;reset();};
for(const choice of document.querySelectorAll<HTMLButtonElement>('[data-browser-filter]'))choice.onclick=()=>{filter=choice.dataset.browserFilter!;selected.clear();document.querySelectorAll('[data-browser-filter]').forEach(b=>b.setAttribute('aria-pressed',String((b as HTMLElement).dataset.browserFilter===filter)));reset();};
document.addEventListener('browser-view-request',event=>{
 const next=(event as CustomEvent<string>).detail;
 if(next!=='gallery'&&next!=='list')return;
 view=next;render();scroll.scrollTop=0;
});
$('browser-prev').onclick=()=>{page--;render();$('browser-list').scrollIntoView({block:'start'});};
$('browser-next').onclick=()=>{page++;render();$('browser-list').scrollIntoView({block:'start'});};
$<HTMLSelectElement>('browser-page-size').onchange=e=>{pageSize=Number((e.target as HTMLSelectElement).value);page=1;render();};
$('browser-list-body').onclick=e=>{const target=e.target as HTMLElement;if(target.closest('a,button,input,label,.selection-cell')||window.getSelection()?.toString())return;const id=target.closest<HTMLElement>('[data-resource-id]')?.dataset.resourceId;const t=resources.find(t=>t.id===id);if(t)location.href=config.href(t);};
document.querySelectorAll<HTMLElement>('[data-browser-icon]').forEach(el=>el.innerHTML=icon(el.dataset.browserIcon!));
const shellLinks=[
 ['all-tasks-action','crystra-task-browser-v8.html','task'],
 ['all-workflows-action','crystra-workflow-explorer-v8.html','workflow']
] as const;
for(const [section,path,kind] of shellLinks){
 const link=document.querySelector<HTMLAnchorElement>('[data-section-id="'+section+'"]')!;
 link.href=path;
 if(kind===config.kind){link.setAttribute('aria-current','page');link.style.background='var(--palette-neutral-hover)';}
 else {link.removeAttribute('aria-current');link.style.background='';}
}
document.querySelector('[data-section-id=new-task-action]')!.addEventListener('click',()=>location.href='crystra-task-work-v8-sidebar.html?new_task=1');
document.querySelectorAll<HTMLElement>('[data-task-row]').forEach(el=>el.addEventListener('click',()=>location.href='crystra-task-work-v8-sidebar.html?task_id='+encodeURIComponent(el.dataset.taskId!)));
let lastWidth=0,lastHeight=0,resizeTimer:number;
new ResizeObserver(()=>{const width=scroll.clientWidth,height=scroll.clientHeight;if(width===lastWidth&&height===lastHeight)return;lastWidth=width;lastHeight=height;measure();clearTimeout(resizeTimer);resizeTimer=window.setTimeout(()=>{if(view==='gallery')render();},360);}).observe(scroll);
let openMenu:HTMLElement|null=null,menuTrigger:HTMLButtonElement|null=null;
let editingTaskId:string|null=null,thumbnailTaskId:string|null=null;
const renameDialog=$<HTMLDialogElement>('browser-rename-dialog');
function focusTask(id:string){
 const attribute=view==='gallery'?'data-'+config.kind+'-card':'data-list-'+config.kind;
 document.querySelector<HTMLButtonElement>('['+attribute+'="'+id+'"] [data-card-more]')?.focus();
}
function closeCardMenu(restore=false){
 if(openMenu){if(openMenu.matches(':popover-open'))openMenu.hidePopover();openMenu.hidden=true;}
 menuTrigger?.setAttribute('aria-expanded','false');
 if(restore&&menuTrigger?.isConnected)menuTrigger.focus();
 openMenu=null;menuTrigger=null;
}
scroll.addEventListener('click',event=>{
 const target=event.target as HTMLElement;
 const trigger=target.closest<HTMLButtonElement>('[data-card-more]');
 if(trigger){
  event.preventDefault();event.stopPropagation();
  const wasOpen=trigger===menuTrigger;closeCardMenu();
  if(wasOpen)return;
  menuTrigger=trigger;openMenu=trigger.parentElement!.querySelector<HTMLElement>('[role=menu]')!;
  trigger.setAttribute('aria-expanded','true');openMenu.hidden=false;
  if(openMenu.hasAttribute('popover')){
   const anchor=trigger.getBoundingClientRect();
   openMenu.style.left=`${Math.max(8,Math.min(anchor.right-168,innerWidth-176))}px`;
   openMenu.style.top=`${anchor.bottom+4}px`;
   openMenu.style.maxHeight=`${Math.max(0,innerHeight-anchor.bottom-12)}px`;
   openMenu.showPopover();
  }
  openMenu.querySelector<HTMLButtonElement>('button')!.focus();return;
 }
 const action=target.closest<HTMLButtonElement>('[data-card-action]');
 if(!action)return;
 event.preventDefault();event.stopPropagation();
 const owner=action.closest<HTMLElement>('[data-resource-id]')!;
 const id=owner.dataset.resourceId!;
 const task=resources.find(t=>t.id===id)!;closeCardMenu(true);
 switch(action.dataset.cardAction){
  case 'rename':
   editingTaskId=id;$<HTMLInputElement>('browser-rename-input').value=task.title;
   renameDialog.showModal();$<HTMLInputElement>('browser-rename-input').select();break;
  case 'thumbnail':
   thumbnailTaskId=id;$<HTMLInputElement>('browser-thumbnail-input').value='';
   $<HTMLInputElement>('browser-thumbnail-input').click();break;
  case 'archive':archiveTasks([id]);break;
  case 'pin':
   if(pinned.has(id))pinned.delete(id);else pinned.add(id);
   render();focusTask(id);break;
 }
});
document.addEventListener('pointerdown',event=>{
 if(openMenu&&!(event.target as HTMLElement).closest('.task-context-menu,[data-card-more]'))closeCardMenu();
});
document.addEventListener('focusin',event=>{
 if(openMenu&&!(event.target as HTMLElement).closest('.task-context-menu,[data-card-more]'))closeCardMenu();
});
document.addEventListener('keydown',event=>{
 if(!openMenu)return;
 if(event.key==='Escape'){event.preventDefault();closeCardMenu(true);return;}
 if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
 event.preventDefault();
 const buttons=Array.from(openMenu.querySelectorAll<HTMLButtonElement>('button'));
 const current=buttons.indexOf(document.activeElement as HTMLButtonElement);
 buttons[event.key==='Home'?0:event.key==='End'?buttons.length-1:(current+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus();
});
scroll.addEventListener('scroll',()=>closeCardMenu(),{passive:true});
window.addEventListener('resize',()=>closeCardMenu());
$('browser-rename-cancel').onclick=()=>renameDialog.close();
renameDialog.addEventListener('close',()=>{if(editingTaskId)focusTask(editingTaskId);editingTaskId=null;});
$('browser-rename-form').onsubmit=event=>{
 event.preventDefault();
 const input=$<HTMLInputElement>('browser-rename-input'),title=input.value.trim();
 if(!title){input.setCustomValidity(`请输入${config.noun}名称`);input.reportValidity();return;}
 const task=resources.find(t=>t.id===editingTaskId);if(!task)return;
 task.title=title;renameDialog.close();render();focusTask(task.id);
};
$('browser-rename-input').oninput=()=> $<HTMLInputElement>('browser-rename-input').setCustomValidity('');
function editNotice(message:string){
 $('browser-edit-message').textContent=message;$('browser-edit-notice').hidden=false;
}
$('browser-edit-dismiss').onclick=()=>{$('browser-edit-notice').hidden=true;};
$<HTMLInputElement>('browser-thumbnail-input').onchange=async event=>{
 const input=event.target as HTMLInputElement,file=input.files?.[0],id=thumbnailTaskId;
 thumbnailTaskId=null;if(!file||!id)return;
 if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)){editNotice('请选择 PNG、JPEG、WebP 或 GIF 图片');return;}
 try{
  const source=await new Promise<string>((resolve,reject)=>{
   const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);
  });
  const preview=new Image();preview.src=source;await preview.decode();
  const task=resources.find(t=>t.id===id);if(!task)return;
  task.thumbnail=source;render();focusTask(id);
 }catch{editNotice('图片无法读取，请重新选择');}
};

render();
}
