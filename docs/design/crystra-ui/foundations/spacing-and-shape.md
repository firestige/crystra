# 空间、形状与动效语义变量

> 2026-09-10 已确认：所有 Card 概念容器统一采用[卡片表面规范](card-surfaces.md)，包括 Widget 和大型可视化组件。默认边框为 6% 白色细线，保留圆角并配淡阴影。


本表基于用户已接受的三批组件和 Task v8 实测归并，保留现有数值。布局与内部 padding 是独立用途，不能因为数值相同就绑定为同一变量。整个 DSH Input、图表与最终 Header 整合不在覆盖范围。

来源：v8 control-workspace 实测 padding 16px 20px 20px；工作面/卡片间隔 12px；前三批已接受的控件、卡片、浮层和空状态尺寸；Sidebar 已接受 340ms 抽屉过渡。

## layout

| CSS 变量 | 当前值 |
|---|---|
| `--layout-bench-inset-inline` | `20px` |
| `--layout-bench-inset-block` | `16px` |
| `--layout-section-gap` | `12px` |
| `--layout-card-gap` | `12px` |
| `--layout-input-min-width` | `360px` |
| `--layout-bench-min-width` | `680px` |
| `--layout-files-min-width` | `320px` |
| `--layout-bench-inset-end` | `20px` |

## shape

| CSS 变量 | 当前值 |
|---|---|
| `--shape-panel` | `12px` |
| `--shape-control` | `8px` |
| `--shape-detail` | `4px` |
| `--shape-pill` | `999px` |
| `--border-hairline` | `1px` |
| `--border-emphasis` | `2px` |

## component

| CSS 变量 | 当前值 |
|---|---|
| `--component-padding-compact` | `12px` |
| `--component-padding-regular` | `16px` |
| `--component-content-gap` | `12px` |
| `--component-control-gap` | `8px` |
| `--component-detail-gap` | `4px` |
| `--component-row-padding-block` | `8px` |
| `--component-control-padding-block-compact` | `5px` |
| `--component-control-padding-block-regular` | `7px` |
| `--component-control-height-compact` | `32px` |
| `--component-control-height-regular` | `36px` |
| `--component-icon-hit-compact` | `28px` |
| `--component-icon-hit-regular` | `36px` |
| `--component-card-min-height` | `120px` |

## overlay

| CSS 变量 | 当前值 |
|---|---|
| `--overlay-menu-min-width` | `192px` |
| `--overlay-popover-min-width` | `240px` |
| `--overlay-notice-width` | `320px` |
| `--overlay-notice-offset` | `24px` |

## motion

| CSS 变量 | 当前值 |
|---|---|
| `--component-motion-duration` | `150ms` |
| `--component-motion-ease` | `ease` |
| `--motion-sidebar-duration` | `340ms` |
| `--motion-sidebar-ease` | `cubic-bezier(.22, .68, .2, 1)` |

## 应用边界

- layout 用于页面外层。Input / bench / files 最小宽度沿用空间契约；这些数值不是物理屏幕分辨率断点。
- component 用于组件内部配方。32/36px 是文本控件档位，28/36px 是图标点击区；内部基线4/8/12/16px不自动替代页面间距。
- 120px 为已接受空卡/完整查看样本的最小高度基线。嵌套说明 Surface 不机械拉到120px；页面主卡遵守既定最小高度和整个 bench 的上限，长内容以完整查看承接。
- Sidebar 动效独立于普通控件过渡。reduced-motion 的既有处理保留；本次没有增加动画依赖。
- 边框1px为分隔/常规轮廓，2px为焦点等强调。图标描边不受组件边框变量覆盖。
- 少量装饰细节（骨架短线、Chip 内边距、图标本身尺寸）继续属于对应组件或图标配方，不扩成一套通用布局级别。

## 资产与重建

[JSON](../assets/geometry.tokens.json) · [CSS](../assets/geometry.css) · [可视查阅表](../assets/geometry-reference.html)。库内源文件为 [crystra.geometry.json](../../../../wsr-ui/design/crystra.geometry.json)。

在 wsr-ui 运行 `node scripts/sync-crystra-design.ts` 重建主题，再运行 `node scripts/export-crystra-geometry.ts` 和 `node scripts/export-crystra-recipes.ts` 导出。geometry.css 包含 v8 bench 内边距适配；通用组件消费相同语义变量。Task v8 的 Sidebar 过渡直接引用独立动效变量并保留fallback。

Task Browser 的资源 Card / 无外框 List、选择与操作组合已审核，具体配方见 [Browser 组件组合](../components/component-recipes.md#browser-resource-controls)。其 checkbox 圆角由资源 Card 圆角按比例派生，仍是组合内配方，不新增一套全局布局变量。Workflow Browser 继续按独立页面交付；不要求先实现整个候选组件目录，Header / Workflow / Analysis 仍按原计划后置。

2026-09-11：新增观测几何已纳入 observation 组。四档图表列宽、侧栏／编辑器及遮罩的消费链与实际探针见 [语义资产审核](theme-coverage.md)。


## 观测与对比分析的输出资产

已确认的图卡宽度、容器断点、自动间距输入、观察设置侧栏、编辑器三列、模态遮罩与目录动效进入 geometry 的 observation 组。用途与默认值见 [主题消费表](theme-coverage.md#观测布局角色)。布局算法与 CSS 均消费同一来源；数据坐标、用户选择和计算后的容器尺寸不作为主题常量。
