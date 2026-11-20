# Publishing Needs Approval Target QA

Target URL: `http://localhost:5173/publishing/needs-approval`

## Commands

- `npm run build` passed.
- `npm test -- tests/routes.test.js tests/sidebar-menu.test.js` passed.
- `npm test -- tests/routed-pages-migration.test.jsx -t "publishing/needs-approval"` passed.
- Re-ran the same checks after updating the after-workflow empty state.

## Browser Captures

- Source baseline: `.agent-workflows/sprout-needs-approval/source/screenshots/needs-approval-baseline.png`
- Source after workflow: `.agent-workflows/sprout-needs-approval/source/screenshots/needs-approval-after-workflow.png`
- Target baseline 1920x900: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-baseline.png`
- Target after workflow 1920x900: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-after-workflow.png`
- Target after workflow mobile 390x844: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-after-workflow-mobile.png`
- Target workflow builder 1920x900: `.agent-workflows/sprout-needs-approval/target/screenshots/target-workflow-builder-baseline.png`
- Target workflow builder mobile 390x844: `.agent-workflows/sprout-needs-approval/target/screenshots/target-workflow-builder-mobile.png`
- Target 1366x768: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-desktop-1366.png`
- Target mobile 390x844: `.agent-workflows/sprout-needs-approval/target/screenshots/target-needs-approval-mobile.png`
- Target interactive scan: `.agent-workflows/sprout-needs-approval/target/interactive-scan`

## Results

- 1920x900 and 1366x768 target captures show no horizontal overflow.
- 390x844 target capture shows no horizontal overflow after wrapping header actions and constraining empty-state text.
- 390x844 workflow builder capture shows no horizontal overflow.
- Route renders inside the app shell and sidebar highlights `Needs Approval` under `Publishing`.
- Header actions, filter toggle, filter bar, disabled `Clear All`, workflow illustration, and simple after-workflow empty message are present.
- After-workflow empty state now shows `No posts need approval based on the filters you have selected.` and no longer shows onboarding copy/template buttons.
- Workflow builder includes name input with remaining character count, disabled Save state, step card, approver selector, approval requirement selector, add-step action, skip-step settings toggle, `esc to go back`, and close button.

## Notes

- The local app shell differs from Sprout's source shell, so the clone adapts to Social Hub navigation while keeping the page-level workflow.
- Filter dropdowns use stable mock data until a real approval workflow data source exists.
