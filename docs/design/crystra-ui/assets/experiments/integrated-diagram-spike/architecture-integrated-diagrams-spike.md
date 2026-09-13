---
title: 完整图形系统与工作流语义适配 Spike
category: Architecture
status: Complete
timebox: 60 minutes
created: 2026-09-11
owner: Codex
---

# 完整图形系统与工作流语义适配 Spike

本轮问题：是否已有组合能直接承担分层活动图的布局、布线、渲染、折叠与导航，减少 Crystra 自研几何协调层？

试验对象：bpmn-auto-layout 1.3.0 / 2.0.0-alpha.2 + bpmn-js 18.28.0；maxGraph 0.24.0；PlantUML 1.2026.8。Sprotty/GLSP 仅做架构和官方示例审查，不把文档能力计作本轮实测。

## 明确边界

- 正式 v8 和 JSON IR 不修改。
- BPMN 原始直连跨层输入与边界适配输入分开测试。适配后为子流程增加开始/结束事件；主流程连接子流程外框。它是候选建模约定，不是已经证明运行语义等价的转换。
- 适配器只接受每个组唯一内部入口目标和出口来源；多个入口不能悄悄合并。
- maxGraph 保留原始节点、父子关系、跨层边；只调用官方布局、折叠、导航、缩略图 API。
- PlantUML 测试结构化活动语法的生成质量，手工结构化样本不冒充任意 JSON IR 的无损转换。

## 本轮结论

**找到了比“布局库 + 自写协调器”更完整的候选，但仍未验证出可以直接采用的成品。** 最接近的是 bpmn-auto-layout 2.0.0-alpha.2 + bpmn-js：它可以从 BPMN 语义模型生成完整 DI（形状、线、标签及子图平面），随后由 bpmn-js 原生处理渲染、折叠和进入子图。它值得继续作为参考与候选，当前版本不建议直接集成。

这次限制不只是“效果还不够美观”，而是两项明确的取舍：

1. 要获得 BPMN 的完整处理链，需要接受其子流程边界语义，不能随意从外层直接连到内部节点。
2. alpha 版在独立参考模型中仍存在异常和静默丢失 DI 的问题，已经本机复现。

maxGraph 的优势是保留任意跨层边的原始关系，并且原生支持折叠后端点提升、进入组和缩略图；但默认分层布局没有自动满足我们的构图要求。PlantUML 证明结构化语义可以由完整活动图引擎直接生成较清晰的控制流，但此轮使用的新活动语法以纵向阅读为主，不能直接满足横向镜头和交互展开的要求。

## 实验与证据

### 1. BPMN 组合：实际跑了什么

版本固定在 package-lock.json：bpmn-auto-layout 1.3.0（别名 bpmn-layout-stable）、2.0.0-alpha.2（bpmn-layout-next）、bpmn-js 18.28.0、bpmn-moddle 10.2.0。

三套现有工作流，各测试三种状态：全部折叠、展开第一组、全部展开。两版布局器合计 18 个有边界输入。另将原始跨层连线直接编码为 BPMN，合计 6 个边界反例。

`bpmn-model.cjs` 做的事情限于模型转换：

- 活动 → task，判断 → exclusiveGateway，fork/join → parallelGateway，group → subProcess。
- 每个子流程添加独立开始/结束，父层边连接子流程外框；原始边 ID 保留，添加的边界桥接有独立 ID。
- 转换前检查该组所有外部进入边是否指向同一内部目标、所有外部离开边是否来自同一内部节点。发现多个或缺失入口/出口即拒绝，不能偷偷合并。
- 没有设置节点坐标或路径点。传入的简易 DI 仅声明展开状态，布局器重建几何。
- 没有把 Crystra 的 expected 自动变成 BPMN default flow，避免给分支附加未经授权的运行含义。主路径选择由库的规则负责。
- 添加 BPMN incoming/outgoing 引用。初次省略这些可选引用时，稳定版未生成边，而 alpha 能生成；补全后才纳入正式比较。没有把适配缺漏算作稳定版最终失败。

三个有边界样本的节点与边覆盖在两版中均完整：开发 32 个形状 / 34 条边，架构设计 21 / 19，科研管理 19 / 19。数量包括明确添加的子流程开始/结束与桥接边。

alpha 对三个原始直连跨层反例均以 `CROSS_SCOPE_SEQUENCE_FLOW` 拒绝。稳定版对开发样本抛出普通异常，对其他两个能输出 DI；输出成功不意味着这类跨层 BPMN 输入具有有效的标准语义。

### 2. BPMN 的视觉和原生交互

