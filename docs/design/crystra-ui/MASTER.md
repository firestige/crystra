# Crystra 全局设计规则

> 本文件是整理后的检索入口，不替代上游 authority。效力说明见 [来源登记](sources/README.md)。

## 效力与继承

先判断规则属于哪一领域，再比较来源。文档整理后的用户明确裁定在其范围内优先，见 [后续用户裁定](handoff/decisions-and-open-questions.md)；D01 确认 Browser 组织，D02 记录公共区域范围，D14 确认 Task Browser 当前视觉与交互，D15 归并 Workflow Explorer / Sidebar 当前规则并保留 Studio 实验边界，D16 正式确认 Sidebar 标题行工具；D17 确认所有 Card 概念容器采用低对比细边框、灰度表面与淡阴影，见 [卡片表面规范](foundations/card-surfaces.md)。

原始输入的比较顺序：

- **系统语义**：以原仓库 `docs/` 中对应 owner 文档为准，并保留文档自身 candidate、published、translation 等状态；规范英文优先于跟踪翻译。
- **UI 设计**：`task-control-workbenches-design-input.zh-CN.md`（U1）> assets（A1–A4 / I1–I3）> 三份 memo（M1–M3）。Task v7（A1）是与 U1 对应的权威设计稿。
- **同属 assets**：本次使用 v7 表达具体布局，v6 表达风格；遇到二者不一致由 U1 裁定，无法裁定时登记待定。v6 的旧控件和阶段流程不能反向覆盖 U1。
- **本次建议 / skill**：用于补足结构、提问和检查，不提升为已接受设计。页面差异只覆盖允许变化的展示参数，不能覆盖全局只读原则、系统 owner 或上游规则。

文档中使用四种条款标签：`继承`（U1）、`资产提取`（设计稿现状）、`过程候选`（memo）、`整理建议`（本次补充）。`系统约束` 专指 docs 的语义；后者不表示所有对应 API 已经发布。

## 产品与任务

Crystra 是本次 UI 的品牌名，原系统文档仍使用 WSR / workflow-self-recursive。此包不修改仓库、包名、协议、命令或持久化身份。详见 [概念与 owner](foundations/product-and-domain.md)。

面向需要委托 agent Workflow、检查执行与作出少量关键判断的用户。主要任务是澄清目标、审查计划、监控执行、核对证据和判断当前结果。部署和宿主能力沿系统设计，不推导额外平台支持。

## 全局设备与空间前提

首期仅供用户本人使用，以 1920×1080 保证核心两栏的基础体验，覆盖 16:9 / 21:9 / 32:9 的更大屏幕。其他低分辨率或移动端场景后置。

屏幕规格只定义验证场景，不作布局断点。布局以 DSH 挂载区域的实际可用宽高为输入，计入全局 Sidebar、Header、间距和 Better Sidebar 的占用。基础场景必须容纳 Input 与 bench；更大屏幕也按剩余空间判断右侧/底部文件面是否可行。核心两栏优先，必要时折叠全局导航或收起文件面。具体测量与分配规则见 [布局规范](foundations/layout.md)。

