# Task 控制工作面交互设计输入

> 状态：已接受的设计输入，尚非实现规范  
> 最后更新：2026-09-07  
> 原型：[`assets/crystra-task-work-v7.html`](assets/crystra-task-work-v7.html)、[`assets/crystra-task-browser-v7.html`](assets/crystra-task-browser-v7.html)
> 精确元素索引：[`task-page-prototype-contract-index.zh-CN.md`](task-page-prototype-contract-index.zh-CN.md)

## 决策摘要

Crystra 的 Task 页面由三个稳定核心平面构成，并允许宿主提供一个正交的可选工具面：

1. `task-execution-summary` 汇总 Task Run 是否正常、当前活动、完成与剩余执行单元、阻塞、关注点、最近活动、累计时间和模型成本；
2. `input-stream` 是唯一的语义写入口，复用 DSH 的消息流、审批卡、工具卡、问卷和原生 composer；
3. `control-workspace` 是当前控制状态对应的只读 JSON IR 投影，不提供直接修改、批准、拒绝、暂停、重排等业务操作。

文件浏览、编辑和 Diff 不属于第四种控制状态，也不能成为第六个 Workbench。安装 Better Sidebar 时，DSH 可以在核心平面之外提供可收起的文件工具面；未安装时 Crystra 不显示文件入口，也不开发或注入自己的文件浏览器。

用户通过 Input 描述修改或作出决策。LLM 将自然语言解释为结构化变更提案；确定性的 schema、invariant 和 authority 检查决定提案能否成为权威 JSON IR；工作面随后重新投影。需要人工 authority 的决定仍通过 Input 中的原生审批交互完成。

## 全局 Shell、Task 与 Input 契约

三个原型页面共享同一套 Crystra Shell 语义；页面中的品牌、任务、设置与 Input 不能各自定义不同生命周期。

| `data-section-id` | 正式语义 | 契约 |
|---|---|---|
| `sidebar-logo-row` | 宿主侧栏顶部的品牌与折叠控制行 | 沿用 DSH 的视觉节奏：透明背景、无外层卡片、品牌入口与折叠按钮并列。不得用边框、阴影或大面积底色把整行画成 Banner 卡片。复用的是结构与 UX，不复制 DeepSeek 的商标资产。 |
| `surface-banner` | 从 Crystra 切换到 DSH Harness 主界面 | 品牌入口由宿主 Shell 完成切换，不新建 Task 或 Session；返回时尽可能恢复同一宿主 workspace 和当前 Task。当前静态 HTML 只呈现入口，尚未绑定宿主实现。入口直接承载 Crystra 标志和字标，不使用 `⇄` 等额外切换字符；可访问名称和 tooltip 明确说明目标是 DeepSeek Harness。 |
| `sidebar-brand-mark`、`sidebar-brand-name` | Crystra 的产品标志与字标 | 采用 24px 量级的自有晶体标志和紧凑字标，直接落在 sidebar 底色上；hover 只做轻量颜色反馈，不改变布局。品牌内容随当前产品表面变化，不能在 Crystra 表面继续显示 DeepSeek Harness 字标。 |
| `sidebar-toggle` | 收起或展开 sidebar | 与品牌入口是两个独立按钮；只改变宿主布局状态，不切换产品表面、不创建 Task/Session，也不影响当前 Task。使用与 DSH 一致语义的面板图标，并提供 `aria-label` 与 tooltip。 |
| `new-task-action` | 进入新建任务空白态 | 点击后切换到居中的 Hero Composer 并等待用户输入，不在既有 Task Header 中放置可编辑 Workspace 选择器。Task 与 host Session 何时持久化仍待 Task 生命周期设计确定，本契约不提前承诺。 |
| `host-settings` | 打开宿主统一设置 | Crystra 不提供第二套设置中心；插件设置作为 DSH settings 的命名空间或面板出现，并继承宿主身份、provider、model、权限和安全配置。 |
| `input-stream`、`conversation-feed` | 当前 Task 的连续输入与消息流 | 五个 Workbench、Plan/Wave 下钻、Gate 切换和上下文检查均不拆分 Session。消息可以带 subject identity，但历史仍属于同一 Task。 |
| `conversation-feed`、`control-workspace-scroll-region` | Input 与五个工作面的公共滚动区域 | 隐藏浏览器滚动条轨道和滑块，保留鼠标滚轮、触控板、键盘、触摸及程序滚动能力。规则只作用于两个公共滚动区域，不应无差别隐藏 Plan 文档、DAG、Context Inspector 等需要独立滚动反馈的嵌套视口。 |
| `composer` | 复用宿主原生 composer | 保留消息发送、附件、工具/审批/问卷卡和模型选择能力；Crystra 只增加 Task/Gate subject 等必要上下文，不复制 Chat 实现。 |
| `composer-add`、`composer-write-mode`、`composer-send` | 宿主 composer 的附件、authority scope 与发送入口 | 发送只产生 Input；`工作区写入`声明允许提出候选 patch，不代表跳过 schema、invariant 或 authority 校验。 |
| `input-approval-card`、`input-approval-publish-path`、`input-approval-reuse-abstraction`、`input-approval-submit` | Input 流中的原生审批组件示例 | 提交必须绑定当前 subject/revision，记录每项选择和用户 authority；过期卡片不得继续提交。示例问题不是固定产品字段。 |
| `attention-open-gates` | 从 Task 摘要进入需要关注的 Gate | 打开关口审核工作面，并展开按控制影响排序的未决 Gate 队列，不能仅滚动到一条可能过期的聊天消息。当前静态原型已演示这一页面级跳转；真实 Gate 数据仍来自运行时服务。 |
| `task-workbench-navigation`、`preview-surface-grilling`、`preview-surface-plan`、`preview-surface-execution`、`preview-surface-gate`、`preview-surface-delivery` | 五个工作面的持久导航 | 五个工作面是并列的只读投影视图，用户可任意调转访问；切换只改变右侧投影，不触发 Workflow transition、Task mutation 或 Session 切换。导航不得使用连线、箭头或“已完成步骤”暗示固定先后。 |
| `workbench-nav-grilling`、`workbench-nav-plan`、`workbench-nav-execution`、`workbench-nav-gate`、`workbench-nav-delivery` | 各工作面的导航项 | 同时承载该投影的可用性、更新或待关注摘要，但不能把这些摘要解释为唯一 Task 状态。`aria-current=page` 只表示用户当前查看状态。选中项沿用 Crystra 的圆角、亮色边框与轻量同色背景，不使用底部横线、方形 Tab 或与现有卡片体系冲突的选中样式。导航条不额外显示“任务工作面”等重复标题。 |
| `workbench-system-focus` | 导航项中的系统活动标记 | 用户当前查看状态与系统当前活动状态必须独立：选中项的亮色边框表示当前查看面，`workbench-system-focus` 只在系统实际活动所在的导航项内显示。系统可以正在执行而用户查看计划或交付；点击导航不改变系统活动。导航栏不再额外显示“系统正在执行 · 当前查看……”的文字摘要，因为它与这两种按钮状态重复。 |

### 新建任务空白态与 DSH Workspace Slot 复用契约

新建任务沿用 DSH 新会话的交互骨架：用户点击 `new-task-action` 后进入空白态，Composer 位于工作区中央；在 Task 尚未形成之前，用户可以直接在 Composer 中选择 Workspace 并描述要完成的工作。既有 Task 已经绑定 Workspace，因此其 `workspace-header` 不出现同类可编辑选择器，避免暗示运行中的 Task 可以随意换根目录。

这项复用以 Cordis Slot 为边界，而不是复制 DSH 菜单或导入其内部 React 组件：

- `new-task-hero-composer-placeholder` 对应 DSH `conversation.composer.bar`，正式实现使用 `variant="hero"`；Task 形成后继续使用同一宿主 Composer 的常驻形态，而不是维护第二份 Chat；
- `new-task-workspace-slot-placeholder` 对应 `conversation.hero.workspace`。Workspace 列表、选择状态和“添加工作区”入口由 `@deepseek-ai/dsh-client-ui-workspace` 提供，Crystra 不复刻其菜单与视觉行为；
- 新目录选择继续交给 `conversation.hero.workspace.directoryFlow`。该 Slot 由 DSH Workspace 插件接入原生目录选择或浏览目录流程；能力不存在时，宿主按自身契约隐藏对应的新增入口，Crystra 不提供残缺替代；
- Crystra 自定义 Shell 只负责保留这些 Slot 的挂载位置、传递宿主定义的 owner props，并把选择结果保存在新任务的暂存 UI state 中。不得依赖私有 `WorkspacePicker` 组件、内部 class name 或包内未导出的实现；
- Hero Composer 内的附件与发送按钮同样属于 DSH Composer。静态原型可以画出外观，但不为它们分配 Crystra `data-section-id`，也不在本设计中重复定义其交互契约；
- Workspace 菜单的内容与行为跟随 DSH 公共实现演进。当前产品意图是优先提供已有 Workspace，并允许通过新增入口打开系统 Folder Picker；是否单独形成“最近使用”分组，应由 DSH 的公开能力或后续适配契约决定，静态原型不把它伪装成已实现能力。

| `data-section-id` | 原型语义 | 正式实现边界 |
|---|---|---|
| `new-task-empty-state` | 新建任务的待输入表面 | 当前 HTML 只在点击“新建任务”后显示，并可通过选择任一现有 Task 返回。它不代表已经创建 Task 或 Session。 |
| `new-task-composer-seat` | 居中的新任务 Composer 布局位置 | Crystra 可以定义外层空间与居中位置；消息输入、附件、模型选择和发送行为仍由 DSH Composer 提供。 |
| `new-task-hero-composer-placeholder` | DSH Hero Composer 的静态挂载示意 | `data-provider="dsh-client-ui-conversation"` 与 `data-slot="conversation.composer.bar"` 只用于在 HTML 设计稿中标明所有权；不得把占位 DOM 当作生产实现。 |
| `new-task-workspace-slot-placeholder` | Composer 内的 Workspace Slot 假按钮 | `data-provider="dsh-client-ui-workspace"` 与 `data-slot="conversation.hero.workspace"` 标明正式提供方。按钮在原型中不展开假菜单；生产交互直接继承 DSH Workspace 插件。 |

