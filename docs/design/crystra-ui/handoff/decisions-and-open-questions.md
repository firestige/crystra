# 冲突处理、提案与待定项

> 这里记录本次按用户给定效力执行的整理裁定；“建议”不等于通过页面审核。来源代码见 [登记](../sources/README.md)。

## 后续用户裁定

以下裁定来自文档整理后的用户讨论，在所述范围内优先于此前资产、memo 和本包的待定表述；原始来源快照保持不变。

<a id="d01"></a>

### D01 · 两个资源浏览页面，共享浏览组件（已确认，2026-09-07）

- 任务标题行“全部任务”图标入口进入 Task Browser；工作流标题行“全部工作流”图标入口进入 Workflow Browser（本文档此前称 Workflow Explorer）。产品上是两个独立页面。
- 两页共享 Resource Browser 的布局和浏览交互：列表/Gallery 切换、Gallery 图标、元数据呈现骨架、选中/多选、Context menu、批量操作交互骨架，以及单击打开对应工作台。
- Task 和 Workflow 分别提供元数据字段、分类、过滤/排序规则、可用操作与条件、后台接口及数据生命周期。共享组件不解释领域生命周期。
- 优先采用独立路径，query params 表达浏览状态，例如 `/tasks?view=gallery` 与 `/workflows?view=list`。路径示例不冻结 DSH 路由前缀或具体参数 schema，两条路由可以渲染同一组件。
- 两类资源分别恢复查询、筛选、排序、视图和浏览位置；共享组件不意味着共享同一份状态。具体持久化机制仍待实现设计。
- Task Browser 的显示与资源管理已由 D14 完成审核，规范见正式页面；Workflow 的具体管理规则已按 D15 归入正式页面，生产接入归 06c。不能从共享骨架推导两种资源具有相同操作或生命周期。
- 公共组件 API 仍待实现；Task Browser 的字段与规模展示策略见 D14，Workflow Browser 的页面规则见 D15。不再把“两个页面还是一个页面”“是否共享浏览组件”列为未决。

<a id="d02"></a>

### D02 · Sidebar 确认与公共区域范围（已确认，2026-09-07）

用户确认 [Sidebar v8](../components/shell-and-sidebar.md) 当前效果：展开/折叠形态、图标导航、临时目录与 340ms 抽屉动效作为后续实现基线。展开入口留在左上品牌位置，折叠时 hover / 键盘聚焦替换为展开图标，点击只展开；底部不放展开按钮。仅展开态 Banner 支持 Crystra / DeepSeek 双向切换，不新建 Session。

- 三个 Section 仍独立折叠；全局折叠不改变 Task / Workbench / Input 上下文。
- Header 指 `workspace-header`，品牌入口指 Sidebar 的 `surface-banner`；前者最终整合仍按 D03 后置。
- 真实 dsh-web Banner 改造、跨页同步、宿主图标替换与偏好恢复见 [遗留待办 L02](../deferred-todos.zh-CN.md)。当前设计确认不表示生产接入完成。

<a id="d03"></a>

### D03 · 桌面设计前提与 Header 延后定稿（2026-09-07）

- 首期仅供用户本人使用，只考虑 1920×1080 及以上、16:9 / 21:9 / 32:9 屏幕；1920×1080 基础场景必须保证两栏可用，更大屏幕仍按实际剩余宽高协调布局，不以物理分辨率作断点；其他低分辨率场景后置，规范见 [布局](../foundations/layout.md)。
- 视觉平衡、横向空间利用与工作区可见高度是全局设计目标。按实际浏览器内容视口衡量布局，计入系统缩放、浏览器缩放、标签/地址工具栏、可见书签栏及宿主外壳的占用；不把屏幕英寸或物理分辨率直接当可用 CSS 尺寸，也不假定书签栏始终可见。
- 旧资产的小窗口/触摸条件分支保留作历史参考，不构成首期支持或验收要求。
- 当前 Header 的三行文字和独立执行摘要占用了过多纵向空间；不再把 A1 的三行、112px 最小高度和摘要独占一行当最终组合。
- Task 的 `task-execution-summary` 拟整合到 `workspace-header`，减少单独横条；仍保留 Task 级数据口径和语义职责。整合哪些字段、行数与尺寸，留待统一 Header 设计，不预先删减已定摘要信息。
- Workflow、Analysis 需要考虑页内二级导航；具体导航项、与标题/上下文的组合由各页设计明确。
- 先完成 Workflow 和 Analysis 的页面信息架构与布局，再回到 Header，统一裁定它容纳的标题、描述、上下文、Task 摘要及页内导航。此前助手提出的两行布局只作探索，不作为定稿。
- 后续用户已确认 Sidebar 效果，并要求将 Header 后置工作转入 [遗留待办 L01](../deferred-todos.zh-CN.md)。差距清单 02 的裁定与同步已完成并勾选；Header 本身仍未定稿。

