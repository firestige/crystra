# 图标语义与尺寸

> 2026-09-08 用户已采用 DeepSeek 校准版。尺寸与用途定型；通用图标采用 Iconify Tabler，v8 资源已整理。复制与其他行内工具统一，不保留原 U1 的 15 / 30px 特例。

## 已接受档位

| 角色 | 用途 | 图形尺寸 |
|---|---|---|
| `disclosure` | 展开、下拉、尾部方向提示 | 12px |
| `inline-action` | 搜索、视图、关闭、缩放、复制及成功反馈 | 14px |
| `content-marker` | 资源身份、清单确认、轻量提示 | 14px |
| `navigation` | 独立导航与 Shell 操作 | 18px |
| `primary-action` | 自有主要操作；宿主 Input 不适用 | 18px |
| `brand-slot` | 品牌及同槽位展开替换图形 | 24px |
| `context-marker` | 页面与工作面身份 | 24px |
| `widget-signal` | 1×1 Widget 居中的对象信号图标，标题由 tooltip 承载 | 48px |

工具点击区 28px，Crystra 自有主操作点击区 36px，Sidebar rail 点击区 40px。图形与点击区、背景容器分别维护；复制成功反馈使用同槽位。新建入口展开时使用行内 14px，折叠时使用导航 18px。

## DeepSeek 基准

本机 `@deepseek-ai/dsh-client-ui-sidebar/lib/client.js:214` 的 `IconNewChatOutline16` 为 `size: wide ? 14 : 18`。v8 已使用相同 SVG 图形，尺寸按宿主展开/折叠状态校准，其他角色以上述锚点统一。不是把整个页面按比例缩放；字体与颜色保持已接受版本。

## 资产与范围

[已接受资产包](../assets/design-system/README.md) 提供尺寸、点击区变量和语义图标 CSS；[v8](../assets/crystra-task-work-v8-sidebar.html) 默认 DeepSeek 校准。右下角仍保留历史尺寸对照工具，A/B/C 及原稿仅供比较，不是多个已采用方案。[候选记录](../assets/icon-size-candidates.json) 明确 `selected=dsh`。

[原稿清单](../assets/icon-inventory.json) 保留修改前 24 个 SVG、55 个独立字符标记的 markup、尺寸、用途与点击区；[原稿样本](../assets/icon-study.html) 是来源快照，不作为现行数值。图表内部 SVG、节点、图例以及 CSS 状态点、数字徽标不归入页面图标档位。

通用图标统一使用现有 `@iconify-json/tabler`（MIT），[资源清单](../assets/icons/manifest.json) 与 [本地图标子集](../assets/icons/iconify-subset.json) 已导出，v8 不再用 Unicode 作图标。数学差异符号与普通文本标点保留文字。自有晶体品牌和 DSH 原生图标保留 SVG；DeepSeek 字母占位已换为宿主 SVG。

整个 Input 是 DSH 特殊组件，其图标和尺寸不受本表约束。生产 React 在 wsr-ui / 后续 crystra-ui 使用同一 Iconify 资源。[资源整理脚本](../assets/build-iconify-assets.ts) 使用 TypeScript，离线 SVG 不在渲染时请求 Iconify 服务。

`widget-signal` 来自已接受的 [Widget 紧凑配方](../components/widget-expression-design.md)，使用颜色强调、1.5px描边；48px是图形尺寸，不改变工具点击区或宿主Input。库内 Icon 与导出 icons.css 使用同一角色数值。

左下角承担辅助事实状态语义；圆圈内置符号是该位置采用的视觉风格。局部图标尺寸18px，不改变通用content-marker档位；图形与状态映射见[状态Widget说明](../components/widget-expression-design.md)。中央指标身份和操作图标保持各自语义。