Task 级路由至少携带 `task_id`；需要精确定位时继续携带 `plan_run_id`、`gate_id`、`wave_id`、`workflow_run_id` 或 `trace_root_id`。切换视图不得改变这些对象的权威状态。浏览状态、composer 草稿与 reply subject 属于 UI state，不得写入 Workflow 语义。

## 空间分配与 Better Sidebar 集成契约

### 空间模型

Crystra 不能只按物理屏幕比例维护几套独立页面。布局由浏览器当前可用宽度、Crystra Sidebar 状态、文件工具面是否打开，以及各核心平面的最小可读宽度共同决定。屏幕比例只用于验证典型场景：4:3 和普通笔记本窗口、16:9/16:10、21:9，以及 32:9。

页面最多同时存在四个表面：全局导航 Sidebar、`input-stream`、`control-workspace` 和 Better Sidebar 文件工具面。空间不足时的保留优先级是：

```text
Input + Control Bench > 全局导航 > 文件工具面
```

Input 与 Control Bench 构成 Crystra 的工作中闭环，必须尽量同屏；不能因为打开文件而把 Input 或当前控制投影切换到另一个页面。全局导航可以折叠，文件工具面可以改变停靠方向或关闭。布局决策使用可用宽度而不是只读 `aspect-ratio`，并至少保护以下最小宽度：Input 360px、Control Bench 680px、文件工具面 320px。

### 空间模式

| 模式 | 参考可用宽度 | 核心布局 | 文件工具面 |
|---|---:|---|---|
| 紧凑 | viewport 小于 1440px | 导航压缩，Input 与 Control 保持左右同屏 | 打开时停靠底部；不横向挤占 Control |
| 标准 | 1440–1919px | 导航 + Input + Control | 默认关闭；打开时停靠底部 |
| 宽屏 | 1920–2879px | Input 固定在适合对话的窄列，Control 弹性扩展 | 停靠右侧，宽度不低于 320px |
| 超宽 | 2880px 及以上 | Input、Control 和工具面形成稳定工作分区，避免把卡片无限拉宽 | 停靠右侧并允许 Better Sidebar 内部同时展开文件树与编辑器/Diff |

断点是原型验证值，不是永久产品常量。正式实现应以实际字体、locale、缩放级别和组件最小尺寸做容器级测量；浏览器窗口跨越断点时只改变表面位置，不卸载当前 Task、Session、Workbench、文件 Tab 或 composer 草稿。

不同空间模式的分栏宽度、Sidebar 展开状态、文件工具面位置和开关状态应分别保存。不得把 32:9 下的像素宽度直接恢复到 MacBook 或 4:3 窗口；同一模式内才恢复上次尺寸，跨模式使用该模式自己的偏好或安全默认值。

### 可选依赖边界

当前阶段把 Better Sidebar 作为可选依赖，不复制、fork 或重新实现其文件树、编辑器、预览器、Diff、Tab 和窗口管理能力：

- client half 检测到 `ctx.betterSidebar` 后，才显示 `better-sidebar-toggle`，并把 `better-sidebar-host-slot` 交给 Better Sidebar；
- 未安装、服务未激活或版本不满足能力要求时，`better-sidebar-toggle` 与整个文件工具面必须隐藏。Crystra 只保留 DSH 原生已有行为，不显示不可用按钮、安装诱导卡或残缺的内部替代品；
- Crystra 通过公开服务调用 `openFile({ sessionId, cwd }, path)` 或等价能力打开精确文件，不导入 Better Sidebar 内部 React 组件；
- 文件上下文绑定 `sessionId + cwd`。Task 横跨多个 Wave/worktree 时，调用方必须传入目标产物所属的权威 cwd，不能用裸路径或“当前最近 worktree”猜测；
- Control Bench 中的 Plan 原文、证据和产物链接可以委托同一适配层打开文件，但文件内容始终出现在独立工具面，不临时替换 `control-workspace`；
- Better Sidebar 的 `@文件` 引用可以进入原生 Input composer。它只是引用输入材料，不形成 Workbench 内的第二条语义写路径；
- Crystra 内部只维护能力探测与 `ResourceSurfaceAdapter` 一类薄适配边界。未来只有在出现明确、可验证而 Better Sidebar 无法满足的用户需求后，才重新评估自有文件能力。

### 原型元素对照

| `data-section-id` | 语义 | 原型与正式实现边界 |
|---|---|---|
| `task-layout-region` | Input 与 Control Bench 的核心空间 | 标准模式保持现有比例；宽屏和超宽模式限制 Input 的增长，把额外空间优先交给 Control。 |
| `better-sidebar-edge-handle` | 文件工具面的贴边唤出热区 | 仅在发现 Better Sidebar 能力时存在。标准与紧凑空间贴底，宽屏与超宽空间贴右；鼠标指针进入热区后显露完整按钮。触摸设备第一次点击只把细柄展开为完整按钮，第二次点击才打开临时工具面，避免贴边小目标误触。工具面打开后，Handle 随工具面边界移动。 |
| `better-sidebar-toggle`、`better-sidebar-handle-icon` | 已发现 Better Sidebar 能力时的打开/关闭入口 | 常态只露出半透明贴边 Handle，不占用 Sidebar Header 或任何 Workbench。鼠标 hover、键盘 focus 或触摸预备态显示完整按钮；能力不存在时连同热区一起隐藏。当前 HTML 用 `?better_sidebar=1` 模拟服务已发现，仅供设计稿切换。 |
| `better-sidebar-surface` | DSH Better Sidebar 提供的正交工具面 | `data-provider="dsh-better-sidebar"` 表明所有权；停靠位置由空间协调器决定，不属于五个 Workbench。 |
| `better-sidebar-host-slot` | Better Sidebar 的宿主挂载位置 | HTML 内的文件树与预览只是第三方表面占位示意，不构成 Crystra 文件浏览器实现。正式产品由插件渲染。 |
| `better-sidebar-close` | 收起工具面 | 只改变布局偏好；不关闭 Task、Session、Workbench 或已打开文件的权威对象。 |

原型使用查询参数模拟能力，是因为静态 HTML 不存在 Cordis context；正式实现不得依赖 URL 参数判断插件安装状态。空间协调器应统一决定右侧、底部和隐藏状态，不能让 Crystra 与 Better Sidebar 分别监听断点后各自修改同一布局。

## Sidebar 信息架构与任务目录契约

Sidebar 不是 Task 状态机，也不再人为拆分“活跃任务”和“不活跃任务”。它提供一份紧凑的统一 Task 列表，负责识别 Task、切换 Task、快速看出运行状态与需要人工关注的数量；Goal、Plan、Delivery、Wave、Trace 和成本等详细判断仍进入对应 Workbench。

这里的“活跃”是 Task 是否仍需推进，不是执行器此刻是否占用算力。运行中、待审核、失败停止都属于活跃，因为它们仍需要系统或用户采取下一步；只有当前工作全部完成，或者用户明确放弃该 Task，才属于非活跃。因而“活跃任务”过滤不能隐藏待审核和失败项，否则会反向屏蔽最需要注意的工作。

Sidebar 的一级信息架构只有“任务”“工作流”“分析”。Crystra 当前不提供“资源库”：文件浏览由可选的 Better Sidebar 工具面承担；没有该能力时不显示文件入口。“工作流”不是只有一个入口的“构建”导航，而是当前 Task 所引用 Workflow definition 的快速列表；“分析”也不是 Task 列表的翻版，而是面向单 Task 与跨 Task 观察的二级导航。

### Section、折叠与高度分配

任务、工作流和分析是三个独立的可折叠 Section，但不是传统的互斥 Accordion。用户可以同时展开多个 Section；折叠或展开其中一个不得自动改变另外两个，也不得改变当前 Task、Workflow 运行或路由。Section Header 只负责折叠，不能同时充当页面导航；折叠只是 Sidebar 的 UI state。

Sidebar 不为三个 Section 预先分配固定高度，也不强制等高。顶部品牌与“新建任务”保持稳定；每个 Section Header 使用同一紧凑高度；工作流和分析按少量条目取得自然高度；展开的任务 Section 获得其余可用高度，其中 `task-list` 独立滚动。任务折叠后释放弹性空间，但底部 Footer 不得因此上移。工作流和分析在 Sidebar 内只承载当前上下文与高频二级入口，大型数据集进入对应完整页面，避免形成多个相互竞争的嵌套滚动区。

三个 Section Header 在展开与折叠状态下都必须具有整行一致的视觉命中面：鼠标悬停标题或空白区域时，完整 Header 高亮，不能只高亮文字宽度或在标题与右侧工具之间留下无反馈区域。任务 Header 中的搜索和视图选项是独立命中区；悬停这些按钮时必须抑制父 Header 的整行高亮，只显示当前按钮自身的 hover 反馈。点击工具也不得冒泡为折叠操作。工作流和分析没有 Header 工具，因此其折叠按钮直接占满整行。

任务 Section 展开时，标题行同时承载搜索与视图选项。任务折叠时，这些上下文工具没有作用，必须连同列表和“查看所有任务”一起隐藏；Header 只保留折叠箭头、“任务”和聚合注意力徽标。折叠任务时若搜索或视图菜单正处于打开状态，必须关闭二者、清空临时搜索并恢复完整列表；排序和过滤选择继续作为 UI 偏好保留，重新展开后仍然生效。

任务区沿用 DSH 的紧凑组织方式：搜索是标题行内按需展开的图标能力，排序和过滤收进“视图选项”下拉菜单。搜索采用同一槽位互斥替换：常态显示“任务”及搜索、视图按钮，搜索态由全宽圆角搜索框直接占用这条按钮行，同时隐藏标题与其他按钮；不得在其下方插入第二行搜索框。任务列表占据剩余高度并允许滚动；长标题必须单行省略，禁止因为状态胶囊或标题换行把一个普通 Task 撑成两到三行。

