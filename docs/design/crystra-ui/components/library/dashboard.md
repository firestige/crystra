# Dashboard · Widget 组织与持久化

状态：现有展示、尺寸菜单、布局动效与 ghost 已接受；本页与 [Widget 组件契约](../widget-component-contract.md)一起规定职责。布局能力的后续完善不属于本轮 Widget 组件化。

## 职责引用

状态归属、稳定实例、尺寸协作及保存快照只按 [Widget 组件契约](../widget-component-contract.md)执行。本页维护 Dashboard 的排列行为与原型接入，不重新定义 Widget 内部状态。

## 已接受的布局行为

- 网格应用 [表达设计的外框公式](../widget-expression-design.md#外框与共同视觉)；普通 Card 不继承 Widget 容量。
- 右键 / Shift+F10 可进入表达和尺寸选择；菜单位置属于交互呈现，不决定状态归属。
- 无自由拉伸手柄；尺寸和邻卡位置沿用240ms过渡，reduced motion 关闭动画。
- 拖动卡片下方显示灰色空白 ghost，采用与松开后一致的吸附、压紧与居中结果；不显示背景网格线。
- 保存/取消是宿主动作。组件化后宿主通过 Widget 的快照与恢复能力协作，不直接修改 Chart 内部字段。

示例中的数量、指标和排列不是固定 Dashboard；保存按钮不是每张卡的必选 footer。

## 当前原型接入

[组件契约的实现状态](../widget-component-contract.md#当前代码与本轮边界)区分当前原型与目标架构；此处只列已有布局接口。

现有 DashboardGrid 提供 layout、renderPanel、editing、onLayoutChange、onRemovePanel、focusedMetricCoordinate、exactWidgets、getWidgetSizes 与 getWidgetViews 等能力；DashboardComposer 是旧指标组合入口。这些现有签名不代表后续协作接口已定型。

[源码](../../../../../wsr-ui/packages/bi/src/components/dashboard-grid.tsx) · [原型组合层](../../../../../wsr-ui/packages/bi/src/components/expression-dashboard.tsx) · [预览](../../assets/library-preview.html) · [截图](../../assets/library-previews/dashboard.png)
