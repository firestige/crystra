# 图投影、浏览与运动语义

> 继承 U1 Plan/Execution 图契约；系统约束来自 Workflow DSL、S2 Runner authority 与 S12 BI Trace 设计。不同投影不得共享含糊的“DAG”语义。

## 四种投影

| 投影 | authority / 数据 | 读者问题 |
|---|---|---|
| Plan DAG | 精确 Plan revision | 目标、Wave、Gate、并行/汇合/恢复路径是否成立 |
| Plan Run | 已批准 Plan 拓扑 + Plan Run 状态 | 全 Task 到哪里，哪个 Wave/分支影响进展 |
| Workflow 允许拓扑 | 版本化 Definition/Snapshot | 本方法允许哪些 Action/guard/恢复关系 |
| Workflow 已发生路径 | Runner 已提交 Action/transition/访问事实 | 本次具体走过什么，当前前沿与合法候选是什么 |

Trace 是另一类事实视图：只展示记录的 parent/link/时间与证据，不能从 Workflow 图推导真实因果。A4 的阶段图不替代正式 Recorded Trace；具体选用和现有 API 分别见 [Waterfall](library/trace-waterfall.md)、[Tree](library/trace-tree.md)、[Statistics](library/trace-statistics.md)。本页维护投影与图引擎边界，不另列它们的调用配方。

## 浏览操作

缩放、平移、fit、节点搜索、折叠、节点选择只写 UI state。搜索按名称或稳定 ID，零匹配明确反馈；不能跳相似节点。折叠保留主干/Gate/异常/恢复信息；fit 覆盖当前可见图而不重置语义筛选。Plan 完整图有 minimap，需正式与 pan/zoom 同步。

Task 的 Plan/Execution 中，节点增删、连线、依赖修改、重排、暂停、重试、跳过、批准均回 Input。用户已确认 D04：Workflow Studio 同样通过 DSH Chat 由 LLM 形成受校验的 JSON IR 变更提案，图只读，不手工连线修改语义。浏览与视口控件保留，具体提案卡及版本事务仍待页面设计；系统 owner 校验边界始终适用。旧示意中的手工 SVG 坐标不构成可复用布局实现；Workflow Studio 当前活动图已改由 ELK 自动生成，范围见页面草稿。

## Execution 状态渲染

Execution 运行图使用直线与 90 度正交折线，不使用曲线；这是 U1 的明确约束，不扩展为所有图类型的默认规则。成功绿、运行蓝、失败红、暂停灰虚线、判断菱形并标 guard。没有通用 waiting edge：仍占运行资源等待响应属于运行；释放资源等待恢复需 owner 暂停语义；尚未选择 nextAction 是候选，不是运行。

已发生路径保留；Planner 仅从当前 allowed set 提议 nextAction，经 Runner 校验才提交。候选弱化/虚线，不上成功色或扫光。循环访问按 `Verify #1 → Fix #1 → Verify #2` 展示事实，不用理论回边代替访问记录。

并发可有多个语义前沿，只有一个主要视觉运动焦点；当前节点面板与选中图节点同 identity，状态原子同步。

## 动效层

基础实线/虚线始终存在；扫光由光晕、光尾、光头沿线移动，非粒子散落或整线闪烁。只突出执行前沿。错误可用红呼吸；基线可信且 owner 提供速度结果时慢→黄/慢扫，快→蓝/快扫；无样本保持普通态。速度提醒不是 Workflow 权威状态。

A1 CSS 示意：普通扫光 1.05s，慢扫 2.8s，运行 halo 2.2s，错误 halo 1.25s；仅用于复现审阅感觉，不是 SLA、采样窗口或永久动效常量。`execution-speed-signal` 点击切速是原型演示，生产移除。动效开关与 reduced motion 只停运动层。

Recorded Trace 动效按 S12 为有限历史时间播放，不表示当前执行；不得把 Execution 无限扫光复制到 Analysis。parent 与 LINK 分开，不能自行推断关键路径或服务拓扑。

## 图引擎交付边界

U1 要求专用引擎。Workflow Studio 活动图草案现以 ELK Layered 正交路由作为可运行候选，提供紧凑 / 横向 / 纵向比较，见[页面草稿](../pages/workflow-studio-draft.zh-CN.md)；这不替代 Task DAG / Trace 的各自适配与正式选型验收。布局优先级：控制关系正确 → 主路径清晰 → 循环局部化（长度/折点/跨层）→ 减少穿节点/交叉/重叠 → 语义排序 → 更新稳定 → 视口细节层级。

验收无重叠、无穿节点、端口正确、主路径可追踪、循环局部、同输入确定、增量位移受限、大图耗时。规模与阈值尚未给定，不能伪造通过数值。状态色和动效单独叠加，不反向改变布局。

## 配色作用域

图表可以采用自身配色，不受页面五色主题限制；节点、边、系列与图例在图表内部保持一致。v8 用 `data-color-scope="chart"` 排除页面颜色覆盖，保留原稿图内颜色与效果。页面容器和图外说明继续使用 [页面五色语义](../foundations/color.md)，此边界不修改上述图状态、线型或领域语义。

## Archify 学习与实现纪律

用户已要求 DAG / Workflow 图必须学习 Archify 的成熟做法，不自行发明。先阅读 [Archify DESIGN.md](https://github.com/tt-a1i/archify/blob/main/DESIGN.md) 的语义色、渐进披露、有限可控运动与 viewer state 边界，以及项目已有 [Archify 源码观察](../sources/ui/obs-archify-capabilities.md) 和 [BI 参考裁决](../../../../docs/systems/bi/bi-ui-design.zh-CN.md)。Workflow Studio 候选复核了 Archify 的测量、正交路由、几何避让验证思路，并采用 ELK 计算样例布局；紧凑候选通过显式展示分组与端口约束分层组合；没有移植 Archify 编译器，也不代表完整生产图引擎已交付。

落实到图组件：确定性几何与稳定身份；路由和节点遮挡按成熟算法实现；搜索/聚焦/上下游浏览采用渐进披露；运行状态与动效叠加不改变拓扑；单一运动 owner 并尊重 reduced motion；viewer 选择、缩放与布局偏好不进入领域权威。Archify 的作者关系或推断不得取代 Crystra 的 Plan / Workflow / Trace 契约。

公共包承接 wsr-ui（后续 crystra-ui），React + Tailwind CSS，代码优先 TypeScript，部分专业图用 D3.js。D3.js 不代替 DAG 布局与正交路由引擎。复用已有 wsr-ui RecordedStructure / Trace 组件之前核对类型和布局职责；原型手写坐标不能升格为正式引擎。
