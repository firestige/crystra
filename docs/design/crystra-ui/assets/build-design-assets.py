"""Export the accepted font and page-color foundation, independent of prototype utilities."""
from pathlib import Path
import json,re,hashlib,html
r=Path(__file__).resolve().parent;out=r/'design-system';out.mkdir(exist_ok=True)
color=json.loads((r/'color.tokens.json').read_text());type_=json.loads((r/'typography.tokens.json').read_text());selected=type_['candidates']['balanced']
family='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
css=(r/'color.css').read_text();start=css.index(':root[data-palette="semantic"]');end=css.index('\n}',start)+2
css=css[start:end].replace(':root[data-palette="semantic"]','[data-crystra-theme="dark"]')
(out/'theme.css').write_text('/* Accepted dark page colors; opt in on the application root. Charts own their palette. */\n'+css+'\n')
lines=['/* Accepted balanced typography. Apply semantic roles only within the Crystra root. */','[data-crystra-theme="dark"] {',f' --type-font-family: {family};']
for role,v in selected.items():
 for prop,key in [('size','size'),('line','lineHeight'),('weight','weight')]:lines.append(f' --type-{role}-{prop}: {v[key]}'+('px;' if key!='weight' else ';'))
lines.append('}')
for role in selected:
 lines.append(f'[data-crystra-theme="dark"] [data-type="{role}"]:not([data-host-owned], [data-host-owned] *) {{font-family:var(--type-font-family);font-size:var(--type-{role}-size);line-height:var(--type-{role}-line);font-weight:var(--type-{role}-weight);letter-spacing:0;}}')
lines.append('[data-crystra-theme="dark"] [data-type="code"]:not([data-host-owned], [data-host-owned] *) {font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}')
(out/'typography.css').write_text('\n'.join(lines)+'\n')
export={'status':'accepted','date':'2026-09-08','scope':'Balanced typography and DSH-aligned five-family dark page colors. No layout, icon-size, light-theme or chart-palette approval implied.','fontFamily':family,'typography':{k:dict(v,meaning=type_['roles'][k]['description']) for k,v in selected.items()},'color':color}
icons=json.loads((r/'icon-size-candidates.json').read_text())
icon=dict(icons['candidates'][icons['selected']])
# Accepted monitoring object-icon role; historical size candidates remain unchanged.
icon['roleSizes']={**icon['roleSizes'], 'widget-signal':48}
export['scope']='Accepted balanced typography, DSH-aligned five-family dark page colors and DeepSeek-calibrated icon sizes. Layout, complete icon artwork and light theme remain outside this package.'
export['icon']={'status':'accepted','selected':icons['selected'],'roles':icon['roleSizes'],'hitAreas':{'tool':icon['toolButton'],'primary':icon['primaryButton'],'rail':icon['railButton']},'hostReference':icons['hostReference'],'contextMapping':{'new-task-expanded':'inline-action','new-task-collapsed':'navigation'},'hostOwnedExcluded':True}
iconlines=['/* Accepted DeepSeek icon dimensions. Artwork and background containers supplied by components. */','[data-crystra-theme="dark"] {']
for role,size in icon['roleSizes'].items():iconlines.append(f' --icon-{role}-size: {size}px;')
for role,size in export['icon']['hitAreas'].items():iconlines.append(f' --icon-{role}-hit: {size}px;')
iconlines.append('}')
for role in icon['roleSizes']:
 iconlines.append(f'[data-crystra-theme="dark"] [data-icon-role="{role}"][data-icon-kind="svg"]:not([data-host-owned], [data-host-owned] *) {{width:var(--icon-{role}-size);height:var(--icon-{role}-size);flex-shrink:0;}}')
 iconlines.append(f'[data-crystra-theme="dark"] [data-icon-role="{role}"][data-icon-kind="glyph"]:not([data-host-owned], [data-host-owned] *) {{font-size:var(--icon-{role}-size);line-height:1;}}')