默认采用创建时间倒序，即 FILO，最新创建的 Task 位于最前。用户也可以切换为按活跃度排序，即事件冒泡：最近发生有效 Task 事件的条目移到最前。创建时间排序不会因为新消息改变位置；活跃度排序不会改写 Task 的创建时间或业务状态。

| `data-section-id` | Sidebar 维度 | 行为与边界 |
|---|---|---|
| `task-working-set` | 弹性的任务 Section | 展开时取得其他固定区域和自然高度区域之外的剩余空间；折叠时退化为 Header 自然高度。`data-expanded` 只表示 sidebar 展开状态，不是 Task 活跃性。 |
| `task-section-header`、`task-section-toggle`、`task-section-chevron`、`task-section-label` | Task 目录标题行与折叠入口 | 点击箭头、标题或标题区剩余空白切换展开状态。标题按钮在展开和折叠时都填满右侧上下文工具以外的所有空间，使 Header hover 是连续整行。展开时显示搜索和视图工具；折叠时工具消失。搜索和视图按钮自身不得触发 Section 折叠；hover 工具时也不得连带高亮整个 Header。折叠图标只改变视觉方向，不表示 Workflow transition。 |
| `task-section-attention-badge` | 折叠态注意力摘要 | 任务折叠时显示所有可见 Task 的未解决人工关注事项聚合数量，使收起列表不会隐藏风险；展开时隐藏，避免和 Task 行徽标重复。它不是工具按钮，也不能独立修改 Gate。 |
| `task-section-content` | Task Section 内容边界 | 包含任务列表和“查看所有任务”。随 Task Section 一起显示或隐藏；折叠不卸载 Task 数据，不改变当前选择。 |
| `task-search-control`、`task-search-action`、`task-search-input`、`task-search-clear` | 原位搜索 | 点击搜索图标后，`task-search-control` 在 `task-section-header` 的原位置扩展到整行，输入框获得焦点，`task-section-toggle` 与 `task-section-actions` 同时隐藏；不是在 header 下新增 panel。点击左侧搜索按钮、右侧“关闭搜索”按钮或按 `Escape`，均清空查询、恢复完整列表并退出搜索态；点击搜索框以外的区域也执行相同折叠行为。搜索框内部的点击和输入不触发折叠。搜索只过滤当前 Task 列表，不改变排序、运行状态或权威数据。 |
| `task-view-options-action`、`task-view-options-menu` | 排序与过滤菜单 | 点击图标打开下拉菜单；再次点击或点击菜单外关闭。菜单选择是可恢复的 UI 偏好，不写入 Workflow、Task 或 Session。 |
| `task-sort-created` | 按创建时间排序 | 默认项；按不可变的 `created_at` 倒序排列，即 FILO。 |
| `task-sort-activity` | 按活跃度排序 | 按最新有效 Task 事件的时间倒序排列，即事件冒泡。有效事件应是用户可感知的 Input、控制状态变化、Gate、失败或 Delivery 更新，而不是低层 Trace 噪声。 |
| `task-filter-all`、`task-filter-active` | Task 过滤 | 默认显示“全部”；“活跃任务”保留运行中、待审核、失败停止等仍需推进的 Task，只排除全部完成和用户明确放弃的 Task。过滤与搜索可以叠加。 |
| `task-list` | 统一 Task 列表 | 占据 sidebar 剩余高度，允许纵向滚动并隐藏滚动条；不再出现活跃/不活跃分组、独立注意力收件箱或历史数量卡片。 |
| `task-current`、`task-running`、`task-failed`、`task-complete` | 单行 Task 示例 | 每行固定为状态圆点、单行省略标题、可选的相对时间和注意力徽标。点击整行恢复该 Task 的 Input、上次查看的 Workbench、composer 草稿、reply subject 与浏览状态；不得启动 Workflow 或创建 Delivery。 |
| `task-current-status`、`task-running-status`、`task-failed-status`、`task-complete-status` | 状态圆点 | 圆点占用原图标位置：蓝色表示运行中，黄色表示需要审查，红色表示失败停止，绿色表示当前 Task 的工作已全部完成。圆点是当前状态投影，不意味着 Task 永久关闭；状态变化后可重新投影。若多个条件同时存在，按失败停止、需要审查、运行中、全部完成的优先级显示。 |
| `task-current-attention-badge`、`task-failed-attention-badge` | 注意力徽标 | 只显示需要用户关注的未解决事项数量；不把“运行中”“需要审查”“当前可交付”等文字胶囊塞进 Task 行。徽标不是可独立点击的工作面导航。 |
| `all-tasks-action` | 完整 Task Browser 入口 | 作为 Task 列表的最后一项随列表滚动；打开完整 Task Browser，承载大规模历史的搜索、组合过滤、排序、分页或虚拟化。 |
| `workflow-navigation`、`workflow-section-header`、`workflow-section-toggle`、`workflow-section-chevron`、`workflow-section-label`、`workflow-section-content` | 工作流 Section | Header 整行只负责独立展开或折叠，不直接跳转。展开内容列出当前 Task 引用的 Workflow definition；点击条目携带 definition identity、revision 与来源 Task 进入 Workflow Studio，不改变当前 Task 的执行状态。 |
| `workflow-current-list`、`all-workflows-action` | 当前 Workflow 列表与完整入口 | 列表只展示当前 Task 的少量相关 Workflow 和 revision，不在 Sidebar 中复制完整 Workflow Browser；“查看所有工作流”进入 Workflow Studio 的完整列表。单个 Workflow 是运行数据实例，不分配 `data-section-id`；行使用 `data-workflow-definition-id` 携带领域身份，链接同时携带精确 revision 与来源 Task。Workflow Studio 使用相同属性作为定位锚点。 |
| `analysis-navigation`、`analysis-section-header`、`analysis-section-toggle`、`analysis-section-chevron`、`analysis-section-label`、`analysis-section-content` | 分析 Section | Header 整行只负责独立展开或折叠，不直接跳转。分析是聚合观察面，不按 Task 复制一份列表。 |
| `analysis-secondary-navigation`、`analysis-dashboard-action`、`analysis-traces-action`、`analysis-audit-action`、`analysis-compare-action` | 分析二级导航 | 提供总览、轨迹、审计与运行比较等稳定入口；入口可以接收当前 Task/Run 上下文作为初始过滤条件，但分析页面仍允许跨 Task 聚合和切换范围。徽标只提示该分析入口存在待关注信息。 |
| `sidebar-footer`、`host-settings` | 固定 Sidebar Footer | Footer 位于 sidebar 最底部且不参与 Section 高度分配；divider 属于 Footer 的顶部边界，设置按钮位于 Footer 内部。任何 Section 的展开、折叠或列表滚动都不得移动 Footer 或 divider。设置继续打开宿主统一设置。 |

Task Browser 可以使用 workspace/repository、最近活动、关注数量、当前可交付状态、Workflow、创建时间和成本作为检索维度，但这些维度不得全部常驻 sidebar。Sidebar Task 行也不显示 Delivery/Wave/Agent/worktree 数量、Session/Trace/Run identity、详细完成率、成本或文件路径。

## 跨一级页面的协作边界

Task Browser、Workflow Explorer 和 Workflow Studio 是独立一级页面，不是 `task-control-workbenches` 内部的工作面。本文件只约束 Task 页发出的入口及返回 Task 时需要保留的上下文，不审核这些独立页面内部的布局和交互：

- `all-tasks-action` 进入独立 Task Browser；详细 memo 见 [`task-browser-design-memo.zh-CN.md`](task-browser-design-memo.zh-CN.md)；
- `all-workflows-action` 与单个 Workflow definition 进入 Workflow 页面；详细 memo 见 [`workflow-pages-design-memo.zh-CN.md`](workflow-pages-design-memo.zh-CN.md)；
- 静态 HTML 设计稿只需展示布局、配色关系和部分页面级交互。点击 Sidebar 中另一 Task 后恢复其真实 Input、Workbench 与草稿，需要宿主路由和后台状态服务支持，明确列为原型审计豁免；不得因此在静态稿里伪造上下文切换；
- Task Explorer 与 Workflow Explorer 可能共享查询、过滤、排序、分页/虚拟化、选中与返回状态恢复的浏览内核。该复用只记录为联合讨论项，在两个页面完成交互设计前不提前确定组件 API 或数据模型。

## 为什么采用单一写入口

- 避免 Chat 与表单分别维护一套写语义，造成行为和数据模型漂移；
- 保持 Workbench 是事实与控制状态的投影，而不是第二套业务应用；
- 让自然语言修改、结构化 patch、校验结果和最终 IR 变化形成一条可审计链路；
- 降低早期 UI 开发成本，把直接操作控件推迟到行为已经稳定之后；
- 为观察高频语义变换并将其结晶成代码提供统一观测点。

## 控制工作面分类

五个工作面是五类稳定的人类认知任务，不是强制线性的 Workflow 阶段。Task 可以因冲突、返工或重新定义而重复进入同一工作面。

| 控制状态 | Workbench | JSON IR 投影重点 | 人的工作 |
|---|---|---|---|
| 开始定义 | `grilling-workbench` | 问题全局、问题域覆盖、Live Brief、争议与决定、退出条件 | 对齐意图，纠正 Agent 揣测，掌握剩余问题 |
| 计划形成 | `plan-workbench` | Goal/Scope、Wave、DAG 投影、风险、冲突、验证策略、授权与恢复边界 | 审查达成目标的大概路径是否成立 |
| 自治执行 | `execution-workbench` | 当前产出、异常、偏离、阻塞影响、下一个控制边界 | 默认不操作，只处理关注点 |
| Gate 审核 | `gate-review-workbench` | Subject、迁移、required claims、evidence、矛盾、verdict、authority | 接受、拒绝或要求修改 |
| 交付状态 | `delivery-workbench` | 当前可交付状态、当前候选产物、验收覆盖、残余风险、成本和人工注意力 | 判断当前结果是否足够，或通过 Input 追加目标和要求 Replan |

五个工作面不是 Task 状态机的五个互斥节点，也不锁定先后顺序。系统可根据关注点建议或默认打开某个工作面，但用户始终可以自由切换；系统当前活动位置通过独立状态提示表达，不能借用选中导航项表达。

## Grilling 的特别要求

