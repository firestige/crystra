# Crystra 插件入门

本页替代旧 WSR 独立插件、安装器与源码部署指引。唯一公开插件是 dsh-crystra，注册来源为 firestige/crystra-dsh；组件开发在各自仓库 main。

- 安装与首次使用：[当前快速开始](quickstart.zh-CN.md)。新候选正式资格完成前，不宣称存在可直接安装的已验证版本。
- 配置、状态目录、服务启停与卸载：[插件初始化文档](https://github.com/firestige/crystra-dsh/blob/main/docs/initialization.md)。使用 `/crystra setup`、`/crystra doctor`、`/crystra services start|stop|status`；卸载插件保留数据，需显式停止服务。
- 本地开发与真实 Host 验证：[crystra-dsh README](https://github.com/firestige/crystra-dsh/blob/main/README.md)。使用该仓库固定的开发输入及资格脚本；源码联调成功不能替代远端制品资格。
- 候选和人工 GA：[组合发布流程](release-automation.zh-CN.md)。按组件、服务归档、绑定服务的插件、最终组合的依赖顺序推进。
- 文档职责及现行依据：[文档入口](../README.md)。领域协议与 Provider 职责不因单插件合并而改变。
