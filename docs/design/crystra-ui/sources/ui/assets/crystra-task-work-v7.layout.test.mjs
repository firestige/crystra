import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const require = createRequire(new URL('../../../../wsr-ui/package.json', import.meta.url));
const { chromium } = require('playwright');

test('Chinese locale keeps product-owned titles and metrics in Chinese', async () => {
  const html = await readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8');

  assert.match(html, /data-ui-locale="zh-CN"/);
  assert.match(html, /data-section-id="new-task-icon"[^>]*>\s*<svg width="14" height="14"/);
  assert.match(html, /data-section-id="new-task-label"[^>]*>新建任务</);
  assert.doesNotMatch(html, /data-section-id="new-task-action"[^>]*bg-gradient/);
  assert.match(html, />计划 v4 · 等待审核</);
  assert.match(html, />控制边界</);
  assert.match(html, />证明准备度</);

  for (const mixedLocaleLabel of [
    'New Task',
    'Ready for review',
    'Goal &amp; completion',
    'Control envelope',
    'Proof readiness',
    'Authoritative context',
    'Needs attention',
    'Changed since v3',
  ]) {
    assert.doesNotMatch(html, new RegExp(`>${mixedLocaleLabel}<`));
  }
});

test('task browser replaces the full main surface instead of retaining task chat', async () => {
  const [taskBrowserHtml, taskWorkbenchHtml] = await Promise.all([
    readFile(new URL('./crystra-task-browser-v7.html', import.meta.url), 'utf8'),
    readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8'),
  ]);

  assert.match(taskWorkbenchHtml, /data-section-id="all-tasks-action"[^>]*href="crystra-task-browser-v7\.html"/);
  assert.match(taskBrowserHtml, /data-section-id="app-shell"/);
  assert.match(taskBrowserHtml, /data-section-id="sidebar"/);
  assert.match(taskBrowserHtml, /data-section-id="main-surface-host"/);
  assert.match(taskBrowserHtml, /data-section-id="task-browser-surface"/);
  assert.match(taskBrowserHtml, /data-section-id="task-browser-search"/);
  assert.match(taskBrowserHtml, /data-section-id="task-browser-filter"/);
  assert.match(taskBrowserHtml, /data-section-id="task-browser-list"/);
  assert.match(taskBrowserHtml, /data-section-id="task-browser-row-market-release"[^>]*href="crystra-task-work-v7\.html\?task_id=task-market-release"/);
  assert.doesNotMatch(taskBrowserHtml, /data-section-id="input-stream"/);
  assert.doesNotMatch(taskBrowserHtml, /data-section-id="control-workspace"/);
});

test('task browser reuses the confirmed global sidebar structure', async () => {
  const taskBrowserHtml = await readFile(new URL('./crystra-task-browser-v7.html', import.meta.url), 'utf8');

  for (const sectionId of [
    'new-task-icon',
    'new-task-label',
    'task-working-set',
    'task-section-header',
    'task-section-toggle',
    'task-section-chevron',
    'task-section-label',
    'task-search-control',
    'task-search-action',
    'task-search-input',
    'task-search-clear',
    'task-section-actions',
    'task-view-options-action',
    'task-view-options-menu',
    'task-section-content',
    'task-list',
    'workflow-navigation',
    'workflow-section-header',
    'workflow-section-toggle',
    'workflow-section-content',
    'analysis-navigation',
    'analysis-section-header',
    'analysis-section-toggle',
    'analysis-section-content',
    'analysis-secondary-navigation',
  ]) {
    assert.match(taskBrowserHtml, new RegExp(`data-section-id="${sectionId}"`));
  }

  assert.doesNotMatch(taskBrowserHtml, /data-section-id="sidebar-(?:task|workflow|analysis)-section/);
  assert.match(taskBrowserHtml, /data-section-id="all-tasks-action"[^>]*aria-current="page"/);
});

test('task browser shared sidebar keeps the confirmed search and collapse behavior', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(new URL('./crystra-task-browser-v7.html', import.meta.url).pathname).href;
    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    await page.locator('[data-section-id="task-search-action"]').click();
    await assert.doesNotReject(() => page.locator('[data-section-id="task-search-input"]').waitFor({ state: 'visible' }));
    assert.equal(await page.locator('[data-section-id="task-section-toggle"]').isHidden(), true);
    assert.equal(await page.locator('[data-section-id="task-section-actions"]').isHidden(), true);
    await page.locator('[data-section-id="task-search-input"]').fill('预检');
    assert.equal(await page.locator('[data-sidebar-task-row]:visible').count(), 1);

    await page.locator('[data-section-id="task-search-clear"]').click();
    assert.equal(await page.locator('[data-section-id="task-search-input"]').isHidden(), true);
    await page.locator('[data-section-id="task-view-options-action"]').click();
    await assert.doesNotReject(() => page.locator('[data-section-id="task-view-options-menu"]').waitFor({ state: 'visible' }));

    await page.locator('[data-section-id="task-section-toggle"]').click();
    assert.equal(await page.locator('[data-section-id="task-section-content"]').isHidden(), true);
    assert.equal(await page.locator('[data-section-id="task-section-actions"]').isHidden(), true);
  } finally {
    await browser.close();
  }
});

test('task browser search and attention filter operate on the global task list', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-browser-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    await page.locator('[data-section-id="task-browser-filter-attention"]').click();
    assert.deepEqual(
      await page.locator('[data-browser-task-row]:visible').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-section-id'))),
      ['task-browser-row-market-release', 'task-browser-row-plugin-preflight'],
    );
    assert.equal(await page.locator('[data-section-id="task-browser-result-count"]').textContent(), '显示 2 / 28 个任务');

    await page.locator('[data-section-id="task-browser-filter-option"]').click();
    await page.locator('[data-section-id="task-browser-search"]').fill('UI 工作台');
    assert.deepEqual(
      await page.locator('[data-browser-task-row]:visible').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-section-id'))),
      ['task-browser-row-ui-workbench'],
    );
  } finally {
    await browser.close();
  }
});

