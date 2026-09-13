# Shell、Sidebar 与可选文件工具面

> 继承 U1「全局 Shell」「Sidebar」「Better Sidebar」；A1 为外观基线。相关 [布局规则](../foundations/layout.md)。

## 结构与所有权

`app-shell` 容纳 Sidebar 与主表面。`sidebar-logo-row` 的 `surface-banner` 与 `sidebar-toggle` 是独立按钮；`sidebar-brand-mark` / `sidebar-brand-name` 纯展示。品牌透明、标志约 24px，不用大卡片或额外切换字符。

`task-working-set`、`workflow-navigation`、`analysis-navigation` 是三个非互斥 disclosure。`sidebar-footer` 固定底部，`host-settings` 打开 DSH settings。跨 Task Browser 等主面切换时复用这些结构，不能新建同义的专属 Sidebar。

## 任务与工作流标题行

本节为已确认的正式设计，见 [D16](../handoff/decisions-and-open-questions.md#d16)。

标题行右侧统一依次放置搜索、视图、全部入口，使用 28×28px 图标按钮和 14px inline-action 图标；与标题折叠按钮互为兄弟节点。全部入口采用 Iconify `tabler:player-play-filled` 向右实心三角，tooltip / 可访问名称分别为“全部任务”“全部工作流”，进入对应 Browser；列表底部不再重复入口。hover 和键盘聚焦都显示真实 tooltip，当前 Browser 对应的全部按钮保留选中态。

工具只高亮自身，pointer / mouse / click 不冒泡到标题；点击标题仍独立折叠列表。Section 折叠后保留标题行工具，点击搜索会展开该 Section，并在原标题行进入全宽搜索，不增加一行。全局 Sidebar 收起后，同一标题行随临时目录展示。

工作流搜索仅筛选当前侧栏定义目录，保留精确 revision 与来源 Task 导航参数；不创建 Workspace 分组。视图按钮使用与任务一致的 adjustments-horizontal 图标，菜单从按钮下方展开。视图菜单提供名称升序 / 降序（默认升序）、显示版本标签开关（默认开启）；不改变所浏览的版本。这些视图选项为本地偏好，关闭搜索保留选项，宿主持久化仍归 L02。

## 已确认的全局折叠态

用户已确认 [Sidebar v8](../assets/crystra-task-work-v8-sidebar.html) 的 64px 图标栏、临时目录、左上角展开入口及 340ms 抽屉动效。目录保持完整宽度，随边界滑出/裁切，不在收起瞬间隐藏；尊重减少动态效果。折叠时 hover / 键盘聚焦品牌图标替换为展开图标，点击只展开，底部不放展开按钮。

仅展开态 Banner 双向切换 Crystra / DeepSeek；dsh-web 原新建 Session 处理器需替换。折叠不改变任务，三个 Section 的偏好保持。宿主实现和跨页资源交付见 [遗留待办 L02](../deferred-todos.zh-CN.md)。

本页是 Sidebar 行为的唯一维护入口，归并状态见 [D15](../handoff/decisions-and-open-questions.md#d15)。尺寸与图标分别引用 [空间规范](../foundations/layout.md)、[图标规范](../foundations/iconography.md)，不在历史提案中另设档位。

### 图标栏与临时目录

- 默认展开；收起后为 64px rail，自上而下是品牌、新建任务、任务、工作流、分析，底部仅设置。rail 操作命中区为 40×40px，导航图标使用 18px，品牌 / 展开同槽位使用 24px；通用图标为 Iconify，宿主品牌保留原生 SVG。
- 任务图标聚合工作集未解决关注数量；图标 hover / focus 显示文字提示。点击任务 / 工作流 / 分析图标打开临时目录，再次点击或点击外部关闭，不以 hover 自动打开。
- 目录宽 300px，随内容收缩，超过可用高度才纵向滚动；复用 Sidebar 的原节点，包括搜索、视图选项、列表及全部入口，不复制资源或重建 Input。
- Escape 先关闭内层搜索 / 视图菜单，再关闭目录；关闭目录后焦点回到触发图标。重新展开 Sidebar 恢复各 Section 的折叠偏好。
- 收起不卸载 Task、Workbench 或 Input。初始 ?sidebar=collapsed 是原型场景参数；跨页 / 刷新 / 空间模式的偏好存储仍由宿主接入完成。

### 抽屉动画与宿主切换

340ms 缓出动画期间，目录保持展开态固定宽度，随边界水平移动、逐步露出或裁切；不挤压重排，不在收起瞬间隐藏。紧凑图标栏在收起末段交接，主工作区和文件工具入口同步移动。允许途中反向切换；打开临时目录时解除动画裁剪。reduced motion 即时切换，保留语义和焦点。

dsh-web Banner 接入必须替换原新建 Session 处理器，不能叠加一次点击触发两个行为。折叠时只展开，展开时双向切换表面；键盘 Enter / Space 一致。往返保留 Session、Task、Workbench、输入草稿和浏览状态，新建会话保留独立入口。当前原型仅演示宿主表面，未实现真实 DSH 会话恢复。

## 操作与状态表

| 控件/动作 | 分类 | 触发→反馈 | 状态/返回 |
|---|---|---|---|
| 品牌入口 | 浏览，host-owned | 折叠态仅展开；展开态双向切换 Crystra / DeepSeek | 不创建 Task/Session；保留当前 Session 与 Task 上下文；宿主需替换原新建会话处理器 |
| Sidebar toggle | 偏好 | 展开/收起全局导航 | 不改变路由与当前任务；键盘名称与 tooltip |
| 三个 Section Header | 偏好 | 箭头/标题/空白点击折叠；整行 hover | 每区独立；工具 hover 抑制父 hover；工具 click 不冒泡 |
| Task / Workflow 搜索图标 | 偏好 | 原 Header 槽位变全宽搜索框并获得焦点 | 隐藏标题/其他工具，不加第二行 |
| 搜索退出 | 偏好 | 左搜索按钮、关闭、Escape、点击外部 | 清空临时查询，恢复完整列表；保留排序过滤 |
| Task 视图选项 | 偏好 | 打开/关闭菜单；外部点击关闭 | 默认 created_at 倒序；可切有效事件活跃度；持久化载体待定 |
| Workflow 视图选项 | 偏好 | 按钮下方打开菜单；外点 / Escape 关闭 | 名称升序 / 降序、版本标签显隐；只影响展示，不切换 revision |
| 活跃过滤 | 偏好 | 保留仍需推进的任务 | 运行、待审核、失败停止均保留；只排除全完成或明确放弃 |
| Task 行 | 浏览 | 精确 task_id 打开对应 Task | 恢复 Input/Workbench/草稿/subject/浏览位置，宿主集成后验证 |
| 全部 Task/Workflow/分析项 | 浏览 | 独立一级页面 | 入口负载见导航文档，不触发执行 |

Task / Workflow Section 折叠：同时关闭搜索和菜单、清空临时搜索、隐藏列表内容，保留标题行图标工具；各自视图选项保留。Task 折叠时显示聚合未解决人工关注徽标，展开时隐藏聚合徽标。Badge 无独立点击或审批 authority。

Task 行：状态圆点 + 单行省略标题 + 可选相对时间 + 注意力数量。状态优先失败>待审>运行>全完成；不显示成本、Wave/Delivery/Agent 数、路径或身份胶囊。示例 `task-current` 等只是 fixture，生产行以 task_id 识别。

Task 行的状态是当前活动摘要，不定义 Task 终态；“全完成”不得从无待裁决项推导，也不表示 Task 自动结束。Task 与 Delivery 的边界见 [领域文档](../foundations/product-and-domain.md)。

Workspace Header 的最终整合仍归 [遗留待办](../deferred-todos.zh-CN.md) L01；Sidebar 已接受不代表 Header 高度、三层标题或二级导航已经冻结。

## Better Sidebar 的可用空间协调

1920×1080 是基础体验验证场景，不是布局断点。空间协调器用宿主实际内容宽高，扣除导航、Header、间距和文件面后判断核心两栏是否仍可用。右侧文件面检查剩余宽度及高度，底部文件面检查剩余高度；不能只按屏幕规格或 viewport 宽度选停靠。空间不足优先保留 Input / bench，调整导航或收起文件面。完整规则见 [布局规范](../foundations/layout.md)。

## Better Sidebar 适配

能力只从宿主公开 `ctx.betterSidebar` 或等价版本化契约探测。A1 `?better_sidebar=1` 是演示开关，不是生产 capability 判断。

发现能力时挂载 `better-sidebar-edge-handle` / `better-sidebar-toggle` 与 `better-sidebar-host-slot`；未安装、未激活或版本不满足时整组隐藏，不显示安装诱导、禁用假入口或自建替代文件树。

Handle 的 mouse hover / keyboard focus 显露完整按钮；触摸第一次展开按钮、第二次打开临时工具面。位置随底部/右侧模式和面板边界移动。`better-sidebar-close` 只收起面板，不删除文件 Tab 或 Task 状态。

打开精确资源时经公共 `openFile({sessionId,cwd},path)` 或等价能力，cwd 来自产物所属 worktree，不能用当前最近 worktree 猜。文件树、编辑器、Diff、Tab 由插件渲染。`@文件` 可回 Input，只是引用材料。

资源不可定位/插件读取失败的具体呈现依宿主契约；本次建议保留源链接身份并显示读取失败，不切换到另一文件。文件面可编辑能力归插件，其存在不授予对 Workflow IR 的直接写权。

## Task / Workflow 标题工具的 hover 隔离

仅 hover Task / Workflow 分区标题按钮时高亮整行；hover 搜索、视图、全部入口图标按钮时只高亮各自按钮，标题行保持 idle。搜索输入展开或指针进入视图菜单也不触发标题高亮。工具区域阻止 pointerover/out、mouseover/out、pointerdown 和 click 冒泡；键盘 Escape 继续沿既有搜索/目录退出逻辑处理。

CSS 用标题按钮的 `:hover` 精确控制父行，并为工具区域保留 idle 规则。`stopPropagation()` 不会取消祖先的 CSS `:hover`，两层隔离必须同时保持。搜索按钮打开搜索时显式关闭视图菜单，避免阻断冒泡后失去原来的点击外部关闭效果。颜色变量转换不能将工具 idle 与标题 hover 归并成同一个变量。

## 结构标识与验证入口

| section ID | 职责 |
|---|---|
| task-section-header / workflow-section-header | 标题行；折叠标题、搜索、视图、全部入口互为独立控件 |
| all-tasks-action / all-workflows-action | 标题行右端三角图标链接；保留原导航身份，不再属于列表内容 |
| task-search-control / workflow-search-control | 标题行原位搜索，包含输入和关闭按钮 |
| task-view-options-action / workflow-view-options-action | 视图菜单触发按钮 |
| task-view-options-menu / workflow-view-options-menu | 按钮下方的各领域视图菜单 |
| workflow-show-version | 控制版本标签显隐，不改变精确版本 |
| sidebar-rail | 折叠态导航容器 |
| sidebar-rail-tasks / sidebar-rail-workflows / sidebar-rail-analysis | 各临时目录的触发入口，提供 aria-expanded 和可访问名称 |
| sidebar-rail-task-attention | 工作集聚合徽标，无独立业务操作 |
| sidebar-tooltip | hover / focus 文字提示，退出后移除 aria-describedby |
| sidebar-toggle | 展开 / 收起，复用既有标识 |
| surface-banner | 展开态宿主切换；折叠态仅展开 |

[展开](../assets/sidebar-v8-expanded.png) · [折叠](../assets/sidebar-v8-collapsed.png) · [临时目录](../assets/sidebar-v8-task-directory.png)。当前 Task、两个 Browser 和 Workflow / Analysis v8 均已使用这一 Shell；跨页链接见 [导航规范](../foundations/navigation.md)。工作台页面实验不因复用 Sidebar 获得确认。

原型检查入口：[Sidebar](../assets/sidebar-preview.test.mjs)、[两个 Browser](../assets/workflow-explorer.test.mjs)、[工作台 Shell](../assets/workbench-pages.test.mjs)。检查设计稿的展开/折叠、保留节点、目录退出与焦点、Banner 往返及可用空间；真实宿主集成和偏好恢复仍归 L02。历史测试中更小的视口不扩大首期设备范围。

Task v8 的离线样式依赖 [本地 Tailwind Play 脚本](../assets/tailwind-play-cdn.js)，仅用于预览；浏览器页及工作台构建继续按各自页面说明执行。


## 工作台 Header 的底线导航

工作流工作台与观测与分析复用 `wsr-ui/packages/bi/src/page-header.css` 的 `.wb-page-header` 配方，并调用共享 Tabs 的 `appearance="underline"`。身份区 268px、列间距 24px；导航位于标题右侧并贴 Header 底边，使用透明背景、16px 字号、24px 项间距与 2px 选中下划线。右侧是页面注入的 context／time 槽位；工作流身份跨两行居中，分析页按日期／上下文分行。页面内容不由 Header 统一。

[浏览器对照脚本](../assets/check-workbench-header.mjs)检查 1440／1920／2560px 视口下两页导航位置、字号、间距、下划线一致，以及工作流页签切换后 URL 保留对应 view。工作流页当前为「流程设计／结晶分析」；Header 名称和描述由当前 workflow 提供，切换工作面时不替换成页面说明。
