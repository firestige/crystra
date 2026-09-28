# Analysis 数据接入与分层决策

日期：2026-09-28。状态：用户确认的设计已实现为本地集成候选，并部署到 3085；未发布。
本文记录本轮 Analysis 设计变更，作为此前 BI 页面文档在数据范围、分包和刷新方面的后续修订。
它不是 Contracts 发布文件；服务查询扩展仍须随对应组件版本一起发布。

## 页面目的与范围

| 页面 | 目的 | 数据范围与请求 |
| --- | --- | --- |
| 总览 | 观察整体资源消耗与运行质量 | 全局时间范围内的 Observation；查询 Evaluation，不要求选择 Task，不提供总览下钻 |
| 调用追踪 | 查看一个 Delivery 的调用结构 | Evidence 目录按全局时间检索，选中后独立读取该 Trace；不触发 Evaluation |
| 对比分析 | 按观察设置比较已有指标 | 同一全局时间范围，可指定 Delivery 子集；Evaluation 指标与 Evidence 元数据组合 |

分析侧 Delivery 来自 Evidence 收集的 Observation，与 Execution 本机 Task 目录不是同一口径，不能互相代替。
一个 Delivery 对应一个 Trace；Task 可以跨多个 Delivery。名称搜索命中多个 Delivery 不改变身份关系。
Delivery 的完整性由 Evidence/Evaluation 所有者负责，UI 展示服务状态，不重建完整性判定。

## 唯一时间口径

UI 日历范围统一转为带时区的 `recorded_from` / `recorded_to`，包含两端，按 Evidence 落库时间筛选 Observation。
Evaluation 使用相同区间选出的记录计算，不以调用发生时间或 Delivery 开始时间决定查询总体。
`started_at` 仅为展示元数据。选中 Delivery 后读取 Trace 仍与该区间求交，不自动扩大到完整历史。

相对范围在刷新时重新解析当前日期，包括跨午夜；当前日历使用 UTC+08:00。支持手动刷新与 15 秒、30 秒、1 分钟、5 分钟周期。
切换范围或选中身份会取消旧资源并隔离迟到响应。调用追踪只刷新目录与选中的 Trace。

## 分包与三层职责

是否依赖 DSH 专有能力决定代码归属；不是按“UI/业务/查询”字面划包。

| 层 | 归属 | 职责 |
| --- | --- | --- |
| Panel/Chart | Crystra-ui | 接收图形类型对应的数据与展示状态；布局、绘制、局部交互；不加载数据 |
| Analysis 业务 | Crystra-ui | 选择查询、按语义 ID 关联、聚合、过滤与转换为 chart interface |
| 查询与 Contract adapter | Crystra-ui | 注入 transport；请求、分页、缓存、取消、错误、运行时解码；泛型 TypeResolver 隔离 wire 变化 |
| Page/宿主 | Crystra-dsh | 路由、slot、鉴权 transport、服务地址、生命周期装配和本地配置存储 |
| 数据服务 | Evidence / Evaluation | Evidence 收集、存储及提供元数据；Evaluation 提供现成指标；规律解释由 agent 完成 |

每种 chart 一个 TypeScript interface，以 `type` 字面量组成可辨识联合；必选字段与模式匹配依靠 TS。
不引入通用 chart 配置语言、动态必选规则或第二套 Observation 格式。运行时 wire 校验不能由泛型断言替代。
中文名称、文件路径是展示值；查询、判断、关联使用语义 ID 与契约 key。

## 查询和展示组合

- `useRecordedAnalysis` 查询时间范围指标，Trace 页禁用；同一响应供多个面板使用。
- `useRecordedDeliveries` 查询独立的 Delivery 元数据目录，不下载全体 Trace。
- `useDeliveryTrace` 对选中 Trace 独立分页；未加载完显式提示，切换身份取消旧查询。
- 通用分页资源持有当前查询的已加载页；不承诺跨任意查询的永久历史缓存。

前端可以组合多个 series、过滤已加载行、对真实延时样本计算 P95/P99，但不得由 P95 推算 P99，也不得把当前页统计冒充完整总体。
小数据允许有界全量读取及本地分页；大结果集使用后端分页，避免超大响应。采用哪一侧计算由数据量、网络、内存与复杂度共同决定。

分页与无限滚动兼容：当前目录使用快照游标、每页 100 条，逐步揭示结果，最多挂载 30 行的显示窗口。
这只限制 DOM，不意味着只缓存 30 行。目录搜索交给后端覆盖完整时间范围；二次结果筛选只作用于已加载行。
服务端 `total` 与已加载/本地命中数分开展示，不能混淆。原始表格与图表导出可后续实现，转换结果无需携带整套转换历史。

