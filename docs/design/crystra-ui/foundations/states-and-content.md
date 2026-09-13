# 通用状态、反馈、语言与可访问性

> 继承：U1 的过期审批、精确失败、同快照更新、locale、动效约束。系统约束：S1/S3/S5/S6 的缺失/保留/指标语义。其余标为整理建议。

## 空卡与骨架的统一规则

用户 D05 / D06 允许有最小高度的空卡显示“No xx”/“没有待裁决内容”，或只放静态骨架、半透明空文件图标，完整展示约束见 [卡片规范](../components/review-surfaces.md)。不为普通本地数据空态增加“加载中”；纯图标提供辅助技术可读的含义。有历史数据时保留真实内容，错误、revision 与授权状态不得因摘要省略而丢失。

确有耗时读取时，右下角悬浮通知区域显示小窗及进度条；进度可量化则使用真实值，否则使用不定进度，不编造百分比。即时读取不必闪现通知。本条确认通知形式，不把执行恢复、权限失败等业务问题自动等同于加载进度；具体恢复与错误反馈遵循下述 DSH 能力边界。

## 状态不混用

| 状态 | 应呈现的意义 | 行为边界 |
|---|---|---|
| 确有耗时读取（D06） | 右下角悬浮通知小窗显示进度条 | 普通本地空态不显示加载；保留 Shell/Input，不混合对象，不伪造百分比 |
| 空白新建 | 尚未形成 Task 的 Hero Composer | 不伪造 Task/Delivery 数据 |
| 空集合 / 搜索无结果 | 集合无项或查询无匹配，二者区分 | 无结果允许清除筛选；不得编造示例作为真实数据 |
| 尚无运行实例 | Wave 未产生关联 Workflow Run | 只读 Wave 摘要，禁止伪造活动图 |
| 无法定位 | 身份缺失、不匹配或目标不可读 | 保留显式返回；不改查最近运行 |
| 不可用 / 下界 / 不适用 | owner 返回的不同事实完整性 | 不显示 0、100% 或正常；原因来自 owner |
| Evidence 不可用 | 观察链路不可用 | 不改变 Runner outcome，不据此暂停 Task |
| 权限不足 | 宿主/资源 owner 明确拒绝 | 不在浏览器绕过，不在本包发明独立鉴权系统 |
| 旧版本写指令（D11） | 目标 version/revision 与当前不符 | 提交边界 fail & refuse；原 Input/调用反馈，不执行、不自动换绑或重放 |
| 读取失败（整理建议） | 当前读取失败，与无数据区分 | 可重试只读请求；重试读取不是重跑 Workflow |
| Clipboard 失败（整理建议） | 未完成复制 | 保留原值可选择，不展示成功图标 |

新对象加载的组件应以目标 identity/revision 为边界整体切换。Gate 的问题、解释、差异、执行预览、证据必须同快照原子更新；这不等于宣称 Evidence 跨 route 全局事务快照。

## DSH 能力边界

恢复与 Session/Delivery 关联由 DSH Intake / Execution 按既定契约处理，插件消费结果；命令、错误和 terminal result 复用已有宿主 Chat。明确未满足绑定/版本前提的提交由原校验拒绝，不另造审核页恢复状态机。读取检查只消费实际宿主/资源能力，不新增独立认证体系。精确读取失败保留来源且不猜替代对象，无有效回复目标则在原 Chat 澄清；具体机制见 [Input 与宿主 Slot](../components/input-and-host-slots.md) 和 [Context Inspector](../components/context-viewers.md)。

## 用户输入与权威提交

已确认：短句同意必须有明确 subject 与有效 revision；未授权解释一直是候选；过期审批不得提交。

候选写协议：Input → 语义解释 → typed proposal → schema/invariant/authority 检查 → 决定/变更记录 → owner commit → 新 revision 投影。JSON Patch、领域 command 或受限 mutation 的选择未定。

整理建议：校验失败时在 Input 原提案附近保留错误、目标 revision、用户原文与可纠正方向；提交等待中阻止同一卡片重复提交；恢复时再次核验 subject。去重 token、事务、回滚与持久化行为由 owner 发布，本包不决定。

## 语言与内容

支持 zh-CN/en 的同组 key，全页导航、标题、计数单位、状态、指标和帮助文案一起切换。用户消息、Agent 内容、文件名、代码标识不擅自翻译。Crystra、JSON IR、DAG、模型/协议名可保留。

| 中文产品术语 | 英文文案建议 | 备注 |
|---|---|---|
| 任务 | Task | 分组，不等于一次执行 |
| 问题澄清 | Grilling | 英文显示名待整体文案审核 |
| 计划 / 执行 / 关口审核 | Plan / Execution / Gate Review | 并列导航 |
| 交付状态 | Delivery Readiness | 避免与底层 Delivery 实例混淆 |
| 当前交付候选 | Current delivery candidates | 不用“最终交付物” |
| 当前决策状态 | Current decision state | 不加只读/实现机制副标题 |
| 无法定位该运行 | Unable to locate this run | 不把示例回退当成功 |

Task 标题单行省略，完整身份与可复制值不按显示省略值传输。具体长文本、换行、空值、计数单位的产品文案以目标页面真实数据验证；无来源的预算、成本和百分比都只是原型 fixture。

## 焦点、键盘与动效

继承要求：Wave 下钻 Enter/Space 可达；折叠菜单/运行身份同步 `aria-expanded`；动效开关同步 `aria-pressed`；查看导航 `aria-current` 与系统活动分别表达；搜索 Escape 清空并退出；所有纯图标入口有可访问名称。

整理建议：Inspector/身份浮层打开后有确定焦点入口，关闭后回触发元素；更新状态可被辅助技术感知，避免每次遥测都打断读者。Context Inspector 是右侧查看模式，不应默认将整个 Shell 设为模态或困住 Input 焦点；具体焦点模型待实现验证。

运行扫光遵循 `prefers-reduced-motion` 与用户开关，停止后底层边、图例、文字、节点形状、前沿完整。无基线时不显示快慢结论；一次只有一个主要运动焦点。`UI UX Pro Max` 的定向查询作为补充审阅材料见 [方法记录](../sources/methods/ui-ux-pro-max-search.md)，不覆盖现有尺寸和桌面布局决策。
