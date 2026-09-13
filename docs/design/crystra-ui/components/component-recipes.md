# 现有工作台到组件的映射与属性配方

> 2026-09-10 已确认：所有 Card 概念容器统一采用[卡片表面规范](../foundations/card-surfaces.md)，包括 Widget 和大型可视化组件。默认边框为 6% 白色细线，保留圆角并配淡阴影。


> 2026-09-08。基础组件范围已确认；第一批组件已被用户接受；第二批 List / ListItem、Tabs、Menu 已接受；第三批控件与状态样本已接受。继承 wsr-ui，未实施包更名或改用 MUI。实现为 React + TypeScript + Tailwind CSS。

新增或扩展组件，以及将组件接入 v8 时，遵循[组件优先与新增设计审查指南](../handoff/component-first-guide.md)。现状对照样本不等于已审核组件。

## 已实施范围

| 组件 | 组合维度 | 当前实现 |
|---|---|---|
| Button | appearance × tone × size，disabled，startIcon / endIcon | 保留 outline / solid / ghost；旧 segment 兼容。原生属性、ref 和事件透传 |
| IconButton | 继承 Button 的属性与实现；必须有 aria-label | 不重复声明整套按钮类型；保留 SVG children，默认 type=button |
| Surface / Card | level × border，Card tone / padding | Surface 保留原有职责；Card 提供 heading、description、actions、content、footer 组合 |
| Typography | 文字角色 × family / weight / tone / decoration | Crystra 接入已接受文字角色，旧 h1 / h2 等入口保持兼容，HTML 标签由 as 决定 |
| Chip / StatusBadge | appearance × tone × size | Chip 是展示积木；StatusBadge 保留旧业务状态映射，不能把 tone 当作执行事实 |
| Divider | horizontal / vertical | 同一边界色，方向独立 |
| Icon | Iconify 图形名 × 已接受语义尺寸 | 本地 Tabler 子集，TypeScript 限定可用名称，无 Unicode 图标或运行时 CDN |

公共实现：[组件源码](../../../../wsr-ui/packages/bi/src/components/design-system.tsx)、[图标源码](../../../../wsr-ui/packages/bi/src/components/icon.tsx)。

## 默认值与尺寸

默认值集中于 [component-recipes.ts](../../../../wsr-ui/packages/bi/src/domain/component-recipes.ts)。Button 默认为 outline / neutral / compact；Card 默认为 panel / solid / regular padding。常用调用仅提供偏离默认的属性：

```tsx
<IconButton aria-label="复制" onClick={copyIdentity}>
  <Icon name="copy" />
</IconButton>

<Card
  heading="当前决策状态"
  actions={<Button onClick={openDetails}>展开</Button>}
>
  <Typography variant="body">决定内容</Typography>
</Card>
```

同名 size 表示组件内的相对档位，不要求不同组件机械等高：文字按钮 compact 32px / regular 36px，IconButton 28px / 36px，内部图标 14px / 18px。Card padding compact 12px / regular 16px，Card 圆角 12px，控件圆角 8px，Chip 使用 pill。以上是当前自有组件的基线配方，来源为 v8；不改变 DSH Input 的 22px 圆角、28px 附件和 34px 发送按钮。

Card 内容分组间距 12px、操作区间距 8px属于组件内部；页面和组件间布局 gap 仍由外层布局表达，不把这两个取值自动推广为页面间距。

## 主题与兼容边界

Crystra 以 `.wsr-bi[data-crystra-theme="dark"]` 显式启用。颜色、字号取自 [源快照](../../../../wsr-ui/design/crystra.tokens.json)，可重建 [主题 CSS](../../../../wsr-ui/packages/bi/src/crystra-theme.css)；旧 BI 继续使用原主题。

变体通过 [Tailwind 样式配方](../../../../wsr-ui/packages/bi/src/crystra-components.css) 的静态规则组合，不拼接 Tailwind 动态类、不引入 MUI 或 CSS-in-JS。通用配方排除整个 `data-host-owned` 子树；图表配色及其运动保持独立。

现有 `appearance="segment"` 和 StatusBadge 状态入口保留兼容。后续分组选择由 SegmentedControl / Tabs 收敛，而不是立即删除旧属性。此次不批量迁移所有 BI 页面。

## v8 回填

[实例映射清单](../assets/component-instance-map.json) 记录第一批 16 处元素：7 张卡片及其文字角色、9 个返回/复制/缩放操作。使用同一源码导出的 [组件配方 CSS](../assets/component-recipes.css)，移除对应元素重复的圆角、边框、背景及内边距工具类。

现有 section ID、交互处理器和布局保持：整个 Input 占满 Header 下方高度；两栏 divider；summary / nav / 内容共同滚动。Sidebar 已接受的 340ms 抽屉效果继续由原 CSS 单独控制，未被通用控件的 150ms 状态过渡替换。已有方案能满足当前需要，因此本批未增加动画依赖；后续复杂进出场或布局联动再按实需验证 Motion 等候选。