## 本地服务接口候选

Evidence 的 Traces 查询允许完整落库时间区间；Facts 沿用已有区间查询。
新增 `GET /v1/evidence/deliveries`：必填 `recorded_from`、`recorded_to`；可选精确 `delivery_id`、`task_id`、`workflow_id`、`workflow_version`，以及字面包含的 `task_name`、`limit`、`cursor`。
响应必需字段：`contract: {name: evidence.delivery-directory, revision: 1.0.0}`、`snapshot`、`total`、`items`、`next_cursor`。
每个 item 必需字段为 `delivery_id`、`trace_id`、`task_id`、`task_name`、`workflow_id`、`workflow_version`、`started_at`、`recorded_at`；其中身份 `delivery_id` 和匹配记录时间 `recorded_at` 必须有值，其余未知值允许 null。
快照与总数跨页一致；支持只有 Fact 的 Delivery；多 Trace 身份冲突由 Evidence 拒绝。RAW_DEBUG 过期不应抹去仍有效的目录元数据。

Evaluation 原 compute 入口增加 `selection_version: 2`：必填落库区间，可选 `delivery_ids`。省略/null 表示全局，空数组表示空集，指定集合与时间总体取交集。
receipt 使用 context version 2 记录实际范围与读取绑定；不声称解析了完整 Task population。版本 1 的 Task selection 仍可使用。
MetricResult、MetricSlice 复用原结构；必需的 nullable `coverage` 序列化为 null，不因排除可选空值而消失。
本轮未修改 Contracts 仓库及 Observation 格式，但增加了上述服务接口候选，不能把“未改 Contracts 文件”理解成“wire 无变化”。

## 指标迭代隔离

指标允许按产品版本增减。UI 查询层不写死指标数量、目录摘要或坐标白名单；结构/协议/重复坐标仍严格校验。
业务用 `MetricAdapter<T>` 按 ID + version 绑定，区分 available / missing / incompatible；同名新版本不套用旧公式。
保存的布局和路由不因指标暂缺而被删除；仅对应面板显示不可用。v8 暂缺指标不是本轮阻塞项。

Evaluation 的 Task 与 recorded-range compute 共享 `calculators/bindings.py`，发布版本、目录坐标和摘要集中在 `catalog.py`。
当前发布仍要求完整目录，缺少 Task/template 总体的项按既有 MISSING_INPUT 返回。
增减指标需更新所属发布目录与计算器绑定，不是无版本的动态热插拔，也不要求修改通用查询器或两个 compute 的指标分支。

## 配置持久化

DSH 使用 localStorage key `crystra.analysis.configuration.v1`，保存 `{version: 1, configuration: {settings, layout}}`。
仅保存已接受的观察设置与布局；不存编辑草稿、Observation、临时选中项。UI 提供结构验证，不依赖当前指标清单。
损坏或被拒绝的读取回落默认值；写入失败保留内存修改并显示提示。它是当前浏览器/来源的配置，不是跨设备同步。

## 验证与剩余边界

本轮已验证：UI 524 Vitest + 34 script tests；DSH 270 tests；Evidence 161 unit + 18 独立 PostgreSQL integration tests；Evaluation 208 tests。
类型/构建与相关边界检查通过。3085 认证浏览器验证现有两条 Delivery、选中 Trace、手动刷新、Trace 页不计算指标、布局重载持久化；1180px header 无高度溢出。

**新 Delivery 采集闭环尚未验收。** 旧 `/crystra create` 验收命令在当前外部 Chat 中仅返回普通回复，未启动 Delivery。
后续必须通过正式 Task/Plan 执行入口创建真实 Delivery，核对 Execution → Evidence → Evaluation → UI；现有存量查询成功不能代替该验收。
本轮没有新增指标、发布包或修改组合仓库的组件锁定版本。

## 阅读入口

- [v8 分析页设计](../../../tmp/20260907/Crystra-ui-design/pages/analysis-audit.md)
- [BI 系统原设计](bi-system.zh-CN.md)
- [Evaluation 指标目录候选](../../contracts/evaluation/metric-catalog-2-candidate.zh-CN.md)
- Crystra-ui：`docs/analysis-data-boundaries.md`、`docs/analysis-metric-bindings.md`
- Crystra-dsh：`src/client/analysis/README.md`、`data-design.md`、`query-design.md`
