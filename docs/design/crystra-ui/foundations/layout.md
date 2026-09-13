# 空间分配与布局

> 继承：U1「空间模型」「空间模式」「Sidebar 信息架构」。资产值：A1。冲突 C01 见 [差异登记](../handoff/decisions-and-open-questions.md)。

## 当前全局前提

首期仅供用户本人使用，以 1920×1080 验证基础体验，覆盖 16:9 / 21:9 / 32:9 的更大屏幕。1920 是核心两栏必须能成立的基础宽度场景，不是“假定空间足够”而免验。其他低分辨率和移动端适配后置。

**屏幕规格是验收场景，实际可用宽高才是布局输入。** 在 1920×1080 的正常使用环境中，计入浏览器和宿主占用后，必须保留 Input 与 bench 的可用宽高。更大分辨率不直接进入某种布局模式；窗口、缩放、全局 Sidebar、Header 和 Better Sidebar 改变后都按实际容器重新分配。不使用物理屏幕分辨率或比例作为布局断点。

`workspace-header` 的三行及独立 `task-execution-summary` 横条不再作为最终组合：Task 摘要拟纳入 Header；Workflow/Analysis 先完成页内二级导航和内容设计，再统一 Header 的信息、尺寸和布局。未定稿前不重绘来源 HTML。

## Task Browser 布局

