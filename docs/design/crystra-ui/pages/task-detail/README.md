# Task Detail 交付入口

> 继承：U1 已接受设计输入；布局基准：A1 `crystra-task-work-v7.html`。不是运行服务实现规范。

> **D03 更新：** 下方表格记录 A1 原稿骨架。Task 执行摘要拟纳入 `workspace-header`；最终 Header 在 Workflow/Analysis 页面设计后统一确定，三行 Header 和独立摘要横条不再视为最终布局。摘要的 Task 级口径不变。见 [D03](../../handoff/decisions-and-open-questions.md#d03)。

## 目的与页面骨架

保持同一 Task 的输入连续性，提供快速了解执行与作出授权判断的控制面。

| 区域 / section | 内容与布局 | 来源 |
|---|---|---|
| `task-workspace` / `workspace-header` | Task 标题、不可编辑的工作区语境；完整行 Header | U1 / A1 |
| `task-context` | Workflow revision、Run、可读状态；紧凑上下文带 | A1 / M2 补充索引 |
| `task-execution-summary` | 整 Task Run 摘要，跨两列且右边界与 Control 对齐 | U1 |
| `task-layout-region` | Input 38 : Control 62 的标准稿比例；按空间模式适配 | U1 / A1 |
| `input-stream` | 消息流与宿主 Composer，独立滚动 | U1 |
| `control-workspace` | 持久五工作面导航 + 内部滚动投影 | U1 |

继承 [Shell](../../components/shell-and-sidebar.md)、[Input](../../components/input-and-host-slots.md)、[空间](../../foundations/layout.md)、[通用状态](../../foundations/states-and-content.md)。

## 五个工作面

| 页面文档 | 默认呈现 | 人的任务 |
|---|---|---|
| [Grilling](grilling.md) | 问题覆盖与 Live Brief | 修正理解与发现缺口 |
| [Plan](plan.md) | 计划审核封面与两级 DAG | 判断路径、边界和证明准备度 |
| [Execution](execution.md) | Plan Run 总览，可下钻 Wave | 监控当前产出、异常与下一控制边界 |
| [Gate](gate.md) | 当前 Gate 的决策状态和证据 | 在 Input 讨论、核对、授权 |
| [Delivery](delivery.md) | 当前可交付判断 | 判断现有结果或继续追加要求 |

`task-workbench-navigation` 的选中态仅表示浏览；`workbench-system-focus` 单独表示系统活动。新输入、运行事实或 Gate 变化可以更新内容，但不得因此伪造用户已切换页面或完成某阶段。

## 页面行为与状态

- 工作面切换只替换 Control 内容，不创建 Delivery、不改变 Run、不重建 Session。
- Plan 文档/DAG、Wave Run、Gate Inspector 是 Task 内部下钻；不创建第六导航项。
- 摘要关注入口 `attention-open-gates` 打开 Gate 并展开未决队列，按控制影响排序，不只定位旧聊天。
- 选择其他 Task 时生产恢复对应消息、草稿、subject、Workbench、下钻与滚动；静态稿明确不模拟真实恢复。
- 未形成 Task 时进入 [新建页面](../new-task.md)，不是把当前 Task Header 改成可编辑 Workspace。
- Task 数据加载、读取失败、对象丢失应采用通用状态而保留可用输入；具体恢复设计见待定 O01/O02。

## 注意力顺序（整理建议）

执行摘要辨认当前整体状况 → 当前工作面的核心问题/异常 → 支撑证据 → Input 表达意见/授权。系统活动提示不能持续抢占正在审查另一工作面的注意力。此为设计预期，不是眼动测试结果。

## 验收入口

[AC01–AC06 等验收场景](../../handoff/acceptance.md)；[全部静态 DOM 定位](../../handoff/task-dom-index.md)。原文精确契约由 [来源覆盖](../../handoff/source-coverage.md) 回查。新目录未把原先审计结论扩展为宿主、后台或图布局引擎验收。
