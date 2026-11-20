# Social Hub Delivery Agent Workflow

This file is the entrypoint for long-running Codex delivery sessions on Social Hub.

Use it when Hai-Son asks Codex to work as a delivery agent, continue the project, fix the next batch, clone another Sprout surface, or run a longer autonomous session.

## Read Order

1. `AGENTS.md` for local guardrails and non-negotiable contracts.
2. `README.md` for stack, commands, and project shape.
3. `DESIGN.md` and `LAYOUT-BLUEPRINT.md` for UI system and layout rules.
4. `.agent-workflows/delivery-agent/CURRENT-STATE.md` for the latest project truth.
5. `.agent-workflows/delivery-agent/TASK-QUEUE.md` for the next ready work.
6. The feature-specific folder under `.agent-workflows/` for source brief, target notes, QA, and gap reports.

If Hai-Son asks to run multiple Sprout parity lanes in parallel, also read:

```text
.agent-workflows/delivery-agent/PARALLEL-LANES.md
```

## Operating Loop

1. Continue the active P0 item from `TASK-QUEUE.md` if an `In Progress` section exists; otherwise pick one ready task.
2. Read the task's source brief, QA report, gap report, and changed code paths.
3. Make a small implementation plan with impacted areas.
4. Implement the smallest valuable batch.
5. Run focused tests first, then the broadest practical verification.
6. Use browser QA for visible UI changes and save artifacts under the feature workflow folder.
7. Update implementation notes, QA notes, gap report, and `CURRENT-STATE.md`.
8. Stop only when the batch is verified, a real blocker needs Hai-Son's decision, or the queue is exhausted.

## Exact Parity Loop

Use this stricter loop for Sprout clone surfaces where Hai-Son asks for smallest-detail parity, especially Publishing New Post:

1. Capture the live source first through CDP.
2. Click or hover every meaningful safe control: tabs, menus, popovers, upload sources, switches, disabled controls, tooltips, validation rows, right-panel controls, and footer split controls.
3. Write or update a source exploration report that marks each control as captured, partial, unknown, blocked, or out of scope.
4. Compare source evidence against the local target and write a gap report before code.
5. Fix only the next small batch from the gap report.
6. Run target QA with screenshots/metrics.
7. Update the gap report and queue, then repeat.

Do not treat contaminated or unscanned source states as matched. For New Post, the current gate is:

```text
.agent-workflows/sprout-new-post/reports/SH-NP-001-SOURCE-EXPLORATION.md
```

No New Post implementation batch may start while that report is still partial unless Hai-Son explicitly narrows the task.

## Parallel Lane Rule

Use this when New Post and another Sprout page, such as Calendar, Bots, or Smart Inbox, need to run at the same time.

- Each lane must have its own workflow folder, source reports, task queue, CDP port, and Chrome profile.
- A thread may only operate the CDP port/profile assigned to its lane.
- Do not share Sprout tabs across lanes.
- Do not write source artifacts into another lane's folder.
- If two lanes may touch shared implementation files, record that risk in the lane queue before editing and keep the batch small.
- Global New Post P0 priority does not block a separate Calendar, Bots, or Smart Inbox thread if Hai-Son explicitly starts that lane.

Current lane ownership is documented in:

```text
.agent-workflows/delivery-agent/PARALLEL-LANES.md
```

## Verification Ladder

Use the narrowest checks that prove the change, then widen before handoff.

```powershell
npm run lint
npm run check:imports
npm test
npm run build
npm run verify
```

For small UI patches, focused Vitest commands are acceptable during the loop, but the final handoff should state whether `npm run verify` passed or why it was not run.

## Browser QA Rule

Any visible UI work needs browser proof. Capture screenshots and, when layout risk exists, collect simple metrics for:

- page renders and is not blank;
- no unintended horizontal overflow at target viewport;
- primary controls open, close, and preserve state;
- Ant Design primitives render for buttons, dropdowns, menus, modals, tables, radios, switches, tabs, forms, and status icons;
- shared contracts such as `PublishingFilterBar` remain intact.

## Long Session Prompt

Use this prompt to start a longer Codex session:

```text
Act as the Social Hub delivery agent.

Read AGENTS.md, README.md, DELIVERY-WORKFLOW.md, DESIGN.md, LAYOUT-BLUEPRINT.md,
.agent-workflows/delivery-agent/CURRENT-STATE.md, and
.agent-workflows/delivery-agent/TASK-QUEUE.md.

Continue any P0 In Progress task first; otherwise choose the highest-priority ready task, then run the delivery loop:
plan a small batch, implement it, verify with tests/build/browser QA as appropriate,
update workflow docs/artifacts, and continue to the next ready batch until the goal is done
or a real blocker needs my decision.

Keep scope tight, do not refactor unrelated files, do not revert user changes,
and record proof of what passed.
```

## Parallel Lane Prompts

Use the lane-specific prompts in `.agent-workflows/delivery-agent/PARALLEL-LANES.md` when Hai-Son wants Calendar, Bots, or Smart Inbox to run alongside New Post.

Calendar quick prompt:

```text
Act as the Social Hub Calendar delivery agent.

Read AGENTS.md, README.md, DELIVERY-WORKFLOW.md, DESIGN.md, LAYOUT-BLUEPRINT.md,
.agent-workflows/delivery-agent/CURRENT-STATE.md,
.agent-workflows/delivery-agent/TASK-QUEUE.md,
.agent-workflows/delivery-agent/PARALLEL-LANES.md,
and .agent-workflows/sprout-calendar/TASK-QUEUE.md.

Use only the Calendar CDP lane: port 9227 and profile C:\ChromeDebugSproutCalendar9227.
Do not operate the New Post CDP port 9226 or any New Post tab.

Continue SC-CAL-001 through the exact-parity loop: source capture, source exploration
report, source-target gap report, then one small fix batch. Do not publish, schedule,
send, delete, disconnect, or confirm real actions. Close every fresh CDP tab after
each capture pass.
```

## Definition Of Done

A delivery batch is done when:

- the implemented behavior matches the selected source brief or accepted local product contract;
- relevant tests/build checks pass or any failure is documented as pre-existing/out of scope;
- visible UI changes have browser screenshots or metrics saved in the feature workflow folder;
- `IMPLEMENTATION-NOTES.md`, `QA-REPORT.md`, and gap report are updated when that feature folder has those files;
- `.agent-workflows/delivery-agent/CURRENT-STATE.md` records the latest status and next handoff.
