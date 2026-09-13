# Task 页面原型—契约精确索引

> 状态：Task Detail v7 HTML 的补充开发索引  
> 原型：[`assets/crystra-task-work-v7.html`](assets/crystra-task-work-v7.html)  
> 主设计输入：[`task-control-workbenches-design-input.zh-CN.md`](task-control-workbenches-design-input.zh-CN.md)

## 使用规则

本索引补充主设计文档中已经通过父组件说明、但尚未被精确点名的 `data-section-id`。它不是第二套设计：主文档定义原则和交互，本索引把具体 DOM section 映射到用途、布局、数据来源与行为边界，供实现和验收反向定位。

- 稳定页面结构使用 `data-section-id`；Task、Gate、Workflow 等运行时实例使用领域身份属性，不因为出现在示例中就获得 section ID。
- 纯视觉子元素可以保留 section ID 供本地化、状态同步或自动化定位，但必须注明没有独立交互和 authority。
- DSH Composer/Workspace Slot 内部控件由宿主契约管理，不为了覆盖率复制 Crystra ID。
- JavaScript 中的选择器模板 ``[data-section-id="${name}"]`` 不是实际 DOM ID；`${name}` 不进入契约索引。
- 自动检查要求 Task HTML 中每个静态 `data-section-id` 都在本目录文档中出现精确反引号引用。删除或改名时，HTML、主文档/本索引和验收必须在同一次变更中更新。

## Shell 与当前 Task 标识

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `task-workspace` | Sidebar 右侧的 Task Detail 页面根容器，纵向容纳 Header、执行摘要、Input 与 Control Workspace | 只负责页面布局和响应式占位；不是 Task Browser 的宿主，也不拥有 Task 状态。Better Sidebar 打开时由 Shell 调整其网格位置。 |
| `new-task-icon`、`new-task-label` | `new-task-action` 内的宿主风格图标与本地化标签 | 纯展示子元素，无独立点击、状态或 authority；点击行为只属于父按钮。 |
| `task-current-title` | Sidebar 当前 Task 行的单行、省略标题投影 | 来自当前 `task_id` 的展示名；不作为身份键，不独立响应点击。整行切换 Task 的真实行为依赖宿主路由与后台状态服务，静态原型不模拟。 |
| `task-context` | Task Header 标题下方的紧凑上下文带 | 投影当前 Workflow revision、Run 与人类可读状态；只读，不替代 `task-execution-summary`，其中展示文本不得被用作关联键。 |

## Gate 审核：问题与队列骨架

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `gate-review-overview` | Gate 页顶部的当前待决策问题封面 | 包含队列导航、问题、位置、触发原因和状态；其内容必须来自同一 `gate_id` / revision 快照。 |
| `gate-queue-navigation` | 封面顶部的待决策队列控制行 | 横向容纳队列开关、当前位置和控制影响；不承载决策选项或权威写入。 |
| `gate-current-impact` | 当前 Gate 对控制流影响的摘要 | 由运行时依赖和阻塞关系计算，例如“阻塞主路径”；切换 Gate 时原子更新，不能由颜色单独表达。 |
| `gate-decision-question-kicker`、`gate-decision-question-title` | 当前检查点身份与完整待决策问题 | Kicker 提供 Gate ID，标题表达唯一问题；都随当前 Gate 原子更新，不允许从聊天最近消息猜测。 |
| `gate-decision-status` | 当前 Gate 的人类可读状态 | 映射等待用户、依赖未满足、需重新审查或已消解等状态；只读，不作为审批按钮。 |
| `gate-decision-board` | 问题封面下方的双栏决策看板 | 左侧持续呈现已确认决定和 AI 理解，右侧呈现确认后的控制效果；窄屏可以纵向堆叠，但语义次序不变。 |

