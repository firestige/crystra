# Crystra UI 设计工作清单

> 更新：2026-09-09。本清单记录当前结论和剩余交付，不记录讨论过程。勾选表示设计已确认并归入正文，不表示 HTML、宿主接入或底层服务已经实现。

依据：后续用户裁定在其范围内优先；UI 按 [Task 权威输入](sources/ui/task-control-workbenches-design-input.zh-CN.md) > 设计资产 > memo；Task、Delivery 和底层服务以原仓库 [docs](../../../docs) 的对应契约为准，保留其版本与发布状态。整理稿中的旧候选表述不能重开已确认事项。

## 已确认

- [x] **01 · 两个资源浏览页面**

  Task Browser、Workflow Browser 独立，共享布局与浏览组件；支持列表/Gallery、图标与元数据、Context menu、多选/批量操作骨架、单击进入。分类排序、接口和生命周期分别接入。见 [导航](foundations/navigation.md)与 [D01](handoff/decisions-and-open-questions.md#d01)。

- [x] **02 · 公共 Sidebar / Banner 与 Header 范围**

  Sidebar v8 展开、折叠、目录浮层和抽屉动效已确认；任务 / 工作流标题行的搜索、视图、三角全部入口及 tooltip 按 [D16](handoff/decisions-and-open-questions.md#d16)正式定稿；折叠时左上图标只展开，展开态 Banner 在 Crystra / DeepSeek 间双向切换且不新建 Session。Header 待 Workflow / Analysis 页面设计后统一整合。见 [Sidebar](components/shell-and-sidebar.md)，后续交付见 L01 / L02。

- [x] **03 · 单一 Chat 写入与只读工作台**

  Task / Workflow 语义修改复用 DSH Chat，由 LLM 形成受校验的 IR 提案；工作台仅投影；Browser 的显示改名、缩略图、Pin 和归档属于已审核资源管理，不修改目标 / 计划 / 执行，见 [D14](handoff/decisions-and-open-questions.md#d14)。五个 Task 工作面并列，切换不改变执行。Composer、Workspace、设置及文件能力沿既定宿主/插件边界复用。见 [MASTER](MASTER.md)与 [Input](components/input-and-host-slots.md)。

- [x] **04 · Task 展示、版本与审核规则**

  空卡、单卡高度上限和长列表完整查看方式已定；AI 理解/比较是判断，相关已确认决定准确优先、允许漏列、不允许假阳性。Plan 语义修订 bump 版本并同步投影，勾检查单不 bump；旧版本写指令 fail & refuse。Gate 仅处理 Plan 中已触发且需人工介入的项，队列归零不结束 Task。恢复、错误和澄清沿 DSH / Execution 契约。见 [卡片](components/review-surfaces.md)、[Gate](pages/task-detail/gate.md)、[Plan](pages/task-detail/plan.md)与 [状态](foundations/states-and-content.md)。

- [x] **05 · 首期空间与 Better Sidebar 方案**

  首期自用，以 1920×1080 保证核心两栏体验，覆盖更大的 16:9 / 21:9 / 32:9 屏幕。沿用已定 Better Sidebar 方案：标准/紧凑空间底部、宽/超宽空间右侧，按实际可用宽高及最小尺寸落实，不按物理屏幕分辨率硬切模式。Input ≥360px、bench ≥680px、文件面 ≥320px，核心两栏优先；Input 占满 Header 下方可用高度，摘要仅在 bench 一侧，并与导航、工作面内容共同滚动，不占固定高度；两栏以外层垂直 divider 分隔；能力不存在则隐藏文件入口。其他低分辨率场景后置。见 [空间规范](foundations/layout.md)与 [Better Sidebar 契约](components/shell-and-sidebar.md)。

## Widget 样式与组件化

- [x] 当前 Widget 样式、表达变体与尺寸已接受，见 [表达设计](components/widget-expression-design.md)。
- [x] Widget / 展示组件 / Dashboard 的职责、稳定实例、内部状态与保存协作已确认，见 [组件化契约](components/widget-component-contract.md)。
- [ ] 按消费者定义完成公开 API、运行时数据校验、统一注册、稳定 Widget 状态及展示组件拆分；成对量值、比较、历史一并接入。这是实现交付，不是待重新裁决的设计问题。

Dashboard 的真实数据适配、增删与布局管理、导入导出和持久化属于宿主工作，不列为 Widget 组件化的前置。当前原型把表达状态存在 Dashboard 的方式不作为目标契约。

## Browser 前置：公共设计变量

- [x] **13 · Browser 前置公共设计语言与资产**

  - [x] 字体：B「均衡」的语义字号、行高、字重已接受并导出。
  - [x] 颜色：DSH 对齐的深色五色语义已接受并导出；图表配色独立。
  - [x] 图标尺寸：DeepSeek 校准版已采用，12 / 14 / 18 / 24px；Widget 对象信号另用 48px；工具 / 主操作 / rail 点击区 28 / 36 / 40px，新建入口展开 14px、折叠 18px。已导出语义变量；历史候选仅供对照。
  - [x] 间距与形状：已从 v8 与已接受三批组件按用途归并并导出 [间距、形状与动效](foundations/spacing-and-shape.md)，已接入组件配方；页面布局与内部 padding 分开。整个 Input 归 DSH，仅由 layout 限制宽高，不受公共变量覆盖；宿主内部取值只作参考方案，内部 padding 与组件间 gap 分开聚类。保留已定空间原则和 Sidebar 动效；Header 最终高度归 L01。
  - [x] 图标资源方向与 v8 替换：Crystra 使用 Iconify Tabler，已导出本地 SVG 与映射清单并替换 Unicode 图标；品牌与宿主原生 SVG 保留。生产接入由 wsr-ui 承接。
  - [x] Browser 前置公共组件与样本：已完成 [组件聚类清单](components/component-inventory.md)，基础清单已确认，第一批 [Button / Card / Typography / Chip / Divider / Icon](components/component-recipes.md) 已接受；第二批 List / ListItem、Tabs、Menu 已接受；第三批搜索/选择/筛选、Popover、空卡骨架、全 bench 长列表与进度通知已接受。v8 保持既定布局。React + Tailwind CSS，优先 TypeScript；部分专业图用 D3.js，DAG / Workflow 必须学习 Archify。用上述变量归并按钮、列表项、卡片、徽标的适用状态（不含宿主 Input）；空卡/骨架、长列表展开及通知样本已补齐，离线样式表已更新；布局资产已归并；ResourceGrid / 表格、Context menu 与批量操作等页面组合归入 06。现有规则直接落实，不重新讨论业务交互。

  当前基础包括 [字体、颜色和图标资产](assets/design-system/README.md)、[三批组件](components/component-recipes.md)及 [空间/形状/动效资产](foundations/spacing-and-shape.md)。13 按 Browser 前置范围完成；不表示整个组件目录、所有页面或生产接入已实现。Task Browser 当前设计已完成，06 继续跟踪 Browser 接入。浅色主题和低分辨率/移动适配不作为当前 Browser 的前置；Header 依既定顺序后置。详见 [设计语言状态](foundations/visual-language.md#当前定型范围与剩余资产)。

## 页面设计待完成

- [ ] **06 · Browser 设计与接入**

  - [x] **06a · Task Browser 当前页面设计**：Header 组合、无集合 Summary、Gallery / List、字段与排序分组、容器内无限加载 / List 分页、选择与归档操作组、三点菜单、改名 / 缩略图 / Pin、无外框 List、每页条数菜单空间不足向上展开均已审核。已归入 [正式页面](pages/task-browser.md)与 [组件配方](components/component-recipes.md#browser-resource-controls)，设计稿为 [v8](assets/crystra-task-browser-v8.html)。
  - [x] **06b · Workflow Browser 当前页面设计**：按 [D15](handoff/decisions-and-open-questions.md#d15)归入 [Workflow Explorer](pages/workflow-explorer.md)，无 Workspace、最新 / 全部版本、Header、Gallery / List、分组排序、精确版本选择与资源操作均由正文维护。对应 [v8](assets/crystra-workflow-explorer-v8.html)，重复草稿已清理；真实接入归 06c。
  - [ ] **06c · Browser 接入与后续范围**：真实目录、关注项 / 进度 / 成本来源、分页 / 游标、改名 / 缩略图 / Pin / 归档存储、URL / 返回恢复、公共组件 API，以及已归档资源的浏览恢复入口。当前原型使用本地样本；具体边界由 [Task Browser](pages/task-browser.md#后续交付边界)维护，数据契约与 07 / 08 / 10 对齐。Evidence Task discovery 不能直接充当包含讨论阶段 Task 的完整目录。

  06 整项仍开放，因为 06c 的生产接入尚未交付；06a / 06b 的当前页面规则不重新开启。

- [ ] **11 · Workflow 工作台详细设计**

  已生成 [Studio v8](assets/crystra-workflow-studio-v8.html)：同步当前 Header / Sidebar、全高 Input 与 divider、统一组件；实现只读页内导航和节点详情联动，移除右侧独立写入口。当前页面组合待审阅；正式图引擎、真实差异 / 校验反馈、版本保存 / 发布在 Input 中的交互继续完成，提交协议由 09 承接。

  交付：[Workflow Studio](pages/workflow-studio.md)及对应设计稿。页面设计未定，不等于 Chat 原则未定。

- [ ] **12 · Analysis 工作台详细设计**

  已确认“总览 / 调用追踪 / 研究报表”方向，默认总览，审计作为来源下钻。已生成 [Analysis v8](assets/crystra-analysis-audit-v8.html)：Dashboard、Task / Delivery Trace 目录、可配置研究与保存 / 固定报表的本地交互示例；未解析来源保留身份且不回退默认 Trace。本轮页面布局仍待审阅；真实查询、DSH Chat、报表持久化、证据回执和宿主恢复继续交付。

  交付：[Analysis](pages/analysis-audit.md)及对应设计稿。具体字段与数据来源由 07 / 10 承接。

Workflow / Analysis 完成后处理 **L01：统一 workspace-header**，整合 Task 摘要与各页二级导航；已有 Sidebar 接入跟踪 **L02**。两项详见 [遗留待办](deferred-todos.zh-CN.md)，不重复维护 checkbox。11 / 12 为原有两个主要页面主题补齐跟踪编号；07–10 保持原编号。

## 数据与接入设计待完成

- [ ] **07 · 控制数据与底层契约映射**

  为五个 Task 工作面和 Workflow 页面补齐最小 IR / 投影字段、精确身份与版本引用。直接复用已有 Workflow Definition / Snapshot / State、Delivery Manifest 和 Evidence 引用，明确哪些是 Crystra Task 控制层需要补充的数据；Task、Plan Run、Wave、Workflow Run、Delivery 不按名称推定一对一。

  交付：[领域边界](foundations/product-and-domain.md)中的字段映射及必要结构定义。记录格式包含 L03 所需的已确认内容与确认依据；具体准入提交由 09 承接。

- [ ] **08 · Task 建立与 DSH / Delivery 接入时序**

  衔接 Hero Composer、首次发送、Task 控制数据持久化和后续发起 Delivery，落实连续 Task 对话与宿主执行关联。系统已定 Task 为 Delivery 分组、Delivery 有独立终态、创建时默认新 Task/显式复用、Session 与活动 Delivery 精确绑定及恢复；这些规则直接沿用。需要补的是 UI Task 生命周期如何接入它们，而非另造 Session 或恢复系统。

  交付：[新建 Task](pages/new-task.md)与 [领域边界](foundations/product-and-domain.md)的接入时序；字段由 07 统一定义。

- [ ] **09 · IR 提案、确认与提交协议**

  将已定 Chat → 提案 → 校验/必要确认 → 提交 → 投影更新落实到 07 的具体结构，接入 DSH 的消息与审批能力。沿用版本不符即拒绝和宿主错误反馈；不再讨论自动合并旧指令。完成 L03 的明确确认记录绑定与准入校验，模型检索或新摘要不能自行获得“已确认”身份。

  交付：[Input 契约](components/input-and-host-slots.md)的接口/消息协议及 [L03](deferred-todos.zh-CN.md) 的验证要求。该机制尚未交付，不能以模型能输出 JSON 代替证明。

- [ ] **10 · Task 摘要与 Analysis 数据来源**

  按已定字段落实来源：Task 当前执行摘要、当前可交付判断、累计耗时/成本/注意力，以及 Analysis 的事实和指标。已有 Evidence / Evolution 结果直接复用；尚无对应数据的 Task 聚合补齐来源和口径。Task 当前可交付判断不等于某次 Delivery 的 terminal result，Evidence 中可发现的 membership 不等于全部 UI Task 状态。

  交付：[审核与指标组件](components/review-surfaces.md)、[Delivery 工作面](pages/task-detail/delivery.md)、[Analysis](pages/analysis-audit.md)的数据映射。缺数据展示方式已定。

## 系统依据与交付边界

[Task / Delivery 概念](../../../docs/agent-architecture.md) · [Session–Delivery 绑定](../../../docs/systems/execution/session-delivery-worktree-binding.md) · [DSH 产品表面与命令](../../../docs/guides/dsh-execution-quickstart.md) · [Workflow 契约](../../../docs/contracts/workflow/workflow-definition-dsl.md) · [Evidence Task discovery](../../../docs/systems/evidence/delivery-manifest-projection.md) · [BI 数据边界](../../../docs/systems/bi/bi-system.md) · [Recorded Trace 接入](../../../docs/systems/bi/bi-studio-ui-ux-design.md)。

待完成项是交付任务，不默认需要人工决策。先依据上述契约完成映射与设计；只有当前场景下仍无法推导的实质分歧才请求裁定。已定的卡片、空间、错误处理不重复列题。专用图引擎、宿主 Slot/路由/文件能力接线及原型更新按既有组件契约和 [验收矩阵](handoff/acceptance.md)实施；不把设计已确认误写成实现已完成。
