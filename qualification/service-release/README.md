# 精确服务候选资格工具

仅供组合发布验证，不是用户安装器。依赖独立的固定 tar 工具包，不构建或发布组件。

先由 scripts/build-combination-candidate.mjs 从精确 DSH gitlink 的已提交 services 源码构建服务候选。该工具读取候选元数据并验证每个文件摘要，再从精确 DSH gitlink 提取初始化内部模块，使用候选归档的原始字节运行真实 Compose 生命周期。不会改写镜像坐标、跳过 pull 或消费旧 WSR 制品。

运行：`npm ci --ignore-scripts --prefix qualification/service-release`，然后 `node qualification/service-release/qualify.mjs <candidate-directory>`。

检查镜像索引的 linux/amd64 与 linux/arm64、setup／doctor／stop／保留卷／restart／dispose 后服务仍运行。所有检查通过才写 service-qualification.json，并绑定候选元数据与归档摘要。测试结束只清理该次随机 stateRoot 命名空间。实际首次发布的镜像／服务验证仍待 T6，新代码的打包夹具测试不等于通过真实候选资格。

本工具作为独立准备步骤合入，不启用现行发布 workflow。发布接线、资格／晋升门槛和旧安装器退出由后续变更完成；工具代码合入不代表这些工作或 T5 已结束。
