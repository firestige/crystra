# SearchField 统一检索组件（已确认）

2026-09-10 用户已确认灰度表面与展开动画设计（D19）。[组件样本](../assets/component-preview.html)与所有 v8 搜索入口调用同一共享实现。遵循 [组件优先指南](../handoff/component-first-guide.md)。

## 参考与选择

- [MUI FilledInput](https://mui.com/material-ui/api/filled-input/) 支持前后装饰、隐藏标签、关闭下划线，并将 focused 状态放在组件根部。采用统一容器承载输入与前缀的结构。
- [Vuetify Text fields](https://vuetifyjs.com/en/components/text-fields/) 的 solo / filled 方向以填充表面组织控件；[官方 v2 示例](https://v2.vuetifyjs.com/en/components/text-fields/)也展示 solo 形式。参考表面式结构，不直接照搬默认主题色。
- [Tailwind 状态示例](https://tailwindcss.com/docs/hover-focus-and-other-states)提供 hover、focus-within、disabled 等组合方式。采用容器 focus-within 统一反馈；Tailwind 的状态工具本身不规定最终视觉。

以下灰度、阴影与动效是结合本项目 Card 规范提出的设计，不是上述库的默认配色。

## 已确认状态

| 状态 | 反馈 |
|---|---|
| 默认 | #29292c 表面、12px 圆角、6% 白色细边框、已有 Card 的淡阴影 |
| 悬停 | 表面变为 #303034，边框不变 |
| 聚焦 | 整体表面变为 #3b3b40，阴影略加深，前缀提亮；无蓝色外框、无新增外部 outline |
| 内部 input | 透明、无边框、无 outline、无 box-shadow；聚焦样式只由容器承担 |
| 输入后 | 不靠“有值”伪装焦点；失焦即恢复普通表面，保留内容 |
| 禁用 | 降低透明度，不响应 hover 或 focus |

鼠标点击和键盘聚焦使用相同表面反馈；160ms 过渡，reduced motion 下取消过渡。展开式搜索打开后复用相同 SearchField；Escape 或关闭按钮收起并返回触发按钮焦点。关闭图标无边框、无背景、无阴影；悬停或键盘聚焦仅提亮图标，键盘聚焦略加粗笔画。展开与收起使用同一个放大镜，在右侧触发位置和左侧前缀位置间以 340ms 平滑移动；输入表面同步展开／收起，标题淡出／恢复。动画期间 DOM 保持挂载，收起时输入区域 inert；reduced motion 下立即切换。

## 组件与页面的职责

SearchField 默认采用已确认表面；`appearance="default"` 仅保留历史对照兼容。页面不再通过局部 CSS 定义搜索边框、聚焦或前缀样式。

| 共享组件提供 | 页面传入 |
|---|---|
| `leading` / `trailing` 插槽及间距、对齐 | 任意图标、文字和尾部操作内容 |
| `hideLabel`、`size`、`disabled` 等语义属性 | label、placeholder、可访问名称、尺寸需求 |
| 标准输入事件与受控值 | 检索值、过滤或定位数据的处理函数 |
| ExpandableSearchField 展开状态、动效、Escape 与焦点恢复 | `expanded` / `onExpandedChange`，以及 `value` / `onValueChange` |
| 展开前后图标的位置与运动 | `leading`、可替换的 `triggerContent`、`cancelIcon`、`cancelLabel`；默认图标不限制调用方替换 |
| 收起时的标题位置 | `title` ReactNode，由页面提供标题或图标组合 |

共享控件统一风格、布局、交互，不枚举或限制前缀内容，不从页面类型推断 placeholder。展开图标默认与前缀复用同一内容；需要不同内容时允许传入 triggerContent。隐藏可见标签仍须提供可访问名称。

## v8 接入与更新链路

- 调用时间线、调用记录目录：React 页面直接调用 SearchField；各自保留过滤数据逻辑。
- Task / Workflow 侧栏：静态 Shell 的适配器挂载 ExpandableSearchField，连接既有目录过滤及展开状态；适配层只负责宿主布局和数据事件。
- Task Browser / Workflow Explorer、Plan DAG：适配器挂载 SearchField，分别提供图标或文字前缀，连接原有过滤或节点定位逻辑。
- Workflow Studio 目前只有公共侧栏的搜索入口，不额外制造搜索场景。

实现源为 `wsr-ui/packages/bi/src/components/state-components.tsx`、`expandable-search-field.tsx` 和 `search-field.css`；静态接入使用 `search-bridge.tsx`。内容由调用方传入，所有可见搜索控件使用共享实现。

修改共享组件后，应重建组件样本、workbench 和 search-bridge。`assets/sync-search-components.mjs` 将同一组件产物同步到五个 v8；浏览器与 workbench 页面生成器也调用该同步步骤。HTML 是导出产物，源码修改后需重新构建，无需逐页重新设计或复制样式。

已确认样本包含纯输入、图标前缀、文字前缀、展开式、框外标签与禁用状态。旧样式仅保留在可折叠的现状对照区。

统一重建入口（仓库根目录）：`node tmp/20260907/Crystra-ui-design/assets/build-v8-search.mjs`。它重建共享控件、组件样本和 workbench，并重新生成及同步五个 v8；基础 Browser 切换组件使用仓库现有 dist-browser-switch 产物。

### Prefix slot 的尺寸职责（2026-09-10 已确认，D20）

Prefix slot 随注入内容自然撑开，最大宽度为搜索框内容区的 45%，到达上限后约束内容，为输入区保留空间。共享 SearchField 不根据内容类型自动规定固定宽度；注入下拉菜单等元素的宽度由调用页面布局控制。

Delivery 目录的下拉 prefix 组合及筛选布局见 [已确认设计](delivery-directory-review.md)。业务检索规则由页面和查询适配器实现，不固化到 SearchField。