- alpha 顶层主路径水平连续，返回边在下方；完整展开后，子流程、判断、并行和标签均由库生成。
- 全部展开仍呈现很宽的长图，适应全图时字号明显变小。它没有自动提供符合我们的关注范围与阅读尺度的运镜策略。
- “理解与设计”的澄清缺口依然位于完成设计下方，而不是材料足够下方。完整系统也没有自动满足用户提出的这项局部构图偏好。
- 第三层“测试与实现循环”的截图仍能看到两条返回线共线重叠，以及“测试通过，开始重构”等标签压线。严格交叉为零并不覆盖共线重叠与标签碰撞；此层仍未通过视觉验收，证据见 `bpmn-next-tdd.png`。
- 折叠状态拥有独立子图平面。真实浏览器已进入三套样本全部 9 个组，包括第三层 tdd，且能回总览。
- 原生 toggleCollapse 可用，但**不会自动重排其余子流程**：折叠 plan 时 work、delivery、ready 的坐标与尺寸保持不变，因此保留空白。
- 原生折叠再展开不保证恢复完全相同的容器几何。plan 从 `(216,80,802,320)` 经过折叠再展开后成为 `(230,90,780,310)`；这是实测的原生行为，未用自写几何修正。
- 预览中的“重新布局”对 BPMN 是重新加载下拉框所选状态的预计算布局，并非实时对用户修改后的模型做增量布局。

测量器对可见平面中的非子流程矩形节点和边进行有限几何检查。三套**全部展开**样本中，alpha 检测到的严格交叉、非端点矩形穿越、矩形重叠均为 0；稳定版穿越事件分别为 1、1、5，严格交叉和节点重叠为 0。未计菱形/圆形精确轮廓和文字碰撞，因此不能把这些数字当作完整视觉验收。

注意：稳定版折叠子流程的隐藏内容仍可能保留在同一 DI 平面，alpha 则有独立平面。测量已过滤折叠容器内部的隐藏元素；不得将未经该过滤的 DI 元素直接累加，制造不存在的视觉重叠。不同方案的平面总数也不适合直接当作质量评分。

相同开发输入在 alpha 连续运行两次，XML 字节一致；只验证该输入，没有证明增量变更时的稳定性。

### 3. alpha 的独立参考模型反例（已复现）

为了避免只检验经过适配的自有样本，取 BPMN MIWG 公开参考模型，去掉 DI 后重新生成。没有修改语义模型，没有修补布局器。

| 参考模型 | 本机结果 |
| --- | --- |
| A.4.0 | 抛出 `TypeError: Cannot read properties of undefined (reading 'id')`，没有稳定的 LayoutError code |
| C.4.0 | 原始 DI 对应 107 个唯一语义元素，输出覆盖 55 个，缺失 52 个，`warnings` 为空 |

这是图形信息覆盖丢失，不等同于 XML 中业务语义元素被删除。结果存于 `miwg-input/*.result.json`，缺失 ID 完整保留。该参考模型含协作和参与者等超出当前 Crystra 样本的内容，不能推断我们的三个样本也会丢失；但已经否定“任意合法 BPMN 都可无检查直接使用”的假设。

