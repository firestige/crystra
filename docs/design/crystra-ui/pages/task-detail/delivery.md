# Delivery：Task 当前可交付状态

> 继承 U1 Delivery 工作面；A1。注意系统 Delivery 是一次执行，定义见 [概念文档](../../foundations/product-and-domain.md)。

## 页面目标与布局

Task 建立后即可查看，判断当前结果是否满足现有目标。进入不暂停执行、不新建 Delivery、不关闭 Task。

| section | 呈现内容 | A1 布局 |
|---|---|---|
| `delivery-current-readiness` | 不可交付/条件可交付/当前可交付，验收条件覆盖、来源、计算时点 | 顶部主状态 |
| `delivery-readiness-invalidated-by-input` | 追加目标、约束变化、Replan 会重算 | 状态区说明，不是阻止输入的确认条 |
| `delivery-artifacts` | 当前候选、精确 revision、验证状态与查看入口 | 与 acceptance 双栏约 1.15:.85 |
| `delivery-acceptance` | 当前 claim、coverage、verdict 与证据 | 同上 |
| `delivery-residual-risk` | 仍有效风险及是否阻断，未裁决关联 Gate | 下方双栏 |
| `delivery-economics` | Task 累计耗时、成本、人的注意力 | 下方双栏 |

示例 tgz/报告/结晶候选文件名、数量和费用不是固定交付物清单；A1 当前产物条目未完整绑定可定位身份和打开行为，应按契约补齐而非宣称点击已完成。

## 行为与状态

默认无业务写按钮。打开产物/证据是只读上下文，可复用 Inspector 或宿主资源查看器。下载/复制身份仅作为未来可读操作候选，不在本次新增按钮。

接受当前结果、追加目标、撤销接受、要求 Replan 均经 Input 与对应 authority。变化使旧可交付判断失效后重新计算；不可修改已结束 Delivery 的结果。没有足够来源时显示不可用/待计算，不把历史绿色沿用到新目标。

累计 Task 指标与 Wave 局部指标分开；可交付性公式、Task 墙钟/人注意力测量 owner 尚待映射，不能借 Analysis 收集值自行计算。

## 注意力与验收

预期先看可交付条件和阻断项，再看候选/验收/风险，最后成本；追加要求回 Input。AC17：访问无 mutation，当前候选不称最终，Goal 变化可使状态失效，未裁决风险不当已接受。原型没实现的读取入口需单独验证。
