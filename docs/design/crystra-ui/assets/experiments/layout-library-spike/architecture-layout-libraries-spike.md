---
title: 分层工作流开源布局库能力验证
category: Architecture
status: Complete
priority: High
timebox: 60 minutes
created: 2026-09-11
updated: 2026-09-11
owner: Codex
tags: [technical-spike, layout, research]
---

# 分层工作流开源布局库能力验证

## 目标与边界

决策问题：现成约束布局与正交布线库能否替代继续扩展自写候选搜索器？
本轮限定 60 分钟，交付可复现程序、可见对照图、失败记录和下一步建议。
这是实验记录，不冻结 JSON IR、UI 规范，也不替换正式 v8 页面。

## 验证计划

- 相同 development / architecture / research 语义样本，覆盖不同层级。
- 原生 ELK 作基线，WebCola / fCoSE 检验约束节点布局，libavoid 检验正交布线。
- 尝试原生 Adaptagrams 构建；无法完成时如实记录，不能用 WebCola 结果冒充 libcola。
- 区分不加语义约束、添加声明式相对位置约束的结果。
- 检查身份保持、有限坐标、节点重叠、正交路线、穿越节点、接口及迭代稳定性。
- 视觉审查与数字指标并列，任何未覆盖项目标为未验证。

## 完成标准

至少两个现成求解器和一个现成布线器实跑；记录版本与输入；交付可查看对照；给出是否继续集成的建议。

## 状态历史

2026-09-11：开始。本轮先验证能力，不做完整生产集成。

## 结论（2026-09-11）

本轮 spike 完成；没有找到可以不经语义适配、直接替换现有引擎并同时满足全部分层交互要求的方案。
停止扩展自写候选优化器的方向成立。建议保留 ELK 作主基线，单独评估 libavoid 的布线接入；WebCola / libcola 用于检验声明式约束能力，HOLA 作为构图策略的重点参考。这里的“完成”表示选型实验完成，不表示任何候选已达到生产集成验收。

最重要的发现：**成熟库可以求解约束，但不会自动知道哪个分支是主路径、补救、返回，或哪个容器接口应稳定。** Crystra 仍需薄的语义适配层；不应该把离散候选搜索、避障路由和几何优化重新实现一遍。

## 实跑范围与输入

- 3 个已有样本：development、architecture、research；沿用 workflow-puzzle/fixtures 中实验性的 advance / return 区分，没有修改正式 JSON IR。
- 合计 12 个层级（含根层），每层横向/纵向各一次：24 个局部输入。
- 每个输入 6 个组合：ELK 原生、ELK + libavoid、WebCola 默认流向 + libavoid、WebCola 语义约束 + libavoid、fCoSE 语义约束 + libavoid、原生 libcola 语义约束 + libavoid。共 144 份结果。
- 补充 18 次真正嵌套图测试：3 样本 × 2 方向 × ELK / WebCola / fCoSE。fCoSE 没有添加方向约束，两种方向标签只是输入矩阵的重复，不代表两个不同方向的能力。
- HOLA 默认自由构图：12 个局部输入，独立于以上矩阵。
- 120 次同位置布线消融：libavoid 默认参数与本轮配置比较。
- 4 个引擎的相同输入重复 / 数组排列扰动；固定节点位置后 libavoid 重复 5 次。
- 25 / 100 节点的单链与局部返回构成的合成图，各 4 个引擎。不是广泛的规模基准。
- 真实 Chrome 验证对照页 120 次切换，并在浏览器中加载 WASM 执行一次实际路由；不只是展示 Node 预计算结果。

### 局部输入转换及限制

`model.cjs` 按父层投影节点，将跨层边保留原始 edge ID，同时把外部端点表示为独立的“入 / 出”节点。**这些代理是自由布局的小节点，不是已经求解好的稳定容器端口。局部结果不能证明展开/收起后的边界连续性。**

同一层所有引擎使用相同尺寸的矩形障碍，包括判断、开始、结束。因此没有验证菱形/圆形轮廓端口，也没有将视觉样式纳入选择。

原生 ELK 使用原始控制流边，没有前一轮实验的反转返回边、端口侧搜索或 placement 搜索。它是简化基线，不是正式 v8 或前一轮优化预览的直接截图。未添加边标签；对比页仅悬停显示原始标签，不能据此判定标签布局合格。

