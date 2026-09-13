# Input 与宿主 Slot

> 继承 U1「全局 Shell」「新建任务」「Gate subject」；系统写 owner 见 [领域边界](../foundations/product-and-domain.md)。

## 整体特殊组件边界（最新裁定）

整个 Input 都归 DSH：消息流、用户气泡、Assistant 正文、工具/审批/问卷、Composer、附件、模型与权限选择以及宿主反馈。Crystra 只通过 layout 限制挂载区域宽度和高度；Input 占满 Header 下方可用高度，上方不叠加 summary，与 bench 之间由外层垂直 divider 分隔。Crystra 传递既定 Task/Gate 上下文；不接管内部样式、尺寸、组件实现或交互。

公共字体、颜色、图标尺寸及后续圆角/间距变量不得穿透宿主子树。宿主内部 16px 正文、22px 气泡/Composer 圆角及 34px 发送按钮不受 Crystra 通用档位约束。Input 的内部取值只可作为自有设计的参考方案之一，内部 padding 不直接用作组件间 gap。详见 [间距与形状](../foundations/spacing-and-shape.md)。

v8 使用隔离样式和原生结构的静态样本展示外观，不代表已接入真实 Chat；生产整体挂载宿主 Slot，不将此样本发展为自主 Chat。Hero Input 同样遵循该边界。Iconify 规则适用于 Crystra 自有界面，不要求修改宿主图标；自有晶体品牌继续使用正式 SVG。

## 常驻 Input

`input-stream` 内 `conversation-feed` 是同 Task 连续消息流；`composer` 保留原生发送、附件、模型、工具卡、审批、问卷。Crystra 只增加 Task/Gate 上下文，不复制 Chat 实现。

`composer-add`、`composer-write-mode`、`composer-send` 是当前稿对宿主能力的示意定位；它们不发布 Crystra 自有参数或 authority。工作区写入表示可以提出候选 patch，不跳过校验。

| 状态/操作 | 行为 | 原型/生产边界 |
|---|---|---|
| 普通 Task 输入 | Task 级 subject，保留上下文 | 消息发送与历史由 DSH |
| 选择 Gate | 原子更新看板和 `composer-reply-subject` | 同 Session，其他消息仍可见 |
| `composer-reply-subject-clear` | 本条消息取消显式 Gate 归属 | 不关闭 Gate，不删除决定草稿/历史 |
| 审批卡选择与提交 | 每项选择绑定当前 subject/revision、principal、authority | `input-approval-*` 是示例问题，不固定业务字段 |
| 无 subject 的“同意/继续” | 回到 Input 澄清 | 不按最近 Gate 猜测 |
| 旧 revision 审批 | 提交边界 fail & refuse | 通过原 Input/调用结果反馈；不自动换绑或重放，见下文 |
| 已确认决定 | 在既有 Input 中反馈决定结果 | 不自动跳到下一个 Gate；不新增常驻回执卡，见 [Gate 页面](../pages/task-detail/gate.md) |

候选 patch 及失败反馈见 [状态文档](../foundations/states-and-content.md)。浏览选择与 authorizing principal 分开；DOM 中选中 Gate 并不自动构成人类授权。

## 目标校验、恢复命令与错误反馈

回复目标只是当前消息关联的 Gate identity/revision，未提交文本是宿主 Composer 内容。清除目标只回 Task 级 Input，不删 Gate、历史消息或草稿。缺少明确有效目标的“同意/继续”在现有 DSH Chat 中澄清，不默认最近 Gate，不新增目标选择弹窗。

写指令携带旧 version/revision 时，提交边界直接 fail & refuse：不执行业务变更，不自动改绑新版，不自动重放；通过原 Input/调用结果反馈。当前 bench 随已提交 Plan 投影更新，不改变历史精确引用的只读含义。

恢复复用既有 `/wsr recover [delivery-id]`，由 Intake / Execution 检查精确 detached 关联和原绑定条件；命令、Action 输入输出、普通回答、错误与 terminal result 复用宿主 Chat 时间线。插件投影只展示 owner 已确认的状态，不新增独立恢复状态机。依据 [DSH 使用契约](../../../../docs/guides/dsh-execution-quickstart.md) 的产品表面边界与重启恢复条款；底层启动/绑定失败不通过 UI 猜测修复。

## Hero Composer 与 Workspace

| 结构 | 公共 Slot / provider | Crystra 责任 |
|---|---|---|
| `new-task-composer-seat` | 外层布局 | 居中与空间分配 |
| `new-task-hero-composer-placeholder` | `conversation.composer.bar`，`variant="hero"` | 挂载公开 Slot，传 owner 定义的 props |
| `new-task-workspace-slot-placeholder` | `conversation.hero.workspace` / `@deepseek-ai/dsh-client-ui-workspace` | 暂存选择结果；不复制 Workspace 菜单 |
| 新增目录流程 | `conversation.hero.workspace.directoryFlow` | 继承宿主 Folder Picker；能力无则宿主隐藏新增入口 |

Hero 发送、附件等内部控件不为 Crystra 重复分配 ID。既有 Task Header 不放可编辑 Workspace 选择器。新建 Task 持久化时点与 Session 创建/绑定仍待设计，不能从静态 Slot 假按钮推导已经实现。

## 复用到 Workflow Studio 的边界

用户已确认（D04）：Studio 的 `design-input` / `design-composer` 复用 DSH Chat，所有 Workflow 语义修改由 LLM 形成 JSON IR 提案，经系统 owner 校验和必要授权后提交；保留原始输入、candidate patch、校验和 provenance。单一 Input 原则不再待选；具体提案卡、校验反馈、draft/apply/版本保存与发布流程仍待设计。宿主 Composer 不因页面不同再造一套实现。
