# 语义资产与 theme 接入边界

> 2026-09-11 差异修正后的消费链。覆盖 Task Work、Task Browser、Workflow Explorer、Analysis 四份 v8；不含 Workflow Studio 页面内容。

## 资产来源与消费

用途／场景 → 语义角色 → JSON → 生成的 CSS／TS → 组件 → 页面计算样式。生成文件不能单独修改。页面内容、数据坐标、用户设置与宿主自有 UI 不属于主题常量。

| 来源 | 用途与消费 |
|---|---|
| [颜色资产](../assets/color.tokens.json)、[颜色规范](color.md) | workspace/card/inset/floating、文本、状态、交互及边框角色；Browser 已从直接引用 palette 改为用途角色 |
| [geometry 源](../../../../wsr-ui/design/crystra.geometry.json)、[输出 JSON](../assets/geometry.tokens.json)、[CSS](../assets/geometry.css) | 共用空间形状与 observation 配置；sync 同时输出共享库主题和布局算法的 TS 默认表 |
| [字体资产](../assets/typography.tokens.json)、[字体规范](typography.md) | 页面标题、控件、元信息等用途；图内刻度与图例按图组件配方管理 |
| [Card 配方](card-surfaces.md)、[共享 CSS](../assets/card-surfaces.css) | 灰度背景、12px 圆角、白色 6% 弱边框、双层淡阴影。Browser 资源卡、Widget、追踪与比较图卡共用 |
| [组件配方](../components/component-recipes.md) | 表单使用共享控件；观察设置名称和图表标题使用 TextInput，模态使用 floating 与 shape-panel |

## 观测布局角色

完整值以 JSON 的 `groups.observation` 为准，以下是使用场景。CSS 名称加 `--` 前缀。

| 角色 | 默认值／用途 |
|---|---|
| `layout-comparison-card-min/max` | 480／640px，单卡宽度边界 |
| `layout-comparison-break-lg/xl/2xl` | 可用宽度 1044／1566／2080px，切为 2／3／4 列；更窄 1 列 |
| `layout-comparison-gap-min/max/ratio` | 16／32px、0.02，自动列间距算法的输入；实际测量结果不是静态主题资产 |
| `layout-comparison-sidebar-inner/width/gap` | 300／324／24px，设置目录与右侧分隔 |
| `layout-observation-editor-list/controls/gap` | 210／280／24px，编辑器三列；compact 为 170／240／16px |
| `layout-observation-editor-max` | 1840px，编辑器最大宽度 |
| `layout-observation-dialog-inset/width/dataset-width` | 48／600／740px，模态视口留白与普通／数据范围外壳 |
| `motion-observation-sidebar-duration/ease` | 340ms、cubic-bezier(.22,1,.36,1)，展开与收起；减少动态效果时禁用过渡 |
| `overlay-observation-backdrop/blur` | 黑色 60%、2px，原生 dialog 遮罩 |
| `component-trace-zoom-inset` | 6px，缩略图缩放控件安全留白；共享库独立使用也有生成的默认值 |
| `card-surface-shadow` | 双层淡阴影，与 Card 共用配方同源输出 |

FixedColumnChartLayout 从上述 CSS 变量读取配置，以同源 TS 表作默认值；响应容器与窗口尺寸变化。列数由宽度档位决定，不按图表数量缩减。普通列表、输入和对话框属于组件主题，仅绘图区使用 chart 配色作用域；旧页面颜色适配器不覆盖组件 owner。

## 验证与例外

浏览器探针覆盖 Card、名称输入、模态与侧栏间距，替换角色后读取最终计算样式。结果见 [审核报告](../handoff/v8-design-audit.md) 和 [原始探针](../handoff/v8-design-audit/runtime-elements.json)。这验证角色消费，不表示已经发布浅色主题。

`--browser-card-width` 是运行测量值；`--crystra-widget-*` 是可选宿主接口；`--tw-*` 属工具内部。图表系列色与 DSH 自有 UI 保持各自 owner，不机械转成页面五色。完整候选库存见 [theme-inventory.json](../handoff/v8-design-audit/theme-inventory.json)，扫描数量不等于缺陷数量。
