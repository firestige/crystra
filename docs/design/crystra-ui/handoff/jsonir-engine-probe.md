# Agent → JSONIR → 引擎：首轮探针

2026-09-11 用户确认的职责：Agent 仅把意图转为语义 JSONIR；引擎负责解析、校验、布局与渲染。布局坐标、节点尺寸、路由点不能由 Agent 按业务样例定制。Implementation 只是测试数据，不是引擎分支条件。

## 本轮方法

用系统设计与科研管理两个陌生 ID 的带条件返工流程，加上将现有分层／辅助流程样本全部重命名的同构输入，调用当前 v0.1-draft validator 和 ELK adapter。输入不携带坐标。对横向、纵向、紧凑三种模式执行，共 15 次 flow 布局调用。

[脚本](../assets/probe-jsonir-engine.mjs)、[JSON 输入与结果](jsonir-engine-probe/results.json)。同目录 SVG 只是从引擎几何输出生成的检查材料，不能证明产品 viewer 的节点形状、交互和执行语义已经正确。

## 实测结果

- RIGHT／DOWN 的 10 次调用完成，输入未改变，节点与边身份集合保留。尚不等于所有结构、几何避让或交互均通过。
- COMPACT 的 5 次调用全部失败：当前 composition 与路由侧向表依赖 main、ladder、research 以及 Implementation 的具体节点／边 ID，不能接收任意输入。
- 悬空边被拒绝。
- null／缺字段直接异常；当前函数仅对 TypeScript 已定型输入做引用检查，并非外部 Agent JSON 的安全解析入口。
- 未支持的 schemaVersion、fork kind 被接受，说明不能把当前引用检查用作外部输入完整 schema 校验。
- 不可达出口被接受。草稿可保留此类语义缺口，但必须产生问题供用户定位，并在发布检查中按规则阻塞；不应将草稿可渲染等同可发布。

## 尚未通过的产品能力

当前 IR 未定义完整并行／汇合等语义；跨层出口和恢复表达需重新核对。当前 Viewer 预载 fixtureLayouts；上一轮 StudioIntentReview 的五阶段图则直接在页面计算位置，没有走 JSONIR 引擎，两者均不满足任意方案切换的验收标准。

下一轮验证入口应接收 Agent 原始 JSON：解析 → schema 校验 → 语义诊断 → 引擎布局 → viewer。结构错误拒绝替换并保留上一个有效图；可显示但未完成的草稿带定位问题，发布检查另行强制闭合。任何修复返回 Agent 的应是 JSON 路径、稳定对象身份和语义原因，不要求 Agent 调整坐标。

验收样本须包含分支与返工、嵌套、多出口、并行汇合、跨层关系、材料依赖及错误引用；同构重命名、改变数组顺序、长文本也需检查。搜索、聚焦、折叠和展开仅修改 viewer state，不得改写输入 IR 或消除真实关系。