test('design input records the human-facing card and locale rules', async () => {
  const [designInput, taskBrowserMemo, workflowPagesMemo] = await Promise.all([
    readFile(new URL('../task-control-workbenches-design-input.zh-CN.md', import.meta.url), 'utf8'),
    readFile(new URL('../task-browser-design-memo.zh-CN.md', import.meta.url), 'utf8'),
    readFile(new URL('../workflow-pages-design-memo.zh-CN.md', import.meta.url), 'utf8'),
  ]);

  assert.match(designInput, /审核封面/);
  assert.match(designInput, /正常项聚合/);
  assert.match(designInput, /异常项展开/);
  assert.match(designInput, /完整原文/);
  assert.match(designInput, /同一 locale/);
  assert.match(designInput, /LLM 生成的内容不承担语言一致性/);
  assert.match(designInput, /两级 DAG 投影/);
  assert.match(designInput, /缩放、拖动画布、适应窗口/);
  assert.match(designInput, /图形浏览操作/);
  assert.match(designInput, /正交折线/);
  assert.match(designInput, /光源扫过/);
  assert.match(designInput, /可观测组件提醒槽位/);
  assert.match(designInput, /前 5 轮中位数/);
  assert.match(designInput, /专用图布局引擎/);
  assert.match(designInput, /回边总长度/);
  assert.match(designInput, /布局稳定性/);
  assert.match(designInput, /语义示意稿/);
  assert.match(designInput, /Plan Run/);
  assert.match(designInput, /Wave Run/);
  assert.match(designInput, /Plan Node → Wave → Workflow Run/);
  assert.match(designInput, /Wave Run 元数据卡/);
  assert.match(designInput, /Trace Root/);
  assert.match(designInput, /不可变关联键/);
  assert.match(designInput, /默认折叠/);
  assert.match(designInput, /字段值右侧/);
  assert.match(designInput, /复制原始值/);
  assert.match(designInput, /不提供整包 JSON/);
  assert.match(designInput, /只有能稳定定位/);
  assert.match(designInput, /attempt.*不属于身份/);
  assert.match(designInput, /在分析中查看/);
  assert.match(designInput, /Execution 页面交互契约与元素对照/);
  assert.match(designInput, /元素 ID 均指 `data-section-id`/);
  assert.match(designInput, /`execution-plan-run-overview`/);
  assert.match(designInput, /`execution-plan-wave-1b`/);
  assert.match(designInput, /`execution-wave-run-metadata-toggle`/);
  assert.match(designInput, /`execution-wave-run-analysis-link`/);
  assert.match(designInput, /`execution-observability-slots`/);
  assert.match(designInput, /`execution-effects-toggle`/);
  assert.match(designInput, /`execution-current-node`/);
  assert.match(designInput, /原型演示交互/);
  assert.match(designInput, /Gate 证据与上下文导航契约/);
  assert.match(designInput, /`gate-evidence-plan-context`/);
  assert.match(designInput, /`gate-context-inspector`/);
  assert.match(designInput, /`from_gate_id`/);
  assert.match(designInput, /不得回退到最新版本/);
  assert.match(designInput, /全局 Shell、Task 与 Input 契约/);
  assert.match(designInput, /`sidebar-logo-row`/);
  assert.match(designInput, /`surface-banner`/);
  assert.match(designInput, /`sidebar-brand-mark`、`sidebar-brand-name`/);
  assert.match(designInput, /`sidebar-toggle`/);
  assert.match(designInput, /透明背景、无外层卡片/);
  assert.match(designInput, /`new-task-action`/);
  assert.match(designInput, /新建任务空白态与 DSH Workspace Slot 复用契约/);
  assert.match(designInput, /`conversation\.composer\.bar`/);
  assert.match(designInput, /`conversation\.hero\.workspace`/);
  assert.match(designInput, /`conversation\.hero\.workspace\.directoryFlow`/);
  assert.match(designInput, /不得依赖私有 `WorkspacePicker`/);
  assert.match(designInput, /不代表已经创建 Task 或 Session/);
  assert.match(designInput, /统一 Task 列表/);
  assert.match(designInput, /FILO/);
  assert.match(designInput, /事件冒泡/);
  assert.match(designInput, /状态圆点/);
  assert.match(designInput, /注意力徽标/);
  assert.match(designInput, /`task-view-options-menu`/);
  assert.match(designInput, /`task-filter-active`/);
  assert.match(designInput, /跨一级页面的协作边界/);
  assert.match(designInput, /原型审计豁免/);
  assert.match(designInput, /task-browser-design-memo\.zh-CN\.md/);
  assert.match(taskBrowserMemo, /Task Browser 页面设计 memo/);
  assert.match(taskBrowserMemo, /`main-surface-host`/);
  assert.match(taskBrowserMemo, /右侧 `main-surface-host` 整面替换/);
  assert.match(taskBrowserMemo, /返回 Browser 时应恢复查询、过滤、排序、分页与滚动位置/);
  assert.match(taskBrowserMemo, /依赖宿主路由和后台状态服务/);
  assert.match(designInput, /待审核、失败停止/);
  assert.match(designInput, /全部完成.*明确放弃/);
  assert.match(designInput, /单行省略/);
  assert.match(designInput, /同一槽位互斥替换/);
  assert.match(designInput, /不得在其下方插入第二行搜索框/);
  assert.match(designInput, /`task-search-clear`/);
  assert.match(designInput, /点击搜索框以外/);
  assert.match(designInput, /关闭搜索/);
  assert.match(designInput, /Section、折叠与高度分配/);
  assert.match(designInput, /不是传统的互斥 Accordion/);
  assert.match(designInput, /不为三个 Section 预先分配固定高度/);
  assert.match(designInput, /`task-section-toggle`/);
  assert.match(designInput, /折叠时工具消失/);
  assert.match(designInput, /排序和过滤选择继续作为 UI 偏好保留/);
  assert.match(designInput, /一级信息架构只有“任务”“工作流”“分析”/);
  assert.match(designInput, /`workflow-section-header`/);
  assert.match(designInput, /`analysis-secondary-navigation`/);
  assert.match(designInput, /完整 Header 高亮/);
  assert.match(designInput, /抑制父 Header 的整行高亮/);
  assert.match(designInput, /`better-sidebar-edge-handle`/);
  assert.match(designInput, /`sidebar-footer`/);
  assert.match(designInput, /divider 属于 Footer/);
  assert.match(designInput, /`host-settings`/);
  assert.match(designInput, /Grilling Workbench 交互契约/);
  assert.match(designInput, /Plan Workbench 交互契约/);
  assert.match(designInput, /`plan-dag-fit-view`/);
  assert.match(designInput, /Gate 多决策与 Input subject 契约/);
  assert.match(designInput, /`composer-reply-subject-clear`/);
  assert.match(designInput, /Delivery Workbench 交互契约/);
  assert.match(designInput, /Analysis & Audit 交互契约/);
  assert.match(designInput, /Workflow 页协作边界/);
  assert.match(designInput, /workflow-pages-design-memo\.zh-CN\.md/);
  assert.match(workflowPagesMemo, /Workflow Explorer \/ Studio 页面设计 memo/);
  assert.match(workflowPagesMemo, /`workflow-save-draft`、`workflow-validate`/);
  assert.match(workflowPagesMemo, /正式设计应移除/);
  assert.match(workflowPagesMemo, /(?:Task Explorer 与 Workflow Explorer|Workflow Explorer 与 Task Explorer)/);
  assert.match(designInput, /交互契约覆盖结论/);
  assert.match(designInput, /五个工作面是并列的只读投影视图/);
  assert.match(designInput, /用户当前查看状态.*系统当前活动状态/);
  assert.match(designInput, /静态允许拓扑.*动态实际路径/);
  assert.match(designInput, /当前可交付状态/);
});

test('new task workspace picker is a DSH slot marker in the centered hero composer', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    assert.equal(await page.locator('[data-section-id="workspace-selector-action"]').count(), 0);

    await page.locator('[data-section-id="new-task-action"]').click();
    const emptyState = page.locator('[data-section-id="new-task-empty-state"]');
    const workspaceSlot = page.locator('[data-section-id="new-task-workspace-slot-placeholder"]');
    await assert.doesNotReject(() => emptyState.waitFor({ state: 'visible' }));
    assert.equal(
      await workspaceSlot.evaluate((element) => element.closest('[data-section-id="new-task-composer-seat"]') !== null),
      true,
    );
    assert.equal(await workspaceSlot.getAttribute('data-provider'), 'dsh-client-ui-workspace');
    assert.equal(await workspaceSlot.getAttribute('data-slot'), 'conversation.hero.workspace');
    assert.equal(await workspaceSlot.getAttribute('aria-haspopup'), 'menu');
  } finally {
    await browser.close();
  }
});

test('DSH composer controls and workflow instances do not become Crystra section ids', async () => {
  const [taskHtml, workflowHtml] = await Promise.all([
    readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8'),
    readFile(new URL('./crystra-workflow-studio-v7.html', import.meta.url), 'utf8'),
  ]);

  assert.doesNotMatch(taskHtml, /data-section-id="new-task-composer-(?:add|send)-placeholder"/);
  for (const definitionId of ['build-and-sign', 'market-validation', 'publish-documentation']) {
    assert.match(taskHtml, new RegExp(`href="crystra-workflow-studio-v7\\.html\\?workflow_definition_id=${definitionId}[^\"]*"[^>]*data-workflow-definition-id="${definitionId}"`));
    assert.match(workflowHtml, new RegExp(`data-workflow-definition-id="${definitionId}"`));
    assert.doesNotMatch(taskHtml, new RegExp(`data-section-id="[^"]*${definitionId}[^"]*"`));
    assert.doesNotMatch(workflowHtml, new RegExp(`data-section-id="[^"]*${definitionId}[^"]*"`));
  }
  assert.match(workflowHtml, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(workflowHtml, /querySelector\(`\[data-workflow-definition-id="\$\{selectedWorkflowId\}"\]`\)/);
});

test('every static Task prototype section id has an exact documentation reference', async () => {
  const taskHtml = await readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8');
  const documentDirectory = new URL('../', import.meta.url);
  const documentNames = (await readdir(documentDirectory)).filter((name) => name.endsWith('.md'));
  const documentation = (await Promise.all(
    documentNames.map((name) => readFile(new URL(name, documentDirectory), 'utf8')),
  )).join('\n');
  const staticSectionIds = [...new Set(
    [...taskHtml.matchAll(/data-section-id="([^"$]+)"/g)].map((match) => match[1]),
  )];
  const undocumented = staticSectionIds.filter((sectionId) => !documentation.includes(`\`${sectionId}\``));

  assert.deepEqual(undocumented, []);
});

test('workflow links focus their matching domain anchor without native ids', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-workflow-studio-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(`${documentUrl}?workflow_definition_id=market-validation&revision=v2&from_task_id=task-market-release`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const anchor = page.locator('[data-workflow-definition-id="market-validation"]');
    assert.equal(await anchor.getAttribute('aria-current'), 'true');
    assert.equal(await anchor.getAttribute('id'), null);
    assert.equal(await page.locator('[data-workflow-definition-id="build-and-sign"]').getAttribute('aria-current'), null);
  } finally {
    await browser.close();
  }
});