约束组由通用规则生成：

1. 普通推进关系在阅读轴上保留节点半尺寸之和 + 48px 的中心间距。
2. recovery 且从判断节点发出的推进关系：补救节点与判断在阅读轴上对齐，在另一轴上隔开。
3. return / exit 不添加向前推进的硬约束。

规则不包含业务节点 ID 或坐标。它们只是本轮探针，不是最终推荐规范；特别是尚未约束整条主路径处于同一条水平/垂直带内。

libavoid 每个矩形提供四侧中心候选端口，允许共享，由库选端口。没有自写路由或端口搜索。这故意暴露了共享端口的限制，不能将结果解释为 libavoid 最佳配置。

## 局部结果

每行均为 24 个输入。数字为本轮检测器的总事件数，不能跨列相加当作“坏图数量”。

| 组合 | 严格交叉 | 非端点节点穿越 | 节点重叠 | 已声明约束违反 |
| --- | ---: | ---: | ---: | ---: |
| ELK 原生 | 0 | 0 | 0 | 未声明 |
| ELK + libavoid | 0 | 0 | 0 | 未声明 |
| WebCola 默认流向 + libavoid | 0 | 0 | 0 | 未单独计量自动流向约束 |
| WebCola 语义约束 + libavoid | 1 | 0 | 0 | 0 |
| fCoSE 语义约束 + libavoid | 4 | 0 | 0 | 0 |
| 原生 libcola 语义约束 + libavoid | 2 | 2 | 0 | 0 |

全部 144 份结果节点/边身份保持、坐标有限、路线存在且正交。四个契约测试通过。这不代表全部布局通过视觉验收。

### 视觉检查与反例

- 理解与设计：libcola、WebCola 确实把澄清缺口放在材料足够下方，未写节点坐标；但主路径出现阶梯形，且紫色/绿色路线仍可能共享一段。不能宣布这两个库自动生成了更好的活动图。
- 架构设计 / 多角度评审 / 横向：libcola 未发生矩形重叠，但并行活动靠得很近，libavoid 输出被检测为穿越其他节点。`obstacle-case.png` 保留实图。根因尚未做独立最小复现，不能直接归因于上游布线 bug。
- 100 节点合成图中，fCoSE 组合无检测交叉，但整体宽约 21822px。全图缩入屏幕后可读性很差。这证明零交叉并不能替代画面占比和阅读尺度评价。
- HOLA 原始结果保留全部节点和边，但默认构图不受工作流阅读方向约束。理解与设计中主路径先向上再向右；不能按“支持人工构图”就认定适合主导有向工作流。

### 代价参数消融

配置为 segmentPenalty=50、crossingPenalty=200、fixedSharedPathPenalty=200、shapeBufferDistance=8、idealNudgingDistance=12、reverseDirectionPenalty=50。

120 个固定节点布局中，严格交叉总数从默认参数的 21 降到 7，共线总长度从约 18319px 降到 16642px。本轮没有交叉数变差的输入，但这不构成全局最优或单调改善保证；变化来自整组配置，不是 crossingPenalty 单项的因果结论。候选端口共享限制依旧存在。

### 嵌套、稳定性和性能

18 次嵌套测试均产生有限节点坐标且没有检测到子节点越出父框。ELK 的 6 次布局还返回与输入边数量一致的路由记录；未在此测试中逐条验证跨层接口连续性。WebCola / fCoSE 只验证节点与容器，没有把容器避障、穿越边界接口和布线组合起来。libcola 的原生 cluster API 本轮未调用，不能用 WebCola 的结果替代它。

相同输入重复一次：ELK、WebCola、libcola 相对节点位置一致，fCoSE 最大相对位移约 0.40px。反转节点和边数组并重新生成初始位置后，最大相对位移分别约 68、9.64、14.26、8.44px（最后一个为 fCoSE）。**这一扰动同时改变了顺序与初始位置，不是单独的顺序因果实验。** 固定节点位置时，四组布线各重复 5 次结果一致。这里只能说明这一样本，没有证明交互布局的长期确定性。

