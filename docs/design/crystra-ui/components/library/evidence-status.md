# 证据、事实状态与容器

范围：已有证据、错误和事实状态组件的使用说明。本文不规定 Widget 视觉；普通证据详情的新页面设计未因此定稿。

## 组件职责

| 组件 | 何时使用 | 不承担什么 |
|---|---|---|
| MetricResultFrame | 组织指标切片、事实状态、覆盖率与来源动作 | 不替代紧凑Widget |
| MetricTruthLabel | 将传入事实状态映射为本地化标签 | 不把未知解释成失败或成功 |
| CoverageLabel | 展示覆盖信息，可接收null | 不以“可用”替代“完整覆盖” |
| EvidenceLifecycleLabel | 展示证据生命周期 | 不代表Task终态 |
| ScopedError | 显示当前范围错误及可选重试 | 不让错误夺取其他已可用区域 |
| EvidenceConsoleFoundation | 只读事实/引用与Trace入口 | 不编辑事实、Task或Workflow |
| RecordedStructureFoundation / MotionControl | 记录结构展示及其动效控制 | 不当作Workflow DAG编辑器 |
| BiSurface / BiSection / BiCard | 主题边界、内容分组、普通卡片 | 不因处于grid就成为Widget |

## API与示例

EvidenceConsole的scope/state/rows必填；references、focusedFactId、onScopeChange、onOpenTrace可选。实际scope与state为闭合类型，按源码传入，不从示意文字创造枚举。

```tsx
<EvidenceConsoleFoundation scope={scope} state={state} rows={rows}
  references={references} onScopeChange={setScope}
  onOpenTrace={openRecordedTrace} />
```

其余组件完整类型以public.ts对应源码为准；源码是字段定义入口，本文是选用及定制边界。BiSurface支持主题/密度，Crystra当前批准的是深色；旧API存在light不等于浅色设计已确认。

## 状态、操作与示意边界

分别保留事实可用性、覆盖率、兼容性与生命周期，不混成一个绿勾。无数据保持真实状态；已读失败与静态空卡不同。重试只触发实际可重试读取，选择/Trace深链由调用者处理。

展示文案经过 i18n 映射，不直接把枚举 key 渲染为标题；辅助状态的视觉规则见 [表达设计](../widget-expression-design.md)。具体 Evidence / Task / Delivery 含义服从仓库 docs。这里记录调用边界，不增加业务状态或契约；Widget 图表设计见表达设计，Analysis 整页与资源页面组合另行设计。

## 实现、示例与验证

- [源码](../../../../../wsr-ui/packages/bi/src/components/evidence-console.tsx)；公开导出以 [public.ts](../../../../../wsr-ui/packages/bi/src/public.ts) 为准。
- [现有验证](../../../../../wsr-ui/packages/bi/src/components/evidence-console.test.tsx)。测试通过只证明覆盖的行为，不代表新增设计已被接受。
