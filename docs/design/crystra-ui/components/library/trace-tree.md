# TraceTree · 已记录结构树

状态：2026-09-11 归并。调用追踪只使用瀑布图与树图，统计留在独立库参考、metric 类数据归总览。页面组合以 [观测与分析](../../pages/analysis-audit.md) 为准。公开组件TraceTree。

## 何时用

Span之间的结构和关联是什么？ 输入是编译后的TraceView，不是任意树JSON、Task Plan或Workflow DAG。

## API与示例

属性：trace、可选 locale（默认 zh-CN）、reducedMotion、viewNavigation、showSummary（组件默认 true）。

```tsx
<TraceTree trace={traceView} reducedMotion={reduceMotion} />
```

traceView由既有Recorded Trace加载/投影/compileTraceView链提供。专业图容器按可用空间排版，不套用Widget的m×n；若日后要嵌入Widget，应另定义信息容量配方，不缩小整页截图。

## 交互、状态与定制

Canvas布局、选择节点、视口移动、祖先/后代观察及小地图；详情用SpanPassport。 无法形成可用Trace时沿现有InvalidTrace呈现，不能生成正常图。具体空/错误表达仍以源码为准，不由示例添加新的读取状态。

这不是Workflow DAG设计/编辑器，不允许在此增加改路径或修改权威的按钮。 图形配色独立于页面五色主题。允许由宿主提供导航和已有动效偏好，不改变已记录身份及时间事实；未提供的配置不要假设为props。

## 示例边界

Library使用12个Span的本地测试Trace，图形形状、数量、状态与时长都是fixture，不是生产固定值。指标可视化已接受的表达见 [表达设计](../widget-expression-design.md)，独立 Chart 组件化见 [组件契约](../widget-component-contract.md)。本视图的现有 API 不替代该组件化工作。

## 实现、示例与验证

- [源码](../../../../../wsr-ui/packages/bi/src/components/trace-views.tsx)；公开导出以 [public.ts](../../../../../wsr-ui/packages/bi/src/public.ts) 为准。
- [Library Preview](../../assets/library-preview.html)：选择对应分页；[当前截图](../../assets/library-previews/tree.png)。示例均为本地 fixture，不连接后台。
- [现有验证](../../../../../wsr-ui/packages/bi/src/components/trace-views.test.tsx)。测试通过只证明覆盖的行为，不代表新增设计已被接受。

## Analysis 页面固定用法

页面传入 `showSummary={false}`，只在上方提供瀑布图／树图切换；不显示额外 Summary 或无实际用途的页面动作。标题与配色遵守 [页面组合](../../pages/analysis-audit.md) 和 [D17](../../foundations/card-surfaces.md)。目录侧栏收起会释放可用空间，组件填充剩余高度。

调用关系树按 Canvas 可用空间呈现；Fit／放大／缩小、滚轮及小地图改变视口，节点选择更新动态详情，Ancestors／Descendants／Clear lens 改变观察高亮，不改调用路径。当前部分控制标签仍为英文；中文标题已接入不代表全部文案已完成 i18n。
