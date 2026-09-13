# Task Browser 页面设计 memo

> 状态：占位文档；等待独立页面交互审核  
> 原型：[`assets/crystra-task-browser-v7.html`](assets/crystra-task-browser-v7.html)  
> 来源入口：Task Sidebar 的 `all-tasks-action`

## 已接受的协作边界

- Task Browser 是独立一级页面，不是 Task Detail 的第六个 Workbench，也不由 `task-control-workbenches-design-input.zh-CN.md` 审核内部交互。
- 独立的是 Sidebar 右侧的主表面，不是全局 Shell。Task Browser 必须复用 Task Detail 已确认的 `sidebar-logo-row`、`task-working-set`、`workflow-navigation`、`analysis-navigation` 和 `sidebar-footer` 层级及其折叠、原位搜索、视图菜单行为；不得创建 `sidebar-task-section` 一类页面专属同义结构。“查看所有任务”的选中态只表示当前一级页面。
- 进入后保留全局 Sidebar，右侧 `main-surface-host` 整面替换为 `task-browser-surface`；不保留某个 Task 的 Header、执行摘要、Input 或 Control Workspace。
- 从 Browser 选择 Task 后，生产实现恢复该 Task 的 Input/Session、Composer 草稿、reply subject、上次查看的 Workbench、下钻与滚动状态。该行为依赖宿主路由和后台状态服务，不要求静态 HTML 演示，也不纳入原型完成度审计。
- 返回 Browser 时应恢复查询、过滤、排序、分页与滚动位置。具体状态所有权和持久化层级留待本页审核。
- Task Explorer 与 Workflow Explorer 可能共享对象浏览内核，包括查询、过滤、排序、分页/虚拟化、选中、深链和返回状态恢复。两页必须联合讨论后再确定复用边界，不能各自先写一套实现。

## 当前原型组件备忘

| `data-section-id` | 当前用途 | 后续审核重点 |
|---|---|---|
| `app-shell`、`sidebar`、`main-surface-host` | 全局 Shell 与一级页面宿主 | 页面切换、返回状态与响应式布局。 |
| `task-browser-surface` | 全局 Task Browser | 是否需要独立路由与加载/错误状态。 |
| `task-browser-header`、`task-browser-new-task-action` | 标题与新建入口 | 新建 Task 仍应进入无持久化的 Hero Composer 空白态。 |
| `task-browser-summary` | 查询范围内的集合摘要 | 指标是否有识别和决策价值，避免复制 Task 执行摘要。 |
| `task-browser-toolbar`、`task-browser-search`、`task-browser-filter`、`task-browser-sort` | 完整检索工具 | 与 Workflow Explorer 共用的查询表达、URL 状态和无结果反馈。 |
| `task-browser-list`、`task-browser-list-body` | 大规模结果区 | 分页还是虚拟化、列密度、窄屏降级和键盘导航。 |
| `task-browser-row-market-release` 等示例行 | Task Detail 入口 | 正式实例是否还应分配 section ID；稳定领域身份应使用 `task_id`。 |
| `task-browser-empty-state`、`task-browser-result-count`、`task-browser-pagination` | 查询反馈与规模导航 | 同一查询快照、加载失败和结果变化。 |

当前 HTML 中的任务数量、成本和行内容只用于检验布局与信息密度，不构成数据模型、固定指标或最终交付件。

## 与 Workflow Explorer 联合讨论项

1. 浏览内核负责哪些纯 UI 状态，领域适配器负责哪些 Task/Workflow 字段；
2. 搜索、过滤、排序是否编码进 URL，以支持深链和返回恢复；
3. 大数据量采用分页、游标还是虚拟化，以及两种对象是否允许不同策略；
4. 单击、双击、键盘 Enter 与新标签打开的统一导航语义；
5. 加载、空结果、权限不足、对象已删除和版本失效的共同错误模型。
