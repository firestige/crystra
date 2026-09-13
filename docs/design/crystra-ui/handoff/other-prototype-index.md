# 其他设计稿的结构库存

当前可审阅页面为 [Workflow Studio v8](../assets/crystra-workflow-studio-v8.html) 与 [Analysis v8](../assets/crystra-analysis-audit-v8.html)，其控件说明见 pages 对应文档；下方仅是原始快照库存。
> 当前 Task Browser v8 已审核，见 [正式页面与代码入口](../pages/task-browser.md#代码设计稿与验证)。下文均为 v7 来源结构库存，不能用旧 Summary / 控件覆盖当前设计。

> A2/A3/A4 的 ID 仅说明现有资产结构；不宣称与 U1 同等审核覆盖。页面实例与占位控件不是最终 API。

## crystra-analysis-audit-v7.html

[原稿](../sources/ui/assets/crystra-analysis-audit-v7.html)。35 个元素 / 35 个唯一 ID。

| ID | Tag / 行 |
|---|---|
| `app-shell` | `main` / L25 |
| `sidebar` | `aside` / L26 |
| `surface-banner` | `button` / L27 |
| `new-task-action` | `button` / L30 |
| `work-navigation` | `nav` / L32 |
| `build-navigation` | `nav` / L42 |
| `library-navigation` | `nav` / L47 |
| `recent-tasks` | `section` / L52 |
| `host-settings` | `button` / L60 |
| `analysis-workspace` | `section` / L63 |
| `workspace-header` | `header` / L64 |
| `analysis-context` | `div` / L68 |
| `analysis-linked-wave-context` | `div` / L69 |
| `analysis-linked-source-label` | `span` / L69 |
| `analysis-linked-wave-id` | `span` / L69 |
| `analysis-linked-workflow-run-id` | `span` / L69 |
| `analysis-linked-trace-root-id` | `span` / L69 |
| `analysis-linked-gate-context` | `div` / L70 |
| `analysis-linked-gate-id` | `span` / L70 |
| `analysis-linked-gate-focus` | `span` / L70 |
| `analysis-linked-gate-return` | `a` / L70 |
| `analysis-navigation` | `nav` / L73 |
| `analysis-tab-analysis` | `button` / L73 |
| `analysis-tab-audit` | `button` / L73 |
| `analysis-tab-compare` | `button` / L73 |
| `run-history` | `aside` / L77 |
| `analysis-run-filter` | `button` / L78 |
| `run-summary` | `section` / L87 |
| `trace-reconstruction` | `section` / L94 |
| `analysis-fit-graph` | `button` / L95 |
| `crystallization-candidates` | `section` / L108 |
| `run-comparison` | `section` / L109 |
| `recorded-evidence` | `aside` / L113 |
| `evidence-receipts` | `section` / L115 |
| `audit-events` | `section` / L116 |
## crystra-task-browser-v7.html

[原稿](../sources/ui/assets/crystra-task-browser-v7.html)。75 个元素 / 75 个唯一 ID。

| ID | Tag / 行 |
|---|---|
| `app-shell` | `main` / L32 |
| `sidebar` | `aside` / L33 |
| `sidebar-logo-row` | `div` / L34 |
| `surface-banner` | `a` / L35 |
| `sidebar-brand-mark` | `span` / L36 |
| `sidebar-brand-name` | `span` / L39 |
| `sidebar-toggle` | `button` / L41 |
| `new-task-action` | `a` / L46 |
| `new-task-icon` | `span` / L47 |
| `new-task-label` | `span` / L50 |
| `task-working-set` | `section` / L53 |
| `task-section-header` | `header` / L54 |
| `task-section-toggle` | `button` / L55 |
| `task-section-chevron` | `svg` / L56 |
| `task-section-label` | `span` / L57 |
| `task-section-attention-badge` | `span` / L57 |
| `task-search-control` | `div` / L59 |
| `task-search-action` | `button` / L59 |
| `task-search-input` | `input` / L59 |
| `task-search-clear` | `button` / L59 |
| `task-section-actions` | `div` / L60 |
| `task-view-options-action` | `button` / L60 |
| `task-view-options-menu` | `div` / L61 |
| `task-sort-created` | `input` / L61 |
| `task-sort-activity` | `input` / L61 |
| `task-filter-all` | `input` / L61 |
| `task-filter-active` | `input` / L61 |
| `task-section-content` | `div` / L63 |
| `task-list` | `div` / L64 |
| `all-tasks-action` | `a` / L68 |
| `workflow-navigation` | `nav` / L73 |
| `workflow-section-header` | `header` / L74 |
| `workflow-section-toggle` | `button` / L74 |
| `workflow-section-chevron` | `svg` / L74 |
| `workflow-section-label` | `span` / L74 |
| `workflow-section-content` | `div` / L75 |
| `workflow-current-list` | `div` / L76 |
| `all-workflows-action` | `a` / L78 |
| `analysis-navigation` | `nav` / L82 |
| `analysis-section-header` | `header` / L83 |
| `analysis-section-toggle` | `button` / L83 |
| `analysis-section-chevron` | `svg` / L83 |
| `analysis-section-label` | `span` / L83 |
| `analysis-section-content` | `div` / L84 |
| `analysis-secondary-navigation` | `div` / L84 |
| `analysis-dashboard-action` | `a` / L84 |
| `analysis-traces-action` | `a` / L84 |
| `analysis-audit-action` | `a` / L84 |
| `analysis-compare-action` | `a` / L84 |
| `sidebar-footer` | `footer` / L87 |
| `host-settings` | `button` / L88 |
| `main-surface-host` | `section` / L92 |
| `task-browser-surface` | `section` / L93 |
| `task-browser-header` | `header` / L94 |
| `task-browser-new-task-action` | `a` / L96 |
| `task-browser-content` | `div` / L99 |
| `task-browser-summary` | `section` / L100 |
| `task-browser-toolbar` | `section` / L107 |
| `task-browser-search` | `input` / L108 |
| `task-browser-filter` | `div` / L109 |
| `task-browser-filter-option` | `button` / L110 |
| `task-browser-filter-active` | `button` / L111 |
| `task-browser-filter-attention` | `button` / L112 |
| `task-browser-filter-complete` | `button` / L113 |
| `task-browser-sort` | `select` / L115 |
| `task-browser-list` | `section` / L118 |
| `task-browser-list-header` | `div` / L119 |
| `task-browser-list-body` | `div` / L120 |
| `task-browser-row-market-release` | `a` / L121 |
| `task-browser-row-ui-workbench` | `a` / L122 |
| `task-browser-row-plugin-preflight` | `a` / L123 |
| `task-browser-row-plugin-research` | `a` / L124 |
| `task-browser-empty-state` | `div` / L126 |
| `task-browser-pagination` | `footer` / L127 |
| `task-browser-result-count` | `span` / L127 |
## crystra-workflow-studio-v7.html

[原稿](../sources/ui/assets/crystra-workflow-studio-v7.html)。35 个元素 / 35 个唯一 ID。

| ID | Tag / 行 |
|---|---|
| `app-shell` | `main` / L25 |
| `sidebar` | `aside` / L26 |
| `surface-banner` | `button` / L27 |
| `new-task-action` | `button` / L28 |
| `work-navigation` | `nav` / L30 |
| `build-navigation` | `nav` / L35 |
| `workflow-list` | `section` / L40 |
| `library-navigation` | `nav` / L45 |
| `host-settings` | `button` / L46 |
| `workflow-workspace` | `section` / L49 |
| `workspace-header` | `header` / L50 |
| `workflow-context` | `div` / L51 |
| `workflow-navigation` | `nav` / L52 |
| `workflow-tab-studio` | `button` / L52 |
| `workflow-tab-versions` | `button` / L52 |
| `workflow-tab-runs` | `button` / L52 |
| `design-input` | `section` / L56 |
| `design-conversation` | `div` / L58 |
| `workflow-apply-draft` | `button` / L62 |
| `workflow-adjust-threshold` | `button` / L62 |
| `design-composer` | `section` / L64 |
| `workflow-composer-add` | `button` / L64 |
| `workflow-composer-mode` | `button` / L64 |
| `workflow-composer-send` | `button` / L64 |
| `workflow-projection` | `section` / L67 |
| `workflow-revision` | `div` / L68 |
| `workflow-fit-map` | `button` / L68 |
| `workflow-inspect-diff` | `button` / L68 |
| `workflow-map` | `section` / L71 |
| `crystallization-inspector` | `section` / L83 |
| `version-diff` | `section` / L84 |
| `validation-gates` | `section` / L85 |
| `workflow-actions` | `footer` / L89 |
| `workflow-save-draft` | `button` / L89 |
| `workflow-validate` | `button` / L89 |
