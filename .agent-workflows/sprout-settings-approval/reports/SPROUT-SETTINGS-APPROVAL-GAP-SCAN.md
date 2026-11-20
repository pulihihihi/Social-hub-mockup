# Sprout Settings Approval Workflows Gap Scan

## Scan Method

The source was captured at 1920x900 for the parent settings page, after clicking `Create New Workflow`, after the tenant had one workflow row, and after clicking the row `Edit` action. The local target was captured at 1920x900 and 390x844 for the populated parent page and opened workflow builder.

The local clone skill was updated before this batch so safe CTA/template/detail buttons are mandatory capture scope.

## Source Evidence

- Baseline URL: `https://app.sproutsocial.com/settings/approval/`
- Baseline screenshot: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-baseline.png`
- Populated screenshot: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-populated.png`
- Builder screenshot: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-create-workflow.png`
- Edit builder screenshot: `.agent-workflows/sprout-settings-approval/source/screenshots/settings-approval-edit-workflow.png`
- Builder DOM text: `.agent-workflows/sprout-settings-approval/source/dom/settings-approval-create-workflow.txt`

## Target Evidence

- Target URL: `http://localhost:5173/settings/approval-workflows`
- Baseline screenshot: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-baseline.png`
- Populated screenshot: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-populated.png`
- Builder screenshot: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-builder.png`
- Edit builder screenshot: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-edit-workflow.png`
- Mobile builder screenshot: `.agent-workflows/sprout-settings-approval/target/screenshots/target-settings-approval-builder-mobile.png`

## Findings

| Severity | Area | Source Behavior | Target Behavior | Action |
|---|---|---|---|---|
| Low | Settings shell | Sprout uses a dense settings secondary rail with many groups. | Social Hub uses the existing Settings sidebar and adds `Approval Workflows`. | Accepted local shell adaptation. |
| Low | Data persistence | Sprout workflow save writes to account settings. | Target builder is local UI state and disabled until name + approver exist. | Wire to backend/store when workflow persistence exists. |
| Match | Existing workflow list | Source tenant shows row `testt`, `5 May 2026`, `0`, `1`, action icons, enabled switch. | Target renders the same populated row and local action controls. | Keep mock until persistence exists. |
| Match | Edit workflow builder | Source row edit opens `Edit Approval Workflow` with `testt`, `Step 1 - test`, `Hai-Son Tran`, enabled Save. | Target edit opens the same full-screen builder with prefilled mock data. | Implemented. |

## Interaction Coverage

| Control | Source Evidence | Target Evidence | Status |
|---|---|---|---|
| Create New Workflow | Clicked and captured full-screen builder. | Opens full-screen builder. | Implemented. |
| Edit workflow | Clicked and captured full-screen edit builder. | Opens full-screen edit builder prefilled from row. | Implemented. |
| Duplicate workflow | Visible source icon. | Adds a local copied row. | Implemented local behavior. |
| Delete workflow | Visible source icon. | Removes the local row. | Implemented local behavior. |
| Enabled switch | Source row switch is on. | Target switch is on and toggles local state. | Implemented local behavior. |
| Go to Needs Approval | Visible source action. | Routes to `/publishing/needs-approval`. | Implemented. |
| Workflow Name | Input with remaining count and disabled Save. | Implemented. | Implemented. |
| Step 1 Name | Input `Step 1` with remaining count. | Implemented. | Implemented. |
| Approver(s) | Empty approver input supporting existing/external approvers. | Implemented with tags select and mock team members. | Implemented. |
| Approval requirement | `Any` selector. | `Any`/`All` selector. | Implemented. |
| Add Another Step | Adds additional workflow step. | Implemented dynamic steps. | Implemented. |
| Workflow settings | Skip-step toggle and explanatory copy. | Implemented. | Implemented. |
| esc/back/close | Builder has `esc to go back` and close icon. | Escape and close icon dismiss builder. | Implemented. |

## Remaining Unknowns

- Save success state and persistence require an API/store. Current row and actions are local UI state.
