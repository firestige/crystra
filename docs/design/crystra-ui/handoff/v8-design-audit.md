# v8 设计—文档—代码—主题审核

> 2026-09-11。本次检查 Task Work、Task Browser、Workflow Explorer、Analysis & Audit 四份当前 v8；明确排除 `crystra-workflow-studio-v8.html` 的页面内容。公共 Shell 及共享组件仍按它们在四页中的使用检查。只归并已确认设计，不以原型代码反向批准新业务规则。

## 当前修正结果

本轮已按原检查结论修正 V8-01 至 V8-09，并重建四份 v8。下方初检表保留原因与原始差异，用于追溯；不再表示当前待办。

| 项目 | 当前处理 |
|---|---|
| V8-01 契约关联 | 增加 [契约注册表](../assets/design-contracts.json)、[可读绑定表](v8-contract-bindings.md) 与运行时 `data-design-contract`。静态区域使用稳定键，动态组件按明确组件边界继承；portal tooltip 单独绑定。扫描遇到未注册的绑定会失败。绑定代表文档 owner，不能代替行为验收 |
| V8-02 Card | Browser 与 Task 卡片接入公共 Card 表面；资源卡背景、弱边框、圆角、双层阴影经计算样式验证；Browser 使用语义颜色角色 |
| V8-03 表单与模态 | 名称／标题使用共享 TextInput；浮层、文字、边框、形状改为对应角色，主题探针确认响应 |
| V8-04 布局资产 | observation 几何角色进入 JSON，生成 CSS 与 TS；列宽、断点、间距、侧栏、编辑器、动效、遮罩与缩略图留白同源 |
| V8-05 未登记变量 | panel/base/primary 与 status-primary-border 旧别名改为已注册的 workspace/card/selected-border 角色 |
| V8-06 配色作用域 | 普通设置区域归组件 owner；chart 标记仅用于图内绘制，外围表单继续消费主题 |
| V8-07 文件交互 | 保持 D23：直接下载；导入调用系统文件选择器，页面负责校验与提交 |
| V8-08 热力图导入 | 显式及隐式多指标颜色映射都拒绝；单指标映射允许，新增回归测试 |
| V8-09 追踪交互 | 缩略图补方向键、Shift 方向键、Home；搜索和结构操作接入中英文消息表，页面默认中文；更新组件契约 |
| V8-10 原型边界 | 保持明确：真实索引、指标服务、宿主持久化、完整产品 i18n 与跨页恢复由生产接入完成。本轮统一设计与演示，不把 fixture 当生产服务 |

修正后的测试、状态扫描与主题探针见本报告末尾。初检差异与当前处理有一对一对应，不再保留相反的有效设计规则。

## 初次检查结论（修正前）

**三项“所有元素”标准目前均不能判定为全量通过。** 主要页面与组件已具备设计契约，但逐元素的当前版本索引不完整，存在文档与实现错位；视觉变量资产也只是部分接入。尤其不能把“已经写成 HTML/React”“有一份 tokens.json”或“颜色看起来一样”视作完成。

| 用户要求 | 已确认部分 | 未通过部分 |
|---|---|---|
| 所有可交互元素有明确文档 | Shell、Browser 操作、Task 五工作面、观测日期／布局／目录／观察设置有契约；本次补齐新观察设置动作表 | 旧逐元素索引针对 v7；运行时新元素缺稳定的逐项契约绑定；专业图表手势及部分映射边界未完整定义或与实现不同 |
| 所有语义区域和组件有用途／场景 | 全局基础、组件库与四页正文存在；本次归并新数据列、轴映射、侧栏、编辑器等用途 | 整个对比分析区域被标成 chart 色彩作用域，超出文档定义；部分页面专用区域只有页面描述，没有独立组合契约／导出边界 |
| 布局配色有语义及 theme 资产，并在代码消费 | typography、五色、geometry、组件配方等已有 JSON/CSS；共享 Card 可响应颜色及圆角变量 | Browser Card 未消费统一阴影；观测模态／输入／布局有字面量；出现未登记的颜色变量名；新增断点等没有进入共享语义资产和消费链 |

