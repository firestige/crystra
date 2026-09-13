# Execution：Plan Run 与 Wave Run

> 继承 U1 Execution 各节；A1 为结构与状态动效示意。系统语义映射受 [领域边界](../../foundations/product-and-domain.md) 约束。

## 默认层与下钻层

| 层 | 布局/section | 投影口径 |
|---|---|---|
| Plan Run（默认） | `execution-plan-run-overview`：header、聚合、map/canvas、Wave outcome | 已批准 Plan DAG + Wave/Gate/里程碑运行态；前沿来自实际节点 |
| Wave Run | `execution-wave-run-detail`：breadcrumb/toolbar、Dashboard、当前节点面板 | 当前 Wave 关联的精确 Workflow Run；左 Input 不变 |

A1 默认层图/结果区约 1.45:.55、详情图/节点约 1.42:.58，分别带 260/255px 细节最小宽度，属于资产提取而非最终断点。元数据默认收起，不占上方持续阅读区域。

## 动作与反馈

| 控件 | 操作 | 边界与返回 |
|---|---|---|
| 可下钻 Wave | click / Enter / Space | 精确 Run 存在才显示完整 Wave Run；无则摘要“尚无运行实例” |
| `execution-wave-run-back` | 回 Plan Run | 关闭身份浮层，恢复原视口/选中 Wave/过滤 |
| `execution-wave-run-metadata-toggle` | 展开运行身份 | 临时浮层，不挤图；aria-expanded，等尺寸 Chevron |
| `execution-wave-copy-*` | 逐项复制原始身份值 | 只读，成功反馈；不复制显示省略文本 |
| `execution-wave-run-analysis-link` | Analysis 精确定位 | Plan/Wave/Run/Trace 组合完整；缺失不得回退最近 |
| `execution-effects-toggle` | 用户动效偏好 | 停运动层，保留所有静态语义 |
| `execution-speed-signal` | 正式产品只读速度信号 | 稿中的点击慢/快/正常循环仅用于评审，不进生产 |

## Dashboard 语义

已发生路径、当前执行前沿、合法未选择候选分别由 `execution-observed-path`、`execution-run-frontier`、`execution-next-action-frontier` 承载。允许多个语义前沿，运动主要焦点唯一；未选候选不当事实。循环按实际访问次数展开，控制关系与 guard 必须真实。

`execution-current-node` 同图上选中 identity；状态/速度、局部进度、耗时、当前产出、少量检查与下一控制边界同步。局部百分比不是 Task/Wave 完成率。节点内部 Agent/subagent/worktree 编排不进入默认面板。

速度/错误由声明过的可观测事实与基线驱动，无可信基线显示普通运行态。扩展槽必须声明输入、阈值、视觉映射、优先级与合并规则，不改 Workflow state、不推断原因。

## 数据失效与验收

Wave retry 的 attempt 历史不重复计逻辑单元；U1 的同 Run retry 与系统“有效关闭后新 Delivery”属于不同层，映射前不得混用。身份缺失、Run 不存在、遥测不完整各有明确反馈；不伪造内部活动图。

专用图引擎、真实数据显示、跨页恢复和 clipboard 实际负载需生产验收。执行页允许导航/偏好，暂停/重试/跳过/批准回 Input。AC09–AC12；[执行排查流程](../../flows/execution-and-evidence.md)。预期注意力：整体前沿→产出/异常→下一边界；定位身份按需展开。
