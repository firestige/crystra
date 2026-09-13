# 用户流程与注意力引导

这些流程描述用户完成任务的交互路径，不定义 Workflow 执行状态机；可以往返、分支和重复。注意力顺序是本次整理建议，未经眼动或用户测试验证。

| 场景 | 文档 | 重点 |
|---|---|---|
| 定义、审查与继续 Task | [task-work](task-work.md) | 连续 Input、自由查看、当前可交付判断 |
| 执行排查与证据核对 | [execution-and-evidence](execution-and-evidence.md) | 两级 Run、精确身份、返回恢复 |
| 多 Gate 决策 | [gate-decision](gate-decision.md) | 同快照、明确 subject、authority |
| 全局浏览与 Workflow | [cross-page-browsing](cross-page-browsing.md) | 一级页面替换、精确 revision、浏览与恢复边界 |

跨流程不变量：只读投影直接操作不产生业务 mutation；用户的业务意图进入 Input，经对应 owner 校验。共同返回状态见 [navigation](../foundations/navigation.md)。
