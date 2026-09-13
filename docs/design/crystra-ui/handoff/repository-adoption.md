# UI 设计正式归属与提交边界

2026-09-13 用户要求整理已验收 UI 并按仓库提交。三个仓库从各自 main 建立 `codex/accepted-ui-design`，使用 Conventional Commit。提交不是合并、推送或发布。

| 仓库产品名 | 当前 Git 仓库 / 包 | 此次内容 |
| --- | --- | --- |
| Crystra UI | firestige/wsr-ui / wsr-ui-core | 主题、语义资产、组件、widgets、布局与测试；保留可复现的页面评审源码，未审核试稿不提升为公共 API |
| DSH Crystra | firestige/wsr-dsh | 已验收 Shell/sidebar 的宿主设计契约及 markup fixture，DSH Input/Markdown/文件能力归属；运行包仍使用原资格锁定依赖 |
| Crystra | firestige/workflow-self-recursive | 本设计目录、v8 资产、决策/验收记录与两个组件提交的 gitlink |

以用户验收与条款状态判断效力。迁移保留原有相对目录深度，sources 归档字节不改，生成束作为可打开的设计资产保留；node_modules、本地构建目录及会话临时文件不提交。`promotion-assets.json` 记录归档文件哈希。

不在此轮重命名 npm 包或 RPC、不提升版本、不触发发布，不带入 Evidence/Execution/Contracts/workflow-package 等其他工作区改动。正式业务接入待办在各页面继续可见。