本报告交付的是检查结果，不把缺口改名为“例外”以获得通过。宿主操作和图表专业配色可以有不同 owner，但必须明确其契约与绑定；本次不要求新增浅色主题，也不将纯数据值误报为 theme 值。

## 检查范围、方法与证据

1. HTMLParser 解析四页真实静态 DOM（不把 JS 字符串误当静态元素），记录标签、定位键、父区域、交互属性、源码行和现有文档精确 ID 引用。
2. 本机 Chrome 运行 23 个命名状态，采集菜单、改名窗口、Gallery / List、观测三个工作面、日期选择、布局编辑、添加 Widget、观察设置编辑、指标目录、数据范围和帮助。包含当前 DOM 中的隐藏元素，不能以其“存在”推导可见或行为正确。
3. 核对四页装配链、共享 React 组合、Browser TS adapter、相关 CSS、现有主题 JSON 和 CSS 消费。自动颜色扫描包括 fallback／生成声明／图表原色，因此扫描数量不是缺陷数量。
4. 在独立浏览器页面临时覆盖语义变量，读取最终计算样式；不修改原文件。以此区分变量存在与变量真正控制目标元素。
5. 通过页面、组件、全局及输入来源进行人工组件族对照，记录可继承规则及缺口；仅有精确 ID 引用也不等于交互完整。

静态库存（交互与语义集合相交，不能相加；Analysis 主体由 React 生成，静态计数明显偏小）：

| v8 | 库存元素 | 静态交互候选 | 静态语义候选 | 具有精确 ID 文档引用的元素 |
|---|---:|---:|---:|---:|
| Task Work | 377 | 96 | 359 | 323 |
| Task Browser | 128 | 60 | 116 | 67 |
| Workflow Explorer | 130 | 62 | 116 | 61 |
| Analysis & Audit | 95 | 43 | 88 | 69 |

这些数不是文档覆盖率；有引用的元素可能只出现在旧 v7 库存中，无精确 ID 的元素也可能已有完整组件族契约。运行态数据中的每条记录附所属页面／状态、属性和祖先区域；对应文档索引见 [元素对应表](v8-design-audit/element-document-map.csv)。匹配仅用于导航，未用模糊匹配自动批准设计。

- [静态元素及文件 SHA-256](v8-design-audit/static-elements.json)
- [运行时逐元素、状态与主题探针](v8-design-audit/runtime-elements.json)
- [CSS 定义／使用与字面量候选（加载资产与库级辅助库存）](v8-design-audit/theme-inventory.json)
- [语义资产登记与缺失项](v8-design-audit/semantic-asset-register.json)
- [静态扫描脚本](../assets/audit-v8-design.py) / [运行态扫描脚本](../assets/audit-v8-runtime.mjs)

未执行任意状态的穷举：系统原生文件窗口、所有错误分支、拖拽坐标组合、全部图表数据组合、真实宿主与生产持久化不在此次运行态 census 中。源码和文档中的相关要求仍纳入检查；未经运行的路径不声称验收通过。静态扫描中样例实例按实际 DOM 保留，资源列表模板的重复实例不视作新的组件设计。

## 页面／区域与代码对应

