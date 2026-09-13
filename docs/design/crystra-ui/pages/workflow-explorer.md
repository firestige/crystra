# Workflow Explorer

> 状态：2026-09-09，当前浏览布局、字段、版本展示与资源管理规则归入正式设计依据，见 [D15](../handoff/decisions-and-open-questions.md#d15)。本页是 Workflow Explorer 的唯一页面规则入口，对应 [v8](../assets/crystra-workflow-explorer-v8.html)，公共控件继承 [Task Browser](task-browser.md)及组件规范。生产目录、持久化与宿主接入仍待交付；Workflow Studio 实验不在本次确认范围。系统概念以仓库 docs 的发布契约为准。

## 页面职责与资源身份

从 Sidebar 工作流标题行的“全部工作流”三角图标按钮进入独立一级页面，继续复用同一 Shell。这里浏览可复用的 Workflow 定义资源，不把每次 Delivery 的运行实例混进目录。

Workflow 是可复用的全局定义资源，不具有 Workspace 归属；目录字段、搜索和分组均不引入 Workspace。默认按 definition 折叠，只显示最新版本；也可展开全部版本。每个实际显示条目仍对应一个定义的精确 revision，进入 Studio 时携带 `workflow_definition_id` 与 `revision`；若浏览入口带 `from_task_id` 则继续传递。显示名称不作为身份键，改名不改变链接或版本；不使用 `latest` 作为精确引用。版本展示规则见下文；浏览或切换版本展示方式不能重绑定现有 Delivery。

依据：[Workflow DSL 已发布契约](../../../../docs/contracts/workflow/workflow-definition-dsl.md)及 [Package schema](../../../../system-contracts/workflow-dsl/schemas/package.schema.json)。Definition 可版本化，Snapshot 每个 Delivery 不可变，Workflow State 属于每次执行。Package 的 DRAFT / CONFIRMED / DEPRECATED 显示为“草稿 / 已确认 / 已弃用”；“已确认”不等于已通过所有运行准入条件，不从状态推导可运行或执行成功。

## 继承的页面设计

- Header 使用 identity → search → toolbar → actions：标题说明、搜索、筛选 / 排序组、最新版本 / 全部版本 ButtonGroup、方形双图标 Gallery / List Switch、归档图标 + 新建工作流 ButtonGroup；不放集合 Summary。
- 全选结果、结果数量、已选数量与取消选择留在下方结果栏；Header 不放选择数量。
- Gallery 默认不分组，可按状态分组，分组可折叠；沿用按容器宽度 flow row 换行和滚动追加。
- Card 左上圆角 checkbox、右下三点按钮、完整选中边框、缩略图和默认 Iconify 图标继承同一配方。
- List 无外围 Card 背景、边框或圆角，仅保留横向行分隔；首列选择、末列三点操作，保留 hover 与 selected。
- List 默认每页 12 条，可选 24 / 48；分页 Select 下方空间不足向上展开，空间足够向下。
- 选择、Pin、归档通知 / 撤销、菜单焦点与方向、搜索改变时清选、视图切换保留选择均复用 [公共交互实现](../assets/resource-browser.ts)，规则继承 [Task Browser](task-browser.md#交互)和 [组件配方](../components/component-recipes.md#browser-resource-controls)。

Header 固定在右侧页面顶部，结果栏、资源列表及分页在其下方内容区滚动，document 不承担页面纵向滚动。Header 最小高度 88px，padding 为 18px / 32px，slot 间距 16px；资源区 padding 为 24px / 32px。它们属于本浏览页的组合基线，布局依据实际可用区域，其他工作台 Header 仍归 L01。

Header 标题为“全部工作流”，描述为“浏览定义，复用工作流。”；搜索提示“搜索工作流、用途或版本…”。筛选互斥，排序为图标按钮并默认向下展开；Gallery / List 使用 36px 方形双图标单按钮滑块，与相邻控件等高。图形、点击区与菜单例外沿 [Browser 组件配方](../components/component-recipes.md#browser-resource-controls)。

## Workflow 字段与组合

| 区域 | 页面显示 |
|---|---|
| 搜索 | 显示名称、definition identity、revision、Package 名称、用途 |
| 筛选 | 全部、已确认、草稿；已弃用资源可在“全部”中查看，并可按状态分组 |
| 排序 | 最近更新（默认，降序）、创建时间（降序）、名称（升序）；Pin 项先于通常排序 |
| Gallery | title 为显示名称，subtitle 为用途，status 为本条 Package 状态；缩略图区左下角显示精确版本。没有缩略图用 Iconify Tabler git-branch |
| List | 选择框、工作流名称 / 用途、版本、状态、节点数、创建时间、最近更新、操作 |
| 分隔与指标 | 图片与文字区只保留中性分隔线；不把 Task 进度、关注数量或成本强行移到 Workflow 定义卡片 |

创建 / 最近更新时间、显示别名、缩略图、Pin、归档是目录消费者字段，不宣称都是 DSL 原生字段。节点数表示所展示定义图的节点数量，不表示已经执行多少节点。展示版本来自适配层的精确选择；状态来自该条目的 Package，不提升为 Definition 运行状态。样本中的节点数、时间与用途均为本地示例。

## Gallery、List 与状态细节

- Gallery 的每张资源 Card 独立排列，没有外层集合 Card；圆角 12px、目标最小卡宽 272px、间距 16px。它是资源卡，不使用 Widget 的 m×n 尺寸。列数和卡宽随容器实际宽度变化，滚动追加按资源区可用高度计算。
- title / subtitle 单行省略并保留完整提示；Gallery 不放创建 / 更新时间或节点数，这些属性在 List 展示。缺缩略图只使用默认图标，不当成加载或错误。
- 左上 checkbox、右下三点按钮独立响应，不触发卡片 / 行导航。选中外框覆盖整张卡，包括图片；Pin 标记随置顶状态显示。
- Gallery 分组选择位于结果栏右侧，List 不显示分组控件。分组标题含展开箭头、图标、名称和数量；折叠停止该组追加并保留已加载条目。不分组时保留“全部工作流”集合标题。
- List 的名称与用途上下排列，版本和节点数对齐；时间显示简短时间戳，完整日期与时区通过提示查看。末列操作按钮保留。选择、键盘导航、全选状态与分页继承 Task Browser。
- “已确认”用绿色，“草稿”用警示色，“已弃用”用中性色；状态点与文字共同表达定义版本状态，不表达执行结果。
- 搜索 / 筛选无结果时，显示淡化文件图标、“没有符合条件的工作流”和调整条件提示；全选禁用。其他 hover、pressed、disabled 与焦点反馈继承公共组件。

## 版本折叠与展开

- Header 提供“最新版本 / 全部版本”组合按钮，默认最新版本；设置同时作用于 Gallery 与 List，切换 Gallery / List 保留该设置。
- 折叠按 `workflow_definition_id` 归并，每组只取目录适配层给出的最新版本。“最新”是版本顺序，不是最近活动时间、显示名称排序，也不是只取已确认版本。先确定最新版本，再应用搜索、状态筛选和资源归档过滤；不因最新项未命中而回退旧版本。
- 全部版本模式逐条展示版本；同一个工作流的不同版本使用 `definition + revision` 作为独立条目身份，保持精确 Studio 链接，不用 `latest` 作为跳转参数。
- 最新模式的结果计数为工作流数；全部模式同时显示版本数与涉及的工作流数。Gallery 按当前模式的结果滚动追加，List 按当前模式的结果分页。
- 切换版本模式清空选择、回到第一页及滚动顶部；搜索、状态过滤、排序和分组选项保留。全选只包含当前模式下符合查询的条目，不隐式选中被折叠的历史版本。
- 资源操作以所显示 / 所选的精确版本条目为单位。折叠不等于选择整个版本家族；归档当前最新条目后也不自动拿历史版本代替它。

## 资源操作

两种视图共用修改缩略图、改名、单项归档、Pin / 取消 Pin；Header 提供批量归档，并保留最近一批撤销。Gallery 菜单向卡片内展开，List 行菜单在按钮下方以右边缘为锚点向左展开，避免容器裁切。

- 改名只修改 Browser 显示别名，不直接改 `package.name`、Definition identity、内容或版本。
- 缩略图支持本地 PNG / JPEG / WebP / GIF；选择取消或图片读取失败保留原值。
- 归档只从浏览集合收纳，不把 Package 改成 DEPRECATED，不删除定义，不使已绑定 Snapshot 失效，也不终止 Delivery。
- Pin 只影响 Browser 排序，取消后恢复通常排序；不联动 Sidebar 或执行。
- 新建工作流指向Studio v8 入口的 `new_workflow=1` 示例。目标 [Studio v8](../assets/crystra-workflow-studio-v8.html) 已提供新建空态，尚未连接宿主会话；不因此在 Browser 创建定义，也不冒充已经进入真实新建会话。
- 定义内容、发布状态、版本等语义修改仍由 DSH Chat → LLM JSON IR → owner 校验提交，遵守 [D04](../handoff/decisions-and-open-questions.md#d04)。

## 代码与设计稿

[Gallery 截图](../assets/workflow-explorer-gallery.png) · [List 截图](../assets/workflow-explorer-list.png) · [全部版本](../assets/workflow-explorer-all-versions.png)。

| 文件 | 职责 |
|---|---|
| [workflow-explorer-surface.html](../assets/workflow-explorer-surface.html) | Workflow Header 文案、筛选 / 分组选项与列表表头 |
| [workflow-explorer.ts](../assets/workflow-explorer.ts) | 96 个工作流、每个 3 个版本的本地目录样本；版本投影、字段呈现、过滤排序、精确 Studio 链接 |
| [workflow-explorer.css](../assets/workflow-explorer.css) | Workflow 状态、版本标签和 List 列宽 |
| [resource-browser.ts](../assets/resource-browser.ts) | 两页共用的 Card / List 操作、分组加载、分页、选择、菜单、改名、图片替换与 Pin / 归档 |
| [task-browser.css](../assets/task-browser.css) | 两页共用的已审核布局与控件配方；历史文件名不表示 Workflow 采用 Task 领域模型 |
| [build-resource-browser.mjs](../assets/build-resource-browser.mjs) | 两页共用的 Shell、Switch 与本地资源装配 |
| [build-workflow-explorer.mjs](../assets/build-workflow-explorer.mjs) | 生成 Workflow Explorer v8 |

构建：在 assets 运行 `node build-workflow-explorer.mjs`。共享 Switch 修改后先按 Task Browser 文档重建 React 导出。

验证：`node --test task-browser.test.mjs workflow-explorer.test.mjs`。Workflow 检查覆盖版本折叠 / 展开、版本顺序、筛选不回退旧版、切换清选、跨视图精确身份、导航选中、字段差异、精确 revision、搜索 / 筛选、Gallery 追加、分页、多选、改名身份不变、归档撤销及不同可用宽度；Task 全量浏览回归保证共用代码不改变已审核页面。

## 接入边界

原型中资源、选择与浏览偏好仅在当前页面内保存，刷新后恢复样本。真实目录与发布包版本的汇总、资源存储、跨导航恢复、宿主新建及 Studio 内容还需接入；不从 Package status 推导权限、运行准入或执行事实。Workflow Studio 仍按自身详细设计交付，不因 Explorer 已生成而宣称其完成。进度见 [06b / 06c](../pending-decisions.zh-CN.md)。
