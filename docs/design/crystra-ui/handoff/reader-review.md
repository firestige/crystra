# 无上下文读者测试

> 后续状态补充（2026-09-07）：本报告保留初次审阅时的历史结论。F1 中 Studio 的 M3 候选状态已被用户 [D04](decisions-and-open-questions.md#d04) 覆盖：单一 Chat 写入与图只读已确认，具体页面交互仍待设计。

> 日期：2026-09-07。按 doc-coauthoring 的 Reader Testing 方法，独立审阅代理只读已整理文档与必要来源快照；没有继承本轮对话。此为文档可理解性检查，不是产品批准、用户测试或生产验收。

## 读者问题与实际回答

| 问题 | 读者回答摘要 | 依据 |
|---|---|---|
| UI 与系统效力如何区分？ | 先区分领域；系统遵从 docs owner/版本，UI U1>assets>memo | MASTER、来源/差异登记 |
| Task、Delivery、工作面、Session 是否不同？ | 分组、一次执行、当前判断、宿主展示绑定分别明确；禁止按 ID 相似合并 | foundations/product-and-domain |
| 哪些行为直接操作？ | 浏览与偏好允许；业务意图经 Input，由 owner 校验，选择 Gate 不构成授权 | MASTER、Input/图组件 |
| Gate 返回恢复什么？ | 精确 Gate/revision、队列、subject、草稿、滚动；显式来源，不回最近实例 | Gate 页面、navigation |
| Workflow/Execution/Trace 的差异？ | 允许拓扑、已发生事实/候选、记录的 parent/link 分开，不能推断因果 | 图组件、Analysis 页面 |
| 未决项在哪里？ | 新建时点、Browser 联审、Studio 编辑/发布、IR 和宿主映射均可定位 | 页面与 O01–O10 |
| 是否容易误读为全部审计/实现完成？ | 页面成熟度与验收目标明确区分，未形成合理的全面完成误读 | README、acceptance |
| 有无直接实现风险？ | 初读发现以下两项具体问题 | 下表 |

## Findings 与处理

| ID | 初读问题 | 修正 | 限定复查 |
|---|---|---|---|
| F1 / 中 | 公共图组件把编辑回 Input 写成无作用域规则，Studio workflow-map 行又未标候选，可能升级 M3 | Task 编辑禁令限定在 Plan/Execution；Studio 明确 M3 候选、内部审核待完成 | 独立代理复查 Closed，无新增矛盾 |
| F2 / 中 | 汇总稿漏掉 U1 对 Execution“直线/90° 正交折线、无曲线”的明确要求 | 图组件 Execution 专属段补回；AC11 同步检查 | 独立代理复查 Closed，无新增矛盾 |

复查只覆盖上述修订，未声称对每个源段落做独立逐字 parity。机械链接/静态 ID/快照核对见 [验证报告](validation-report.md)。O01–O10 是产品/实现待定事项，本次读者测试未将其关闭。
