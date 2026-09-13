# 新建 Task 空白态

> 继承 U1 新建/Workspace Slot；系统约束 S1/S2/S6。A1 仅演示空白态布局。

## 入口与布局

Sidebar `new-task-action` 或 Browser 新建入口进入 `new-task-empty-state`。主区居中 `new-task-composer-seat`，挂载 DSH Hero Composer 和 Workspace Slot；不是在旧 Task Header 内加选择器。与已有 Task 状态显示互斥，Sidebar 保留。

## 操作与状态

| 操作 | 应有行为 | 未决边界 |
|---|---|---|
| 点击新建 | 进入待输入表面 | 点击本身不创建 Task/Session |
| 选 Workspace | 由 DSH `conversation.hero.workspace` 管理列表与选择 | 本地只暂存 UI state；不复制菜单 |
| 添加 Workspace | 宿主 directoryFlow / Folder Picker | 能力缺失由宿主隐藏新增入口 |
| 附件、输入、发送 | DSH Composer 原生能力 | Task/Session 持久化时点、创建失败回退由生命周期设计确定 |
| 选现有 Task 返回 | 精确 Task 恢复 | 草稿保留策略需宿主状态设计 |

系统已确定新 Delivery 默认新 Task、复用须显式选择；这不等于本包承诺发送动作如何创建后台对象。TaskPrompt 快照、admission、Manifest-before-effect 与 session binding 不得被 UI 绕过。失败必须保留可解释结果，不宣称预创建 Delivery 成功。

关注顺序为 Workspace 语境→任务描述→发送。AC02 / O01。公共所有权见 [Input 组件](../components/input-and-host-slots.md)。
