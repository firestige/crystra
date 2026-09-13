# 页面五色语义与图表配色边界

> 2026-09-08。用户已接受页面五色语义方案及图表配色独立边界。字体 B「均衡」已选定。本轮颜色数值按本地 DSH 深色主题校准，用户已接受当前显示方案，作为资产生成基线。

## 页面色系

| 色系 | 当前基色 | 语义用途 |
|---|---|---|
| 中性灰 | `#151517` | 背景、卡片、列表、文字、边框；普通、非活动、不可用状态 |
| 蓝 | `#679efe` | 交互、选中、信息说明、运行 |
| 绿 | `#22c55e` | 成功、满足、有效 |
| 黄 | `#f59e0b` | 关注、警告、待裁决 |
| 红 | `#f25a5a` | 失败、错误、阻断 |

黑白是中性色亮度混合端点，不另加业务色。页面不保留紫色结构色或青色资源色；资源名称与身份标记用中性前景，操作入口用蓝色，资源有效性按实际状态用绿/黄/红。图表可自行使用紫色、青色或其他配色，它们不是页面主题变量。

## 语义与数值分层

**五个基色 → 亮度/透明度变体 → 元素语义角色**。

组件使用语义变量。选中与运行同属蓝色，但分别引用 interaction-selected 和 status-running，避免把用户选中误作执行事实。info 表示说明或 AI 当前理解，不表示已经确认；success 不替代证据；warning 不合并 Gate 待审核与速度偏慢；error 不自动终止整个 Task。

| 用途 | 当前取值方法 |
|---|---|
| 背景、Sidebar、卡片、Composer | 采用 DSH 对应的 bg、sidebar-fill、input-major 变量 |
| 主要、次级、辅助文字 | 采用 DSH label-primary/secondary/tertiary |
| 彩色文字、状态点 | 直接使用 DSH business/success/warn/error 主色，不额外混白 |
| 选中、提示底色 | 对应基色 12% 透明度，保留 Crystra 已定选中形态 |
| 状态边界 | 对应基色 58% 透明度 |
| 普通边框、hover、pressed | 采用 DSH border 与 interactive 变量 |
| 新建 Task | DSH 中性 elevated-fill，与宿主新建会话的视觉一致 |
| Composer 发送 | DSH button-info-fill/hover，配白字，保持可用状态 |

相同语义的文字不再普遍混白成粉彩；状态颜色与宿主一致。卡片、Input 与 Sidebar 的层次同时校准，避免只调整几个彩色点而保留另一套冷灰背景。当前仍是单一深色原型，不新增主题切换设置。

CSS 保留 palette 变体 → color 语义别名的引用链。DSH 已有明确值的变体标为 `host(--dsw-...)`，额外透明变体继续从五个基色派生。使用宿主色阶属于同一中性色系，不新增主题色。修改宿主引用或基色后由生成脚本同步，不手改各组件。

## DSH 对齐依据

