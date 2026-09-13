# Workflow 活动图 JSONIR · 草案

> 历史草案：不作为本轮业务需求输入。当前页面见[工作台](workflow-studio.md)，JSONIR 与绑定需求见[业务接入需求](workflow-studio-contracts.md)，完整布局见[优先候选](../components/workflow-map-layout-candidate.md)。本文的多 Tab、角标及旧数据结构仅供追溯，不与现行规则并列生效。

> 2026-09-11 当前显示效果与布局优先级以 [分层拼装与路线选择优先候选](../components/workflow-map-layout-candidate.md) 为准。本文旧布局实现描述保留为演进背景；不与新候选并列生效。

> 0.1-draft，2026-09-09。消费方为 Workflow Studio 的多 Tab 活动图。
> [页面设计](workflow-studio-draft.zh-CN.md) · [完整 JSON 样例](../assets/workflow-activity-ir.example.json) · [简单流程 JSON](../assets/workflow-activity-ir.simple.json) · [TypeScript 类型与引用校验](../../../../wsr-ui/packages/bi/src/domain/workflow-activity-ir.ts)。

## 这份 IR 表达什么

表达用户设计的 Workflow：有哪些活动和控制关系，哪些活动具有内部子流程，哪些条件允许进入公共辅助流程，以及这些流程怎样交回结果。固定 renderer 根据语义生成 Tab、节点、角标、图例、来源列表与详情。LLM 不输出 HTML、SVG path、颜色或临时点击逻辑。

这是一份**设计展示投影**，不是替代已发布 Workflow DSL 的执行协议。这里的 subflow 表示活动图的分组与细化，不自行增加嵌套 Workflow Runtime。条件文字供人阅读，不作为可执行 predicate。正式语义修改仍走 DSH Chat → 语义提案 → owner 校验与提交。

系统边界依据：[Workflow DSL §4–§7](../../../../docs/contracts/workflow/workflow-definition-dsl.md)、[Implementation successor authority](../../../../workflow-package/implementation/workflow.md)。不同 Role 是不同 Action 的职责，模型是 Route 绑定的展示；Runtime 按已声明路径路由，需要语义分类时才使用内部 Planner，不因为增加一个 Tab 获得新 Action。

## 核心结构

| 字段 | 语义 | UI 如何使用 |
|---|---|---|
| schemaVersion | 本投影版本，当前 0.1-draft | 区分消费契约 |
| source | 示例身份，或精确 Definition / revision / digest | 标明当前查看的依据 |
| title | Workflow 展示名 | 主图身份 |
| nodes | 全局节点实体，稳定且唯一的 ID | 多个 Tab 引用同一实体，避免重复维护 Scouter 等信息 |
| flows | 有序的流程视图集合 | 一个 flow 一个 Tab；第一项必须是唯一主流程 |
| relations | 活动与其他流程之间的关联 | 生成节点角标、Tab 跳转、关联来源与完成位置说明 |

flows 的顺序是阅读顺序，不是执行顺序。nodeIds 的排列也不定义执行顺序；流转看 edges，跨流程关联看 relations。

### 节点

每个节点包含 id、kind、title、summary、description、output，可选 role、model、sourceRef。

- activity：普通活动，圆角矩形。
- group：具有内部流程的活动组，圆角矩形；关联决定是否生成子流程角标。
- decision：分支判断，菱形。
- artifact：供产出或读取的材料，虚线框。
- final：成功完成终点，双圆；阶段交接不得借用此形状。
- boundary：跨图交接或返回口，虚线胶囊框；标题与 summary 指明目标，description 说明条件。不表示额外 Action 或成功终态。
- reopen：需要停止当前绑定并重开权威的出口，红色矩形；属于当前样本语义，不等价于全部错误。

title / summary 是面向人的本地化文本；kind 等枚举仅用于匹配 renderer，不直接作为标题。当前样例语言为中文。role / model 是展示摘要；完整 Role / Route 引用及可执行绑定仍由上游契约负责。

相同活动或材料跨图复用一个实体 ID。视图内出现在哪里由布局决定；不要复制实体来改变字号、配色或标题。活动组与内部动作是不同语义对象，因此各自有 ID。

### 流程

每个 flow 包含 id、kind、title、entryNodeId、exitNodeIds、nodeIds、edges：

- main：唯一的主流程，固定第一个 Tab。
- subflow：某个活动内部的细化流程。
- triggered：满足条件才进入的辅助流程，可被多个活动引用。

节点和边限定在当前 flow 中。边包含稳定 ID、from / to、kind、outcome、title、description：

- kind 为 control 或 material，分别产生实线和虚线箭头。
- outcome 为 continue、rework、success、stop，映射到中性、蓝、绿、红；它描述设计路径，不能冒充 Run 状态。
- title 是条件或关系的可读标签；正式条件、业务分支 ID 与 typed dataflow ports 的绑定依赖精确来源。

当前草案覆盖已画出的活动、判断、返工和材料关系。并行 fork / join、Wait 等完整 DSL 投影尚未纳入这一版类型；接入时遵循已有系统契约，不把普通多条边解释成并行。

### 跨流程关联

关联的 source 是某个 flow 内的节点，target 明确目标 flow、入口和出口。关系独立于普通边，避免为了组织 Tab 把跨图关系伪造成图内连线。