已审核 Browser 复用全局 Sidebar，右侧整面替换为 Browser；Header 组合与下方单一内容滚动区见 [页面规范](../pages/task-browser.md#页面布局与字段)。Gallery 的资源卡片不套总 Card，List 同样不套 Card，仅保留行分隔线。Browser 不使用 Task 的 Input / bench 两栏，也不据此改变下面的工作台空间要求。其 Header 组合已确认，其他工作台 Header 仍归 L01。

## 当前两栏布局

用户最新裁定：Input 与 bench 之间使用垂直 divider；Input 占满 Header 下方可用高度，不在 Input 上方叠加执行 summary。v8 将 summary、工作面导航和内容放入 bench 同一个滚动区；两者随内容滚走，不固定、不 sticky，不预留固定高度。后续 Header 整合仍由 L01 处理。

```text
全局 Sidebar │ Task Header
             │ Input 消息与 Composer │ divider │ 执行摘要
             │                      │         │ 五工作面导航 + 只读投影
             │ 可选文件工具面：按核心剩余宽高选择右侧、底部或收起
```

垂直分隔线属于外层布局，不给宿主 Input 增加内部边框或内边距。Input 使用两栏区域的完整高度；bench 内的摘要、导航及工作面内容共同滚动。摘要按 bench 实际可用宽度换行，不横跨 Input，也不据此重开字体/颜色规则。

Input 与 Control 尽量同屏。保留优先级：Input + Control > 全局导航 > 文件工具面。完整 Plan、DAG 或 Gate Inspector 只替换右侧内部内容，Input 不被遮挡；跨一级页面则整体替换主表面。

U1 最小可读宽度：Input **360px**、Control **680px**、文件工具面 **320px**。这些是约束，不能被 CSS 较低值覆盖。

## 历史原型模式及尺寸（不是正式断点）

| 模式 | viewport 参考宽度 | 布局/停靠规则 | A1 提取值与效力 |
|---|---:|---|---|
| 紧凑 | <1440px | 导航压缩；文件在底部；优先保留核心同屏 | Sidebar 220px；HTML Input 340 / Control 540 与 U1 冲突，不继承 |
| 标准 | 1440–1919px | Sidebar + Input + Control；文件默认关、开时在底部 | Sidebar 260px；Input/Control 38:62；gap 16px、外围 20px |
| 宽屏 | 1920–2879px | Input 限宽、Control 弹性，文件可在右侧 | Input 420–480px；Control ≥680px；文件 400px |
| 超宽 | ≥2880px | 稳定分区、限制无意义卡片拉宽 | Input 500–560px；Control ≥1000px；文件 `clamp(640px,23vw,900px)` |

底部文件面高度示例为 `clamp(240px,32vh,340px)`。Header 基准最小高 112px，紧凑 CSS 为 96px；执行摘要最小高 88px。以上是原稿测量，不是新的永久断点或最终响应式规范。

## 基于可用空间的分配规则

空间协调器读取 DSH 挂载容器的实际 CSS 宽高。浏览器内容视口已排除外部浏览器工具栏，不重复扣减；从宿主可用区域继续扣除内部固定占用。

- 横向：核心可用宽度 = 宿主内容宽度 − 全局 Sidebar − 外边距/边框 − 右侧文件面及其间隔。剩余区域必须容纳 Input ≥360px、Control ≥680px 和核心 gap。
- 纵向：Input 可用高度 = 宿主内容高度 − Header 的实际占用 − 外边距/边框 − 底部文件面及其间隔。摘要和工作面导航是 bench 滚动内容，不从 Input 或 bench 视口扣除固定高度。Composer、工作面正文和固定返回等控件必须保持可用；单卡高度上限使用此处实际 bench 高度。
- Better Sidebar 右侧停靠只有在保住核心宽高、文件面宽度 ≥320px 后才成立。底部停靠同样必须检查剩余核心高度，不能因为横向变宽就忽略高度，也不能把“宽度不足”直接等同于“底部一定放得下”。
- 保留优先级为 Input + Control > 全局导航 > 文件工具面。按可用空间使用可行的停靠方式，必要时折叠全局导航或收起文件面；不因打开文件挤掉核心两栏。源稿中的 1920/2880 等 viewport 数字仅供对照，不作为自动选择规则。
- 所有尺寸与停靠变化由同一个空间协调器处理，不卸载 Task、Session、Workbench、文件 Tab 或草稿。更大屏幕只是提供更多可能可用的空间，不构成强制三栏或超宽模式的依据。

首期必须验证 1920×1080 基础场景中的核心两栏，以及全局 Sidebar 开/合、Better Sidebar 开/关及可行停靠组合。真正低于该使用基线的布局扩展后置，不免除基础场景中浏览器、Header 与文件面占用的核算。

## Control-bench 卡片约束

用户 D05 已确认：卡片有最小高度，最大不超过当前工作面可用高度；缺数据保留骨架空卡；大量内容省略，纵向列表通过卡片右上角展开到占满工作面的专用组件，固定返回入口并提供 y-scroll。详见 [卡片规范](../components/review-surfaces.md)。这覆盖原资产中单卡无限增高的做法；卡片最小高度在目标场景中按类型确定；极小窗口的尺寸冲突后置，不阻塞首期设计。

## 滚动与高度

- Header 保留外层上下文；右侧 summary、工作面导航和内容在同一滚动区内滚动，不固定或 sticky。消息流与右侧滚动区相互独立。
- `conversation-feed` 和 `control-workspace-scroll-region` 隐藏滚动条但保留键盘/鼠标/触摸滚动；不全局套用到 Plan、DAG、Inspector。
- Sidebar 三个 section 非互斥折叠；Task 展开时取剩余高度，Workflow/Analysis 取自然高度。
- `task-list` 独立滚动；`all-tasks-action` / `all-workflows-action` 位于各自标题行右侧，不属于列表滚动内容。标题行的搜索、视图和全部入口按 [Sidebar 正式设计](../components/shell-and-sidebar.md)排列。品牌、新建和 Footer 固定，divider 属于 Footer。
- 空间不足时固定 Header 不得覆盖焦点和输入。嵌套视口的焦点、滚动复原见状态文档。

## 状态保存与组件所有权

分栏宽度、Sidebar 展开、文件面位置/开关按空间模式分别保存；跨模式使用该模式偏好或安全默认，不把超宽像素值恢复到小窗。切换断点不卸载 Task、Session、Workbench、文件 Tab 或草稿。

空间协调器唯一决定停靠；Better Sidebar 与 Crystra 不各自改同一网格。宽屏工具面内部树/编辑器比例归插件，此包只保留公共挂载边界。
