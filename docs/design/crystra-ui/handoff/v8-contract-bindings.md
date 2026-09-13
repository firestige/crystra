# v8 区域与组件契约绑定

由 design-contracts.json 生成。data-design-contract 表示条款所有权，不把设计稿提升为系统语义 authority。控件状态和业务作用仍须阅读所指正文。新增区域／动作需要更新映射与对应契约，并重新验证。

| 稳定键 | 对应文档 |
|---|---|
| `widget-tooltip` | [components/widget-component-contract.md](../components/widget-component-contract.md) |
| `configuration-file` | [components/configuration-files.md](../components/configuration-files.md) |
| `observation-settings` | [components/result-analysis-review.md](../components/result-analysis-review.md) |
| `delivery-directory` | [components/delivery-directory-review.md](../components/delivery-directory-review.md) |
| `trace-waterfall` | [components/library/trace-waterfall.md](../components/library/trace-waterfall.md) · [pages/analysis-audit.md](../pages/analysis-audit.md) |
| `trace-tree` | [components/library/trace-tree.md](../components/library/trace-tree.md) · [pages/analysis-audit.md](../pages/analysis-audit.md) |
| `trace-passport` | [components/library/inspector-details.md](../components/library/inspector-details.md) · [pages/analysis-audit.md](../pages/analysis-audit.md) |
| `observation-calendar` | [pages/analysis-audit.md](../pages/analysis-audit.md) |
| `observation-header` | [pages/analysis-audit.md](../pages/analysis-audit.md) |
| `observation-layout` | [pages/analysis-audit.md](../pages/analysis-audit.md) · [components/widget-component-contract.md](../components/widget-component-contract.md) |
| `observation-widgets` | [pages/analysis-audit.md](../pages/analysis-audit.md) · [components/widget-expression-design.md](../components/widget-expression-design.md) |
| `resource-browser` | [pages/task-browser.md](../pages/task-browser.md) · [pages/workflow-explorer.md](../pages/workflow-explorer.md) · [components/component-recipes.md](../components/component-recipes.md) |
| `search-field` | [components/search-field-review.md](../components/search-field-review.md) |
| `region.app-shell` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.sidebar` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-logo-row` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.surface-banner` | [foundations/navigation.md](../foundations/navigation.md) · [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.sidebar-brand-mark` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.sidebar-brand-name` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.sidebar-toggle` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.new-task-action` | [foundations/navigation.md](../foundations/navigation.md) · [pages/new-task.md](../pages/new-task.md) |
| `region.new-task-icon` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.new-task-label` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-rail` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-rail-tasks` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-rail-task-attention` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-rail-workflows` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-rail-analysis` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-working-set` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.task-section-header` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-section-toggle` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-section-chevron` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-section-label` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-section-attention-badge` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-search-control` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-search-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-search-input` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-search-clear` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-section-actions` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-view-options-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.all-tasks-action` | [foundations/navigation.md](../foundations/navigation.md) · [foundations/layout.md](../foundations/layout.md) |
| `region.task-view-options-menu` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-sort-created` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-sort-activity` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-filter-all` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-filter-active` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-section-content` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-list` | [foundations/layout.md](../foundations/layout.md) |
| `region.task-current` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.task-current-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-current-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-current-attention-badge` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-running` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-running-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-failed` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-failed-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-failed-attention-badge` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-complete` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-complete-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-navigation` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.workflow-section-header` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-section-toggle` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-section-chevron` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-section-label` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-search-control` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-search-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-search-input` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-search-clear` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-section-actions` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-view-options-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.all-workflows-action` | [foundations/navigation.md](../foundations/navigation.md) · [foundations/layout.md](../foundations/layout.md) |
| `region.workflow-view-options-menu` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-show-version` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-section-content` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workflow-current-list` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-navigation` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.analysis-section-header` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-section-toggle` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-section-chevron` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-section-label` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-section-content` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-secondary-navigation` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-dashboard-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-traces-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.analysis-reports-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-footer` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.host-settings` | [foundations/navigation.md](../foundations/navigation.md) · [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.task-workspace` | [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.new-task-empty-state` | [pages/new-task.md](../pages/new-task.md) |
| `region.new-task-composer-seat` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) · [pages/new-task.md](../pages/new-task.md) |
| `region.new-task-hero-composer-placeholder` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) |
| `region.hero-composer-add` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.hero-composer-write-mode` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.hero-composer-send` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workspace-header` | [foundations/layout.md](../foundations/layout.md) · [pages/workflow-studio.md](../pages/workflow-studio.md) · [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.task-context` | [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.task-layout-region` | [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.input-stream` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) · [pages/workflow-studio.md](../pages/workflow-studio.md) · [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.conversation-feed` | [foundations/layout.md](../foundations/layout.md) · [components/input-and-host-slots.md](../components/input-and-host-slots.md) |
| `region.input-approval-card` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.input-approval-submit` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.composer` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) · [pages/workflow-studio.md](../pages/workflow-studio.md) |
| `region.composer-reply-subject` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) · [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.composer-reply-subject-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.composer-reply-subject-clear` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) |
| `region.composer-add` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) |
| `region.composer-write-mode` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) |
| `region.composer-send` | [components/input-and-host-slots.md](../components/input-and-host-slots.md) |
| `region.control-workspace` | [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.control-workspace-scroll-region` | [foundations/layout.md](../foundations/layout.md) |
| `region.task-execution-summary` | [foundations/layout.md](../foundations/layout.md) · [components/review-surfaces.md](../components/review-surfaces.md) · [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.run-health` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.current-activity` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-counts` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.attention-summary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.attention-open-gates` | [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.latest-activity` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.run-consumption` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.task-workbench-navigation` | [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.workbench-nav-grilling` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.preview-surface-grilling` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workbench-nav-plan` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.preview-surface-plan` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workbench-nav-execution` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.preview-surface-execution` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workbench-system-focus` | [pages/task-detail/README.md](../pages/task-detail/README.md) |
| `region.workbench-nav-gate` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.preview-surface-gate` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.workbench-nav-delivery` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.preview-surface-delivery` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-review-workbench` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-main-view` | [components/context-viewers.md](../components/context-viewers.md) · [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-review-overview` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-queue-navigation` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-queue-toggle` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-queue-count` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-queue-position` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-current-impact` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-decision-queue` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-queue-item-g3` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-queue-item-g5` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-queue-item-g6` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-decision-question` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-decision-question-kicker` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-decision-question-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-trigger-context` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-location-context` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-decision-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-decision-board` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-decision-state` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-relevant-decisions` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-relevant-decisions-count` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-relevant-decisions-list` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-current-interpretation` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-current-interpretation-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-current-interpretation-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-understanding-delta` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-understanding-delta-list` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-execution-preview` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-execution-preview-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-execution-preview-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-execution-steps` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-preserved-boundary` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-preserved-boundary-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-plan-context` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-evidence-plan-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-plan-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-plan-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-trigger-record` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-evidence-trigger-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-trigger-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-trigger-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-proposed-change` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-evidence-change-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-change-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-change-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-validation-result` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-evidence-validation-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-validation-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-validation-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-governing-decision` | [pages/task-detail/gate.md](../pages/task-detail/gate.md) |
| `region.gate-evidence-decision-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-decision-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-evidence-decision-action` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-inspector` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-header` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-back` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-kind` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-revision` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-body` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-summary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-summary-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-detail-grid` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-primary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-primary-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-primary-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-secondary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-secondary-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-secondary-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-provenance` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.gate-context-provenance-fields` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.grilling-workbench` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.grilling-overview` | [pages/task-detail/grilling.md](../pages/task-detail/grilling.md) |
| `region.grilling-question-map` | [pages/task-detail/grilling.md](../pages/task-detail/grilling.md) |
| `region.grilling-live-brief` | [pages/task-detail/grilling.md](../pages/task-detail/grilling.md) |
| `region.grilling-brief-changes` | [pages/task-detail/grilling.md](../pages/task-detail/grilling.md) |
| `region.plan-workbench` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-document-viewer` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-document-header` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-document-back` | [components/context-viewers.md](../components/context-viewers.md) · [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-document-page` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-document-outline` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-document-dag-chapter-entry` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-document-content` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-linked-gate-context` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-linked-gate-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-document-wave-anchor` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-full-dag` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-dag-toolbar` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-document-back` | [components/context-viewers.md](../components/context-viewers.md) · [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-dag-search` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-dag-collapse-branches` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-dag-zoom-out` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-zoom-in` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-fit-view` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-viewport` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-canvas` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-grid` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-minimap` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-node-details` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-dag-node-title` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-summary` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-overview` | [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-document-entry` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-outcome-summary` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-dag-projection` | [components/context-viewers.md](../components/context-viewers.md) · [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-dag-entry` | [pages/task-detail/plan.md](../pages/task-detail/plan.md) |
| `region.plan-readiness-summaries` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-control-envelope-summary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-proof-readiness` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-context-health` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-attention-summary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.plan-change-summary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-workbench` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-run-overview` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-plan-run-header` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-run-summary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-run-map` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-run-canvas` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-edge-arrows` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-node-goal` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-wave-0` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-wave-1a` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-wave-1b` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-wave-2` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-gate` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-frontier` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-plan-wave-outcome` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-run-detail` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-wave-run-toolbar` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-level-breadcrumb` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-run-back` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-wave-run-metadata-toggle` | [components/context-viewers.md](../components/context-viewers.md) · [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-wave-run-metadata-chevron` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-run-analysis-link` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-wave-run-metadata` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-metadata-plan-run` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-copy-plan-run` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-metadata-wave` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-copy-wave` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-metadata-workflow` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-copy-workflow` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-metadata-run` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-copy-run` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-metadata-trace-root` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-wave-copy-trace-root` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-dashboard` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-dashboard-header` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-dashboard-health` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-effects-toggle` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-effects-indicator` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-effects-label` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-observability-slots` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-speed-signal` | [components/graph-projections.md](../components/graph-projections.md) · [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-speed-signal-dot` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-speed-signal-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-error-signal` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-observability-extension-slot` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-workflow-run-map` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-run-map-heading` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-legend-success` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-legend-running` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-legend-failed` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-legend-paused` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-legend-gate` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-run-map-viewport` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-run-map-canvas` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-observed-path` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-edge-success` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-edge-running` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-edge-degraded` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-edge-failed` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-edge-paused` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-next-action-frontier` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-flow-particles` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-running-sweep` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-degraded-sweep` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-edge-arrowheads` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-pace-arrowhead` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-goal` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-rules` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-security` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-build` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-running-halo` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-body` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-map-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-docs` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-error-halo` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-paused` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-sandbox` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-loop-control` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-loop-decision` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-loop-return` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-node-gate` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-run-frontier` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-run-event-strip` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-run-pace-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node` | [pages/task-detail/execution.md](../pages/task-detail/execution.md) |
| `region.execution-current-node-status` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-progress` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-progress-value` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-progress-bar` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-duration-copy` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-output` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-checks` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-active-check` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-current-node-active-dot` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.execution-next-boundary` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.delivery-workbench` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.delivery-current-readiness` | [pages/task-detail/delivery.md](../pages/task-detail/delivery.md) |
| `region.delivery-readiness-invalidated-by-input` | [pages/task-detail/delivery.md](../pages/task-detail/delivery.md) |
| `region.delivery-artifacts` | [pages/task-detail/delivery.md](../pages/task-detail/delivery.md) |
| `region.delivery-acceptance` | [pages/task-detail/delivery.md](../pages/task-detail/delivery.md) |
| `region.delivery-residual-risk` | [pages/task-detail/delivery.md](../pages/task-detail/delivery.md) |
| `region.delivery-economics` | [pages/task-detail/delivery.md](../pages/task-detail/delivery.md) |
| `region.better-sidebar-edge-handle` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.better-sidebar-toggle` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.better-sidebar-handle-icon` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.better-sidebar-surface` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.better-sidebar-close` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.better-sidebar-host-slot` | [components/shell-and-sidebar.md](../components/shell-and-sidebar.md) |
| `region.harness-preview` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.sidebar-tooltip` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.icon-preview` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.icon-candidate-name` | [pages/task-detail/README.md](../pages/task-detail/README.md) · [components/context-viewers.md](../components/context-viewers.md) |
| `region.main-surface-host` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.task-browser-header` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.task-browser-search` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.task-browser-toolbar` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-sort-toggle` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-sort-menu` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-view-toggle-seat` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-archive` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-archive-tooltip` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.task-browser-content` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-select-all` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-result-count` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-batch-actions` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-selected-count` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-clear-selection` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-group-label` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-group` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.task-browser-gallery` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.task-browser-list` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-list-body` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-empty` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.task-browser-pagination` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-page-size` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-page-label` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-prev` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-next` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-archive-notice` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-archive-message` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-undo-archive` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-dismiss-notice` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-thumbnail-input` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-rename-dialog` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-rename-form` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-rename-title` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-rename-input` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-rename-cancel` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-rename-save` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-edit-notice` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-edit-message` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.browser-edit-dismiss` | [pages/task-browser.md](../pages/task-browser.md) |
| `region.workflow-explorer-header` | [pages/workflow-explorer.md](../pages/workflow-explorer.md) |
| `region.workflow-explorer-search` | [pages/workflow-explorer.md](../pages/workflow-explorer.md) |
| `region.workflow-explorer-toolbar` | [pages/workflow-explorer.md](../pages/workflow-explorer.md) |
| `region.workflow-explorer-content` | [pages/workflow-explorer.md](../pages/workflow-explorer.md) |
| `region.workflow-explorer-gallery` | [pages/workflow-explorer.md](../pages/workflow-explorer.md) |
| `region.workflow-explorer-list` | [pages/workflow-explorer.md](../pages/workflow-explorer.md) |
| `region.workflow-explorer-pagination` | [pages/workflow-explorer.md](../pages/workflow-explorer.md) |
| `region.workbench-root` | [pages/analysis-audit.md](../pages/analysis-audit.md) |
| `region.workbench-host-input` | [pages/analysis-audit.md](../pages/analysis-audit.md) |
