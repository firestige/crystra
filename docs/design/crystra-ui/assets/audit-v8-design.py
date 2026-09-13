"""Reproducible static v8 inventory. References are evidence, not semantic approval."""
from pathlib import Path
from html.parser import HTMLParser
import re,json,hashlib
BASE=Path(__file__).resolve().parent.parent
REPO=BASE.parents[2]
OUT=BASE/'handoff/v8-design-audit'
PAGES=['crystra-task-work-v8-sidebar.html','crystra-task-browser-v8.html','crystra-workflow-explorer-v8.html','crystra-analysis-audit-v8.html']
docs={str(p.relative_to(BASE)):p.read_text() for folder in ['foundations','components','pages','flows','handoff'] for p in (BASE/folder).rglob('*.md') if 'v8-design-audit' not in str(p) and p.name!='v8-design-audit.md'}
class Inventory(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.records=[];self.styles=[];self.assets=[];self.instyle=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);key=a.get('data-section-id') or a.get('id');parent=next((x[1] for x in reversed(self.stack) if x[1]),None)
  interactive=tag in ['button','input','select','textarea','summary','a'] or a.get('role') in ['button','tab','menuitem','checkbox','radio','slider','switch'] or 'tabindex' in a or any(k.startswith('on') for k in a)
  semantic=key is not None or tag in ['section','article','aside','header','footer','nav','main','dialog','form','fieldset','table'] or a.get('role') in ['region','tablist','tabpanel','menu','list','tree','grid']
  if interactive or semantic:
   refs=[name for name,text in docs.items() if key and ('`'+key+'`') in text]
   self.records.append(dict(line=self.getpos()[0],tag=tag,key=key,parent=parent,interactive=interactive,semantic=semantic,label=a.get('aria-label') or a.get('title') or a.get('placeholder'),attributes=a,exactIdReferences=refs,referenceStatus='exact-id-reference-only' if refs else 'requires-family-or-state-mapping'))
  if tag=='link' and a.get('rel')=='stylesheet':self.assets.append(a.get('href'))
  if tag=='script' and 'src' in a:self.assets.append(a['src'])
  if tag=='style':self.instyle=True
  if tag not in ['input','img','br','hr','meta','link','source','wbr','area','base','embed','param','track']:self.stack.append((tag,key))
 def handle_endtag(self,tag):
  if tag=='style':self.instyle=False
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):
  if self.instyle:self.styles.append(data)
report={'scope':PAGES,'excluded':['crystra-workflow-studio-v8.html'],'method':'Static parsed DOM including hidden nodes; exact ID references are not coverage claims. Dynamic state census is separate.','pages':{}}
css_files=set()
for name in PAGES:
 p=BASE/'assets'/name;body=p.read_text();parser=Inventory();parser.feed(body)
 for a in parser.assets:
  if a and a.endswith('.css') and not a.startswith(('http:','https:')):css_files.add(BASE/'assets'/a)
 report['pages'][name]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'elements':parser.records,'linkedAssets':parser.assets,'inlineStyleBlocks':len(parser.styles),'inlineStyleLiteralColors':len(re.findall(r'#[0-9a-fA-F]{3,8}\b|rgba?\(',''.join(parser.styles))),'inlineStyleAttributes':sum('style' in r['attributes'] for r in parser.records)}
(OUT/'static-elements.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
# Source styles are inventoried separately from generated bundles, retaining line references.
source_css=list(css_files)+list((REPO/'wsr-ui/packages/bi/src').glob('*.css'))
source_css=list(dict.fromkeys(source_css))
used={};defined={};literals=[]
for p in source_css:
 if not p.exists():continue
 text=p.read_text();path=str(p.relative_to(REPO))
 for pattern,target in [(r'var\((--[\w-]+)',used),(r'(--[\w-]+)\s*:',defined)]:
  for m in re.finditer(pattern,text):target.setdefault(m.group(1),[]).append({'file':path,'line':text.count('\n',0,m.start())+1})
 if p.name=='workbench-preview.css':continue
 for i,line in enumerate(text.splitlines(),1):
  colors=re.findall(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)',line)
  if colors:literals.append({'file':path,'line':i,'colors':colors,'text':line[:500]})
theme={'method':'Auxiliary CSS text inventory of loaded styles plus library source CSS (may include unused/shared bundle definitions). Includes fallback literals, generated declarations and chart/host exceptions; not scoped element coverage or a defect count. Only individually verified in-scope candidates enter the report; Studio page itself is excluded.','definedVariables':defined,'usedVariables':used,'usedWithoutCssDefinition':{k:v for k,v in used.items() if k not in defined},'colorLiteralLines':literals}
(OUT/'theme-inventory.json').write_text(json.dumps(theme,ensure_ascii=False,indent=2)+'\n')
summary={name:{'elements':len(v['elements']),'interactive':sum(r['interactive'] for r in v['elements']),'semantic':sum(r['semantic'] for r in v['elements']),'exactIdReference':sum(bool(r['exactIdReferences']) for r in v['elements'])} for name,v in report['pages'].items()}
(OUT/'static-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False));print('theme variables',len(defined),'used',len(used),'unresolved candidates',len(theme['usedWithoutCssDefinition']))
