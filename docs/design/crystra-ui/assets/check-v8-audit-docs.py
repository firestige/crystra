from pathlib import Path
from urllib.parse import unquote,urlsplit
import re,json
b=Path(__file__).resolve().parent.parent
names=['handoff/v8-contract-bindings.md','components/configuration-files.md','README.md','components/README.md','components/component-inventory.md','components/result-analysis-review.md','components/library/trace-waterfall.md','components/library/trace-tree.md','pages/analysis-audit.md','foundations/spacing-and-shape.md','foundations/theme-coverage.md','handoff/decisions-and-open-questions.md','handoff/validation-report.md','handoff/v8-design-audit.md']
errors=[];count=0
def slug(text):
 text=re.sub(r'\[([^]]+)\]\([^)]+\)',r'\1',text)
 return re.sub(r'[^\w\-\s]','',text.lower()).replace(' ','-')
for name in names:
 p=b/name;s=p.read_text()
 for m in re.finditer(r'(?<!!)\[[^\]]*\]\(([^)]+)\)',s):
  raw=m[1].strip('<>');u=urlsplit(raw)
  if u.scheme or raw.startswith('mailto:'):continue
  count+=1;dest=(p.parent/unquote(u.path)).resolve() if u.path else p
  if not dest.exists():errors.append({'file':name,'target':raw,'reason':'missing file'});continue
  if u.fragment and dest.suffix=='.md':
   text=dest.read_text();anchors=[slug(x) for x in re.findall(r'^#{1,6}\s+(.+)$',text,re.M)]
   if unquote(u.fragment) not in anchors and not re.search(r'(?:id|name)=[\"\']'+re.escape(unquote(u.fragment)),text):errors.append({'file':name,'target':raw,'reason':'missing heading anchor'})
result={'documents':len(names),'localLinksChecked':count,'errors':errors}
(b/'handoff/v8-design-audit/document-links.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False,indent=2))
