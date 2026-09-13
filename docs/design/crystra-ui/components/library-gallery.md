# 可视组件展示

[离线展示](../assets/library-preview.html)默认进入表达方式；[基础组件](../assets/component-preview.html)单独展示。

| 分页 | 内容 |
|---|---|
| 表达方式 | 18 个表达样本，按数据语义关联为可切换变体 |
| Dashboard 与图表 | 同一 ExpressionWidget；类型限制尺寸、右键菜单、保存/取消、拖拽 ghost |
| Trace 瀑布图 | 已记录 Span 的时间关系与详情 |
| Trace 树图 | 调用结构与节点查看 |
| Trace 统计 | 专业统计视图 |
| Span 与回执详情 | 普通 Card 承载的详情 |

共 6 组。[表达与尺寸规范](widget-expression-design.md)是当前 Widget 视觉依据。Evidence、Inspector、表格与 Trace 详情仍属于普通 Card 或专业视图；底层契约不因此改变。旧 API 兼容实现不构成另一套视觉候选。

Dashboard 使用模拟数据；排列行为见 [Dashboard 文档](library/dashboard.md)，尺寸见 [表达设计](widget-expression-design.md)。本页不定义布局规则。

当前 Widget 样式已接受。下一步组件化按 [Widget / 展示组件 / Dashboard 契约](widget-component-contract.md)执行；本页是视觉证据，不代表稳定实例状态、公开定义或独立 Chart API 已实现。