<a id="d04"></a>

### D04 · Task / Workflow 的统一 Chat 写入原则（已确认，2026-09-07）

- Task、Workflow 的语义修改均经复用的 DSH Chat / Input 进入，由 LLM 生成结构化 JSON IR 变更提案，经相应系统 owner 校验与必要授权后提交。此项是用户明确原则，优先于 A3 旧写按钮和 M3 的历史候选标签。
- Workflow 图是只读投影，允许浏览、定位、缩放、查看 diff / validation；不通过手工连线或右侧保存按钮直接改语义。A3 `workflow-save-draft` / `workflow-validate` 不作为独立业务写入口继承；修改意图移回 Input，右侧仅展示校验结果。
- 具体提案卡、校验触发与反馈、版本保存/发布事务、subject/revision、冲突恢复仍待详细设计。沿用 docs 中 Definition / Snapshot / State 等系统语义，不因确认原则而新造或冻结 schema。
- 差距清单 03 为文档同步项，已完成；不表示整个 Studio 已完成设计审核。

<a id="d05"></a>

### D05 · 卡片尺寸与完整查看

卡片有最小高度，单卡不超 control-bench；缺数据允许空卡，长纵向列表展开到完整工作面，提供返回与 y-scroll。 规范正文见 [对应设计文档](../components/review-surfaces.md)。

<a id="d06"></a>

### D06 · 空卡与读取反馈

空卡使用对应短文案、静态骨架或半透明空文件图标；实际耗时读取使用右下角通知进度，不伪造进度或数据。 规范正文见 [对应设计文档](../foundations/states-and-content.md)。

<a id="d07"></a>

### D07 · 审核范围与无待裁决项

Plan 定义 Gate，审核页只关心已触发且需人工介入的项；队列归零不代表 Task 结束或 Delivery terminal。 规范正文见 [对应设计文档](../pages/task-detail/gate.md)。

<a id="d08"></a>

### D08 · 审核内容准入

AI 理解和比较保持判断身份；已确认决定准确优先，允许漏列，不允许假阳性，必须核验明确确认内容、范围与适用性。实现跟踪 L03。 规范正文见 [对应设计文档](../pages/task-detail/gate.md)。

<a id="d09"></a>

### D09 · Gate 影响与 Plan 修改

独立并行 Wave 不假设隐含 Gate 依赖；满足既定条件正常推进，改变后续计划语义则通过 Input 修改 Plan。 规范正文见 [对应设计文档](../pages/task-detail/gate.md)。

<a id="d10"></a>

### D10 · Plan 版本与投影

计划语义修订 bump 版本，勾检查单等状态更新不 bump；当前 bench 同步新投影，历史精确引用与 Manifest 保持原绑定。 规范正文见 [对应设计文档](../pages/task-detail/plan.md)。

<a id="d11"></a>

### D11 · 旧版本指令

目标版本不符时 fail & refuse，原 Input 反馈；不执行、不换绑、不重放，历史只读浏览不受此限制。 规范正文见 [对应设计文档](../components/input-and-host-slots.md)。

<a id="d12"></a>

### D12 · 项目边界与推理原则

系统语义依 docs owner/版本，UI 依权威 > assets > memo 及后续用户裁定。限定单用户、本地 DSH 场景；能从契约闭环的直接处理，只对真实且不可推导的分歧请求人工裁定。 规范正文见 [对应设计文档](../MASTER.md)。

