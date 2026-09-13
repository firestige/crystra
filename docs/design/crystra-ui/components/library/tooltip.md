# WidgetTooltip · 短说明浮层

状态：已实现并在Widget中验证。库内内部组件，未公开导出。

## 用途和API

用于图标标题、方向、单位与精确值短说明，不承担完整详情。必填`text`、`children`；可选`className`、`focusable`（默认true）。

```tsx
<WidgetTooltip text="请求耗时 · 当前采样"><Icon name="clock" /></WidgetTooltip>
```

## 行为与限制

hover或聚焦显示实际portal浮层；离开、失焦、Escape、操作点击及滚屏关闭。浮层避让视口，不受Widget overflow裁剪。不能只写原生title然后宣称有一致的tooltip；不能只靠颜色表达意义。

短说明不应塞表格、操作列表或长证据。底层已有可聚焦按钮时按实际需要用focusable=false避免额外Tab停靠；可访问名称仍应在按钮上提供。

## 实现、示例与验证

- [源码](../../../../../wsr-ui/packages/bi/src/components/widget-tooltip.tsx)；公开导出以 [public.ts](../../../../../wsr-ui/packages/bi/src/public.ts) 为准。
- [Library Preview](../../assets/library-preview.html)：选择对应分页；[当前截图](../../assets/library-previews/widget-tooltip.png)。示例均为本地 fixture，不连接后台。
- [现有验证](../../../../../wsr-ui/tests/browser/library-preview.spec.ts)。测试通过只证明覆盖的行为，不代表新增设计已被接受。
