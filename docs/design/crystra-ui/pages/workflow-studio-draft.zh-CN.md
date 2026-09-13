# Workflow Studio · 活动图设计草稿

> 历史草案：不作为本轮业务需求输入。当前页面见[工作台](workflow-studio.md)，JSONIR 与绑定需求见[业务接入需求](workflow-studio-contracts.md)，完整布局见[优先候选](../components/workflow-map-layout-candidate.md)。本文的多 Tab、角标及旧数据结构仅供追溯，不与现行规则并列生效。

> 2026-09-09。主流程固定为第一个 Tab，阶段展开与可触发流程位于后续 Tab；节点角标表示关联。当前样例按 Implementation 权威阶段重画，视觉与 JSONIR 仍待审阅。
> [打开 Studio v8](../assets/crystra-workflow-studio-v8.html) · [页面截图](../assets/workflow-studio-v8.png)。

## 语义依据与表达范围

阶段与 successor 依据 [Implementation Transition Authority §3](../../../../workflow-package/implementation/workflow.md)。Action 执行并返回结果，Runtime 按已声明 routing 推进；需要语义分类时才使用内部 Planner，不为此新增 Planner Action。路由边不表示前一个 Agent 自行启动下一个 Agent。

契约边界见 [published DSL §5.3–5.4](../../../../docs/contracts/workflow/workflow-definition-dsl.md) 与 [2.0 candidate 的继承范围](../../../../docs/workflow-composition-model-2.0.0-candidate.md)。本图是带来源说明的设计概览，不是完整可执行 Definition，也不是某次 Run 的事实路径。

## 主流程：逐 Goal 推进，再全范围验证

| 图中阶段 | 权威范围与条件 |
|---|---|
| 准备与确认 | IM-01–05：绑定 Goal 与权威设计、预检、必要的可行性验证、澄清并冻结 Goal 图、确认后激活实现分支 |
| 选择 Goal / rung | IM-06：Runtime 按依赖与提交状态确定 ready Goal/rung |
| 测试阶梯 | IM-07–11，蓝色角标展开第二个 Tab |
| 独立复核与修复 | IM-12–15：同一候选的隔离黑盒/白盒复核，barrier 后汇总 Finding，按测试/实现归属修复，由原 Finding 视角复查 |
| 提交已验证 Goal | IM-16，提交后返回 IM-06 |
| 全范围验证 | 只有全部 Goal 已提交才进入 IM-17；回归与双复核通过后进入终门 |
| 终门校验 → 实现就绪 | IM-18，通过后输出 VERIFIED_IMPLEMENTATION_READY；不自动结束 Task，不默认合并、推送、发 PR 或部署 |

活动组折叠多个已声明 Action。独立复核节点保留修复循环的含义：IM-13 → IM-14T / IM-14I → IM-15，未关闭则回 IM-13。全范围验证的 Finding 也走这段处理，但关闭后回 IM-17，不进入 Goal commit。两种 scope 的返回位置在节点详情中分别说明。

准备阶段的用户/外部等待、IM-06 缺少跨 owner 必需产物且没有独立 ready Goal 时的等待，均非成功终态；恢复到权威指定的 Action。权威设计需重开时停止当前 Delivery。预算耗尽、取消、不可重试失败等通用出口尚未逐线绘制，不能把概览中未画出的分支当成不存在或已经通过。

## 测试阶梯展开

| 结果 | 路由 |
|---|---|
| IM-07 可区分 RED 或经挑战的 existing-GREEN | 进入 IM-08 实现 |
| IM-07 Goal / Oracle 歧义 | 跨图出口返回 IM-03 澄清 |
| IM-08 预期 RED 且有诊断进展 | 保持 IM-08，直线返回 |
| IM-08 当前 rung GREEN | IM-09 补结构覆盖 |
| IM-09 新增测试 RED / 分支已覆盖 | 分别回 IM-08 / 进入 IM-10 |
| IM-10 回归失败 / GREEN 或无需重构 | 分别回 IM-08 / 进入 IM-11 |
| IM-11 还有 rung / 整个阶梯已验证 | 分别回 IM-07 / 进入 IM-12 |
| IM-11 无效反馈或可精确归属的阶段失败 | 返回记录的 owning Action |