(out/'icons.css').write_text('\n'.join(iconlines)+'\n')
(out/'tokens.json').write_text(json.dumps(export,ensure_ascii=False,indent=2)+'\n')
(out/'README.md').write_text('''# Crystra 基础视觉资产

状态：2026-09-08 用户已接受。字体 B「均衡」、DSH 对齐的深色页面五色方案，以及 DeepSeek 校准图标尺寸。

## 使用

```html
<link rel="stylesheet" href="theme.css">
<link rel="stylesheet" href="typography.css">
<link rel="stylesheet" href="icons.css">
<main data-crystra-theme="dark">
  <h1 data-type="page-title">页面标题</h1>
  <article style="background:var(--color-background-card);color:var(--color-text-primary)">
    <h2 data-type="card-title">卡片标题</h2>
    <p data-type="body">正文内容</p>
  </article>
</main>
```

组件直接引用 `--color-*` 和 `--type-*` 语义变量。以上 CSS 不依赖 Tailwind，也不包含原型选择器或布局覆盖。图表自行定义配色，颜色主题不自动覆盖图表。需要页面默认前景/背景时由组件显式引用对应变量。

- `tokens.json`：机器可读的已接受角色、数值、来源与派生公式；本地导出格式，不声明 DTCG 合规。
- `theme.css`：五个页面色系、宿主变体和语义别名。
- `typography.css`：字号、行高、字重与用途样式。
- `icons.css`：图标角色尺寸与点击区变量；使用 `data-icon-role` 和 `data-icon-kind="svg"`。新建入口按展开/折叠切换 inline-action / navigation；点击区由组件引用变量。通用图形见 `icons/`，含 Iconify 本地子集和来源清单。整个宿主 Input 排除通用覆盖。
- `index.html`：离线可打开的颜色/字体样式表，无脚本或外部依赖。
- `previews/`：Task 五个工作面的 1920×940 内容区截图；不是物理屏幕断点。
- `manifest.json`：文件与 SHA-256，供复核导出完整性。

未打包 Inter 字体文件；沿用系统回退。通用间距/形状变量已在 ../geometry.tokens.json 和 ../geometry.css 导出；Header 最终整合、宿主接入、浅色主题和图引擎仍后置。Widget 48px 对象信号角色已纳入本包，依据 Widget 监控语义的已接受紧凑配方。

从 assets 目录运行 `python3 build-color-tokens.py` 后运行 `python3 build-design-assets.py` 可重建导出。截图在 v8 渲染后另行刷新；生成脚本不会请求网络或修改页面行为。
''')
styles='''body{margin:0;padding:32px;background:var(--color-background-workspace);color:var(--color-text-primary);font-family:var(--type-font-family)} main{max-width:1400px;margin:auto} section{margin:28px 0} .grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.swatch{border:1px solid var(--color-border-default);border-radius:10px;overflow:hidden;background:var(--color-background-card)} .paint{height:52px}.copy{padding:10px}.copy p{margin:2px 0;overflow-wrap:anywhere}.sample{padding:14px 18px;border-bottom:1px solid var(--color-border-default)}.sample p{margin:4px 0}.muted{color:var(--color-text-muted)}'''
parts=['<!doctype html><html lang="zh-CN" data-crystra-theme="dark"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Crystra · 已接受字体与颜色资产</title><link rel="stylesheet" href="theme.css"><link rel="stylesheet" href="typography.css"><style>'+styles+'</style><body><main><h1 data-type="page-title">Crystra · 字体与颜色</h1><p data-type="body">B 均衡字号 · DSH 深色配色 · 页面五色语义 · 图表配色独立</p><section><h2 data-type="section-title">颜色角色</h2><div class="grid">']
for role,v in color['roles'].items():
 if role.startswith(('shadow','overlay')):continue
 parts.append(f'<article class="swatch"><div class="paint" data-swatch="{role}" style="background:var(--color-{role})"></div><div class="copy"><p data-type="item-title">{html.escape(v["meaning"])}</p><p data-type="meta" class="muted">{role} · {v["value"]}</p></div></article>')
parts.append('</div></section><section><h2 data-type="section-title">字体角色</h2>')
for role,v in selected.items():parts.append(f'<article class="sample"><p data-type="meta" class="muted">{role} · {v["size"]}/{v["lineHeight"]} · {v["weight"]}</p><p data-type="{role}">{html.escape(type_["roles"][role]["description"])} · Crystra Task</p></article>')
parts.append('</section><section><h2 data-type="section-title">已接受图标尺寸</h2><p data-type="body">DeepSeek 校准 · 示意框仅表达外接尺寸，正式图形资源见 icons 目录；此处仅示意尺寸。</p>')
for role,size in icon['roleSizes'].items():parts.append(f'<article class="sample"><span style="display:inline-block;width:{size}px;height:{size}px;box-sizing:border-box;border:1px solid var(--color-interaction-link)"></span><p data-type="meta">{role} · {size}px</p></article>')
parts.append('</section></main></body></html>');(out/'index.html').write_text('\n'.join(parts))
import shutil
shutil.copytree(r/'icons',out/'icons',dirs_exist_ok=True)
files={str(p.relative_to(out)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.rglob('*')) if p.is_file() and p.name!='manifest.json'}
(out/'manifest.json').write_text(json.dumps({'status':'accepted','files':files},ensure_ascii=False,indent=2)+'\n')
print('Exported',len(files),'files to',out)