各工作台 Header 延后到 Workflow/Analysis 页面设计之后统一定稿；Task Browser 当前 Header 组合已审核，见 [页面规范](pages/task-browser.md)，不据此冻结其他页面；Task 摘要拟纳入 Header，二者语义仍分离。详见 [D03](handoff/decisions-and-open-questions.md#d03)。

## 设计问题的适用性筛选

按系统 docs 的 owner/版本确定系统语义，按 UI 权威 > assets > memo 与后续用户裁定确定 UI。先基于单用户、本地 DSH 集成和既有 Chat/会话/恢复能力推导处理链；能闭环的直接记录，实现任务不包装成产品选择。不得凭空引入企业级安全、多用户协调、多角色认证等超范围需求。只将真实存在、属于当前产品且无法从现有约束推导解决的分歧交给用户，见 [D12](handoff/decisions-and-open-questions.md#d12)。

## 必须跨页一致的规则

1. **Input 是 Task 语义写入口；Workflow Studio 有后续直接编辑约定。** 2026-09-13 汇总：Workflow 草稿允许在节点直接修改绑定，以及资源内容编辑、增删改名；与 Chat 共用校验提交路径，见[业务接入需求](pages/workflow-studio-contracts.md)。此范围替代早期 D04 对 Workflow 的一刀切限制，不扩展 Task 执行控制。以下唯一入口约束适用于 Task： 修改、批准、拒绝、重试、暂停、Replan 等意图进入 Input；复用 DSH Chat，LLM 生成 JSON IR 变更提案，最终状态由相应 owner 校验并在必要授权后提交。具体提案协议和版本事务仍待设计。Task 右侧工作面没有业务写按钮。Task Browser 已审核的显示改名、缩略图、Pin、归档属于资源管理；只改变展示与收纳，不改目标、计划、审批或执行，不以归档结束 Task / Delivery。边界见 [正式页面](pages/task-browser.md#数据语义与实现边界)。
2. **五个工作面并列。** Grilling、Plan、Execution、Gate、Delivery 可任意访问；当前查看与系统活动分别表达。无阶段连线、线性向导或访问即迁移。
3. **同 Task 保持连续输入上下文。** 工作面切换、Wave 下钻、Gate Inspector 不拆 Session；跨 Task 的真实恢复由宿主和状态服务承担，静态稿不伪造。
4. **精确身份导航。** 标题、时间、“最近一次”均不是关联键；找不到目标时明确反馈并保留返回上下文。UI identity 与系统字段映射见概念文档，不能凭命名相似绑定。
5. **审核封面优先。** 正常项聚合，异常展开；完整 Plan、DAG、证据、Trace 通过只读下钻获取。跨页面用户流程与页面视觉注意力顺序分别记录。
6. **宿主能力复用。** Composer、Workspace Slot、设置归 DSH；文件能力归可选 Better Sidebar。未发现文件能力即隐藏入口，文件不成为第六工作面。
7. **事实、提案、决定分别展示。** 未确认理解不能变成决定；未执行候选不能画成已发生路径。缺失、不可用、下界、不适用不能显示为零或成功。
8. **当前可交付性不等于结束。** Delivery 工作面是 Task 当前判断；底层 Delivery 是一次执行。追加目标可以使判断失效，不能重写已结束执行的历史。
9. **全局 Shell 一致。** Sidebar 只有任务、工作流、分析三个独立折叠区；品牌无 Banner 卡片，Footer 固定。旧图中的 Work/Build/Library 不继承。Sidebar v8 的展开/折叠及抽屉动效已确认；Header 整合与宿主接入见 [遗留待办](deferred-todos.zh-CN.md)。
10. **语言与动效一致。** 产品文案整组切换 zh-CN/en；用户数据不擅自翻译。reduced motion 停运动层，语义仍可读。

卡片展示统一遵循用户 [D05](handoff/decisions-and-open-questions.md#d05)：最小高度、缺数据骨架、单卡不超 control-bench、长列表右上展开到带返回和纵向滚动的完整查看组件。详见 [公共卡片规范](components/review-surfaces.md)。

## v8 组件复用与设计审查

v8 承担最终 UI/UX 演示，应尽可能引用已制成的共享组件。能力不足时，先补组件样本、请人工审查，获准后再接入页面；复杂交互无法演示的部分写入页面文档。执行步骤与现状盘点例外见 [Agent 指南](handoff/component-first-guide.md)（D18）。

## 各层的权责

| 层 | 唯一维护内容 | 不应重复维护 |
|---|---|---|
| foundations | 术语、owner、视觉、全局布局、导航、状态 | 页面具体卡片的业务字段 |
| components | 组件公共状态与行为、资源/宿主适配边界 | 某个 Task/Gate 的实例事实 |
| pages | 布局、组件组合、页面特有动作与缺口 | 另一套颜色、图引擎或 Composer |
| flows | 跨页入口、分支、subject 与返回恢复 | Workflow 的执行状态机 |
| handoff | 可检查的契约、差异、未决问题、来源映射 | 新的系统 API 或发布结论 |

[视觉](foundations/visual-language.md) · [空间](foundations/layout.md) · [导航](foundations/navigation.md) · [状态与语言](foundations/states-and-content.md) · [组件](components/README.md)

Widget 当前样式已接受。Widget 持有内部状态并组合展示组件，Dashboard 管理布局与持久化；切换形式不重建整个 Widget。组件化按 [Widget / 展示组件 / Dashboard 契约](components/widget-component-contract.md)执行，视觉仍以 [表达设计](components/widget-expression-design.md)为准。

D22 已确认并接入 [对比分析观察设置](components/result-analysis-review.md)，覆盖旧研究报表候选。
