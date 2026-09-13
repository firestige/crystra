// Presentation-only size comparison. Does not reload, write domain data or change type/color.
(() => {
 const names={dsh:'DSH 校准',compact:'A 紧凑',balanced:'B 均衡',prominent:'C 醒目',original:'原稿'};
 const panel=document.getElementById('icon-preview');
 const apply=value=>{document.documentElement.dataset.iconScale=value;document.getElementById('icon-candidate-name').textContent=names[value];panel.querySelector(`input[value="${value}"]`).checked=true;};
 const requested=new URLSearchParams(location.search).get('icons');apply(Object.hasOwn(names,requested)?requested:'dsh');
 panel.addEventListener('change',e=>{if(e.target.name==='icon-candidate')apply(e.target.value);});
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.open=false;panel.querySelector('summary').focus();}});
})();