Grilling Workbench 的目标不是重复显示对话，而是给用户全局掌控感：

- 初始规划、已解决、待回答、条件问题和回答后新增问题必须分开计数；
- 新增问题必须说明来源和必要性，不能让问题数量无解释地增长；
- Live Brief 必须随讨论增量更新，不能在结尾重新对整个聊天做一次有损摘要；
- 每项争论必须进入“已采纳、明确排除、仍有争议、尚未解决”之一，不能无声消失；
- 用户应能看到退出 Grilling 尚缺少哪些信息，以及当前问题预算。

### Grilling Workbench 交互契约

`grilling-workbench`、`grilling-overview`、`grilling-question-map`、`grilling-live-brief` 与 `grilling-brief-changes` 都是当前 Grilling IR 的只读投影：

- `grilling-overview` 固定呈现当前轮次、初始问题、已解决、待回答、条件问题、剩余主题与问题预算；新增问题必须改变相应计数并说明来源。
- `grilling-question-map` 展示问题域覆盖和新增原因，不在右侧直接回答、删除、跳过或重排问题。
- `grilling-live-brief` 只保留当前仍有效的目标、约束、排除项、未解决项和缺失项；不是聊天摘要，也不能把 AI 推测冒充用户确认。
- `grilling-brief-changes` 显示本轮相对上一权威版本的新增、删除与冲突，使用户能发现讨论导致的语义漂移。
- 回答问题、质疑假设、修订 Brief 和确认退出 Grilling 全部通过 `input-stream`；正式实现可以让只读项定位到来源消息，但不能在 Workbench 内形成第二条写路径。

## Task 执行摘要口径

`task-execution-summary` 只描述 Task Run，不混入 Goal、Wave 或交付契约的完成率：

- `run-health`：是否持续产生进展，是否停滞或失败；
- `current-activity`：当前执行前沿正在处理什么；
- `execution-counts`：已完成与当前剩余执行单元，剩余再分为运行、排队和阻塞三个互斥子集；
- `attention-summary`：是否需要用户关注，以及处理后解除什么影响；
- `latest-activity`：最近一项可理解的活动及距今时间；
- `run-consumption`：Task 累计墙钟时间与模型成本。

循环重试的历史 attempt 进入 trace，不重复增加逻辑工作单元数量。动态展开新分支时，“当前剩余”允许增加。

## Workbench 卡片设计原则

Workbench 是给人快速判断“是否可以授权继续”的**审核封面**，不是把面向机器的 Plan、JSON IR 或执行记录逐字段卡片化。其信息层级遵循以下原则：

- 先回答当前控制状态下最关键的授权问题，例如计划路径是否可信、证据是否足以支持验收；
- 正常项聚合，只显示数量、结论和健康状态，避免用大量“全部正常”的卡片消耗注意力；
- 异常项展开，明确呈现缺口、冲突、风险、偏离以及它们对授权或后续执行的影响；
- 展示 Goal、完成标准、近似执行路径、控制边界、证明准备度与权威上下文等人类判断所需的最小集合，而不是复刻完整文档；
- DAG 是计划路径的投影，可以有并行、汇合、条件分支和恢复循环，不应被压成固定的线性阶段；
- Workbench 保持只读；修改意见、授权与纠偏仍从 `input-stream` 进入；
- 提供“查看完整原文”的只读入口。展开后，原文可以临时占满右侧 `control-workspace`，但不能遮蔽左侧 Input，也不能由此形成第二条语义写路径；
- 卡片划分服从人的判断任务，不服从底层 schema 的字段数量。只有当两组信息需要被独立扫描、比较或突出异常时，才拆成不同卡片。

### Plan 的两级 DAG 投影

Plan Workbench 对 DAG 采用两级 DAG 投影，避免把可能很大的完整图压缩成不可读的缩略图：

1. 摘要卡片只投影主干拓扑，保留 Goal、Wave、关键并行与汇合点、恢复循环、Gate 和异常分支；普通节点可以按 Wave 或子图聚合。卡片同时给出 Wave 数、并行分支数、恢复循环数和关注点数量。
2. 点击摘要卡片中的“查看完整 DAG”后，打开完整 Plan 并直接定位到 DAG 章节。完整 DAG 占满右侧 `control-workspace`，左侧 `input-stream` 保持可见。

完整 DAG 章节至少提供以下只读探索能力：

- 缩放、拖动画布、适应窗口以及小地图；
- 按节点名称或标识搜索，并将匹配节点带入视野；
- 按 Wave、并行分支或子图折叠和展开；
- 点击节点查看 Goal、进入与退出条件、依赖、风险、证据摘要和当前状态；
- 返回完整 Plan 的其他章节，或直接返回 Plan 摘要。

缩放、平移、搜索、折叠和查看节点详情属于**图形浏览操作**，可以直接发生在 Workbench；它们不改变权威 JSON IR。新增或删除节点、修改依赖、重排执行语义、改变 Gate 或恢复路径仍必须通过 `input-stream`，由 LLM 形成受校验的 IR 变更提案。视图位置与缩放比例最多作为用户偏好保存，不能回写为 Workflow 语义。

`plan-overview` 负责进入完整 Plan；`plan-dag-projection` 负责直接进入完整 Plan 的 DAG 章节。两者是同一个文档查看器的不同落点，不应实现为两个互不关联的页面。

### Plan Workbench 交互契约

| `data-section-id` | 行为 | 权威状态边界 |
|---|---|---|
| `plan-document-entry` | 从 `plan-overview` 打开当前精确 revision 的完整 Plan 首页 | 只读；返回 `plan-summary` 时恢复摘要视图。 |
| `plan-dag-entry` | 从 `plan-dag-projection` 直接打开同一 Plan 的 DAG 章节 | 不创建第二份 Plan，也不重新生成图。 |
| `plan-document-dag-chapter-entry` | 从完整 Plan 正文跳到 DAG 章节 | 保留文档 revision、来源和返回位置。 |
| `plan-document-back` | 返回 Plan 摘要；若由 Gate 证据进入，则返回 `from_gate_id` | 不依赖浏览器历史猜测来源。 |
| `plan-dag-document-back` | 从完整 DAG 返回同一 Plan 正文 | 保留缩放、平移、折叠和搜索状态；当前示意稿尚未持久化这些 UI state。 |
| `plan-dag-search` | 按节点名称或稳定标识查找并高亮匹配节点 | 不修改节点；无匹配时显示空结果，不能自动选择近似节点。 |
| `plan-dag-collapse-branches` | 折叠/展开普通分支 | 仅改变细节层级；主干、Gate、异常与恢复关系不得被折叠到无法判断。 |
| `plan-dag-zoom-out`、`plan-dag-zoom-in`、`plan-dag-fit-view` | 缩放及适应视口 | 只写 UI state；适应视口必须覆盖当前过滤后可见图，而非强制重置语义筛选。 |
| `plan-dag-viewport`、`plan-dag-canvas` | 拖拽平移并承载专用布局引擎输出 | 不允许拖拽节点改变拓扑。点击节点只更新 `plan-dag-node-details`。 |

Plan Workbench 不提供新增节点、删除节点、连线、改写退出条件、批准计划或直接执行等业务按钮。用户从 Input 描述意图后，LLM 生成受 schema、invariant 和 authority 校验的 Plan IR patch，右侧再投影新 revision。

### Execution 的两级运行投影

Plan 给出达成 Goal 的高层执行结构，节点通常是 Wave、Gate 或关键里程碑；Workflow 则是某个 Wave 的具体处理方法。Execution Workbench 因此必须提供两个运行层级，而不能从 Plan 摘要直接跳到 Workflow 内部节点：

1. **Plan Run（默认层）**：复用已批准 Plan 的 DAG 拓扑，叠加每个 Wave/Gate 的实际状态、当前执行前沿、阻塞、异常、耗时和成本。用户进入执行面时首先看到这一层，以回答“整个 Task 走到哪里、哪条分支正在工作”。
2. **Wave Run（下钻层）**：用户选择某个 Wave 后，显示该 Wave 引用的执行方法及其实例化的 Workflow Run。这里才展示活动节点、条件判断、恢复循环、当前产出和可观测信号，以回答“这个 Wave 正在怎样完成”。

两层之间使用稳定身份链 `Plan Node → Wave → Workflow Run`。Wave 状态由其退出条件及关联 Workflow Run 汇总而来，不能把 Workflow 内部节点百分比直接冒充 Plan 完成度。一个 Workflow 定义可以被多个 Wave 或多次运行复用，但每次下钻必须绑定精确的 Wave 与 Run identity，trace、证据、成本和异常也沿该链归属。

交互约束：

- `execution-plan-run-overview` 是执行面的默认内容；选择可下钻的 Wave 后，以 `execution-wave-run-detail` 替换右侧控制工作区内容；
- 下钻页提供 `计划执行 / Wave / 工作流运行` 面包屑和返回入口，返回后保留 Plan Run 的视口、选中 Wave 与筛选状态；
- 尚未产生关联 Workflow Run 的 Plan 节点仍可查看 Wave 摘要，但必须标为“未开始”或“阻塞”，不能伪造内部活动图；
- Wave 内部 Workflow 的重试只形成该 Wave 的 attempt 历史；只有退出条件变化才推动 Plan Run 的 Wave 状态迁移；
- 左侧 `input-stream` 始终属于同一个 Crystra Task/Session。层级切换只改变右侧投影和当前 subject，不新建会话，也不割裂用户指令上下文；
- Analysis & Audit 可以沿同一身份链从 Plan Run 下钻到 Wave Run 和 span，但不与 Execution 共用默认信息密度。

#### Wave Run 元数据卡

进入具体 Wave 的 Workflow Run 后，面包屑只负责导航，不能作为 Analysis 的关联依据。`execution-wave-run-metadata` 保存本次执行的不可变关联键，使用户能够把 Execution 中看到的状态与 Analysis & Audit 中的 trace、证据和异常精确对应；但这些字段不是正常监控时需要持续阅读的内容，因此不占据顶部固定信息位。

元数据卡只有能稳定定位 Execution、Analysis 或 Audit 中同一对象的字段才允许进入。最小字段包括：