100 节点单次测量：ELK 布局约 77ms、WebCola 241ms、fCoSE 21ms、原生 libcola 229ms；配套布线约 11–97ms。局部矩阵中原生 libcola 首次启动曾约 1.39s。计时包含适配器/进程启动，缺乏预热与重复采样，**不能作为算法性能排名**。没有验证 Worker、取消、长时间 WASM 内存、连续拖拽或千节点场景。

## 集成发现

- elkjs 0.12.0：沿用当前工作区版本；没有改正式依赖。
- webcola 3.4.0、cytoscape 3.34.3、cytoscape-fcose 2.2.0、libavoid-js 0.5.0-beta.5：只安装在本实验目录，确切依赖树由 package-lock.json 固定。
- 原生 Adaptagrams 固定提交 `840ebcff20dbba36ad03a2160edf7cbaf9859984`，独立 checkout `/tmp/crystra-adaptagrams-spike`。
- 原生官方 autotools 流程在本机因缺少 aclocal 失败；使用实验目录的 CMake 清单编译原始源文件，没有修改算法源码。生成的 config.h 关闭可选 Cairo 输出；并非已验证官方完整构建或全部上游测试。
- HOLA 的 TGLF 解析在 `COLA_ASSERT` 中执行输入读取与状态递增。Release 默认 NDEBUG 使它们失效，产生错误节点数量/尺寸；初次错误结果另存 `hola-release-parser-failure*`，不计入有效能力结果。对 HOLA 目标加 `-UNDEBUG` 后 12 个输入恢复节点/边数量。生产接入不能忽略这一构建约束。
- libavoid-js 发布包中 README、部分类型声明与实际 embind API 不一致：ConnRef 实际要求 3/4 参数而非文档示例的 1 参数，路线用 `at()` 而非旧示例的 `get_ps()`；RouterFlag/ConnType 也按实际导出使用。以运行版本为准，不能盲抄旧示例。
- WASM 文件约 484KiB（未压缩）；真实 Chrome 加载并路由成功。包装器仍为 beta；没有核实其 WASM 内嵌的原生提交，不能假设它和本轮 C++ checkout 相同。
- Adaptagrams / libavoid-js 声明 LGPL-2.1-or-later；WebCola / fCoSE 为 MIT。未来发布前按实际集成与分发方式处理许可证和来源记录；本轮没有作法律兼容性结论。

## 可以借鉴的成熟机制

以下是源码中已经存在的机制，不是我们新发明的目标函数，也不意味着本轮已验证可直接套用：

1. **布局阶段先留布线空间。** HOLA 在走线前给节点加 padding、重新求解，再移除 padding；同时把已对齐的边当成需要避让的结构。它把“节点不重叠”和“有地方布线”明确分开。
2. **分解后整体安排。** HOLA 剥离树枝、布局核心、安排链和枢纽，再为树枝选择位置并扩展空间。这是拓扑分解，不等同于我们的业务子流程层级，但值得用于理解布局阶段划分。
3. **外侧与稀疏位置偏好。** `treePlacement_favourExternal`、`favourCardinal`、`favourIsolation` 提供外部面、正交方向、较少竞争空间的偏好。它们与我们“不让开始结束被包围”的诉求相关，但不能直接当作该语义的充分保证。
4. **近似对齐作为后处理。** HOLA 的 near alignment 检查邻近节点并尝试消除小折弯，不把无交叉当作优化终点。
5. **按图的尺度归一化。** HOLA 将部分惩罚、padding、邻域范围与 ideal edge length 关联，少数参数保留绝对值；比所有图都使用同一组像素常量更值得评估。
6. **独立约束求解与独立布线。** libcola/WebCola 执行对齐、间隔，libavoid 执行端口选择、避障、线路整理。语义规则转换仍由应用负责，几何求解交给库。

## 上游证据与限制

以下 issue 是已读的风险线索，不是我们已复现的当前版本缺陷：

