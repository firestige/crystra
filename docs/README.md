# Crystra 文档入口与维护归属

组件的现行契约、开发和运行文档随各自仓库 main 演进。组合仓库负责固定可用组合、发行资格和组合使用入口；修改组件时不要求先修改这里的子模块。单插件分发不合并领域职责。

| 内容 | 当前维护位置 |
|---|---|
| 共享契约、schema、语义检查 | [crystra-contracts](https://github.com/firestige/crystra-contracts/blob/main/README.md)；[现行契约](https://github.com/firestige/crystra-contracts/tree/main/docs/contracts) |
| Delivery、Runner、Provider 与运行配置 | [crystra-execution](https://github.com/firestige/crystra-execution/blob/main/README.md)；[配置资源](https://github.com/firestige/crystra-execution/tree/main/config) |
| Evidence 服务与运维 | [crystra-evidence](https://github.com/firestige/crystra-evidence/blob/main/README.md)；[运维](https://github.com/firestige/crystra-evidence/blob/main/docs/operations.zh-CN.md) |
| Evolution 服务与计算 | [crystra-evolution](https://github.com/firestige/crystra-evolution/blob/main/README.md) |
| Workflow 资源 | [crystra-workflow-package](https://github.com/firestige/crystra-workflow-package/blob/main/README.md) |
| UI 组件与布局实现 | [crystra-ui](https://github.com/firestige/crystra-ui/blob/main/README.md)；[组件](https://github.com/firestige/crystra-ui/blob/main/docs/crystra-components.md) |
| 唯一插件、Host 集成与首次初始化 | [crystra-dsh](https://github.com/firestige/crystra-dsh/blob/main/README.md)；[初始化](https://github.com/firestige/crystra-dsh/blob/main/docs/initialization.md) |
| 可用组合、候选资格与人工 GA | [本仓库发布流程](guides/release-automation.zh-CN.md) |
| 更名执行状态与恢复 | [唯一执行计划](https://github.com/firestige/crystra-contracts/blob/main/docs/crystra-rename/execution-plan.md) |

English readers: component links above are the current development authority. This repository owns combination selection and qualification. Use the [quickstart](guides/quickstart.md), [release procedure](guides/release-automation.md), and [source ownership guide](contributing/source-build.md).

## 本仓库保留文档的边界

- guides、contributing 中的当前入口与 reference/naming-convention 的新品牌条款适用于 Crystra。安装统一走 DSH 的 dsh-crystra，旧安装器和源码部署脚本已经退出。
- docs/contracts 中保留的旧副本不覆盖 crystra-contracts 的现行规范。docs/systems、既有架构／UI 设计、工作流组合模型和迭代记录用于理解所选快照及设计来源；其中候选或未实现设计仍保留原状态。不能仅凭这些材料宣称功能已实现，也不将它们作为旧安装指令继续执行。
- 领域语义仍应与现行契约对照；品牌变更不自动更改协议版本、领域 asset ID、Provider 边界或 PostgreSQL 服务职责。
- recursive-semantic-compilation 是既有研究方向记录。当前产品方向是以更少的 agent 和 LLM 调用做好 workflow，不承诺完整递归优化能力。
- 历史截图、历史发布清单与证据不重写。这里不迁移旧制品或运行数据。

本次维护只修正仍在引导用户安装、运行和发行的入口。现存设计来源不批量搬迁为组件 main 的新规范；具体语义变更在所属组件审核，避免因移动文件而默默提升草稿权威。