- `plan_run_id`：本次 Task 采用的 Plan Run；
- `wave_id`：产生本次工作的 Plan 节点和 Wave 身份；
- `workflow_definition_id` 与版本：说明使用的是哪一版处理方法；
- `workflow_run_id`：该方法在本 Wave 下的具体运行实例；
- `trace_root_id`：Analysis 中所有 span、事件和证据的 Trace Root。

`attempt`、允许重试上限、当前状态、启动时间和耗时都不属于身份；它们进入 Workflow Run 状态、trace 或可观测指标，不进入元数据卡。

这些字段是关联数据，不是可编辑设置。Analysis 记录必须直接携带该组键或携带可确定解析到它们的外键，禁止依赖 Wave 标题、Workflow 显示名、开始时间等易变文案做模糊匹配。普通 retry 只增加 `attempt`，保持 `workflow_run_id` 与 `trace_root_id` 不变；如果控制层终止旧实例并创建新的 Workflow Run，则生成新的 Run 和 Trace Root，同时继续关联原 `plan_run_id` 与 `wave_id`。

元数据卡只放身份与 provenance，不放速度、成本、错误数等运行指标；后者继续由可观测信号条和 Dashboard 展示，以免身份卡随着执行变化而失去稳定锚点。

交互方式：

- Wave Run 工具栏提供低显著性的“运行身份”入口，元数据卡默认折叠；用户展开时以临时浮层呈现，不推挤活动图，也不成为日常视觉焦点；
- 每个元数据字段值右侧提供独立的复制图标，复制原始值，便于用户把 `trace_root_id`、`workflow_run_id` 或 `wave_id` 直接粘贴进查询框、日志工具或问题记录；成功后图标短暂变为确认态；
- 不提供整包 JSON 复制：它增加了用户从对象中再次提取查询键的步骤，并不能直接服务单字段定位。完整组合定位由“在分析中查看”的深链接负责；
- 工具栏同时提供“在分析中查看”。跳转必须携带精确身份组，Analysis 落地后显示“来自 Execution”的当前过滤范围，并使用该身份直接选择对应 Wave Run 和 Trace Root；
- Analysis 不得在参数缺失或身份不存在时静默回退到“最近一次运行”。正式实现应显示无法定位的状态并允许返回 Execution，避免用户在错误的 Run 上做出判断；
- 展开元数据、复制和跳转 Analysis 都属于浏览与导航操作，不改变 Workflow 或 Plan 的权威状态。

### Execution Dashboard 的运行态视觉语法

Execution Workbench 投影的是**当前 Workflow Run**，不是 Agent、subagent 或 worktree 的内部组织方式。它要让用户一眼判断实际走过哪条路径、执行前沿在哪里、哪些分支异常、下一控制边界是什么；完整事件和因果关系仍进入 Analysis & Audit。

- 运行图采用活动图式的直线和 90 度正交折线，不使用曲线。条件节点使用菱形，并在出边上标注 guard；恢复循环必须明确返回实际重试节点，不能用装饰性回环暗示不存在的控制关系。
- 图例和连线必须区分成功、运行中、失败、暂停和判断。成功为稳定绿色；运行中为蓝色；失败为红色；暂停为灰色虚线；异常节点可以使用红色呼吸提示。
- 状态连线始终保留稳定的实线或虚线底层。动态效果是沿线段移动的“光源扫过”，由宽而弱的光晕、较窄的光尾和亮点光头组成，而不是散落粒子或整条线闪烁。
- 动效一次只突出当前执行前沿。默认遵守有限动效、确定性几何、语义色和渐进披露：用户关闭动态效果或系统要求 reduced motion 后，颜色、线型、文字和图例仍必须独立表达全部状态。
- `execution-observability-slots` 是可观测组件提醒槽位。组件提供已计算的事实和基线，视图只映射声明过的语义状态，不自行推断原因。例如低于前 5 轮中位数时，当前路径和进度转为黄色且扫光减慢；高于基线时转为蓝色且扫光加快；节点报错时显示红色呼吸提示。
- 没有可信基线、样本不足或插件未声明映射时，视图保持普通运行态，不制造“快”“慢”或“异常”的结论。扩展组件不得覆盖 Workflow 的权威状态，只能增加提醒层。
- 运行图和右侧当前节点面板都是只读投影。Workflow 变更、恢复策略和用户授权仍从 `input-stream` 进入，不能因为图形化展示而形成第二条写路径。

上述视觉规则吸收 Archify 的语义色、确定性几何、单一动效所有者和渐进披露原则，但运行状态、guard 与循环来自 Crystra 的 Workflow Run；二者不共享领域语义。

#### 正式实现必须采用专用图布局引擎

当前 HTML 中手写的 SVG 只是用于确认信息、状态和动效方向的**语义示意稿**，不是视觉质量或自动布局的实现基准。正式产品不得继续用固定坐标、简单分层或自写的低能力排列算法生成 Workflow 图；需要选择能够处理有向图、条件分支、汇合、循环、端口约束和正交路由的专用图布局引擎。具体引擎通过独立技术 spike 评估后确定。

布局的目标函数必须按以下顺序处理，不能只追求节点“排得开”：

1. **控制关系正确**：回边必须落到真正的恢复目标，条件出边必须与对应 guard 和端口绑定；
2. **主路径清晰**：主成功路径优先保持短、直、连续，异常与暂停分支不能把主路径挤成绕行；
3. **循环代价优先**：降低回边总长度、折点数和跨层距离。存在循环时，恢复目标、判断节点和重试路径的相对位置必须共同求解，不能先排节点再让连线绕外圈补救；
4. **减少干扰**：依次减少穿越节点、边交叉、边重叠和无意义留白，并为平行线保留可辨识间距；
5. **语义排序**：分支顺序由主路径、异常类型、恢复关系和用户关注度决定，不能简单按状态颜色或节点创建顺序排列；
6. **布局稳定性**：运行状态变化或新增少量节点时，未受影响的节点应尽量留在原位，避免整张图跳动破坏用户的空间记忆；
7. **视口适配**：同一图应能在摘要卡、完整 Workflow 和运行态 Dashboard 中使用不同细节层级，而不是把完整图等比缩小。

引擎验收至少覆盖：无节点重叠、连线不穿节点、端口方向正确、主路径可追踪、循环局部化、同图重复布局确定、增量更新位移受限，以及大图下的计算耗时。UI 层只消费引擎输出的节点坐标和正交路由；状态颜色、扫光和呼吸提示作为独立渲染层叠加，不得反向影响拓扑布局。

## Execution 页面交互契约与元素对照

本节把上述设计原则落实到当前 HTML 原型。下文所称的元素 ID 均指 `data-section-id`，不是原生 DOM `id`，也不是 Plan、Wave、Workflow Run 等领域对象的身份字段。`data-section-id` 是设计讨论、自动化测试和实现验收使用的稳定定位符；领域身份必须来自对应 JSON IR 或运行记录，不能从 DOM 标记推断。

### 页面级边界

| `data-section-id` | 职责 | 交互与约束 |
|---|---|---|
| `task-execution-summary` | 汇总整个 Task Run 的健康度、当前活动、完成/剩余/阻塞、关注点、最近活动、总耗时和成本 | 始终是 Task 级摘要，不显示某个 Wave 或 Workflow 节点的局部百分比；与下方执行图信息互补，不重复充当 Workflow Dashboard。 |
| `input-stream` | 当前 Crystra Task/Session 的唯一语义写入口 | Plan Run 与 Wave Run 切换时不重建 Session；修改计划、纠偏、恢复、授权等命令仍从这里进入。 |
| `control-workspace` | 五种控制工作面的右侧只读投影容器 | Execution 内容切换只发生在容器内部；右边界与 `task-execution-summary` 对齐。 |
| `execution-workbench` | Execution 工作面根节点 | 承载 Plan Run 与 Wave Run 两级投影；不提供直接编辑 Workflow 的操作。 |

### Plan Run 默认层

| `data-section-id` | 投影内容 | 交互与状态规则 |
|---|---|---|
| `execution-plan-run-overview` | 用户进入 Execution 时默认可见的 Plan Run 总览 | Wave 下钻后隐藏，由 `execution-wave-run-detail` 替换；返回时恢复原视口、选择和筛选，而不是重新初始化。 |
| `execution-plan-run-header` | 当前 Plan 版本、运行身份和总体状态 | 只显示人能快速判断任务路径所需的摘要；完整 Plan 仍从 Plan Workbench 查看。 |
| `execution-plan-run-summary` | 已完成、运行中、未开始、阻塞等 Plan 节点聚合 | 统计对象是 Wave、Gate 或计划里程碑，不把 Workflow 内部节点或 retry attempt 计为新的 Plan 工作单元。“未开始”表示依赖尚未满足或尚未被调度，不暗示存在一个运行中的等待边。 |
| `execution-plan-run-map`、`execution-plan-run-canvas` | 已批准 Plan DAG 的运行态投影及其画布 | 拓扑来自 Plan，运行状态来自 Plan Run；完整实现使用专用图布局引擎，并为大图提供缩放、平移与适应视口。 |
| `execution-plan-node-goal`、`execution-plan-wave-0`、`execution-plan-wave-1a`、`execution-plan-wave-1b`、`execution-plan-wave-2`、`execution-plan-gate` | 示例中的 Goal、Wave 与 Gate 节点 | 只有存在可定位 Workflow Run 的 Wave 才能进入完整 Wave Run；当前原型以 `execution-plan-wave-1b` 演示鼠标点击以及 Enter/Space 键下钻，正式实现应把同一契约应用到所有可下钻 Wave。 |
| `execution-plan-edge-arrows`、`execution-plan-frontier` | Plan 关系方向和当前执行前沿 | 前沿必须由实际可执行/运行节点计算，不能等同于视觉上最靠右的节点。 |
| `execution-plan-wave-outcome` | 当前或最近 Wave 的人类可读结果摘要 | 只给关键结果和异常入口，不复制完整日志、trace 或 Workflow 节点清单。 |

