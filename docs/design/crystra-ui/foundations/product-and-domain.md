# 产品概念、身份与系统边界

> 系统约束：S1 Concept §3–5、S2 Execution §6–7、S3 Evidence、S6 Evolution §2/4–6。精确路径见 [来源登记](../sources/README.md)。UI 术语来自 U1。

## 概念对照

| 概念 | 系统意义与 owner | 对 UI 的要求 |
|---|---|---|
| Task | 相关 Deliveries 的分组身份；Execution 创建/接受 `task_id`，Evidence 拥有 accepted declaration/membership 投影 | `task_id` 是选择键；display_name 仅展示。不得由同名、Session、时间推断分组或 retry 权限 |
| Delivery（执行实例） | 一次完成 task-level instruction 的尝试；M01 负责 admission、Manifest、current-slot；M02 Runner 负责执行真相 | 有效结束后的 DSH retry 是新 Delivery；Task 可以显式复用，不能复活旧实例或改旧结果 |
| Delivery 工作面 | U1 定义的 Task 当前可交付判断 | 使用“当前可交付状态”“当前交付候选”；不是 terminal Delivery 详情或归档 |
| TaskPrompt | 触发 turn 的原文及不可变附件引用；M01 仅在 NEW 时快照绑定 | 不把用户内容塞成 CLI prompt 参数，不从 UI 任意改写原文 |
| Host Session | 宿主对话；Intake 对 active Delivery 的零或一排他展示绑定 | 连续 Task UX 不能绕过 active Delivery/session 绑定与 detached recovery 规则 |
| Workflow Definition / Package | owner 版本化的允许拓扑及资源闭包 | Studio 看允许拓扑；版本更新不修改运行实例已绑定 Snapshot |
| Workflow State | 每个 Delivery 的可变运行状态；Runner 是执行写 owner | Input 是用户入口，不是前端取得 Runner 写权；公开暂停/恢复能力不能从私有机制推导 |
| Plan / Plan Run / Wave / Gate | U1 的 Task 控制投影和导航语义 | 需要对应 owner 的正式映射；本包不声称已发布统一 Task IR 服务或一对一 Wave→Delivery 关系 |
| Evidence | 可选 downstream 事实系统；唯一只读 Query 外部边界 | 不能由 UI 直接读数据库、Runner checkpoint 或写 evidence/verdict；缺失观测不阻塞 Execution |
| Metric Result / Delta | Evolution 按对应 Catalog 计算，BI 只展示 | 不在前端自创覆盖率、胜率、收益预测或比较差值；取值须附精确口径和完整性 |

## 身份链与尚未闭合的映射

U1 的导航链为 `task_id → plan_run_id → wave_id → workflow_run_id → trace_root_id`，还需要精确 Workflow definition/revision。此链是需要满足的 UI 定位契约，不等于现有 Evidence API 已发布同名字段。

系统中 `delivery_id`、`task_id`、Manifest digest、Workflow/Snapshot identity、`trace_id` 与 `(trace_id, span_id)` 是分离身份轴。尤其不能默认：

- 一个 Wave 等于一个 Delivery；`workflow_run_id` 等于 `delivery_id`；
- `trace_root_id` 字符串可以直接作为 Evidence 的 `trace_id` 或 Span tuple；
- Workflow 原型中的 `v3` 即 exact Package version/digest；
- Task 等于 host Session，或用 Task ID 获得恢复/重试 authority。

实现前由 Execution/Workflow、Evidence、宿主适配 owner 明确映射及失败返回。未提供关联时，显示“尚无可定位运行 / 无法定位”，不拼出可疑链接。Gate EvidenceRef 与 typed patch 也属于待对齐的候选载体，UI 文档不发布 schema。

## 生命周期衔接

S6 已确定：新 Delivery 默认新 Task；复用现有 Task 必须用户显式选择。U1 新建空白态本身不创建 Task/Session，实际持久化时点待设计。两者并不冲突：前者决定分组语义，后者决定 UI 形成时序。

同一 Task 的连续输入必须通过宿主与领域映射实现，不能把 Task 页面上的“继续”翻译为任意旧 Delivery 的 retry。M01 同 canonical worktree 只允许一个 current Delivery；`CONTENDED` 立即返回，不形成后台排队。U1 的 Task 执行单元“排队”是控制投影口径，不是 M01 admission queue。

`START_UNCERTAIN` / `RESULT_UNRESOLVED` 不等于已失败并可重试。相关处置遵从 M01/Runner 的精确检查与 authority；前端不能超时清除 current slot 或制造 terminal result。

## Session 恢复与新旧 Delivery 关联

恢复由 Execution/Runner 恢复持久化事实，再由 DSH Intake 精确关联 Session 与 Delivery。有效绑定与可用 Session 对应 BOUND；Delivery 有效但原 Session 不可恢复可处于 DETACHED；不确定或不一致时遵从系统失败结果。UI 不自行判断恢复完成，不重绑 Manifest，也不把恢复映射成新的人工 Gate。当前 Task 是否结束由用户决定；无待裁决项不推导 Task 结束或 Delivery terminal。

同 Session 新建活动 Delivery 后，以精确活动关联读取当前状态；旧 terminal 关联保留只读历史，不继承新执行的关联键。没有活动关联时按宿主契约读取历史，而不是由 UI 按名字或时间猜测。Task 分组相同不转移恢复权限、执行身份或旧决定的适用范围。参见 [Session–Delivery 绑定权威](../../../../docs/systems/execution/session-delivery-worktree-binding.md) 与 [系统概念](../../../../docs/agent-architecture.md)。

Task/Gate/Plan Run 到 Delivery 的具体映射属于尚需交付的数据契约，不能根据 UI 命名假定一对一。展示层消费精确映射；无法取得映射时不构造猜测链接或提交目标。

## 判断与事实读取

Task 的可交付判断、Gate 决定与系统 execution outcome 分开。Evidence outage 不改变执行结果；Analysis 指标不可用也不等于 Task 不可交付。若某 Gate 的领域规则需要特定验证材料，由该规则 owner 判断缺口，不能以 BI 可用性替代。

Task Summary 与 Delivery 工作面的实时累计口径来自 U1，其聚合服务 owner/时间边界尚需映射。不要直接把多个并行 Delivery elapsed 相加当 Task 墙钟时间；不得混加不兼容 currency、unit、source；没有真实注意力测量时显示不可用。

Evolution 的比较范围绑定精确 Task membership、Catalog 和 receipt；返回的 receipt 不是持久化服务器资源，也不保证跨 Query route 的数据库事务快照。重新打开同一 selection 可能得到新的 receipt，不能宣称历史数值已被永久冻结。

Query 1.0 candidate 以 Delivery 为 retention atom。普通 Query 不返回已删除 Delivery，也不暴露可恢复墓碑；精确查无数据时 UI 不能猜“已过期”或提供恢复按钮。只有 owner 显式提供原因才展示具体原因。S4/S5/S6 的候选规则不回写 frozen Query 0.1。
