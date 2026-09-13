# TraceStatistics · 统计视图

> 2026-09-10：Analysis 调用追踪已移除此视图，Trace 只保留瀑布图与树图；metric 类数据由总览承载。本页保留独立组件参考，不表示 Analysis 页面仍使用它。

状态：用户对现有瀑布/树/统计方向给出正面评价，当前沿用既有专业视图；不等于通用图表库或Analysis页面已定稿。公开组件TraceStatistics。

## 何时用

这份已记录Trace的规模、时长及状态分布如何？ 输入是编译后的TraceView，不是任意树JSON、Task Plan或Workflow DAG。

## API与示例

属性：trace、可选viewNavigation。

```tsx
<TraceStatistics trace={traceView} />
```

traceView由既有Recorded Trace加载/投影/compileTraceView链提供。专业图容器按可用空间排版，不套用Widget的m×n；若日后要嵌入Widget，应另定义信息容量配方，不缩小整页截图。

## 交互、状态与定制

统计记录的Span/Link、错误数量、最大记录时长及现有分组图形；viewNavigation由调用者传入。 无法形成可用Trace时沿现有InvalidTrace呈现，不能生成正常图。具体空/错误表达仍以源码为准，不由示例添加新的读取状态。

不得由展示颜色创造风险、收益或置信度；不得把Span时长简单相加解释为墙钟耗时。 图形配色独立于页面五色主题。允许由宿主提供导航和已有动效偏好，不改变已记录身份及时间事实；未提供的配置不要假设为props。

## 示例边界

Library使用12个Span的本地测试Trace，图形形状、数量、状态与时长都是fixture，不是生产固定值。指标可视化已接受的表达见 [表达设计](../widget-expression-design.md)，独立 Chart 组件化见 [组件契约](../widget-component-contract.md)。本视图的现有 API 不替代该组件化工作。

## 实现、示例与验证

- [源码](../../../../../wsr-ui/packages/bi/src/components/trace-views.tsx)；公开导出以 [public.ts](../../../../../wsr-ui/packages/bi/src/public.ts) 为准。
- [Library Preview](../../assets/library-preview.html)：选择对应分页；[当前截图](../../assets/library-previews/statistics.png)。示例均为本地 fixture，不连接后台。
- [现有验证](../../../../../wsr-ui/packages/bi/src/components/trace-views.test.tsx)。测试通过只证明覆盖的行为，不代表新增设计已被接受。
