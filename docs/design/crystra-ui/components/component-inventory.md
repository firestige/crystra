# 公共组件语义清单

> 组件职责目录；已实施范围与接受状态统一见 [组件配方](component-recipes.md)。不引入 MUI，不实施包更名。公共实现承接现有 `wsr-ui`，以后更名为 `crystra-ui`。React + Tailwind CSS，代码优先 TypeScript；部分专业图表使用 D3.js。

本文件只维护组件职责清单；具体属性与实施范围见 [基础组件配方](component-recipes.md)，Widget 分层与视觉分别见 [组件契约](widget-component-contract.md)和 [表达设计](widget-expression-design.md)。不在清单内另定状态或尺寸规则。

## 分类依据

从 v8 实际出现的界面用途及已确定的 Browser 骨架归类，参考 [MUI 组件目录](https://mui.com/material-ui/all-components/) 的输入、数据展示、反馈、表面、导航、布局分类，以及 [Vuetify 组件目录](https://vuetifyjs.com/en/components/all/) 与 [Card 定义源码](https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/pages/en/components/cards.md) 的对应职责；这是组件边界的参照，不引入它们的主题、Vue 技术栈或整库依赖。

现有源码 [design-system.tsx](../../../../wsr-ui/packages/bi/src/components/design-system.tsx) 已有 Typography、Button、IconButton、ButtonGroup、Surface、Divider、TextInput、StatusBadge。实现成熟度以组件配方和对应源码为准，本清单不维护另一份完成状态。

## 自有基础组件

| 组件族 | 归并哪些用途 | v8 / 已定需求证据 | 职责参照 |
|---|---|---|---|
| Typography | 标题、正文、说明、元数据、代码文本 | 已接受文字角色 | MUI Typography；按文字角色选用 |
| Icon | 图标资源、语义尺寸、辅助标签 | Sidebar、工具、复制、状态图形 | Iconify Tabler；资源规则见图标规范 |
| Button / IconButton | 文本、图文、纯图标操作 | 展开、返回、复制、缩放 | MUI Button / IconButton |
| ButtonGroup / SegmentedControl | 相连操作组 / 多项互斥选择，分别使用 | Browser 筛选与排序、归档与新建操作组 | 操作组与互斥选择分开；Gallery / List 使用下一行的单按钮 Switch |
| ToggleSwitch | 布尔开关或两个有效视图交替切换 | Task Browser 的方形双图标滑块 | 单按钮、固定轨道图标；两视图切换不套 radio，见 [配方](component-recipes.md#toggle--switch) |
| TextField / SearchField | 自有搜索与筛选输入 | Task Sidebar 搜索、Browser 查询 | MUI TextField / Vuetify VTextField；不含 Composer |
| SelectionControl | Checkbox / Radio 的单选多选 | 视图选项、资源批量选择 | MUI Checkbox / RadioGroup；不含宿主审批 |
| Select / FilterControl | 分类、排序、状态筛选 | Browser、Analysis 范围选择 | MUI Select / Vuetify VSelect；详细字段随页面定 |
| Surface / Card | 基础表面、带标题内容卡、嵌套区域 | 各 bench 卡片 | MUI Paper / Card、Vuetify VCard |
| Stack / Grid / Container | 同组布局、网格、内容约束 | Shell 与 bench 卡片布局 | MUI Stack / Grid；与组件内部 padding 分开 |
| Divider | 分组边界、行列分隔 | Sidebar Footer、卡片分段 | MUI Divider |
| List / ListItem | 单项资源、事实、决定与证据条目 | Sidebar、Gate、Delivery | MUI List / Vuetify VList；内容槽按语义组合 |
| ResourceGrid | Gallery 资源平铺 | 两个 Browser 已定 Gallery | MUI Grid / ImageList 的组合，不把图片墙语义照搬资源 |
| DataTable | 可比较的资源元数据行列 | Browser 列表；对比分析明确不使用结果表格 | MUI Table / DataGrid、Vuetify VDataTable；先确定必需能力 |
| StatusBadge / Chip / CountBadge | 状态文字、筛选标签、数量 | 运行状态、Gate 计数、版本标记 | MUI Chip / Badge；标签、业务状态与计数区分 |
| Tabs | 同级工作面与页面内导航 | Task 五工作面、后续 Workflow / Analysis | MUI Tabs / Vuetify VTabs；不是执行步骤 Stepper |
| Disclosure / Accordion | 展开局部内容 | Sidebar 分组、运行身份、详情 | MUI Accordion；折叠不修改业务状态 |
| Menu / ContextMenu | 操作菜单、视图选项 | Task 工具、Browser 右键菜单 | MUI Menu / Vuetify VMenu；共享浮层机制 |
| Popover / Tooltip | 身份详情、紧凑提示 | 运行身份、collapsed rail tooltip | MUI Popover / Tooltip；不合并内容与提示语义 |
| Drawer / OverlayPanel | 临时目录、详情面 | Sidebar 目录、Inspector | MUI Drawer；已定 Sidebar 行为直接复用 |
| Alert / InlineFeedback | 页面局部说明、警告与错误 | Gate 影响说明、精确读取失败 | MUI Alert；宿主 Input 错误不归此组件 |
| Toast / Progress | 确有耗时的通知小窗和进度 | 已定右下角通知区域 | MUI Snackbar / Progress；不为本地空数据制造加载 |
| Skeleton / EmptyState | 空卡占位、空集合、无结果 | 已定骨架规则与 Browser | MUI Skeleton；文案/骨架按已定规则组合 |
| ScrollArea / FullBenchViewer | 滚动区域、长卡完整查看与返回 | Plan、Evidence、纵向列表展开 | 布局组合，不采用跨页高卡 |

职责清单已确认，组件变体、props、样式与状态矩阵分批按现有 v8 实施。分页/虚拟化按数据规模与页面设计落实，不预先引入重型表格能力；日期范围选择已有观测 Header 场景，见页面文档；不为没有实际场景的评分器等扩展组件。

## 自有领域组合

| 组合 | 基础积木 | 所有权与差异 |
|---|---|---|
| AppShell / Sidebar / ResourceSection | Container、List、Disclosure、Popover、Icon | Sidebar 行为已定，公共跨页同步 |
| WorkspaceHeader | Typography、StatusBadge、Tabs 等 | L01 后置整合，不提前冻结高度与结构 |
| ResourceBrowser | Search、Filter、模式切换、List / Grid / Table、Menu、多选工具条 | Task / Workflow 两页同源组件；分类、接口、生命周期分别接入 |
| ReviewCard / DecisionState | Card、List、Status、Alert | Gate 数据语义复用领域契约；不是每个章节造一套基础卡 |
| MetricSummary | Typography、Status、说明 Popover | 复用已有 MetricPanel / MetricTruthLabel 等边界 |
| IdentityPopover / EvidenceViewer | Popover、代码文本、复制、只读内容 | 精确 ID / revision；类型化内容由 renderer 承接 |
| Inspector / ReturnContext | OverlayPanel / FullBenchViewer、Tabs、详情 | 复用已有 Inspector / SpanPassport 的职责；保留来源与浏览状态 |

现有 BI [组件目录](../../../../wsr-ui/packages/bi/src/components/) 还有 MetricPanel、RecordedStructureFoundation、MotionControl、TraceWaterfall、TraceTree、TraceStatistics、MetricExplanationView、ReceiptView 等，先核对可复用部分及领域类型，不另建同名实现。

## 宿主组件：只挂载

整个 DSH Input（含 Hero、气泡、Chat、Composer、原生工具/审批/问卷、模型/权限选择）为独立整体。Workspace、设置和文件能力按已有 Slot 边界复用。它们不列为 Crystra 自主实现的基础组件；布局只分配宽高，Crystra token 不覆盖内部。详见 [Input 契约](input-and-host-slots.md)。

## 专业图组件

| 组件 | 数据区别 | 实现约束 |
|---|---|---|
| PlanDagView / PlanRunView | 计划拓扑 vs 计划运行投影 | 学习 Archify 的确定性几何、路由、浏览和渐进披露；保留 Crystra Plan authority |
| WorkflowTopologyView / WorkflowRunView | 允许拓扑 vs 已发生路径 | 不自行发明排布；运行图按既有正交路由和循环访问规则 |
| TraceWaterfall / TraceTree / TraceStatistics | Recorded Trace 事实 | 现有 wsr-ui 已有，优先复用；不得从 Workflow 推断 Trace |
| MetricChart / CompareView | 指标与精确差异 | React / TS + 适用的 D3.js；图表配色独立 |

Archify 是必须学习的成熟实现来源，D3.js 不是自动解决 DAG 路由的引擎。几何布局、React 生命周期与 D3 视口/绘图/动效分别分工，不让多套代码同时控制相同 DOM 或运动。现阶段不实现新图引擎，具体参考责任见 [图投影](graph-projections.md#archify-学习与实现纪律)。