| 字段 | 作用 |
|---|---|
| kind = subflow | 此活动具有内部流程；使用蓝色分支角标 |
| kind = trigger | 此活动满足 condition 才进入目标流程；使用琥珀色跳转角标 |
| from | 来源 flowId + nodeId |
| target | 目标 flowId + entryNodeId + exitNodeId |
| condition | trigger 必填；解释何时适用，当前为展示文字 |
| inputs / outputs | 跨流程交接的语义摘要，当前为文本列表 |
| resume.kind = origin | 完成后交回此次发起活动 |
| resume.kind = node | 完成后继续到明确的 flowId + nodeId |
| sourceRef | 可选的精确来源位置；正式投影接入时用于证明对应定义 |

以下是完整样例中的实际关联：
```json
{
  "id": "intake-research",
  "kind": "trigger",
  "from": {
    "flowId": "main",
    "nodeId": "intake"
  },
  "target": {
    "flowId": "research",
    "entryNodeId": "request",
    "exitNodeId": "return-source"
  },
  "condition": "缺少获准且可派生的事实",
  "resume": {
    "kind": "origin"
  },
  "inputs": [
    "事实缺口",
    "记录的 requesting Action"
  ],
  "outputs": [
    "研究事实与来源"
  ]
}
```

“测试阶梯”通过 ladder-detail 关联到展开 Tab；“准备与确认”和展开页的“编写 / 修改实现”各有一条 trigger。IR 不提供 hasBadge、badgeColor、tabIndex 之类重复字段。

阶段展开的正常交接出口为 review-handoff，后续定位到主图 review。该 flow 另外声明 refine-handoff 与 recorded-return 两个跨图返回出口。当前 relation.target.exitNodeId + resume 只描述正常交接，不冒充所有出口的通用路由表；非正常出口的精确含义在边与 boundary 的 sourceRef / description 中维护，正式机器可解析的多出口绑定仍待接入。

公共外查的出口为 return-source，resume.origin 表明返回记录的 requesting Action；来源活动组不等于实际调用的 Action。当前浏览来源只决定定位，不是运行事实。

Implementation 样例中所有节点维护 sourceRef，详情显示依据。group 折叠已声明阶段；实现结果 decision 是路由投影；IM-01R 的请求、材料和返回是阅读分解，均不新增执行 Action。没有展示 fork / join 的复核组，必须在摘要与详情保留双视角、barrier 及 scope 特有返回含义。

## 数据与渲染边界

1. **语义 IR**：实体、流转、关联、来源。
2. **布局**：节点位置、端口、线段、文字位置；构建阶段由 ELK Layered + ORTHOGONAL 从 IR 生成横向 / 纵向结果；紧凑候选另消费当前样例的展示组合与端口预设，与语义源分开保存。
3. **viewer state**：activeFlowId、布局方向、每个 flow 的 selection，以及各方向的 zoom、scroll；留在组件中。

同一份 IR 自动生成 Tabs 和角标，修改一条 relation 后不需要另外维护菜单或点击处理。切 Tab 不修改定义。新增受当前 IR 支持的 flow 可以生成线性布局；生成紧凑候选还需提供展示组合与端口预设，不需要填写节点坐标或 SVG path。预设属于展示层，不新增领域对象或改变控制关系。当前仅验证本地四张样例的三个候选，不表示任意外部 JSON、完整 Workflow DSL 或任意规模均已得到验证。

## 当前校验与接入程度

已实现对类型已知输入的引用闭合校验：节点 / flow / relation ID 唯一；主流程唯一且在首位；flow 的节点、入口、出口、边端点存在；关联来源与目标存在；关联类型匹配目标 flow；trigger 有条件；明确返回节点可解析。无效引用拒绝生成可点击关系，不悄悄替换目标。

当前校验**不是任意外部 JSON 的完整运行时 parser**，也不能证明设计分支已被 Definition owner 批准。当前输入为本地受类型检查的样例。正式接入需在外部输入边界做结构校验，并从精确 Definition 映射 sourceRef、业务分支和 typed ports；owner 合法性不能由 UI 的引用检查代替。

本轮已完成：类型草案、真实消费的 JSON 样例、引用检查、Tab / 角标 / 来源列表生成、每 Tab 的浏览状态。提案写入、真实 Definition 适配、完整 DSL 形状与生产级大图适配没有被这份草案隐式完成；已接入本地样例的 ELK 自动布局。

## 文件归属与验证

- JSON 的唯一维护源位于 wsr-ui/packages/bi/src/domain/workflow-activity-ir.example.json 和 workflow-activity-ir.simple.json；assets 下由页面构建脚本导出，禁止独立修改两份。
- [ELK 适配器](../../../../wsr-ui/packages/bi/src/domain/workflow-activity-layout.ts)测量节点与标签并配置正交布局；[生成器](../../../../wsr-ui/scripts/generate-workflow-activity-layouts.mjs)输出[布局结果](../../../../wsr-ui/packages/bi/src/domain/workflow-activity-layouts.json)，禁止手改结果。
- [几何检查](../../../../wsr-ui/scripts/workflow-activity-layout.test.mjs)覆盖四张图的三个候选、节点 / 标签避让及确定性。
- [renderer](../../../../wsr-ui/packages/bi/src/components/workflow-activity-study.tsx)消费 IR 和布局。
- [引用检查测试](../../../../wsr-ui/packages/bi/src/domain/workflow-activity-ir.test.ts)验证无效引用、主流程约束、条件与出口；[浏览器检查](../assets/workbench-pages.test.mjs)验证 Tab、角标、详情、键盘、视口保留及可用尺寸。

本页是此草案唯一的字段说明入口；页面文档只维护布局和交互，不再复制字段定义。
