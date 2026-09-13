# 语义化字体基线

> 2026-09-08。用户选定 B「均衡」，并接受当前 v8 方案。字号、行高和字重作为当前页面设计基线；右下角选择器及候选切换脚本已移除。Header 的最终信息整合仍后置。

## 角色与数值

组件先表达用途，再引用字号、行高和字重。相同字号可以属于不同语义角色：列表标题与正文都为 14px，分别以字重/行高区分。Header description 是说明，不是第二个标题。

主要阅读级差为 **24 → 18 → 16 → 14 → 12px**。品牌、徽标、图内标签属于受约束的专门用途，不强行占用标题层级。

| 角色 | 用途 | 字号 | 行高 | 字重 |
|---|---|---|---|---|
| `page-title` | 页面主标题 | 24 | 32 | 600 |
| `section-title` | 工作面焦点、当前问题、展开视图标题 | 18 | 26 | 600 |
| `card-title` | 卡片与信息分组标题 | 16 | 24 | 600 |
| `item-title` | 列表、证据入口、步骤的主标题 | 14 | 20 | 500 |
| `body` | 连续说明、AI 理解、Chat 正文 | 14 | 24 | 400 |
| `body-compact` | 检查清单、短事实、结构化内容 | 14 | 20 | 400 |
| `header-description` | 页面标题下的一行说明 | 14 | 22 | 400 |
| `description` | 列表副标题、卡片辅助说明 | 12 | 18 | 400 |
| `meta` | 版本、时间、计数、来源与状态标签 | 12 | 18 | 400 |
| `label` | 分区标签、字段组提示、kicker | 12 | 18 | 600 |
| `control` | 导航、菜单、按钮、输入文字 | 14 | 20 | 500 |
| `code` | 代码、路径、精确标识与预览 | 12 | 20 | 400 |
| `metric` | 独立汇总指标 | 20 | 28 | 500 |
| `brand` | 品牌字标；独立于内容等级 | 20 | 28 | 600 |
| `badge` | 受约束的计数徽标、步骤编号 | 11 | 14 | 500 |
| `graph-title` | SVG 节点主标签；viewBox 单位 | 13 | 18 | 500 |
| `graph-meta` | SVG 状态与边标签；viewBox 单位 | 11 | 16 | 400 |

单位为 CSS px。SVG 图内标签使用图坐标单位，最终显示大小受 viewBox 缩放影响。字体声明沿用 Inter 与系统回退，不包含 Inter 字体文件。图标字符的图形尺寸不作为文本字号档位，单独归入图标整理。

## 使用与交付

[已接受资产包](../assets/design-system/README.md) 提供独立 CSS、JSON 和 [离线样式表](../assets/design-system/index.html)。组件使用 `data-type="item-title"` 等角色或引用 `--type-*` 变量；无需 Tailwind。

[Task v8](../assets/crystra-task-work-v8-sidebar.html) 固定 B，不再响应字号候选参数。原稿 utility 仍在源代码中，由语义样式覆盖；原始 v7 来源快照保持原字节。元素来源见 [角色映射](../assets/typography-role-map.json)。

完整页面配色见 [颜色基线](color.md)，字体与颜色分别配置。图标尺寸、布局间距和 Header 最终整合不因本次字体资产生成而自动获得批准。

## 方法参考

[Carbon Type sets](https://carbondesignsystem.com/elements/typography/type-sets/) 提供紧凑与连续正文的区分；[Atlassian Applying typography](https://atlassian.design/foundations/typography/applying-typography) 提供角色共用字号、通过字重建立组件内层次的方法参考。最终 B 配置来自本项目用户评价。
