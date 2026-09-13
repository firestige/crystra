# 设计交付验收矩阵

> 下表是实现/后续设计的验收目标，不是测试通过报告。实际本次检查见 [validation-report](validation-report.md)。来源为 U1，或注明的系统/建议项。

| ID | 场景 / 触发 | 可观察的通过条件 | 当前边界 |
|---|---|---|---|
| AC01 | 品牌、折叠、设置、三级 Sidebar | 品牌无卡片；折叠态左上仅展开，展开态 Banner 双向切换且不新建 Session；v8 抽屉动效、目录和上下文保持；设置用宿主；Footer 固定 | 宿主集成未验 |
| AC02 | 新建 Task / Workspace | 居中 Hero Slot，空白态无新 Task/Session；旧 Task 无可编辑 Workspace | 持久化时点待定 |
| AC03 | Task / Workflow 标题工具、搜索 / 菜单 / 折叠 | 按 [D16](decisions-and-open-questions.md#d16)：搜索、视图、三角全部入口同处标题行；tooltip / focus 提示可见；列表底部无重复入口；搜索原位替换；菜单下展；Escape / 外点清查询；折叠关菜单但保留标题工具；视图偏好保留；工具 hover / click 独立 | 正式设计已确认；v8 本地验证见报告，生产宿主待验 |
| AC04 | Task 状态与排序 | FILO 默认；活动按有效事件；失败/待审仍活跃；单行与徽标语义正确 | 数据服务待映射 |
| AC05 | 切工作面、断点、文件面 | Input/Session/草稿不重建；浏览和系统活动分离；无 Better 能力则无入口 | 真实恢复待验 |
| AC06 | Grilling 新增/争论/修订 | 计数、原因、Brief/delta 同步；无争论消失；无右侧写按钮 | IR 服务未交付 |
| AC07 | Plan 正文 / DAG / Gate 来源 | 同精确 revision；Input 可见；from_gate 返回；浏览状态恢复 | 原稿恢复未完整 |
| AC08 | 图搜索/折叠/布局 | 零匹配不近似跳转；关系不丢；专用引擎满足拓扑与稳定性 | 引擎与性能阈值待定 |
| AC09 | Execution 默认 / Wave 下钻 | 默认 Plan Run；click/Enter/Space 可达；无 Run 不伪图 | 原稿单 Wave 演示 |
| AC10 | 身份浮层 / 复制 / Analysis | 默认折叠、不挤图；30/15px；复制原值；组合身份精确 | clipboard/目标服务待验 |
| AC11 | Execution 路径与状态 | 允许拓扑/已发生/候选分开；实际循环访问；前沿与当前面板同身份；Execution 直线/90 度折线，无曲线 | 真正运行投影待验 |
| AC12 | reduced motion / 速度基线 | 运动停而静态完整；无基线中性；生产不能点击切速度 | 演示不等于上线 |
| AC13 | 多 Gate 切换 | 问题/决定/解释/delta/效果/证据/subject 同快照；队列确定排序 | 真实并发更新待验 |
| AC14 | 无 subject / 过期审批 | 短句要求澄清；旧版本写指令 fail & refuse，无业务变更、不自动换绑/重放；原 Input/调用反馈；回执后不自动切下一 Gate | 端到端 authority 待验 |
| AC15 | 五类 Gate EvidenceRef | Gate 归属与权限核验；固定 revision；不同 renderer；无写入 | 类型化载体待 owner 对齐 |
| AC16 | Gate→Plan/Analysis/Inspector→返回 | 显式 return context，恢复原 Gate/队列/subject/草稿/滚动；失效不回退 | 原消息定位未完成 |
| AC17 | Delivery 浏览 / 追加目标 | 当前判断非终点；新目标使旧判断失效；候选不是最终；未裁决风险关联 Gate | readiness owner 待映射 |
| AC18 | Task Browser 浏览 / 管理 / 返回 | 按 [正式规范](../pages/task-browser.md)及下方补充验收；保持精确 task_id 与 Shell；真实返回恢复不伪造 | 当前 v8 视觉与交互已审核；本地原型验证见报告，生产目录 / 持久化 / 跨导航恢复待验 |
| AC19 | Workflow 入口/版本/草稿 | definition+revision+来源 Task；打开不产生 transition/Delivery；Workflow 修改统一经 DSH Chat→LLM JSON IR 提案→owner 校验/必要授权；图只读，无右侧独立业务写入口 | 原则已确认；v8 已同步 Shell / 组件并演示只读节点详情和版本导航；页面组合待审阅，提案 / 校验 / 保存发布待接入 |
| AC20 | Analysis 精确来源 / 只读 | 缺参/不存在明确失败；禁止改 evidence/verdict 或重跑 | v8 已演示 tabs / 本地筛选 / Trace 节点详情；外部来源不回退样例，真实 Query 与返回恢复待验 |
| AC21 | 指标 / Compare（系统约束） | Evolution 提供值/Delta；保留 coverage/兼容性；不自算收益或因果；receipt 范围明确 | 真实接口集成待验 |
| AC22 | 缺数据 / retention（系统约束） | 缺失不为零；查无记录不猜删除原因；无恢复按钮；Evidence 缺失不改执行 | 按精确 Query 版本验 |
| AC23 | 双语、长标题、键盘、焦点 | 产品文案整体 locale；用户数据不改写；状态非仅色彩；输入/焦点不遮挡 | 本次未做浏览器/用户测试 |
| AC24 | 静态 DOM 到契约覆盖 | 解析真实 start tag；每个静态 ID 有出处；排除 JS selector 模板 | 本次机械检查项目 |

## 首期尺寸验收范围

以用户自用的 1920×1080 正常使用环境验证核心两栏基础体验，计入浏览器、宿主、Header 和全局 Sidebar 占用。Input ≥360px、Control ≥680px，Composer 和工作面保持可用；文件面打开时重新检查剩余宽高，不能挤掉核心内容。

更大屏幕按实际挂载容器宽高验证，而非直接按物理分辨率选模式；同一屏幕下 Sidebar 开合、文件面开关/停靠和内容区域变化应得到相应布局。右侧空间不够时只有底部高度足够才可底部停靠，否则收起工具面；切换保持会话、草稿与文件 Tab。其他低分辨率和移动端场景后置。历史原型的小尺寸测试不扩大支持范围。

## 卡片补充验收（D05）

空数据卡片保留最小高度，以对应短文案或静态骨架/半透明空文件图标表达空态，不强制叠加文案；普通本地空态不出现加载。确有耗时读取时在右下角悬浮通知小窗显示真实或不定进度；错误与未知不冒充确认无数据；单卡不超过 control-bench 可用高度。大量纵向列表在摘要卡中省略，右上展开后完整查看组件占满工作面，返回可见、内容可纵向滚动、Input 保持。不得将已有历史或失效状态伪装成空数据。此处是后续实现验收要求，本轮只同步文档，未更新 HTML。

## Gate 已确认决定准入验收（D08）

已确认区每项可定位明确确认记录及其被确认内容、范围；仅有相似文本/同意字样/引用 ID 或模型新摘要不构成准入。范围或适用性不能证明则排除，允许漏列，不允许误列为已确认。AI 理解与比较判断保持模型判断身份；列表不声称完整，预测不声称确定效果。实现验证跟踪 L03，本轮仅完成设计裁定与文档同步。

## 宿主接入与版本边界验收

- 修改 Gate 条件、Wave 内容或 DAG 路径后，产生新 Plan 版本并同步当前 bench 投影；仅勾检查单不 bump；历史精确引用和旧 Delivery Manifest 不被重写。
- detached 恢复使用既有宿主命令及精确绑定，新旧 Delivery 不因同 Task 自动混用。未知状态不伪造 terminal，恢复失败沿宿主反馈，不创造 UI 恢复路径。
- 旧版本指令被拒绝且无业务变更、换绑或重放；无明确目标的同意进入原 Chat 澄清。
- 缺参、精确对象不存在或返回来源失效时明确失败，保留来源而不选择替代对象。重试读取不重跑执行，Evidence 不可用不改变执行结果。

以上为实现验收条件，未声明宿主集成已经验证通过。

## 实现检查层级

1. 文档检查：来源、角色、未知项、精确 section 可定位。
2. 静态原型检查：布局与设计稿演示行为；以完整浏览器场景验证，不能只看截图。
3. 宿主/服务集成：Task/Session/Delivery binding、真实 Gate revision、读取权限、草稿恢复、clipboard、数据完整性。
4. 系统 conformance 与性能：各 owner 的 exact Contract、图引擎规模/稳定性、失效恢复。

不同层的通过不能互相替代。原目录 layout.test.mjs 已作为历史参考保留；本次不把原稿测试重跑等同于新文档或生产行为通过。


<a id="task-browser-acceptance"></a>

## Task Browser 补充验收（D14）

| 范围 | 可观察条件 |
|---|---|
| Header 与结果栏 | identity → search → toolbar → actions；不渲染集合 Summary；归档图标 + 新建任务为 ButtonGroup；已选数量 / 清选与全选结果、任务数量同处下方结果栏 |
| Gallery | Workspace 默认分组并可折叠；按实际容器宽度 flow row 换行、无限追加，屏幕外分组不因旧观察结果提前全量加载；文字仅 title / subtitle / status，图片与文字之间用进度线，无可见百分比 |
| Card 标记 | 无缩略图用默认 Iconify 图标；关注角标右上、error > warn、超过 9 显示 9+、零不画；左上圆角 checkbox 无深色底框，选中外框完整覆盖缩略图区 |
| List | 无外层 Card 背景 / 边框 / 圆角，仅横向行分隔；字段齐全、进度为条形；每行末尾三点操作，分页 12 / 24 / 48，首尾按钮正确禁用 |
| 多选 | 全选作用于当前查询全部结果，含未追加和其他分页；部分选中为中间态；换视图 / 排序 / 分组 / 翻页保留，搜索 / 筛选变化清选；选择不触发任务导航 |
| 资源操作 | 改名与缩略图更新对应精确资源；Pin 可取消且只影响浏览排序；单项归档只影响该项，批量归档只影响所选，最近一批可撤销；不结束 Task 或修改执行状态 |
| 菜单与焦点 | Gallery 右下角菜单向卡内展开；List 行菜单向下、浮层不被裁切；分页 Select 下方不足则向上、足够则向下；Escape 关闭菜单、取消改名时返回可用触发器；外部点击或焦点离开时关闭且不抢回焦点，归档后焦点进入撤销通知；键盘可操作 |
| 宿主与真实数据 | 页面内样本测试不证明真实 Task / Session 切换；正式接入保留查询与草稿，处理精确身份和真实数据缺失；归档 / Pin / 名称 / 缩略图持久化单独验证 |

以上已接受的是设计条件。实际检查入口为 [Task Browser 测试](../assets/task-browser.test.mjs)与 [报告](validation-report.md#task-browser-v8-正式归档检查)；未实现的生产链路不能以用户审核替代测试。

## Workflow Explorer / Sidebar 归并验收（D15）

| 范围 | 验收条件 | 正文入口 |
|---|---|---|
| Workflow 身份 | 无 Workspace；最新 / 全部版本独立于 Gallery / List；进入精确 definition + revision | [Workflow Explorer](../pages/workflow-explorer.md) |
| 版本选择 | 先确定最新版本再筛选；不回退历史版本；切版本模式清选，全选不包含被折叠的历史条目 | 同上 |
| 资源操作 | 按精确条目改显示名 / 缩略图 / Pin / 归档；不改定义、Package 状态或 Delivery；单项和批量相互隔离 | 同上 |
| 公共浏览组件 | Header / 结果栏分工、独立资源卡、无外框 List、控件隔离、菜单方向与分页例外 | [组件配方](../components/component-recipes.md#browser-resource-controls) |
| Sidebar | 64px rail、18px 导航图标、40px 命中区；目录复用原节点，Escape 分层退出；340ms 抽屉及 reduced motion | [Sidebar](../components/shell-and-sidebar.md) |
| Banner | 折叠只展开，展开双向切换；真实宿主替换新会话处理器，不叠加重复动作 | 同上；生产验证归 L02 |

这些规则在临时设计工作区正式归档；真实资源存储、会话恢复、公共 API 与宿主接入仍未交付。Workflow Studio 的活动图、JSONIR 和投影工具样本不在此次确认范围。
