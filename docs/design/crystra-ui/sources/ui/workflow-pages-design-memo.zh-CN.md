# Workflow Explorer / Studio 页面设计 memo

> 状态：占位文档；等待 Workflow 页交互审核  
> 原型：[`assets/crystra-workflow-studio-v7.html`](assets/crystra-workflow-studio-v7.html)  
> 来源入口：Task Sidebar 的 `all-workflows-action` 与各 Workflow definition 行

## 已接受的跨页契约

- “查看所有工作流”进入 Workflow Explorer；单个 Workflow 行携带 `workflow_definition_id`、精确 revision 与来源 Task，进入对应 Workflow 上下文。
- Workflow 数据实例不分配 `data-section-id`。原型使用 `data-workflow-definition-id` 表达领域身份和定位目标，页面稳定结构才使用 `data-section-id`。
- 打开 Workflow 页面不触发 Task 的 Workflow transition，不创建 Delivery，也不改变当前 Task 的执行状态。
- Workflow Explorer 与 Workflow Studio 是否共享同一个页面 Shell、如何从列表进入 Studio，留待本页审核；当前用一个 HTML 表达不等于产品已经裁定路由结构。
- Workflow Explorer 与 Task Explorer 可能共享对象浏览内核。本页与 [`task-browser-design-memo.zh-CN.md`](task-browser-design-memo.zh-CN.md) 联合决定查询、过滤、排序、分页/虚拟化、深链和返回状态恢复，不各自实现两套逻辑。

## Workflow Studio 既有设计输入

Workflow Studio 遵守“Input 是唯一语义写入口”：用户在 `design-input` / `design-composer` 描述修改，右侧 `workflow-projection` 只投影 LLM 生成并经校验的 Workflow IR。

| `data-section-id` | 当前语义 | 后续审核重点 |
|---|---|---|
| `workflow-navigation`、`workflow-tab-studio`、`workflow-tab-versions`、`workflow-tab-runs` | 草稿投影、不可变版本与历史运行导航 | 当前仅为视觉占位，需要统一路由和状态恢复。 |
| `design-conversation`、`design-composer` | Workflow 语义输入流 | 复用 DSH Composer，并保存原始输入、候选 patch、校验结果和 provenance。 |
| `workflow-composer-add`、`workflow-composer-mode`、`workflow-composer-send` | 宿主 Composer 控件 | 归 DSH 所有；不作为 Crystra 自定义交互重复审核。 |
| `workflow-apply-draft`、`workflow-adjust-threshold` | Input 中的原生提案卡 | 候选写入、校验失败、authority 和过期处理。 |
| `workflow-map`、`crystallization-inspector`、`version-diff`、`validation-gates` | Workflow IR 与结晶状态的只读投影 | 节点选择只更新 Inspector；不提供手工连线编辑。 |
| `workflow-fit-map` | 适应图视口 | 纯 UI state；正式实现应使用专用图布局引擎。 |
| `workflow-inspect-diff` | 完整 revision diff 入口 | 固定 base/candidate revision 的只读 Context Inspector。 |
| `workflow-save-draft`、`workflow-validate` | 原型遗留写按钮 | 与单一写入口冲突；正式设计应移除，迁入 Input 提案卡或由确定性状态机触发。 |

Workflow 图允许浏览、缩放、搜索、折叠和查看节点细节，但不提供手工连线编辑器。LLM 根据 Input 生成配置，代码负责投影；高频、低方差的自然语言到 IR 变换再按结晶流程固化。

## Workflow Explorer 待联合设计

当前只确认它是“全部 Workflow”的独立浏览表面，尚未裁定列表字段、集合摘要、版本展示、搜索/过滤组合和进入 Studio 的方式。设计时必须与 Task Explorer 一起讨论共享浏览内核，同时保留 Workflow 特有的 definition/revision/run 身份模型。