- [Adaptagrams #70：提高 crossingPenalty 仍不能自动交换到更好的端口](https://github.com/mjwybrow/adaptagrams/issues/70)，检查时 open。
- [Adaptagrams #86：连接端口 cost 被忽略的报告](https://github.com/mjwybrow/adaptagrams/issues/86)，检查时 open；本轮未调用 setConnectionCost，不能据此解释本轮结果。
- [Adaptagrams #27：确定性问题](https://github.com/mjwybrow/adaptagrams/issues/27)，检查时 open；本轮 5 次重复未复现。
- [libavoid-js #23：正交整理断言](https://github.com/Aksem/libavoid-js/issues/23)，检查时 open；本轮有效输入未触发该断言。
- [ELK #891：按层独立布局与跨层 dummy ports 的提案](https://github.com/eclipse-elk/elk/issues/891)，检查时 open，不能视为已有完整能力。
- [HOLA 阶段实现](https://github.com/mjwybrow/adaptagrams/blob/840ebcff20dbba36ad03a2160edf7cbaf9859984/cola/libdialect/hola.cpp)、[构图选项](https://github.com/mjwybrow/adaptagrams/blob/840ebcff20dbba36ad03a2160edf7cbaf9859984/cola/libdialect/opts.h)、[TGLF 输入解析](https://github.com/mjwybrow/adaptagrams/blob/840ebcff20dbba36ad03a2160edf7cbaf9859984/cola/libdialect/io.cpp)。本地已编译和阅读上述固定提交源码。
- [libavoid API](https://www.adaptagrams.org/documentation/namespaceAvoid.html)、[libcola 约束 API](https://www.adaptagrams.org/documentation/namespacecola.html)、[ELK 分层算法](https://eclipse.dev/elk/reference/algorithms/org-eclipse-elk-layered.html)、[WebCola 布局 API](https://ialab.it.monash.edu/webcola/doc/classes/_layout_.layout.html)、[fCoSE 约束说明](https://github.com/iVis-at-Bilkent/cytoscape.js-fcose)。

## 下一步建议及未通过门槛

**暂不替换主引擎，不把当前自写候选搜索升格为生产依赖。**

下轮集成试验优先验证 ELK 原生语义约束与 libavoid 布线的清晰边界，并用 WebCola 作相同声明式约束的对照。不要把 WebCola、libcola、HOLA 同时塞进产品；如果必须维持厚重的自研几何协调层，说明当前组合尚未达到降低长期维护成本的目标。

生产候选还需要：

- 明确主路径、补救、返回的语义到约束映射，并验证其冲突检测；本轮规则不是完整方案。
- 保持折叠/展开容器接口、端口顺序与连线身份；不用小代理节点的局部成功代替完整交互。
- 使用真实轮廓、边标签和四侧多端口，避免共享线路掩盖方向。
- 验证同层最小布线空间、阅读尺度与宽高比，不能只统计交叉。
- 增量布局、稳定性、Worker 取消、内存及版本来源固定。

## 复现与产物

在本实验目录执行（依赖 npm ci；原生编译需 C++ / CMake 和上述固定源码 checkout）：

```sh
npm ci --ignore-scripts --no-audit --no-fund
cmake -S . -B /tmp/crystra-layout-build -DCMAKE_BUILD_TYPE=Release -DADAPTAGRAMS_ROOT=/tmp/crystra-adaptagrams-spike/cola
cmake --build /tmp/crystra-layout-build -j 4
node run.cjs
node compound.cjs
node ablations.cjs
node stress.cjs
node hola-run.cjs
node add-hola-preview.cjs
node build-preview.cjs
node --test contracts.test.cjs
node verify-browser.cjs
```

`engines.cjs` 使用当前工作区已有 elkjs；浏览器验证使用已有 Playwright 和 macOS Chrome。新机器需调整这两个宿主路径；没有承诺跨平台即装即用。

- `preview.html`：可切换场景、层级、方向及两侧引擎的对照。
- `results.json` / `summary.json`：144 份局部结果及汇总。
- `compound-results.json`：18 份嵌套节点布局结果。
- `ablations.json`：代价参数和有限的稳定性测试。
- `stress-results.json`：25/100 节点结果。
- `hola-results.json` / `hola-output/`：12 份 HOLA 结果及原始 TGLF / SVG。
- `browser-verification.json`：120 次预览切换与浏览器实际 WASM 输出指标。
- `plan-compare.png` / `plan-webcola.png` / `obstacle-case.png`：人工审查截图。

测量器只检测矩形重叠、正交线段的严格内部交叉、非端点矩形穿越、共线长度及已声明约束误差。未检测所有端点触碰、近距离干扰、短箭头与标签碰撞，不得把 0 值写成完整视觉验收。

2026-09-11：完成本轮能力与集成 spike；正式页面和规范保持原状态。
