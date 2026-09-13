# Plan：审核封面、全文与完整 DAG

> 继承 U1 Plan 相关各节；A1；M2 仅补 section 用途。壳见 [Task Detail](README.md)。

## 三种浏览模式

| 模式 | section / 结构 | 用户问题 |
|---|---|---|
| 摘要 | `plan-summary`；`plan-outcome-summary`、`plan-dag-projection`、三张 readiness 卡、attention/change 卡 | 目标与非目标是什么，路径和边界是否可信 |
| 文档 | `plan-document-viewer`、固定 Header、outline + content | 完整目标、条件、约束、revision/source |
| DAG 章节 | `plan-full-dag`、toolbar + viewport/canvas + minimap/details | 大图的依赖、并行、汇合、恢复、Gate |

摘要 DAG 只投影主干，可按 Wave/子图聚合普通节点，同时显示 Wave/并行/恢复/关注数量。不能缩小完整大图冒充摘要。

三 readiness 卡分别为 control-envelope（自治、人工关口、恢复）、proof-readiness（验收/测试/证据）、context-health（权威来源/假设/冲突）。它们来源不同，不合成“计划质量分”。正常项聚合，异常展开；变化以当前 revision 对上一获批 revision。

## Plan 版本与投影更新（D10，已确认）

Plan 生成后对应版本固定。Gate 条件、Wave 内容、DAG 路径等计划语义修订必须 bump Plan 版本；勾检查单、运行进度与浏览偏好不因此 bump。语义修改经 Input 的 Plan IR 提案、校验及必要授权后提交，新版本驱动对应语义投影与相关 bench 同步更新，不能混合不同版本字段。

候选不等于已提交版本；历史 revision 的精确证据查看仍保留其引用，不被替换成最新内容。更新当前计划投影也不改绑已有 Delivery 的冻结 Manifest。版本号的具体格式与运行绑定字段留到数据契约，不重开“是否 bump / 是否同步”的产品选择。

## 操作表

| 入口 | 行为 | 保留与失败 |
|---|---|---|
| `plan-document-entry` | 当前 revision 全文首页 | Input 持续可见；无 revision 显示无法定位 |
| `plan-dag-entry` / `plan-document-dag-chapter-entry` | 同文档 DAG 章节 | 不重新生成 Plan，不更换 revision |
| `plan-document-back` | 回摘要，或显式来源 Gate | 来源由 from_gate_id，不能猜历史 |
| `plan-dag-document-back` | 回同文档正文 | 保留图搜索/折叠/pan/zoom |
| `plan-dag-search` | 名称/稳定 ID 查找定位 | 零匹配显示无结果，不近似选节点 |
| `plan-dag-collapse-branches` | 普通分支折叠/展开 | 不抹去 Gate/异常/恢复关系 |
| zoom / fit / canvas | 浏览视口 | 不移动节点改拓扑；fit 当前可见图 |
| 节点选择 | 更新 details | 展示目标、进出条件、依赖、风险、证据和状态 |

Gate 进入时显示 `plan-linked-gate-context`，固定实际引用的 Plan revision 与 `plan_anchor`；无来源时隐藏来源说明，避免陈旧文案。所有 Plan 修改与批准通过 Input。

## 原型与验收

文档切换、DAG 搜索/平移/缩放在稿中有演示；完整图 minimap 同步、跨页面/模式状态持久化及专用图引擎不能据此认为已实现。按 [图契约](../../components/graph-projections.md) 和 AC07/AC08 检查。预期注意力：Goal/非目标 → 主干 → 异常/控制边界 → 证据 → Input。
