# archify 能力深挖观察（O-1 ~ O-5）

## 摘要

2026-08-27 对 [`tt-a1i/archify`](https://github.com/tt-a1i/archify)（v2.15.0，MIT，含 DSH 移植版 [`dsh-archify`](https://github.com/GongYuanCaiJi/dsh-archify)）做了仓库级深挖（SKILL.md、README、DESIGN.md、ROADMAP、CLI 命令面、mco 案例、evidence beacons 研究），修正了此前"archify 只是画图 skill"的判断。核心观察：archify 是**完整产品**（typed JSON IR + 确定性校验 + 自包含交互 HTML viewer 的闭环），具备调用链路查看、快照变化对比、仓库证据三大能力；但它的"现场还原"是**静态仓库溯源**（钉 commit 的结构还原），不是运行时还原（无遥测）。

## 观察

### O-1 — archify 是完整产品，不是单一 skill

- 结论：archify 是"创作→校验→交付→查看"的产品闭环，skill 只是入口。
- 理由：CLI 命令面为 `render / compare / deliver / preview / validate / inspect / check / visual-check / guide / brands / examples / doctor / demo`（`archify/bin/archify.mjs --help`）；README 声明 33 个 Proof Lab 章节、99 项校验、确定性几何、repair receipt、last-good preview、原子交付（SHA-256 receipt + 单次 rename 提交）。
- 落地：将其视为"证据型交互查看器"的成熟参照物，而非"会画图的 skill"。

### O-2 — 调用链路能力：route / reach / trace

- 结论：archify 提供多层"调用链"查看：Route Probe（两点间最短作者路径 + Journey）、Upstream/Downstream 作者可达性、Intent Trace（悬停前的一跳预演）、sequence 图（API 调用链/异步 trace）、trace motion 动画。
- 理由：README "Explore and share" 一节（`#route=`, `#focus=&reach=`, `#view=` 稳定链接）；ROADMAP 的 Motion Governor（Live/Still、有限、单一 owner、reduced-motion）。
- 落地：这些是 BI `/trace` 页交互模式的参考（但见 O-16 边界）。

### O-3 — 变化对比能力：compare（Before/Delta/After）

- 结论：archify 的 `compare architecture base.json head.json delta.html` 是精确的变化对比：机器 receipt 记录 added/removed/changed/moved/rerouted 事实，Exact-ID Review Navigator 支持静态总览 + 可选逐项有限回放；明确不做 impact/risk/mergeability 推断。
- 理由：README "Architecture Delta" 一节；`archify/bin/archify.mjs compare` 帮助文本；`examples/checkout-platform-delta.html`。
- 落地：这是对 Evolution 最有价值的模板（见 `obs-evolution-bi-mapping.md` O-13）。

### O-4 — 仓库证据：钉 commit 的静态溯源，非运行时还原

- 结论：最接近"现场还原"的是**仓库溯源**：图钉死到 `meta.repository.revision`（mco 案例 = `9f1a1cf1afdc04d7b5406782b40dfec76d9bc798`），`inspect` 要求 `--repo-root` 用本地 Git checkout 验证，证据节点带 `SRC n` beacon（点击打开钉在该 commit 的文件+行范围）。但这是**静态源码还原**，不是运行时：ROADMAP 明确 "This is not infrastructure discovery or repository/live-environment verification"；无遥测/OTLP/真实调用回放。
- 理由：`docs/cases/mco-runtime.architecture.json`（meta.repository.revision）；`archify inspect` 输出（"declares source evidence. Pass --repo-root"）；`docs/research-evidence-beacons-2026-07-23.md`（"open the exact revision-pinned code that proves it"）；ROADMAP。
- 落地：若需要"运行时现场还原"（真实调用链、耗时、结果），archify 不做——这是我们的 OTLP 观测 + Evidence 数据天然具备而 archify 没有的能力。

### O-5 — 设计纪律（DESIGN.md）是 craft 参考

- 结论：archify DESIGN.md 的视觉/交互纪律与我们 BI 设计的约束高度同构，可作 craft 参考：**The Evidence Console** 北极星、"Semantic Color Rule"（每个饱和色=语义）、"Theme Parity Rule"（深浅主题保留类别身份）、渐进披露优于常驻 chrome、viewer 状态不进 canonical export、mono-forward 排版、flat-at-rest、单一 motion owner。
- 理由：`DESIGN.md`（245 行，含 color/typography/elevation/components 全套 token 与 Do's/Don'ts）；与 `docs/systems/bi/bi-system.md` §6（calm data-dense observability console、cyan/amber/red 状态色、双主题 AA、viewer 无公式）逐条对应。
- 落地：读 DESIGN.md 全文；token 体系与"状态可冗余呈现（非仅颜色）"可直接借鉴进 BI 的 token 绑定与 WCAG 2.2 AA 要求。

## 决策

### 2026-08-27 — archify 定位修正

- 结论：archify = 静态结构的证据型交互呈现产品；我们的 BI/Evolution = 运行时事实的记录与呈现。两者在"可视化真实运行"上恰好互补。
- 理由：O-1~O-5 的机制证据；archify 无运行时数据，我们无查看器（Evidence 应用与 BI 正在补齐）。
- 落地：借鉴其交互模式与设计纪律；不借鉴其作者边推断模型（见 O-16）。
