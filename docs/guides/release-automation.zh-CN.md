# Crystra 组合发行

本仓库只发布可用组合和服务归档；组件在各自仓库 main 开发。用户通过 DSH 安装唯一插件 dsh-crystra（仓库 firestige/crystra-dsh），使用 `/crystra setup`、`doctor`、`services` 管理初始化。没有独立 WSR 安装器。

## 开发与候选

先完成开发资格，冻结组件制品摘要、服务镜像摘要及精确 DSH 源码提交。候选清单必须与开发资格使用的输入一致；打包夹具或语法测试不算实际资格。首次真实候选资格仍属于更名计划 T6。

RC 唯一入口是推送 release/next。release/request.json 明确选择一个候选，例如：

```json
{
  "schemaVersion": "crystra.release-request@1.0.0",
  "kind": "services",
  "version": "0.1.0",
  "candidateTag": "crystra-services-v0.1.0-rc.1",
  "manifest": "release/services/0.1.0-rc.1.json"
}
```

组合使用 kind=combination、crystra-vX.Y.Z-rc.N、release/combinations/X.Y.Z-rc.N.json。清单根 release 必须包含相同 RC 身份；服务 version 保持归档基础版本。服务格式为 crystra.compose-release@1.0.0，组合格式为 crystra.compatibility@1.0.0；具体字段与校验见 scripts/lib/combination-release.mjs。

候选流程从已提交源码构建服务归档或下载核验组合制品。服务资格运行真实容器的 setup/doctor/stop/restart/dispose，检查双平台镜像和卷保留。组合资格下载插件原始归档、六项资格日志和回执，核对实际打包的 Execution/UI 依赖与服务描述符。全部成功后生成预览、资格回执、SHA256SUMS，并发布不可覆盖的 prerelease。已有 tag 会失败，应使用新的 RC 序号。

本地打包：`node scripts/build-combination-candidate.mjs /tmp/new-candidate`（必须干净源码且输出目录不存在）。服务资格使用 qualification/service-release/README.md；组合资格使用 `node scripts/qualify-combination-candidate.mjs /tmp/new-candidate`，随后 `node scripts/finalize-combination-candidate.mjs /tmp/new-candidate`。

## 人工 GA 晋升

只有人可以启动 release-compose-bundle.yml 的 workflow_dispatch。

输入精确 candidate_tag、包含 RC/GA 清单的完整 authority_ref 提交 SHA，以及 release/services/X.Y.Z.json 或 release/combinations/X.Y.Z.json。

晋升校验发布过的非草稿 RC、tag 实际提交、候选文件摘要、完整资格回执和仓库内 RC 清单原始字节。GA 只允许改变清单根 release/version；组件坐标、摘要、嵌套版本和数组内容不得变化。除外部 DSH runtime 外不能携带预发布引用：先晋升下层制品，再为上层使用稳定坐标生成并资格新的 RC。

GA 不重建。原候选资产和绑定它们的元数据/回执全部保持字节不变；`promotion-manifest.json` 是 GA 身份清单，`promotion.json` 绑定源 RC、提交及摘要，`PROMOTION-SHA256SUMS` 覆盖完整晋升资产集。服务 GA 的 `ga-service-descriptor.json` 提供稳定下载坐标和相同归档摘要，用于后续插件候选。原 service-descriptor.json 保留 RC 来源，不改写历史证明。

## 发布权限与更名边界

发布 workflow 使用仅限 crystra 的 GitHub App token，需要 CRYSTRA_RELEASE_CLIENT_ID 和 CRYSTRA_RELEASE_APP_PRIVATE_KEY。配置凭据需要单独授权；代码合入不表示凭据已配置，也不表示首次候选或 GA 已完成。

release/compose 与 release/product 是历史记录，不再作为现行发布入口。旧部署数据由更名计划在新候选资格之后一次性备份、核验、隔离和人工清理，不提供历史资产迁移程序。