test('sidebar brand row follows the host shell rhythm without becoming a card', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const brand = page.locator('[data-section-id="surface-banner"]');
    const toggle = page.locator('[data-section-id="sidebar-toggle"]');
    await assert.doesNotReject(() => page.locator('[data-section-id="sidebar-logo-row"]').waitFor({ state: 'visible' }));
    await assert.doesNotReject(() => page.locator('[data-section-id="sidebar-brand-mark"] svg').waitFor({ state: 'visible' }));
    await assert.doesNotReject(() => page.locator('[data-section-id="sidebar-brand-name"]').waitFor({ state: 'visible' }));
    assert.equal(await brand.getAttribute('aria-label'), '切换到 DeepSeek Harness');
    assert.equal(await toggle.getAttribute('aria-label'), '收起侧边栏');
    assert.doesNotMatch(await page.locator('[data-section-id="sidebar-logo-row"]').textContent(), /⇄/);

    const brandStyle = await brand.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        borderWidth: Number.parseFloat(style.borderTopWidth),
        borderRadius: Number.parseFloat(style.borderTopLeftRadius),
        backgroundColor: style.backgroundColor,
        boxShadow: style.boxShadow,
      };
    });
    assert.equal(brandStyle.borderWidth, 0);
    assert.equal(brandStyle.borderRadius, 0);
    assert.equal(brandStyle.backgroundColor, 'rgba(0, 0, 0, 0)');
    assert.equal(brandStyle.boxShadow, 'none');
  } finally {
    await browser.close();
  }
});

test('workbench navigation is non-linear without redundant textual status summaries', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    await page.goto(`${documentUrl}?surface=gate`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const navigation = page.locator('[data-section-id="task-workbench-navigation"]');
    await assert.doesNotReject(() => navigation.waitFor({ state: 'visible' }));
    assert.doesNotMatch(await navigation.textContent(), /任务工作面/);
    assert.equal(await page.locator('[data-section-id="workbench-view-context"]').count(), 0);
    assert.doesNotMatch(await navigation.textContent(), /系统正在执行|当前查看/);
    assert.equal(await page.locator('[data-section-id="workbench-system-focus"]').getAttribute('data-system-surface'), 'execution');
    assert.equal(await page.locator('[data-section-id="workbench-nav-gate"]').getAttribute('aria-current'), 'page');
    assert.equal(await page.locator('[data-section-id="workbench-nav-execution"]').getAttribute('data-system-active'), 'true');
    const selectedGateStyle = await page.locator('[data-section-id="workbench-nav-gate"]').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        borderStyle: style.borderStyle,
        borderColor: style.borderColor,
        borderRadius: Number.parseFloat(style.borderTopLeftRadius),
        boxShadow: style.boxShadow,
      };
    });
    assert.equal(selectedGateStyle.borderStyle, 'solid');
    assert.equal(selectedGateStyle.borderColor, 'rgb(91, 141, 239)');
    assert.ok(selectedGateStyle.borderRadius >= 8, 'selected workbench must retain a rounded card border');
    assert.equal(selectedGateStyle.boxShadow, 'none');

    await page.locator('[data-section-id="workbench-nav-plan"]').click();
    assert.equal(await page.locator('[data-section-id="workbench-nav-plan"]').getAttribute('aria-current'), 'page');
    assert.equal(await page.locator('[data-section-id="workbench-nav-execution"]').getAttribute('data-system-active'), 'true');
    await assert.doesNotReject(() => page.locator('[data-section-id="plan-workbench"]').waitFor({ state: 'visible' }));
    assert.doesNotMatch(await page.locator('[data-section-id="gate-decision-state"]').textContent(), /随对话更新|只读投影/);
  } finally {
    await browser.close();
  }
});

test('attention summary opens the prioritized pending gate queue', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    await page.locator('[data-section-id="attention-open-gates"]').click();

    assert.equal(await page.locator('[data-section-id="workbench-nav-gate"]').getAttribute('aria-current'), 'page');
    await assert.doesNotReject(() => page.locator('[data-section-id="gate-review-workbench"]').waitFor({ state: 'visible' }));
    await assert.doesNotReject(() => page.locator('[data-section-id="gate-decision-queue"]').waitFor({ state: 'visible' }));
    assert.equal(await page.locator('[data-section-id="gate-queue-toggle"]').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('[data-section-id="gate-queue-item-g3"]').getAttribute('aria-current'), 'true');
  } finally {
    await browser.close();
  }
});

test('execution and delivery surfaces project a dynamic path and current deliverability', async () => {
  const [html, designInput] = await Promise.all([
    readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8'),
    readFile(new URL('../task-control-workbenches-design-input.zh-CN.md', import.meta.url), 'utf8'),
  ]);

  for (const sectionId of [
    'execution-observed-path',
    'execution-next-action-frontier',
    'delivery-current-readiness',
    'delivery-readiness-invalidated-by-input',
  ]) {
    assert.match(html, new RegExp(`data-section-id="${sectionId}"`));
  }
  assert.match(html, /已发生路径与下一步候选/);
  assert.match(html, /Planner 尚未选择/);
  assert.match(html, /当前可交付/);
  assert.match(html, /2 个未开始/);
  assert.doesNotMatch(html, /Wave 2 · 等待|Gate · 等待/);
  assert.doesNotMatch(html, /任务结果已就绪/);
  assert.doesNotMatch(html, /最终交付物/);
  assert.match(designInput, /Execution 不定义通用的 waiting edge/);
});

test('input and workbench scroll regions hide chrome without disabling scrolling', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    for (const sectionId of ['conversation-feed', 'control-workspace-scroll-region']) {
      const scrollRegion = page.locator(`[data-section-id="${sectionId}"]`);
      assert.equal(await scrollRegion.count(), 1);
      const style = await scrollRegion.evaluate((element) => {
        const computed = getComputedStyle(element);
        return { overflowY: computed.overflowY, scrollbarWidth: computed.scrollbarWidth };
      });
      assert.equal(style.overflowY, 'auto');
      assert.equal(style.scrollbarWidth, 'none');
    }
  } finally {
    await browser.close();
  }
});

test('Better Sidebar integration is optional and Crystra does not define its own file browser', async () => {
  const html = await readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8');

  for (const sectionId of [
    'task-layout-region',
    'better-sidebar-edge-handle',
    'better-sidebar-toggle',
    'better-sidebar-surface',
    'better-sidebar-close',
    'better-sidebar-host-slot',
  ]) {
    assert.match(html, new RegExp(`data-section-id="${sectionId}"`));
  }
  assert.match(html, /data-provider="dsh-better-sidebar"/);
  assert.match(html, /better_sidebar/);
  assert.doesNotMatch(html, /data-section-id="crystra-file-(tree|viewer|editor)"/);
  const workspaceHeader = html.slice(
    html.indexOf('<header data-section-id="workspace-header"'),
    html.indexOf('</header>', html.indexOf('<header data-section-id="workspace-header"')),
  );
  assert.doesNotMatch(workspaceHeader, /data-section-id="better-sidebar-toggle"/);
});