<a id="d13"></a>

### D13 · 基础体验与容器空间

1920×1080 是首期两栏体验必须成立的验证场景；实际布局使用 DSH 挂载容器剩余宽高，不能把屏幕分辨率当断点。Better Sidebar 的右侧/底部停靠必须同时保护核心可用宽高，必要时收起文件面。规范见 [布局](../foundations/layout.md) 与 [验收](acceptance.md)。

<a id="d14"></a>

### D14 · Task Browser v8 视觉与交互审核通过（2026-09-08）

用户明确要求将草稿转入正式文档，并确认当前设计全部通过审核。[Task Browser](../pages/task-browser.md)维护 Header 组合、Gallery / List、字段、分组与加载、选择、单项 / 批量资源管理；[组件配方](../components/component-recipes.md#browser-resource-controls)维护已接受的控件样式与菜单方向变体。此前 Browser v7、memo 及“尚未审核”的文字不再决定当前页面设计。

资源显示名、缩略图、Pin 和归档是 Browser 管理交互；归档不停止执行或结束 Task，不修改 Delivery。目标、Plan、Gate 和 Workflow 等语义修改继续遵守 D04。审核不发布新的数据 API，不表示真实目录、资源存储、跨导航恢复或宿主集成已完成；跨页 Header 与 Workflow Browser 不随本次审核自动定稿。

<a id="d15"></a>

### D15 · Browser / Sidebar 正式归并与实验边界（2026-09-09）

用户明确要求落实 Task Browser、Workflow Explorer 和 Sidebar 的规则归并及清理，并明确 Workflow Studio 相关实验暂不能确认。

[Task Browser](../pages/task-browser.md)继续沿用 D14；[Workflow Explorer](../pages/workflow-explorer.md)承接当前布局、字段、版本折叠、精确版本资源操作及状态规则；[Sidebar](../components/shell-and-sidebar.md)承接图标栏、目录、动效、宿主切换与结构标识。当前规则各有唯一正文入口，公共尺寸与图标引用 foundations，不另留重复工作草稿。

本裁定限于临时设计工作区。06b 按当前页面规则归档，Browser 数据接入 / 存储 / 公共 API 保留在 06c，Sidebar 真实宿主接入与偏好恢复保留在 L02。Workflow Studio 的活动图、JSONIR 和投影工具实验继续保留原状态，11 不勾选；不修改项目 docs 或提升候选系统契约。

<a id="d16"></a>
### D16 · Sidebar 标题行工具正式定稿（2026-09-09）

用户明确确认本次 Sidebar 调整为正式设计。唯一规则入口为 [Shell / Sidebar](../components/shell-and-sidebar.md)：任务和工作流标题行依次提供搜索、视图、全部入口，全部入口使用向右实心三角图标和“全部任务 / 全部工作流”tooltip，移除原列表底部入口；工作流具有与任务一致的标题工具结构及独立事件 / hover 行为。工作流视图提供名称排序和版本标签显隐，搜索与菜单退出、Section 折叠及临时目录行为按正文执行。

本裁定覆盖共享 Sidebar，替代 U1 / v7 中全部入口随列表排列或滚动的旧规则。原始来源与 v7 DOM 索引保留快照身份，当前结构标识以 Sidebar 正文为准。对应布局、导航、页面入口、验收及清单同步；真实宿主接入仍归 L02，Workflow Studio 实验仍未确认。

## 已识别差异

| ID | 证据与冲突 | 本包处理 | 后续动作 |
|---|---|---|---|
| C01 | U1 最小 Input/Control 360/680；A1 紧凑 CSS 340/540 | 规范取 360/680，保留 A1 原字节并标注偏差 | 响应式重设计与实际可用宽度验收 |
| C02 | U1 品牌无卡片、Sidebar 任务/工作流/分析；I1–I3 与 A3/A4 有品牌卡、Work/Build/Library | 继承 U1 统一 Shell；旧稿只参考其主内容和风格 | 当前 v8 已同步 Shell；生产宿主接入与状态恢复归 L02 |
| C03 | I1 阶段线/Accept；U1 五个并列只读工作面 | v6 不作为交互契约，禁止迁回线性阶段或右侧审批 | 原型审阅按 U1 验收 |
| C04 | A3 `workflow-save-draft` / `workflow-validate` 在右侧；M3 提议移入 Input | D04 用户裁定覆盖旧资产：不继承右侧独立写入口，语义修改回 Chat，右侧展示校验投影 | 具体提案卡、校验反馈与保存/发布事务仍待设计 |
| C05 | A3/A4 收益百分比、风险阈值、结晶置信度等示例；S6 不授权 BI 创造指标/推断 | 不继承为事实/固定字段，保留源稿标作 fixture | 结晶资格/指标 owner 与证据链单独设计 |
| C06 | U1 task/plan_run/wave/workflow_run/trace_root 链；系统 delivery/trace/span/Snapshot 不同身份轴 | 保留 UI 定位意图，明确没有现成一对一映射 | 领域与宿主联合发布 typed mapping |
| C07 | U1 Task Delivery 是当前可交付投影；S1 Delivery 是一次执行 | 分开概念，前者不关闭 Task、不重写 terminal history | 当前 readiness owner 与数据契约待补 |
| C08 | U1 “普通 retry 同 Run/Trace”；S1 有效关闭后 retry 新 Delivery | 两层语义不直接互换；内部 attempt 与新执行分开 | owner 定义 UI Run 对系统 Delivery 的生命周期映射 |
| C09 | A4 阶段网格与冻结 Run 比较；S12 Recorded Trace 真实 IR，S6 receipt 每次解析 | 精确 Run 身份与结果读取时点分开；不复制假因果，不保证链接冻结数值 | 新 Analysis 路由/renderer 与 receipt 展示设计 |
| C10 | A1 标题仍含印象图、A3/A4 title 含 impression，但用户指定 v7 是设计稿 | 按用户定义将 v7 登记为设计稿，保留原 title 不改 | 页面成熟度独立标注，不由 title 判断 |
| C11 | M1 新建表述“无持久化”；U1 Task/Session 持久化时点待定，S6 默认新 Task/显式复用已确定 | 仅空白态不持久化；不扩展为发送后永不持久化，也不重开已定分组语义 | 生命周期 owner 衔接新建与发送 |
| C12 | U1 静态 section 覆盖要求；A1 含示例 Task/Wave/Gate ID，M2 宣称 328 | 重新解析实际 HTML 并逐项索引；数量只是快照；实例不变永久结构 API | 删除改名同时更新原型/契约/验收 |
| C13 | docs 部分旧规则与后续 candidate addendum 共存，含 Query0.1/1.0 retention | 标出版本/范围，不能拼成单一“已发布”API | 实现选择精确 release/compatibility binding |
| C14 | A3 页面 tab 使用 `workflow-navigation`，U1 同名指 Sidebar section；A4 `analysis-navigation` 类似 | 分页面库存记录，禁止合并 DOM 时一个 ID 同时承担两个角色 | 更新旧页面时命名迁移与 contract 索引同步 |
| C15 | U1 原稿速度控件可点击切慢快正常，但明确只读生产语义 | 演示控件保留在来源快照，生产设计移除其写入口 | 独立 Storybook 场景可保留 |

## 待定项（本次不代替 owner 决定）

| ID | 缺少什么 | 建议负责范围 | 影响 |
|---|---|---|---|
| O01 | Task IR、Plan/Wave/Gate、readiness 服务与持久化时点；Input patch 格式/事务 | Task/Workflow + Execution owner | 新建与五工作面的生产数据接入 |
| O02 | DSH 路由、连续 Session 与 active Delivery 绑定、草稿/subject 跨页恢复 | 宿主/Intake + UI | Task 切换、Gate 返回、精确消息定位 |
| O03 | 低于首期基础场景的尺寸适配 | 后续使用范围扩展 | 1920×1080 基础两栏与 Better Sidebar 可用空间协调仍属首期；更小场景后置 |
| O04 | 图引擎选型、规模/耗时/增量位移指标 | 图实现 owner，独立 spike | Plan/Workflow/Execution 大图 |
| O05 | Task Browser 当前设计已按 D14 确认；Workflow Browser 已按 D15 归并；剩余 Browser 公共 API、query schema、真实目录、资源存储与跨导航恢复，以及已归档资源入口 | Browser / 宿主适配与 Workflow 页面 | 不重开 Task 已审核视觉与交互；不把原型当生产接口 |
| O06 | Studio 草稿、提案、校验、版本、发布与结晶资格 | Workflow owner + Studio 审核 | 旧写按钮与收益样本的去向 |
| O07 | 新 Analysis 视图与现有 BI core/Trace/Evolution 的对应；精确 route 映射 | BI/Evidence/Evolution + 宿主 | 真实指标、Trace 与跨页深链 |
| O08 | 零 Gate、校验失败、revision 冲突、离线/权限失败的完整文案与焦点 | UI + host/domain owner | 端到端异常恢复 |
| O09 | Sidebar v8 已确认，生产资源整理和宿主图标替换见 L02；另有浅色主题、完整 i18n key、字体与其他图标资源；移动端规范不在本阶段范围 | 视觉/宿主 | 当前只提供深色稿提取 |
| O10 | Task 总时间/人注意力/readiness 的合格计算口径；数据缺失与实时目录 | Task/指标 owner | Summary/Delivery/Browser 的真实集合与指标 |

本包没有将这些问题转成外部 issue，也没有自动修改系统设计或原稿。未来决定形成后，应先更新对应 owner，再修本包及验收，不只改某个 page 的截图。

### D17 · 公共卡片表面正式确认（2026-09-10）

用户确认 Trace 试用效果，并要求所有 Card 概念容器（包括 Widget 和大型组件）统一采用。正式配方、适用范围、状态例外和验收见 [卡片表面规范](../foundations/card-surfaces.md)。本条取代此前纯无描边的尝试；不改变宿主 Composer 所有权。

### D18 · v8 组件优先与新增设计人工审查（2026-09-10）

用户明确：v8 是最终 UI/UX 演示，必须尽可能复用已有组件；能力不足时应提出缺口，先在组件样本中补充设计，经人工审查认可后继续页面接入。HTML 无法覆盖的复杂交互写入文档。为定位问题复制现状用于对照是允许的。完整流程见 [Agent 指南](component-first-guide.md)。本决定不表示当前搜索视觉候选获准，也不表示历史页面已经完成整改。

### D19 · 统一检索组件设计确认与 v8 接入（2026-09-10）

用户接受灰度表面聚焦、无内部方框与蓝色外框、无背景无边框取消图标，以及同一前缀图标展开／收起的平滑动画。所有 v8 应调用共享检索组件，样式随组件构建同步。共享的是风格、布局与交互；图标、文字、placeholder 等由页面传入，前缀、尾部、展开图标和取消图标均允许替换，不限制为固定内容枚举。详见 [组件契约](../components/search-field-review.md)。

### D20 · Delivery 检索目录与 prefix slot 设计确认（2026-09-10）

用户确认 [Delivery 检索目录](../components/delivery-directory-review.md)及 [SearchField prefix 尺寸职责](../components/search-field-review.md)：prefix 是随注入内容撑开的 slot，仅约束最大宽度（当前 45%）；下拉菜单宽度由页面指定（Delivery 目录 96px），ghost 表面、右对齐细线 chevron、16px 非贯穿 divider。检索按字段语义执行，ID 精确、名称关键字、Workflow 含 `@` 时精确匹配 selector；Enter 提交，无加号，无检索 chip。结果筛选表单从搜索框下方展开并推动灰色 divider 下移；divider 下方左侧为独立可关闭的筛选 chip，右侧为命中数，两者垂直居中。列表按 Delivery 扁平展示，选中项控制右侧 Trace。

本决定覆盖迭代中的多条件检索 chip、加号提交、独立字段下拉行及固定宽度 prefix slot 方案。确认的是设计，Analysis v8 迁移已完成，生产索引接口接入仍需执行，不能以本地 HTML 模拟替代正式检索契约。

### D21 · 对比分析的职责与选择范围（2026-09-10）

“研究报表”更名为“对比分析”。工作流单选；指标、版本及 Role 多选；数据源为用户选择的 Delivery。多个指标同时绘制，不来回切换单指标。用户限定语义化范围与比较维度，Crystra 负责取数及可视化，不提供 Workflow 结晶方案。详细行为和生产边界见 [对比分析页面契约](../pages/analysis-audit.md)。

### D22 · 对比分析观察设置确认并接入 v8（2026-09-10）

用户确认当前设计基本可用，授权文档归并与页面接入。正式契约见 [观察设置组件](../components/result-analysis-review.md)。主视图左侧选择设置、右侧显示图表；三列模态编辑图表集合，先定义数据列，再选类型并配置映射。卡片宽度在 480–640px 内响应式变化，按右侧容器宽度自动分列并整体居中，自动间隙与更大的两侧留白、每列独立堆叠，列表拖拽只排序；每张图和每个设置均在具体列表项上删除。无结果表格，图例右上，数值最多两位小数，Card 使用灰度层级与弱边框阴影。

本条细化并取代 D21 中页面级统一 Workflow／版本／Role／指标选择模型。数据选择从全局范围内缩小，设置与数据集分离，支持设置导入导出。Analysis v8 直接复用样本组件，不复制独立页面实现；真实服务和持久化不属于本次确认。

### D22 后续细化（2026-09-11）

观察设置逐项编辑、可收起侧栏、居中遮罩模态、三列 divider、图表 plus 操作、四档 1–4 列响应式布局、只读指标引用与图形映射，已归并到 [正式组件契约](../components/result-analysis-review.md) 与 [观测页](../pages/analysis-audit.md)。旧固定 400px、可改数据列名称、研究图表固定到总览的表述不再适用。文档／代码／theme 完整性由 [本次审核](v8-design-audit.md) 单独判断，不以设计确认代替实现验收。

## D23：配置文件导入导出统一交互（2026-09-11）

用户明确：**导出都是直接下载，导入使用系统能力打开文件。** 适用于总览布局、观察设置及后续同类配置入口。覆盖总览旧系统保存窗口规则，以及审核 V8-07 的跨页行为差异。页面传入文件内容、文件名与校验；共享能力负责下载和打开选择器，取消无副作用、校验通过才更新配置。契约见 [配置文件交互](../components/configuration-files.md)，实现为 `configuration-file.tsx`；本次已同步组件样本和 Analysis v8。


## Workflow Studio 后续裁定汇总（2026-09-13）

本轮用户要求将流程设计、资源配置交互及 JSONIR 作为业务需求输入，统一入口为[工作台业务接入需求](../pages/workflow-studio-contracts.md)。已确认：三个工作面共享具体 workflow workspace 与 Chat；节点直接修改资源绑定；资源按语义对象管理而非目录；Markdown 读优先；资源切换与视图导航正交；管理变更检查引用并通知 Agent。这些后续裁定在 Workflow Studio 范围替代 D04 的“唯一 Chat 修改”限制，Task 规则不变。

完整几何规则继续采用[布局优先候选](../components/workflow-map-layout-candidate.md)，不是仅采用最后一条优化，也不是承诺任意图均通过。workflow-package 继续拥有包契约；[#269](https://github.com/firestige/workflow-self-recursive/issues/269)、[#270](https://github.com/firestige/workflow-self-recursive/issues/270)为上游需求，当前 UI 适配字段非正式 schema。所有未接通能力在需求验收表保留，不把设计落文档等同已实现。


## 结晶分析 UI/UX 定稿（2026-09-13）

用户明确接受当前设计。定稿范围、资产和业务待办见[定稿基线](../pages/workflow-studio.md#结晶分析定稿基线2026-09-13)。后续实现复用既有组件与布局链，不另发明外观或切回旧引擎。此裁定不发布 Evaluation、预测算法或 workflow-package contract，也不宣称真实写回与 Agent 接入完成。
