# Crystra 组件开发与组合选择

组件在自己的仓库 `main` 演进。请从各组件 README 获取当前构建、测试及精确开发输入准备命令；不在本组合 checkout 的子模块中推进开发。

仓库与职责见[根 README](../../README.md)。Contracts、Execution、Evidence、Evolution、UI、Workflow、DSH 各自验证和发布。DSH 开发输入清单绑定普通依赖的源码 revision 与可重建归档摘要，不依赖组合仓库的当前 checkout。

本仓库选择已验证的源码快照和制品组合。更新 gitlink 不等于发布完成；发行必须另有不可变制品 URL、摘要与隔离环境验收。顺序为组件候选、服务组资源、绑定服务的插件、最终组合。

维护组合时使用独立干净 worktree，避免影响其它 checkout 的子模块未提交内容。历史 WSR 部署脚本不是当前安装入口；真实旧数据仅在更名清理阶段人工处理。
