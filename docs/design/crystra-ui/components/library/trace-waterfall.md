# TraceWaterfall · 时间瀑布图

状态：2026-09-11 归并。调用追踪只使用瀑布图与树图，统计留在独立库参考、metric 类数据归总览。页面组合以 [观测与分析](../../pages/analysis-audit.md) 为准。公开组件TraceWaterfall。

## 何时用

各Span何时发生、持续多久，时间上如何重叠？ 输入是编译后的TraceView，不是任意树JSON、Task Plan或Workflow DAG。

## API与示例

属性：trace、可选 locale（默认 zh-CN）、reducedMotion、viewNavigation、showSummary（组件默认 true）、fillHeight（默认 false）。

```tsx
<TraceWaterfall trace={traceView} reducedMotion={reduceMotion} />
```

traceView由既有Recorded Trace加载/投影/compileTraceView链提供。专业图容器按可用空间排版，不套用Widget的m×n；若日后要嵌入Widget，应另定义信息容量配方，不缩小整页截图。

## 交互、状态与定制

搜索、缩放、层级折叠、选择Span并打开Passport；viewNavigation用于调用者提供视图切换。 无法形成可用Trace时沿现有InvalidTrace呈现，不能生成正常图。具体空/错误表达仍以源码为准，不由示例添加新的读取状态。

不要把重叠耗时相加当作总耗时；不得从位置关系捏造依赖。 图形配色独立于页面五色主题。允许由宿主提供导航和已有动效偏好，不改变已记录身份及时间事实；未提供的配置不要假设为props。

## 示例边界

Library使用12个Span的本地测试Trace，图形形状、数量、状态与时长都是fixture，不是生产固定值。指标可视化已接受的表达见 [表达设计](../widget-expression-design.md)，独立 Chart 组件化见 [组件契约](../widget-component-contract.md)。本视图的现有 API 不替代该组件化工作。

## 实现、示例与验证

- [源码](../../../../../wsr-ui/packages/bi/src/components/trace-views.tsx)；公开导出以 [public.ts](../../../../../wsr-ui/packages/bi/src/public.ts) 为准。
- [Library Preview](../../assets/library-preview.html)：选择对应分页；[当前截图](../../assets/library-previews/waterfall.png)。示例均为本地 fixture，不连接后台。
- [现有验证](../../../../../wsr-ui/packages/bi/src/components/trace-views.test.tsx)。测试通过只证明覆盖的行为，不代表新增设计已被接受。

## Analysis 页面固定用法

页面传入 `showSummary={false}`，只在上方提供瀑布图／树图切换；不显示额外 Summary 或无实际用途的页面动作。标题与配色遵守 [页面组合](../../pages/analysis-audit.md) 和 [D17](../../foundations/card-surfaces.md)。目录侧栏收起会释放可用空间，组件填充剩余高度。

页面另传 `fillHeight`。调用缩略图与调用时间线同宽；详情卡从缩略图顶部到时间线底部填满右列。缩略图右侧／上下 6px 安全间距。搜索按 Span 名称或精确身份缩小观察范围；展开全部／收起全部／重置焦点作用于只读结构。选择 Span 更新详情的图标、名称与类型／深度，不再显示固定“调用详情／当前调用”标题。缩略图指针操作区分拖选区间、移动窗口和拖动左右边界，均不改变事实数据；缩略图获得焦点后，左右方向键将窗口平移 5 个百分点；Shift + 左右方向键调整右边界，最小宽度 1 个百分点；Home 恢复完整范围。移动与缩放均限制在 0–100%，与指针共用范围提交逻辑。控件名称、搜索提示及结构操作随 locale 切换，页面默认中文。