## Gate 审核：已确认状态与控制效果

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `gate-relevant-decisions-count`、`gate-relevant-decisions-list` | 相关已确认决定的计数与摘要列表 | 只包含对当前问题有效的不可变决定引用；数量与列表必须来自同一快照，不能混入候选选项。 |
| `gate-current-interpretation-status`、`gate-current-interpretation-copy` | AI 对用户当前意图的结构化理解及确认状态 | 随 Input 讨论更新，但在用户授权前始终是候选解释；文本不得伪装成已确认决定。 |
| `gate-understanding-delta-list` | 当前解释相对既有决定的变化列表 | 聚合新增、保持和冲突，帮助发现多轮对话中的漂移；只读，修改必须回到 Input。 |
| `gate-execution-preview-title`、`gate-execution-preview-status`、`gate-execution-steps` | 若确认当前解释，系统将采取的动作标题、授权状态与顺序投影 | 只显示已由当前讨论收敛出的控制效果，不陈列待选路径；未授权时不得启动执行。 |
| `gate-preserved-boundary`、`gate-preserved-boundary-copy` | 执行预览底部的“不变边界”摘要卡及文本 | 明确本次授权不会改变的权限、兼容性和人工关口；必须从 authority/invariant 结果生成，而不是 LLM 自行保证。 |

## Gate 审核：五类证据入口的内部内容

这些 section 是五个稳定证据角色内部的标题、摘要和动作提示。可点击目标属于其父级 `<a>`，内部 section 均无独立点击行为。

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `gate-evidence-plan-title`、`gate-evidence-plan-copy`、`gate-evidence-plan-action` | 计划上下文入口的标题、关联摘要和目标提示 | 父入口定位不可变 Plan revision 的相应章节；内部文本只解释去向。 |
| `gate-evidence-trigger-title`、`gate-evidence-trigger-copy`、`gate-evidence-trigger-action` | 触发事实入口的标题、事件摘要和目标提示 | 父入口携带精确 Run/Trace/Event 身份进入 Analysis；找不到对象时必须显式失败。 |
| `gate-evidence-change-title`、`gate-evidence-change-copy`、`gate-evidence-change-action` | 拟议变更入口的标题、差异摘要和目标提示 | 父入口打开只读 Artifact Diff；不得在卡片或 Inspector 中直接提交 patch。 |
| `gate-evidence-validation-title`、`gate-evidence-validation-copy`、`gate-evidence-validation-action` | 验证结果入口的标题、有效性摘要和目标提示 | 父入口打开固定 evidence revision；摘要不得脱离适用对象宣称“有效”。 |
| `gate-evidence-decision-title`、`gate-evidence-decision-copy`、`gate-evidence-decision-action` | 既有决定入口的标题、冲突提示和目标提示 | 父入口打开 Decision Receipt，并在具备宿主能力后定位 source message。 |

## Gate Context Inspector

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `gate-context-kind`、`gate-context-title`、`gate-context-revision` | Inspector Header 的 renderer 类型、材料标题和不可变版本 | 打开上下文时同步替换；revision 必须是精确身份，不使用“最新”。 |
| `gate-context-body` | Header 下方的独立滚动内容区 | 只读承载摘要、两栏详情和 provenance；其滚动不移动 Input，也不改变 Gate subject。 |
| `gate-context-summary-copy` | 当前材料与待决策问题的关系说明 | 必须说明为什么该材料影响当前判断，不能只重复文件名或事件标题。 |
| `gate-context-detail-grid` | Primary/Secondary 两个 renderer 区域的布局容器 | Artifact Diff、Evidence Receipt 与 Decision Receipt 可以投影不同内容；窄屏允许堆叠。 |
| `gate-context-primary-title`、`gate-context-primary-copy` | 主要事实的标题与正文 | 根据 renderer 显示候选差异、claim 或用户原话；内容只读并固定 revision。 |
| `gate-context-secondary-title`、`gate-context-secondary-copy` | 对照事实的标题与正文 | 显示基线、验证结论或结构化解释；必须与 Primary 使用可比较的同一 subject。 |
| `gate-context-provenance-fields` | 精确身份与来源字段列表 | 展示 artifact/evidence/decision/source message/run/IR revision 等可定位字段；缺失关键身份时不得伪造或回退。 |