[v8 页面](../assets/crystra-task-work-v8-sidebar.html) · [可组合 React 样本页](../assets/component-preview.html)。样本页由真正的 wsr-ui 组件构建并导出为离线 HTML，不是另写一套模拟组件。

## 第二批：集合与导航组件

| 组件 | 属性与槽位 | 行为边界 |
|---|---|---|
| List / ListItem | size、divided；leading / primary / description / metadata / actions；selected | 主入口为原生链接、按钮或静态内容；右侧 actions 为兄弟节点，hover 与点击不触发主入口 |
| Tabs | value / onValueChange、items、soft / underline、size | 页内内容切换；方向键/Home/End 移动焦点，Enter/Space 激活；跳过禁用项，隐藏面板保留状态 |
| Menu | label、items、align、size；item icon / tone / disabled / onSelect | 操作菜单；选择或 Escape 返回触发器，Tab/外部点击关闭；默认从触发器下方展开、按下方可用高度内部滚动，外层滚屏/resize 时关闭；Browser 定位变体见下文 |

List regular 内边距 12px，compact 为 8px 12px，条目间 4px；主入口与操作区间隔 8px。Tabs compact / regular 高度 32 / 36px，间隔 4px。Menu 条目 padding 8px 12px，面板 padding 4px、圆角 8px，最小宽度 192px。这些是组件内部配方，不替代页面布局 gap。

[组合组件源码](../../../../wsr-ui/packages/bi/src/components/collection-components.tsx)。样本共用顶部尺寸选择器，并提供 Tabs 外观对比、资源主入口与菜单回显。示例操作不修改真实资源；分类、归档等规则仍由各页面提供。

v8 的 task-workbench-navigation 已接入 Tabs 外观，保留 radio 控制器、section ID 与滚屏。实例映射共 17 处。React 样本使用 tab/tabpanel 语义。Sidebar 排序面板是表单，Gate 队列是内容选择面板，不套用 action Menu；Sidebar 列表与抽屉动画保留。Menu 保持主题继承，使用 fixed 定位，应挂在没有 transform 或 paint containment 改变定位参照的祖先内。

## 第三批：自有控件与状态样本

| 组件 | 组合与职责 |
|---|---|
| SearchField / SelectField | 原生 input / select，label 与 size；select 保留原生值与事件，以可定制 picker 默认从控件下方展开；Browser 每页条数支持下方不足时向上翻转 |
| SelectionControl | checkbox / radio 与 label；checked、name、disabled 等由外层组合；不接管宿主审批 |
| Popover | 非模态内容浮层，支持交互式表单；Escape 返回焦点、外部点击或 Tab 离开关闭，从触发器下方展开，空间不足时限制高度并内部滚动 |
| EmptyState | 半透明 Iconify 空文件与静态骨架，缺数据用明确文案；不表示加载、不设 aria-busy |
| FullBenchViewer | 外层控制 expanded 与分配 bench 高度；预览截断，展开入口在右上；完整内容 y-scroll，返回恢复入口焦点，预览保持挂载 |
| ProgressNotice | 右下角通知，value 为外部提供的真实进度，范围 0–100；可关闭；样本按钮只用于演示，无虚构后台任务 |

字段 compact / regular 高度 32 / 36px；SelectionControl 图形 16px、行最小高 32px。Popover padding 16px、圆角 12px，定位约束与 Menu 相同，避免 transform / paint containment 祖先。空状态最小高度 120px；完整查看组件不得超过父级分配的 bench 高度。本次通知样本宽 320px，距右下边缘 24px。

长列表组件用于一个占满 bench 的视图：页面在 expanded 时应把它作为 bench 的当前内容；不要把完整查看组件继续嵌入多卡网格。组件本身只遵守父级边界，不推断页面路由。空集合仍为 EmptyState。搜索结果、筛选和预览状态在外层控制，返回不丢失；完整视图内部滚动位置暂随关闭重置。

这些状态在 [离线 React 样例](../assets/component-preview.html) 中集中展示；v8 保持已接受布局，不注入演示通知或改变真实工作面数据。通用布局尺寸已归并为 [资产](../foundations/spacing-and-shape.md)。Task Browser 的资源网格、表格与批量操作组合已审核，见下文；Workflow Browser 当前规则已归入正式页面；公共组件抽取与生产接入由 06c 跟踪，不等于基础组件目录全部实现。

## Toggle / Switch

位于 [基础组件预览](../assets/component-preview.html) 的 Button / IconButton 下方。圆角、方角分别提供纯滑块、滑块图标和双图标切换；每种并排展示两种初始状态，均可交互。沿用顶部 compact / regular 与禁用选择。

