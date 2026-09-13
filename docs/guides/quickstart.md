# Crystra 入门

Crystra 通过 DeepSeek Harness 的单个 **dsh-crystra** 插件使用。唯一注册仓库为 [firestige/crystra-dsh](https://github.com/firestige/crystra-dsh)。普通 Execution／UI 依赖由插件安装闭包提供。

此次更名尚未发布经过验证的新组合。候选完成前，不提供猜测的下载 URL，也不使用旧 WSR 安装器或历史制品。完成后的组合记录将给出固定的插件 tgz URL、SHA-256、DSH 版本与服务资源身份。

安装流程由 DSH `plugin add` 接收精确插件 tgz URL。随后在 DSH 中：

1. `/crystra doctor` 检查当前状态、Docker 与角色绑定缺失项。
2. `/crystra setup` 创建新 Crystra 配置并准备插件绑定的服务资源。
3. 按诊断在工作区 `.crystra/role-provider-bindings.json` 设置实际角色路由，使用 Provider 自身的授权入口。
4. 再次运行 `/crystra doctor`，以真实就绪结果为准。

配置和命令详见[当前插件初始化文档](https://github.com/firestige/crystra-dsh/blob/main/docs/initialization.md)。`/crystra services start|stop|status` 管理服务组；插件卸载不删除数据库卷，不自动停止仍在运行的服务。

旧 WSR 部署将在新候选验证之后一次性打包、校验、隔离、清理，不是新产品的安装或迁移步骤。