菱形“实现结果”是 IM-08 的结果路由投影，不是额外 Action。“编写 / 修改实现”只拥有生产实现；formal tests 与 harness 不由 Implementer 随意修改。跨图出口使用虚线胶囊框，标明目标阶段，不使用终点双圆。阶段展开是视图分解；Goal 与 rung 循环都不是嵌套 Workflow。

[测试阶梯截图](../assets/workflow-studio-ladder-v8.png)。

## 按需外查

IM-01R Evidence Scout 只读查询获准且可派生的事实，产出来源、结论和不确定项，返回记录的 requesting Action。图中示范“准备与确认”及 IM-08 的触发入口；其他消费事实的 Action 同样可能触发，不把两个示范入口当成穷举。

角色、活动和模型分开表达。DeepSeek v4 Flash 仅为用户指定的模型绑定示例，不据此改变正式 Route，也不实际调用。研究材料不承担路由或设计决策，Scout 不写实现、不启动其他 Workflow。请求登记、研究材料与交回位置是 IM-01R 的阅读分解，不新增执行 Action。

## 多 Tab 与角标

用户已选择多 Tab 的组织方式。第一页为主流程，后续页分别承载子流程、可触发流程；页面显示顺序由 flows 的显式顺序决定。简单样本只有一个主流程 Tab。样本比较按钮只用于设计审阅，不成为 Workflow 属性。

- 主流程 → 测试阶梯 → 按需外查三个 Tab 同时可见。复用既有 Tabs，左右键移动焦点，Enter / Space 激活。
- 圆角活动节点右上：蓝色 Iconify git-branch 角标表示阶段可展开；琥珀色 arrow-up-right 表示可触发流程。图例使用同一套符号。
- 有两种关联时并排显示两个角标，无关联则不画。每条关联有自己的角标与目标，多个同类关联也不静默折叠成无法区分的单一目标。
- hover 的原生提示与可访问名称说明目标及触发条件；点击角标切到目标 Tab 并选中入口。点击节点正文打开详情，二者独立。
- 后续 Tab 显示关联来源活动，可点击定位来源节点；公共流程列出多个来源，不把它们伪装成单一父流程。
- 每个 Tab 独立保留缩放、滚动位置、选中节点。切换不形成领域变更，也不触发 Agent 执行。
- 详情使用右侧非模态抽屉，显示职责、输出、Role、模型、权威来源与关联流程；支持关闭 / Escape。帮助按需打开，不常驻说明卡。

图例同时覆盖活动矩形、判断菱形、终点双圆、跨图出口、材料虚线框、两类角标，以及控制流、条件 / 返工、通过、停止 / 重开、材料交接。图中颜色是设计路径语义，不表示某次运行事实。

[JSONIR 草案](workflow-activity-jsonir.draft.md)维护数据边界和字段。Tab、角标、来源列表和跳转均从同一份 IR 生成，坐标、端口与 SVG 路由由 ELK 生成并单独保存，不手工维护。

截图：[主流程](../assets/workflow-studio-v8.png) · [简单流程](../assets/workflow-studio-simple-v8.png) · [测试阶梯](../assets/workflow-studio-ladder-v8.png) · [可触发流程](../assets/workflow-studio-research-v8.png) · [详情](../assets/workflow-studio-research-detail-v8.png)。

## 布局与视觉