test('file utility stays hidden without Better Sidebar and adapts its placement to available width', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    const absentPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await absentPage.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    assert.equal(await absentPage.locator('[data-section-id="app-shell"]').getAttribute('data-better-sidebar-available'), 'false');
    assert.equal(await absentPage.locator('[data-section-id="better-sidebar-edge-handle"]').isHidden(), true);
    assert.equal(await absentPage.locator('[data-section-id="better-sidebar-toggle"]').isHidden(), true);
    assert.equal(await absentPage.locator('[data-section-id="better-sidebar-surface"]').isHidden(), true);

    const compactPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await compactPage.goto(`${documentUrl}?better_sidebar=1`, { waitUntil: 'domcontentloaded' });
    assert.equal(await compactPage.locator('[data-section-id="app-shell"]').getAttribute('data-layout-mode'), 'compact');
    assert.equal(await compactPage.locator('[data-section-id="better-sidebar-edge-handle"]').getAttribute('data-edge'), 'bottom');
    await compactPage.locator('[data-section-id="better-sidebar-edge-handle"]').hover();
    await compactPage.locator('[data-section-id="better-sidebar-toggle"]').click();
    assert.equal(await compactPage.locator('[data-section-id="app-shell"]').getAttribute('data-utility-placement'), 'bottom');
    assert.equal(await compactPage.locator('[data-section-id="better-sidebar-surface"]').isVisible(), true);

    const widePage = await browser.newPage({ viewport: { width: 2560, height: 1080 } });
    await widePage.goto(`${documentUrl}?better_sidebar=1`, { waitUntil: 'domcontentloaded' });
    assert.equal(await widePage.locator('[data-section-id="app-shell"]').getAttribute('data-layout-mode'), 'wide');
    assert.equal(await widePage.locator('[data-section-id="better-sidebar-edge-handle"]').getAttribute('data-edge'), 'right');
    await widePage.locator('[data-section-id="better-sidebar-edge-handle"]').hover();
    await widePage.locator('[data-section-id="better-sidebar-toggle"]').click();
    assert.equal(await widePage.locator('[data-section-id="app-shell"]').getAttribute('data-utility-placement'), 'right');
    const wideWidths = await widePage.evaluate(() => ({
      input: document.querySelector('[data-section-id="input-stream"]').getBoundingClientRect().width,
      control: document.querySelector('[data-section-id="control-workspace"]').getBoundingClientRect().width,
      utility: document.querySelector('[data-section-id="better-sidebar-surface"]').getBoundingClientRect().width,
    }));
    assert.ok(wideWidths.input >= 360);
    assert.ok(wideWidths.control >= 680);
    assert.ok(wideWidths.utility >= 320);

    const ultrawidePage = await browser.newPage({ viewport: { width: 3840, height: 1080 } });
    await ultrawidePage.goto(`${documentUrl}?better_sidebar=1`, { waitUntil: 'domcontentloaded' });
    assert.equal(await ultrawidePage.locator('[data-section-id="app-shell"]').getAttribute('data-layout-mode'), 'ultrawide');
    await ultrawidePage.locator('[data-section-id="better-sidebar-edge-handle"]').hover();
    await ultrawidePage.locator('[data-section-id="better-sidebar-toggle"]').click();
    assert.equal(await ultrawidePage.locator('[data-section-id="better-sidebar-surface"]').getAttribute('data-density'), 'expanded');
    await ultrawidePage.locator('[data-section-id="better-sidebar-close"]').click();
    assert.equal(await ultrawidePage.locator('[data-section-id="better-sidebar-surface"]').isHidden(), true);
  } finally {
    await browser.close();
  }
});

test('design input records responsive layout arbitration and the optional Better Sidebar boundary', async () => {
  const designInput = await readFile(
    new URL('../task-control-workbenches-design-input.zh-CN.md', import.meta.url),
    'utf8',
  );

  assert.match(designInput, /空间分配与 Better Sidebar 集成契约/);
  assert.match(designInput, /可用宽度/);
  assert.match(designInput, /Input.*Control Bench.*文件工具面/s);
  assert.match(designInput, /`sessionId \+ cwd`/);
  assert.match(designInput, /可选依赖/);
  assert.match(designInput, /未安装.*隐藏/s);
  assert.match(designInput, /不开发.*文件浏览器/s);
  assert.match(designInput, /`better-sidebar-toggle`/);
  assert.match(designInput, /`better-sidebar-host-slot`/);
  assert.match(designInput, /紧凑.*标准.*宽屏.*超宽/s);
  assert.match(designInput, /分别保存/);
});

test('sidebar presents one compact chronological task list with status dots and attention badges', async () => {
  const html = await readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8');
  const sidebar = html.slice(html.indexOf('<aside data-section-id="sidebar"'), html.indexOf('</aside>'));

  for (const sectionId of [
    'task-section-header',
    'task-section-toggle',
    'task-section-chevron',
    'task-section-attention-badge',
    'task-section-content',
    'task-search-action',
    'task-search-input',
    'task-search-clear',
    'task-view-options-action',
    'task-view-options-menu',
    'task-sort-created',
    'task-sort-activity',
    'task-filter-all',
    'task-filter-active',
    'task-list',
    'task-current',
    'task-running',
    'task-failed',
    'task-complete',
    'all-tasks-action',
    'workflow-navigation',
    'workflow-section-header',
    'workflow-section-toggle',
    'workflow-section-label',
    'workflow-section-content',
    'workflow-current-list',
    'all-workflows-action',
    'analysis-navigation',
    'analysis-section-header',
    'analysis-section-toggle',
    'analysis-section-label',
    'analysis-section-content',
    'analysis-secondary-navigation',
    'analysis-dashboard-action',
    'analysis-traces-action',
    'analysis-audit-action',
    'analysis-compare-action',
  ]) {
    assert.match(html, new RegExp(`data-section-id="${sectionId}"`));
  }
  assert.match(sidebar, /按创建时间/);
  assert.match(sidebar, /按活跃度/);
  assert.match(sidebar, />活跃任务</);
  assert.doesNotMatch(sidebar, /仅显示运行中/);
  assert.match(sidebar, /data-task-state="review"/);
  assert.match(sidebar, /data-task-state="running"/);
  assert.match(sidebar, /data-task-state="failed"/);
  assert.match(sidebar, /data-task-state="complete"/);
  assert.match(sidebar, /data-task-active="true"/);
  assert.match(sidebar, /data-task-active="false"/);
  assert.doesNotMatch(sidebar, /data-section-id="task-attention-inbox"/);
  assert.doesNotMatch(sidebar, /data-section-id="active-task-list"/);
  assert.doesNotMatch(sidebar, /data-section-id="inactive-task-history-action"/);
  assert.doesNotMatch(sidebar, /data-section-id="task-search-panel"/);
  assert.doesNotMatch(sidebar, />● 执行中</);
  assert.doesNotMatch(sidebar, />当前可交付</);
  assert.doesNotMatch(sidebar, /data-section-id="build-navigation"/);
  assert.doesNotMatch(sidebar, /data-section-id="library-navigation"/);
  assert.doesNotMatch(sidebar, />资源库</);
  assert.match(sidebar, /build-and-sign/);
  assert.match(sidebar, /workflow_definition_id=build-and-sign/);
  assert.match(sidebar, /crystra-analysis-audit-v7\.html\?view=dashboard/);
  assert.match(sidebar, /crystra-analysis-audit-v7\.html\?view=traces/);
  const analysisNavigation = sidebar.slice(
    sidebar.indexOf('<nav data-section-id="analysis-navigation"'),
    sidebar.indexOf('</nav>', sidebar.indexOf('<nav data-section-id="analysis-navigation"')),
  );
  assert.doesNotMatch(analysisNavigation, /task_id=/);
  assert.doesNotMatch(analysisNavigation, /data-section-id="analysis-task-list"/);
});

