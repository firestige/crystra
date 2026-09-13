# Inspector、说明与详情

状态：现有实现及预览可用；本轮未单独定稿其新外观。OwnedInspector内部，MetricExplanationView / ReceiptView / SpanPassport公开。

## 选用与结构

OwnedInspector是详情容器，children提供内容；MetricExplanationView说明指标定义与适用边界；ReceiptView展示ResolvedEvaluationContext；SpanPassport展示一个已记录节点的身份、字段与关联。这些不是Widget强制Footer内容。Task Gate 的上下文与返回契约见 [Context Inspector](../context-viewers.md)；这里的 ReceiptView 消费评估上下文，不直接承担 Gate 决定回执。

| API | 关键输入 |
|---|---|
| OwnedInspector | open、kind（explanation/receipt/evidence）、modal、title、invokerRef、onClose、children |
| MetricExplanationView | metricCoordinate、definition、valueSemantics、eligibility、exclusions、limits |
| ReceiptView | receipt: ResolvedEvaluationContext |
| SpanPassport | node: TraceViewNode；可选trace和children |

```tsx
<OwnedInspector open={open} kind="receipt" modal title="评估范围"
  invokerRef={buttonRef} onClose={()=>setOpen(false)}>
  <ReceiptView receipt={receipt} />
</OwnedInspector>
```

OwnedInspector从内部文件导入，不要写成当前公开包API。示例对象由调用者提供真实记录。

## 交互与定制限制

打开进入可聚焦内容；Escape关闭，关闭返回触发按钮；modal启用Tab焦点约束。长内容在详情区滚动。业务层保存来源、当前指标与左右侧身份，不因为打开详情丢失返回上下文。

Receipt不是Task审核必须出现的“回执页面”，仅在确有该评估上下文时使用。SpanPassport不伪装Workflow节点编辑器。不要把模型说明自动提升为已确认事实，也不要把短tooltip替代完整详情。当前Library的独立详情样本与真实动作目标必须区分。

## 实现、示例与验证

- [源码](../../../../../wsr-ui/packages/bi/src/components/inspector.tsx)；公开导出以 [public.ts](../../../../../wsr-ui/packages/bi/src/public.ts) 为准。
- [Library Preview](../../assets/library-preview.html)：选择“Span 与回执详情”；该页展示详情内容，不证明 OwnedInspector 容器已接入；[当前截图](../../assets/library-previews/passport.png)。示例均为本地 fixture，不连接后台。
- [现有验证](../../../../../wsr-ui/packages/bi/src/components/inspector.test.tsx)。测试通过只证明覆盖的行为，不代表新增设计已被接受。
