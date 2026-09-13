"""Fail on stale evidence, dangling contracts or regressed reviewed theme consumption."""
from pathlib import Path
import hashlib,json
b=Path(__file__).resolve().parent.parent;o=b/'handoff/v8-design-audit'
r=json.loads((o/'runtime-elements.json').read_text());m=json.loads((b/'assets/design-contracts.json').read_text())
errors=list(r['failures'])
static=json.loads((o/'static-elements.json').read_text())
for page,info in static['pages'].items():
 if hashlib.sha256((b/'assets'/page).read_bytes()).hexdigest()!=info['sha256']:errors.append(page+': stale static evidence')
for key,c in m['contracts'].items():
 for doc in c['documents']:
  if not (b/doc.split('#')[0]).exists():errors.append(f'{key}: missing {doc}')
for s in r['states']:
 for e in s['elements']:
  if e['attributes'].get('data-design-contract') not in m['contracts']:errors.append(f"{s['name']}: unbound {e.get('label')}")
 if s['name'].endswith('-gallery'):
  for surface in s['surfaces']:
   if surface['border']!='rgba(255, 255, 255, 0.06)' or surface['shadow']=='none' or surface['radius']!='12px':errors.append(f"{s['name']}: card surface regression")
a={p['selector']:p for p in r['themeProbe']['after']}
for selector in ['.observation-chart-card','.observation-setting-name input','.result-analysis-help']:
 if a[selector]['bg']!='rgb(13, 71, 93)':errors.append(selector+': theme background disconnected')
if a['.observation-setting-name input']['radius']!='16px':errors.append('input radius disconnected')
if a['.result-analysis-help']['radius']!='20px':errors.append('modal radius disconnected')
if a['.result-analysis-layout']['gap']!='31px':errors.append('sidebar gap disconnected')
result={'states':len(r['states']),'contracts':len(m['contracts']),'runtimeRecords':sum(len(s['elements']) for s in r['states']),'errors':errors,'scope':'document ownership and sampled runtime/theme checks, not exhaustive production behavior'}
(o/'parity-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