test('sidebar sections collapse independently and task tools only exist in the expanded state', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const taskToggle = page.locator('[data-section-id="task-section-toggle"]');
    const taskContent = page.locator('[data-section-id="task-section-content"]');
    const taskSearch = page.locator('[data-section-id="task-search-control"]');
    const taskActions = page.locator('[data-section-id="task-section-actions"]');
    const taskAttention = page.locator('[data-section-id="task-section-attention-badge"]');
    assert.equal(await taskToggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await taskContent.isVisible(), true);
    assert.equal(await taskSearch.isVisible(), true);
    assert.equal(await taskActions.isVisible(), true);
    assert.equal(await taskAttention.isVisible(), false);

    await page.locator('[data-section-id="task-view-options-action"]').click();
    await page.locator('[data-section-id="task-sort-activity"]').check();
    await page.locator('[data-section-id="task-filter-active"]').check();
    await taskToggle.click();
    assert.equal(await taskToggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await taskContent.isVisible(), false);
    assert.equal(await taskSearch.isVisible(), false);
    assert.equal(await taskActions.isVisible(), false);
    assert.equal(await taskAttention.isVisible(), true);
    assert.equal(await page.locator('[data-section-id="task-view-options-menu"]').isVisible(), false);
    const collapsedTaskHeadingWidths = await page.evaluate(() => ({
      header: document.querySelector('[data-section-id="task-section-header"]').getBoundingClientRect().width,
      toggle: document.querySelector('[data-section-id="task-section-toggle"]').getBoundingClientRect().width,
    }));
    assert.ok(
      Math.abs(collapsedTaskHeadingWidths.header - collapsedTaskHeadingWidths.toggle) <= 1,
      'collapsed Task heading hover target must span the same full width as other accordion headings',
    );

    await taskToggle.click();
    assert.equal(await taskContent.isVisible(), true);
    assert.equal(await taskSearch.isVisible(), true);
    assert.equal(await taskActions.isVisible(), true);
    assert.equal(await page.locator('[data-section-id="task-sort-activity"]').isChecked(), true);
    assert.equal(await page.locator('[data-section-id="task-filter-active"]').isChecked(), true);
    const expandedTaskHeadingGeometry = await page.evaluate(() => {
      const toggle = document.querySelector('[data-section-id="task-section-toggle"]').getBoundingClientRect();
      const search = document.querySelector('[data-section-id="task-search-control"]').getBoundingClientRect();
      return { deadGap: search.left - toggle.right };
    });
    assert.ok(
      expandedTaskHeadingGeometry.deadGap <= 1,
      'expanded Task heading hover target must fill all space before its contextual tools',
    );
    const taskHeading = page.locator('[data-section-id="task-section-header"]');
    await page.mouse.move(800, 100);
    await page.waitForTimeout(220);
    const baseHeadingBackground = await taskHeading.evaluate((element) => getComputedStyle(element).backgroundColor);
    await taskToggle.hover();
    await page.waitForTimeout(220);
    const titleHoverBackground = await taskHeading.evaluate((element) => getComputedStyle(element).backgroundColor);
    assert.notEqual(titleHoverBackground, baseHeadingBackground, 'hovering the accordion title must highlight the full header');
    await page.locator('[data-section-id="task-view-options-action"]').hover();
    await page.waitForTimeout(220);
    assert.equal(
      await taskHeading.evaluate((element) => getComputedStyle(element).backgroundColor),
      baseHeadingBackground,
      'hovering a contextual tool must suppress the full-header highlight',
    );
    assert.notEqual(
      await page.locator('[data-section-id="task-view-options-action"]').evaluate((element) => getComputedStyle(element).backgroundColor),
      'rgba(0, 0, 0, 0)',
      'the hovered contextual tool keeps its own highlight',
    );

    const workflowToggle = page.locator('[data-section-id="workflow-section-toggle"]');
    const analysisToggle = page.locator('[data-section-id="analysis-section-toggle"]');
    await page.locator('[data-section-id="workflow-section-label"]').click();
    assert.equal(await workflowToggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('[data-section-id="workflow-section-content"]').isVisible(), false);
    assert.equal(await page.locator('[data-section-id="analysis-section-content"]').isVisible(), true);
    assert.equal(await taskContent.isVisible(), true);

    await page.locator('[data-section-id="analysis-section-label"]').click();
    assert.equal(await analysisToggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('[data-section-id="analysis-section-content"]').isVisible(), false);
    assert.equal(await taskContent.isVisible(), true);

    assert.equal(await page.locator('[data-section-id="workflow-section-label"]').getAttribute('href'), null);
    assert.equal(await page.locator('[data-section-id="analysis-section-label"]').getAttribute('href'), null);
    assert.equal(await page.locator('[data-section-id="workflow-section-toggle"] [data-section-id="workflow-section-label"]').count(), 1);
    assert.equal(await page.locator('[data-section-id="analysis-section-toggle"] [data-section-id="analysis-section-label"]').count(), 1);

    const headingStyles = await Promise.all([
      'task-section-header',
      'workflow-section-header',
      'analysis-section-header',
    ].map((sectionId) => page.locator(`[data-section-id="${sectionId}"]`).evaluate((element) => {
      const style = getComputedStyle(element);
      return { backgroundColor: style.backgroundColor, borderRadius: style.borderRadius };
    })));
    assert.notEqual(headingStyles[0].backgroundColor, 'rgba(0, 0, 0, 0)');
    assert.equal(new Set(headingStyles.map((style) => style.backgroundColor)).size, 1);
    assert.equal(new Set(headingStyles.map((style) => style.borderRadius)).size, 1);
    const headingLabelStyle = await page.locator('[data-section-id="workflow-section-label"]').evaluate((element) => {
      const style = getComputedStyle(element);
      return { fontWeight: Number(style.fontWeight), letterSpacing: style.letterSpacing };
    });
    assert.ok(headingLabelStyle.fontWeight >= 600);
    assert.notEqual(headingLabelStyle.letterSpacing, 'normal');
  } finally {
    await browser.close();
  }
});

test('sidebar footer and its divider remain pinned while sections collapse', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const footer = page.locator('[data-section-id="sidebar-footer"]');
    const sidebar = page.locator('[data-section-id="sidebar"]');
    const initialGeometry = await footer.evaluate((element) => {
      const footerBox = element.getBoundingClientRect();
      const sidebarBox = element.closest('[data-section-id="sidebar"]').getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        bottomGap: sidebarBox.bottom - footerBox.bottom,
        topBorderWidth: Number.parseFloat(style.borderTopWidth),
        width: footerBox.width,
      };
    });
    assert.ok(initialGeometry.bottomGap <= 17);
    assert.equal(initialGeometry.topBorderWidth, 1);

    await page.locator('[data-section-id="task-section-toggle"]').click();
    await page.locator('[data-section-id="workflow-section-toggle"]').click();
    await page.locator('[data-section-id="analysis-section-toggle"]').click();
    const collapsedGeometry = await Promise.all([
      footer.boundingBox(),
      sidebar.boundingBox(),
    ]);
    assert.ok(collapsedGeometry[0]);
    assert.ok(collapsedGeometry[1]);
    assert.ok(Math.abs((collapsedGeometry[1].y + collapsedGeometry[1].height - collapsedGeometry[0].y - collapsedGeometry[0].height) - initialGeometry.bottomGap) <= 1);
    assert.equal(await footer.locator('[data-section-id="host-settings"]').count(), 1);
  } finally {
    await browser.close();
  }
});