与本轮结果吻合的上游报告：[#155](https://github.com/bpmn-io/bpmn-auto-layout/issues/155)、[#154](https://github.com/bpmn-io/bpmn-auto-layout/issues/154)。检查时均 open。

另外阅读但**未复现**：[#150 密集循环的可读性](https://github.com/bpmn-io/bpmn-auto-layout/issues/150)、[#147 跨 scope 与汇合路线的共线问题](https://github.com/bpmn-io/bpmn-auto-layout/issues/147)。不能把这些报告当作我们的实测结果。

### 4. maxGraph：原始跨层语义保留，自动构图仍不足

使用 @maxgraph/core 0.24.0，原始 IR 的节点 ID、父子关系和边端点不变。图形取 maxGraph 自带形状，路线使用其内置布局/连接器，没有自写端口或路由。

尝试两种调用方式，均在预览中提供：

- 按层执行 HierarchicalLayout，关闭 traverseAncestors，子层先布局、库更新父框。
- 全图使用默认层级遍历的 HierarchicalLayout，再调用库的 updateGroupBounds。

实际结果：按层调用时，展开组之间的连接并不会自动被当成父层的主路径骨架，外层构图变成疏散的纵向堆放。全图调用后能得到横向连贯关系，但出现容器相互覆盖、过大的容器和不合理的跨层路径。两种默认组合都未达到预期。**这是这两个调用方式的失败，不是对 maxGraph 所有配置的穷尽证明。** 本轮未进一步实现 LayoutManager 定制规则或自己的层级协调算法。

原生交互有明确可复用价值：

- 折叠 plan 后，`reconsider-design` 的原始 source/target 仍为 ready/read，显示 target 自动提升为 plan。
- 展开后显示 target 恢复为 read，模型节点几何恢复，与折叠前一致。
- 进入组后内部可见，但外部进入边会隐藏；回总览后恢复。它并未直接提供我们要求的“子流程视角仍显示外部输入输出接口”。
- Outline 缩略图由库原生生成，能跟随视图；没有做针对我们的运镜动画验收。

API 接入坑：当前版本 fit 是 FitPlugin 的 `fitCenter()`，不是旧 mxGraph 示例中的 `graph.fit()`。按当前包源码修正了适配器；没有把旧调用导致的报错当成布局能力失败。

### 5. PlantUML：完整活动语法引擎，但不等同于交互工作台

实际运行官方 MIT 版本 `plantuml-mit-1.2026.8.jar`，生成三份包含 partition、repeat/while、判断和 fork 的活动图 SVG。

这是手工结构化的概念样本，不是原始有向图无损转换。例如开发样本简化了外层返工的具体返回位置，不能用它证明引擎能表达所有原始跨层路径。

- 控制流形状、循环返回、分组和并行均由引擎生成，能形成可读的纵向活动图。
- 在这一新活动语法样本中加入 `left to right direction` 后，生成报语法错误；错误输出保留。这证明该指令不能直接用于这份样本，不证明所有 PlantUML 图种都不能横向。
- 原始 SVG 为纵向长图，在横向画布中留下大量空白。没有原生工作台折叠/展开和相应镜头交互的集成验证。
- 本地 Java 初次沙箱运行异常退出，使用 headless 模式并在主机权限下重新运行成功；记录为运行环境问题。

### 6. Sprotty / GLSP：架构审查，未计入实跑

官方文档与代码显示它们提供模型/视图协议、交互框架和 ELK 集成；GLSP 官方 WorkflowLayoutConfigurator 只是返回 `elk.algorithm: layered`。

它们可能减少编辑器和客户端/服务端协议工作，但该示例不能证明已经包含符合 Crystra 的主路径、异常分支、跨层接口和运镜策略。本轮没有启动完整服务端/客户端，因此不对其实际布局效果下结论。

## 更明确的取舍

| 路线 | 已有系统可以承担 | 我们仍需承担或接受 |
| --- | --- | --- |
| BPMN alpha + bpmn-js | BPMN 范围内的递归布局、路由、标签、渲染、子图平面与原生编辑交互 | 子流程边界建模约定、Crystra 语义映射、当前版本错误/DI 完整性保护、关注范围与镜头、折叠后重新布局策略 |
| maxGraph | 任意图模型、跨层边提升、折叠/恢复、进入组、缩略图、连接器与基础布局 | 层级构图策略仍未解决，深入组后外部接口需额外表示 |
| PlantUML | 结构化活动语言到完整静态活动图 | 工作流到结构化语法映射、横向阅读与交互能力不满足当前目标 |
| Sprotty/GLSP | 编辑器基础设施、协议和 ELK 集成（文档/代码证据） | 自己的领域模型与布局策略；本轮未验证运行效果 |

因此，下一步不应继续盲目把更多基础库拼起来。**先评估是否愿意把子流程约定收敛为明确入口/出口的模块。** 这不是要求工作流只能线性，而是要求分层边界清晰；条件、循环、并行仍在模块内表达。如果还必须支持多个任意内部入口，BPMN 路线不能自动视为语义等价，必须另外设计映射。

即使接受边界约定，也需要先解决 alpha 版本可靠性和我们已经指出的局部构图差异，不能据此宣布选型结束。若不接受该约定，保留原始图语义的路线目前仍需要领域布局工作；本轮没有证据表明 maxGraph 或 GLSP 能替我们免掉它。

## 可以学习的整合经验

- BPMN alpha 将 rank、语义分带、容器和正交路由放在同一领域流水线中，而不是仅向通用引擎追加权重。
- 它的主路径先考虑能否到达结束事件，再考虑 default flow，最后用声明顺序打破平局；这不能自动理解 Crystra 的 happy path 意图。
- 子流程自底向上布局，折叠子图使用独立平面。它天然承认父图与子图的几何坐标无需相同，但也不承诺穿透任意内部端口。
- maxGraph 区分原始端点与显示端点：折叠只改变显示连接，不改语义边。这是可以直接借鉴的交互模型。
- 生成成功和 warnings 为空不能替代输出身份覆盖检查；本轮的 MIWG 反例说明这一点具有实际价值。

以上为实验认识，不写成正式 JSON IR 或 v8 规范。

## 验证范围与复现

- 4 个契约检查通过：边界适配、拒绝多入口、alpha 输出覆盖、maxGraph 折叠恢复。
- Chrome 检查 27 个系统/样本/状态组合（BPMN 两版和 maxGraph 各 9 个）。这仅证明渲染与调用成功，非 27 个视觉验收通过。
- alpha 和 maxGraph 各进入 9 个组，含第三层 tdd；BPMN 根平面与 maxGraph 当前根 ID 均记录。
- BPMN 原生折叠与 maxGraph 原生折叠、返回的状态与截图保留。
- PlantUML 三个 SVG 在真实浏览器中打开，横向指令反例保留。
- 公开 MIWG 两个失败案例本机复现；没有跑全部 MIWG 或上游完整测试集。
- 没有验证连续编辑、撤销全链路、内存、Worker 取消或大规模布局性能。

在本目录执行：

```sh
npm ci --ignore-scripts --no-audit --no-fund
node run-bpmn.mjs
node measure-bpmn.mjs
node_modules/.bin/esbuild maxgraph-entry.js --bundle --format=iife --outfile=maxgraph-bundle.js
node build.cjs
node verify-browser.cjs
node probe-maxgraph.cjs
node probe-global.cjs
node verify-full.cjs
node probe-navigation.cjs
node --test contracts.test.cjs
node probe-miwg.mjs A.4.0
node probe-miwg.mjs C.4.0
```

浏览器脚本依赖当前工作区 Playwright 和 macOS Chrome。PlantUML jar 在 `/tmp/crystra-plantuml-spike`，版本和源文件见上；生成命令：

```sh
java -Djava.awt.headless=true -jar /tmp/crystra-plantuml-spike/plantuml-mit-1.2026.8.jar -tsvg plantuml-output/development.puml plantuml-output/architecture.puml plantuml-output/research.puml
```

`preview.html` 是实际组件预览。`bpmn-results.json`、`bpmn-metrics.json`、`interaction-summary.json`、`navigation-results.json`、`browser-results.json` 为证据入口；`miwg-input/` 保存公开参考输入与失败结果。

## 来源与许可证记录

- [bpmn-auto-layout 发布记录](https://github.com/bpmn-io/bpmn-auto-layout/releases/tag/v2.0.0-alpha.2)，本轮用 npm 发布 alpha，不以 main 的未发布变化冒充测试版本。
- [布局契约](https://github.com/bpmn-io/bpmn-auto-layout/blob/main/docs/LAYOUT.md)，用于了解当前上游设计，不将它的所有保证视为本轮 npm 包已实现。
- [bpmn-js](https://github.com/bpmn-io/bpmn-js)：保留其要求的可见 bpmn.io 水印；不能把该自定义许可证当作普通 MIT。本轮仅隐藏编辑工具栏便于观察图，没有隐藏水印。
- [maxGraph 折叠与复杂度管理](https://maxgraph.github.io/maxGraph/docs/manual/group-and-complexity-management/)、[官方 HierarchicalLayout 示例](https://github.com/maxGraph/maxGraph/blob/main/packages/html/stories/HierarchicalLayout.stories.ts)、[Folding 示例](https://github.com/maxGraph/maxGraph/blob/main/packages/html/stories/Folding.stories.ts)。包声明 Apache-2.0。
- [PlantUML 活动图语法](https://plantuml.com/activity-diagram-beta)、[官方 1.2026.8 发布](https://github.com/plantuml/plantuml/releases/tag/v1.2026.8)。本轮选择 MIT 分发包，未假设所有 PlantUML 分发许可证相同。
- [GLSP 官方工作流配置](https://github.com/eclipse-glsp/glsp-server-node/blob/main/examples/workflow-server/src/common/layout/workflow-layout-configurator.ts)、[Sprotty 的定位与能力](https://newsroom.eclipse.org/eclipse-newsletter/2023/october/eclipse-sprotty-officially-out-incubation)。
- MIWG 输入来自 [BPMN MIWG Test Suite](https://github.com/bpmn-miwg/bpmn-miwg-test-suite)，项目贡献者提供，CC BY 3.0；具体源码提交见 `miwg-input/source-commit.txt`。原始输入未修改，输出为本次布局生成的派生文件。

2026-09-11：本轮完成。没有修改正式工作流工作台页面，没有冻结新的领域或布局规范。