| 页面／区域 | 文档依据 | 实际代码与复用情况 | 判断 |
|---|---|---|---|
| 四页 Shell、Sidebar 分区、搜索、视图工具、Footer | [Shell](../components/shell-and-sidebar.md)、[导航](../foundations/navigation.md)、[检索](../components/search-field-review.md) | Task v8 提供静态 Shell；Browser／Workbench 构建脚本提取；检索由 `search-bridge.tsx` 挂载共享组件 | 主要规则有文档；Shell 仍是 HTML 提取装配，不是四页全部使用一个 React Shell |
| Task Input、Composer、审批、Workspace／文件面 | [宿主槽位](../components/input-and-host-slots.md)、[Task](../pages/task-detail/README.md)、[跨页](../flows/cross-page-browsing.md) | Task v8 中 DSH 宿主示意与 HTML handler；宿主业务不可由页面接管 | 有 owner 及场景；示意不能视作宿主已接入 |
| Task Grilling／Plan／Execution／Gate／Delivery | [五工作面](../pages/task-detail/README.md)、[审核面](../components/review-surfaces.md)、[图投影](../components/graph-projections.md)、[完整查看](../components/context-viewers.md) | Task v8 静态区域及 inline handler；共用 search bridge，其他卡片和 SVG 主要仍是 HTML | 主要语义可追至 U1；旧 DOM 索引不能证明当前 v8 所有新增动作与区域均闭合 |
| Task Browser Header／Gallery／List／菜单／多选／分页／改名 | [页面](../pages/task-browser.md)、[资源配方](../components/component-recipes.md#browser-resource-controls) | `assets/task-browser-surface.html`、`resource-browser.ts`、`task-browser.ts`、`task-browser.css`；Search／Switch 共享 React | 文档较完整；共有逻辑确有复用，但非全部语义控件都接入组件库，且 D17 表面存在差异 |
| Workflow Explorer 对应区域与版本投影 | [页面](../pages/workflow-explorer.md)、同一 Browser 配方 | `workflow-explorer-surface.html`、`workflow-explorer.ts` + 同一 `resource-browser.ts` | 版本身份、最新／全部、筛选与清选有文档；Studio 目标只核链接，不审核目标页 |
| 观测 Header／日期／刷新／布局工具 | [Header 与范围](../pages/analysis-audit.md#header范围与导航) | `analysis-observation-study.tsx`、`observation-time-controls.tsx`、`observation-layout-editor.tsx` | 页面规则与组合存在；尺寸／颜色／动效并未全部资产化 |
| 总览 Dashboard／Widget／添加／右键菜单 | [总览](../pages/analysis-audit.md#总览)、[Widget 契约](../components/widget-component-contract.md)、[Widget 表达](../components/widget-expression-design.md) | DashboardGrid、SemanticWidget、WidgetSizeMenu 等共享组件及观测 fixture | 实现为可运行样本；保持与对比分析设置独立，真实计算口径不由 fixture 批准 |
| 调用追踪 Delivery 目录／筛选／chip／折叠 | [目录契约](../components/delivery-directory-review.md)、[追踪](../pages/analysis-audit.md) | DeliveryDirectory、SearchField、List、trace-range state | 主要动作有明确契约；正式索引／游标与查询语义仍依服务实现 |
| 时间线／调用树／缩略图／动态详情 | [页面组合](../pages/analysis-audit.md)、[专业图组件](../components/library/trace-waterfall.md)、[D17](../foundations/card-surfaces.md) | TraceWaterfall／TraceTree／SpanPassport、`trace-views.tsx` | 中文标题、同宽／全高有文档；本次补齐组件 API 与页面固定配置；手势键盘等价和部分文案仍有缺口 |
| 观察设置目录／动作／三列编辑／数据范围／指标目录／图表映射 | [正式组件](../components/result-analysis-review.md)、[页面归并](../pages/analysis-audit.md#2026-09-11-归并对比分析的当前设计) | ResultAnalysisPreview、FixedColumnChartLayout、observation-settings、analysis fixture | 本次新改动已归入正文及动作对应表；仍有下列边界与 theme 缺口 |

`AnalysisObservationStudy` 当前从 `workbench-preview.tsx` 挂载，ResultAnalysisPreview 从组件样本及该观测组合引用；这是仓库中的共享原型实现，不等于生产入口、索引、指标和设置服务已经接入。Task Browser／Workflow Explorer 的行为代码当前位于设计包 assets。审计没有把 HTML 之外不存在的生产实现标为完成。

## 具体缺口与处理顺序

| ID | 范围／证据 | 缺口 | 后续闭合标准 |
|---|---|---|---|
| V8-01 | `handoff/task-dom-index.md` 标题及来源是 v7；`other-prototype-index.md` 也是 v7 | 当前 v8 与动态控件没有一份稳定、完整的元素—契约映射；现有通用来源覆盖报告无法证明用户的“所有” | 为稳定组件族／区域和动作建立契约键，关联具体章节与状态；生成物需检查新键遗漏。本次 census 是基线，不是假定全部有对应 |
| V8-02 | `assets/task-browser.css` `.browser-task-card` 与共享 `card-surfaces.css` 选择器 | 两个 Browser 资源 Card 最终计算边框为白色 16%、box-shadow 为 none；未接共享 Card 阴影，使用 palette 层而非 color 语义层；D17 明确包括资源卡 | 同一 surface recipe 及主题角色控制 Card，验证普通／hover／selected／菜单状态；保留列表无外框 |
| V8-03 | `result-analysis-preview.css` 模态、名称输入、action 样式 | `#252528`、`#eee`、`#ffffff06`、8px／12px 等直接写入；覆盖共享颜色／圆角变量不会影响这些元素 | 使用已有语义角色或已评审的新组件配方；统一输入与模态消费；同一 theme 注入改变所有应变部分 |
| V8-04 | `fixed-column-chart-layout.tsx`、`result-analysis-preview.css`、`analysis-observation-study.css` | 新断点、480–640px、sidebar、editor 列宽、间隙和过渡曲线没有作为公共语义资产输出；`--editor-*` 仅局部 CSS 变量 | 保持数值和行为，将已确认规则归入语义资产；JS 与 CSS 消费同源配置；区分 theme 几何、布局算法常量和用户数据 |
| V8-05 | `analysis-observation-study.css` 引用 `--color-background-panel/base/primary`；`workbench-pages.css` 引用 `--color-status-primary-border` | 未在此次 CSS 定义与主题 JSON 中找到这些名字。多数有 fallback，显示正常不代表主题有效 | 对齐已登记角色，或明确注册新角色及 owner；别把动态运行值／Tailwind 内部变量计为同类错误 |
| V8-06 | `result-analysis-preview.tsx` 顶层 `data-color-scope="chart"` | 图表隔离标记包住设置列表、表单和所有 dialog，与“仅图及图例独立配色、外围用页面主题”的文档冲突 | 建立页面适配器与组件自己的清晰边界；仅专业绘图区使用图表色彩作用域，普通控件仍响应页面 theme |
| V8-07 | 总览布局与观察设置文件交互 | **已按 D23 关闭**：导出统一直接下载，导入统一系统文件选择器；两处共享 `configuration-file.tsx` | 用户 2026-09-11 裁定覆盖原差异；文件校验与提交范围由各调用者维护 |
| V8-08 | `observation-settings.ts` import 与 `valueItemIds`、热力图渲染 | UI 热力图颜色单选，但导入只验证 ID 存在／不重复，没有限定热力图单项；可导入与 UI 契约不同的配置 | 补类型映射约束及兼容策略测试，非法文件不改变当前状态；此项是代码待修，不能仅改文档绕开规则 |
| V8-09 | `components/library/trace-waterfall.md`、`trace-tree.md` 与 `trace-views.tsx` | 原文漏 locale／showSummary／fillHeight，现已补齐并区分库默认与页面固定配置；minimap 的 role=slider / tabIndex=0 只有指针 handler，缺键盘等价行为，部分控件仍英文 | 页面配置表已补齐；键盘操作、焦点反馈及文案迁移还需实现与验证 |
| V8-10 | `result-analysis-review.md` 与 `analysis-audit.md` 的既有边界 | 完整 i18n、实时索引、服务持久化、owner 口径和跨页恢复未落地 | 按已登记 owner 接入；这些是已说明的原型限制，不重新包装为新的产品决策 |

本次已修正文档遗漏／过期项：观察设置逐项编辑（trash 左侧）、目录折叠与整行反馈、居中遮罩、编辑三列 divider 和 plus、四档列数／宽度／居中、只读数据列及轴映射、9 项演示目录、已选范围与设置独立、移除研究图表固定到总览。代码行为及视觉未在本轮批量改变。

## 初次主题探针结果（修正前）

两个 Browser 的 Gallery 初始态均实测 Card 背景 `rgb(35,35,36)`、边框 `rgba(255,255,255,0.16)`、阴影 `none`、圆角 `12px`。这说明灰度／圆角相近，但 D17 边框和阴影没有应用。

向独立运行页注入已有语义变量覆盖，观察计算样式：

| 元素 | 背景／边框／圆角 | 结果 |
|---|---|---|
| `.observation-chart-card` | 背景 `#232324 → rgb(13,71,93)`；边框 `白色 6% → rgb(230,80,20)`；圆角 `12 → 20px` | 这三项确实消费语义变量 |
| `.observation-setting-name input` | 背景仍白色 2.4%，边框仍白色 6%，圆角仍 8px | 未响应被覆盖的对应主题角色，源码也为字面量 |
| `.result-analysis-help` | 背景仍 `#252528`、圆角仍 12px | 外壳未接入已有浮层／形状变量 |
| `.result-analysis-layout` | gap 保持 24px | 未绑定被覆盖的公共 layout 变量；这不是应直接替换为 `layout-card-gap` 的建议，而是缺少自身语义角色的证据 |

主题资产细表见 [语义资产与接入边界](../foundations/theme-coverage.md)。图表系列颜色、数据映射值、运行时 `--browser-card-width` 和宿主 DSH 自有样式需要单独 owner，不机械改造成页面色彩 token。

## 重跑与验收

仓库根目录运行：

```sh
python3 tmp/20260907/Crystra-ui-design/assets/audit-v8-design.py
python3 tmp/20260907/Crystra-ui-design/assets/build-design-contracts.py
node tmp/20260907/Crystra-ui-design/assets/audit-v8-runtime.mjs
python3 tmp/20260907/Crystra-ui-design/assets/map-v8-design-audit.py
```

运行态脚本只使用本地 HTML 与合成数据。输出不包含账户会话或真实业务数据。查看 JSON 中 `failures` 与状态清单，不能只看进程退出码。后续修改代码后重跑，静态 HTML 的 SHA-256 用于辨别盘点是否已过期。

## 文档复核结果

独立读者核对本报告、主题登记、观察设置和观测页正文，并抽查 JSON／源码证据；确认没有把库存或 family 匹配宣称为全量覆盖。指出的旧 Task 分组目录、报表下钻入口与导出差异已经修正。13 份相关文档的本地链接及 Markdown 锚点检查见 [结果](v8-design-audit/document-links.json)。初次盘点未修改页面以隐藏审核发现；后续 D23 已统一文件交互并同步 Analysis v8，该段记录初检时状态，当前闭合情况以本报告顶部的修正表为准。


## 修正后验证证据

- TypeScript 通过；334 项单元测试、30 项仓库脚本测试、30 项本轮 v8 浏览器回归全部通过。
- 23 个运行状态、8438 条记录均有注册文档 owner；406 个契约键。绑定是用途／行为文档的入口，不是任意状态穷举的证明。
- 两个 Browser 普通资源 Card：背景 `rgb(35,35,36)`，边框白色 6%，圆角 12px，双层淡阴影。
- 覆盖语义变量后：Card、名称输入、模态背景均变为探针色；输入圆角 16px、模态圆角 20px；侧栏间距从 24px 变为 31px。
- [自动校验结果](v8-design-audit/parity-check.json) 无错误；[文档链接检查](v8-design-audit/document-links.json) 无错误。

重新生成映射后执行 `python3 tmp/20260907/Crystra-ui-design/assets/check-v8-parity.py`。它同时检查页面哈希、运行态绑定、文档目标和主题响应；失败必须处理，不能仅刷新报告状态。
