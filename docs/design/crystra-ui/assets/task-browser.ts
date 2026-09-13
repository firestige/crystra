// Task-specific fixture and presentation adapter. Shared interactions live in resource-browser.ts.
type TaskStatus = 'running'|'attention'|'stopped'|'idle';
type BrowserTask = {
  id:string; title:string; goal:string; workspace:string; workspacePath:string;
  status:TaskStatus; active:boolean; createdAt:string; lastActivityAt:string;
  cost:number|null; attention:number|null; attentionBySeverity:{error:number;warn:number}|null;
  progress:{completed:number; total:number; scope:string}|null; thumbnail?:string;
};
mountResourceBrowser<BrowserTask>((h)=>{
const {escape,icon,stamp}=h;
const labels:Record<TaskStatus,string>={running:'运行中',attention:'需要关注',stopped:'已停止',idle:'暂无活动'};
const workspaces=['workflow-self-recursive','alu-frame-forge-rn','project-ops','plugin-lab'];
const titles=['校验资源导入结果','梳理组件使用说明','分析本次运行记录','验证构建产物','整理测试证据','更新页面布局','检查依赖兼容性','生成数据适配方案'];
const tasks:BrowserTask[]=Array.from({length:96},(_,i)=>{
  const w=Math.floor(i/24), n=i%24, workspace=workspaces[w];
  const status:TaskStatus=(['running','attention','stopped','idle'] as const)[i%4];
  const attentionBySeverity={error:status==='stopped'?(n===6?4:1):0,warn:status==='attention'?(n===5?11:1+n%3):status==='stopped'?(n===6?8:1):0};
  return {id:i===0?'task-ui-workbench':i===1?'task-market-release':`task-preview-${i+1}`,
    title:i===0?'UI 工作台设计':i===1?'发布插件市场方案':`${titles[n%titles.length]} · ${n+1}`,
    goal:i===0?'统一 Task、Workflow 与审核工作面的设计语言':i===1?'验证发布路径，并结晶可复用步骤':'保留当前上下文，推进这一轮目标与检查',
    workspace,workspacePath:`/Users/firestige/Projects/${workspace}`,
    status,active:status!=='idle',attention:attentionBySeverity.error+attentionBySeverity.warn,attentionBySeverity,
    createdAt:new Date(Date.UTC(2026,7,18+n%15,2+n%7,12)).toISOString(),
    lastActivityAt:new Date(Date.UTC(2026,8,8,8,40)-i*23*60000).toISOString(),
    cost:i===23?null:Math.round((4.8+n*2.37+w*5.4)*100)/100,
    progress:status==='idle'?null:i===2?null:{completed:3+n%8,total:12,scope:'当前 Plan Run 的执行单元'},
    thumbnail:i===0?'color-semantic-plan.png':i===1?'color-semantic-delivery.png':undefined};
});
const money=(t:BrowserTask)=>t.cost===null?'暂无数据':`¥${t.cost.toFixed(2)}`;
const percent=(t:BrowserTask)=>t.progress&&t.progress.total>0?Math.round(100*t.progress.completed/t.progress.total):null;
const progress=(t:BrowserTask)=>{
 const value=percent(t); if(value===null)return '<span class="progress-unknown">进度未知</span>';
 return `<div class="browser-progress" data-status="${t.status}" role="progressbar" aria-label="${escape(t.title)} · 当前执行进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" aria-valuetext="${t.progress!.completed} / ${t.progress!.total} 个执行单元" title="${t.progress!.scope}：${t.progress!.completed} / ${t.progress!.total}"><span style="width:${value}%"></span></div>`;
};
const status=(t:BrowserTask)=>`<span class="browser-chip tone-${t.status}">${labels[t.status]}</span>`;
const attention=(t:BrowserTask)=>`<span class="attention-count" data-count="${t.attention}">${t.attention===null?'关注项未知':`${t.attention} 项关注`}</span>`;
const href=(t:BrowserTask)=>`crystra-task-work-v8-sidebar.html?task_id=${encodeURIComponent(t.id)}`;
const attentionBadge=(t:BrowserTask)=>{
 if(!t.attention||!t.attentionBySeverity)return '';
 const severity=t.attentionBySeverity.error>0?'error':'warn';
 const description=`${t.attention} 项需要关注：${t.attentionBySeverity.error} 项错误，${t.attentionBySeverity.warn} 项警告`;
 return `<span class="task-attention-badge" data-severity="${severity}" aria-label="${description}" title="${description}">${t.attention>9?'9+':t.attention}</span>`;
};

return {
 kind:'task',noun:'任务',defaultIcon:'target',resources:tasks,
 linkLabel:t=>'打开任务：'+t.title+(t.attention?'，'+t.attention+' 项需要关注':''),
 subtitle:(t)=>t.goal,
 searchText:(t)=>[t.title,t.goal,t.workspace,t.workspacePath].join(' '),
 filter:(t,key)=>(key!=='active'||t.active)&&(key!=='attention'||(t.attention??0)>0),
 compare:(a,b,key)=>key==='cost'?(b.cost??-1)-(a.cost??-1):Date.parse(key==='created'?b.createdAt:b.lastActivityAt)-Date.parse(key==='created'?a.createdAt:a.lastActivityAt),
 groupBy:(t,key)=>key==='workspace'?t.workspace:key==='status'?labels[t.status]:'全部任务',
 href,renderStatus:status,renderBadge:attentionBadge,
 renderSeparator:(t)=>t.active&&percent(t)!==null?progress(t):'<div class="gallery-divider" title="'+(t.active?'进度未知':'暂无活动')+'"></div>',
 renderCells:(t)=>`<td><a class="cell-primary" href="${href(t)}">${escape(t.title)}</a><span class="cell-secondary">${escape(t.goal)}</span></td><td>${status(t)}</td><td class="workspace-cell" title="${escape(t.workspacePath)}">${escape(t.workspace)}</td><td>${t.active?`<div class="list-progress">${progress(t)}${percent(t)===null?'':`<span>${percent(t)}%</span>`}</div>`:'—'}</td><td>${t.active?attention(t):'—'}</td><td>${stamp(t.createdAt)}</td><td>${stamp(t.lastActivityAt)}</td><td class="cost-cell">${money(t)}</td>`
};
});