## Plan 完整文档视图

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `plan-document-header` | 完整 Plan 查看器的固定 Header | 容纳返回入口、文档名、revision/source 和只读状态；不随正文滚动。 |
| `plan-document-page` | Outline 与正文的双栏页面容器 | 宽屏保持目录/正文关系，窄屏可收起 Outline；替换 Plan 摘要但不替换 Input。 |
| `plan-document-outline` | 完整 Plan 的章节目录 | 只做文档内导航；不能把章节顺序解释为运行状态机。 |
| `plan-document-content` | 权威 Plan revision 的只读正文视口 | 可独立滚动；展示比 Bench 更完整的内容，但任何修改仍通过 Input。 |
| `plan-linked-gate-copy` | 从 Gate 深链进入 Plan 时的来源说明 | 显示来源 Gate 和精确计划版本；没有 `from_gate_id` 时隐藏，而不是保留陈旧来源。 |
| `plan-document-wave-anchor` | Gate 或 Execution 可精确定位的 Wave/影响章节锚点 | 只承担文档定位和高亮；不得用可见标题做模糊匹配。 |

## Plan 完整 DAG 浏览

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `plan-full-dag` | 完整 Plan 查看器中的 DAG 章节表面 | 与文档正文互斥显示，仍属于同一 Plan revision；支持大图浏览，不提供结构编辑。 |
| `plan-dag-toolbar` | DAG 顶部固定浏览工具条 | 容纳返回目录、搜索、折叠、缩放和适应视口；这些操作只改变 UI state。 |
| `plan-dag-grid` | DAG 画布的背景网格定义 | 纯视觉辅助，不表示执行单元、依赖或状态，不参与点击和布局计算。 |
| `plan-dag-minimap` | 大图右下角的视口概览 | 帮助理解当前可见范围；正式实现应与主画布 pan/zoom 同步，原型当前只展示布局。 |
| `plan-dag-node-title` | 节点详情面板中的当前节点标题 | 随图上节点选择更新；展示名不作为节点身份键，选择不存在时显示明确空态。 |

## Plan 摘要卡片

| `data-section-id` | 用途与布局 | 数据、行为与边界 |
|---|---|---|
| `plan-outcome-summary` | 目标、完成判定与非目标的审核封面 | 只给人判断计划方向所需的压缩摘要；完整声明进入 Plan 文档。 |
| `plan-readiness-summaries` | 控制边界、证明准备度和上下文健康三卡容器 | 三类准备度并列比较；状态来源不同，不合并成一个模糊“计划质量分”。 |
| `plan-control-envelope-summary` | 自治范围、人工关口和恢复策略摘要 | 数据来自 authority 与控制边界定义；缺失任一关键边界时不能标记准备就绪。 |
| `plan-proof-readiness` | 验收、测试和证据设计的准备度摘要 | 聚合 claims/acceptance/evidence coverage；不显示机器执行细节。 |
| `plan-context-health` | 权威来源、假设和冲突的健康摘要 | 显示未固定来源或上下文冲突；不得把“已读取文件数”当作健康度。 |
| `plan-attention-summary` | 少量需要人关注的异常摘要 | 只展开会改变授权或可执行性的异常；正常项留在上方准备度卡聚合。 |
| `plan-change-summary` | 当前 Plan revision 相对上一获批 revision 的变化摘要 | 只列高影响新增、删除和边界变化；完整 diff 进入文档/检查器。 |

## 当前覆盖结论

补充本索引后，Task Detail HTML 的 328 个唯一静态 `data-section-id` 均可在本目录设计文档中被精确引用。另一个检测结果 `${name}` 仅来自 JavaScript 查询模板，已从静态 ID 集合排除。这个数字描述 v7 原型快照，不应成为产品 KPI；自动化验收关注的是未引用集合必须为空。
