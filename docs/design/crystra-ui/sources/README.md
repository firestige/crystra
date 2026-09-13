# 来源、效力与方法

## 阅读规则

UI authority：U1 > A1–A4 / I1–I3 > M1–M3；系统语义以原仓库 docs 对应 owner 为准。文件自身候选/已发布/规范语言状态保持有效。本次仅整理，不提升 publication status。所有快照 SHA-256 见 [manifest.json](manifest.json)。

UI 快照保持原文与 assets 相对路径；系统快照是选取文件，不闭包复制原仓库。其内部链接可能需回原 docs 阅读，下表提供原位置。

## UI 输入

| ID | 输入 | 用途 |
|---|---|---|
| U1 | [Task 权威输入](ui/task-control-workbenches-design-input.zh-CN.md) | 已接受设计输入，尚非实现规范 |
| M1 | [task-browser-design-memo.zh-CN.md](ui/task-browser-design-memo.zh-CN.md) | 过程 memo；M2 只补精确定位 |
| M2 | [task-page-prototype-contract-index.zh-CN.md](ui/task-page-prototype-contract-index.zh-CN.md) | 过程 memo；M2 只补精确定位 |
| M3 | [workflow-pages-design-memo.zh-CN.md](ui/workflow-pages-design-memo.zh-CN.md) | 过程 memo；M2 只补精确定位 |
| A1 | [crystra-task-work-v7.html](ui/assets/crystra-task-work-v7.html) | 设计稿，具体成熟度见页面 |
| A2 | [crystra-task-browser-v7.html](ui/assets/crystra-task-browser-v7.html) | 设计稿，具体成熟度见页面 |
| A3 | [crystra-workflow-studio-v7.html](ui/assets/crystra-workflow-studio-v7.html) | 设计稿，具体成熟度见页面 |
| A4 | [crystra-analysis-audit-v7.html](ui/assets/crystra-analysis-audit-v7.html) | 设计稿，具体成熟度见页面 |
| I1 | [crystra-task-work-v6.png](ui/assets/crystra-task-work-v6.png) | 仅风格参考 |
| I2 | [crystra-workflow-studio-v6.png](ui/assets/crystra-workflow-studio-v6.png) | 仅风格参考 |
| I3 | [crystra-analysis-audit-v6.png](ui/assets/crystra-analysis-audit-v6.png) | 仅风格参考 |

## 系统文档 owner 索引

