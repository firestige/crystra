# Widget 数据适配参考

范围：未来数据接线的领域来源与口径参考。本文不规定 Widget 类型、表达、尺寸或设计成熟度；这些只由 [组件契约](widget-component-contract.md)和 [表达设计](widget-expression-design.md)维护。此处数据成熟度是来源文档的记录，实际接线时须核对对应 owner 的当前版本。

## 产品目的与范围

Crystra需要让用户知道当前是否要介入、执行与结果如何、花费多少已记录资源，并在可比条件下观察变化、定位运行问题。不是通用BI图表大全，也不是模型自动生成UI的引擎。

一个Widget回答一个可独立阅读的问题。Agent在编码时匹配用途、选择已实现组件并编写数据适配；运行时由固定代码渲染。数据处理不得跨越数据owner：格式、排序、坐标和分桶可按既有契约处理，权威指标与Delta仍由对应服务提供。

### 数据与容器范围

- 纳入：监控语义样本、指标投影、Dashboard内Widget、完整比较、证据页第一节Metric truth states的指标Widget，以及Trace统计中可拆出的独立数据展示。
- 证据页terminal-outcome-rate-preview@2.0.0等多层详情、覆盖率/证据/说明混合容器是普通Card，不因名字叫metric就成为Widget。
- TraceWaterfall、TraceTree、SpanPassport、Receipt及Inspector属于专业视图或Card组合，保持独立。
- TraceStatistics是一个统计页面，不整页变成Widget；其中单值、分类分布、时间分布分别判断。
- Metric truth六种state是数据可信度/可用性条件，不是六个业务Widget类别。它们作为辅助状态在各类Widget内统一呈现；不再替换中央指标身份。

## 证据与数据成熟度

| 来源 | 本轮用法 | 边界 |
|---|---|---|
| [Task权威输入](../../../20260905/crystra-rename-narrative/task-control-workbenches-design-input.zh-CN.md) | Task摘要、Wave/运行观察、待裁决、验收与经济性 | UI需求已明确，不等于投影字段与聚合公式已实现 |
| [Task与Delivery概念](../../../../docs/agent-architecture.md) | 区分持续Task、一次Delivery与运行身份 | 保留原文件发布状态；不能从无Gate推断Task结束 |
| [Catalog 2候选](../../../../docs/contracts/evaluation/metric-catalog-2-candidate.md) | 当前12项候选指标的含义与组合限制 | REVIEW CANDIDATE，NOT PUBLISHED；不替代已发布1.0契约身份 |
| [Evolution计算映射](../../../../docs/systems/evolution/metric-computability.md)及[服务契约](../../../../docs/systems/evolution/evolution-system.md) | MetricResult、精确坐标、覆盖率、Delta | 文档可定义数据，不能宣称所有范围当前部署可查询 |
| [BI职责](../../../../docs/systems/bi/bi-system.md) | 表达层与数据计算边界 | 该文档自身标注candidate，不扩大成生产完成声明 |
| [TraceStatistics实现](../../../../wsr-ui/packages/bi/src/components/trace-views.tsx) | 已有Trace节点/连接计数、状态/类型分布、记录时长统计 | 本地Trace投影，不等价于完整Task耗时/成本 |

来源分为：T=UI需求明确但控制投影待对接；E=已有Evaluation/Evolution候选数据契约；R=现有Recorded Trace表达；P=用途合理但数据与口径尚待补齐。一个场景可包含多种成熟度。

## 从用户问题到数据