若 Wave 尚未产生 `workflow_run_id`，可以展开 Wave 摘要，但必须显示“尚无运行实例”，不能伪造 Workflow 活动图，也不能跳到最近一次同名 Workflow Run。

### Wave 下钻、运行身份与 Analysis 联动

| `data-section-id` | 职责 | 交互与约束 |
|---|---|---|
| `execution-wave-run-detail` | 选中 Wave 后显示的 Workflow Run 层 | 与 `execution-plan-run-overview` 互斥显示，但仍属于同一 Task、Session 和 `control-workspace`。 |
| `execution-wave-run-toolbar`、`execution-level-breadcrumb` | 提供 `计划执行 / Wave / 工作流运行` 的层级语境 | 面包屑只用于定向和返回，不承担运行身份解析。 |
| `execution-wave-run-back` | 返回 Plan Run | 关闭元数据浮层，恢复 Plan Run 的原视口、选中 Wave 与筛选状态。 |
| `execution-wave-run-metadata-toggle`、`execution-wave-run-metadata-chevron` | 展开/收起“运行身份” | 元数据默认折叠；按钮同步 `aria-expanded`。Chevron 使用同一个等尺寸 SVG 旋转，展开和收起不能因更换字符而改变宽度或对齐。 |
| `execution-wave-run-metadata` | 临时运行身份浮层 | 浮层不推挤运行图、不常驻抢占注意力；点击外部或返回 Plan Run 时关闭。 |
| `execution-wave-metadata-plan-run`、`execution-wave-metadata-wave`、`execution-wave-metadata-workflow`、`execution-wave-metadata-run`、`execution-wave-metadata-trace-root` | 分别显示 `plan_run_id`、`wave_id`、带版本的 Workflow definition、`workflow_run_id` 和 `trace_root_id` | 仅允许稳定定位同一运行对象的字段。`attempt`、状态、时间、耗时和成本不得混入。 |
| `execution-wave-copy-plan-run`、`execution-wave-copy-wave`、`execution-wave-copy-workflow`、`execution-wave-copy-run`、`execution-wave-copy-trace-root` | 复制对应的单个身份值 | 图标按钮统一为 30×30，内部 SVG 统一为 15×15；复制原始值，成功后短暂显示确认态。不提供整包 JSON 复制。 |
| `execution-wave-run-analysis-link` | 从当前 Wave Run 跳到 Analysis & Audit | 必须传递 `plan_run_id`、`wave_id`、`workflow_run_id`、`trace_root_id` 的精确组合；目标由 `analysis-linked-wave-context`、`analysis-linked-wave-id`、`analysis-linked-workflow-run-id`、`analysis-linked-trace-root-id` 显示“来自 Execution”的过滤范围。参数缺失或对象不存在时显示无法定位，不得静默回退到最近运行。 |

复制和 Analysis 跳转都是浏览操作，不修改 Plan、Workflow 或 Run 状态。页面也不得把显示标题、Workflow 名称或开始时间当作身份键进行模糊关联。

### Workflow Run Dashboard

Workflow Definition 拥有静态允许拓扑：Action、触发条件、合法 successor、循环边界，以及何时允许 Planner 参与选择。具体 Delivery 的运行路径是动态的；Planner 只能在 Workflow 当前暴露的 allowed next Actions 中提出 `nextAction`，Runner 校验后才能提交 transition。因此执行页遵守“静态允许拓扑、动态实际路径”：

- `execution-observed-path` 只投影已经提交的 Action、transition、失败、暂停和循环访问，不把计划路径或未发生分支画成事实；
- `execution-run-frontier` 标出当前执行前沿；它可能因并行或 Wait 同时存在多个实例，不能假定永远只有一个节点；
- `execution-next-action-frontier` 可以弱化显示当前合法候选，但必须注明 Planner 尚未选择；候选边使用虚线/低强调度，不能使用运行扫光或成功色；
- Planner 作出选择并经 Runner 接纳后，相应候选才进入已发生路径。未选择候选可以消失，但已发生路径不得因后续选择而重写；
- 循环按实际访问次数投影，例如 `Verify #1 → Fix #1 → Verify #2`。完整 Workflow Studio 可以展示静态回边，Execution 不得用一根理论回边替代已发生的多次访问；
- Workflow Studio 的完整允许拓扑、Plan Workbench 的 Task Plan DAG、Execution 的已发生路径是三种不同投影，禁止复用同一个“DAG”标题掩盖 authority 差异。

当前 HTML 以 `execution-observed-path`、`execution-run-frontier` 和 `execution-next-action-frontier` 标出这三层语义。示意图仍复用单个 SVG；正式实现应由运行事实和 allowed-successor projection 分层渲染。

| `data-section-id` | 职责 | 交互与状态规则 |
|---|---|---|
| `execution-dashboard` | 当前 Wave 的简易运行 Dashboard | 数据范围严格绑定当前 `workflow_run_id`；只突出产出、异常、执行前沿和下一个控制边界，不把执行事件完整倾倒给用户。`data-runtime-pace` 只表达当前可观测速度状态。 |
| `execution-dashboard-header`、`execution-dashboard-health` | Dashboard 标题和健康摘要 | 健康状态必须来自已声明的运行事实；未知、无基线和样本不足必须显示中性状态。 |
| `execution-workflow-run-map`、`execution-run-map-heading`、`execution-run-map-viewport`、`execution-run-map-canvas` | 当前 Workflow Run 的活动图、标题、视口和画布 | 图显示本次实际路径而非 Workflow 编辑器；节点和边只读。正式实现采用专用图布局引擎，直线与 90 度正交折线，不使用曲线。 |
| `execution-run-event-strip`、`execution-run-pace-copy` | 最近关键事件及速度摘要 | 只保留人需要注意的变化；普通事件留在 Analysis & Audit。 |

#### 状态图例、路径和循环

| `data-section-id` | 语义要求 |
|---|---|
| `execution-legend-success`、`execution-legend-running`、`execution-legend-failed`、`execution-legend-paused`、`execution-legend-gate` | 演示稿必须同时包含成功、运行中、失败、暂停和判断/关口图例；颜色之外还要以线型、文字或形状区分，不能只依赖色觉。 |
| `execution-edge-success`、`execution-edge-running`、`execution-edge-degraded`、`execution-edge-failed`、`execution-edge-paused` | 分别投影已成功、运行中、低于基线、失败和暂停的已发生路径；底层边始终存在，即使关闭动态效果也能读出状态。 |
| `execution-edge-arrowheads`、`execution-pace-arrowhead` | 表达控制方向；箭头颜色与当前路径语义同步，但不得改变拓扑。 |
| `execution-loop-control`、`execution-loop-decision`、`execution-loop-return` | 判断和恢复循环 | 判断采用活动图式菱形；回边必须连接真实恢复目标，并显示 guard/重试语义，不允许装饰性回环或为避让不当布局而绕行整张图。 |
| `execution-run-frontier` | 当前 Workflow 执行前沿 | 同时只能有一个主要视觉焦点；并发执行时可显示多个语义前沿，但动效和标签必须避免让用户误判主控制边界。 |

原型中的 `execution-node-goal`、`execution-node-rules`、`execution-node-security`、`execution-node-build`、`execution-node-docs`、`execution-node-paused`、`execution-node-sandbox` 和 `execution-node-gate` 只是覆盖各种状态与拓扑的示例节点，不是固定 Workflow 模板。`execution-current-node-body` 与 `execution-current-node-map-status` 投影当前节点；`execution-running-halo` 和 `execution-error-halo` 分别承载运行焦点与错误呼吸提示，不能参与布局计算。

Execution 不定义通用的 waiting edge。已经开始、正在等待外部响应且仍占有运行资源的 Action 继续归为运行中；显式释放资源并等待恢复信号时应建模为暂停及其恢复条件。Planner 尚未决定的 `nextAction` 只是 `execution-next-action-frontier` 中的弱化候选关系，不是运行边。Plan DAG 中尚未满足依赖或未被调度的 Wave/Gate 则标为“未开始”或“阻塞”，与 Workflow Run 的边状态分开。

#### 动效与可观测组件槽位

| `data-section-id` | 职责 | 交互与约束 |
|---|---|---|
| `execution-effects-toggle`、`execution-effects-indicator`、`execution-effects-label` | 用户动效偏好 | 开关只启停运动层，不隐藏节点、基础连线、状态颜色、线型、图例或文字。初始值遵守 `prefers-reduced-motion`，偏好可跨页面保存。 |
| `execution-flow-particles`、`execution-running-sweep`、`execution-degraded-sweep` | 沿活动边移动的扫光层 | 视觉应表现为光源扫过线段：宽而弱的光晕、较窄光尾和明亮光头，而非散点粒子、整线闪烁或无语义装饰。速度只由运行态映射决定。 |
| `execution-observability-slots` | 可观测提醒容器 | 接收组件声明的结构化信号；扩展提醒不得改写 Workflow 权威状态，也不得自行推断根因。 |
| `execution-speed-signal`、`execution-speed-signal-dot`、`execution-speed-signal-copy` | 当前速度相对可信基线的信号 | 低于基线映射为黄色并减慢扫光，高于基线映射为蓝色并加快，接近基线为普通运行态；没有可信基线时为中性。正式产品中是只读信号。 |
| `execution-error-signal` | 错误提醒 | 映射到错误节点、失败路径和红色呼吸提示，并给出可进入 Analysis 的关联范围。 |
| `execution-observability-extension-slot` | 其他可观测组件的受控扩展槽位 | 新组件必须声明输入、阈值、视觉语义、优先级和与既有提醒的合并规则；不能任意注入动画。 |

当前 HTML 点击 `execution-speed-signal` 会在慢、快、正常之间循环，这只是方便评审扫光速度、颜色和进度反馈的**原型演示交互**。正式实现必须删除该用户写入口，由可观测组件只读驱动；测试或 Storybook 可以保留独立的场景切换器，但不能出现在生产 Dashboard 中。

### 当前节点面板