| ID | 原 docs（系统 authority） | 本次快照 | 读取重点 |
|---|---|---|---|
| S1 | [agent-architecture.md](/Users/firestige/Projects/workflow-self-recursive/docs/agent-architecture.md) | [快照](system/agent-architecture.md) | Concept：Task/Delivery/Session 与跨系统不变量；英文规范，candidate 状态保留 |
| S2 | [systems/execution/project-execution-system.md](/Users/firestige/Projects/workflow-self-recursive/docs/systems/execution/project-execution-system.md) | [快照](system/systems/execution/project-execution-system.md) | Execution：M01/M02/M03、admission、TaskPrompt、绑定与发布状态 |
| S3 | [systems/evidence/evidence-system.md](/Users/firestige/Projects/workflow-self-recursive/docs/systems/evidence/evidence-system.md) | [快照](system/systems/evidence/evidence-system.md) | Evidence：只读事实/Query/缺失，注意候选 addendum |
| S4 | [systems/evidence/delivery-manifest-projection.md](/Users/firestige/Projects/workflow-self-recursive/docs/systems/evidence/delivery-manifest-projection.md) | [快照](system/systems/evidence/delivery-manifest-projection.md) | Manifest：task.binding 与 exact digest 投影 |
| S5 | [systems/evidence/delivery-observation-lifecycle.md](/Users/firestige/Projects/workflow-self-recursive/docs/systems/evidence/delivery-observation-lifecycle.md) | [快照](system/systems/evidence/delivery-observation-lifecycle.md) | Lifecycle：Query1.0 candidate Delivery 整体保留/删除 |
| S6 | [systems/evolution/evolution-system.md](/Users/firestige/Projects/workflow-self-recursive/docs/systems/evolution/evolution-system.md) | [快照](system/systems/evolution/evolution-system.md) | Evolution：Task membership、receipt、MetricResult/Delta owner；Iter5 candidate |
| S7 | [systems/evolution/metric-computability.md](/Users/firestige/Projects/workflow-self-recursive/docs/systems/evolution/metric-computability.md) | [快照](system/systems/evolution/metric-computability.md) | Metric computability：输入与缺失/兼容性约束 |
| S8 | [contracts/evaluation/metric-catalog.md](/Users/firestige/Projects/workflow-self-recursive/docs/contracts/evaluation/metric-catalog.md) | [快照](system/contracts/evaluation/metric-catalog.md) | 已冻结 Catalog 历史版本；不替代 S14 当前候选目标 |
| S9 | [contracts/evidence-query/evidence-query.md](/Users/firestige/Projects/workflow-self-recursive/docs/contracts/evidence-query/evidence-query.md) | [快照](system/contracts/evidence-query/evidence-query.md) | Evidence Query 历史 0.1 与各自 scope；新候选见 S4/S5 |
| S10 | [contracts/workflow/workflow-definition-dsl.md](/Users/firestige/Projects/workflow-self-recursive/docs/contracts/workflow/workflow-definition-dsl.md) | [快照](system/contracts/workflow/workflow-definition-dsl.md) | Workflow DSL 1.1 已发布 definition/validator-only；不是 Runtime 交付 |
| S11 | [workflow-composition-model.md](/Users/firestige/Projects/workflow-self-recursive/docs/workflow-composition-model.md) | [快照](system/workflow-composition-model.md) | Composition：支持导航，冲突让位 Concept/Execution/Evidence owner |
| S12 | [systems/bi/bi-studio-ui-ux-design.md](/Users/firestige/Projects/workflow-self-recursive/docs/systems/bi/bi-studio-ui-ux-design.md) | [快照](system/systems/bi/bi-studio-ui-ux-design.md) | BI Studio：Host/core 边界、真实 Trace IR/renderer 与有限动效 |
| S13 | [reference/wsr-authority-mapping.md](/Users/firestige/Projects/workflow-self-recursive/docs/reference/wsr-authority-mapping.md) | [快照](system/reference/wsr-authority-mapping.md) | WSR 坐标迁移 authority；品牌整理不变更包/协议/数据 identity |
| S14 | [contracts/evaluation/metric-catalog-2-candidate.md](/Users/firestige/Projects/workflow-self-recursive/docs/contracts/evaluation/metric-catalog-2-candidate.md) | [快照](system/contracts/evaluation/metric-catalog-2-candidate.md) | Catalog2 candidate：S6 的当前实现目标，不当成已发布 Contract |

## 四个 skill 的实际应用

| Skill | 本包采用的方法 | 输出位置 | 未自动继承的部分 |
|---|---|---|---|
| design-system | tokens、组件变体/状态、模式、audit 差异 | foundations / components / assets / handoff | 不以工具建议替换用户风格，不发布代码 API |
| design-handoff | 页面布局、token 引用、状态、边界、动画、验收 | pages / handoff/acceptance | 没有 Figma 时不声称读取精确 Figma 数值 |
| UI UX Pro Max | MASTER+页面差异、定向 UX 搜索、焦点/动效检查 | MASTER / pages / targeted search | 此为已有设计整理，未重生成 palette 或照搬移动端默认值 |
| doc-coauthoring | 上下文汇集、按读者拆章、来源核对、Fresh Reader | 本目录结构与 reader-review | 用户已授权直接输出，按该范围连续执行，不重复逐节询问 |

[design-system](methods/design-system.SKILL.md) · [design-handoff](methods/design-handoff.SKILL.md) · [UI UX Pro Max](methods/ui-ux-pro-max.SKILL.md) · [doc-coauthoring](methods/doc-coauthoring.SKILL.md)

前三个远程 skill 固定 Git commit 与内容 hash 在 manifest；doc-coauthoring 固定本地读取字节。仅作任务方法快照，没有安装到全局 skill 目录。[定向查询](methods/ui-ux-pro-max-search.md) 的首项分别匹配 Focus States 与 Reduced Motion，适用于网页工作台，采纳为补充检查，不宣称额外无障碍等级已通过。未使用设计系统生成器覆写已接受的配色。

## 本次新增内容的身份

目录、逻辑路由名、组件概念名、中文术语对照、注意力顺序、Clipboard/加载等补充反馈属于整理建议。已接受交互按 U1 继承；资产值标明提取，memo 意图标为过程候选。来源内容中的任何示例数字、HTML 状态或审计统计均不是生产数据或 API 版本。