读取本地部署 [DeepSeek Harness](http://127.0.0.1:3080/) 的深色计算样式（仅在独立浏览器上下文设置深色偏好），并核对已安装的 `@deepseek-ai/dsh-client-ui-theme`、`dsh-client-ui-sidebar`、`dsh-client-ui-conversation` 的 `lib/client.js`。三个包均为 **0.1.1-rc.2**。3080 此部署使用 HTTP，HTTPS 访问不能建立连接。

[DSH 变量快照](../assets/dsh-theme-reference.json) 只保留相关颜色、包版本与来源位置，不包含会话内容。关键映射如下：

| Crystra 用途 | DSH 变量 | 深色值 |
|---|---|---|
| 工作区背景 | `--dsw-alias-bg-base` | `#151517` |
| Sidebar | `--dsw-specific-sidebar-fill` | `#1b1b1c` |
| 卡片 | `--dsw-alias-bg-layer-1` | `#232324` |
| 内嵌条目 / Composer | `--dsw-alias-bg-layer-2` / `--dsw-specific-input-major` | `#2c2c2e` |
| 浮层 | `--dsw-alias-bg-layer-3` | `#353638` |
| 主要文字 | `--dsw-alias-label-primary` | `#f9fafb` |
| 次级文字 | `--dsw-alias-label-secondary` | `#cfd3d6` |
| 辅助文字 | `--dsw-alias-label-tertiary` | `#adb2b8` |
| 蓝色交互 / 运行 | `--dsw-alias-state-business-primary` | `#679efe` |
| 成功 | `--dsw-alias-state-success-primary` | `#22c55e` |
| 警告 | `--dsw-alias-state-warn-primary` | `#f59e0b` |
| 错误 | `--dsw-alias-state-error-primary` | `#f25a5a` |

这些是已核对的当前宿主样式，不是新系统契约。独立 HTML 使用快照解析值；实际插件集成时按宿主变量提供的作用域接线，不宣称原型已实时绑定部署站点。


## 图表拥有自己的配色

v8 的四个 DAG/运行图 SVG 及显式图例使用 `data-color-scope="chart"`。页面颜色适配器排除该元素及其后代，保留图表原有的节点、边、文字、画布、网格、渐变与运行效果。新图表同样声明此作用域，图内图例应放入相同颜色作用域。

页面卡片、导航和图外说明仍使用页面五色。图表可使用自己的颜色区分节点类型、数据系列、控制边界等；原稿紫色 Gate 类型可以保留，不因页面五色而变成黄色“等待审核”。颜色自由度不改变既有 Task/Delivery 概念、图中文字、线型或状态规则。

图内配色仍需自身一致，并保证节点/图例/线条含义对应；不将图表中某个颜色自动提升为页面主题变量。页面颜色适配不覆盖图表的颜色。

## 页面元素映射

| 元素 | 角色 |
|---|---|
| Shell / Sidebar / 工作区 | background-shell/sidebar/workspace |
| 卡片 / 卡内条目 / Input | background-card/inset/composer |
| 普通列表项 / 悬停 / 按下 | 透明 / interaction-hover/pressed |
| 当前 Task / 工作面选中 | interaction-selected、selected-border、selected-text |
| 新建 Task | background-neutral-action，保持中性操作定位 |
| Composer 发送 | interaction-primary、text-on-primary |
| 键盘焦点 | border-focus |
| AI 当前理解与差异说明 | status-info-* |
| 图外运行状态 | status-running-* |
| 成功、有效、满足 | status-success-* |
| 关注、待裁决、警告 | status-warning-* |
| 失败、错误、阻断 | status-error-* |
| 非活动/不可用 | 中性角色；保留实际状态文案 |
| 资源/证据入口 | 中性身份文字，蓝色操作入口，状态另行表达 |

## 当前变量表

状态通常提供 text / surface / border / solid 四种用途；复用同一色系不等于共用同一个语义变量。阴影/遮罩的 ref 是中性颜色来源，value 同时包含透明度与几何参数。

| 语义变量 | 用途 | 色系变体 | 当前展开值 |
|---|---|---|---|
| `background-shell` | 最外层背景 | `neutral.shell` | `#151517` |
| `background-sidebar` | Sidebar 背景 | `neutral.sidebar` | `#1b1b1c` |
| `background-workspace` | 工作区背景 | `neutral.base` | `#151517` |
| `background-card` | 卡片底色 | `neutral.card` | `#232324` |
| `background-inset` | 卡内条目底色 | `neutral.inset` | `#2c2c2e` |
| `background-composer` | 输入区底色 | `neutral.composer` | `#2c2c2e` |
| `background-message` | Chat 消息底色 | `neutral.message` | `#2c2c2e` |
| `background-canvas` | 图画布背景 | `neutral.sidebar` | `#1b1b1c` |
| `background-surface` | 普通内容面 | `neutral.base` | `#151517` |
| `background-summary` | 摘要面 | `neutral.card` | `#232324` |
| `background-floating` | 菜单/提示/目录浮层 | `neutral.floating` | `#353638` |
| `text-primary` | 主要正文 | `neutral.primary` | `#f9fafb` |
| `text-secondary` | 次级正文 | `neutral.secondary` | `#cfd3d6` |
| `text-muted` | 时间/版本/辅助说明 | `neutral.muted` | `#adb2b8` |
| `text-disabled` | 不可用文字 | `neutral.disabled` | `#81858c` |
| `text-on-primary` | 实色主按钮上的文字 | `neutral.on-solid` | `#ffffff` |
| `text-on-status` | 实色状态徽标上的文字 | `neutral.shell` | `#151517` |
| `border-subtle` | 普通分隔 | `neutral.border-subtle` | `#ffffff0f` |
| `border-default` | 可见组件边界 | `neutral.border-default` | `#ffffff1f` |
| `border-strong` | 加强边界 | `neutral.border-strong` | `#ffffff29` |
| `border-focus` | 键盘焦点 | `blue.text` | `#679efe` |
| `interaction-hover` | 普通悬停 | `neutral.hover` | `#ffffff14` |
| `interaction-pressed` | 普通按下 | `neutral.pressed` | `#ffffff24` |
| `interaction-selected` | 选中底色 | `blue.surface` | `#679efe1f` |
| `interaction-selected-text` | 选中文字 | `blue.strong-text` | `#679efe` |
| `interaction-selected-border` | 选中边框 | `blue.base` | `#679efe` |
| `interaction-link` | 链接/可进入入口 | `blue.text` | `#679efe` |
| `interaction-primary` | 实色主操作 | `blue.primary` | `#679efe` |
| `interaction-primary-hover` | 主操作悬停 | `blue.primary-hover` | `#4176e6` |
| `interaction-primary-pressed` | 主操作按下 | `blue.primary-hover` | `#4176e6` |
| `background-neutral-action` | 中性操作底色 | `neutral.action` | `#43454a` |
| `background-neutral-action-hover` | 中性操作悬停 | `neutral.action-hover` | `#353638` |
| `brand` | 品牌图标 | `blue.text` | `#679efe` |
| `status-success-text` | 成功/满足/有效 · 文字 | `green.text` | `#22c55e` |
| `status-success-surface` | 成功/满足/有效 · 提示底色 | `green.surface` | `#22c55e1f` |
| `status-success-border` | 成功/满足/有效 · 边界 | `green.border` | `#22c55e94` |
| `status-success-solid` | 成功/满足/有效 · 状态点/线条 | `green.base` | `#22c55e` |
| `status-warning-text` | 需关注/警告/待裁决 · 文字 | `amber.text` | `#f59e0b` |
| `status-warning-surface` | 需关注/警告/待裁决 · 提示底色 | `amber.surface` | `#f59e0b1f` |
| `status-warning-border` | 需关注/警告/待裁决 · 边界 | `amber.border` | `#f59e0b94` |
| `status-warning-solid` | 需关注/警告/待裁决 · 状态点/线条 | `amber.base` | `#f59e0b` |
| `status-error-text` | 失败/错误/阻断 · 文字 | `red.text` | `#f25a5a` |
| `status-error-surface` | 失败/错误/阻断 · 提示底色 | `red.surface` | `#f25a5a1f` |
| `status-error-border` | 失败/错误/阻断 · 边界 | `red.border` | `#f25a5a94` |
| `status-error-solid` | 失败/错误/阻断 · 状态点/线条 | `red.base` | `#f25a5a` |
| `status-info-text` | 说明/当前 AI 理解/变化信息 · 文字 | `blue.text` | `#679efe` |
| `status-info-surface` | 说明/当前 AI 理解/变化信息 · 提示底色 | `blue.surface` | `#679efe1f` |
| `status-info-border` | 说明/当前 AI 理解/变化信息 · 边界 | `blue.border` | `#679efe94` |
| `status-info-solid` | 说明/当前 AI 理解/变化信息 · 状态点/线条 | `blue.base` | `#679efe` |
| `status-running-text` | 正在执行/运行前沿 · 文字 | `blue.text` | `#679efe` |
| `status-running-surface` | 正在执行/运行前沿 · 提示底色 | `blue.surface` | `#679efe1f` |
| `status-running-border` | 正在执行/运行前沿 · 边界 | `blue.border` | `#679efe94` |
| `status-running-solid` | 正在执行/运行前沿 · 状态点/线条 | `blue.base` | `#679efe` |
| `status-paused-text` | 暂停/未开始/非活动 · 文字 | `neutral.muted` | `#adb2b8` |
| `status-paused-surface` | 暂停/未开始/非活动 · 提示底色 | `neutral.inset` | `#2c2c2e` |
| `status-paused-border` | 暂停/未开始/非活动 · 边界 | `neutral.border-default` | `#ffffff1f` |
| `status-paused-solid` | 暂停/未开始/非活动 · 状态点/线条 | `neutral.disabled` | `#81858c` |
| `shadow-panel` | 面板阴影 | `neutral.shadow` | `0 18px 45px #0000003d` |
| `shadow-floating` | 浮层阴影 | `neutral.shadow` | `0 18px 56px #00000066` |
| `overlay` | 遮罩 | `neutral.shadow` | `#00000055` |

## 交付与验证

[Task v8](../assets/crystra-task-work-v8-sidebar.html) 固定已接受的页面五色与字体 B，已移除右下角选择器及切换脚本，旧预览参数不改变显示。可复用 CSS/JSON 与静态样式表见 [资产包](../assets/design-system/README.md)。

[JSON](../assets/color.tokens.json)、[CSS](../assets/color.css) 和 [来源映射](../assets/color-role-map.json) 描述当前接入。修改基色后，在本目录运行 `python3 assets/build-color-tokens.py`，由 [生成脚本](../assets/build-color-tokens.py) 同步派生值与 CSS 别名。原 utility 与图表原色保留用于对照，Browser 新元素直接引用语义变量。

[图表隔离测试](../assets/color-preview.test.mjs)、[资产测试](../assets/design-assets.test.mjs) 和 Sidebar 测试共 8 项通过：选择器不存在、旧候选参数无效、独立 CSS 无需 Tailwind、图表颜色隔离、Sidebar hover 与点击/键盘行为。最终截图在 [previews](../assets/design-system/previews/)。真实 DSH/Better Sidebar 接入按既有宿主接入待办处理。

## 方法来源

[Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/) 与 [Atlassian color](https://atlassian.design/foundations/color) 提供按用途组织颜色的参考。页面五色上限、图表配色独立及减少颜色杂乱来自本项目用户裁定。