[ToggleSwitch 源码](../../../../wsr-ui/packages/bi/src/components/toggle-switch.tsx) 以 checked / onCheckedChange 控制状态；shape、size、icons / iconPlacement 独立组合。开关使用 switch 语义；Gallery / List 两种有效视图使用单按钮交替切换，两个图标保留在轨道上，滑块标记当前项。支持点击、Enter / Space、焦点可见、disabled 和 reduced-motion。

Task Browser 使用的方形双图标滑块及其交互已审核；外框和轨道高 36px，与相邻按钮一致。其他展示变体不因本页审核自动定稿，组件目前仍为内部实现，公开 API 尚未发布。

## 下拉菜单展开方向

SelectField 提供 `menuPlacement="top" | "bottom"`，默认 bottom。top 以触发器上边缘向上展开，空间不足允许 flip-block，保证移入 header 后仍可完整操作。页面传参数，不覆盖内部菜单样式；组件样本包含“向上展开”变体。

自有 Select、Menu 和菜单型 Popover 默认从触发控件下边缘向下展开；下方空间不足时限制面板高度并内部滚动，横向仍避让视口。此规则不改变宿主 Input 内部控件。Select 保留原生 value / onChange 和键盘语义，当前桌面 Chromium 通过 [可定制 select](https://developer.chrome.com/blog/rfc-customizable-select?hl=en) 与 [锚点定位](https://developer.chrome.com/docs/css-ui/anchor-positioning-api?hl=en) 控制 picker，样式见 [select-dropdown.css](../../../../wsr-ui/packages/bi/src/select-dropdown.css)。已在本机 Chrome 验证；其他内核须在引入时验证支持。


<a id="browser-resource-controls"></a>

## Browser 已确认的组件组合

以下是 [Task Browser](../pages/task-browser.md)（D14）和 [Workflow Explorer](../pages/workflow-explorer.md)（D15）共用的已确认配方。业务字段、归档 / Pin 的含义、选择集合与返回规则由页面维护；这里规定视觉积木及定位变体，不发布新组件 API，也不把页面局部 CSS 误记为全库已迁移。

| 组合 | 配方与行为 | 代码落点 |
|---|---|---|
| ButtonGroup | 筛选与图标排序相连；资源操作为归档 IconButton + 新建资源按钮，高 36px。归档有 tooltip / 可访问名称，无选择禁用；选中数量归结果栏 | [页面结构](../assets/task-browser-surface.html) |
| Resource Card + selection | Card 圆角 12px，选中外框在所有内容上方连续绘制，覆盖层 pointer-events: none；checkbox 与主入口为兄弟控件，不能嵌入链接 | [页面 CSS](../assets/task-browser.css)、[共用交互](../assets/resource-browser.ts) |
| Checkbox | 原生 input，CSS 自定无边框外观，18px 方形；圆角由 Card 圆角除以 3 得到 4px。没有深色外围底框；选中用 primary 底色 + 白色 Iconify Tabler check，部分选中用短横线，保留键盘、focus-visible、disabled | 同上；当前通过页面选择器应用到 Gallery、List 与全选 |
| Resource List | 表格直接铺在页面，无外围 Card 背景、边框或圆角；仅表头 / 相邻行横向分隔，保留 hover / selected；主入口与末尾 actions 隔离 | 同上 |
| Resource Menu | 三点 Iconify dots 触发，宽 168px、条目高 32px、padding 4px、圆角 8px；内容是页面提供的四个资源操作 | 同上；两种视图共用菜单生成与操作处理 |

菜单定位有三个明确使用场景：

- Gallery 右下角：向卡片内的左上方展开，不超出卡片外框。
- List 行末：按钮下方，以按钮右边缘为锚点向左展开，用浮层避免容器裁切；下方高度不足时内部滚动。
- List 底部分页 Select：优先向下，放不下完整选项时锚定控件顶部向上展开；这是该控件的已审核例外。保留原生选择和键盘语义，CSS 使用可定制 select 的 flip-block；[页面 CSS](../assets/task-browser.css)中单独限定，不改变宿主 Input。

Header 排序、分组以及无明确例外的通用菜单继续使用默认向下规则。位置策略按使用场景选择，不用一个全局“禁止向上”的规则覆盖已审核变体。按这些配方抽取公共组件是后续实现工作，已审核样式不依赖该抽取先完成。

Task / Workflow 当前浏览页已共用 resource-browser.ts、task-browser.css 与 React ToggleSwitch，各自通过页面适配器提供字段、过滤、排序与精确链接；这属于本地设计稿复用，BrowserConfig 尚不是公开生产 API。

已确认检索组件：[SearchField 统一设计与接入契约](search-field-review.md)（D19）。样本与 v8 共用实现；前缀、尾部及取消图标由页面通过插槽提供。
