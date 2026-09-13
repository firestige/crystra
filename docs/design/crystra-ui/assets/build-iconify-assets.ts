/** One-time v8 migration and reproducible local Iconify subset export. No network at render time. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
const require=createRequire(new URL('../../../../wsr-ui/package.json',import.meta.url));
const {JSDOM}=require('jsdom');
const tabler=require('@iconify-json/tabler/icons.json');
const dom=new JSDOM(readFileSync(root+'crystra-task-work-v8-sidebar.html','utf8'));const doc=dom.window.document;
const used=new Set<string>();
function svg(name:string,role='inline-action'):string {if(!tabler.icons[name])throw Error(name);used.add(name);return `<svg data-iconify="tabler:${name}" data-icon-role="${role}" data-icon-kind="svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${tabler.icons[name].body}</svg>`;}
const q=(id:string)=>doc.querySelector(`[data-section-id="${id}"]`);
const host=q('input-stream');host.setAttribute('data-host-owned','dsh-input');
for(const el of host.querySelectorAll('[data-type]'))el.removeAttribute('data-type');
if(!host.querySelector('.host-user')){
 const articles=host.querySelectorAll('[data-section-id="conversation-feed"]>article');
 articles[0].classList.add('host-user');articles[0].firstElementChild.remove();articles[1].classList.add('host-answer');articles[1].firstElementChild.remove();articles[2].classList.add('host-tool');articles[3].classList.add('host-notice');
 const composer=q('composer');composer.querySelector(':scope > p').outerHTML='<textarea class="host-textarea" aria-label="消息输入" placeholder="继续描述、纠偏或批准…"></textarea>';
 const toolbar=composer.lastElementChild;toolbar.className='host-toolbar';toolbar.removeAttribute('data-type');
 toolbar.innerHTML=`<div class="host-tools"><button data-section-id="composer-add" class="grid place-items-center" aria-label="添加附件">${svg('plus','primary-action')}</button><button data-section-id="composer-write-mode" aria-label="工作区写入">${svg('shield-lock')}<span class="host-mode-label">工作区写入</span>${svg('chevron-down','disclosure')}</button></div><div class="host-trailing"><button class="host-model" aria-label="模型与推理强度">DeepSeek-V4-Flash 高${svg('chevron-down','disclosure')}</button><button data-section-id="composer-send" class="grid place-items-center" aria-label="发送">${svg('arrow-up','primary-action')}</button></div>`;
}
// Convert standalone and embedded UI pictograms, leaving language punctuation and math deltas intact.
const symbols:Record<string,string>={'?':'help','⌘':'command','□':'square','•••':'dots','✓':'check','✔':'check','×':'x','✕':'x','＋':'plus','↑':'arrow-up','↓':'arrow-down','←':'arrow-left','→':'arrow-right','↗':'arrow-up-right','⌄':'chevron-down','⌃':'chevron-up','⌕':'search','▦':'table','⌁':'activity','◎':'target','⇄':'arrows-exchange','⚙':'settings','◇':'diamond','◆':'diamond-filled','◈':'diamond','●':'circle-filled','○':'circle','▸':'chevron-right','▾':'chevron-down','☰':'list','⤢':'arrows-maximize','↻':'refresh','!':'exclamation-mark','+':'plus','−':'minus','–':'minus','✦':'sparkles','▧':'file','◉':'circle-dot'};
for(const el of [...doc.querySelectorAll('[data-icon-kind="glyph"]')]) {
 if(el.querySelector('[data-iconify]'))continue;const t=el.textContent.trim();const name=symbols[t];if(!name)throw Error('Unmapped glyph '+t);
 const role=el.getAttribute('data-icon-role')||'content-marker';el.innerHTML=svg(name,role);el.removeAttribute('data-icon-kind');el.removeAttribute('data-icon-role');
}
const walk=doc.createTreeWalker(doc.body,dom.window.NodeFilter.SHOW_TEXT);const texts=[];while(walk.nextNode())texts.push(walk.currentNode);
const pattern=/[✓✔×✕＋↑↓←→↗⌄⌃⌕▦⌁◎⇄⚙◇◆◈●○▸▾☰⤢↻✦▧◉]/g;
for(const n of texts){if(n.parentElement.closest('script,style,svg,textarea,code,pre'))continue;if(!pattern.test(n.textContent)){pattern.lastIndex=0;continue;}pattern.lastIndex=0;const wrap=doc.createElement('span');wrap.innerHTML=n.textContent.replace(pattern,(c:string)=>svg(symbols[c],['⌄','⌃','▸','▾','←','→','↗'].includes(c)?'disclosure':'content-marker'));n.replaceWith(...wrap.childNodes);}
// Existing hand-written utility SVGs become the same Iconify family. DSH new-chat and own crystal remain source-owned SVG assets.
const nameById:Record<string,string>={'sidebar-toggle':'layout-sidebar-left-collapse','sidebar-rail-tasks':'clipboard-list','sidebar-rail-workflows':'git-branch','sidebar-rail-analysis':'chart-dots','sidebar-settings':'settings','task-search-action':'search','task-search-clear':'x','task-view-options-action':'adjustments-horizontal','task-section-toggle':'chevron-down','workflow-section-toggle':'chevron-down','analysis-section-toggle':'chevron-down','gate-queue-toggle':'chevron-down','execution-wave-metadata-toggle':'chevron-down'};
for(const el of [...doc.querySelectorAll('svg[data-icon-role]:not([data-iconify])')]){
 if(el.hasAttribute('data-brand-crystra')||el.closest('[data-section-id="new-task-icon"]'))continue;
 const id=el.closest('[data-section-id]')?.getAttribute('data-section-id');const name=el.hasAttribute('data-copy-icon')?'copy':el.hasAttribute('data-brand-expand')?'layout-sidebar-left-expand':nameById[id]||'chevron-down';
 el.innerHTML=tabler.icons[name].body;used.add(name);el.setAttribute('data-iconify','tabler:'+name);el.setAttribute('viewBox','0 0 24 24');el.removeAttribute('stroke');el.removeAttribute('stroke-width');
}
// DeepSeek branding uses its real host SVG; not a DS letter avatar.
const brand=doc.querySelector('[data-brand-deepseek]');if(brand?.textContent.trim()==='DS'){brand.innerHTML=readFileSync(root+'icons/deepseek-host.svg','utf8');brand.removeAttribute('style');}
for(const script of doc.querySelectorAll('script:not([src])')){
 let s=script.textContent;s=s.replace('>✓</span>',`>${svg('check','content-marker')}</span>`);
 s=s.replace("section('gate-context-back').textContent = `← 返回 ${gateProfiles[gateKey].id}`", "section('gate-context-back').innerHTML = `"+svg('arrow-left','disclosure')+" 返回 ${gateProfiles[gateKey].id}`");
 s=s.replace("section('plan-document-back').textContent = `← 返回 ${planReturnGateId}`", "section('plan-document-back').innerHTML = `"+svg('arrow-left','disclosure')+" 返回 ${planReturnGateId}`");script.textContent=s;
}
if(!doc.querySelector('link[href="dsh-input.css"]')){let link=doc.createElement('link');link.rel='stylesheet';link.href='dsh-input.css';doc.head.append(link);}
for(const el of doc.querySelectorAll('[data-iconify]'))used.add(el.getAttribute('data-iconify').split(':')[1]);
mkdirSync(root+'icons',{recursive:true});
for(const name of used)writeFileSync(root+`icons/tabler-${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${tabler.icons[name].body}</svg>\n`);
writeFileSync(root+'icons/iconify-subset.json',JSON.stringify({prefix:'tabler',width:24,height:24,icons:Object.fromEntries([...used].sort().map(n=>[n,tabler.icons[n]]))},null,2)+'\n');
writeFileSync(root+'icons/manifest.json',JSON.stringify({source:'@iconify-json/tabler 1.2.38',upstream:'Tabler 3.45.0',license:'MIT',icons:[...used].sort(),exceptions:{'new-task':'Exact DSH IconNewChatOutline16 host SVG','crystra':'Existing own brand SVG','deepseek':'Exact host brand SVG'},unicodeIcons:false},null,2)+'\n');
writeFileSync(root+'crystra-task-work-v8-sidebar.html',dom.serialize());console.log('Exported',used.size,'Iconify symbols and updated host Input');
