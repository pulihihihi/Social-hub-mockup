# Settings Approval Workflows Target QA

Target URL: `http://localhost:5173/settings/approval-workflows`

## Commands

- `npm run build` passed.
- `npm test -- tests/routes.test.js tests/sidebar-menu.test.js` passed.
- `npm test -- tests/routed-pages-migration.test.jsx -t "settings/approval-workflows"` passed.
- Re-ran the same checks after adding populated workflow row behavior.

## Browser Captures

- Source baseline: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-baseline.png`
- Source populated row: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-populated.png`
- Source builder: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-create-workflow.png`
- Source edit builder: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-edit-workflow.png`
- Target baseline: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-baseline.png`
- Target populated row: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-populated.png`
- Target mobile: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-mobile.png`
- Target builder: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-builder.png`
- Target edit builder: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-edit-workflow.png`
- Target populated mobile: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-populated-mobile.png`
- Target builder mobile: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-builder-mobile.png`

## Results

- Settings route renders and is reachable from `Settings > Approval Workflows`.
- Parent settings page matches source structure: info banner, workflow card, current group label, description, actions, and populated workflow table.
- Workflow row renders `testt`, `5 May 2026`, `0` external approvers, `1` step, default star, edit/duplicate/delete icons, and enabled switch.
- `Go to Needs Approval` routes to `/publishing/needs-approval`.
- `Create New Workflow` opens full-screen workflow builder.
- `Edit testt` opens full-screen workflow builder with name `testt`, step `Step 1 - test`, approver `Hai-Son Tran`, active Save, Any/All requirement select, settings toggle, close button, and Escape close behavior.
- Duplicate, delete, default star, and enabled switch update the local mock row state.
- 1920x900 baseline and builder captures show no horizontal overflow.
- 390x844 baseline and builder captures show no horizontal overflow.

## Notes

- The local app uses Social Hub's existing Settings sidebar rather than Sprout's global settings rail.
- Workflow data is local UI state only; no persistence/API integration exists yet.
