# Crystra

[English](README.md) | 中文

Crystra 把可重复的 Agent 工作固化为明确、可验证的 Workflow。产品方向是用更少的 Agent 和更少的 LLM 调用完成工作：把判断留在明确的边界，将可重复的协调过程写成确定性步骤。“晶体”代表逐渐固化的工作结构，不代表已经实现自主递归优化。

Execution 将每个 Delivery 绑定到精确的 Workflow Package 版本与摘要；Evidence 独立记录有限事实，Evolution 评估 Workflow 变更提案。数据服务保留 PostgreSQL。分析服务或遥测不可用时，不接管执行权威。

## 安装与使用

唯一公开的 DeepSeek Harness 插件是 **dsh-crystra**，只由 [crystra-dsh](https://github.com/firestige/crystra-dsh) 仓库注册。Execution 与 UI 是普通依赖。通过 DSH 安装经过验证的精确插件制品，无需独立 Crystra 安装器或全局 Crystra CLI。

此次更名的新制品仍在资格验证中。在精确制品和空白环境验收完成前，本文不宣称新候选已可安装。参见[入门说明](docs/guides/quickstart.md)与[插件初始化说明](https://github.com/firestige/crystra-dsh/blob/main/docs/initialization.md)。

在 DSH 中，`/crystra setup` 准备固定服务组和插件配置，`/crystra doctor` 报告就绪状态与缺失的角色／Provider 配置，`/crystra services start|stop|status` 控制服务组。PostgreSQL、Evidence、Evolution 需要 Docker。普通插件卸载保留服务数据；需要停止服务时显式执行停止操作。

## 本仓库职责

本仓库只发布**经过验证的不可变组合**。各组件在自己的 `main` 开发与验证，不以组合 gitlink 更新作为开发或发布前提。gitlink 记录选择的源码快照；可用发行还必须记录精确制品 URL、摘要和资格证据。

服务资源先发布，插件再绑定这些资源，最后组合记录两者，避免发布依赖循环。旧 WSR Release 保留历史身份；Crystra 不导入旧制品或已部署旧数据。

## 组件与文档

| 职责 | 仓库 |
|---|---|
| 契约与一致性验证 | [crystra-contracts](https://github.com/firestige/crystra-contracts) |
| Delivery 执行 | [crystra-execution](https://github.com/firestige/crystra-execution) |
| Evidence 服务 | [crystra-evidence](https://github.com/firestige/crystra-evidence) |
| Evolution 服务 | [crystra-evolution](https://github.com/firestige/crystra-evolution) |
| Workflow 资源 | [crystra-workflow-package](https://github.com/firestige/crystra-workflow-package) |
| UI 普通库 | [crystra-ui](https://github.com/firestige/crystra-ui) |
| 唯一 DSH 插件与初始化 | [crystra-dsh](https://github.com/firestige/crystra-dsh) |

开发入口见[组件开发说明](docs/contributing/source-build.md)。旧架构、资格与递归愿景文档保留其历史上下文，不覆盖当前组件契约，也不构成已实现递归优化的承诺。

## 许可证

[Apache-2.0](LICENSE)
