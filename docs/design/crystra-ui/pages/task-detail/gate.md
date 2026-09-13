# Gate：当前决定、解释与证据

> 继承 U1 Gate 三节；A1；M2 补足内部定位。页内所有内容绑定同一 `gate_id`/revision。

## 页面结构

`gate-review-overview` 上方有队列入口/数量/位置/控制影响，下方为唯一待决问题、位置、触发原因与状态。

`gate-decision-board` 在稿中左右约 1.1:.9：左侧已确认决定、当前 AI 理解与变化；右侧确认后的控制效果与不变边界。标题只保留“当前决策状态”。下方五类证据入口。窄布局可堆叠但顺序不变。

| 区域 | 内容与合法来源 |
|---|---|
| `gate-relevant-decisions` | 对当前问题仍有效的不可变决定引用与同快照计数 |
| `gate-current-interpretation` | AI 当前理解，未授权时保持候选身份 |
| `gate-understanding-delta` | Agent 判断的新增/保持/冲突，不作为用户已确认事实 |
| `gate-execution-preview` | 确认当前解释后的效果顺序；未授权不启动 |
| `gate-preserved-boundary` | authority/invariant 产生的不变权限与边界，不是 LLM 保证 |

候选选项、利弊、追问、反驳全部在 Input；右侧不陈列 AI 预设选项。

## 审核内容可信度与准入（D08，已确认）

- `gate-current-interpretation` 与 `gate-understanding-delta` 表达 Agent 此刻实际给出的理解和比较判断，允许判断错误；必须保持 AI 判断身份，不能借此声称用户已确认某项内容。这不表示可以验证模型内部信念或保证其理解正确。
- `gate-relevant-decisions` 优先准确率，允许漏列，不允许将未经确认的内容列为已确认。每项必须能核验明确用户确认记录、当时被确认的具体内容及范围；LLM 可以检索候选，但不能自行赋予“已确认”身份。
- 展示优先采用确认记录中的原文或当时被明确确认的结构化内容，不能把新生成的摘要自动视为已确认。单独发现一句“同意”或一条消息 ID 不足以证明确认了什么；无法核验内容、范围或当前适用性时不列入。
- 列表与计数只代表通过准入的相关项，不宣称穷尽所有决定。空列表采用已定骨架空卡；若显示文字，应为“暂无可核验的相关已确认决定”，不能断言用户从未确认过决定。
- 决策影响继续区分可由 IR/控制规则核验的效果与 Agent 预测；预测不因为出现在审核页而变成确定结果，也不把本轮对 AI 判断的容错扩展到真实控制效果或权限边界。

“不允许假阳性”是准入要求，不是已经证明的模型能力。确认记录格式、确认对象/范围绑定、有效性检查与模型检索后的准入校验留到 07 / 09；在这些机制具备前不把未经核验的 LLM 总结填进已确认区。实现验收还需证明拒绝未确认内容、范围不明的确认、失效引用及未经确认的改写，不能用 JSON 格式通过替代语义核验。

## 审核范围（后续用户裁定）

Plan 定义 Gate；审核页只关心定义的 Gate 中已触发且需要人工介入的项。Plan 的全部 Gate 数量不等于当前待裁决数量。当前无待裁决项只代表无需额外关注，使用已定骨架空卡；不推导 Task 结束或 Delivery 终态。Delivery 有明确终态，Task 是否结束由用户决定。

U1 要求完成 Gate 后先显示决定回执、不自动抢切下一项；这不构成新增审核页常驻回执卡的要求。输入归属和未发送文本沿用 Input 的既有上下文规则，不因当前无待裁决项另造一套处理流程。

## 多 Gate 与 subject

`gate-queue-toggle` 展开队列，aria-expanded；队列按关键路径阻塞、可决条件、不可逆风险、创建时间确定性排序。G-3/G-5/G-6 为示例，不固定实例。

选择 Gate 原子更新问题、位置、触发、决定、解释、delta、效果、五类链接与 `composer-reply-subject`；不拆 Session、不隐藏其他消息。清除 reply subject 只回 Task 级 Input，不关闭 Gate。无明确有效 subject 的短句同意需澄清。

完成 Gate 后先看回执，不自动抢切下一个 Gate。按 D09，可独立并行 Wave 不应有未表达的 Gate 控制依赖；满足既定放行条件沿 DAG 正常推进。若当前决定改变未来 Gate 的定义、条件或依赖，必须纳入当前决定的影响说明，并经 Input 的 Plan IR 提案、校验/必要授权和提交后，按新 Plan revision 更新投影；不由审核页自行改写其他 Gate。进入 Plan 修改流程不等于强制跳转 Plan 页面。

## 五类证据与返回

| section | 角色 | 目标 |
|---|---|---|
| `gate-evidence-plan-context` | 计划上下文 | 精确 Plan revision 的 Wave/Gate/恢复/退出条件锚点；返回 from_gate_id |
| `gate-evidence-trigger-record` | 触发事实 | Trace 触发进入 Analysis；非 Trace 事实可用 Inspector |
| `gate-evidence-proposed-change` | 拟议变更 | Artifact Diff，base/candidate revision |
| `gate-evidence-validation-result` | 验证结果 | Evidence Receipt，必要时 span 深链 |
| `gate-evidence-governing-decision` | 既有决定 | Decision Receipt 与 source message |

统一 EvidenceRef 检查当前 Gate、revision、类型所需身份与读取权限。Inspector 替换 `gate-main-view`，Input/subject 不变；返回恢复 Gate/队列/滚动/草稿。跨 Analysis 使用显式 from_gate_id 与 return context，目标不在时明确失败。

## 例外状态与验收

无待决内容时按 [卡片规范](../../components/review-surfaces.md) 保留最小高度，使用“没有待裁决内容”、静态骨架或半透明空文件图标；不把已处理 Gate 冒充待决。单卡不超 control-bench，长纵向列表右上展开到带固定返回与 y-scroll 的完整查看组件。普通空态不显示加载；确有耗时读取在右下角通知小窗反馈。

旧版本写指令在提交边界 fail & refuse，通过原 Input/调用反馈，不自动换绑或重放。无有效回复目标的模糊同意在 DSH Chat 澄清，清除目标不清草稿。具体规则见 [Input](../../components/input-and-host-slots.md)。

证据适用性、精确对象不可定位及返回失败见 [查看器契约](../../components/context-viewers.md)；同快照数据与五类 EvidenceRef 一起更新。恢复及新旧 Delivery 关联见 [领域边界](../../foundations/product-and-domain.md)，审核页不另设恢复状态机。

AC13–AC16。确认记录准入、Task/Gate/Run 数据映射与提交机制仍需实现，见 [遗留待办](../../deferred-todos.zh-CN.md) 和数据契约清单；原型尚未完成 Decision Receipt 定位原始 Input 消息。预期注意力：唯一问题与影响 → 可核验决定 / AI 判断 → 拟执行效果 → 必要证据 → Input 作决定。
