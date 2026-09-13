# 文档、身份浮层与 Context Inspector

> 继承 U1 Plan/Gate/Execution 精确导航。页面落点见 [导航表](../foundations/navigation.md)。

## 查看器族

| 查看器 | 内容 | 所在位置 | 不变上下文 |
|---|---|---|---|
| Plan 文档 | Header + outline + 正文 + DAG 章节 | 替换右侧 Plan 摘要 | 同 Plan revision、左侧 Input、来源 Gate |
| Gate Context Inspector | Header、关系摘要、primary/secondary、provenance | 替换 `gate-main-view` | 同 gate_id/subject/Session |
| 运行身份浮层 | 五类稳定运行身份与逐项复制 | Wave toolbar 临时浮层，不推图 | 同 Wave/Run，不加指标 |
| 宿主资源工具面 | 文件、编辑器或 Diff | 正交工具面 | 精确 sessionId + cwd + path |

## Gate Context Inspector 的三种内容

- **Artifact Diff**：base/candidate 精确 revision、候选 patch、影响范围。只读，不提交。
- **Evidence Receipt**：claim、verdict、适用对象、规则/工具版本、记录时间、Run provenance。缺失证据不由文字生成补足。
- **Decision Receipt**：用户原话、结构化理解、authority、已提交 IR revision、有效性、source message。来源消息定位属于待完成宿主能力，不伪造滚动成功。

这里定义 Task 的精确对象查看与返回契约；现有 BI OwnedInspector、ReceiptView、SpanPassport 的调用方式见 [BI 详情组件](library/inspector-details.md)。Gate Decision Receipt 与 BI ResolvedEvaluationContext 不共用业务 schema，不能因都叫 Inspector 或 Receipt 而直接互换。

共享 Shell 不等于共享字段 schema。每个入口由 EvidenceRef 驱动，检查属于当前 Gate、revision 有效及读取权限。普通文件路径不能充当证据 identity。进入后同步替换 kind/title/revision/body，返回恢复 Gate 选择/队列/滚动与 Composer 草稿。

## 运行身份浮层

`execution-wave-run-metadata-toggle` 同步 aria-expanded，默认折叠，外部点击或返回 Plan Run 关闭。包含 Plan Run、Wave、Workflow definition+版本、Workflow Run、Trace Root；attempt/时间/速度/成本放状态区。

五个复制按钮只复制对应原始字符串，图标及成功反馈统一归入行内工具角色，按钮点击区跟随工具档位（见 [图标规范](../foundations/iconography.md)，用户最新裁定取消原 15 / 30px 特例），成功短暂确认；不提供整包 JSON。组合定位由“在分析中查看”负责。Clipboard 失败反馈为本次整理建议，保留原值与可选择路径。

## 文档与图的返回

`plan-overview` 与 `plan-dag-projection` 是同一文档的首页和 DAG 落点。`plan-document-back` 有来源 Gate 时回 from_gate_id，无则回 Plan 摘要；`plan-dag-document-back` 回同 revision 正文，保存图 UI state。Inspector 与文档内容各自滚动，不推动 Input。

对丢失身份、过期引用、读取拒绝统一保留上下文而显式失败。具体错误码与焦点策略待宿主接口对齐；不能因为原型存在三个 renderer 就声称三种后端接口已发布。

## 适用性、读取失败与返回

证据与决定按精确对象、revision 和适用范围读取；旧候选的材料不能自动支撑新候选。无法证明当前适用性的内容不作为当前已确认依据，真实历史仍保留原义。Agent 可解释局限，不能赋予确认身份；准入规则见 [Gate 页面](../pages/task-detail/gate.md)。

精确参数不足、对象不存在或读取失败时，保留来源身份与返回入口，显示实际失败；不改查最新 revision、最近 Run 或同名对象。返回来源仍按精确 return context；若来源也不可定位，同样明确失败，用户可用已有 Task 级导航继续浏览，不自动选择替代 Gate。

读取检查由实际宿主/资源能力承担，不新增认证体系。重试读取仍请求同一只读对象，不转成重跑/重建 Delivery；Observation/Evidence 不可用不改变执行结果。确有耗时读取使用公共右下角通知进度反馈，空卡不伪装成无限加载。完整纵向列表查看的尺寸、返回和 y-scroll 遵循 [卡片规范](review-surfaces.md)。
