from pathlib import Path
import json,html,re
root=Path(__file__).resolve().parents[4]; out=root/'tmp/20260907/Crystra-ui-design'; assets=out/'assets'
icons=json.loads((root/'wsr-ui/packages/bi/src/domain/crystra-icons.json').read_text())['icons']
def icon(name):return '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">'+icons[name]['body']+'</svg>'
rows=[
('status','状态信号','现在是什么状态？','1×1','短状态、等级或一个需关注数量；状态文字与色块共用。','不显示时间轴、多个实体或长解释。','Badge / Stat'),
('value','当前量值','现在是多少？','1×1','一个数值及单位；标题给出对象，时间范围按需提供。','加宽不能只是放大数字；有基准时改用对比类别。','Stat'),
('progress','进度与容量','完成多少、还差多少？','1×1、1×2、1×3；2×2 环形','1×1 数字；1×2 数字+线性条；1×3 再加范围/剩余；2×2 环形+一层说明。','只有定义了分母、目标或阈值才显示进度；不可用装饰条暗示事实。','Gauge / Bar gauge'),
('comparison','基准对比','相对基准变化多少？','1×2、1×3','当前值、明确基准和一个差值；宽版可补充两侧范围。','不自动把增加当作好事；完整多序列比较升级2×3或3×3。','Stat / Bar chart'),
('trend','时间趋势','它正在如何变化？','1×2、1×3 微趋势；2×3、3×3 完整图','小尺寸仅单序列无轴sparkline；大尺寸提供时间/数值轴、图例及需要的交互。','1×n 不放完整坐标轴和多序列。3×3展示趋势图，不把单值放在大块空白里。','Time series'),
('breakdown','组成与分布','总量由什么构成？','2×2 简要拆分；2×3、3×3 分析图','2×2 一个总量、最多三个相关组成；复杂分类、直方图、热力图用大面板。','紧凑拆分不等于迷你完整图表；需要轴或多维时升级。','Bar / Pie / Histogram / Heatmap'),
('history','状态历史','何时发生了状态变化？','2×3、3×3','多条状态带、明确时间轴和状态图例；按记录展示状态变化。','不压成1×1；当前状态另由状态信号承担。','State timeline / Status history'),
('records','记录明细','哪些记录支持这个结论？','2×3 起，可到3×3及更大合法面板','表格、事件/日志列表；显示字段、行与必要的筛选，超出容量允许内部滚动。','1×3的简短事件摘要只作入口，不冒充完整明细。','Table / Logs')]
def card(title,w,h,body,foot='',state='neutral'):
 marker=f'<span class="marker {state}" tabindex="0" role="img" aria-label="'+{'neutral':'示意数据','green':'正常','amber':'需要关注'}[state]+'" title="'+{'neutral':'示意数据','green':'正常','amber':'需要关注'}[state]+'"></span>'
 if state=='neutral': marker=''
 return f'<article class="widget" data-width="{w}" data-height="{h}" style="width:{w+(w//160-1)*16}px;height:{h+(h//160-1)*16}px"><header><span class="title">{title}</span>{marker}</header><div class="content">{body}</div><footer><span>{foot}</span><span role="img" aria-label="查看详情入口示意" title="查看详情入口示意">{icon("arrow-up-right")}</span></footer></article>'
