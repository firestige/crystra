# Crystra UI 设计文档

> 初始整理：2026-09-07；更新：2026-09-11。各主题审核状态分别维护。Task Browser、Workflow Explorer 和 Sidebar 当前规则已归入正式正文（D14 / D15；Sidebar 标题行按 D16 正式定稿）；Workflow Studio 的结晶分析 UI/UX 于2026-09-13确认定稿，其他工作面的状态分别维护；生产契约未发布。
> 原 Task 输入的“已接受”身份被继承到对应条款；本目录整理、检查及读者测试不构成新的产品审批，也不代表生产实现完成。

## 从哪里开始

1. 阅读 [MASTER](MASTER.md)，了解全局不变量与引用规则。
2. 查看 [页面地图与路由语义](foundations/navigation.md)，选择目标页面。
3. 浏览页先读已审核的 [Task Browser](pages/task-browser.md)；实现 Task 工作台时进入 [Task Detail](pages/task-detail/README.md)，再读对应工作面；公共行为到 [组件目录](components/README.md) 查。
4. 用 [用户流程](flows/README.md) 检查跨页上下文，用 [验收矩阵](handoff/acceptance.md) 检查行为。
5. 查看 [逐项处理清单](pending-decisions.zh-CN.md) 和 [遗留待办](deferred-todos.zh-CN.md)，区分已裁定与后置设计/实现。
6. 遇到矛盾查 [冲突与待定项](handoff/decisions-and-open-questions.md)，不要用原型猜系统语义。

工作流业务接入先读：[需求与验收](pages/workflow-studio-contracts.md) → [流程设计](pages/workflow-studio.md) / [资源配置](pages/workflow-resources.md) → [包消费要求](pages/resource-envelope.md)。旧草案不并列生效。

创建或修改 v8 前必读：[Agent 组件优先与新增设计审查指南](handoff/component-first-guide.md)（D18）。

## 文档结构与职责

```text
MASTER.md                  全局规则入口，页面引用而不复制
foundations/               产品概念、视觉、布局、导航、状态/语言
components/                Shell、宿主输入、审核卡、图、上下文检查器
pages/                     页面目的、结构、行为、状态和交付边界
  task-detail/             五个工作面及 Task 页面总契约
flows/                     跨页任务路径与注意力引导
assets/                    提取的 tokens、CSS、资源使用清单
handoff/                   验收、差异、DOM 对照、来源覆盖与读者测试
sources/                   来源清单、hash、原始 UI/资源与方法快照
```

## 页面设计成熟度

| 页面 | 本次填充依据 | 可继承的结论 | 仍需设计或实现 |
|---|---|---|---|
| Task Detail / 五工作面 | 权威 UI 输入 + Task v7 | 交互原则、布局约束、状态与精确身份 | IR 服务接口、宿主集成、图引擎与恢复实现 |
| 新建 Task | 权威 UI 输入 + 系统 Task 语义 | Hero Composer、Workspace Slot、暂存状态 | Task/Session 持久化时点与事务衔接 |
| [Task Browser](pages/task-browser.md) | U1 跨页边界 + 用户逐项审核的 v8（D14） | 当前 Header、Gallery / List、分组加载、分页、选择、资源菜单和归档 / Pin | 真实数据、资源存储、跨导航恢复、公共 API；已归档资源入口为后续范围 |
| [Workflow Explorer](pages/workflow-explorer.md) | D01 / D15 + Task Browser + Workflow DSL | 同一浏览布局与交互，独立定义 / 版本语义；[v8](assets/crystra-workflow-explorer-v8.html)已生成 | 真实目录、资源存储与 Studio 接入 |
| [Workflow Studio](pages/workflow-studio.md) | U1 / D04 + 当前 Shell 与组件 + A3 布局 | [v8](assets/crystra-workflow-studio-v8.html)共享 Chat、分层活动图与语义资源浏览/编辑；[需求验收](pages/workflow-studio-contracts.md)已汇总；结晶分析 UI/UX 已定稿 | 候选布局运行时、正式绑定、包 envelope、事务 / 通知 / 保存发布接入 |
| [Analysis & Audit](pages/analysis-audit.md) | U1 + 当前 Shell 与组件 + S12 Trace | [v8](assets/crystra-analysis-audit-v8.html)已同步 Header / Sidebar 与 bench；复用 Waterfall / Tree，移除 Summary，目录使用可收起的搜索筛选侧栏；metric 类数据归总览 | 真实指标 / 索引查询 / 设置持久化 / 跨导航恢复；主题与逐元素契约缺口见本次审核 |

## 本包的可复用产物

- [统一检索组件](components/search-field-review.md)：已确认灰度聚焦与展开动效；样本和 v8 共用实现，页面通过插槽传入内容（D19）。

- [已确认公共卡片表面](foundations/card-surfaces.md)：Card、Widget 和大型组件统一使用圆角、6% 白色细边框、灰度底色与淡阴影（D17）。

- [图标语义清点与尺寸提议](foundations/iconography.md)：DeepSeek 校准尺寸与 Iconify 资源已采用；另含 Widget 48px 信号图标。

- [已接受字体与颜色资产包](assets/design-system/README.md)：独立 CSS/JSON、静态样式表、最终截图与校验清单。

- [页面五色语义与元素映射](foundations/color.md)：灰/蓝/绿/黄/红语义已接受，按 DSH 深色变量校准；图表配色独立，v8 已固定此样式。

- [语义化字体与字号基线](foundations/typography.md)：已选定 B「均衡」，Task v8 固定已接受样式；Browser 继承 B 的文字规则。

- [视觉规范](foundations/visual-language.md) 与 [tokens.json](assets/tokens.json)、[tokens.css](assets/tokens.css)：从现有稿提取，不重新生成风格。
- [资源画廊](assets/README.md)：已审核 Task Browser v8、Task v8 及组件稿；v6 / v7 作为来源对照。
- [完整 Task DOM 索引](handoff/task-dom-index.md)：每个静态 section 的结构、源码位置、契约出处与文档落点。
- [来源与效力](sources/README.md)、[内容摘要清单](sources/manifest.json)：可回查原始文档字节。
- [验证报告](handoff/validation-report.md) 与 [读者测试](handoff/reader-review.md)：仅声明实际完成的检查。

源资料快照在 `sources/`；其中 `sources/ui/assets/` 的文件保持原字节，供对照，不是按本次规范修正过的新原型。系统文档快照仅覆盖本次引用文件，内部历史/相对链接应回原仓库阅读。新编写文档中的导航链接则保持可用。

本轮公共基础入口：[组件聚类清单](components/component-inventory.md) · [间距与形状来源边界](foundations/spacing-and-shape.md) · [Input 整体宿主所有权](components/input-and-host-slots.md)。

Library组件选用与定制入口：[UI组件使用文档](components/library/README.md)。

- [已确认对比分析观察设置](components/result-analysis-review.md)：设置列表、三列编辑、按图形映射数据列、四档响应式分列及数据范围；已接入 Analysis v8（D22）。

- [2026-09-11 v8 文档、代码与主题审核](handoff/v8-design-audit.md)：不含 Workflow Studio，附静态逐元素库存、运行态库存和主题接入证据。