test('sidebar search and view options stay compact while controlling the task list', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(`${documentUrl}?surface=plan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const searchAction = page.locator('[data-section-id="task-search-action"]');
    const searchInput = page.locator('[data-section-id="task-search-input"]');
    assert.equal(await searchAction.getAttribute('aria-expanded'), 'false');
    await searchAction.click();
    assert.equal(await searchAction.getAttribute('aria-expanded'), 'true');
    assert.equal(await searchInput.getAttribute('tabindex'), '0');
    assert.equal(await searchInput.evaluate((element) => document.activeElement === element), true);
    assert.equal(await page.locator('[data-section-id="task-section-label"]').isVisible(), false);
    assert.equal(await page.locator('[data-section-id="task-section-actions"]').isVisible(), false);
    const searchClear = page.locator('[data-section-id="task-search-clear"]');
    assert.equal(await searchClear.isVisible(), true);
    assert.equal(await searchClear.getAttribute('aria-label'), '关闭搜索');
    const searchSlotGeometry = await page.locator('[data-section-id="task-search-control"]').evaluate((element) => {
      const slot = element.getBoundingClientRect();
      const header = element.closest('[data-section-id="task-section-header"]').getBoundingClientRect();
      return {
        width: slot.width,
        topDelta: Math.abs(slot.top - header.top),
        bottomDelta: Math.abs(slot.bottom - header.bottom),
      };
    });
    assert.ok(searchSlotGeometry.width >= 220, 'expanded search must occupy the header row width');
    assert.ok(searchSlotGeometry.topDelta <= 1, 'expanded search must replace rather than follow the header row');
    assert.ok(searchSlotGeometry.bottomDelta <= 1, 'expanded search must replace rather than extend the header row');
    await searchInput.fill('插件');
    await searchClear.click();
    assert.equal(await searchAction.getAttribute('aria-expanded'), 'false');
    assert.equal(await searchInput.inputValue(), '');
    assert.equal(await page.locator('[data-section-id="task-section-label"]').isVisible(), true);
    assert.equal(await page.locator('[data-section-id="task-section-actions"]').isVisible(), true);

    await searchAction.click();
    await page.locator('[data-section-id="new-task-action"]').click();
    assert.equal(await searchAction.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('[data-section-id="task-section-label"]').isVisible(), true);

    const viewAction = page.locator('[data-section-id="task-view-options-action"]');
    const viewMenu = page.locator('[data-section-id="task-view-options-menu"]');
    assert.equal(await viewAction.getAttribute('aria-expanded'), 'false');
    await viewAction.click();
    assert.equal(await viewAction.getAttribute('aria-expanded'), 'true');
    await assert.doesNotReject(() => viewMenu.waitFor({ state: 'visible' }));
    assert.equal(await page.locator('[data-section-id="task-sort-created"]').isChecked(), true);
    assert.equal(await page.locator('[data-section-id="task-filter-all"]').isChecked(), true);
    assert.deepEqual(
      await page.locator('[data-section-id="task-list"] [data-task-row]').evaluateAll((rows) => rows.map((row) => row.dataset.taskId)),
      ['task-market-release', 'task-ui-workbench', 'task-plugin-preflight', 'task-plugin-research'],
    );

    await page.locator('[data-section-id="task-sort-activity"]').check();
    assert.deepEqual(
      await page.locator('[data-section-id="task-list"] [data-task-row]').evaluateAll((rows) => rows.map((row) => row.dataset.taskId)),
      ['task-ui-workbench', 'task-market-release', 'task-plugin-preflight', 'task-plugin-research'],
    );

    await page.locator('[data-section-id="task-filter-active"]').check();
    assert.equal(await page.locator('[data-section-id="task-running"]').isVisible(), true);
    assert.equal(await page.locator('[data-section-id="task-current"]').isVisible(), true);
    assert.equal(await page.locator('[data-section-id="task-failed"]').isVisible(), true);
    assert.equal(await page.locator('[data-section-id="task-complete"]').isVisible(), false);

    await page.locator('[data-section-id="task-filter-all"]').check();
    const taskTitle = page.locator('[data-section-id="task-current-title"]');
    const titleStyle = await taskTitle.evaluate((element) => {
      const style = getComputedStyle(element);
      return { whiteSpace: style.whiteSpace, overflow: style.overflow, textOverflow: style.textOverflow };
    });
    assert.equal(titleStyle.whiteSpace, 'nowrap');
    assert.equal(titleStyle.overflow, 'hidden');
    assert.equal(titleStyle.textOverflow, 'ellipsis');

    await searchAction.click();
    await searchInput.fill('兼容性预检');
    assert.equal(await page.locator('[data-section-id="task-failed"]').isVisible(), true);
    assert.equal(await page.locator('[data-section-id="task-current"]').isVisible(), false);
    assert.equal(await page.locator('[data-section-id="task-complete"]').isVisible(), false);
    const taskListStyle = await page.locator('[data-section-id="task-list"]').evaluate((element) => ({
      overflowY: getComputedStyle(element).overflowY,
      finalItem: element.lastElementChild?.getAttribute('data-section-id'),
    }));
    assert.equal(taskListStyle.overflowY, 'auto');
    assert.equal(taskListStyle.finalItem, 'all-tasks-action');
  } finally {
    await browser.close();
  }
});

test('gate surface anchors one pending decision and projects its control effect', async () => {
  const html = await readFile(new URL('./crystra-task-work-v7.html', import.meta.url), 'utf8');

  for (const sectionId of [
    'gate-queue-toggle',
    'gate-decision-queue',
    'gate-decision-question',
    'gate-trigger-context',
    'gate-location-context',
    'gate-relevant-decisions',
    'gate-current-interpretation',
    'gate-understanding-delta',
    'gate-execution-preview',
    'gate-evidence',
  ]) {
    assert.match(html, new RegExp(`data-section-id="${sectionId}"`));
  }

  assert.match(html, /等待明确确认/);
  assert.match(html, /确认后将执行/);
  assert.match(html, /第 3 次失败 Trace/);
  assert.doesNotMatch(html, /data-section-id="gate-claims"/);
  assert.doesNotMatch(html, /验证覆盖率/);
  assert.doesNotMatch(html, /未解决矛盾/);
});

test('gate queue switches every decision-scoped projection together', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    await page.goto(`${documentUrl}?surface=gate`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const queue = page.locator('[data-section-id="gate-decision-queue"]');
    await page.locator('[data-section-id="gate-queue-toggle"]').click();
    await assert.doesNotReject(() => queue.waitFor({ state: 'visible' }));
    await page.locator('[data-section-id="gate-queue-item-g5"]').click();
    await assert.doesNotReject(() => queue.waitFor({ state: 'hidden' }));

    await assert.doesNotReject(() =>
      page.locator('[data-section-id="gate-decision-question-title"]')
        .getByText('是否接受发布说明覆盖率低于计划目标？')
        .waitFor(),
    );
    assert.equal(
      await page.locator('[data-section-id="gate-queue-position"]').textContent(),
      '2 / 3',
    );
    await assert.doesNotReject(() =>
      page.locator('[data-section-id="gate-current-interpretation-copy"]')
        .getByText(/保留当前发布说明/)
        .waitFor(),
    );
    await assert.doesNotReject(() =>
      page.locator('[data-section-id="gate-evidence-trigger-title"]')
        .getByText('覆盖率缺口报告')
        .waitFor(),
    );
    assert.match(
      await page.locator('[data-section-id="composer-reply-subject-copy"]').textContent(),
      /G-5/,
    );
  } finally {
    await browser.close();
  }
});

test('gate evidence links resolve to plan, analysis, and context inspection targets', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;
    await page.goto(`${documentUrl}?surface=gate&gate_id=g3`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const planHref = await page.locator('[data-section-id="gate-evidence-plan-context"]').getAttribute('href');
    assert.match(planHref, /surface=plan/);
    assert.match(planHref, /plan_anchor=wave-2/);
    assert.match(planHref, /from_gate_id=G-3/);

    const traceHref = await page.locator('[data-section-id="gate-evidence-trigger-record"]').getAttribute('href');
    assert.match(traceHref, /crystra-analysis-audit-v7\.html/);
    assert.match(traceHref, /attempt=3/);
    assert.match(traceHref, /span_id=build-sign/);
    assert.match(traceHref, /from_gate_id=G-3/);

    const planPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await planPage.goto(new URL(planHref, documentUrl).href, { waitUntil: 'domcontentloaded' });
    await planPage.waitForTimeout(2500);
    await assert.doesNotReject(() =>
      planPage.locator('[data-section-id="plan-document-viewer"]').waitFor({ state: 'visible' }),
    );
    assert.match(
      await planPage.locator('[data-section-id="plan-linked-gate-copy"]').textContent(),
      /G-3.*wave-2/,
    );

    const analysisPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await analysisPage.goto(new URL(traceHref, documentUrl).href, { waitUntil: 'domcontentloaded' });
    await analysisPage.waitForTimeout(2500);
    await assert.doesNotReject(() =>
      analysisPage.locator('[data-section-id="analysis-linked-gate-context"]')
        .waitFor({ state: 'visible' }),
    );
    assert.match(
      await analysisPage.locator('[data-section-id="analysis-linked-gate-focus"]').textContent(),
      /attempt 3.*span build-sign.*event signature-validation-failed/,
    );
    assert.match(
      await analysisPage.locator('[data-section-id="analysis-linked-gate-return"]').getAttribute('href'),
      /gate_id=g3/,
    );

    await page.locator('[data-section-id="gate-evidence-proposed-change"]').click();
    await assert.doesNotReject(() =>
      page.locator('[data-section-id="gate-context-inspector"]').waitFor({ state: 'visible' }),
    );
    await assert.doesNotReject(() =>
      page.locator('[data-section-id="gate-context-title"]')
        .getByText('签名配置差异')
        .waitFor(),
    );
    await page.locator('[data-section-id="gate-context-back"]').click();
    await assert.doesNotReject(() =>
      page.locator('[data-section-id="gate-main-view"]').waitFor({ state: 'visible' }),
    );
    assert.match(page.url(), /gate_id=g3/);
  } finally {
    await browser.close();
  }
});

test('control workspace right edge aligns with task execution summary', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    await page.goto(documentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const summaryBox = await page
      .locator('[data-section-id="task-execution-summary"]')
      .boundingBox();
    const controlBox = await page
      .locator('[data-section-id="control-workspace"]')
      .boundingBox();

    assert.ok(summaryBox, 'task execution summary must be visible');
    assert.ok(controlBox, 'control workspace must be visible');

    const summaryRight = summaryBox.x + summaryBox.width;
    const controlRight = controlBox.x + controlBox.width;

    assert.ok(
      Math.abs(summaryRight - controlRight) <= 1,
      `right edges differ: summary=${summaryRight}, control=${controlRight}`,
    );
  } finally {
    await browser.close();
  }
});

test('full plan document temporarily replaces the plan summary', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    await page.goto(`${documentUrl}?surface=plan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const summary = page.locator('[data-section-id="plan-summary"]');
    const viewer = page.locator('[data-section-id="plan-document-viewer"]');
    const openDocument = page.locator('[data-section-id="plan-document-entry"]');
    const backToSummary = page.locator('[data-section-id="plan-document-back"]');

    await assert.doesNotReject(() =>
      page
        .locator('[data-section-id="plan-overview"] [data-section-id="plan-document-entry"]')
        .waitFor({ state: 'visible' }),
    );

    await assert.doesNotReject(() => summary.waitFor({ state: 'visible' }));
    await assert.doesNotReject(() => viewer.waitFor({ state: 'hidden' }));

    await openDocument.click();
    await assert.doesNotReject(() => summary.waitFor({ state: 'hidden' }));
    await assert.doesNotReject(() => viewer.waitFor({ state: 'visible' }));

    await backToSummary.click();
    await assert.doesNotReject(() => summary.waitFor({ state: 'visible' }));
    await assert.doesNotReject(() => viewer.waitFor({ state: 'hidden' }));
  } finally {
    await browser.close();
  }
});

