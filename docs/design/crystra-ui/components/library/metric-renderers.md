# 已有指标适配与槽位 API

范围：现有代码的兼容接口说明。此文只帮助调用已有 API；新 Widget 的职责见 [组件契约](../widget-component-contract.md)，视觉与尺寸见 [表达设计](../widget-expression-design.md)。旧适配器支持范围不限制新表达配方。

## MonitoringMetricPanel

输入正式 MetricResult；支持现有 numeric-card、badge、ratio-bar、table 注册 ID。多切片与异构明细按实际适配器消费，不把它们当成新的 Widget 语义分类。

| 属性 | 当前用法 |
|---|---|
| result | 必填 MetricResult |
| visualizer / size | 必须在现有 renderer 的兼容范围内 |
| title / titleIcon | 对象说明与已注册 Iconify 图标 |
| booleanLabels / booleanIcons | 显式布尔映射，不能从 True/False 推断业务成功/失败 |
| locale | zh-CN / en，当前默认 en |
| onEvidence / onExplain | 调用者负责实际目标 |
| shortTitle | 现有兼容属性，当前未消费 |

适配器当前内置完整数据详情入口，未提供关闭它的属性。这是现有 API 的限制，不是 Widget 标准动作。

[接口源码](../../../../../wsr-ui/packages/bi/src/components/monitoring-metric.tsx) · [公开导出](../../../../../wsr-ui/packages/bi/src/public.ts)。精确 props 与合法旧 renderer 组合以这些代码为准，不能从已撤下的演示分页推断能力。

## CompareResultFrame

现有入口必填 coordinate、delta；before/after 接收 MetricSlice 或对应 SideError。支持 title、beforeLabel、afterLabel、onEvidence、onExplain、onRetryFailedSide、ownsFailedSide、focusEvidenceSide、visualizer、monitoring 等现有属性，完整类型见 [源码](../../../../../wsr-ui/packages/bi/src/components/compare-result.tsx)。

Delta 使用输入结果；缺一侧不生成零差值。旧 monitoring 路径当前没有 size prop，focusEvidenceSide 不表示该路径已经实现焦点定位。这些是兼容接口事实，不是当前对比 Widget 的视觉要求。业务操作按实际需要提供。

## MonitoringWidget 与完整表格

已有 MonitoringWidget 提供 category、size、leading、title、subtitle、status、primary、visualization、supporting、footer、actions 等槽位属性。它不等于已完成稳定状态、快照与注册机制的新 Widget。见 [底座源码](../../../../../wsr-ui/packages/bi/src/components/monitoring-widget.tsx)。

完整 MetricResult 表格与详情保留字段和来源，不因旧 renderer 名称叫 table 而变成所有 Widget 的标准内容。[数据适配参考](../widget-use-cases.md)记录数据 owner 约束；本文不定义新业务公式或 Task / Delivery 状态。