| ID / 用户问题 | 对象与所需数据 | 数据形状 | 需保留的数据关系 | 成熟度 / 限制 |
|---|---|---|---|---|
| S01 当前需不需要我介入？ | Task/Gate的待人工裁决数量、阻塞项数量；当前可交付判断 | 单个枚举，或单个count | 状态Widget表达一个判断；计数Widget表达有几项。二者含义不同，不因为都紧凑就混为一个“正常” | T；没有待裁决项不等于Task终态。细节列表仍是Card |
| S02 当前运行处于什么状态？ | 精确Wave/Workflow Run的真实运行态、当前活动 | 枚举状态＋身份 | 单状态Widget；同对象辅助状态不另造一张Widget。默认DAG仍负责前沿与路径 | T；状态字段与恢复语义按owner对接，不从动画推断 |
| S03 单次或选定范围耗时多少？ | 模型调用耗时、Delivery周期；或选定Trace最大记录Span时长 | 单个duration＋单位＋范围＋样本/事实状态 | 量值Widget；均值/最大值/当前值必须写清楚。附带基准时进入S06 | E/R；模型调用native Span duration与Delivery C55是不同指标；Task累计墙钟另待映射 |
| S04 记录了多少资源消耗？ | input tokens、output tokens；精确币种/source下的已记录部分成本 | 单量值，或一组有名称的同主题量值 | 单量值Widget；若问题就是输入/输出结构，可用成对量值内部配方，而非自动推导总量 | E；input/output分开，不合成缺失total；部分成本不标总成本，不做估价/汇率换算 |
| S05 是否达到一个明确目标或上限？ | 当前量、目标/容量/分母、方向、可选阈值 | bounded value / fraction | 目标进度Widget：bar适合沿目标读取位置；环形可作一个份额摘要候选。保留目标/分母含义，可用表达由当前 Widget 定义决定 | E/T/P；覆盖率、usage availability有分母但不等于任务进度；预算/任务百分比目前无统一数据契约 |
| S06 与明确基准相比变了多少？ | 同指标/切片的Before、After、owner给出的Delta及双方范围 | 两个对齐值＋差值＋可比性 | 一个比较Widget，双方和Delta是内部槽位。比例差用百分点；增长率是另一种指标 | E；Delta仅after−before，当前不发布relative change；同比/环比还需明确日历窗口及可比范围，不能仅用as_of冒充 |
| S07 同一个量随时间怎样变化？ | 同口径指标的带时间点或时间桶序列 | series(time,value)，缺值标记 | 点观测/连续变化用线；区间计数/消耗用柱；微趋势只适用于不需精读坐标的摘要 | P，R可提供事件时间原料；当前单次MetricResult不是完整历史series，累计截止值不能冒充每期增量 |
| S08 多个对象在同一指标上有何差异？ | 可比Workflow版本/Role模板/模型分组，统一指标单位和精确群组 | categories＋values，可能有多系列 | 分类比较Widget，优先横向条形表达长名称与差异；每类有多组结果时分组柱候选 | E/P；现有切片可承载部分维度，但不意味着任意workflow版本比较已实现。不从排序生成winner或因果结论 |
| S09 一个总体由哪些部分组成？ | Trace状态/类型计数；具备互斥分组定义的结果构成 | categories＋nonnegative values＋明确总体 | 构成Widget；少量部分看份额可环形/堆叠条；关注精确类别差异则条形。须先验证互斥与覆盖 | R/E；同一Delivery可能暴露多个模板，不可把模板成本切片直接画成总体饼图；阶段到达不是互斥组成 |
| S10 慢调用集中在哪里、是否有长尾？ | 已记录调用/Span时长样本或owner已分桶数据 | samples或bins(count) | 分布Widget：直方图；按时间观察分布变化才是时间热力图 | R/P；平均耗时不能反推分布；没有样本或明确桶就不能画；p95等新指标须由owner定义 |
| S11 哪些对象在哪个维度突出或缺数据？ | 对象×阶段的到达率、对象×时段的同一指标 | matrix(row,column,value/state) | 矩阵Widget：热力图；单一标尺表达可比数值，缺失与0分色 | E/P；delivery-stage-reach有stage切片但不自动具备所有对象矩阵；热力图不推断阶段顺序或Task进度 |
| S12 一个状态如何随时间变化？ | 精确对象的状态转换事件与时间边界 | intervals(start,end,state) | 状态时间带Widget；不是数值线图。当前状态仍由S02承担 | T/R/P；已有Trace状态快照不等于完整状态转换日志，不补造历史区间 |
| S13 多个指标共同描述一个对象时如何读？ | 同范围下耗时、部分成本、返工率、结果率等独立量 | vector，各维保留单位和口径 | 多维比较场景先保留同对象的一组指标/对齐小图；是否构成单个Widget取决于是否回答同一问题。雷达等已接受表达需要各轴尺度与方向的显式输入 | E/P；当前没有统一归一化、权重或能力评分；不能将不同单位直接塞雷达图，不能绘制模型优劣轮廓 |
| S14 需要查看具体哪些记录？ | 完整MetricResult、provenance、覆盖/排除原因、Evidence或Span字段 | 异构记录/文档 | 普通表格/Card/Inspector/专业视图。只有“近期异常若干条”等封闭摘要需求成立时，才另定义记录摘要Widget | 已有详情实现；现有完整table renderer不因此成为标准Widget |

## 12项候选指标的入口映射

本表选择用途，不更改公式；同一指标在不同明确问题下可进入不同场景。唯一解应针对“用途＋数据形状＋阅读粒度”，不是强迫一个metric永远只能有一种图。

| metric_id（候选2.0） | 首要读法 / 场景 | 特别约束 |
|---|---|---|
| role-template-rework-rate | 单组比率；两组比较；模板间分类比较 S05/S06/S08 | 分母是Delivery/template exposure；不是任务进度，不作模板因果判断 |
| role-template-trajectory-partial-cost | 单组部分成本；同兼容组比较 S04/S06/S08 | 模板组可能重叠，不能直接做总体组成 |
| role-model-task-outcome-rate | outcome切片的比率；可比分组 S05/S06/S08 | Catalog的terminal-task统计读法不定义UI Task永久结束 |
| operational-latency-ms | 选定调用群体耗时 S03/S06 | 均值不可伪装单调用或分布；时间趋势需要额外series |
| trajectory-partial-cost | 记录的部分消耗 S04/S06 | 不标总成本；坐标不同不得合并 |
| task-cohort-comparison-eligibility | 可比样本占比 S05 | 不是任务成功率或执行完成率 |
| delivery-stage-reach | 各阶段比率、对象×阶段 S08/S11 | 阶段可能重叠，不做饼图或进度条冒充顺序 |
| delivery-terminal-outcome-rate | 指定outcome比率；条件成立的结果构成 S05/S06/S09 | 仅显式terminal Delivery，不生成Task终态 |
| delivery-cycle-time-ms | Delivery周期 S03/S06 | 只读C55，不能用Span或前端时间戳替代 |
| operational-token-usage | input/output数量 S04/S08 | 明确保留方向和归属，不合成total |
| operational-attributable-cost | 精确调用归属的记录部分成本 S04/S06/S08 | 不估价，不按时间猜归属 |
| operational-usage-availability | Usage可用比例 S05 | 不能解释为零token或模型质量 |

## 接线时记录

记录对象/范围、数据 owner、字段、单位、缺值及口径，区分正式来源与待补字段。然后按 Widget 定义适配输入；本表不新增尺寸、配方或优先选择规则。这里的 S01–S14 是接线场景标识，不是 Widget 类型数量。数据服务未就绪不阻止组件视觉设计。

## 外部参考的效力

[Grafana可视化分类](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/)区分单值、时间序列、构成与分布；[时间序列](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/time-series/)支持线、点、柱；[热力图](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/heatmap/)支持随时间的分布表达。仅参考成熟表达，不从工具提供某个图型推导Crystra需要它。