test('DAG summary opens a navigable full-plan DAG chapter', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    await page.goto(`${documentUrl}?surface=plan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    await page.locator('[data-section-id="plan-dag-entry"]').click();

    await assert.doesNotReject(() =>
      page.locator('[data-section-id="plan-full-dag"]')
        .waitFor({ state: 'visible' }),
    );
    await assert.doesNotReject(() =>
      page.locator('[data-section-id="plan-document-page"]')
        .waitFor({ state: 'hidden' }),
    );

    for (const sectionId of [
      'plan-dag-toolbar',
      'plan-dag-search',
      'plan-dag-zoom-in',
      'plan-dag-zoom-out',
      'plan-dag-fit-view',
      'plan-dag-collapse-branches',
      'plan-dag-viewport',
      'plan-dag-canvas',
      'plan-dag-minimap',
      'plan-dag-node-details',
    ]) {
      await assert.doesNotReject(() =>
        page.locator(`[data-section-id="${sectionId}"]`).waitFor({ state: 'visible' }),
      );
    }

    const canvas = page.locator('[data-section-id="plan-dag-canvas"]');
    const scaleBefore = await canvas.getAttribute('data-scale');
    await page.locator('[data-section-id="plan-dag-zoom-in"]').click();
    const scaleAfter = await canvas.getAttribute('data-scale');
    assert.notEqual(scaleAfter, scaleBefore, 'zoom control must update the DAG scale');

    const transformBefore = await canvas.evaluate((element) => element.style.transform);
    const viewport = page.locator('[data-section-id="plan-dag-viewport"]');
    const box = await viewport.boundingBox();
    assert.ok(box, 'DAG viewport must be visible for panning');
    await page.mouse.move(box.x + 220, box.y + 220);
    await page.mouse.down();
    await page.mouse.move(box.x + 270, box.y + 250);
    await page.mouse.up();
    const transformAfter = await canvas.evaluate((element) => element.style.transform);
    assert.notEqual(transformAfter, transformBefore, 'dragging must pan the DAG canvas');
  } finally {
    await browser.close();
  }
});

test('execution surface is a workflow-aware dashboard with optional flow particles', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1600, height: 1000 },
      reducedMotion: 'no-preference',
    });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value) => { window.__copiedWaveIdentity = value; },
        },
      });
    });
    const documentUrl = pathToFileURL(
      new URL('./crystra-task-work-v7.html', import.meta.url).pathname,
    ).href;

    await page.goto(`${documentUrl}?surface=execution`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const planRunOverview = page.locator('[data-section-id="execution-plan-run-overview"]');
    const waveRunDetail = page.locator('[data-section-id="execution-wave-run-detail"]');
    const dashboard = page.locator('[data-section-id="execution-dashboard"]');
    const runMap = page.locator('[data-section-id="execution-workflow-run-map"]');
    const particles = page.locator('[data-section-id="execution-flow-particles"]');
    const effectsToggle = page.locator('[data-section-id="execution-effects-toggle"]');

    await assert.doesNotReject(() => planRunOverview.waitFor({ state: 'visible' }));
    assert.equal(await planRunOverview.getAttribute('data-plan-run-id'), 'plan-v4/run-08');
    assert.equal(await waveRunDetail.isHidden(), true);
    await page.locator('[data-section-id="execution-plan-wave-1b"]').click();
    await assert.doesNotReject(() => waveRunDetail.waitFor({ state: 'visible' }));
    assert.equal(await planRunOverview.isHidden(), true);
    await assert.doesNotReject(() => dashboard.waitFor({ state: 'visible' }));
    const waveMetadata = page.locator('[data-section-id="execution-wave-run-metadata"]');
    assert.equal(await waveMetadata.count(), 1);
    assert.equal(await waveMetadata.isHidden(), true);
    const metadataToggle = page.locator('[data-section-id="execution-wave-run-metadata-toggle"]');
    const metadataChevron = page.locator('[data-section-id="execution-wave-run-metadata-chevron"]');
    assert.equal(await metadataToggle.getAttribute('aria-expanded'), 'false');
    assert.equal((await metadataToggle.textContent()).trim(), '运行身份');
    assert.equal(await metadataChevron.count(), 1);
    const collapsedToggleBox = await metadataToggle.boundingBox();
    const chevronBox = await metadataChevron.boundingBox();
    assert.equal(Math.round(chevronBox.width), 14);
    assert.equal(Math.round(chevronBox.height), 14);
    await metadataToggle.click();
    await assert.doesNotReject(() => waveMetadata.waitFor({ state: 'visible' }));
    assert.equal(await metadataToggle.getAttribute('aria-expanded'), 'true');
    const expandedToggleBox = await metadataToggle.boundingBox();
    assert.ok(Math.abs(expandedToggleBox.width - collapsedToggleBox.width) < 0.1);
    assert.notEqual(
      await metadataChevron.evaluate((element) => getComputedStyle(element).transform),
      'none',
    );
    assert.equal(await waveMetadata.getAttribute('data-plan-run-id'), 'plan-v4/run-08');
    assert.equal(await waveMetadata.getAttribute('data-wave-id'), 'wave-1b');
    assert.equal(await waveMetadata.getAttribute('data-workflow-id'), 'build-sign@v3');
    assert.equal(await waveMetadata.getAttribute('data-workflow-run-id'), 'workflow-v3/run-08');
    assert.equal(await waveMetadata.getAttribute('data-trace-root-id'), 'trace-7f42a');
    for (const metadataField of [
      'execution-wave-metadata-plan-run',
      'execution-wave-metadata-wave',
      'execution-wave-metadata-workflow',
      'execution-wave-metadata-run',
      'execution-wave-metadata-trace-root',
    ]) {
      assert.equal(await page.locator(`[data-section-id="${metadataField}"]`).count(), 1);
    }
    assert.equal(await page.locator('[data-section-id="execution-wave-metadata-attempt"]').count(), 0);
    assert.equal(await page.locator('[data-section-id="execution-wave-run-copy"]').count(), 0);
    for (const [copySection, copiedValue] of [
      ['execution-wave-copy-plan-run', 'plan-v4/run-08'],
      ['execution-wave-copy-wave', 'wave-1b'],
      ['execution-wave-copy-workflow', 'build-sign@v3'],
      ['execution-wave-copy-run', 'workflow-v3/run-08'],
      ['execution-wave-copy-trace-root', 'trace-7f42a'],
    ]) {
      const copyButton = page.locator(`[data-section-id="${copySection}"]`);
      assert.equal(await copyButton.locator('svg').count(), 1);
      const copyButtonBox = await copyButton.boundingBox();
      assert.equal(Math.round(copyButtonBox.width), 30);
      assert.equal(Math.round(copyButtonBox.height), 30);
      await copyButton.click();
      assert.equal(await page.evaluate(() => window.__copiedWaveIdentity), copiedValue);
    }
    assert.equal(await page.locator('[data-wave-copy-value]').count(), 5);
    const analysisHref = await page
      .locator('[data-section-id="execution-wave-run-analysis-link"]')
      .getAttribute('href');
    const analysisTarget = new URL(analysisHref, documentUrl);
    assert.match(analysisTarget.pathname, /crystra-analysis-audit-v7\.html$/);
    assert.equal(analysisTarget.searchParams.get('plan_run_id'), 'plan-v4/run-08');
    assert.equal(analysisTarget.searchParams.get('wave_id'), 'wave-1b');
    assert.equal(analysisTarget.searchParams.get('workflow_run_id'), 'workflow-v3/run-08');
    assert.equal(analysisTarget.searchParams.get('trace_root_id'), 'trace-7f42a');
    await metadataToggle.click();
    assert.equal(await waveMetadata.isHidden(), true);
    assert.equal(await metadataToggle.getAttribute('aria-expanded'), 'false');
    assert.match(
      await page.locator('[data-section-id="execution-level-breadcrumb"]').textContent(),
      /计划执行.*批次 1B.*工作流运行/s,
    );
    await assert.doesNotReject(() => runMap.waitFor({ state: 'visible' }));
    await assert.doesNotReject(() =>
      page.locator('[data-section-id="execution-current-node"]').waitFor({ state: 'visible' }),
    );
    assert.equal(await runMap.getAttribute('data-workflow-run-id'), 'workflow-v3/run-08');
    assert.equal(await page.locator('[data-section-id="execution-attention-policy"]').count(), 0);
    const nonOrthogonalPaths = await page
      .locator('[data-section-id="execution-run-map-canvas"] path')
      .evaluateAll((paths) => paths
        .map((path) => path.getAttribute('d') ?? '')
        .filter((commands) => /[ACQST]/i.test(commands)));
    assert.deepEqual(
      nonOrthogonalPaths,
      [],
      'execution activity map must use straight or 90-degree orthogonal paths only',
    );

    for (const sectionId of [
      'execution-legend-failed',
      'execution-legend-paused',
      'execution-edge-success',
      'execution-edge-running',
      'execution-edge-degraded',
      'execution-edge-failed',
      'execution-edge-paused',
      'execution-loop-control',
      'execution-loop-decision',
      'execution-loop-return',
      'execution-observability-slots',
      'execution-speed-signal',
      'execution-error-signal',
    ]) {
      assert.equal(
        await page.locator(`[data-section-id="${sectionId}"]`).count(),
        1,
        `${sectionId} must exist exactly once`,
      );
    }

    const fastSweep = page.locator('[data-section-id="execution-running-sweep"]');
    const slowSweep = page.locator('[data-section-id="execution-degraded-sweep"]');
    assert.match(
      await fastSweep.evaluate((element) => getComputedStyle(element).animationName),
      /execution-edge-sweep/,
    );
    assert.match(
      await slowSweep.evaluate((element) => getComputedStyle(element).animationName),
      /execution-edge-sweep/,
    );
    assert.notEqual(
      await fastSweep.evaluate((element) => getComputedStyle(element).animationDuration),
      await slowSweep.evaluate((element) => getComputedStyle(element).animationDuration),
      'degraded execution must move at a different pace from normal execution',
    );
    assert.equal(await runMap.getAttribute('data-runtime-pace'), 'slow');
    await page.locator('[data-section-id="execution-speed-signal"]').click();
    assert.equal(await runMap.getAttribute('data-runtime-pace'), 'fast');

    assert.equal(await effectsToggle.getAttribute('aria-pressed'), 'true');
    assert.equal(await runMap.getAttribute('data-effects'), 'on');
    assert.notEqual(
      await particles.evaluate((element) => getComputedStyle(element).display),
      'none',
    );

    await effectsToggle.click();
    assert.equal(await effectsToggle.getAttribute('aria-pressed'), 'false');
    assert.equal(await runMap.getAttribute('data-effects'), 'off');
    assert.equal(
      await particles.evaluate((element) => getComputedStyle(element).display),
      'none',
    );

    await effectsToggle.click();
    assert.equal(await effectsToggle.getAttribute('aria-pressed'), 'true');
    assert.notEqual(
      await particles.evaluate((element) => getComputedStyle(element).display),
      'none',
    );

    await page.locator('[data-section-id="execution-wave-run-back"]').click();
    await assert.doesNotReject(() => planRunOverview.waitFor({ state: 'visible' }));
    assert.equal(await waveRunDetail.isHidden(), true);
  } finally {
    await browser.close();
  }
});

test('analysis deep link focuses the exact wave run identity', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    const analysisUrl = pathToFileURL(
      new URL('./crystra-analysis-audit-v7.html', import.meta.url).pathname,
    );
    analysisUrl.searchParams.set('plan_run_id', 'plan-v4/run-08');
    analysisUrl.searchParams.set('wave_id', 'wave-1b');
    analysisUrl.searchParams.set('workflow_run_id', 'workflow-v3/run-08');
    analysisUrl.searchParams.set('trace_root_id', 'trace-7f42a');

    await page.goto(analysisUrl.href, { waitUntil: 'domcontentloaded' });
    const linkedContext = page.locator('[data-section-id="analysis-linked-wave-context"]');
    await assert.doesNotReject(() => linkedContext.waitFor({ state: 'visible' }));
    assert.equal(await linkedContext.getAttribute('data-plan-run-id'), 'plan-v4/run-08');
    assert.equal(await linkedContext.getAttribute('data-wave-id'), 'wave-1b');
    assert.equal(await linkedContext.getAttribute('data-workflow-run-id'), 'workflow-v3/run-08');
    assert.equal(await linkedContext.getAttribute('data-trace-root-id'), 'trace-7f42a');
    assert.match(await linkedContext.textContent(), /wave-1b.*trace-7f42a/s);
  } finally {
    await browser.close();
  }
});
