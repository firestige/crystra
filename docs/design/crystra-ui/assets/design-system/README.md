# Crystra 基础视觉资产

状态：2026-09-08 用户已接受。字体 B「均衡」、DSH 对齐的深色页面五色方案，以及 DeepSeek 校准图标尺寸。

## 使用

```html
<link rel="stylesheet" href="theme.css">
<link rel="stylesheet" href="typography.css">
<link rel="stylesheet" href="icons.css">
<main data-crystra-theme="dark">
  <h1 data-type="page-title">页面标题</h1>
  <article style="background:var(--color-background-card);color:var(--color-text-primary)">
    <h2 data-type="card-title">卡片标题</h2>
    <p data-type="body">正文内容</p>
  </article>
</main>
```

组件直接引用 `--color-*` 和 `--type-*` 语义变量。以上 CSS 不依赖 Tailwind，也不包含原型选择器或布局覆盖。图表自行定义配色，颜色主题不自动覆盖图表。需要页面默认前景/背景时由组件显式引用对应变量。

- `tokens.json`：机器可读的已接受角色、数值、来源与派生公式；本地导出格式，不声明 DTCG 合规。
- `theme.css`：五个页面色系、宿主变体和语义别名。
- `typography.css`：字号、行高、字重与用途样式。
- `icons.css`：图标角色尺寸与点击区变量；使用 `data-icon-role` 和 `data-icon-kind="svg"`。新建入口按展开/折叠切换 inline-action / navigation；点击区由组件引用变量。通用图形见 `icons/`，含 Iconify 本地子集和来源清单。整个宿主 Input 排除通用覆盖。
- `index.html`：离线可打开的颜色/字体样式表，无脚本或外部依赖。
- `previews/`：Task 五个工作面的 1920×940 内容区截图；不是物理屏幕断点。
- `manifest.json`：文件与 SHA-256，供复核导出完整性。

未打包 Inter 字体文件；沿用系统回退。通用间距/形状变量已在 ../geometry.tokens.json 和 ../geometry.css 导出；Header 最终整合、宿主接入、浅色主题和图引擎仍后置。Widget 48px 对象信号角色已纳入本包，依据 Widget 监控语义的已接受紧凑配方。

从 assets 目录运行 `python3 build-color-tokens.py` 后运行 `python3 build-design-assets.py` 可重建导出。截图在 v8 渲染后另行刷新；生成脚本不会请求网络或修改页面行为。
