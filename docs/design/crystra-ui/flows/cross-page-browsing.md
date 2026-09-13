# Task 与 Workflow 的跨页浏览

> 两个资源页面共享浏览组件，领域字段和生命周期独立，见 [D01](../handoff/decisions-and-open-questions.md#d01)。Task Browser 当前内部交互已按 [D14](../handoff/decisions-and-open-questions.md#d14)审核；Workflow Browser 当前规则已按 [D15](../handoff/decisions-and-open-questions.md#d15)归入正式页面。U1 约束跨页入口与返回。

## Task Browser 往返

Task Detail → 保存该 Task 的输入/浏览状态 → 任务标题行“全部任务”三角图标按钮 → 同 Shell 下主表面整面替换 → 查询集合 → 精确 task_id 进入 Task → 恢复该 Task 状态。

返回 Browser 时恢复查询、过滤、排序、分页/游标位置和滚动。Task Browser 已采用 Gallery 分组 / 无限加载和 List 分页；单击卡片 / 行或激活标题链接进入精确 Task，选择框与操作菜单不触发导航。页内查询、排序、选择和分页的保留规则见 [正式页面](../pages/task-browser.md#交互)。跨导航存储、宿主路由与真实恢复尚待接入。失败显示具体无法恢复对象，不把当前 Task 的聊天当目标 Task 的内容。真实切换在静态稿中审计豁免。

## Workflow 浏览

Task Sidebar Workflow 行 → definition identity + exact revision + 来源 Task → 对应 Workflow 上下文。全部入口 → Workflow Explorer；Explorer→Studio 携带所选 definition + 精确 revision，已有 from_task_id 则继续传递；URL / 跨页恢复仍待生产接入，Studio 内部实验不随 Browser 归档。

Workflow 页面打开只改变浏览，不推进 Task、创建 Delivery 或更换 active Snapshot。用户研究候选变更时可查看 diff/provenance；修改意图和发布模型需要该页独立审核与系统 owner 校验。

## 浏览组件复用与领域边界

Task Browser 已审核方案作为可复用实例，Workflow 按 definition / revision 的定义版本语义组织字段与操作。公共 API 与真实集合适配继续交付，不重开 Task 已接受的展示规则。Browser 改名、缩略图、Pin 和归档只管理资源显示与收纳，不推进执行；语义变更继续由 DSH Chat 承接。
