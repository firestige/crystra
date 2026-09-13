# 公共组件：阅读入口与规则归属

本目录不按文件新旧决定效力。先判断问题归谁，再读该主题唯一维护文档。新建文件、代码已经实现或示例能运行，都不会自动改变已确认设计。

上游效力沿用 [MASTER](../MASTER.md#效力与继承)：系统概念服从仓库 docs 的对应 owner；UI 原始输入按权威输入 > assets > memo；后续用户明确裁定在其范围内覆盖旧结论。下表是这些结论在 components 中的维护位置，不另建一套 authority。

## 按问题阅读

| 你要确定什么 | 唯一维护文档 | 其他材料的作用 |
|---|---|---|
| Widget、展示组件、Dashboard 的职责；实例状态、保存、切换生命周期；消费定义与注册要求 | [Widget 组件契约](widget-component-contract.md) | 预览仅证明当前视觉；代码现状在该文末明确列出 |
| Widget 的数据形状、可互换表达、合法尺寸、槽位视觉、字体/图标位置、图例 | [Widget 表达设计](widget-expression-design.md) | HTML 和截图用于观察效果，不另写规则 |
| Dashboard 的排列、菜单、拖动 ghost 与宿主原型行为 | [Dashboard](library/dashboard.md) | 继承上述 Widget 契约；不重新定义状态归属或尺寸集合 |
| 基础组件的 props、变体、样式与实施范围 | [基础组件配方](component-recipes.md) | [清单](component-inventory.md)只列组件职责和覆盖范围 |
| Browser 的资源 Card / List、选择控件、操作组与菜单变体 | [基础组件配方](component-recipes.md#browser-resource-controls) | [Task Browser](../pages/task-browser.md)维护页面组合、数据与操作含义 |
| Shell 与 Sidebar | [shell-and-sidebar](shell-and-sidebar.md) | 页面引用，不复制公共行为 |
| DSH Input 与宿主特殊组件 | [input-and-host-slots](input-and-host-slots.md) | 宿主接口与系统 docs 按既定边界继承 |
| 审核卡片 | [review-surfaces](review-surfaces.md) | 系统事实仍由系统文档定义 |
| 文档、引用与上下文查看 | [context-viewers](context-viewers.md) | 普通详情不是 Widget |
| DAG / Workflow / 图投影 | [graph-projections](graph-projections.md) | 不用图表示例改写系统拓扑 |
| 证据标签与普通证据容器 | [证据组件](library/evidence-status.md) | 不重复定义 Gate 审核卡或 Widget |
| BI Inspector、评估说明、回执与 Span 详情 | [详情组件](library/inspector-details.md) | Task Gate 的内容和返回契约仍归 context-viewers |
| Recorded Trace 瀑布、结构树、统计的选用与 API | [Waterfall](library/trace-waterfall.md)、[Tree](library/trace-tree.md)、[Statistics](library/trace-statistics.md) | graph-projections 维护投影边界，三份文档各维护一种专业视图 |
| 短提示的现有行为与 API | [Tooltip](library/tooltip.md) | 交互式内容用 Popover，长内容用详情查看器 |
| 已有库组件的使用及 API 现状 | [库组件索引](library/README.md) | 兼容 API 的限制不反向决定新 Widget 设计 |
| Widget 数据接线的领域来源 | [数据适配参考](widget-use-cases.md) | 仅供接线追溯，不规定视觉、变体或尺寸 |

颜色、字号、全局空间、动效等公共变量以 foundations 的对应文档为准；组件只引用和应用。先读 [MASTER](../MASTER.md)，不从局部组件反推全局规则。

## 当前 Widget 的读法

先读组件契约明确边界，再按表达设计选择图形与尺寸；搭建 Dashboard 时再读其布局文档。当前样式已接受；公开消费 API、运行时校验、注册机制、独立展示组件和 Widget 内部状态仍待组件化。具体代码完成度只认契约中的实现状态及实际导出，不把目标要求读成已实现。

[预览索引](library-gallery.md)只提供稿件入口，[总清单](../pending-decisions.zh-CN.md)只记录确认与待交付状态；它们不增加组件规则。

## 维护方式

同一规则只在表中所属文档修改。其他页面使用链接，不复制规则正文；过时条款在所属文档内替换。示例和实现与已确认规则不符时，记录实现差距，不能让旧 API 或截图覆盖设计。没有明确裁定依据的冲突应提出，不用“最新文件优先”自行决定。

2026-09-11：[观察设置当前契约](result-analysis-review.md) 已归并逐项编辑、三列编辑器、只读指标引用及图形映射；跨页文档／代码／theme 缺口见 [v8 审核](../handoff/v8-design-audit.md)。

[D23 配置文件交互](configuration-files.md)：导出直接下载，导入系统选择文件，页面拥有格式校验与提交语义。
