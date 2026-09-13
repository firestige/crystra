# Task Browser

> 状态：当前页面视觉与交互已通过用户审核，2026-09-08，见 [D14](../handoff/decisions-and-open-questions.md#d14)。本文是 Task Browser 的正式设计依据，对应 v8 设计稿；替代早期 Browser v7 与 memo 中的页面候选。审核范围包括当前 Header 组合、Gallery / List、选择与资源管理，不表示生产数据接入、持久化或公共 API 已交付。

Task Browser 与 Workflow Browser 是两个独立页面，共享浏览组件和布局，各自维护资源字段、分类排序、接口及生命周期，继承 [D01](../handoff/decisions-and-open-questions.md#d01)。从 Sidebar 任务标题行的“全部任务”三角图标按钮进入，选中态表示当前一级页面。公共 Shell、字体、颜色、图标与菜单行为沿用对应组件规范，本页维护页面组合。

[打开页面](../assets/crystra-task-browser-v8.html) · [Gallery 截图](../assets/task-browser-gallery.png) · [List 截图](../assets/task-browser-list.png)

## 已确认要求

1. 保留搜索框；移除集合 Summary，资源区保留当前查询的结果数量。
2. 提供 Gallery、List 两种视图，通过一个方形滑块控件交替切换；Gallery / List 图标固定在轨道左右，滑块标记当前视图，不渲染双按钮单选组。
3. List 提供状态、创建时间、最近活动时间戳、成本、Workspace；Gallery 文字区只保留 title、subtitle、status。Task 不展示 Workflow 绑定字段；Workflow 的执行绑定属于 Delivery。
4. 活跃 Task 提供进度与关注项；Gallery 用分隔线显示进度，右上角显示关注角标，零关注不画角标。List 仍明确显示零关注；缺失不能假装成零。
5. Gallery 类似文件管理器，可分组并折叠，默认按 Workspace 分组。每个 Task 有缩略图，未设置时用默认图标。已知的当前执行进度借用缩略图与文字区之间的分隔线，不额外显示百分比。
6. Gallery 横向流式排列、换行、无限加载，不分页。根据内容区实际可显示宽高确定加载量，滚动监听属于该内容区。
7. List 分页，进度以 progress bar 显示。
8. Gallery 每张卡片左上角常驻 checkbox，Header 的新建任务区域承载批量操作。操作为新建任务与归档所选；新建是全局入口，归档针对选择集合。

## 页面布局与字段

沿用 Task v8 的 Sidebar、折叠动效、颜色和字体变量。右侧整面是 Browser，不保留 Task 工作台的 Input、bench 或工作面导航。

| 区域 | 已审核设计 |
|---|---|
| Header | 按 identity → search → toolbar → actions 四个 Slot 排列；页面填入标题说明、搜索、浏览工具、新建任务及归档操作；无选择时禁用归档 |
| 搜索 | 匹配任务标题、目标、Workspace 名称或路径；不搜索 Task 的 Workflow 字段 |
| 筛选 | 全部、活跃、需要关注；后两者分别依据活动标记与关注项，不根据进度猜测 |
| 排序 | 图标按钮与三个筛选按钮组成相连的 ButtonGroup；按钮不渲染文字，悬停及可访问名称说明当前排序。点击展开最近活动、创建时间、成本，均降序；未知成本放末尾 |
| Gallery 分组 | Workspace（默认）、状态、不分组；同一分组内应用当前排序 |
| Gallery 卡片 | 缩略图、title、subtitle、status；图片与文字区之间以 2px 进度线分隔；关注项用右上角实心圆角标，选择框置于左上角 |
| List 列 | 选择框、任务、状态、Workspace、当前进度、关注项、创建时间、最近活动、成本、操作 |

List 直接铺在 Browser 内容区，不使用外层 Card：没有外围边框、圆角或独立卡片背景，只保留表头与数据行之间、相邻数据行之间的横向分隔线；保留行 hover 和选中反馈。

List 时间显示月日和时分，悬停原生时间元素可见完整日期与时区；字段保留 ISO 时间。长标题和 Workspace 单行省略并保留完整提示。当前所有成本样本使用 CNY；这里不增加跨币种汇总规则。Gallery 默认图标使用本地 Iconify Tabler target，示例缩略图来自已有设计资产。

Gallery 每行根据可用宽度计算列数和卡宽，272px 为目标最小卡宽、间隔 16px；同一行卡片外框对齐。它们是资源 Card，不使用 Widget 的 m×n 尺寸。

## Gallery 关注角标

卡片右上角使用 24px 实心圆，数字为白色；1–9 显示实际数量，超过 9 显示 9+，零关注不渲染。颜色依据关注项自身的严重程度，error 优先于 warn，不从 Task 的运行状态猜测；同时存在错误和警告时用红色，数字仍表示全部关注项总数。悬停与可访问说明保留完整数量和分项。样本含警告 11 项以及错误 4 项 + 警告 8 项，供检验两种 9+ 和颜色优先级。

## Header 组合

页面向 Header 提供组件内容：identity、search、toolbar、actions 按顺序排列。Header 负责 Slot 的顺序、对齐、空间分配；页面负责搜索状态、浏览选项和具体操作。可选 Slot 没有内容时不保留空容器。本页组合已审核；当前 HTML 用 data-header-slot 标识位置。公共注册 API 尚未发布，其他页面的 Header 结构仍归 L01。

当前 Header 约 88px 高；搜索宽度在 240–320px 内分配，操作在右侧。搜索与浏览工具随 Header 常驻；toolbar Slot 承载筛选、排序、Gallery / List 切换，位于搜索与新建任务之间。结果数量和分组留在下方资源区并参与内容滚动。本页尺寸与排列作为已审核基线；不将其推广为所有工作台的最终 Header。

## 交互

| 操作 | 结果与保留 |
|---|---|
| 单按钮切 Gallery / List | 点击或 Enter / Space 切到另一视图；滑块移动到目标图标，悬停与可访问名称提示当前视图及下一目标，保留键盘焦点。保留搜索、筛选和排序；Gallery 分组与折叠偏好、List 页码在页面内分别保留；切换后滚到内容区顶部 |
| 排序菜单 | 点击图标或方向下键打开，方向键 / Home / End 移动选项；选择后更新结果并返回触发器焦点；Escape 返回触发器，外部点击、焦点离开、滚屏或 resize 关闭 |
| 搜索、筛选、排序 | 重建结果，List 回第一页，Gallery 重新按容器填充，滚动回顶部；保留分组折叠偏好 |
| 折叠分组 | 只隐藏该组内容并停止该组追加；保留已加载条目；再次展开继续浏览 |
| Gallery 滚动 | 各分组先显示一行；末尾哨兵进入内容区底部约半屏预取区时追加一批，批量取决于列数、实际卡片高度和内容区高度；前组追加后重新检查后组当前位置，屏幕外分组不因旧观察结果提前加载；加载完停止观察 |
| 内容区尺寸变化 | ResizeObserver 重算列数与卡宽，再按新高度校准加载；不使用物理屏幕分辨率断点 |
| List 分页 | 默认每页 12 条，可选 24 / 48；改变每页条数回第一页；首尾禁用越界按钮；结果为空显示 0 项；每页条数菜单下方空间不足时向上展开，空间足够时向下展开 |
| 打开任务 | Gallery 单击卡片链接、List 单击行或键盘激活标题链接，携带精确 task_id 到工作台；选择框及其点击区只改变选择，不触发导航 |
| 新建任务 | 进入现有 Task 新建稿入口，不在 Browser 预创建领域对象 |

整个 Browser 的纵向滚动由右侧内容区承担，document 不滚动。折叠 Sidebar 引起的可用宽度变化同样触发重排。

## 选择与批量操作

- Gallery 选择框常驻左上角，右上角仍用于关注项；完整选中外框覆盖缩略图与文字区且不拦截点击。List 首列提供同样的选择框和选中行背景。原生 checkbox 与卡片链接相互独立；尺寸、圆角和图标使用 [Browser 组件配方](../components/component-recipes.md#browser-resource-controls)。
- Header 的归档图标与“新建任务”组成一个相连的 ButtonGroup，整体高 36px；归档不显示文字，hover 或键盘聚焦显示“归档所选” tooltip，没有选择时禁用。有选中项时，在下方结果栏中，与“全选结果”和任务总数并列显示“已选 N”和取消选择图标按钮；清空选择后收起数量与取消按钮。Header 不展示选中数量。
- 结果区“全选结果”作用于当前搜索及筛选匹配的所有任务，包括 Gallery 尚未追加的条目及 List 其他分页；不是仅选择当前屏幕。部分选中显示中间态，空结果禁用。取消全选或结果栏的取消选择按钮清空集合。
- Gallery / List 切换、分页、排序、分组、折叠和尺寸重排保留选择；改变搜索或筛选条件时清空选择，避免操作隐藏条目。
- 点击“归档所选”后，所选任务从当前浏览集合移除，数量与分页同步更新，清空选择。右下角通知显示归档数量，并提供撤销和关闭；通知不自动消失，撤销恢复最近一批归档的任务。
- 归档只收纳资源，不结束 Task，不改变运行状态、进度、Delivery 或执行流程。“新建任务”进入既有新建入口，不因打开空白态预创建领域对象。

[批量选择截图](../assets/task-browser-selection.png)。

## 单项资源操作

Gallery 每张 Card 的右下角、List 每行末尾均提供三点图标按钮，使用本地 Iconify Tabler dots；subtitle 为按钮预留空间。按钮与卡片链接分离，点击不会打开 Task 或改变选择。

Gallery 菜单锚定右下角，向左上方的卡片内部展开，不越过卡片外框。List 行操作菜单从按钮下方向左展开，用浮层避免被列表容器裁切，可用高度不足时菜单内部滚动。Header 排序和分组向下展开；List 底部每页条数允许空间不足时向上翻转。菜单尺寸与方向规则见 [组件配方](../components/component-recipes.md#browser-resource-controls)。同一时间只打开一个卡片菜单；点击外部、焦点离开、滚动、resize 或内容重绘时关闭。Escape 关闭并返回三点按钮，方向键 / Home / End 移动菜单焦点。

| 操作 | 已审核交互 |
|---|---|
| 修改缩略图 | 打开本地图片选择器，支持 PNG / JPEG / WebP / GIF；成功解码后替换当前卡片缩略图，取消不改变原图，读取失败显示通知 |
| 改名 | 对话框预填原名称，保存非空名称后同时更新 Gallery 与 List 的显示；取消或 Escape 不修改。上限 120 字符，不改变 task_id |
| 归档 | 只归档当前卡片，不把其他选中卡片一起归档；复用归档通知与最近一批撤销。若当前卡片已选中，仅从选择集合移除它 |
| Pin / 取消 Pin | 按浏览排序偏好处理：Pin 项排在当前分组前部，Pin 项之间继续遵循当前排序；取消后回到通常排序位置。无分组时在结果集合前部；List 同样先显示 Pin 项。卡片选择框右侧显示 Pin 图标，关注项仍在右上角 |

Pin 只影响 Browser 内排序，不联动 Sidebar，也不改变 Task 活动时间、运行状态或进度。改名只修改资源显示名称，缩略图只修改资源展示资产；这组资源管理操作不修改目标、Plan、Gate 或 Workflow 语义。后者继续通过 DSH Chat → JSON IR → owner 校验提交，资源操作的正式存储与适配不由页面原型冒充。

[Gallery 菜单截图](../assets/task-browser-card-menu.png) · [List 菜单截图](../assets/task-browser-list-menu.png)。两种视图共用菜单操作与资源数据，操作控件不触发行导航。

## 数据语义与实现边界

进度消费适配层提供的当前执行范围和 completed / total，示例口径为当前 Plan Run 的执行单元；不是 Task 生命周期完成率，不使用百分比决定 Task 结束。需明确范围且 total 有效才绘制比例；不绘制假的 0%。Gallery 有已知进度时以图片和文字之间的 2px 分隔线表达，保留可访问进度值与范围说明，不渲染百分比或底部进度文字；未知时保留中性分隔线，悬停提示“进度未知”。List 仍在进度列显示条形进度与数值，未知显示“进度未知”。

活动标记与状态标签是本页的消费者字段，不发布新的系统枚举；运行中、需要关注、已停止均有活跃样本，暂无活动不等于 Task 终态。关注项按当前需要人工关注的已知项展示。

系统边界继承 [Task 与领域文档](../foundations/product-and-domain.md)、[Session / Delivery / Worktree 绑定](../../../../docs/systems/execution/session-delivery-worktree-binding.zh-CN.md)；Workflow 执行绑定的候选结构见 [Delivery Manifest 2.0](../../../../docs/systems/execution/delivery-manifest-2.0.0-candidate.zh-CN.md)，本页不据此升级或修改底层契约。

当前设计稿含 96 个本地 Task fixture；归档仅维护页面内 ID 集合，改名、缩略图、Pin 与浏览偏好刷新后恢复，不删除真实资源，没有上传服务或生产归档接口。无限加载实际追加本地样本，没有模拟延迟和“加载中”动画；生产的数据读取、游标及统计由后续适配层提供。工作台链接携带身份，但目标 v8 仍是代表性静态样例，不声称已接入 96 个真实 Task。浏览偏好当前仅在页面内保存，跨导航持久化尚未实现。

## 后续交付边界

- 已归档资源的浏览与恢复入口，以及正式资源归档接口；当前已有卡片菜单、单项 / 批量归档及最近一批撤销的本地示意。
- 页面查询与返回状态的 URL / 持久化方案；当前只有页面内状态，尚未实现跨导航恢复。
- Task 集合、关注项、进度与成本的真实数据适配，以及 Gallery 游标读取和 List 分页接口。
- 缩略图、改名和 Pin 的正式持久化与适配；当前已可通过卡片菜单在本地示例中修改。
- Workflow Browser 的页面规则由 [Workflow Explorer](workflow-explorer.md)独立维护；两页真实目录与宿主接入归 06c。
- Header Slot 的正式注册接口与跨页归纳；本页现有排列不自动冻结其他页面的 Header，见 [L01](../deferred-todos.zh-CN.md)。

上述工作不重新开启已审核的本页视觉与交互；进度跟踪见 [清单 06](../pending-decisions.zh-CN.md)。

## 代码、设计稿与验证

Browser 的视图切换复用 [ToggleSwitch](../../../../wsr-ui/packages/bi/src/components/toggle-switch.tsx)，通过页面事件桥接到既有浏览状态；轨道与点击区高 36px，与筛选组和操作按钮一致。图标保持固定位置，仅滑块移动；沿用组件的 reduced-motion。Header 排序菜单与分组向下展开；List 底部“每页 X 条”默认向下，下方空间不足时从控件顶部向上展开，完整显示选项；卡片右下角菜单按本轮要求向卡片内展开。

修改 Switch 源码后，先在 wsr-ui 运行 `CRYSTRA_PREVIEW_ENTRY=browser-switch.html npm exec --workspace wsr-ui-core vite -- build --config vite.components.config.ts --outDir dist-browser-switch`，再执行本页构建脚本。构建脚本导出共享 React 组件与样式，不另写一套滑块实现。Task 与 Workflow 的浏览交互共用 resource-browser.ts；各自适配器维护字段、分类排序与链接，页面状态独立。


页面结构：[HTML 片段](../assets/task-browser-surface.html)；领域字段和样本：[Task 适配器](../assets/task-browser.ts)；共用浏览交互：[资源浏览器](../assets/resource-browser.ts)；布局：[CSS](../assets/task-browser.css)。运行 `node assets/build-task-browser.mjs` 从已接受的 v8 Shell 与本地资源重建页面；不用修改 sources 中的历史 v7。

验证：`node --test assets/task-browser.test.mjs`，覆盖选择框与导航隔离、跨视图和分页保留选择、查询变化清空选择、全选结果、批量归档与撤销、卡片菜单向内定位、改名、图片替换、Pin / 取消 Pin、单项归档与选择隔离，List 每页条数菜单的上下翻转，以及分组折叠、容器内追加、搜索与视图切换、分页、空结果、精确 task_id 链接、Sidebar 折叠与不同可用宽度；自动导出上述截图。

[跨页浏览与返回](../flows/cross-page-browsing.md) · [AC18 验收条件](../handoff/acceptance.md#task-browser-acceptance)。