def num(value,unit=''):return f'<div class="number">{value}<small>{unit}</small></div>'
def bar(p):return f'<div class="bar"><i style="width:{p}%"></i></div>'
spark='<svg viewBox="0 0 250 48" width="250" height="48" role="img" aria-label="单序列微趋势示意"><path d="M2 38 L25 33 L48 39 L70 27 L93 28 L116 21 L139 28 L162 15 L185 20 L208 10 L231 14 L248 4" fill="none" stroke="#6698ff" stroke-width="2"/></svg>'
ring='<div class="ring"><div>'+num('75','%')+'</div></div>'
linechart='''<svg viewBox="0 0 440 290" width="100%" role="img" aria-label="耗时随时间变化的完整趋势图示意"><g stroke="#414141"><path d="M45 15V250H425"/><path d="M45 70H425M45 130H425M45 190H425" stroke-dasharray="3 5"/></g><g fill="#aaa" font-size="12"><text x="4" y="20">ms</text><text x="14" y="75">90</text><text x="14" y="135">60</text><text x="14" y="195">30</text><text x="45" y="272">10:00</text><text x="205" y="272">10:30</text><text x="385" y="272">11:00</text></g><path d="M45 175L83 143L121 160L159 118L197 133L235 90L273 110L311 68L349 88L387 45L425 66" fill="none" stroke="#6698ff" stroke-width="3"/></svg>'''
history='''<div class="history"><div><span>执行 A</span><i class="g"></i><i class="g"></i><i class="a"></i><i class="g"></i></div><div><span>执行 B</span><i class="g"></i><i class="a"></i><i class="a"></i><i class="g"></i></div><div><span>执行 C</span><i class="g"></i><i class="g"></i><i class="g"></i><i class="g"></i></div></div><div class="axis">10:00 <span>10:30</span>11:00</div><p class="muted">绿色：正常　黄色：待关注</p>'''
examples={
'status':[card('当前状态',160,160,'<div class="signal"><strong>正常</strong></div>','当前','green')],
'value':[card('响应耗时',160,160,num('42','ms'),'最近一次')],
'progress':[card('采样覆盖率',320,160,'<div class="horizontal">'+num('75','%')+'<div class="grow">'+bar(75)+'<span class="muted">75 / 100 条</span></div></div>','当前窗口'),card('采样覆盖率',320,320,ring+'<p class="muted">已覆盖 75 条，尚缺 25 条</p>','当前窗口')],
'comparison':[card('响应耗时对比',320,160,'<div class="horizontal">'+num('42','ms')+'<div class="muted">基准 50 ms<br><strong class="blue">减少 8 ms</strong></div></div>','同一观测范围')],
'trend':[card('响应耗时趋势',480,160,'<div class="horizontal">'+num('42','ms')+spark+'</div>','最近 30 分钟 · 单序列'),card('响应耗时趋势',480,480,'<div class="horizontal">'+num('42','ms')+'<span class="muted">当前值</span></div>'+linechart,'10:00—11:00 · 示意')],
'breakdown':[card('调用构成',320,320,num('120','次')+'<div class="breakdown"><p>读取 <b>60</b></p>'+bar(50)+'<p>写入 <b>40</b></p>'+bar(33)+'<p>其他 <b>20</b></p>'+bar(17)+'</div>','同一观测范围')],
'history':[card('状态历史',480,320,history,'已记录状态 · 示意')],
'records':[card('事件明细',480,320,'<table class="records"><tr><th>时间</th><th>事件</th><th>状态</th></tr>'+''.join(f'<tr><td>10:{i*5:02d}</td><td>记录 {i+1}</td><td>{"正常" if i!=2 else "待关注"}</td></tr>' for i in range(5))+'</table>','5 条示例记录')]
}
css='''*{box-sizing:border-box}body{margin:0;background:#141414;color:#eee;font:14px/1.5 system-ui,sans-serif}main{max-width:1800px;margin:auto;padding:28px}h1{font-size:26px}h2{font-size:20px;margin:0 0 8px}p{margin:8px 0}a{color:#7ca8ff}table.matrix{width:100%;border-collapse:collapse;margin:24px 0}.matrix th,.matrix td{padding:12px;border:1px solid #373737;text-align:left}.matrix th{background:#262626}.group{display:grid;grid-template-columns:330px 1fr;gap:24px;padding:28px 0;border-top:1px solid #363636}.group p{color:#b5b5b5}.examples{display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start}.widget{flex-shrink:0;background:#232323;border:1px solid #424242;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:12px;overflow:hidden}.widget header,.widget footer{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-shrink:0}.title{font-size:14px;font-weight:500}.marker{display:inline-block;width:8px;height:8px;border-radius:2px;flex-shrink:0;background:#aaa}.green{background:#22c55e}.amber{background:#ffb300}.content{min-height:0;flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px}.widget footer{font-size:12px;color:#888}.widget footer svg{color:#6698ff}.number{font-size:32px;line-height:1.2;font-weight:600;white-space:nowrap}.number small{font-size:14px;font-weight:400;margin-left:5px;color:#aaa}.muted{color:#aaa;font-size:12px}.blue{color:#7ca8ff}.horizontal{display:flex;align-items:center;gap:20px}.grow{flex:1}.bar{height:6px;background:#414141;border-radius:4px;overflow:hidden;margin:5px 0}.bar i{height:100%;display:block;background:#6698ff}.signal{display:flex;align-items:center;gap:12px;font-size:26px}.signal .marker{width:14px;height:14px}.ring{width:154px;height:154px;margin:0 auto;background:conic-gradient(#6698ff 75%,#414141 0);border-radius:50%;padding:13px}.ring>div{height:100%;background:#232323;border-radius:50%;display:grid;place-items:center}.breakdown p{font-size:12px;display:flex;justify-content:space-between;margin:7px 0 0}.breakdown .bar{height:5px}.history>div{display:flex;gap:3px;margin:14px 0}.history span{width:60px}.history i{flex:1;height:24px}.g{background:#22c55e66}.a{background:#ffb30088}.axis{display:flex;justify-content:space-between;padding-left:60px;color:#999;font-size:12px}.records{border-collapse:collapse;width:100%;font-size:12px}.records th,.records td{text-align:left;padding:8px;border-bottom:1px solid #414141}.anatomy{display:grid;grid-template-columns:1fr 1fr;gap:24px;background:#222;padding:20px;border-radius:12px}.anatomy pre{margin:0;line-height:2;color:#baccdf}.note{padding:16px;border-left:3px solid #6698ff;background:#202634}.size{font-size:12px;color:#999;margin-bottom:8px}@media(max-width:1100px){.group{grid-template-columns:1fr}}'''
intro='''<h1>Widget：监控语义与尺寸配方</h1><p>设计已接受 · 所有数值/图表均为示意，不接入业务数据。单格160px、间距16px，跨格尺寸包含内部间距。</p><div class="note">单一信息不使用3×3。小尺寸回答一个问题；大尺寸用于多条记录、完整趋势或多维分析。角落不固定放满文字：保留必要的状态色块、来源标记与详情入口，重要状态仍有可读名称。</div>'''
matrix='<table class="matrix"><thead><tr><th>监控语义</th><th>读者的问题</th><th>建议尺寸（行×列）</th></tr></thead><tbody>'+''.join(f'<tr><td><a href="#{r[0]}">{r[1]}</a></td><td>{r[2]}</td><td>{r[3]}</td></tr>' for r in rows)+'</tbody></table>'
anatomy='''<div class="anatomy"><div><h2>Card 模块化，Widget 内容语义化</h2><p>Root：尺寸、边框、背景与状态。</p><p>Header：可选 leading 图标、title/subtitle、trailing 状态或工具。</p><p>Content：primary + 可选 visualization + supporting。</p><p>Footer：可选 provenance / freshness 与 actions。</p><p>空模块不占位；点击内容区与补充操作分离。图表模块只有需要时才存在。</p></div><pre>WidgetRoot\n  WidgetHeader?\n    leading / title / subtitle / trailing\n  WidgetContent\n    primary / visualization? / supporting?\n  WidgetFooter?\n    provenance / freshness / actions</pre></div>'''
def with_size(x):
 w=re.search('data-width="([0-9]+)',x).group(1); h=re.search('data-height="([0-9]+)',x).group(1)
 w=int(w); h=int(h); w=w+(w//160-1)*16; h=h+(h//160-1)*16
 return f'<div><div class="size">宽 {w} × 高 {h}px</div>{x}</div>'
sections=''.join(f'<section class="group" id="{r[0]}"><div><h2>{r[1]}</h2><strong>{r[2]}</strong><p>{r[4]}</p><p>{r[5]}</p><p>尺寸：{r[3]}</p><p>参考表达：{r[6]}</p></div><div class="examples">'+''.join(with_size(x) for x in examples[r[0]])+'</div></section>' for r in rows)
sources='''<h2>参考与边界</h2><p><a href="https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/">Grafana 可视化分类</a> · <a href="https://mui.com/material-ui/react-card/">MUI Card</a> · <a href="https://vuetifyjs.com/en/components/cards/">Vuetify Card</a></p><p>本页尺寸映射与8类监控语义是针对Crystra的建议，并非以上库规定的尺寸。只借鉴分类与模块组织，不引入MUI或Vuetify依赖。新候选渲染器尚未进入正式Registry；完整Workflow图继续遵守Archify参考要求。</p>'''
(assets/'widget-semantics.html').write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Crystra Widget 监控语义</title><style>'+css+'</style><body><main>'+intro+matrix+anatomy+sections+sources+'</main></body></html>')
md='''# Widget 监控语义与模块化提案

状态：分类、尺寸与示意已被用户接受；不是正式指标Registry的已实施声明。[分类说明与示意](../assets/widget-semantics.html)。

尺寸一律行×列，外框宽=列×160px+(列-1)×16px、高=行×160px+(行-1)×16px。3×3不用于单一状态、数值或填充性文字；用途是完整图表、多条记录或多维内容。照片墙是另一种资源媒体组合，目前不新增Crystra业务分类。

## 分类

| 语义 | 读者问题 | 建议尺寸 | 内容与限制 |
|---|---|---|---|
'''+''.join(f'| {r[1]} | {r[2]} | {r[3]} | {r[4]} {r[5]} |\n' for r in rows)+'''
## 基座模块与内容槽位

借鉴 MUI 的 Header / Content / Media / Actions / ActionArea，以及 Vuetify 的 item（title/subtitle）/ text / actions、prepend / append：模块负责排布，内容槽位负责含义。实现仍为React+TypeScript+Tailwind。

- WidgetRoot：唯一外框、固定尺寸、背景/边框/状态。
- WidgetHeader（可选）：leading 图标、title/subtitle、trailing状态/工具。标题不降格为四角注释。
- WidgetContent：primary（一个主要结论）、visualization（可选图形）、supporting（有限补充）。尺寸决定配方，不机械缩放。
- WidgetFooter（可选）：provenance/freshness及actions；不需要则不占高度。补充操作与主内容点击区独立。

四角不固定塞满槽位：状态用8px色块、图标14px，工具点击区仍28px。悬停可补充短说明；不能只靠颜色区分重要状态。绿色/黄色/红色沿既定语义，未知/缺数据用中性灰，不把未读取表现为正常；纯装饰不占槽位。图表配色仍独立。

## 与现有实现的关系

numeric-card / badge 的1×1、ratio-bar的1×1/1×2/1×3、table的2×3起，与现有规定一致。对比、sparkline、ring、简要拆分是已有规范中的候选，本文补充语义和示意，不宣称已实现或可随意扩大数值卡。完整趋势、分布、状态历史的新renderer仍待实现；Trace现有视图继续独立。3×3文本基座保留为槽位试验，不再作为单一信息展示推荐。

不修改 Task / Delivery / Gate 的事实语义；示例使用通用观测数据且明确为虚构示意。Widget只投影，业务写入继续遵守现有Chat边界。

## 来源

- [Grafana 可视化分类](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/)：区分Stat、Gauge、时间序列、状态历史、分类/分布、表格等表达。
- [MUI Card](https://mui.com/material-ui/react-card/)：容器与内容/媒体/操作分组，补充动作与主操作区独立。
- [Vuetify Card](https://vuetifyjs.com/en/components/cards/)与[官方文档源码](https://raw.githubusercontent.com/vuetifyjs/vuetify/master/packages/docs/src/pages/en/components/cards.md)：item/title/subtitle/text/actions与prepend/append组合。

8类监控语义及尺寸分配是基于这些参考与Crystra约束提出的设计判断，不是外部库给定标准。
'''
# The accepted specification is maintained separately; never overwrite it on asset rebuild.