| `data-section-id` | 职责 | 内容边界 |
|---|---|---|
| `execution-current-node` | 当前执行前沿的细节面板 | 与图中选中的运行节点保持同一身份；不展示 Agent、subagent 或 worktree 的内部编排。 |
| `execution-current-node-status` | 当前节点状态/速度异常 | 与图中 `execution-current-node-map-status` 和相应边状态一致，不能出现面板说“正常”、图上显示“失败”的分裂。 |
| `execution-current-node-progress`、`execution-current-node-progress-value`、`execution-current-node-progress-bar`、`execution-current-node-duration-copy` | 节点局部进度、耗时和相对基线 | 必须明确是当前节点或当前 Workflow Run 的局部指标，不能冒充 Task 或 Wave 完成率。进度条颜色可映射速度提醒，关闭动效后仍保留。 |
| `execution-current-output` | 当前持续产生或最近更新的关键产出 | 显示可理解的产物名称、更新时间和状态；完整版本、证据和历史进入 Analysis。 |
| `execution-current-node-checks`、`execution-current-node-active-check`、`execution-current-node-active-dot` | 已完成检查和当前检查 | 只显示少量关键检查；正常项聚合，失败项突出。活动点属于状态提示，受 reduced motion 约束。 |
| `execution-next-boundary` | 下一个需要系统或人作出控制判断的边界 | 说明进入条件、失败后的路径和预计距离；它不是直接批准、暂停或重试按钮。实际决策仍从 `input-stream` 或其原生审批卡进入。 |

### 写入边界与验收状态机

Execution Workbench 允许的直接交互只有视图导航和偏好：选择 Wave、返回 Plan Run、展开运行身份、复制身份值、跳转 Analysis、浏览运行图以及切换动效。节点拖拽、修改依赖、暂停、重试、跳过、批准和拒绝均不是 Dashboard 的直接操作；这些业务意图必须进入 `input-stream`，经过语义解析、authority 与 invariant 检查后再改变权威状态。

页面实现至少满足以下状态转换：

```text
进入 Execution
  → 显示 execution-plan-run-overview
  → 选择带精确 Run identity 的 Wave
  → 显示 execution-wave-run-detail
  → 可展开 execution-wave-run-metadata / 跳转 Analysis
  → 返回时恢复原 Plan Run 浏览状态

关闭动态效果或 prefers-reduced-motion
  → 仅停止 sweep / halo 等运动层
  → 基础边、节点、图例、状态文字和当前前沿仍完整可读
```

实现验收时，应同时检查元素存在、可见性转换、键盘可达性、`aria-expanded`/`aria-pressed` 状态、复制负载、Analysis 深链接参数、reduced-motion 降级和 Plan Run 浏览状态恢复。不能只凭静态截图确认交互完成。

## Gate 多决策与 Input subject 契约

一个 Task 可以因并行 Wave 同时产生多个未决 Gate。`gate-review-workbench` 是“待决策队列 + 当前 `gate_id` 的状态看板”，不是假设全局只有一个审核点：

- `gate-queue-toggle` 展开或收起 `gate-decision-queue`，同步维护 `aria-expanded`；`gate-queue-count` 是未决 Gate 数，`gate-queue-position` 是当前选择在稳定排序中的位置。
- `gate-queue-item-g3`、`gate-queue-item-g5`、`gate-queue-item-g6` 是示例实例，不是产品固定 Gate。正式实现按阻塞关键路径、是否已具备可决条件、不可逆风险和创建时间确定性排序，并以 `aria-current` 标记当前项。
- 选择 Gate 后，`gate-decision-question`、`gate-trigger-context`、`gate-location-context`、`gate-relevant-decisions`、`gate-current-interpretation`、`gate-understanding-delta`、`gate-execution-preview` 和 `gate-evidence` 必须从同一 `gate_id`/revision 原子更新，不能出现跨 Gate 混合快照。
- `gate-decision-state` 标题只保留“当前决策状态”。不附加“随对话更新 · 只读投影”等实现说明；内容变化和 Workbench 的全局只读契约已经表达这些事实，重复标签只会制造无效视觉层级。
- `composer-reply-subject` 与 `composer-reply-subject-copy` 明确当前输入将归属哪个 Gate；切换 Gate 同步更新 subject，但不新建 Session、不隐藏其他消息。
- `composer-reply-subject-clear` 只取消本条消息的显式 Gate 归属，使其回到 Task 级 Input；它不关闭 Gate、不清除决策草稿，也不删除历史消息。
- 短句“同意”“继续”“再试一次”只有在存在明确 subject 且指向当前有效 Gate revision 时才能形成候选决定；否则必须要求澄清，禁止按最近 Gate 猜测。
- 完成某个 Gate 后先显示决定回执，不立刻自动切换到下一个 Gate；其他 Gate 若因上游决定改变前提，应进入“仍有效、等待依赖、需要重新审查、已被消解”之一。

Input 负责讨论可能选项、利弊、追问、反驳和最终审批；右侧只显示用户已确认了什么、AI 当前如何理解、相对既有决定改变了什么，以及确认后系统将执行什么。候选选项列表不得进入右侧看板，以免 AI 通过预设问题空间引导用户。

## Gate 证据与上下文导航契约

Gate Workbench 围绕当前 `gate_id` 的待决策问题投影。Input 负责讨论选项、追问和提交决定；右侧负责持续呈现相关已确认决定、AI 当前理解、相对变化、确认后的控制效果以及核对这些内容所需的证据。多个未决 Gate 通过 `gate-queue-toggle` 与 `gate-decision-queue` 切换，切换时问题、决定、理解、差异、执行投影和证据必须作为同一个 Gate 快照原子更新。

`gate-evidence` 下的五个入口是稳定的证据角色，不是五种硬编码文件：

| `data-section-id` | 固定角色 | 目标与行为 |
|---|---|---|
| `gate-evidence-plan-context` | 计划上下文 | 打开当前 Gate 实际引用的不可变 Plan revision，并定位到对应 Wave、Gate、恢复边界或退出条件。当前原型复用 `plan-document-viewer`，通过 `surface=plan`、`plan_view=document`、`plan_anchor` 和 `from_gate_id` 定位；`plan-linked-gate-context` 显示来源，`plan-document-back` 返回原 Gate。 |
| `gate-evidence-trigger-record` | 触发记录 | 运行失败、异常或可观测事件触发的 Gate 进入 Analysis & Audit，至少携带 `plan_run_id`、`wave_id`、`workflow_run_id`、`trace_root_id`；需要时继续携带 `attempt`、`span_id` 和 `event_id`。预设权限边界或文档缺口等非 Trace 触发事实可以进入 Context Inspector。 |
| `gate-evidence-proposed-change` | 拟议变更 | 在 `gate-context-inspector` 中以 Artifact Diff renderer 展示当前获批版本与候选 patch、影响范围和精确 revision；只读，不在差异页直接批准或修改。 |
| `gate-evidence-validation-result` | 验证结果 | 在 `gate-context-inspector` 中以 Evidence Receipt renderer 展示 claim、verdict、适用对象、规则/工具版本、记录时间和运行 provenance；若证据天然属于某个 span，也可深链到 Analysis。 |
| `gate-evidence-governing-decision` | 既有决定 | 在 `gate-context-inspector` 中以 Decision Receipt renderer 展示用户原话、AI 的结构化解释、authority、提交的 IR revision、当前有效性和 source message；后续应支持同时把 Input 滚动到原始消息。 |

### Context Inspector

`gate-context-inspector` 是 Gate 内的通用只读检查模式，不是新的一级工作面。打开后由它临时替换 `gate-main-view`，左侧 `input-stream`、当前 Task Session 和 composer 的 Gate subject 保持不变：

- `gate-context-header` 显示 renderer 类型、标题和不可变 revision；
- `gate-context-back` 返回原 `gate_id`，恢复 Gate 队列位置和页面浏览状态；
- `gate-context-summary` 说明该材料与当前待决策问题的关系；
- `gate-context-primary` 与 `gate-context-secondary` 根据类型展示差异双方、claim/有效性或用户原话/结构化效果；
- `gate-context-provenance` 展示 artifact、evidence、decision、source message、workflow run 或 IR revision 等精确身份。

Artifact Diff、Evidence Receipt 和 Decision Receipt 共享查看器外壳，但使用不同 renderer 和字段 schema。它们不能退化成无关系说明的文件预览，也不能形成第二条业务写入口。

### Analysis 深链接与返回

从 Gate 打开 Analysis 时使用 `from_gate_id` 记录来源。Analysis 通过 `analysis-linked-gate-context` 显示 Gate、attempt、span 与 event 的精确焦点，并由 `analysis-linked-gate-return` 返回对应 Gate。身份参数缺失、revision 不存在或引用已经失效时，目标页必须显示无法定位；不得回退到最新版本、最近一次 Run、同名文件或同名 Workflow。

### 导航共同约束

1. 每个入口必须由类型化 EvidenceRef 驱动，至少携带 `ref_id`、`kind`、`gate_id`、不可变 revision，以及该类型所需的 Plan/Run/Trace/Artifact/Decision identity。
2. 跳转前验证 EvidenceRef 属于当前 Gate，并检查用户对目标资源的读取权限；显示标题和文件路径不能作为身份。
3. 打开上下文属于浏览操作，不改变 Gate、Plan、Workflow 或 Run 的权威状态，也不新建 Session。
4. Gate 切换后五个入口必须同步替换，禁止保留上一个 Gate 的链接或复制只更新文案、不更新目标。
5. 返回必须恢复 `gate_id`、队列选择、Input reply subject、滚动位置和未提交的 composer 内容；跨页面时通过显式 return context 实现，不能依赖浏览器历史猜测。
6. 当前原型使用查询参数表达路由；正式实现可以改为宿主 router state，但参数语义和精确定位保证不变。

## Delivery Workbench 交互契约

`delivery-workbench` 是 Task 当前可交付状态的持续投影，不是 Task 的固定终点、归档页、某个 terminal Delivery 的详情页，也不是资产编辑器。它从 Task 建立后即可访问；内容随 Goal、Plan、产物、Evidence、Gate 与残余风险更新而重新计算：