- 保留现有 Header、Sidebar、全高 Input 与 Input / bench divider。
- 单一画布窗口填满 bench 的剩余空间；顶部放流程 Tabs 与关联来源，底部放紧凑图例。缩放与适应视图控件浮于画布左下。
- 顶部提供紧凑布局 / 横向布局 / 纵向布局三个候选，默认紧凑布局，具体几何由 ELK Layered 计算。全部关系采用水平与垂直线段，转角不使用 Bézier 或曲线平滑；返工回线由引擎避让节点。分支与材料边显示标签，普通单出口顺序边的完整描述在详情中查看。
- 紧凑主图把逐 Goal 循环与全部 Goal 完成后的收尾分为上下两段；测试阶梯按测试准备、实现与结果、覆盖与验证、跨图出口组织。分组标题只帮助阅读，不增加 Action。
- 紧凑版首次打开按画布实际可用宽高适配，横向 / 纵向候选首次以 100% 打开；超出可用区域时在画布内滚动。“适应视图”展示全貌；点击缩放百分比恢复 100%。每个方向、每个 Tab 分别保留缩放和滚动位置，方向切换保留当前语义选择。节点角标与来源跳转会把目标节点移入视口。
- 活动为圆角矩形，判断为菱形，验证出口为圆形终点；不能只靠颜色区分含义。
- 每张图从 entryNodeId 自动标记入口：主流程显示实心圆与“起点”，辅助图显示“流程入口”。标记置于入口卡片上沿，图例同步；不新增业务节点或 Action。
- 紧凑布局可声明关联边的对齐约束；当前“编写 / 修改实现”与“实现结果”共享中心线，关联返工边优先占中心端口。组间位置根据测量锚点提交 ELK INTERACTIVE 布局。两端同轴且整条直线通过节点与标签避让检查时，消除多余绕行；有遮挡则保留 ELK 路由，不强画直线。
- 中性实线表示顺序，蓝色表示条件流转 / 返工，绿色表示验证通过，红色用于停止 / 权威设计重开路径；灰色虚线表示材料产出与读取，不是额外的执行步骤。静态线条不表示某次运行已发生。
- 节点默认简短标题与副标题；选中后通过详情抽屉披露详细含义、输出或目标活动。
- 参考 [Archify DESIGN.md](https://github.com/tt-a1i/archify/blob/main/DESIGN.md) 的主画布、语义一致、渐进披露及 viewer state 隔离原则；沿用 Crystra 当前字体和颜色资产。

## 只读交互

- 通过 Tab 或节点角标浏览关联流程，来源活动入口负责定位。这些操作只影响 viewer state。
- 点击节点、分支标签或连线，打开或更新详情抽屉；选中线加粗，选中节点强化边框。
- 键盘可聚焦节点和分支，Enter / Space 选择。
- 放大 / 缩小仅调整视口；放大后在画布内滚动查看，适应视图依据画布实际可用宽度与高度完整容纳当前图。没有拖动节点、编辑连线或直接推进 Workflow 的操作。
- 默认直接打开 v8 显示本活动图；显式指定既有 `build-and-sign / v3` 时继续展示该精确样例，不用活动图冒充另一个版本。未解析的精确来源仍不回退。

## 投影工具组合样本

工作台围绕当前问题组合投影，Chat 承接意图与修订。图形、关注项、推演与资源是工具能力，不定义互斥的业务模式。本轮只打样，尚未审核为正式布局。

- 活动图仍是中央画布，保留多层级 Tabs、ELK 正交连线、缩放、入口和关联角标。
- 顶部提供静态关注、打开推演、绑定资源三个工具入口。关注项和资源复用右侧按需抽屉；图下注入的推演控制条可与抽屉同时存在。
- 静态关注自动检查当前样例的图引用和资源引用。默认引用闭合；“查看缺失绑定样例”在展示资源目录中移除一个 Skill，确定性检查立即产生关注项。它标在主图“测试阶梯”和展开图“编写 / 修改实现”处，可定位、引用到 Chat，恢复目录后自动消失。这个故障是明确标记的演示输入，不表示权威 Implementation 存在该缺陷。
- 推演样例从已校准的 G-02 / R2 开始。播放沿声明边推进，遇到 RED / GREEN、下一 rung / 进入复核等选择时暂停；用户选择后可继续播放或单步。不是每次回边都合并成一个节点：轨迹保留重复访问。回看后改选会替换本次推演后续轨迹，不改变 Workflow。
- 当前节点、最近经过的关系与移动的数据标记联动；数据面板把本步变化置顶。数据字段与数值是情景展示样例，不是正式 Action resultSchema，也不是实际 Run 记录。
- 这一个情景假定校准已完成、覆盖闭合、重构不引入回归，因此播放只使用其声明的边集合；没有宣称穷举图中路径。用户可引用当前情景与轨迹到 Chat，讨论其他假设、LLM 分析或修订。当前页面尚未接入真实 LLM 调用和动态投影指令。
- 资源分 Role、Prompt、Skill、Template、Script，内容取自仓库快照。可从节点筛选资源、查看原文、反查示例使用位置并引用到 Chat。使用关系为阅读组织样例，不替代正式 Action / Route / Artifact 绑定，也不运行 Script。
- “引用到 Chat”只追加到宿主输入框，保留已有草稿，不自动发送。工具按钮不提交定义修改。

[关注项样例](../assets/workflow-studio-projection-issues-v8.png) · [资源内容](../assets/workflow-studio-projection-resource-v8.png) · [交互推演](../assets/workflow-studio-projection-rehearsal-v8.png) · [组合展示](../assets/workflow-studio-projection-combined-v8.png)。

实现复用固定图 renderer 与[投影面板组件](../../../../wsr-ui/packages/bi/src/components/workflow-projection-panels.tsx)。[样例状态逻辑](../../../../wsr-ui/packages/bi/src/domain/workflow-projection-tools.ts)维护确定性引用检查、允许选择的边、推演轨迹及数据；[资源快照](../assets/workflow-projection-resources.example.json)由构建导出。当前不是正式公开工具 API、完整形式化验证器或可执行 Workflow 引擎。

## 实现边界

[独立 React 组件](../../../../wsr-ui/packages/bi/src/components/workflow-activity-study.tsx)消费语义 IR 与自动布局结果，由固定 SVG renderer 展示。构建阶段使用 elkjs 0.12.0 为四张图分别生成 COMPACT / RIGHT / DOWN，共十二份布局；浏览器切换现成结果，不加载 ELK 引擎。节点与边标签先估算文字尺寸，预留角标和终点标题空间；独立端口区分各条关系，renderer 只连接端口与形状边缘，不另造避障算法。当前文字测量是中英文宽度的保守估算，任意字体和任意大图仍需后续验证。

紧凑候选借鉴 Archify 的“先约束展示组织，再计算像素几何”：适配器为当前四张样例提供显式组合与端口方向预设，ELK 分别布局组内内容和组间关系，适配器拼接容器内的端口引出段。没有手填像素坐标、缩小节点字体或删除材料关系。本轮尚未把展示预设公开为正式 API；新增紧凑样例需要补充预设，不声称从任意 IR 自动推断最佳分组。组合校验要求节点与关系完整保留，整体几何测试检查跨组引出段也不穿节点。

紧凑构图通过二维分组缩短横向跨度；当前准确边界见生成的布局结果。尺寸是 SVG 坐标，不是屏幕分辨率断点。

在 wsr-ui 运行 `npm run preview:workflow-layout`，再构建 workbench-preview 并运行 assets/build-workbench-pages.mjs。ELK 仅为开发期生成器依赖，采用其 EPL-2.0 许可选项，未打包到前端运行代码。

候选截图：[紧凑](../assets/workflow-studio-elk-compact-v8.png) · [横向](../assets/workflow-studio-elk-horizontal-v8.png) · [纵向](../assets/workflow-studio-elk-vertical-v8.png) · [横向全貌](../assets/workflow-studio-elk-horizontal-overview-v8.png) · [纵向全貌](../assets/workflow-studio-elk-vertical-overview-v8.png)。几何测试覆盖十二份布局的正交、节点避让、标签避让、关系 ID 保真和确定性；浏览器检查方向切换及既有交互。

图模型编译、真实 Definition 读取、完整异常路径、双复核的 fork / join 展开、Wait 等其他符号仍按[图投影规范](../components/graph-projections.md)推进。本轮落实多 Tab 组织并提出语义化投影 JSONIR 草案；没有发布新的可执行 Workflow 契约。
