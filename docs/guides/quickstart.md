# Crystra 入门

Crystra 通过 DeepSeek Harness 的单个 **dsh-crystra** 插件使用。唯一注册仓库为 [firestige/crystra-dsh](https://github.com/firestige/crystra-dsh)。普通 Execution／UI 依赖由插件安装闭包提供。

当前合格组合：[crystra-v0.1.0-rc.5](https://github.com/firestige/crystra/releases/tag/crystra-v0.1.0-rc.5)。使用 Node 24.12.0、DSH 0.1.1-rc.2、pnpm 11.23.0 和 Docker。此次更名只要求 RC 可用，不要求 GA。

```sh
dsh plugin --profile web add https://github.com/firestige/crystra-dsh/releases/download/crystra-dsh-v0.1.0-rc.6/dsh-crystra-0.1.0.tgz
```

插件 SHA-256：`aae9f7fdbecc02c93aa3a0b6d8eefdfaa92f41f1d78766fa7fffeaed37915e08`。插件固定服务 `crystra-services-v0.1.0-rc.3`；完整组件坐标和资格回执附在组合 Release。安装时沿用 DSH 的插件依赖管理和本机原生依赖构建流程。

安装流程由 DSH `plugin add` 接收精确插件 tgz URL。随后在 DSH 中：

1. `/crystra doctor` 检查当前状态、Docker 与角色绑定缺失项。
2. `/crystra setup` 创建新 Crystra 配置并准备插件绑定的服务资源。
3. 按诊断在工作区 `.crystra/role-provider-bindings.json` 设置实际角色路由，使用 Provider 自身的授权入口。
4. 再次运行 `/crystra doctor`，以真实就绪结果为准。

配置和命令详见[当前插件初始化文档](https://github.com/firestige/crystra-dsh/blob/main/docs/initialization.md)。`/crystra services start|stop|status` 管理服务组；插件卸载不删除数据库卷，不自动停止仍在运行的服务。

本次更名的旧 WSR 部署已完成一次性打包、校验、隔离、清理，不是新产品的安装或迁移步骤。

当前界面采用 UI RC5 的 v8 组件。缺少正式领域数据的工作面不会用样本伪装运行结果；条件探索配置可接入经来源锁与有效期检查的设计投影。资源候选保存和通知均须显式启用，通知仅进入绑定会话，不自动唤醒模型，也不表示执行或发布授权。