- `delivery-current-readiness` 显示当前可交付状态及必要验收条件覆盖，可取“不可交付、条件可交付、当前可交付”等人类可读投影；它是一项带来源与计算时点的当前判断，不自动关闭 Task。
- `delivery-readiness-invalidated-by-input` 说明追加目标、修改约束或要求 Replan 会使既有判断失效并重新计算；它不是阻止用户继续输入的确认条。
- `delivery-artifacts` 提供当前交付候选及其精确 revision、验证状态和打开入口；不得称为“最终交付物”。打开产物属于只读上下文检查，复用 Context Inspector 或宿主资源查看器。
- `delivery-acceptance` 投影当前验收 claim、coverage 与 verdict，并能下钻到支持证据；它不重新执行 Gate，也不把暂时满足解释成永久验收。
- `delivery-residual-risk` 显示当前仍有效的残余风险及其是否阻断交付；未裁决风险必须关联 Gate，不能暗示已经接受。
- `delivery-economics` 显示 Task 累计耗时、Agent/模型成本和人的注意力，不混入单个 Wave 的局部指标。

Delivery 默认无业务写按钮。未来若增加“下载”“复制身份”“打开证据”，它们只能是读取或导航；接受当前结果、追加目标、撤销既有接受或要求 Replan 必须通过 Input 及对应 authority 校验。页面可以在 Task 的任何控制状态下访问，切换到这里不会暂停执行、创建 Delivery 或改变可交付判断。

## Analysis & Audit 交互契约

Analysis & Audit 是事后事实检查面，与 Task 的事中控制工作面分离；它消费精确 Run/Trace/Evidence identity，不接受模糊的“最近一次运行”。

| `data-section-id` | 行为 | 边界 |
|---|---|---|
| `analysis-navigation`、`analysis-tab-analysis`、`analysis-tab-audit`、`analysis-tab-compare` | 在同一分析对象的重建、审计事件和运行比较投影间切换 | 只改变读取视图，不改变记录事实。当前静态原型只画出标签，尚未实现切换。 |
| `run-history`、`analysis-run-filter` | 选择或过滤历史 Run | 选择必须更新整页 identity；筛选是 UI state。当前 Run 卡尚未形成正式交互实现。 |
| `trace-reconstruction`、`analysis-fit-graph` | 浏览 Trace 因果/父子关系并适应视口 | 正式图仍采用专用布局引擎；Fit 只改变视口，不能改变 Trace。当前按钮尚未绑定。 |
| `recorded-evidence`、`evidence-receipts` | 显示选中 span/event 的证据回执与原始文件入口 | 选择图节点后原子更新；缺失记录不得由推断内容填充。当前示意稿尚未实现节点选择。 |
| `run-comparison` | 对两个冻结 Run 做成本、注意力、覆盖和拦截结果比较 | 比较对象必须共享可比较的 Goal、Workflow/Gate 与口径；改变对比 Run 只改视图。 |
| `analysis-linked-wave-context` | 接收 Execution 的 Plan/Wave/Workflow Run/Trace Root identity | 参数不全时显示无法定位，不回退最近 Run。 |
| `analysis-linked-gate-context`、`analysis-linked-gate-return` | 接收 Gate 的 attempt/span/event 焦点并返回来源 Gate | 返回保留 `gate_id`；目标事实不存在时显式失败。 |

Analysis 中允许筛选、搜索、缩放、选择节点、打开证据和切换比较对象；不允许删除审计事件、改写 evidence、修改 verdict 或直接重跑 Workflow。重跑和纠偏属于新的 Task/Input 意图。

## Workflow 页协作边界

Workflow Explorer 与 Workflow Studio 的内部交互不属于 Task 页审计范围。本文件仅保留两个跨页不变量：Task Sidebar 传递稳定 definition identity、精确 revision 和来源 Task；Workflow 页不得因被打开而改变当前 Task 的执行状态。其余既有设计输入与待审核问题已迁移至 [`workflow-pages-design-memo.zh-CN.md`](workflow-pages-design-memo.zh-CN.md)。

## 交互契约覆盖结论

本轮只按 Task Detail HTML 的设计稿职责逐项核对。这里的“已演示”表示静态稿提供了布局、配色关系或部分页面级交互，不表示后台服务、宿主路由和生产组件已经交付：

| 范围 | 契约状态 | 原型实现状态 |
|---|---|---|
| Shell、Task、Settings、Input | 已补齐宿主继承、自由工作面导航、浏览/系统活动双状态和单一写入口契约 | Banner、新建 Task、Settings 与原生 composer 仍依赖 DSH 集成，静态稿演示五页切换但不模拟宿主行为。 |
| Grilling | 已补齐 Question Map、Live Brief、变化与写入边界 | 右侧保持只读，符合设计。 |
| Plan | 已补齐完整文档、DAG 浏览、Gate 返回与所有现有控件 ID | 文档/DAG/缩放/平移/搜索已演示；浏览状态持久化尚未实现。 |
| Execution | 已有两级运行投影、身份、Analysis 联动、已发生路径/候选前沿、图状态、动效与可观测槽位完整契约 | 主要交互已演示；速度切换明确为原型控制，不属于生产交互。 |
| Gate | 已有多 Gate、Input subject、决策投影、证据路由、Context Inspector 与返回契约 | 主要交互已演示；Decision Receipt 定位并高亮原始 Input 消息尚未实现。 |
| Delivery | 已补齐当前可交付判断、候选产物、验收覆盖、残余风险、成本与只读边界 | 追加目标或 Replan 会使状态重新计算，不形成 Task 固定终点。 |
| Analysis & Audit | 已补齐视图切换、Run 选择、Trace 浏览、Evidence 和来源返回契约 | 精确 Execution/Gate 来源已演示；内部 tabs、过滤、节点选择仍是视觉占位。 |
| 跨页入口 | 已定义 Task 页向 Task Browser、Workflow Explorer/Studio 发出的身份与返回上下文 | 目标页面内部交互由各自 memo 管理，不纳入本页审计。 |

因此，已接受的交互原则现在都有书面契约；原型中尚未实现或与契约冲突的控件也被显式列出，不能因为画在 HTML 中就被误认为产品决定。后续每次新增可操作元素，都必须同时提供 `data-section-id`、authority 类型（浏览/偏好/候选写入/权威写入）、状态来源、失败行为和返回语义，并进入相应自动化验收。

## 双语与界面语言一致性

Crystra 插件支持中文和英文，但同一 locale 下由产品控制的界面文案必须使用同一种语言：

- 页面标题、导航、工作面名称、卡片标题、状态、指标名、计数单位、提示和只读入口均随 locale 整体切换；
- 不允许在同一 locale 中出现一张卡片用中文标题、另一张卡片用英文指标的拼接式本地化；
- 品牌名、模型名、文件名、代码标识、协议名以及 `JSON IR`、`DAG` 等约定技术标识可以保留原文；
- 用户输入、Agent 回复和由 LLM 整理出的任务内容属于用户数据，LLM 生成的内容不承担语言一致性；产品不应为了界面一致性擅自翻译或改写这些内容；
- 当前 HTML 原型固定为 `zh-CN`，因此其中由 Crystra 控制的标题和指标使用中文。英文版本应通过同一组 i18n key 完整投影，而不是维护另一套卡片结构。

## JSON IR 写入协议候选

早期候选路径：

```text
User Input
  → LLM semantic parse
  → typed JSON IR patch proposal
  → schema validation
  → invariant and authority evaluation
  → append decision / mutation record
  → commit authoritative JSON IR
  → re-project active Workbench
```

LLM 不应无痕直接改写权威 IR。至少需要保留原始 Input、目标 subject、提议 patch、校验结果、principal、authority 和最终是否提交。

## 自应用的结晶路径

这套交互同时是 Crystra 对自身机制的自应用：

```text
观察重复的自然语言 → JSON IR patch 转换
  → 识别稳定输入、输出和低方差规则
  → 生成确定性 transformer / command
  → 与 LLM 路径进行 shadow replay 和差异验证
  → 通过资格验证后用代码生成相同类型的 patch
  → 不确定性升高时重新打开 LLM 路径
```

Workbench 不因代码化而改变；LLM 与确定性 transformer 都必须产出同一 IR patch 协议。这使“从概率控制结晶为代码控制”可以逐步发生，而不需要迁移 UI 或权威状态模型。

## 当前边界

- Workbench 当前是只读投影，不设计直接业务写控件；允许搜索、筛选、缩放、下钻、复制身份和打开证据等浏览操作；
- 所有状态变更先经 Input，包含批准、拒绝、纠偏、继续迭代和计划修改；
- Analysis & Audit 仍保存完整执行事实，Task 默认只消费摘要和关注点；
- 系统关心执行细节，但人默认不消费执行细节；
- 完整 trace 是摘要可信、失败诊断和发现结晶候选的基础，不能因 UI 隐藏而不记录；
- 五个 Workbench 是控制状态投影，不应重新变成 `Define → Plan → Execute → Verify → Accept` 的固定线性向导。

## 后续需要验证

1. 五个 Workbench 分别依赖哪些最小 JSON IR 字段，哪些字段可以跨面复用；
2. 自然语言修改生成的是 JSON Patch、领域 command，还是更受限的 typed mutation；
3. 哪些变更可在校验后自动提交，哪些必须通过 Input 生成明确审批卡；
4. 如何呈现 patch 的失败、冲突、回滚和 provenance，而不把 Workbench 重新做成编辑器；
5. 什么观测窗口、样本量和差异阈值足以把某类 LLM 变换结晶成代码；
6. 代码 transformer 上线前如何做历史 replay、shadow comparison、资格验证和 bounded reopening；
7. 大型 Plan、Workflow 和 Trace 下，浏览状态恢复、增量布局和 Context Inspector 的性能边界；
8. Task 状态变化、Gate revision 失效或跨页返回失败时，Input subject、审批卡与右侧 IR 投影如何完成端到端恢复和错误呈现。

## 理论对应

该设计把 project-ops 的 `subject`、`from → to`、`requires` 和 `authority` 作为控制含义，把 UI 视为模型投影；Crystra 负责执行边界上的运行、观测、JSON IR、状态迁移和逐步结晶。它不要求 Crystra 迁移底层 thesis，而是在 UI/UX 层验证“高频机器反馈、低频人工判断”和“模型先于平台投影”的假说。
